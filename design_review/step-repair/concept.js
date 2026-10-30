paths.next='<path d="M5 12h14m-6-6 6 6-6 6"/>';
const repair = {step:'notice',nextLine:'',answer:'',hint:false,signal:'Keeping both sides balanced',corrected:false,error:'',attempts:0};
const originalHome = renderHome;
const originalChat = renderChat;
const originalLibrary = renderLibrary;
const equation = text => `<span class="equation-ink">${text.replaceAll('x','<i>x</i>')}</span>`;
const pathMarkup = () => `<ol class="repair-path" aria-label="Repair exercise steps">${[['notice','Find the step'],['repair','Repair it'],['try','Try independently']].map(([key,label],i)=>`<li ${repair.step===key?'aria-current="step"':''} class="${['notice','repair','try','done'].indexOf(repair.step)>i?'path-done':''}"><span class="path-dot" aria-hidden="true">${['notice','repair','try','done'].indexOf(repair.step)>i?'✓':i+1}</span>${label}</li>`).join('')}</ol>`;

function lessonContext(){return `<div class="context-line">${icon('folder')}<span>Algebra foundations</span><span aria-hidden="true">/</span><button id="context-source">${fileIcon('pdf')}Course notes</button></div>`;}
function evidenceMarkup(){return `<div class="result-summary">${icon('check')}<h2>${repair.hint?'Solved with a hint':'Solved independently'}</h2><p>${repair.hint?'You used a reminder, then found the missing value. Try another problem later without the reminder.':'You solved a changed problem without opening a hint in this demo.'}</p></div><dl class="evidence-list"><div><dt>Skill checked</dt><dd>Keeping both sides balanced</dd></div><div><dt>Changed problem</dt><dd>${equation('x + 4 = 10')}</dd></div><div><dt>Your answer</dt><dd>${esc(repair.answer||'Not attempted yet')}</dd></div><div><dt>Help used</dt><dd>${repair.hint?'Hint opened':'No hint opened'}</dd></div><div><dt>Next check</dt><dd>Recheck later</dd></div></dl><p class="evidence-note">One sample attempt is not proof of mastery. This preview does not schedule a reminder.</p>`;}

renderLesson = function(){
  if(!state.approved){state.view='plan';renderPlan();return;}
  if(state.progress==='practice'&&repair.step==='notice')repair.step='try';
  if(state.historyView){
    content.innerHTML=`<section class="reading repair-reading">${stages('Review')}${lessonContext()}<div class="lesson-kicker">Your checkpoint</div><h1>What this attempt tells us</h1>${repair.step==='done'?evidenceMarkup():'<p class="repair-intro">Finish the changed problem to record evidence from this sample.</p>'}<button id="continue-step" class="ice-button">Continue learning</button></section>`;
    bindStages();$('#continue-step').onclick=()=>{state.historyView=false;go('lesson');};$('#context-source').onclick=()=>showSource(resources[0]);return;
  }
  const practice=repair.step==='try'||repair.step==='done';
  let body='';
  if(repair.step==='notice'){
    body=`<div class="lesson-kicker">Solving one-step equations</div><h1>Let's find the step that changed.</h1><p class="repair-intro">Your starting point is right. Look at the operation on the next line.</p><div class="work-sheet"><div class="sheet-heading"><strong>Your working</strong><span>Sample attempt</span></div><div class="equation-stack"><div class="work-line">${equation('x + 3 = 8')}</div><div class="work-line flagged">${equation('x = 8 <mark aria-label="Incorrect plus sign">+</mark> 3')}</div></div></div><div class="insight"><h2>Keep both sides balanced</h2><p>To remove +3, subtract 3 from both sides. The right side becomes 8 − 3.</p></div><div class="repair-buttons"><button id="repair-step" class="ice-button">Work through this step ${icon('next')}</button><button id="signal-correction" class="text-button">That's not where I'm stuck</button></div>${repair.corrected?`<p class="correction-note" role="status">Your focus: ${esc(repair.signal)}. This changes only the sample observation.</p>`:''}`;
  }else if(repair.step==='repair'){
    body=`<div class="lesson-kicker">One move at a time</div><h1>Subtract from both sides.</h1><p class="repair-intro">The same operation keeps the equation equal.</p><div class="work-sheet"><div class="sheet-heading"><strong>Repairing the step</strong><span>Worked example</span></div><div class="equation-stack"><div class="work-line">${equation('x + 3 = 8')}</div><div class="work-line">${equation('x + 3 − 3 = 8 − 3')}</div></div></div><form id="repair-form" class="repair-entry"><label for="repair-next">What is the value of x?</label><div class="field-shell"><textarea id="repair-next" rows="1" placeholder="Write x = your result…" aria-describedby="repair-error">${esc(repair.nextLine)}</textarea></div><div id="repair-error">${repair.error?errorBlock(repair.error):''}</div><div class="repair-buttons"><button type="submit" class="ice-button" ${repair.nextLine.trim()?'':'disabled'}>Check this step</button><button id="back-to-step" type="button" class="text-button">See my original working</button></div></form>`;
  }else if(repair.step==='try'){
    body=`<div class="lesson-kicker">Changed problem · Same skill</div><h1>Your turn. A fresh equation.</h1><p class="repair-intro">Use the same idea with different numbers.</p><div class="work-sheet"><div class="sheet-heading"><strong>Find the missing value</strong><span>No answer shown</span></div><div class="try-equation">${equation('x + 4 = 10')}</div></div><form id="transfer-form" class="repair-entry"><label for="transfer-answer">Your answer</label><div class="field-shell"><textarea id="transfer-answer" rows="1" placeholder="x = …" aria-describedby="transfer-error">${esc(repair.answer)}</textarea></div><div id="transfer-error">${repair.error?errorBlock(repair.error):''}</div><div class="repair-buttons"><button type="submit" class="ice-button" ${repair.answer.trim()?'':'disabled'}>Check my answer</button><button type="button" id="show-hint" class="text-button" ${repair.hint?'disabled':''}>${repair.hint?'Hint opened':'I need a hint'}</button></div><div id="hint-copy">${repair.hint?'<div class="insight"><h2>A small reminder</h2><p>Subtract 4 from both sides, then simplify the right side.</p></div>':''}</div></form>`;
  }else{
    body=`<div class="lesson-kicker">Evidence from this attempt</div><h1>You found the missing value.</h1>${evidenceMarkup()}<div class="repair-buttons"><button id="review-work" class="ice-button">Review the repaired step</button><button id="reset-episode" class="text-button">Restart sample</button></div>`;
  }
  content.innerHTML=`<section class="reading repair-reading">${stages(practice?'Practice':'Learn')}${lessonContext()}<p class="path-caption">Repair exercise · This lesson</p>${pathMarkup()}${body}<div class="source-context">${icon('example')}<span>Questions stay with this lesson · Keeping both sides balanced</span></div><section class="ask-section"><h2>Ask about this step</h2>${questionForm()}</section><div class="export"><button id="export-trigger" class="quiet" aria-expanded="false">${icon('download')}Download checkpoint as…</button></div></section>`;
  bindStages();bindQuestionForm();bindExport();$('#context-source').onclick=()=>showSource(resources[0]);
  $('#repair-step')?.addEventListener('click',()=>changeRepair('repair'));
  $('#signal-correction')?.addEventListener('click',correctSignal);
  $('#back-to-step')?.addEventListener('click',()=>changeRepair('notice'));
  $('#review-work')?.addEventListener('click',()=>changeRepair('repair'));
  $('#reset-episode')?.addEventListener('click',()=>{Object.assign(repair,{step:'notice',nextLine:'',answer:'',hint:false,error:'',attempts:0});state.progress='lesson';go('lesson');});
  if($('#repair-next')){
    $('#repair-next').oninput=event=>{repair.nextLine=event.target.value;$('#repair-form button[type=submit]').disabled=!repair.nextLine.trim();};
    $('#repair-form').onsubmit=event=>{event.preventDefault();if(!repair.nextLine.trim())return;
      if(/^(?:x\s*=\s*)?5\s*$/i.test(repair.nextLine)){repair.error='';changeRepair('try');}
      else{repair.error='Simplify 8 − 3, then write x = your result. This demo checks only that fixed numeric result.';renderLesson();$('#repair-next').setAttribute('aria-invalid','true');$('#repair-next').focus();}
    };
  }
  if($('#transfer-answer')){
    $('#transfer-answer').oninput=event=>{repair.answer=event.target.value;$('#transfer-form button[type=submit]').disabled=!repair.answer.trim();};
    $('#show-hint').onclick=()=>{repair.hint=true;renderLesson();$('#transfer-answer').focus();};
    $('#transfer-form').onsubmit=event=>{event.preventDefault();if(!repair.answer.trim())return;repair.attempts++;
      if(/^(?:x\s*=\s*)?6\s*$/i.test(repair.answer)){repair.error='';changeRepair('done');}
      else{repair.error='That does not balance this equation yet. Subtract 4 from 10 and try again.';repair.hint=true;renderLesson();$('#transfer-answer').setAttribute('aria-invalid','true');$('#transfer-answer').focus();}
    };
  }
};
function changeRepair(step){repair.step=step;repair.error='';state.progress=['try','done'].includes(step)?'practice':'lesson';state.historyView=false;go('lesson');}
function correctSignal(){
  showDialog('What feels difficult?',`<p>The highlighted step is a sample, not a diagnosis. Choose a different focus for this example.</p><div>${['Knowing which operation to use','Working with negative numbers','Keeping both sides balanced'].map(value=>`<button class="signal-choice" data-signal="${esc(value)}">${icon('example')}<span>${esc(value)}</span></button>`).join('')}</div>`);
  $$('[data-signal]').forEach(button=>button.onclick=()=>{repair.signal=button.dataset.signal;repair.corrected=true;closeDialog(false);renderLesson();$('#signal-correction').focus();});
}

renderHome = function(){
  originalHome();
  $('.home-reading h1').innerHTML='What would you like to understand?';
  $('.home-reading h1').insertAdjacentHTML('afterend','<p class="home-subtitle">Start with a question. Add your notes if they help.</p>');
  $('.examples').innerHTML=`<button data-intent="Help me understand algebra.">${icon('example')}Understand a concept</button><button data-intent="Help me prepare for an algebra exam.">${icon('practice')}Prepare for an exam</button><button data-intent="I get stuck when solving one-step equations. Help me repair the step.">${icon('explain')}Practice a weak step</button>`;
  $$('[data-intent]').forEach(button=>button.onclick=()=>{state.goal=button.dataset.intent;$('#goal').value=state.goal;$('#goal').dispatchEvent(new Event('input'));$('#goal').focus();});
  $('.home-reading').insertAdjacentHTML('beforeend',`<section class="resume-learning"><h2>Continue where you left off</h2><button id="resume-repair">${icon('folder')}<span><strong>Algebra foundations</strong><small>Keeping both sides balanced · Repair one step</small></span><span class="continue-label">Continue ${icon('next')}</span></button></section>`);
  $('#resume-repair').onclick=()=>guard(()=>{state.approved=true;state.historyView=false;go('lesson');});
};

referenceMenu = function(trigger){openMenu(trigger,[{icon:'file',label:'Upload a file',action:()=>showUpload('reference')},{icon:'link',label:'Paste a link',action:showLink},{icon:'example',label:'Use an existing reference',action:chooseExisting}]);};
function chooseExisting(){
  const refs=resources.filter(resource=>resource.kind==='reference');
  showDialog('Use an existing reference',`<label class="dialog-label" for="reference-search">Find a reference</label><div class="field-shell"><input id="reference-search" type="search" placeholder="Search sample references"></div><div id="reference-options" class="source-picker"></div><p class="preview-note">Sample references only. Click a reference to use it immediately. Nothing is uploaded or sent to AI.</p>`);
  const paint=()=>{
    const query=$('#reference-search').value.toLowerCase(),matches=refs.filter(resource=>resource.title.toLowerCase().includes(query));
    $('#reference-options').innerHTML=matches.length?matches.map(resource=>`<button data-existing="${resource.id}" aria-pressed="${state.source?.id===resource.id}">${fileIcon(resource.type)}<span><strong>${esc(resource.title)}</strong><small>${esc(resource.meta)}</small></span>${state.source?.id===resource.id?`<span class="selected-label">${icon('check')}Selected</span>`:''}</button>`).join(''):'<p class="muted" role="status">No references match. Try another keyword.</p>';
    $$('[data-existing]').forEach(button=>button.onclick=()=>{state.source=resources.find(resource=>resource.id===button.dataset.existing);closeDialog();paintReference();announce('Reference selected: '+state.source.title);});
  };
  $('#reference-search').oninput=paint;paint();$('#reference-search').focus();
}

renderChat = function(){originalChat();$('.chat-title')?.insertAdjacentHTML('afterend','<p class="compact-status">Algebra foundations / Keeping both sides balanced · This question only</p>');};
renderLibrary = function(){
  originalLibrary();
  const heading=$('#content h1');heading.outerHTML='<div class="resources-heading"><h1>Library</h1><button id="library-add" class="secondary">'+icon('plus')+'Add a reference</button></div>';
  $('#library-add').onclick=()=>showUpload('reference');
  $$('[data-filter]').forEach(button=>{const count=resources.filter(resource=>button.dataset.filter==='all'||resource.kind===button.dataset.filter).length;button.insertAdjacentHTML('beforeend',`<span class="filter-count">${count}</span>`);});
};
paintLibraryRows = function(){
  const query=state.libraryQuery.trim().toLowerCase(),terms=query.split(/\s+/).filter(Boolean);
  const category=resources.filter(resource=>state.filter==='all'||state.filter===resource.kind);
  const matches=category.filter(resource=>terms.every(term=>(resource.title+' '+resource.text+' '+resource.meta).toLowerCase().includes(term)));
  $('#library-count').textContent=`${matches.length} ${matches.length===1?'item':'items'}`;
  $('#library-list').innerHTML=matches.length?matches.map(resource=>`<button class="resource-row" data-resource="${resource.id}">${fileIcon(resource.type)}<span><strong>${esc(resource.title)}</strong><small>${esc(resource.meta)} · ${resource.kind==='reference'?'Available to reuse':'Algebra foundations'}</small></span></button>`).join(''):`<div class="empty"><h2>${query?'No matches for “'+esc(state.libraryQuery)+'”':category.length?'No items':'No '+(state.filter==='note'?'saved explanations':'references')+' yet'}</h2><p>${query?'Try another keyword or clear your search.':'Choose another category or add a reference.'}</p><button id="clear-search" class="secondary">${query?'Clear search':'Show all items'}</button></div>`;
  $$('[data-resource]').forEach(button=>button.onclick=()=>showSource(resources.find(resource=>resource.id===button.dataset.resource)));
  $('#clear-search')?.addEventListener('click',()=>{state.libraryQuery='';state.filter='all';renderLibrary();$('#library-search').focus();});
};

about = function(){showDialog('What this example changes','<p>A separate concept based on THETAWAVE_COMPETITIVE_REVIEW.md. Fixed algebra samples; no backend, AI, private files or account data.</p><h3>Interface changes</h3><p>Visible lesson scope, an annotated incorrect step, a compact repair path, reusable-reference picker and counted Library filters. Existing sidebar style, typed learning pattern, themes and motion remain.</p><h3>New interaction</h3><p>Repair the step, solve a changed equation, open an optional hint and review what the attempt actually shows. Correct the sample difficulty observation.</p><h3>Integration required</h3><p>Real step diagnosis, verified mathematical feedback, hint-use records, editable learner observations and delayed checks need backend and evaluation work. This demo checks only two fixed numeric answers. No mastery score or scheduled reminder is implemented.</p>');};
$('#about').onclick=about;
const earlierStates=$('#preview-states').onclick;
$('#preview-states').onclick=()=>{
  showDialog('Explore the concept','<div class="state-choices"><button id="sample-start">'+icon('home')+'<span>New learning<small>Goal-first start and reusable references</small></span></button><button id="sample-episode">'+icon('explain')+'<span>Find the stuck step<small>Start the sample repair episode</small></span></button><button id="sample-other">'+icon('activity')+'<span>Loading and error states<small>Existing simulated interface examples</small></span></button></div>');
  $('#sample-start').onclick=()=>{closeDialog();guard(()=>go('home'));};
  $('#sample-episode').onclick=()=>{closeDialog();guard(()=>{state.approved=true;changeRepair('notice');});};
  $('#sample-other').onclick=()=>{closeDialog();earlierStates();};
};
state.local.struggle='Keeping both sides balanced.';state.coursePattern.struggle=state.local.struggle;state.saved=snapshot();fillPattern();
state.panel=false;syncPanel(false);render();renderHistory();
