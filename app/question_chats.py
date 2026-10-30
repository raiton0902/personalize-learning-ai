import secrets
from starlette.concurrency import run_in_threadpool
import web_store as store
import web_tutor
from question_matching import similar_question, unclear_input, difficulty_question
from llm import ModelRequestError


class QuestionFeedback(Exception):
    def __init__(self, payload):
        self.payload=payload


def messages(thread):
    if 'messages' not in thread:
        thread['messages'] = [{'role':'user','content':thread['question']},
                              {'role':'assistant','content':thread['answer']}]
    return thread['messages']


async def respond(owner, cid, state, revision, data):
    action = data['action']
    thread = next((q for q in state.get('followups', []) if q['id'] == data.get('thread_id')), None)
    if action != 'question' and not thread:
        raise ValueError('This question chat was not found in this learning.')
    if action == 'chat_reconsider':
        pending=thread.get('pending')
        if not pending or pending['id']!=data.get('pending_id') or not difficulty_question(pending['text']):
            raise ValueError('This question cannot be reconsidered here. Reload the chat.')
        data={**data,'action':'chat','text':pending['text'],'request_id':pending['id']}
        action='chat'
        thread.pop('pending')
    if action in {'chat_discard', 'chat_transfer'}:
        pending = thread.get('pending')
        if not pending or pending['id'] != data.get('pending_id'):
            raise ValueError('This topic decision is no longer pending. Reload the chat.')
        if action == 'chat_discard':
            thread.pop('pending')
            if not messages(thread):
                state['followups'].remove(thread)
            store.save_course(owner, cid, state, revision)
            return cid, state, thread['id'] if thread in state['followups'] else None
        profile = {**state['profile'], 'goal':pending['goal'], 'level':'', 'context':'', 'language':'automatic'}
        new = {'profile':profile, 'source':{'id':'general','title':'Learning goal','origin':'General model knowledge, unverified','text':pending['goal']},
               'resource_id':None, 'curriculum':None, 'version':1, 'approved_version':None,
               'objective_index':0, 'stage':'plan', 'observations':[], 'attempts':[], 'review':{}, 'review_history':[], 'created':store.now()}
        plan, metadata = await run_in_threadpool(web_tutor.propose, new)
        new.update(curriculum=plan, metadata=metadata)
        objective = plan['objectives'][0]
        new_thread = {'id':secrets.token_hex(10),'question':pending['text'],'answer':pending['answer'],
                      'objective_id':objective['id'],'objective_title':objective['title'],'created':store.now(),
                      'messages':[{'role':'user','content':pending['text']},{'role':'assistant','content':pending['answer']}]}
        new['followups'] = [new_thread]
        new['learning_signals'] = [{'kind':'requested_help','objective_id':objective['id'],
                                   'evidence':'Asked: '+pending['text'],'created':store.now()}]
        thread.pop('pending')
        if not messages(thread):
            state['followups'].remove(thread)
        new_cid = store.transfer_course(owner, cid, state, revision, new)
        return new_cid, new, new_thread['id']
    text = data.get('text', '')
    if not isinstance(text, str) or not text.strip() or len(text) > 1000:
        raise ValueError('Write a question of up to 1000 characters.')
    text = text.strip()
    if unclear_input(text):
        raise QuestionFeedback({'clarification':f'I couldn’t understand “{text}”. Could you rephrase it or tell me which part of this lesson you mean?'})
    objective_id=thread['objective_id'] if thread else state['curriculum']['objectives'][min(state['objective_index'],len(state['curriculum']['objectives'])-1)]['id']
    if action == 'question':
        objective = state['curriculum']['objectives'][min(state['objective_index'],len(state['curriculum']['objectives'])-1)]
        duplicate = next((q for q in state.get('followups', []) if q['question'].casefold() == text.casefold() and q['objective_id'] == objective['id']), None)
        if duplicate and not (duplicate.get('pending') and difficulty_question(text)):
            return cid, state, duplicate['id']
        thread = {'id':secrets.token_hex(10),'question':text,'answer':'','objective_id':objective['id'],
                  'objective_title':objective['title'],'created':store.now(),'messages':[]}
    log = messages(thread)
    if thread.get('pending'):
        raise ValueError('Choose Yes or No for the pending topic first.')
    # A stable client request ID makes retries after a lost response safe.
    request_id = data.get('request_id')
    if not isinstance(request_id, str) or not 1 <= len(request_id) <= 100:
        raise ValueError('A message request ID is required.')
    if any(m.get('request_id') == request_id for m in log):
        return cid, state, thread['id']
    if data.get('similar_choice')!='new':
        match=similar_question(state,text,objective_id)
        if match:
            raise QuestionFeedback({'similar_question':{'id':match['id'],'question':match['question']}})
    try:
        result, metadata = await run_in_threadpool(web_tutor.chat, state, text, thread)
    except ModelRequestError:
        raise QuestionFeedback({'service_error':f'I couldn’t get an AI reply for “{text}”. Please try again or rephrase it. Your saved chat is unchanged.'}) from None
    if result.get('clarify'):
        raise QuestionFeedback({'clarification':f'Did you mean something about this lesson by “{text}”? Please add a little more detail.'})
    if not result['related']:
        if not result['new_goal'].strip():
            raise ValueError('The new topic could not be identified. Please rephrase.')
        thread['pending'] = {'id':secrets.token_hex(12),'text':text,'goal':result['new_goal'], 'answer':result['answer']}
    else:
        log.extend([{'role':'user','content':text,'request_id':request_id}, {'role':'assistant','content':result['answer']}])
        if not thread['answer']:
            thread['answer'] = result['answer']
        state.setdefault('learning_signals', []).append({'kind':'requested_help','objective_id':thread['objective_id'],'evidence':'Asked: '+text,'created':store.now()})
    if action == 'question':
        state.setdefault('followups', []).append(thread)
    state['metadata'] = metadata
    store.save_course(owner, cid, state, revision)
    store.event(owner, cid, 'Asked about '+thread['objective_title'])
    return cid, state, thread['id']
