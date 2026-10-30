/* V01–V09 & U01–U20: Integrated step-repair and proposal-feedback runtime for app/web/ */
(function(){
  const $ = (sel, root = document) => (root || document).querySelector(sel);
  const $$ = (sel, root = document) => [...(root || document).querySelectorAll(sel)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const alertSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 10 18H2zM12 9v5m0 3v.1"/></svg>';
  const checkSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
  const closeSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  const folderSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7V5h6l2 2h10v12H3z"/></svg>';
  $('.personalize').innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2z"/></svg><span>Personalize</span>';
  const urgentGoal = text => /\b(?:cramm?ing|(?:exam|test|quiz)\s+(?:tomorrow|in\s+\d+\s+hours?))\b/i.test(text);
  const cramToggle = document.createElement('button');
  cramToggle.type = 'button'; cramToggle.id = 'cramming-toggle'; cramToggle.className = 'cramming-toggle';
  cramToggle.setAttribute('aria-pressed', 'false');
  cramToggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-9 12h7l-1 8 10-13h-7z"/></svg><span>Cramming</span>';
  $('.compose-wrap .secondary').append(cramToggle);
  function setCrammingMode(active, animate = false) {
    crammingMode = active;
    cramToggle.setAttribute('aria-pressed', String(active));
    document.body.classList.toggle('cramming-active', active);
    if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cramToggle.classList.remove('cram-activate');
      void cramToggle.offsetWidth;
      cramToggle.classList.add('cram-activate');
    }
  }
  cramToggle.onclick = () => setCrammingMode(!crammingMode, true);
  $('.goal').addEventListener('input', e => { if (urgentGoal(e.target.value) && !crammingMode) setCrammingMode(true, true); });

  function installPanelResizers() {
    const root = document.documentElement;
    const syncValues = () => $$('.panel-resizer').forEach(handle => {
      const panel = handle.parentElement;
      const actual = Math.round(panel.getBoundingClientRect().width);
      if (!actual) return;
      let maximum = Number(handle.dataset.maximum);
      if (panel.matches('.right-panel') && innerWidth > 1050) {
        const left = document.body.classList.contains('workspace-signed') ? (document.body.classList.contains('collapsed') ? 64 : 64 + $('.sidebar').getBoundingClientRect().width) : 0;
        maximum = Math.min(maximum, Math.max(240, innerWidth - left - 320));
      }
      handle.setAttribute('aria-valuemax', Math.round(maximum));
      handle.setAttribute('aria-valuenow', actual);
      handle.setAttribute('aria-valuetext', `${actual} pixels`);
    });
    const observer = new MutationObserver(syncValues);
    observer.observe(document.body, {attributes: true, attributeFilter: ['class']});
    for (const [selector, name, initial, min, max, direction, breakpoint, label] of [
      ['.sidebar', 'sidebar', 252, 180, 420, 1, 760, 'Resize learning history sidebar'],
      ['.right-panel', 'right-panel', 310, 240, 480, -1, 1050, 'Resize learning pattern panel']
    ]) {
      const panel = $(selector), key = `personal-learning-${name}-width`;
      const handle = document.createElement('div');
      handle.className = `panel-resizer ${name}-resizer`; handle.tabIndex = 0;
      handle.setAttribute('role', 'separator'); handle.setAttribute('aria-orientation', 'vertical');
      handle.setAttribute('aria-label', label); handle.setAttribute('aria-valuemin', min); handle.setAttribute('aria-valuemax', max);
      handle.dataset.maximum = max;
      panel.append(handle);
      observer.observe(panel, {attributes: true, attributeFilter: ['hidden']});
      let width = initial;
      try { const saved = Number(localStorage.getItem(key)); if (Number.isFinite(saved) && saved >= min && saved <= max) width = saved; } catch {}
      const apply = (value, persist = false) => {
        width = Math.max(min, Math.min(max, Math.round(value)));
        root.style.setProperty(`--${name}-width`, `${width}px`);
        handle.setAttribute('aria-valuenow', width);
        handle.setAttribute('aria-valuetext', `${width} pixels`);
        syncValues();
        if (persist) try { localStorage.setItem(key, width); } catch {}
      };
      apply(width);
      let drag = null;
      handle.onpointerdown = e => {
        if (e.button !== 0 || innerWidth <= breakpoint) return;
        e.preventDefault(); handle.focus({preventScroll: true});
        drag = {x: e.clientX, width: panel.getBoundingClientRect().width, id: e.pointerId};
        handle.setPointerCapture(e.pointerId); document.body.classList.add('is-resizing');
      };
      handle.onpointermove = e => { if (drag) apply(drag.width + (e.clientX - drag.x) * direction); };
      const finish = () => {
        if (!drag) return;
        drag = null; document.body.classList.remove('is-resizing'); apply(width, true);
      };
      handle.onpointerup = finish; handle.onpointercancel = finish; handle.onlostpointercapture = finish;
      handle.ondblclick = () => apply(initial, true);
      handle.onkeydown = e => {
        if (innerWidth <= breakpoint || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
        e.preventDefault();
        apply(e.key === 'Home' ? min : e.key === 'End' ? max : panel.getBoundingClientRect().width + (e.key === 'ArrowRight' ? 16 : -16) * direction, true);
      };
      window.addEventListener('resize', () => { if (innerWidth <= breakpoint) finish(); syncValues(); });
    }
  }

  const ACTION_WAIT_LABELS = {
    intake: 'Designing your curriculum…',
    submit_intake: 'Designing your curriculum…',
    skip_intake: 'Designing a provisional curriculum…',
    intake_draft: 'Saving intake answers…',
    teach: 'Preparing your lesson…',
    practice: 'Writing a practice problem…',
    skip_check: 'Advancing to next lesson…',
    attempt: 'Checking your answer…',
    diagnostic: 'Preparing help…',
    hint: 'Preparing a hint…',
    approve: 'Starting your learning…',
    revise: 'Updating your learning plan…',
    extend_curriculum: 'Extending your learning path…',
    apply_revision: 'Applying revised curriculum…',
    discard_revision: 'Keeping active curriculum…',
    dismiss_export_offer: 'Saving preference…',
    direct_question: 'Answering your question…',
    start_review: 'Preparing review check…',
    skip_review: 'Skipping optional review…',
    next: 'Saving your checkpoint…',
    correct_observation: 'Updating note…'
  };

  const ACTION_BUSY_TEXT = {
    intake: 'Designing…',
    submit_intake: 'Designing…',
    skip_intake: 'Designing…',
    teach: 'Preparing…',
    practice: 'Preparing…',
    attempt: 'Checking…',
    diagnostic: 'Preparing…',
    hint: 'Preparing…',
    start_review: 'Preparing…'
  };

  // Each action reports pending state on the control the learner actually pressed.
  const ACTION_TRIGGER = {
    intake: '#submit-intake-btn',
    submit_intake: '#submit-intake-btn',
    skip_intake: '#skip-intake-btn'
  };

  // Server-aligned intake limits; the previous single 400 limit mismatched time_budget.
  const INTAKE_MAX_LENGTH = {
    intended_outcome: 400,
    starting_knowledge: 700,
    time_budget: 200,
    requirements: 300,
    preferences: 100
  };

  // QA follow-ups: stable history delegation and synchronized account disclosure state.
  $('#history')?.addEventListener('click', event => {
    const title = event.target.closest('.course-title[data-course-id]');
    if (!title) return;
    event.stopPropagation();
    loadCourse(title.dataset.courseId);
  }, {capture: true});
  document.addEventListener('click', () => {
    if ($('.account-menu')?.hidden) $('.avatar')?.setAttribute('aria-expanded', 'false');
  });

  const requestIdCache = {};
  const enteredCourses = new Set();
  const practiceDrafts = {};
  const intakeDrafts = {};
  let lastFailedOp = null;
  const unnumberTitle = title => String(title || '').replace(/^\s*\d+\.\s+/, '');
  function openTrackRevision(state) {
    dialog.close();
    show('Propose a curriculum revision', `
      ${state.approved_version ? '<p>Your current approved plan and progress remain intact until you apply the proposal.</p>' : ''}
      <textarea id="modal-revision-text" maxlength="700" rows="4" aria-label="Requested plan changes" placeholder="Describe changes to scope, order, or depth…"></textarea>
      <div class="banner-actions"><button type="button" id="submit-modal-revision">Propose revision</button></div>`);
    $('#submit-modal-revision').onclick = () => {
      const text = $('#modal-revision-text').value.trim();
      dialog.close();
      window.courseAction('revise', {text});
    };
  }

  function ensureHeaderLabel() {
    const hdr = $('.main-header');
    if (!hdr) return null;
    let label = $('#page-label', hdr);
    if (!label) {
      label = document.createElement('span');
      label.id = 'page-label';
      label.className = 'page-label';
      const idBox = $('.identity', hdr);
      if (idBox) idBox.after(label);
      else hdr.prepend(label);
    }
    return label;
  }

  function clearDockedStages() {
    const hdr = $('.main-header');
    if (!hdr) return;
    $('.stages', hdr)?.remove();
    hdr.classList.remove('has-stages');
  }

  function fileBadge(resource) {
    const kind = String(resource?.kind || '').toLowerCase();
    const title = String(resource?.title || '').toLowerCase();
    const type = kind === 'pdf' || title.endsWith('.pdf')
      ? 'pdf'
      : kind === 'docx' || title.endsWith('.docx')
        ? 'docx'
        : kind === 'note' || title.endsWith('.md')
          ? 'md'
          : 'txt';
    const badge = {pdf: 'PDF', docx: 'W', md: 'MD', txt: 'TXT'}[type] || 'DOC';
    return `<span class="file-mark ${type}" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h6"/></svg><b>${badge}</b></span>`;
  }

  function makeRequestId(key) {
    if (!requestIdCache[key]) {
      requestIdCache[key] = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'req-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
    }
    return requestIdCache[key];
  }

  function clearRequestId(key) {
    delete requestIdCache[key];
  }

  function thinkingMarkup(label) {
    return `<div class="thinking" role="status"><span class="thinking-dot" aria-hidden="true"></span><span>${esc(label || 'Thinking…')}</span></div>`;
  }

  function operationErrorMarkup(errObj, action) {
    const msg = errObj?.message || 'The request could not be completed. Your work is still here.';
    const editLabel = action === 'attempt'
      ? 'Edit answer'
      : action === 'diagnostic'
        ? 'Edit step'
        : 'Dismiss';
    return `<div class="operation-error" role="alert">
      <div class="error-top">${alertSvg}<p>${esc(msg)}</p></div>
      <div class="error-actions">
        <button type="button" id="retry-operation">Try again</button>
        <button type="button" id="reconcile-operation">Check saved result</button>
        <button type="button" id="edit-operation">${esc(editLabel)}</button>
      </div>
    </div>`;
  }

  /* Guard navigation when rightPanel has unsaved learning pattern changes (U07 & V03) */
  window.guardNavigation = function(nextAction) {
    if (typeof patternDirty !== 'function' || !patternDirty()) {
      return nextAction();
    }
    show('Save your changes?', `<p>Your learning pattern has unsaved changes.</p>
      <div class="stacked-actions">
        <button type="button" id="keep-editing" class="keep-editing">Keep editing</button>
        <button type="button" id="discard-changes" class="discard">Discard changes</button>
        <button type="button" id="confirm-save" class="confirm-save">Save</button>
      </div>`);
    $('#done').hidden = true;
    const cleanupDone = () => { $('#done').hidden = false; };
    dialog.addEventListener('close', cleanupDone, {once: true});

    $('#keep-editing')?.addEventListener('click', () => {
      dialog.close();
    });
    $('#discard-changes')?.addEventListener('click', () => {
      if (typeof savedPattern !== 'undefined' && savedPattern) {
        fillProfile({...fieldsProfile(), ...savedPattern});
      }
      dialog.close();
      nextAction();
    });
    $('#confirm-save')?.addEventListener('click', async () => {
      if (typeof savePattern === 'function') {
        // A failed save keeps this confirmation open with the edits and error in place.
        const saved = await savePattern();
        if (!saved) return;
      }
      dialog.close();
      nextAction();
    });
  };

  window.addEventListener('beforeunload', event => {
    if (typeof patternDirty === 'function' && patternDirty()) {
      event.preventDefault();
      event.returnValue = '';
    }
  });

  /* V06 & U05: Selected reference chip & existing-reference picker on Home */
  function renderSelectedReferenceChip() {
    const host = $('#source-state');
    if (!host) return;
    if (selectedReference) {
      host.innerHTML = `<span class="attachment-chip" id="selected-reference">
        <button type="button" id="reference-preview" title="${esc(selectedReference.title)}">${fileBadge(selectedReference)}<span>${esc(selectedReference.title)}</span></button>
        <button type="button" id="remove-reference" class="remove" aria-label="Remove selected reference">${closeSvg}</button>
      </span>`;
      $('#reference-preview')?.addEventListener('click', () => {
        resourceDialog(selectedReference);
      });
      $('#remove-reference')?.addEventListener('click', () => {
        selectedSource(null);
      });
    } else {
      host.textContent = '';
    }
  }

  const prevSelectedSource = window.selectedSource;
  window.selectedSource = function(resource) {
    prevSelectedSource(resource);
    renderSelectedReferenceChip();
  };

  window.openExistingReferenceDialog = async function() {
    if (!currentUser) {
      auth('signup');
      return;
    }
    if (!savedResources || !savedResources.length) {
      try {
        savedResources = (await api('/api/resources')).resources || [];
      } catch (_) {}
    }
    const refs = (savedResources || []).filter(r => r.kind !== 'note');
    show('Use an existing reference', `
      <div class="library-search">
        ${workspaceIcon('search')}
        <input id="reference-search" type="search" placeholder="Search your references…" aria-label="Search your references">
      </div>
      <div id="existing-reference-list" class="existing-reference-list"></div>
    `);
    const input = $('#reference-search');
    const list = $('#existing-reference-list');
    const paint = () => {
      const q = (input?.value || '').trim().toLowerCase();
      const matches = refs.filter(item =>
        !q || (item.title + ' ' + (item.origin || '') + ' ' + (item.text || '')).toLowerCase().includes(q)
      );
      if (!refs.length) {
        list.innerHTML = `<div class="empty"><h3>No references in your library yet</h3><p>Upload a document or paste a link first to reuse it across courses.</p></div>`;
        return;
      }
      if (!matches.length) {
        list.innerHTML = `<div class="empty"><h3>No matching references</h3><p>Try another keyword or clear the search.</p><button type="button" id="clear-ref-search" class="secondary">Clear search</button></div>`;
        $('#clear-ref-search')?.addEventListener('click', () => {
          input.value = '';
          paint();
          input.focus();
        });
        return;
      }
      list.innerHTML = matches.map(item => {
        const isSelected = selectedReference && selectedReference.id === item.id;
        return `<button type="button" class="existing-reference-row" data-existing="${esc(item.id)}" aria-pressed="${isSelected ? 'true' : 'false'}">
          ${fileBadge(item)}
          <span>
            <strong>${esc(item.title)}</strong>
            <small>${esc(item.origin || 'Reference')} · Reusable in new learning</small>
          </span>
          <em>${isSelected ? 'Selected' : 'Select'}</em>
        </button>`;
      }).join('');
      $$('[data-existing]', list).forEach(btn => {
        btn.onclick = () => {
          const found = refs.find(r => String(r.id) === btn.dataset.existing);
          if (found) {
            window.selectedSource(found);
            dialog.close();
          }
        };
      });
    };
    if (input) input.oninput = paint;
    paint();
    input?.focus();
  };

  /* V06 & V09 & U05: Home view layout, centered title, editable starter intents, below-fold continuation */
  const prevHome = window.home;
  window.home = function() {
    const leavingCourse = !!currentState;
    document.body.classList.add('home-route');
    clearDockedStages();
    const res = prevHome();
    setCrammingMode(leavingCourse ? false : crammingMode);
    const label = ensureHeaderLabel();
    if (label) label.textContent = '';
    $$('.learning-card', $('.hero')).forEach((card, index) => {
      const course = savedCourses[index];
      if (course && (course.stage === 'intake' || !course.total)) {
        const progress = $('p', card);
        if (progress) progress.textContent = 'Draft · Finish setup';
      }
    });

    const hero = $('.hero');
    if (hero) {
      let firstScreen = $('.home-first-screen', hero);
      const intro = $('.intro', hero);
      const composeWrap = $('.compose-wrap', hero);
      if (!firstScreen && intro && composeWrap) {
        firstScreen = document.createElement('div');
        firstScreen.className = 'home-first-screen';
        hero.prepend(firstScreen);
        firstScreen.append(intro, composeWrap);
      }
      const h1 = $('h1', intro || hero);
      if (h1) h1.innerHTML = 'What would you like<br>to understand?';

      // Add editable starter intent buttons inside firstScreen if not present
      if (composeWrap && !$('.examples', composeWrap)) {
        const examples = document.createElement('div');
        examples.className = 'examples';
        examples.innerHTML = `
          <button type="button" data-starter="Help me understand linear equations step by step.">Understand a concept</button>
          <button type="button" data-starter="Help me revise algebra equations for an upcoming exam.">Prepare for an exam</button>
          <button type="button" data-starter="Give me practice on solving one-step and two-step equations.">Practice a weak step</button>
          <button type="button" class="cramming-starter" data-cram-starter="I got an exam tomorrow on " data-cram-context="I got an exam tomorrow.">I got an exam tomorrow</button>
          <button type="button" class="cramming-starter" data-cram-starter="I have presentation this morning on " data-cram-context="I have presentation this morning.">I have presentation this morning</button>
        `;
        composeWrap.append(examples);
        $$('[data-starter]', examples).forEach(btn => {
          btn.onclick = () => {
            const goal = $('.goal');
            if (!goal) return;
            goal.value = btn.dataset.starter;
            goal.dispatchEvent(new Event('input', {bubbles: true}));
            goal.focus();
          };
        });
        $$('[data-cram-starter]', examples).forEach(btn => { btn.onclick = () => {
          setCrammingMode(true, true);
          const goal = $('.goal');
          goal.value = goal.value.trim() ? (goal.value.toLowerCase().includes(btn.dataset.cramContext.toLowerCase().replace(/\.$/, '')) ? goal.value : `${goal.value.trim()}. ${btn.dataset.cramContext}`) : btn.dataset.cramStarter;
          goal.dispatchEvent(new Event('input', {bubbles: true}));
          goal.focus(); goal.setSelectionRange(goal.value.length, goal.value.length);
        }; });
      }

      // Move recent-list below .home-first-screen as .resume-learning so the fold divider is at 100svh
      const recent = $('.recent-list', hero);
      let resumeSection = $('.resume-learning', hero);
      if (recent) {
        if (!resumeSection) {
          resumeSection = document.createElement('section');
          resumeSection.className = 'resume-learning';
          firstScreen.after(resumeSection);
        }
        resumeSection.replaceChildren(recent);
      } else if (resumeSection) {
        resumeSection.remove();
      }

      // Move .review-note below .home-first-screen so it doesn't push the first-screen bottom border
      const reviewNote = $('.review-note', hero);
      if (reviewNote && firstScreen) {
        (resumeSection || firstScreen).after(reviewNote);
      }
    }

    // Add "Use an existing reference" to the + menu on Home
    const addBtn = $('#add');
    const menu = $('.plus-wrap .menu');
    if (addBtn && menu) {
      addBtn.onclick = e => {
        e.stopPropagation();
        menu.hidden = !menu.hidden;
        addBtn.setAttribute('aria-expanded', String(!menu.hidden));
      };
      if (!$('[data-source="Existing reference"]', menu)) {
        const existingBtn = document.createElement('button');
        existingBtn.type = 'button';
        existingBtn.dataset.source = 'Existing reference';
        existingBtn.innerHTML = `<span>⊞</span>Use an existing reference`;
        existingBtn.onclick = e => {
          e.stopPropagation();
          menu.hidden = true;
          addBtn.setAttribute('aria-expanded', 'false');
          window.openExistingReferenceDialog();
        };
        const firstItem = $('button', menu);
        if (firstItem && firstItem.nextSibling) menu.insertBefore(existingBtn, firstItem.nextSibling);
        else menu.prepend(existingBtn);
      }
    }

    renderSelectedReferenceChip();
    return res;
  };

  /* Docked stages in .main-header without Plan checkmark SVG (V02, V09, U01) */
  function buildStagesNav(state) {
    const objectives = state?.curriculum?.objectives || [];
    const modules = state?.curriculum?.modules || [];
    const pos = state?.current_position || {};
    const index = Math.min((state?.objective_index || 0) + 1, Math.max(objectives.length, 1));
    const viewingReview = learningView.classList.contains('learning-review') || Boolean(state?.active_review);
    const active = viewingReview
      ? 'Review'
      : (state?.stage === 'plan' || state?.stage === 'intake')
        ? 'Plan'
        : ['attempt', 'diagnostic', 'repair', 'feedback'].includes(state?.stage)
          ? 'Practice'
          : state?.stage === 'complete'
            ? 'Review'
            : 'Learn';
    const hasHistory = (state?.lesson_history || []).length > 0 || (state?.attempts || []).length > 0 || (state?.review_status?.due_items || []).length > 0;
    const counterText = state?.stage === 'intake'
      ? 'Intake · Scope check'
      : modules.length > 1
        ? `Module ${(pos.module_index ?? 0) + 1} of ${modules.length} · Lesson ${index} of ${objectives.length || 1}`
        : `Lesson ${index} of ${objectives.length || 1}`;
    return `<nav class="stages course-progress" aria-label="Learning progress">
      <button type="button" data-saved-plan="true" class="${active === 'Plan' ? 'active' : state?.approved_version ? 'completed' : ''}" ${active === 'Plan' ? 'aria-current="step"' : ''}>Plan</button>
      <span class="${active === 'Learn' ? 'active' : 'unavailable'}" ${active === 'Learn' ? 'aria-current="step"' : ''}>Learn</span>
      <span class="${active === 'Practice' ? 'active' : 'unavailable'}" ${active === 'Practice' ? 'aria-current="step"' : ''}>Practice</span>
      ${hasHistory
        ? `<button type="button" data-review-stage="true" class="${active === 'Review' ? 'active' : ''}" ${active === 'Review' ? 'aria-current="step"' : ''}>Review</button>`
        : `<span class="${active === 'Review' ? 'active' : 'unavailable'}">Review</span>`}
      <span class="counter progress-count">${esc(counterText)}</span>
    </nav>`;
  }

  function mountHeaderStages(result) {
    const hdr = $('.main-header');
    if (!hdr || !result?.state) return;
    const label = ensureHeaderLabel();
    if (label) label.textContent = '';
    clearDockedStages();
    hdr.classList.add('has-stages');
    hdr.insertAdjacentHTML('beforeend', buildStagesNav(result.state));
    const stageNav = $('.stages', hdr);
    $('[data-saved-plan]', stageNav)?.addEventListener('click', () => {
      const s = result.state;
      if (!s.curriculum) {
        show('Curriculum intake', `<p>Answer or skip the intake questions to generate your curriculum plan.</p>`);
        return;
      }
      const items = (s.curriculum?.objectives || []).map((o, i) => {
        const modTag = o.module_title ? `<small class="meta-pill">${esc(o.module_title)}</small> ` : '';
        return `<li><strong>${esc(unnumberTitle(o.title))} (${o.minutes || 15} min)</strong> ${modTag}<p>${esc(o.outcome)}</p></li>`;
      }).join('');
      const revBtnHtml = s.approved_version
        ? `<div class="banner-actions"><button type="button" id="modal-propose-revision">Request curriculum revision</button></div>`
        : '';
      show(s.curriculum?.title || 'Learning plan', `<p>${esc(s.curriculum?.scope_note || '')}</p>${s.curriculum?.grounding_note ? `<p><small>${esc(s.curriculum.grounding_note)}</small></p>` : ''}<ol class="plan-list">${items}</ol>${revBtnHtml}`);
      $('#modal-propose-revision')?.addEventListener('click', () => {
        openTrackRevision(s);
      });
    });
    $('[data-review-stage]', stageNav)?.addEventListener('click', () => {
      const firstHistory = result.state.lesson_history?.[0]?.id || (result.state.attempts?.length ? 'saved-tests' : '');
      if (firstHistory && typeof showLearningReview === 'function') {
        showLearningReview(result, firstHistory);
      } else if ((result.state.review_status?.due_items || []).length) {
        window.courseAction('start_review', {});
      }
    });
  }

  /* Equation stack & code-point <mark> helpers (V04, V05, B02, U11–U15) */
  function renderLineWithSpan(text, span) {
    const str = String(text || '');
    if (!span || typeof span.start !== 'number' || typeof span.end !== 'number') {
      return esc(str);
    }
    const {start, end, quoted_text} = span;
    if (start < 0 || end <= start || end > str.length) {
      return esc(str);
    }
    const token = str.slice(start, end);
    if (quoted_text && token !== quoted_text) {
      return esc(str);
    }
    return `${esc(str.slice(0, start))}<mark>${esc(token)}</mark>${esc(str.slice(end))}`;
  }

  function renderEpisodeMicroPath(episode) {
    if (!episode || !Array.isArray(episode.steps)) return '';
    return `<div class="eyebrow-row"><p class="episode-eyebrow">Repair exercise · This lesson</p></div>
      <nav class="micro-path" aria-label="Repair steps">
        ${episode.steps.map(step => {
          const cls = step.active ? 'active' : step.completed ? 'done' : '';
          return `<div class="micro-step ${cls}" ${step.active ? 'aria-current="step"' : ''}>
            <span>${step.completed ? '✓' : step.number}</span>
            <strong>${esc(step.label)}</strong>
          </div>`;
        }).join('')}
      </nav>`;
  }

  function renderEpisodeWorkSheet(episode) {
    const sheet = episode?.work_sheet;
    if (!sheet || !Array.isArray(sheet.lines) || !sheet.lines.length) return '';
    return `<section class="work-sheet" aria-label="Submitted work steps">
      <div class="sheet-heading">
        <span>Your submitted steps</span>
        <span>${sheet.has_flagged_step ? '1 step flagged for check' : 'Line-by-line work'}</span>
      </div>
      <div class="equation-stack">
        ${sheet.lines.map((line, i) => `<div class="work-line ${line.flagged ? 'flagged' : ''}">
          <span class="line-label">Step ${i + 1}</span>
          <p class="equation-ink">${renderLineWithSpan(line.text, line.span)}</p>
          ${line.flagged ? '<span class="flag-tag">Check this sign</span>' : ''}
        </div>`).join('')}
      </div>
    </section>`;
  }

  function renderObservationBar(episode) {
    const obs = episode?.observation;
    if (!obs || !obs.text) return '';
    return `<div class="observation-row">
      <p class="correction-note">${esc(obs.text)}</p>
      <button type="button" id="correct-observation-btn" class="quiet-link">That's not where I'm stuck</button>
    </div>`;
  }

  function openObservationCorrectionDialog(obs) {
    const choices = Array.isArray(obs?.choices) && obs.choices.length
      ? obs.choices
      : [
          'Moving a number to the other side',
          'Working with negative numbers',
          'Understanding what the question asks',
          'I made a typing mistake'
        ];
    show("Where did it feel unclear?", `
      <p>Update this note so the next explanation focuses on the right step.</p>
      <div class="existing-reference-list">
        ${choices.map(c => `<button type="button" class="existing-reference-row" data-obs-choice="${esc(c)}"><span><strong>${esc(c)}</strong></span><em>Select</em></button>`).join('')}
      </div>
      <div class="field" style="margin-top:14px">
        <label for="custom-observation-input">Or describe it in your own words</label>
        <input id="custom-observation-input" maxlength="240" placeholder="Write what felt unclear…" value="${esc(obs?.learner_note || '')}">
      </div>
      <div class="dialog-actions" style="margin-top:14px">
        <button type="button" id="save-custom-observation" class="attempt-submit">Save note</button>
      </div>
    `);
    $$('[data-obs-choice]').forEach(btn => {
      btn.onclick = async () => {
        const text = btn.dataset.obsChoice;
        dialog.close();
        await window.courseAction('correct_observation', {observation_id: obs?.id || '', text});
      };
    });
    $('#save-custom-observation')?.addEventListener('click', async () => {
      const text = ($('#custom-observation-input')?.value || '').trim();
      if (!text) return;
      dialog.close();
      await window.courseAction('correct_observation', {observation_id: obs?.id || '', text});
    });
  }

  function renderOutcomeCard(episode) {
    const outcome = episode?.outcome;
    if (!outcome) return '';
    const isIndependent = outcome.category === 'correct_without_recorded_help';
    const badgeCls = isIndependent ? 'independent' : 'assisted';
    const items = Array.isArray(outcome.evidence_items) ? outcome.evidence_items : [];
    return `<section class="result-summary" aria-label="Exercise outcome">
      <div class="outcome-badge ${badgeCls}">${checkSvg}<span>${esc(outcome.label)}</span></div>
      <h2>${esc(outcome.label)}</h2>
      <p>${esc(outcome.summary)}</p>
      ${items.length ? `<ul class="evidence-list">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}
      <p class="caveat-note">${esc(outcome.caveat || 'One attempt is not proof of mastery.')}</p>
    </section>`;
  }

  /* V07, V08, U03, U04: Operation-scoped waiting & inline error recovery for courseAction(action, data) */
  const prevCourseAction = window.courseAction;
  let courseActionBusy = false;
  window.courseAction = async function(action, data = {}) {
    if (action === 'question') {
      return prevCourseAction(action, data);
    }
    // One mutating course action at a time: a second click must not duplicate the request.
    if (courseActionBusy || document.body.inert) return;
    courseActionBusy = true;
    document.body.inert = true;
    const reqKey = `${currentCourse}:${action}:${String(data?.answer || data?.text || '').slice(0, 60)}`;
    const requestId = data?.request_id || makeRequestId(reqKey);
    const payload = {action, ...data, request_id: requestId};
    const waitLabel = ACTION_WAIT_LABELS[action] || 'Working…';

    let feedbackHost = $('#operation-feedback', learningView);
    if (!feedbackHost) {
      feedbackHost = document.createElement('div');
      feedbackHost.id = 'operation-feedback';
      const anchor = learningView.querySelector('form') || learningView.querySelector('.lesson-actions');
      if (anchor) anchor.after(feedbackHost);
      else learningView.append(feedbackHost);
    }

    const trigger = (ACTION_TRIGGER[action] && learningView.querySelector(ACTION_TRIGGER[action]))
      || learningView.querySelector('form button[type="submit"]')
      || learningView.querySelector('.lesson-actions button');
    const origHtml = trigger ? trigger.innerHTML : '';
    const origMinWidth = trigger ? trigger.style.minWidth : '';
    if (trigger) {
      const w = trigger.getBoundingClientRect().width;
      if (w > 0) trigger.style.minWidth = `${Math.ceil(w)}px`;
      trigger.disabled = true;
      trigger.setAttribute('aria-busy', 'true');
      if (ACTION_BUSY_TEXT[action]) trigger.textContent = ACTION_BUSY_TEXT[action];
    }

    const formEl = learningView.querySelector('form');
    if (formEl) formEl.inert = true;
    feedbackHost.innerHTML = thinkingMarkup(waitLabel);

    try {
      const result = await api('/api/courses/' + currentCourse, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      clearRequestId(reqKey);
      lastFailedOp = null;
      if (action === 'attempt' && currentCourse) {
        delete practiceDrafts[currentCourse];
      }
      // Auxiliary list refresh must not turn a successful action into a generation error.
      try { await refreshData(); } catch (_) {}
      renderCourse(result);
      return result;
    } catch (error) {
      if (formEl) formEl.inert = false;
      if (trigger && trigger.isConnected) {
        trigger.innerHTML = origHtml;
        trigger.style.minWidth = origMinWidth;
        trigger.disabled = false;
        trigger.removeAttribute('aria-busy');
      }
      lastFailedOp = {action, data: {...data, request_id: requestId}, message: error?.message || 'Request failed.'};
      if (feedbackHost && feedbackHost.isConnected) {
        feedbackHost.innerHTML = operationErrorMarkup(lastFailedOp, action);
        feedbackHost.scrollIntoView({block: 'center'});
        $('#retry-operation', feedbackHost)?.addEventListener('click', () => {
          if (!lastFailedOp) return;
          const failed = lastFailedOp;
          let retryData = {...failed.data};
          if ((failed.action === 'intake' || failed.action === 'skip_intake')
              && typeof window.collectIntakePayload === 'function'
              && learningView.querySelector('#intake-form')) {
            retryData = {...window.collectIntakePayload(), provisional: failed.action === 'skip_intake', request_id: failed.data.request_id};
          }
          window.courseAction(failed.action, retryData);
        });
        $('#reconcile-operation', feedbackHost)?.addEventListener('click', async () => {
          try {
            const latest = await api('/api/courses/' + currentCourse);
            lastFailedOp = null;
            await refreshData();
            renderCourse(latest);
          } catch (e) {
            liveStatus.textContent = e?.message || 'Could not check saved state.';
          }
        });
        $('#edit-operation', feedbackHost)?.addEventListener('click', () => {
          lastFailedOp = null;
          feedbackHost.innerHTML = '';
          const field = $('#attempt-answer', learningView) || $('#diagnostic-response', learningView) || $('#attempt-work', learningView);
          field?.focus();
        });
      }
    } finally {
      courseActionBusy = false;
      document.body.inert = pendingRequests.size > 0;
      if (formEl && formEl.isConnected) formEl.inert = false;
    }
  };

  function renderIntakeSurface(result) {
    const state = result.state;
    const cramming = !!state.profile?.cramming;
    document.body.classList.toggle('cramming-active', cramming);
    const intakeState = state.intake || {};
    const known = intakeState.known || {};
    const draft = {...(intakeState.draft || {}), ...(intakeDrafts[result.id] || {})};
    const questions = Array.isArray(intakeState.questions) ? intakeState.questions : [];
    const prior = Array.isArray(intakeState.prior_knowledge) ? intakeState.prior_knowledge : [];

    document.body.classList.remove('overview-page', 'new-learning-pattern');
    setActiveView('home');
    bodyView();
    learningView.classList.remove('generating-learning', 'learning-review');
    learningView.classList.add('course-reading');
    currentCourse = result.id;
    currentState = state;
    fillProfile(state.profile);
    mountHeaderStages(result);
    const intakeHeaderLabel = ensureHeaderLabel();
    if (intakeHeaderLabel) intakeHeaderLabel.textContent = '';

    const knownChips = Object.entries(known)
      .filter(([k, v]) => k !== 'goal' && k !== 'pace' && v)
      .map(([k, v]) => `<span class="intake-badge"><strong>${esc(k.replace(/_/g, ' '))}:</strong> ${esc(v)}</span>`)
      .join('');
    const priorChips = prior
      .map(p => `<span class="intake-badge"><strong>Prior background:</strong> ${esc(p.concept)} (${esc(p.from_subject)})</span>`)
      .join('');

    const fieldsHtml = questions
      .filter(q => q.id !== 'reference')
      .map(q => {
        const val = draft[q.field] || draft[q.id] || state.profile?.[q.field] || '';
        return `<div class="intake-field">
          <label for="intake-input-${esc(q.id)}">${esc(q.label)}${q.required ? '' : ' <small>(optional)</small>'}</label>
          <input id="intake-input-${esc(q.id)}" data-intake-field="${esc(q.field)}" data-intake-id="${esc(q.id)}" maxlength="${INTAKE_MAX_LENGTH[q.id] || 400}" placeholder="${esc(q.placeholder || '')}" value="${esc(val)}">
        </div>`;
      }).join('');

    const directHtml = state.last_direct_answer
      ? `<section class="direct-answer-card" aria-label="Direct answer">
          <h3>Direct answer</h3>
          <p class="lesson-copy">${esc(state.last_direct_answer.answer)}</p>
        </section>`
      : '';

    learningView.innerHTML = `
      <small class="page-kicker">Personal learning intake · Clarify scope before planning</small>
      <h1>${esc(state.profile?.goal || 'New learning goal')}</h1>
      <div class="context-line">
        <span class="context-item">${folderSvg}<span>Intake</span></span>
        <span class="context-sep" aria-hidden="true">/</span>
        <button type="button" class="context-source">${fileBadge(state.source)}<span>${esc(state.source?.title || 'No reference selected')}</span></button>
      </div>
      ${directHtml}
      <section class="intake-card${cramming ? ' cramming-scope' : ''}" aria-label="${cramming ? 'Cramming scope form' : 'Compact course intake'}">
        <h2>${cramming ? 'Cramming scope' : 'A few quick details to scope your curriculum'}</h2>
        <p class="lesson-copy">Share as much as you like, or skip straight to a provisional curriculum. Saved preferences are reused automatically.</p>
        ${intakeState.autofilled?.length ? '<p class="intake-prefill-note">Pre-filled from your prompt — review or edit any detail before proposing your curriculum.</p>' : ''}
        ${(knownChips || priorChips) ? `<div class="intake-known" aria-label="Already known context">${knownChips}${priorChips}</div>` : ''}
        <form id="intake-form">
          <div class="intake-grid">${fieldsHtml}</div>
          <div class="intake-actions">
            <button type="button" id="intake-pick-ref-btn" class="intake-attach"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H6v18h12V7zM14 3v5h4M9 12h6M9 16h6"/></svg><span>Attach files</span></button>
            <div class="intake-primary-actions">
            <button type="submit" id="submit-intake-btn">${cramming ? 'Start cramming plan' : 'Propose curriculum'}</button>
            <button type="button" id="skip-intake-btn" class="intake-skip">Skip</button>
            </div>
          </div>
          <div class="intake-actions intake-secondary-actions">
            <button type="button" id="save-intake-draft-btn" class="quiet-link">Save draft</button>
            <button type="button" id="direct-question-btn" class="quiet-link">Answer as a one-off question instead</button>
          </div>
        </form>
        <div id="operation-feedback"></div>
      </section>
    `;

    $('.context-source', learningView)?.addEventListener('click', () => {
      resourceDialog({...state.source, id: state.resource_id || ''});
    });

    const collectPayload = () => {
      const profileUpdate = {...(state.profile || {})};
      $$('[data-intake-field]', learningView).forEach(inp => {
        const val = inp.value.trim();
        const f = inp.dataset.intakeField;
        const qid = inp.dataset.intakeId;
        profileUpdate[f] = val;
        profileUpdate[qid] = val;
      });
      intakeDrafts[result.id] = profileUpdate;
      return {
        profile: profileUpdate,
        resource_id: selectedReference?.id || state.resource_id || undefined
      };
    };
    window.collectIntakePayload = collectPayload;

    $$('[data-intake-field]', learningView).forEach(inp => {
      inp.addEventListener('input', () => {
        collectPayload();
      });
    });

    $('#intake-form', learningView)?.addEventListener('submit', e => {
      e.preventDefault();
      window.courseAction('intake', collectPayload());
    });
    $('#skip-intake-btn', learningView)?.addEventListener('click', () => {
      window.courseAction('skip_intake', {...collectPayload(), provisional: true});
    });
    $('#intake-pick-ref-btn', learningView)?.addEventListener('click', () => {
      collectPayload();
      intake('Upload file', resource => {
        const sourceButton = $('.context-source', learningView);
        if (sourceButton) {
          sourceButton.innerHTML = `${fileBadge(resource)}<span>${esc(resource.title)}</span>`;
          sourceButton.onclick = () => resourceDialog(resource);
        }
      });
    });
    $('#save-intake-draft-btn', learningView)?.addEventListener('click', () => {
      window.courseAction('intake_draft', collectPayload());
    });
    $('#direct-question-btn', learningView)?.addEventListener('click', () => {
      window.courseAction('direct_question', {text: state.profile?.goal || ''});
    });
    if (typeof window.applyMathAndProse === 'function') {
      window.applyMathAndProse(learningView);
    }
  }

  function enhancePlanStage(result) {
    const state = result.state;
    const plan = state.curriculum;
    if (!plan || state.stage !== 'plan' || learningView.querySelector('.curriculum-hierarchy')) return;
    const modules = Array.isArray(plan.modules) ? plan.modules : [];
    const objectives = Array.isArray(plan.objectives) ? plan.objectives : [];
    const objById = {};
    objectives.forEach((o, i) => {
      objById[o.id] = {...o, _number: i + 1};
    });

    const gStatus = plan.grounding_status || 'unverified_general';
    const gLabel = gStatus === 'source_grounded'
      ? 'Source-grounded'
      : gStatus === 'partial_source'
        ? 'Partial source excerpt'
        : 'Provisional · Unverified general knowledge';

    const inspected = Array.isArray(plan.inspected_sections) && plan.inspected_sections.length
      ? `<div class="lesson-meta"><span>Inspected sections:</span>${plan.inspected_sections.map(s => `<span class="section-pill">${esc(s)}</span>`).join('')}</div>`
      : '';
    const unavail = Array.isArray(plan.unavailable_sections) && plan.unavailable_sections.length
      ? `<p class="caveat-note">Unavailable / truncated in source: ${esc(plan.unavailable_sections.join('; '))}</p>`
      : '';
    const bridges = Array.isArray(plan.prerequisite_bridges) && plan.prerequisite_bridges.length
      ? `<section class="prerequisite-bridges" aria-label="Prerequisite bridges">
          <strong>Prerequisite bridge from your background</strong>
          <ul>${plan.prerequisite_bridges.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
        </section>`
      : '';

    const lessonHeading = modules.length ? 'h3' : 'h2';
    const renderLessonCard = obj => {
      if (!obj) return '';
      const prereqText = (obj.prerequisites || []).length
        ? `<span class="meta-pill">Requires: ${esc(obj.prerequisites.join(', '))}</span>`
        : `<span class="meta-pill">Entry lesson</span>`;
      const secPills = (obj.source_sections || []).map(s => `<span class="section-pill">${esc(s)}</span>`).join('');
      const conceptPills = (obj.concepts || []).map(c => `<span class="concept-pill">${esc(c.title || c.id)}</span>`).join('');
      const bridgeNote = obj.prerequisite_bridge ? `<p class="caveat-note">${esc(obj.prerequisite_bridge)}</p>` : '';
      return `<article class="lesson-card" data-objective-id="${esc(obj.id)}">
        <${lessonHeading}>${obj._number}. ${esc(unnumberTitle(obj.title))}</${lessonHeading}>
        <ul class="module-lesson-outcome"><li>${esc(obj.outcome)}</li></ul>
        ${bridgeNote}
        <div class="lesson-meta">
          <span class="meta-pill">~${obj.minutes || 15} min</span>
          ${prereqText}
          ${secPills}
          ${conceptPills}
        </div>
      </article>`;
    };

    const modulesHtml = modules.length
      ? modules.map((mod, mIdx) => {
          const modObjs = (mod.objective_ids || []).map(id => objById[id]).filter(Boolean);
          const modMins = modObjs.reduce((acc, o) => acc + (o.minutes || 15), 0);
          return `<section class="module-card" data-module-id="${esc(mod.id)}">
            <div class="module-head">
              <h2>Module ${mIdx + 1}: ${esc(mod.title)}</h2>
              <span class="module-level">${esc(mod.level || 'Beginner')}</span>
              <span class="meta-pill">${modObjs.length} ${modObjs.length === 1 ? 'lesson' : 'lessons'} · ~${modMins} min</span>
            </div>
            ${mod.summary ? `<p class="lesson-copy">${esc(mod.summary)}</p>` : ''}
            <div class="module-lessons">${modObjs.map(renderLessonCard).join('')}</div>
          </section>`;
        }).join('')
      : `<div class="module-lessons">${objectives.map((o, i) => renderLessonCard({...o, _number: i + 1})).join('')}</div>`;

    const reviewOppHtml = Array.isArray(plan.review_opportunities) && plan.review_opportunities.length
      ? `<section class="review-opp-box" aria-label="Cumulative review opportunities">
          <strong>Cumulative review checkpoints</strong>
          <ul>${plan.review_opportunities.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
        </section>`
      : '';
    const enrichmentHtml = Array.isArray(plan.optional_enrichment) && plan.optional_enrichment.length
      ? `<section class="enrichment-box" aria-label="Optional enrichment">
          <strong>Optional enrichment (separate from required path)</strong>
          <ul>${plan.optional_enrichment.map(e => `<li>${esc(e)}</li>`).join('')}</ul>
        </section>`
      : '';

    const container = document.createElement('div');
    container.className = 'curriculum-hierarchy';
    container.innerHTML = `
      <section class="grounding-banner" aria-label="Curriculum scope and grounding">
        <div class="lesson-meta" style="margin-top:0;margin-bottom:8px">
          <span class="grounding-badge ${esc(gStatus)}">${esc(gLabel)}</span>
          <span class="meta-pill">${modules.length || 1} ${(modules.length || 1) === 1 ? 'module' : 'modules'} · ${objectives.length} ${objectives.length === 1 ? 'lesson' : 'lessons'} · ~${plan.total_minutes || 15} min total</span>
          <span class="meta-pill">Plan v${state.version || 1} · Awaiting approval</span>
        </div>
        ${plan.intended_outcome && plan.intended_outcome !== plan.scope_note ? `<p class="lesson-copy"><strong>Outcome:</strong> ${esc(plan.intended_outcome)}</p>` : ''}
        ${plan.grounding_note ? `<p class="caveat-note">${esc(plan.grounding_note)}</p>` : ''}
        ${inspected}
        ${unavail}
      </section>
      ${bridges}
      ${modulesHtml}
      ${reviewOppHtml}
      ${enrichmentHtml}
    `;

    $$('.module-lesson-outcome li', container).forEach(item => item.replaceWith(element('li', item.textContent)));

    // Remove legacy flat objective headings and their rich-text outcome blocks.
    $$('h3', learningView).forEach(h => {
      if (/^\d+\.\s/.test(h.textContent)) {
        const nextP = h.nextElementSibling;
        if (nextP && (nextP.tagName === 'P' || nextP.classList.contains('lesson-copy'))) nextP.remove();
        h.remove();
      }
    });

    learningView.querySelector('.plan-learner-targets')?.remove();
    const targets = document.createElement('ul');
    targets.className = 'plan-learner-targets';
    objectives.map(o => o.outcome).filter(Boolean).forEach(outcome => {
      const item = element('li', outcome, 'plan-learner-target-item');
      item.classList.add('plan-learner-target-item');
      targets.append(item);
    });
    const scopeNote = learningView.querySelector(':scope > .lesson-copy');
    if (scopeNote) scopeNote.after(targets); else learningView.querySelector('h1')?.after(targets);

    const actions = learningView.querySelector('.lesson-actions');
    if (actions) {
      actions.before(container);
      const approveBtn = [...actions.querySelectorAll('button')].find(b => /approve curriculum|accept this plan/i.test(b.textContent));
      if (approveBtn) {
        approveBtn.onclick = () => window.courseAction('approve', {version: state.version});
      }
      const reviseBtn = [...actions.querySelectorAll('button')].find(b => /request changes/i.test(b.textContent));
      if (reviseBtn) reviseBtn.onclick = () => openTrackRevision(state);
    } else {
      learningView.append(container);
    }
  }

  function enhanceActiveCourseBanners(result) {
    const state = result.state;
    if (!state || state.stage === 'intake' || state.stage === 'plan') return;
    const ctxLine = learningView.querySelector('.context-line') || learningView.querySelector('h1');

    // 1. Candidate revision banner (when revising an already-approved course)
    if (state.pending_revision && !learningView.querySelector('.pending-revision-card')) {
      const cand = state.pending_revision;
      const candObjs = cand.curriculum?.objectives || [];
      const card = document.createElement('section');
      card.className = 'pending-revision-card';
      card.setAttribute('aria-label', 'Pending curriculum revision');
      card.innerHTML = `
        <div class="lesson-meta" style="margin-top:0;margin-bottom:6px">
          <span class="grounding-badge partial_source">Candidate revision v${cand.version}</span>
          <span class="meta-pill">Active approved plan: v${state.approved_version}</span>
        </div>
        <h2>Proposed curriculum update: ${esc(cand.curriculum?.title || 'Revised plan')} (${candObjs.length} lessons)</h2>
        <p class="lesson-copy">${esc(cand.curriculum?.scope_note || '')}</p>
        <ol class="plan-list">${candObjs.map(o => `<li><strong>${esc(unnumberTitle(o.title))}</strong> — ${esc(o.outcome)}</li>`).join('')}</ol>
        <div class="banner-actions">
          <button type="button" id="apply-revision-btn">Apply revised plan</button>
          <button type="button" id="discard-revision-btn" class="secondary">Keep current plan</button>
        </div>
      `;
      if (ctxLine) ctxLine.after(card);
      else learningView.prepend(card);
      $('#apply-revision-btn', card)?.addEventListener('click', () => {
        window.courseAction('apply_revision', {version: cand.version});
      });
      $('#discard-revision-btn', card)?.addEventListener('click', () => {
        window.courseAction('discard_revision', {});
      });
    }

    // 2. One-time post-approval checkpoint export offer
    if (state.export_offer?.shown && !state.export_offer?.dismissed && !learningView.querySelector('.export-offer-card')) {
      const offerCard = document.createElement('section');
      offerCard.className = 'export-offer-card';
      offerCard.setAttribute('aria-label', 'Checkpoint export offer');
      offerCard.innerHTML = `
        <strong>Plan approved</strong>
        <p class="lesson-copy">Would you like a copy of your learning plan and resume checkpoint, or keep everything in this workspace?</p>
        <div class="banner-actions">
          <span class="export-format-links">
            <a href="/api/courses/${esc(result.id)}/export?format=md">Markdown (.md)</a>
            <a href="/api/courses/${esc(result.id)}/export?format=docx">Word (.docx)</a>
            <a href="/api/courses/${esc(result.id)}/export?format=pdf">PDF (.pdf)</a>
          </span>
          <button type="button" id="dismiss-export-offer-btn" class="secondary">Keep in workspace</button>
        </div>
      `;
      if (ctxLine) ctxLine.after(offerCard);
      else learningView.prepend(offerCard);
      $('#dismiss-export-offer-btn', offerCard)?.addEventListener('click', () => {
        window.courseAction('dismiss_export_offer', {});
      });
    }

    // 3. Spaced review banner (active review or due earlier concept)
    const revStatus = state.review_status;
    if ((state.active_review || (revStatus?.due_items || []).length > 0) && !learningView.querySelector('.spaced-review-card')) {
      const reviewCard = document.createElement('section');
      reviewCard.className = 'spaced-review-card';
      reviewCard.setAttribute('aria-label', 'Spaced review');
      if (state.active_review) {
        const rev = state.active_review;
        reviewCard.innerHTML = `
          <div class="lesson-meta" style="margin-top:0;margin-bottom:6px">
            <span class="grounding-badge partial_source">${esc(rev.label || 'Spaced review')}</span>
          </div>
          <p class="lesson-copy">Checking retention on an earlier approved concept. You can complete this quick check or skip back to your current lesson.</p>
          <div class="banner-actions">
            <button type="button" id="skip-review-btn" class="secondary">Skip review &amp; return to lesson</button>
          </div>
        `;
      } else {
        const dueItem = revStatus.due_items[0];
        reviewCard.innerHTML = `
          <div class="lesson-meta" style="margin-top:0;margin-bottom:6px">
            <span class="grounding-badge partial_source">${esc(dueItem.label)}</span>
            <span class="meta-pill">${dueItem.mode === 'relearning' ? 'Needs step-by-step refresher' : '1 bounded review due'}</span>
          </div>
          <p class="lesson-copy">A short check on <strong>${esc(dueItem.title)}</strong> is due before or alongside your current lesson.</p>
          <div class="banner-actions">
            <button type="button" id="start-review-btn">${dueItem.mode === 'relearning' ? 'Relearn this concept' : 'Start quick review'}</button>
            <button type="button" id="skip-review-btn" class="secondary">Skip for now</button>
          </div>
        `;
      }
      if (ctxLine) ctxLine.after(reviewCard);
      else learningView.prepend(reviewCard);
      $('#start-review-btn', reviewCard)?.addEventListener('click', () => {
        window.courseAction('start_review', {});
      });
      $('#skip-review-btn', reviewCard)?.addEventListener('click', () => {
        window.courseAction('skip_review', {});
      });
    }

    // 4. Optional check skip control when assessment_required is false
    const objectives = state.curriculum?.objectives || [];
    const currentObj = objectives[Math.min(state.objective_index || 0, Math.max(objectives.length - 1, 0))];
    if (state.stage === 'lesson' && currentObj && currentObj.assessment_required === false && !learningView.querySelector('#skip-check-btn')) {
      const actions = learningView.querySelector('.lesson-actions');
      if (actions) {
        const skipBtn = document.createElement('button');
        skipBtn.type = 'button';
        skipBtn.id = 'skip-check-btn';
        skipBtn.className = 'secondary';
        skipBtn.textContent = 'Skip optional check (mark unassessed)';
        skipBtn.onclick = () => window.courseAction('skip_check', {optional_check: true});
        actions.append(skipBtn);
      }
    }
  }

  /* Enhance renderCourse(result) with V01–V05, V07–V09, U01–U03, U11–U15, and personal-learning workflow */
  const prevRenderCourse = window.renderCourse;
  window.renderCourse = function(result) {
    document.body.classList.remove('home-route');
    document.body.classList.toggle('cramming-active', !!result?.state?.profile?.cramming);
    if (result?.id && !enteredCourses.has(result.id)) {
      enteredCourses.add(result.id);
      if (typeof setPanel === 'function') setPanel(false);
    }
    if (!result?.state) return prevRenderCourse(result);
    if (result.state.stage === 'intake' || !result.state.curriculum) {
      renderIntakeSurface(result);
      return;
    }
    // Ensure a fallback lesson object when rendering an active review before opening the current lesson
    const safeResult = (!result.state.lesson && ['lesson', 'attempt', 'diagnostic', 'repair', 'feedback'].includes(result.state.stage))
      ? {
          ...result,
          state: {
            ...result.state,
            lesson: {
              explanation: result.state.active_review?.label || 'Reviewing earlier course concept.',
              worked_example: []
            }
          }
        }
      : result;
    const res = prevRenderCourse(safeResult);
    const state = result.state;
    mountHeaderStages(result);

    // The source row is omitted from the learning view at the owner's request.
    const sourceLine = learningView.querySelector('.source-line');
    sourceLine?.remove();

    if (state.stage === 'plan') {
      enhancePlanStage(result);
    } else {
      enhanceActiveCourseBanners(result);
    }

    const episode = state.episode;
    const formEl = learningView.querySelector('form');

    // 2. Stage-specific enhancements (attempt, diagnostic, repair, feedback)
    if (state.stage === 'attempt' && formEl) {
      formEl.id = 'practice-surface';
      const ansInput = $('#attempt-answer', formEl);
      const workInput = $('#attempt-work', formEl);
      const savedDraft = practiceDrafts[result.id] || {};
      if (ansInput && savedDraft.answer && !ansInput.value) ansInput.value = savedDraft.answer;
      if (workInput && savedDraft.work && !workInput.value) workInput.value = savedDraft.work;
      const saveDraft = () => {
        practiceDrafts[result.id] = {
          answer: ansInput?.value || '',
          work: workInput?.value || ''
        };
      };
      ansInput?.addEventListener('input', saveDraft);
      workInput?.addEventListener('input', saveDraft);

      if (episode && !learningView.querySelector('.micro-path')) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = renderEpisodeMicroPath(episode);
        formEl.before(wrapper);
      }
      if (state.repaired_in_objective) {
        const practiceHeading = [...learningView.querySelectorAll('h3')].find(h => /practice/i.test(h.textContent));
        if (practiceHeading) practiceHeading.textContent = 'Your turn. A fresh equation.';
      } else if (state.active_review?.label) {
        const practiceHeading = [...learningView.querySelectorAll('h3')].find(h => /practice/i.test(h.textContent));
        if (practiceHeading) practiceHeading.textContent = state.active_review.label;
      }

      let fb = $('#operation-feedback', learningView);
      if (!fb) {
        fb = document.createElement('div');
        fb.id = 'operation-feedback';
        formEl.after(fb);
      }
      if (episode?.hint && !learningView.querySelector('.hint-card')) {
        const hintCard = document.createElement('div');
        hintCard.className = 'hint-card';
        hintCard.innerHTML = `<strong>Hint:</strong> ${esc(episode.hint)}`;
        fb.before(hintCard);
      }
      if (!learningView.querySelector('#need-help-btn')) {
        const helpWrap = document.createElement('div');
        helpWrap.className = 'lesson-actions';
        helpWrap.style.marginTop = '10px';
        helpWrap.innerHTML = `
          <button type="button" id="need-help-btn">Need help?</button>
        `;
        fb.after(helpWrap);
        $('#need-help-btn', helpWrap)?.addEventListener('click', () => {
          if (!episode?.hint) {
            window.courseAction('hint', {});
          } else {
            $('#followup-question')?.focus();
          }
        });
      }
    } else if (state.stage === 'diagnostic') {
      if (episode && !learningView.querySelector('.work-sheet')) {
        const anchor = [...learningView.querySelectorAll('h3')].find(h => /feedback/i.test(h.textContent)) || formEl;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = renderEpisodeMicroPath(episode) + renderEpisodeWorkSheet(episode) + renderObservationBar(episode);
        if (anchor) anchor.before(wrapper);
        else learningView.prepend(wrapper);
        $('#correct-observation-btn', wrapper)?.addEventListener('click', () => {
          openObservationCorrectionDialog(episode.observation);
        });
      }
      if (formEl && !$('#operation-feedback', learningView)) {
        const fb = document.createElement('div');
        fb.id = 'operation-feedback';
        formEl.after(fb);
      }
    } else if (state.stage === 'repair') {
      // UI-08: preserve the lesson, but give the submitted working the first reading viewport.
      const lessonStart = learningView.querySelector(':scope > h2') || learningView.querySelector('h3');
      if (lessonStart && !learningView.querySelector('.lesson-recap')) {
        const recap = document.createElement('details');
        recap.className = 'lesson-recap';
        recap.innerHTML = '<summary>View lesson</summary>';
        lessonStart.before(recap);
        let node = lessonStart;
        while (node && !(node.tagName === 'H3' && /your practice/i.test(node.textContent))) {
          const next = node.nextSibling;
          recap.append(node);
          node = next;
        }
      }
      if (episode && !learningView.querySelector('.work-sheet')) {
        const anchor = [...learningView.querySelectorAll('h3')].find(h => /feedback/i.test(h.textContent)) || learningView.querySelector('.lesson-actions');
        const wrapper = document.createElement('div');
        wrapper.innerHTML = renderEpisodeMicroPath(episode) + renderEpisodeWorkSheet(episode) + renderObservationBar(episode);
        if (anchor) anchor.before(wrapper);
        else learningView.prepend(wrapper);
        $('#correct-observation-btn', wrapper)?.addEventListener('click', () => {
          openObservationCorrectionDialog(episode.observation);
        });
      }
      const actions = learningView.querySelector('.lesson-actions');
      if (actions && !$('#operation-feedback', learningView)) {
        const fb = document.createElement('div');
        fb.id = 'operation-feedback';
        actions.after(fb);
      }
    } else if (state.stage === 'feedback') {
      if (episode && !learningView.querySelector('.result-summary')) {
        const anchor = [...learningView.querySelectorAll('h3')].find(h => /feedback/i.test(h.textContent)) || learningView.querySelector('.lesson-actions');
        const wrapper = document.createElement('div');
        wrapper.innerHTML = renderEpisodeMicroPath(episode) + renderOutcomeCard(episode) + renderEpisodeWorkSheet(episode) + renderObservationBar(episode);
        if (anchor) anchor.before(wrapper);
        else learningView.prepend(wrapper);
        $('#correct-observation-btn', wrapper)?.addEventListener('click', () => {
          openObservationCorrectionDialog(episode.observation);
        });
      }
      const actions = learningView.querySelector('.lesson-actions');
      if (actions && !$('#operation-feedback', learningView)) {
        const fb = document.createElement('div');
        fb.id = 'operation-feedback';
        actions.after(fb);
      }
    } else {
      const actions = learningView.querySelector('.lesson-actions');
      if (actions && !$('#operation-feedback', learningView)) {
        const fb = document.createElement('div');
        fb.id = 'operation-feedback';
        actions.after(fb);
      }
    }

    return res;
  };

  /* V06 & V08 & U06: Library with counted filter tabs, + Add a reference, and 4 distinct empty states */
  let activeLibraryFilter = 'all';
  let activeLibraryQuery = '';
  let libraryFetchError = '';
  let libraryLayout = 'grid';

  window.renderLibrary = function() {
    document.body.classList.remove('home-route');
    clearDockedStages();
    const label = ensureHeaderLabel();
    if (label) label.textContent = '';
    learningView.replaceChildren();

    const allCount = (savedResources || []).length;
    const refCount = (savedResources || []).filter(r => r.kind !== 'note').length;
    const noteCount = (savedResources || []).filter(r => r.kind === 'note').length;

    const shell = document.createElement('div');
    shell.className = 'library-shell';
    shell.dataset.layout = libraryLayout;
    shell.innerHTML = `
      <div class="library-title-row">
        <h1>Library</h1>
        <div class="library-toolbar">
        <button type="button" id="library-layout" aria-label="${libraryLayout === 'grid' ? 'Show list' : 'Show grid'}">${libraryLayout === 'grid' ? '☷' : '▦'}</button>
      <div class="library-search">
        ${workspaceIcon('search')}
        <input id="library-search" type="search" aria-label="Search library" placeholder="Search references and saved explanations…" value="${esc(activeLibraryQuery)}">
      </div>
        <button type="button" id="library-add-reference" aria-label="+ Add a reference">+ New</button>
        </div>
      </div>
      <div class="library-tabs filters" role="group" aria-label="Library filters">
        ${[
          ['all', 'All', allCount],
          ['reference', 'References', refCount],
          ['note', 'Notes', noteCount]
        ].map(([key, name, cnt]) => `<button type="button" data-filter="${key}" class="${activeLibraryFilter === key ? 'active' : ''}" aria-pressed="${activeLibraryFilter === key}">${name}<span class="filter-count">${cnt}</span></button>`).join('')}
      </div>
      <p id="library-count" class="filter-status" role="status"></p>
      <div id="library-list" class="resource-list"></div>
    `;
    learningView.append(shell);
    $('#library-layout', shell).onclick = () => {
      libraryLayout = libraryLayout === 'grid' ? 'list' : 'grid';
      window.renderLibrary();
    };

    $('#library-add-reference', shell)?.addEventListener('click', () => {
      intake('Upload file');
    });
    const searchInput = $('#library-search', shell);
    if (searchInput) {
      searchInput.oninput = e => {
        activeLibraryQuery = e.target.value;
        paintLibraryList();
      };
    }
    $$('[data-filter]', shell).forEach(btn => {
      btn.onclick = () => {
        activeLibraryFilter = btn.dataset.filter;
        window.renderLibrary();
      };
    });
    paintLibraryList();
  };

  function paintLibraryList() {
    const list = $('#library-list', learningView);
    const status = $('#library-count', learningView);
    if (!list) return;

    if (libraryFetchError) {
      if (status) status.textContent = 'Library unavailable';
      list.innerHTML = `<div class="operation-error" role="alert">
        <div class="error-top">${alertSvg}<p>${esc(libraryFetchError)}</p></div>
        <div class="error-actions"><button type="button" id="retry-library">Try again</button></div>
      </div>`;
      $('#retry-library', list)?.addEventListener('click', async () => {
        try {
          savedResources = (await api('/api/resources')).resources || [];
          libraryFetchError = '';
          window.renderLibrary();
        } catch (e) {
          libraryFetchError = e?.message || 'Could not load your Library.';
          paintLibraryList();
        }
      });
      return;
    }

    const q = activeLibraryQuery.trim();
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = (savedResources || []).filter(r => {
      const kind = r.kind === 'note' ? 'note' : 'reference';
      const filterOk = activeLibraryFilter === 'all' || kind === activeLibraryFilter;
      const haystack = `${r.title || ''} ${r.origin || ''} ${r.text || ''}`.toLowerCase();
      return filterOk && terms.every(t => haystack.includes(t));
    });

    if (status) status.textContent = `${matches.length} ${matches.length === 1 ? 'item' : 'items'}`;
    if (!matches.length) {
      if (!(savedResources || []).length) {
        list.innerHTML = `<div class="empty">
          <h2>Your library is empty</h2>
          <p>Add a reference document or save an explanation from a lesson to build your library.</p>
          <button type="button" id="empty-add-reference" class="secondary">Add a reference</button>
        </div>`;
        $('#empty-add-reference', list)?.addEventListener('click', () => intake('Upload file'));
      } else if (!terms.length && activeLibraryFilter !== 'all') {
        const heading = activeLibraryFilter === 'note' ? 'No saved explanations yet' : 'No references yet';
        list.innerHTML = `<div class="empty">
          <h2>${heading}</h2>
          <p>Switch back to all items or add a new reference.</p>
          <button type="button" id="show-all-items" class="secondary">Show all items</button>
        </div>`;
        $('#show-all-items', list)?.addEventListener('click', () => {
          activeLibraryFilter = 'all';
          window.renderLibrary();
        });
      } else {
        list.innerHTML = `<div class="empty">
          <h2>No matches for “${esc(q)}”</h2>
          <p>Try another keyword or clear the search.</p>
          <button type="button" id="clear-library-search" class="secondary">Clear search</button>
        </div>`;
        $('#clear-library-search', list)?.addEventListener('click', () => {
          activeLibraryQuery = '';
          activeLibraryFilter = 'all';
          window.renderLibrary();
          $('#library-search')?.focus();
        });
      }
      return;
    }

    list.innerHTML = matches.map(r => {
      const isNote = r.kind === 'note';
      return `<button type="button" class="resource-row" data-resource-id="${esc(r.id)}" data-resource="${isNote ? 'note' : 'reference'}">
        ${fileBadge(r)}
        <div>
          <strong>${esc(r.title)}</strong>
          <small>${esc(isNote ? 'Saved explanation' : 'Reference')} · ${esc(readableTime(r.created))}</small>
        </div>
        <em class="resource-action">${isNote ? 'Saved note' : 'Use in new learning'}</em>
        <span class="resource-preview" aria-hidden="true">${fileBadge(r)}</span>
      </button>`;
    }).join('');
    $$('[data-resource-id]', list).forEach(btn => {
      btn.onclick = () => {
        const found = (savedResources || []).find(r => String(r.id) === btn.dataset.resourceId);
        if (found) resourceDialog(found);
      };
    });
  }

  /* V06 & V08: Activity 500-event window explanation & date recovery */
  let selectedActivityDate = '';
  window.renderActivity = function() {
    document.body.classList.remove('home-route');
    clearDockedStages();
    const label = ensureHeaderLabel();
    if (label) label.textContent = '';
    learningView.replaceChildren();

    const localDay = iso => {
      const d = new Date(iso);
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    };
    const allEvents = Array.isArray(savedActivity) ? savedActivity : [];
    const records = allEvents.filter(e => !selectedActivityDate || localDay(e.created) === selectedActivityDate);
    const oldestDay = allEvents.length ? localDay(allEvents[allEvents.length - 1].created) : '';
    const outsideWindow = Boolean(allEvents.length >= 500 && selectedActivityDate && oldestDay && selectedActivityDate < oldestDay);

    let emptyHtml = '';
    if (!records.length) {
      if (!allEvents.length) {
        emptyHtml = `<div class="empty">
          <h2>No activity yet</h2>
          <p>Start a learning plan or open a lesson to record your progress here.</p>
          <button type="button" id="activity-go-home" class="secondary">Start new learning</button>
        </div>`;
      } else if (outsideWindow) {
        emptyHtml = `<div class="empty">
          <h2>Date is outside the recent 500-event window</h2>
          <p>Activity shows up to 500 recent events (back to ${esc(oldestDay)}).</p>
          <button type="button" id="show-all-events" class="secondary">Show all loaded events</button>
        </div>`;
      } else {
        emptyHtml = `<div class="empty">
          <h2>No activity on this date</h2>
          <p>Choose another date, or view all loaded events.</p>
          <button type="button" id="show-all-events" class="secondary">Show all loaded events</button>
        </div>`;
      }
    }

    const shell = document.createElement('div');
    shell.className = 'activity-shell';
    shell.innerHTML = `
      <h1>Activity</h1>
      <div class="activity-filter">
        <label for="live-activity-date">Filter by date</label>
        <div>
          <input id="live-activity-date" type="date" aria-label="Activity date" value="${esc(selectedActivityDate)}">
          <button type="button" id="all-activity-dates">All dates</button>
          <span class="history-window-note">Showing up to 500 recent events</span>
        </div>
      </div>
      <p class="filter-status" role="status">${records.length} ${records.length === 1 ? 'event' : 'events'}</p>
      <div id="activity-list">
        ${records.length ? records.map((e, idx) => `<button type="button" class="activity-item event-row" data-event-idx="${idx}">
          ${workspaceIcon('activity')}
          <div>
            <strong>${esc(e.title)}</strong>
            <small>${esc(readableTime(e.created))}</small>
          </div>
        </button>`).join('') : emptyHtml}
      </div>
    `;
    learningView.append(shell);

    $('#live-activity-date', shell)?.addEventListener('change', e => {
      selectedActivityDate = e.target.value;
      window.renderActivity();
    });
    $('#all-activity-dates', shell)?.addEventListener('click', () => {
      selectedActivityDate = '';
      window.renderActivity();
    });
    $('#show-all-events', shell)?.addEventListener('click', () => {
      selectedActivityDate = '';
      window.renderActivity();
    });
    $('#activity-go-home', shell)?.addEventListener('click', () => {
      window.route('home');
    });
    $$('[data-event-idx]', shell).forEach(btn => {
      btn.onclick = () => {
        const ev = records[Number(btn.dataset.eventIdx)];
        if (ev?.course) loadCourse(ev.course);
      };
    });
  };

  /* Wrap route(view) to guard dirty learning-pattern changes */
  const prevRoute = window.route;
  window.route = function(view) {
    window.guardNavigation(() => {
      prevRoute(view);
    });
  };

  installPanelResizers();
  // Re-run Home setup so initial load gets the V06/V09 Home layout
  if (!$('.hero')?.hidden) {
    window.home();
  }
})();
