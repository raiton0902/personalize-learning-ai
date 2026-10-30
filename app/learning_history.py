import copy
import hashlib

FIELDS = (
    'lesson',
    'question',
    'attempt',
    'assessment',
    'repair',
    'exercise_instance',
    'assistance',
    'episode_observation',
    'repaired_in_objective',
    'active_review',
    'saved_before_review',
)


def clear_current(state):
    for field in FIELDS:
        state.pop(field, None)


def record(state):
    objectives = (state.get('curriculum') or {}).get('objectives', [])
    index = state.get('objective_index', 0)
    if not objectives or index >= len(objectives) or not state.get('lesson'):
        return
    objective = objectives[index]
    version = state.get('version', 1)
    key = f'{version}:{index}:{objective["id"]}'
    history = state.setdefault('lesson_history', [])
    entry = next((item for item in history if item['id'] == key), None)
    if not entry:
        entry = {
            'id': key,
            'version': version,
            'index': index,
            'objective_id': objective['id'],
            'module_id': objective.get('module_id', ''),
            'module_title': objective.get('module_title', ''),
            'title': objective['title'],
            'lesson': {},
            'practices': [],
        }
        history.append(entry)
    entry['lesson'] = copy.deepcopy(state['lesson'])
    if state.get('question') and not state.get('active_review'):
        instance = state.get('exercise_instance') or hashlib.sha256(str(state['question']).encode()).hexdigest()[:16]
        practice = next((p for p in entry['practices'] if p['id'] == instance), None)
        if practice is None:
            practice = {'id': instance}
            entry['practices'].append(practice)
        for field in ('question', 'attempt', 'assessment', 'repair', 'assistance', 'episode_observation'):
            if field != 'question' and state.get('stage') == 'attempt' and field != 'assistance':
                continue
            if state.get(field):
                practice[field] = copy.deepcopy(state[field])


def public_history(history):
    for lesson in history:
        for practice in lesson.get('practices', []):
            if practice.get('assessment', {}).get('status') != 'correct' and not practice.get('repair'):
                practice.get('question', {}).pop('answer', None)
                practice.get('question', {}).pop('solution', None)


def recover_notes(state, notes, cid):
    record(state)
    known = {
        '\n\n'.join([entry['lesson'].get('explanation', ''), '\n'.join(entry['lesson'].get('worked_example', []))]).strip()
        for entry in state.get('lesson_history', [])
    }
    for note in notes:
        if note.get('course_id') != cid or note.get('kind') != 'note' or note['text'].strip() in known:
            continue
        state.setdefault('lesson_history', []).append({
            'id': 'note:' + note['id'],
            'version': None,
            'index': -1,
            'title': note['title'],
            'recovered': True,
            'lesson': {'explanation': note['text'], 'worked_example': []},
            'practices': [],
        })
        known.add(note['text'].strip())


def compute_next_action(state):
    stage = state.get('stage', 'plan')
    objectives = (state.get('curriculum') or {}).get('objectives', [])
    idx = state.get('objective_index', 0)
    current_obj = objectives[min(idx, len(objectives) - 1)] if objectives else {}
    lesson_title = current_obj.get('title', 'current lesson')
    if state.get('active_review'):
        rev = state['active_review']
        return {
            'action': 'attempt' if stage == 'attempt' else 'review',
            'stage': stage,
            'label': rev.get('label') or f"Complete review for {rev.get('title', 'earlier concept')}",
        }
    if stage == 'intake':
        return {'action': 'intake', 'stage': 'intake', 'label': 'Provide or skip compact intake context to generate curriculum'}
    if stage == 'plan':
        return {'action': 'approve', 'stage': 'plan', 'label': 'Review and approve or revise the proposed curriculum'}
    if stage == 'ready':
        return {'action': 'teach', 'stage': 'ready', 'label': f'Open lesson: {lesson_title}'}
    if stage == 'lesson':
        if not current_obj.get('assessment_required', True):
            return {'action': 'practice_or_skip', 'stage': 'lesson', 'label': f'Start practice or skip optional check for {lesson_title}'}
        return {'action': 'practice', 'stage': 'lesson', 'label': f'Start practice check for {lesson_title}'}
    if stage == 'attempt':
        return {'action': 'attempt', 'stage': 'attempt', 'label': f'Submit answer to pending exercise in {lesson_title}'}
    if stage == 'diagnostic':
        return {'action': 'diagnostic', 'stage': 'diagnostic', 'label': f'Answer diagnostic step check in {lesson_title}'}
    if stage == 'repair':
        return {'action': 'practice', 'stage': 'repair', 'label': f'Try a changed practice exercise in {lesson_title}'}
    if stage == 'feedback':
        return {'action': 'next', 'stage': 'feedback', 'label': 'Move on to the next lesson'}
    if stage == 'complete':
        return {'action': 'complete', 'stage': 'complete', 'label': 'Course completed; review or export checkpoint'}
    return {'action': stage, 'stage': stage, 'label': f'Continue {lesson_title}'}


def normalize_course_state(state):
    if not isinstance(state, dict):
        return state
    import web_tutor
    old_schema = state.get('schema_version', 1)
    state['schema_version'] = 2
    if old_schema < 2:
        state.setdefault('migrated_from_schema', old_schema)
    profile = state.setdefault('profile', {})
    source = state.get('source') or {'id': 'general', 'title': 'Learning goal', 'origin': 'Unverified', 'text': profile.get('goal', '')}
    if isinstance(state.get('curriculum'), dict):
        state['curriculum'] = web_tutor.normalize_curriculum(state['curriculum'], source, profile, strict_validation=False)
    if isinstance(state.get('pending_revision'), dict) and isinstance(state['pending_revision'].get('curriculum'), dict):
        state['pending_revision']['curriculum'] = web_tutor.normalize_curriculum(
            state['pending_revision']['curriculum'], source, profile, strict_validation=False
        )

    if not isinstance(state.get('intake'), dict):
        existing_status = 'completed' if state.get('curriculum') else 'pending'
        state['intake'] = web_tutor.build_intake_state(profile, source, {'resource_id': state.get('resource_id')}, {'status': existing_status})
    else:
        state['intake'].setdefault('prior_knowledge', web_tutor.extract_prior_knowledge(profile))
        state['intake'].setdefault('known', {})
        state['intake'].setdefault('questions', [])
        state['intake'].setdefault('missing', [])
        state['intake'].setdefault('assumptions', [])
        state['intake'].setdefault('draft', {})

    state.setdefault('observations', [])
    state.setdefault('attempts', [])
    state.setdefault('review', {})
    state.setdefault('review_history', [])

    # Sync concept tracking map without overwriting existing mastery/review evidence
    concepts_map = state.setdefault('concepts', {})
    if isinstance(concepts_map, list):
        concepts_map = {c['id']: c for c in concepts_map if isinstance(c, dict) and c.get('id')}
        state['concepts'] = concepts_map

    plan = state.get('curriculum') or {}
    objectives = plan.get('objectives', [])
    modules = plan.get('modules', [])
    review_map = state.get('review') or {}

    for obj in objectives:
        oid = obj['id']
        rev_entry = review_map.get(oid, {})
        for c in obj.get('concepts', []):
            cid = c['id']
            existing_c = concepts_map.get(cid, {})
            concepts_map[cid] = {
                'id': cid,
                'objective_id': oid,
                'module_id': obj.get('module_id', ''),
                'title': c.get('title', obj['title']),
                'required': bool(c.get('required', True)),
                'taught': bool(existing_c.get('taught') or rev_entry.get('taught', False)),
                'status': rev_entry.get('status') or existing_c.get('status', 'unassessed'),
                'evidence': rev_entry.get('evidence') or existing_c.get('evidence', 'Not yet assessed'),
            }

    idx = max(0, int(state.get('objective_index', 0)))
    current_obj = objectives[min(idx, len(objectives) - 1)] if objectives else {}
    mod_id = current_obj.get('module_id', '')
    mod_idx = next((i for i, m in enumerate(modules) if m.get('id') == mod_id), 0) if modules else 0
    concepts_for_obj = current_obj.get('concepts', [])
    active_concept = concepts_for_obj[0] if concepts_for_obj else {}

    state['current_position'] = {
        'module_id': mod_id,
        'module_title': current_obj.get('module_title', ''),
        'module_index': mod_idx,
        'total_modules': len(modules),
        'lesson_id': current_obj.get('id', ''),
        'lesson_title': current_obj.get('title', ''),
        'lesson_index': idx,
        'total_lessons': len(objectives),
        'concept_id': active_concept.get('id', ''),
        'concept_title': active_concept.get('title', ''),
    }
    state['next_action'] = compute_next_action(state)
    state['teaching_adaptation'] = web_tutor.compute_teaching_adaptation(state)
    return state
