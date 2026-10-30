const proposal = {
  view:'practice', nextOutcome:'success', hold:false, operation:null, lock:[], timer:null,
  answer:'x = 5', work:'I subtracted 3 from both sides.\nx + 3 − 3 = 8 − 3',
  help:'Why do I subtract 3 from both sides?', files:[{name:'My working.md',type:'md'}],
  libraryState:'normal', activityState:'normal'
};
const proposalLibrary=renderLibrary;
const proposalActivity=renderActivity;
const proposalHome=renderHome;
const operationLabels={teach:'Preparing your lesson…',practice:'Writing a practice problem…',submit:'Checking your answer…',help:'Preparing help…'};

function setProposalView(view){
  if(proposal.operation)return;
  proposal.view=view;state.historyView=false;state.progress=view==='practice'||view==='help'?'practice':'lesson';state.approved=true;
  go('lesson');
}
function draftFields(){
  if($('#demo-answer'))proposal.answer=$('#demo-answer').value;
  if($('#demo-work'))proposal.work=$('#demo-work').value;
  if($('#demo-help'))proposal.help=$('#demo-help').value;
  if(proposal.failure){restoreOperationTrigger(proposal.failure);$('#operation-feedback')?.replaceChildren();proposal.failure=null;}
}
function lockProposal(locked){
  if(locked){
    proposal.lock=[$('#proposal-surface'),$('#open-demo-help'),$('.context-line'),$('.workspace-header'),$('.rail'),$('.sidebar'),$('#pattern'),$('#nav-scrim'),$('#panel-scrim')].filter(Boolean).map(node=>({node,inert:node.inert}));
    proposal.lock.forEach(({node})=>node.inert=true);
    $('#proposal-surface').setAttribute('aria-busy','true');
    $('#preview-states').disabled=$('#about').disabled=true;
  }else{
    proposal.lock.forEach(({node,inert})=>node.inert=inert);proposal.lock=[];
    $('#proposal-surface')?.removeAttribute('aria-busy');
    $('#preview-states').disabled=$('#about').disabled=false;
  }
}
function launchOperation(kind,trigger,outcome=proposal.nextOutcome){
  if(proposal.operation)return;
  draftFields();
  const region=$('#operation-feedback');if(!region)return;
  proposal.operation={id:crypto.randomUUID(),kind,trigger,outcome,triggerHTML:trigger.innerHTML};
  region.innerHTML=thinking(operationLabels[kind]);
  region.tabIndex=-1;region.focus({preventScroll:true});
  trigger.style.minInlineSize=trigger.getBoundingClientRect().width+'px';
  trigger.classList.remove('operation-failed');trigger.classList.add('operation-busy');trigger.disabled=true;
  trigger.textContent=kind==='submit'?'Checking…':'Preparing…';trigger.setAttribute('aria-busy','true');
  lockProposal(true);
  $('#finish-preview').hidden=!proposal.hold;
  region.scrollIntoView({block:'nearest',behavior:'instant'});
  announce(operationLabels[kind]);
  if(proposal.hold)$('#finish-preview').focus();
  else{const id=proposal.operation.id;proposal.timer=setTimeout(()=>{if(proposal.operation?.id===id)finishOperation();},1800);}
}
function finishOperation(){
  const operation=proposal.operation;if(!operation)return;
  clearTimeout(proposal.timer);lockProposal(false);proposal.operation=null;$('#finish-preview').hidden=true;
  restoreOperationTrigger(operation);
  const region=$('#operation-feedback');if(!region)return;
  if(operation.outcome!=='success'){
    proposal.failure=operation;
    operation.trigger.disabled=true;operation.trigger.classList.add('operation-failed');
    const unknown=operation.outcome==='unknown';
    const title=unknown?'Completion could not be confirmed':({teach:'The lesson could not be prepared',practice:'The practice problem could not be prepared',submit:'Your answer could not be checked',help:'Help could not be prepared'})[operation.kind];
    const draft=operation.kind==='submit'?'Your answer, reasoning and attachments are still here.':operation.kind==='help'?'Your question is still here.':'Your learning context is still here.';
    region.innerHTML=`<div class="operation-error" role="alert"><h2>${title}</h2><p>${draft} ${unknown?'Check the saved result before sending again.':'This sample failure happened before sending.'}</p><div class="error-actions">${unknown?'<button id="check-saved-result">Check saved result</button>':'<button id="retry-operation">Try again</button>'}<button id="edit-operation">${operation.kind==='submit'?'Edit answer':operation.kind==='help'?'Edit question':'Back to learning'}</button></div></div>`;
    $('#retry-operation')?.addEventListener('click',()=>launchOperation(operation.kind,operation.trigger,'success'));
    $('#edit-operation').onclick=()=>{restoreOperationTrigger(operation);proposal.failure=null;region.replaceChildren();const target=operation.kind==='submit'?$('#demo-answer'):operation.kind==='help'?$('#demo-help'):operation.trigger;if(target?.isConnected)target.focus();};
    $('#check-saved-result')?.addEventListener('click',()=>{
      showDialog('Saved result check','<p>This is an interface example. No request was sent and no result is stored on a server.</p><p>In the real app, reconcile the saved course state before offering to send again.</p><div class="dialog-footer"><button id="return-to-draft" class="secondary">Return to draft</button></div>');
      $('#return-to-draft').onclick=()=>{closeDialog();$('#edit-operation').focus();};
    });
    region.tabIndex=-1;region.focus({preventScroll:true});return;
  }
  if(operation.kind==='teach'){proposal.view='lesson';renderLesson();focusView();announce('Sample lesson ready.');return;}
  if(operation.kind==='practice'){proposal.view='practice';state.progress='practice';renderLesson();$('#demo-answer').focus();announce('Sample practice ready.');return;}
  const message=operation.kind==='submit'
    ?'Subtracting the same amount from both sides keeps the equation balanced. This is fixed sample feedback; your answer has not been graded.'
    :'To remove +3, subtract 3 from both sides. Then simplify 8 − 3. This is a prewritten example, not an AI reply.';
  region.innerHTML=`<div class="operation-success"><h2>${operation.kind==='submit'?'Sample feedback':'One step at a time'}</h2><p>${message}</p><button id="after-operation" class="secondary">${operation.kind==='submit'?'Ask about this step':'Return to my answer'}</button></div>`;
  $('#after-operation').onclick=()=>setProposalView(operation.kind==='submit'?'help':'practice');
  region.tabIndex=-1;region.focus({preventScroll:true});announce('Sample response ready.');
}
function restoreOperationTrigger(operation){
  if(!operation.trigger?.isConnected)return;
  operation.trigger.innerHTML=operation.triggerHTML;operation.trigger.disabled=false;
  operation.trigger.classList.remove('operation-busy','operation-failed');operation.trigger.style.removeProperty('min-inline-size');operation.trigger.removeAttribute('aria-busy');
}
$('#finish-preview').onclick=finishOperation;

renderLesson=function(){
  if(state.historyView){
    content.innerHTML=`<section class="reading proposal-reading">${stages('Review')}${lessonContext()}<h1>Saved lesson</h1><p class="repair-intro">Read-only sample · Keeping both sides balanced</p><p class="proposal-lesson-copy">Doing the same operation to both sides keeps an equation equal.</p><div class="work-sheet"><div class="equation-stack"><div class="work-line">${equation('x + 3 − 3 = 8 − 3')}</div><div class="work-line">${equation('x = 5')}</div></div></div><button id="back-from-review" class="secondary">Return to current step</button></section>`;
    bindStages();$('#context-source').onclick=()=>showSource(resources[0]);$('#back-from-review').onclick=()=>setProposalView(proposal.view);return;
  }
  const view=proposal.view;
  const heading={teach:'Ready to learn this idea?',lesson:'Keeping both sides balanced',practice:'Try this equation',help:'Which step feels unclear?'}[view];
  let body='';
  if(view==='teach'){
    body='<p class="repair-intro">Understand why the same operation belongs on both sides of an equation.</p><div class="proposal-primary-row"><button id="demo-teach" class="ice-button">Teach me this idea</button></div>';
  }else if(view==='lesson'){
    body=`<div class="proposal-lesson-copy"><p>An equation says two expressions are equal. Doing the same operation to both sides keeps that equality true.</p></div><div class="work-sheet"><div class="sheet-heading"><strong>One worked example</strong></div><div class="equation-stack"><div class="work-line">${equation('x + 3 = 8')}</div><div class="work-line">${equation('x + 3 − 3 = 8 − 3')}</div><div class="work-line">${equation('x = 5')}</div></div></div><div class="proposal-primary-row"><button id="demo-practice" class="ice-button">${icon('practice')}Give me practice</button><button id="open-demo-help" class="secondary">Ask about this step</button></div>`;
  }else if(view==='practice'){
    body=`<p class="repair-intro">Find the value of <i>x</i>. Show how you got there.</p><div class="work-sheet"><div class="sheet-heading"><strong>Practice problem</strong><span>Sample</span></div><div class="equation-stack"><div class="work-line">${equation('x + 3 = 8')}</div></div></div><form id="demo-attempt-form" class="proposal-form"><label for="demo-answer">Your answer</label><div class="field-shell"><textarea id="demo-answer" rows="1" placeholder="Write your answer…">${esc(proposal.answer)}</textarea></div><label for="demo-work">Your reasoning</label><div class="field-shell"><textarea id="demo-work" rows="2" placeholder="Show your steps…">${esc(proposal.work)}</textarea></div><div class="proposal-files"><button type="button" id="demo-attach" class="plus" aria-label="Add reasoning attachment" aria-expanded="false">${icon('plus')}</button><div id="demo-files"></div></div><div class="proposal-primary-row"><button type="submit" id="demo-submit" class="attempt-submit" ${proposal.answer.trim()?'':'disabled'}>Submit answer</button><button type="button" id="open-demo-help" class="text-button">I need help with this step</button></div></form>`;
  }else{
    body=`<p class="repair-intro">Ask about this lesson. Your draft stays here if help cannot be prepared.</p><form id="demo-help-form" class="proposal-form"><label for="demo-help">Your question</label><div class="field-shell"><textarea id="demo-help" rows="2" placeholder="Tell me where you are stuck…">${esc(proposal.help)}</textarea></div><div class="proposal-primary-row"><button type="submit" id="demo-help-submit" class="ice-button" ${proposal.help.trim()?'':'disabled'}>Help with this step</button><button type="button" id="return-to-answer" class="text-button">Back to my answer</button></div></form>`;
  }
  content.innerHTML=`<section class="reading proposal-reading">${stages(view==='practice'||view==='help'?'Practice':'Learn')}${lessonContext()}<div id="proposal-surface"><div class="lesson-kicker">Solving one-step equations</div><h1>${heading}</h1>${body}</div><div id="operation-feedback" aria-live="polite" aria-atomic="true"></div><p class="demo-legend">Fixed sample content. Use Preview states to try waiting and failure for Teach, Practice, Submit or Help. No AI request or upload is made.</p></section>`;
  if(view==='practice'){$('#operation-feedback').insertAdjacentElement('afterend',$('#open-demo-help'));$('#open-demo-help').classList.add('deferred-help');$('#open-demo-help').textContent='Need help?';}
  bindStages();$('#context-source').onclick=()=>showSource(resources[0]);
  $('#demo-teach')?.addEventListener('click',event=>launchOperation('teach',event.currentTarget));
  $('#demo-practice')?.addEventListener('click',event=>launchOperation('practice',event.currentTarget));
  $('#open-demo-help')?.addEventListener('click',()=>setProposalView('help'));
  $('#return-to-answer')?.addEventListener('click',()=>setProposalView('practice'));
  if(view==='practice'){
    $('#demo-answer').oninput=()=>{draftFields();$('#demo-submit').disabled=!proposal.answer.trim();};$('#demo-work').oninput=draftFields;
    $('#demo-attempt-form').onsubmit=event=>{event.preventDefault();if($('#demo-answer').value.trim())launchOperation('submit',$('#demo-submit'));};
    $('#demo-attach').onclick=()=>openMenu($('#demo-attach'),[{icon:'file',label:'Add sample working file',action:()=>{proposal.files.push({name:'Extra working.md',type:'md'});paintDemoFiles();announce('Sample attachment added. No file uploaded.');}}]);paintDemoFiles();
  }
  if(view==='help'){
    $('#demo-help').oninput=()=>{draftFields();$('#demo-help-submit').disabled=!proposal.help.trim();};
    $('#demo-help-form').onsubmit=event=>{event.preventDefault();if($('#demo-help').value.trim())launchOperation('help',$('#demo-help-submit'));};
  }
};
function paintDemoFiles(){
  $('#demo-files').innerHTML=proposal.files.map((file,index)=>`<span class="attachment-chip">${fileIcon(file.type)}<span>${esc(file.name)}</span><button type="button" class="remove icon-close" data-remove-demo="${index}" aria-label="Remove ${esc(file.name)}">${icon('close')}</button></span>`).join('');
  $$('[data-remove-demo]').forEach(button=>button.onclick=()=>{proposal.files.splice(Number(button.dataset.removeDemo),1);paintDemoFiles();});
}

renderHome=function(){
  proposalHome();
  $('.home-subtitle')?.remove();$('#page-label').textContent='';
  const home=$('.home-reading'),continuation=$('.resume-learning');
  const hero=document.createElement('div');hero.className='home-first-screen';
  while(home.firstChild&&home.firstChild!==continuation)hero.append(home.firstChild);
  home.prepend(hero);
  $('.resume-learning small').textContent='Keeping both sides balanced · Continue practice';
  $('#resume-repair').onclick=()=>guard(()=>setProposalView('practice'));
};

renderLibrary=function(){
  proposalLibrary();
  paintLibraryRows();
  if(proposal.libraryState==='error'){
    $('#library-list').innerHTML='<div class="operation-error library-demo-error" role="alert"><h2>Library could not load</h2><p>Your search and filters are still here.</p><div class="error-actions"><button id="retry-library">Try again</button></div></div>';
    $('#library-count').textContent='';$('#retry-library').onclick=()=>{proposal.libraryState='normal';renderLibrary();$('#library-search').focus();};
  }
};
paintLibraryRows=function(){
  const all=proposal.libraryState==='empty'?[]:proposal.libraryState==='category-empty'?resources.filter(item=>item.kind!=='note'):resources;
  const terms=state.libraryQuery.trim().toLowerCase().split(/\s+/).filter(Boolean),category=all.filter(item=>state.filter==='all'||item.kind===state.filter);
  const matches=category.filter(item=>terms.every(term=>(item.title+' '+item.text+' '+item.meta).toLowerCase().includes(term)));
  $('#library-count').textContent=`${matches.length} ${matches.length===1?'item':'items'}`;
  const query=state.libraryQuery.trim();
  let emptyTitle='',emptyCopy='',action='',handler=null;
  if(!all.length){emptyTitle='Your library is empty';emptyCopy='Add a reference to use it in your learning.';action='Add a reference';handler=()=>showUpload('reference');}
  else if(!category.length){emptyTitle=state.filter==='note'?'No saved explanations yet':'No references yet';emptyCopy='Other items are available in your library.';action='Show all items';handler=()=>{state.filter='all';state.libraryQuery='';renderLibrary();};}
  else{emptyTitle=`No matches for “${state.libraryQuery}”`;emptyCopy='Try another keyword or clear your search.';action='Clear search';handler=()=>{state.libraryQuery='';renderLibrary();$('#library-search').focus();};}
  $('#library-list').innerHTML=matches.length?matches.map(resource=>`<button class="resource-row" data-resource="${resource.id}">${fileIcon(resource.type)}<span><strong>${esc(resource.title)}</strong><small>${esc(resource.meta)}</small></span></button>`).join(''):`<div class="empty"><h2>${esc(emptyTitle)}</h2><p>${emptyCopy}</p><button id="library-recovery" class="secondary">${action}</button></div>`;
  $$('[data-resource]').forEach(button=>button.onclick=()=>showSource(resources.find(item=>item.id===button.dataset.resource)));
  $('#library-recovery')?.addEventListener('click',handler);
  $$('[data-filter]').forEach(button=>{const count=all.filter(item=>button.dataset.filter==='all'||item.kind===button.dataset.filter).length;const existing=$('.filter-count',button);if(existing)existing.textContent=count;});
};
renderActivity=function(){proposalActivity();$('.reading').insertAdjacentHTML('beforeend','<p class="activity-scope">This example contains sample events from 26–27 October 2026. The current app loads up to 500 recent events; older dates may be outside the available history.</p>');};
paintActivity=function(){
  const outside=state.date&&state.date<'2026-10-26';
  const matches=proposal.activityState==='empty'?[]:events.filter(event=>!state.date||event.date===state.date);
  $('#activity-count').textContent=`${matches.length} sample ${matches.length===1?'event':'events'}`;
  $('#activity-list').innerHTML=matches.length?matches.map((event,index)=>`<button class="event-row" data-proposal-event="${index}">${icon(event.kind==='source'?'file':event.kind==='chat'?'example':'activity')}<span><strong>${esc(event.title)}</strong><small>${esc(event.meta)}</small></span><time datetime="${event.date}T${event.time}">${event.date.slice(8)} Oct · ${event.time}</time></button>`).join(''):`<div class="empty"><h2>${outside?'This date is outside the sample history':proposal.activityState==='empty'?'No activity yet':'No matching events in this view'}</h2><p>${outside?'Older activity may not be in the loaded history.':proposal.activityState==='empty'?'Your learning actions will appear here.':'Choose another date or show all loaded events.'}</p><button id="restore-events" class="secondary">${proposal.activityState==='empty'?'Open sample lesson':'Show all loaded events'}</button></div>`;
  $('#restore-events')?.addEventListener('click',()=>{if(proposal.activityState==='empty')setProposalView('teach');else{state.date='';$('#activity-date').value='';paintActivity();}});
  $$('[data-proposal-event]').forEach(button=>button.onclick=()=>{const event=matches[Number(button.dataset.proposalEvent)];if(event.kind==='source')showSource(resources[0]);else if(event.kind==='chat'){state.thread='why';go('chat');}else setProposalView('lesson');});
};

$('#preview-states').onclick=function(){
  showDialog('Preview controls',`<div class="proposal-config"><p>These controls affect only this local demonstration.</p><label for="demo-outcome">Next action result</label><select id="demo-outcome"><option value="success">Success</option><option value="failure">Failure before sending · Retry available</option><option value="unknown">Completion unknown · Reconcile first</option></select><label class="check-row"><input id="hold-demo-wait" type="checkbox" ${proposal.hold?'checked':''}>Keep the waiting state visible</label><div class="demo-destinations">${[['teach','Teach','Preparing your lesson'],['lesson','Practice','Writing a practice problem'],['practice','Submit','Checking your answer'],['help','Help','Preparing help']].map(([view,label,description])=>`<button data-preview-view="${view}">${icon('example')}<span>${label}<small>${description}</small></span></button>`).join('')}<button data-preview-view="home">${icon('home')}<span>Home<small>Reuse or remove a reference</small></span></button><button data-demo-library="empty">${icon('library')}<span>Empty library</span></button><button data-demo-library="category-empty">${icon('library')}<span>Empty Notes category</span></button><button data-demo-library="error">${icon('alert')}<span>Library load error</span></button><button id="demo-library-normal">${icon('library')}<span>Normal library</span></button><button id="demo-activity-empty">${icon('activity')}<span>Empty activity</span></button><button id="demo-activity-normal">${icon('activity')}<span>Normal activity</span></button></div></div>`);
  $('#demo-outcome').value=proposal.nextOutcome;
  const save=()=>{proposal.nextOutcome=$('#demo-outcome').value;proposal.hold=$('#hold-demo-wait').checked;};
  $$('[data-preview-view]').forEach(button=>button.onclick=()=>{save();closeDialog();guard(()=>button.dataset.previewView==='home'?go('home'):setProposalView(button.dataset.previewView));});
  $$('[data-demo-library]').forEach(button=>button.onclick=()=>{save();closeDialog();guard(()=>{proposal.libraryState=button.dataset.demoLibrary;state.filter=proposal.libraryState==='category-empty'?'note':'all';state.libraryQuery='';go('library');});});
  $('#demo-library-normal').onclick=()=>{save();closeDialog();guard(()=>{proposal.libraryState='normal';state.filter='all';state.libraryQuery='';go('library');});};
  $('#demo-activity-empty').onclick=()=>{save();closeDialog();guard(()=>{proposal.activityState='empty';state.date='';go('activity');});};
  $('#demo-activity-normal').onclick=()=>{save();closeDialog();guard(()=>{proposal.activityState='normal';state.date='';go('activity');});};
};
about=function(){showDialog('What changed in this sample','<p>Based on ui_improvement_proposal.md. Frontend suggestions 1–3 only: visible waiting and nearby errors for four learning actions, existing-reference selection/removal, and accurate empty states.</p><p>Waiting keeps learning controls locked. A visible, accessible status sits outside the locked form; the top preview control can finish a held demonstration.</p><p>All operations are local simulations. Try again is shown for a simulated failure before sending. Completion-unknown shows Check saved result instead. No real POST, deduplication, grading, help tracking or diagnosis is implemented.</p>');};
$('#about').onclick=about;
state.historyView=false;state.progress='practice';render();
