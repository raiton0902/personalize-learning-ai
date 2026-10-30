const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths = {
  home:'<path d="m3 10 9-7 9 7v10h-6v-7H9v7H3z"/>',
  library:'<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><path d="m16 5 4-1 3 15-4 1z"/>',
  activity:'<circle cx="12" cy="12" r="9"/><path d="M12 6v7l-4 3"/>',
  panel:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/>',
  new:'<path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M14 4l3-3 6 6-3 3-6 6-5 1 1-5z"/>',
  folder:'<path d="M3 7V5h6l3 3h9v12H3z"/>', search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  chevron:'<path d="m9 5 7 7-7 7"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>',
  up:'<path d="M12 19V5m-7 7 7-7 7 7"/>', plus:'<path d="M12 4v16M4 12h16"/>',
  settings:'<path d="M3 6h8m5 0h5M3 12h3m5 0h10M3 18h11m5 0h2"/><circle cx="13" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
  file:'<path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h6"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/>',
  link:'<path d="m10 14 4-4m-6 6-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 12a4 4 0 0 0 6 0l5-5a4 4 0 0 0-6-6l-1 1"/>',
  download:'<path d="M12 3v13m-5-5 5 5 5-5M3 17v4h18v-4"/>',
  upload:'<path d="M12 16V3m-5 5 5-5 5 5M3 15v6h18v-6"/>',
  copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  check:'<path d="m5 12 4 4L19 6"/>', back:'<path d="M20 12H4m6-6-6 6 6 6"/>',
  example:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  explain:'<path d="M9 18h6m-5 3h4M8 15a7 7 0 1 1 8 0l-1 3H9z"/>',
  practice:'<path d="m3 8 9-5 9 5-9 5zM6 10v7c4 3 8 3 12 0v-7"/>',
  alert:'<path d="m12 3 10 18H2zM12 9v5m0 3v.1"/>',
  moon:'<path d="M20 14a9 9 0 0 1-10-11A9 9 0 1 0 20 14z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.file}</svg>`;
const fileIcon = type => `<span class="file-mark ${type}" aria-hidden="true">${icon(type === 'image' ? 'image' : 'file')}<b>${({pdf:'PDF',docx:'W',md:'MD',txt:'TXT'})[type] || ''}</b></span>`;
const math = '<span class="math-var">x</span>';
const sampleText = 'A variable is a symbol for a value. In x + 3 = 8, subtract 3 from both sides. Then x = 5.\n\nAn expression, such as x + 3, represents a value. An equation states that two expressions are equal.';
const resources = [
  {id:'notes',title:'Algebra course notes',type:'pdf',kind:'reference',meta:'Reference · Sample PDF',text:sampleText},
  {id:'balance',title:'Keeping both sides balanced',type:'md',kind:'note',meta:'Saved explanation · Equations',text:'An equation is like a balanced scale. Doing the same operation to both sides keeps the equality true.\n\nx + 3 = 8\nx + 3 − 3 = 8 − 3\nx = 5'},
  {id:'variables',title:'Variables and expressions',type:'md',kind:'note',meta:'Saved explanation · Algebra',text:sampleText},
  {id:'exam',title:'Exam revision outline',type:'docx',kind:'reference',meta:'Reference · Sample Word document',text:'Revision outline\n1. Variables and expressions\n2. Solving one-step equations\n3. Checking an answer by substitution'}
];
const events = [
  {date:'2026-10-27',time:'09:42',title:'Asked “Why is it hard?”',meta:'Algebra foundations · Question',kind:'chat'},
  {date:'2026-10-27',time:'09:35',title:'Opened Variables and expressions',meta:'Algebra foundations · Lesson',kind:'lesson'},
  {date:'2026-10-26',time:'16:18',title:'Added Algebra course notes',meta:'Algebra foundations · Reference',kind:'source'}
];
const state = {
  view:'lesson',progress:'lesson',approved:true,historyView:false,theme:'dark',panel:false,
  source:resources[0],goal:'',courseTitle:'Algebra foundations',course:true,openBranches:false,thread:null,
  global:{style:'One example, then let me try.',interests:'Music and games'},local:{struggle:'Turning words into expressions.',context:'Algebra revision',language:''},
  saved:null,coursePattern:{struggle:'Turning words into expressions.',context:'Algebra revision',language:''},threads:[
    {id:'why',title:'Why is it hard?',messages:[{role:'user',text:'Why is it hard?'},{role:'assistant',text:'Algebra uses symbols for values you may not know yet. Start by replacing the symbol with a number: if x = 5, then x + 3 is simply 8.'}],draft:'',operation:null},
    {id:'both',title:'Why subtract both sides?',messages:[{role:'user',text:'Why subtract both sides?'},{role:'assistant',text:'An equation says both sides are equal. Subtracting the same amount from both sides keeps that equality true. Subtracting from only one side would change the balance.'}],draft:'',operation:null}
  ],goalOperation:null,support:null,libraryQuery:'',filter:'all',date:'',practice:{answer:'',work:'',files:[],result:'',diagnostic:'',error:''},nextFailure:false
};
const content = $('#content');
let currentMenu = null, menuTrigger = null, modalReturn = null, exitAction = null, savePending = false, uploadSequence = 0;
let navigation=null;
const announce = text => { $('#live-announcement').textContent = text; };
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const snapshot = () => ({global:{...state.global},local:{...state.local}});
state.saved = snapshot();

function closeMenu(returnFocus = false) {
  currentMenu?.remove(); currentMenu = null;
  menuTrigger?.setAttribute('aria-expanded','false');
  if(returnFocus && menuTrigger?.isConnected) menuTrigger.focus();
  menuTrigger = null;
}
function openMenu(trigger, items) {
  if(menuTrigger === trigger) return closeMenu(true);
  closeMenu(); menuTrigger = trigger; trigger.setAttribute('aria-expanded','true');
  currentMenu = document.createElement('div'); currentMenu.className = 'menu'; currentMenu.setAttribute('role','menu');
  currentMenu.setAttribute('aria-label', trigger.getAttribute('aria-label') || trigger.textContent.trim());
  currentMenu.innerHTML = items.map((item,i) => `<button role="menuitem" data-menu-index="${i}">${item.mark || icon(item.icon || 'file')}${esc(item.label)}${item.shortcut ? `<kbd>${item.shortcut}</kbd>` : ''}</button>`).join('');
  document.body.append(currentMenu);
  positionMenu();
  $$('button',currentMenu).forEach((button,i) => button.onclick = () => { closeMenu(); items[i].action(); });
  $('button',currentMenu).focus();
}
function positionMenu(){
  if(!currentMenu||!menuTrigger?.isConnected)return;
  const anchor=menuTrigger.getBoundingClientRect(),box=currentMenu.getBoundingClientRect();
  const y=anchor.bottom+8+box.height>innerHeight-8?anchor.top-box.height-8:anchor.bottom+8;
  currentMenu.style.left=Math.max(8,Math.min(anchor.left,innerWidth-box.width-8))+'px';
  currentMenu.style.top=Math.max(44,y)+'px';
}
document.addEventListener('pointerdown', event => { if(currentMenu && !currentMenu.contains(event.target) && !menuTrigger?.contains(event.target)) closeMenu(); });
window.addEventListener('resize', () => { cancelWorkspaceMotion();positionMenu(); syncPanel(false); syncSidebar(false); });
document.addEventListener('keydown', event => {
  if(currentMenu && ['Escape','ArrowDown','ArrowUp','Home','End','Tab'].includes(event.key)) {
    if(event.key === 'Escape') { event.preventDefault(); closeMenu(true); return; }
    if(event.key === 'Tab') { closeMenu(); return; }
    event.preventDefault(); const items = $$('button',currentMenu), at = items.indexOf(document.activeElement);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? items.length-1 : (at + (event.key === 'ArrowDown' ? 1 : -1) + items.length)%items.length;
    items[index].focus(); return;
  }
  if(event.key === 'Escape' && !$('#dialog').open) {
    if(!$('#language-editor').hidden) { $('#language-editor').hidden=true; $('#language-toggle').setAttribute('aria-expanded','false'); $('#language-toggle').focus(); }
    else if(state.panel && innerWidth < 1280) requestPanelClose();
    else closeSidebar();
  }
  if(event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.target.matches('textarea,input:not([type=file]):not([type=date]):not([type=search])')) {
    const form = event.target.closest('form');
    if(form) { event.preventDefault(); if(!form.querySelector('button[type=submit]')?.disabled) form.requestSubmit(); }
  }
});
function showDialog(title, html, kind = '') {
  closeMenu(); if($('#dialog').open) $('#dialog').close();
  modalReturn = document.activeElement; $('#dialog').className = kind;
  $('#dialog-title').textContent = title; $('#dialog-content').innerHTML = html;
  $('#dialog').showModal(); $('#dialog-title').tabIndex = -1; $('#dialog-title').focus();
}
function closeDialog(restoreFocus=true) { if(restoreFocus===false)modalReturn=null;$('#dialog').close(); }
$('#close-dialog').onclick = closeDialog; $('#close-dialog').innerHTML=icon('close'); $('#close-dialog').classList.add('icon-close');
$('#dialog').addEventListener('cancel', () => { exitAction=null; });
$('#dialog').addEventListener('close', () => { if(modalReturn?.isConnected) modalReturn.focus(); });
$('#dialog').addEventListener('click', event => {
  if(event.target !== $('#dialog')) return;
  const box=$('#dialog').getBoundingClientRect();
  if(event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) { exitAction=null; closeDialog(); }
});
function errorBlock(message, actions = '') { return `<div class="error-block" role="alert"><div class="error-top">${icon('alert')}<p>${esc(message)}</p></div>${actions ? `<div class="error-actions">${actions}</div>` : ''}</div>`; }
function thinking(label='Thinking…') { return `<div class="thinking" role="status"><span class="thinking-dot" aria-hidden="true"></span><span>${esc(label)}</span></div>`; }

function readPattern() {
  state.global.style=$('#style').value; state.global.interests=$('#interests').value;
  if(state.course) { state.local.struggle=$('#struggle').value; state.local.context=$('#context').value; }
}
function dirty() { return JSON.stringify(snapshot()) !== JSON.stringify(state.saved); }
function paintSave() { const button=$('#save-pattern'); const changed=dirty(); button.textContent=savePending?'Saving…':changed?'Save?':'Saved'; button.disabled=savePending||!changed; button.classList.toggle('dirty',changed); }
function fillPattern() {
  $('#style').value=state.global.style; $('#interests').value=state.global.interests;
  $('#struggle').value=state.local.struggle; $('#context').value=state.local.context;
  $('#language-input').value=state.local.language; $('#language-label').textContent=state.local.language||'Automatic';
  $$('.course-field').forEach(node=>node.hidden=!state.course); paintSave();
}
$$('#preferences input,#preferences textarea').forEach(input=>input.addEventListener('input',()=>{readPattern();paintSave();}));
async function savePattern(after) {
  if(savePending) return; readPattern(); savePending=true; paintSave();
  $$('.stacked-actions button').forEach(button=>button.disabled=true);
  await wait(450); state.saved=snapshot(); if(state.course)state.coursePattern={...state.local}; savePending=false; paintSave(); announce('Learning pattern saved in preview.');
  if(after) after();
}
$('#preferences').onsubmit=event=>{event.preventDefault();savePattern();};
function guard(action) {
  readPattern(); if(!dirty()) return action();
  exitAction=action;
  showDialog('Save your changes?', '<p>Your learning pattern has unsaved changes.</p><div class="stacked-actions"><button id="keep-editing" class="keep-editing">Keep editing</button><button id="discard-changes" class="discard">Discard changes</button><button id="confirm-save" class="confirm-save">Save</button></div>', 'unsaved');
  $('#keep-editing').onclick=()=>{exitAction=null;closeDialog();};
  $('#discard-changes').onclick=()=>{const next=exitAction;exitAction=null;state.global={...state.saved.global};state.local={...state.saved.local};fillPattern();closeDialog();next?.();};
  $('#confirm-save').onclick=()=>savePattern(()=>{const next=exitAction;exitAction=null;closeDialog();next?.();});
}
const surfaceMotion = new WeakMap();
const workspaceMotion=new Map();
function cancelWorkspaceMotion(){workspaceMotion.forEach(animation=>animation.cancel());workspaceMotion.clear();}
function moveWorkspace(update,animate=true){
  const elements=[$('.workspace-header'),$('.reading')].filter(Boolean);
  const before=elements.map(element=>({element,left:element.getBoundingClientRect().left}));
  cancelWorkspaceMotion();update();
  if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const changes=before.map(({element,left})=>({element,offset:left-element.getBoundingClientRect().left}));
  for(const {element,offset} of changes){
    if(Math.abs(offset)<.5)continue;
    const animation=element.animate([{transform:`translateX(${offset}px)`},{transform:'translateX(0)'}],{duration:280,easing:'ease-in-out'});
    workspaceMotion.set(element,animation);
    animation.onfinish=()=>{if(workspaceMotion.get(element)===animation)workspaceMotion.delete(element);};
  }
}
function revealSurface(element, visible, edge=0, animate=true) {
  const previous=surfaceMotion.get(element);
  if(previous?.visible===visible && animate)return;
  const moving=previous?.animation;
  const current=moving?getComputedStyle(element):null;
  const from=moving?{transform:current.transform,opacity:current.opacity}:null;
  moving?.cancel();
  const record={visible,animation:null};surfaceMotion.set(element,record);
  element.inert=!visible;
  if(!previous||!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){
    element.style.removeProperty('display');element.hidden=!visible;return;
  }
  element.hidden=false;element.style.setProperty('display','block','important');
  const hiddenTransform=edge?`translateX(${edge*100}%)`:'none';
  const start=from||{transform:visible?hiddenTransform:'translateX(0)',opacity:edge?1:visible?0:1};
  const end={transform:visible?'translateX(0)':hiddenTransform,opacity:edge?1:visible?1:0};
  const animation=element.animate([start,end],{duration:280,easing:'ease-in-out',fill:'both'});
  record.animation=animation;
  animation.onfinish=()=>{
    if(surfaceMotion.get(element)!==record)return;
    element.hidden=!visible;element.style.removeProperty('display');
    animation.cancel();record.animation=null;
  };
}
function syncSidebar(animate=true){
  const overview=['library','activity'].includes(state.view);
  const visible=innerWidth<800
    ?document.body.classList.contains('mobile-nav')&&(!overview||innerWidth<=600)
    :!overview&&!document.body.classList.contains('sidebar-closed');
  revealSurface($('.sidebar'),visible,-1,animate);
  $('.sidebar').inert=!visible||(innerWidth<1280&&state.panel);
}
function syncPanel(animate=true) {
  moveWorkspace(()=>{
  revealSurface($('#pattern'),state.panel,1);document.body.classList.toggle('panel-open',state.panel);
  revealSurface($('#panel-scrim'),state.panel&&innerWidth<1280);
  $('#personalize').hidden=state.panel||['library','activity'].includes(state.view);
  if(innerWidth<1280 && state.panel) { $('#main').inert=true; $('.sidebar').inert=true; $('.rail').inert=true; }
  else { $('#main').inert=false; $('.sidebar').inert=false; $('.rail').inert=false; }
  syncSidebar();
  },animate);
}
function openPanel() { state.panel=true;syncPanel();$('#pattern-heading').focus(); }
function requestPanelClose() { guard(()=>{state.panel=false;syncPanel();$('#personalize').focus();}); }
$('#personalize').innerHTML=icon('settings')+'<span>Personalize</span>'; $('#personalize').onclick=openPanel;
$('#close-pattern').innerHTML=icon('close');$('#close-pattern').classList.add('icon-close');$('#close-pattern').onclick=requestPanelClose;
$('#panel-scrim').onclick=requestPanelClose;
$('.language-chevron').innerHTML=icon('chevron');
$('#language-toggle').onclick=()=>{const open=$('#language-editor').hidden;$('#language-editor').hidden=!open;$('#language-toggle').setAttribute('aria-expanded',String(open));if(open)$('#language-input').focus();};
function applyLanguage(value){state.local.language=value.trim();$('#language-label').textContent=state.local.language||'Automatic';$('#language-input').value=state.local.language;$('#language-editor').hidden=true;$('#language-toggle').setAttribute('aria-expanded','false');paintSave();$('#language-toggle').focus();}
$('#language-apply').onclick=()=>applyLanguage($('#language-input').value);$('#language-auto').onclick=()=>applyLanguage('');
$('#language-input').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();event.stopPropagation();applyLanguage(event.target.value);}});

function closeSidebar(){document.body.classList.remove('mobile-nav');revealSurface($('#nav-scrim'),false);syncSidebar();$('#main').inert=state.panel&&innerWidth<1280;}
$('#collapse-sidebar').innerHTML=$('#open-sidebar').innerHTML=icon('panel');
$('#collapse-sidebar').onclick=()=>{moveWorkspace(()=>{document.body.classList.add('sidebar-closed');closeSidebar();});$('#open-sidebar').focus();};
$('#open-sidebar').onclick=()=>{if(innerWidth<800){document.body.classList.add('mobile-nav');revealSurface($('#nav-scrim'),true);$('#main').inert=true;syncSidebar();$('#collapse-sidebar').focus();}else moveWorkspace(()=>{document.body.classList.remove('sidebar-closed');syncSidebar();});};
$('#nav-scrim').onclick=closeSidebar;
$('#new-learning').innerHTML=icon('new')+'New learning'; $('#new-learning').onclick=()=>guard(()=>go('home'));
$('#search-icon').innerHTML=icon('search'); $('#history-search').oninput=renderHistory;
$$('[data-route]').forEach(button=>{const label=button.dataset.route[0].toUpperCase()+button.dataset.route.slice(1);button.setAttribute('aria-label',label);button.innerHTML=icon(button.dataset.route)+(button.closest('.mobile-workspace-nav')?label:'');button.onclick=()=>guard(()=>go(button.dataset.route));});
function setTheme() {document.documentElement.classList.add('theme-changing');document.documentElement.dataset.theme=state.theme;for(const button of [$('#theme'),$('#mobile-theme')]){button.innerHTML=icon(state.theme==='dark'?'sun':'moon');button.setAttribute('aria-label',`Switch to ${state.theme==='dark'?'light':'dark'} theme`);}requestAnimationFrame(()=>requestAnimationFrame(()=>document.documentElement.classList.remove('theme-changing')));}
$('#theme').onclick=()=>{state.theme=state.theme==='dark'?'light':'dark';setTheme();};setTheme();
$('#mobile-theme').onclick=$('#theme').onclick;
$('#account').onclick=()=>openMenu($('#account'),[{icon:'home',label:'About this preview',action:about},{icon:'new',label:'Reset sample',action:()=>guard(()=>location.reload())}]);
function renderHistory() {
  const query=$('#history-search').value.trim().toLowerCase(), relevant=state.threads.filter(thread=>thread.title.toLowerCase().includes(query));
  const matches=state.courseTitle.toLowerCase().includes(query), show=matches||relevant.length;
  if(!show){$('#history').innerHTML='<p class="history-empty">No matching learning.</p>';return;}
  const expanded=query?relevant.length>0:state.openBranches;
  $('#history').innerHTML=`<div class="course-row ${['lesson','chat','plan','complete'].includes(state.view)?'current':''}"><button class="course-link" title="${esc(state.courseTitle)}">${icon('folder')}<span>${esc(state.courseTitle)}</span></button><button class="course-expand" aria-label="Questions for ${esc(state.courseTitle)}" aria-expanded="${expanded}">${icon('chevron')}</button></div><div class="question-branches" ${expanded?'':'hidden'}>${(query?relevant:state.threads).map(thread=>`<button class="question-row" data-thread="${thread.id}" title="${esc(thread.title)}" ${state.view==='chat'&&state.thread===thread.id?'aria-current="page"':''}><span>${esc(thread.title)}</span></button>`).join('')}</div>`;
  $('.course-link').onclick=()=>guard(()=>{state.historyView=false;go('lesson');});
  $('.course-expand').onclick=()=>{state.openBranches=!state.openBranches;renderHistory();};
  $$('[data-thread]').forEach(button=>button.onclick=()=>guard(()=>{state.thread=button.dataset.thread;go('chat');}));
}
function focusView(restored=false){
  const target=restored?$('#main'):$('#content h1')||$('#main');
  target.tabIndex=-1;target.focus({preventScroll:true});
  if(restored)announce(($('#content h1')?.innerText||$('#page-label').textContent).replace(/\s+/g,' '));
}
function routeForView(view){return {view,thread:view==='chat'?state.thread:null,review:view==='lesson'&&state.historyView,progress:state.progress};}
function routeFromHash(hash){
  const parts=hash.replace(/^#\/?/,'').split('/');
  if(['home','library','activity'].includes(parts[0]))return {view:parts[0],thread:null,review:false,progress:'lesson'};
  const step=parts[0]==='learn'&&parts[1]==='algebra'?parts[2]:'lesson';
  const thread=step==='questions'&&state.threads.some(item=>item.id===parts[3])?parts[3]:null;
  return {view:thread?'chat':['plan','complete'].includes(step)?step:'lesson',thread,review:step==='review',progress:step==='practice'?'practice':'lesson'};
}
function hashForRoute(route){
  if(['home','library','activity'].includes(route.view))return '#/'+route.view;
  const step=route.view==='chat'?'questions/'+encodeURIComponent(route.thread):route.view==='lesson'?(route.review?'review':route.progress==='lesson'?'lesson':'practice'):route.view;
  return '#/learn/algebra/'+step;
}
function captureVisit(){return {scroll:scrollY,query:state.libraryQuery,filter:state.filter,date:state.date,historyQuery:$('#history-search').value};}
function go(view,options={}) {
  if(options.route){state.thread=options.route.thread;state.historyView=options.route.review;state.progress=options.route.progress;}
  if(navigation&&options.history!==false)navigation.push(view);
  if(options.visit){state.libraryQuery=options.visit.query;state.filter=options.visit.filter;state.date=options.visit.date;$('#history-search').value=options.visit.historyQuery;}
  if($('#dialog').open){exitAction=null;closeDialog(false);}
  closeMenu();closeSidebar();state.view=view;
  if(view==='home'){state.course=false;state.local={struggle:'',context:'',language:''};state.saved=snapshot();fillPattern();}
  else if(['lesson','chat','plan','complete'].includes(view)){if(!state.course){state.local={...state.coursePattern};state.saved=snapshot();}state.course=true;fillPattern();}
  if(['library','activity'].includes(view)||innerWidth<1280)state.panel=false;
  document.body.classList.toggle('overview',['library','activity'].includes(view));
  $$('[data-route]').forEach(button=>{const active=button.dataset.route===(['lesson','chat','plan','complete'].includes(view)?'home':view);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
  $('#page-label').textContent=({home:'New learning',library:'Library',activity:'Activity'})[view]||state.courseTitle;
  $('.workspace-header .stages')?.remove();$('.workspace-header').classList.remove('has-stages');
  syncPanel(false);renderHistory();render();
  if(options.focus!==false)focusView(!!options.visit?.scroll);
  window.scrollTo({top:options.visit?.scroll||0,behavior:'instant'});
}
function render(){({home:renderHome,lesson:renderLesson,plan:renderPlan,chat:renderChat,library:renderLibrary,activity:renderActivity,complete:renderComplete})[state.view]();}
function stages(active='Learn'){
  return `<nav class="stages" aria-label="Learning progress"><button data-saved-plan class="${active==='Plan'?'active':'completed'}" ${active==='Plan'?'aria-current="step"':''} aria-label="View sample plan">${state.approved?icon('check'):''}Plan</button><span class="${active==='Learn'?'active':'unavailable'}" ${active==='Learn'?'aria-current="step"':''}>Learn</span><span class="${active==='Practice'?'active':'unavailable'}" ${active==='Practice'?'aria-current="step"':''}>Practice</span><button data-review class="${active==='Review'?'active':''}" ${active==='Review'?'aria-current="step"':''}>Review</button><span class="counter">Lesson 2 of 3</span></nav>`;
}
function bindStages(){
  const stages=$('.stages',content);
  if(stages){$('.workspace-header .stages')?.remove();$('.workspace-header').classList.add('has-stages');$('.workspace-header').append(stages);}
  $('[data-saved-plan]')?.addEventListener('click',()=>guard(()=>go('plan')));
  $('[data-review]')?.addEventListener('click',()=>guard(()=>{state.historyView=true;go('lesson');}));
}
function renderHome() {
  content.innerHTML=`<section class="reading home-reading"><h1>What would you like<br>to understand?</h1><form id="goal-form" class="composer goal-composer"><textarea id="goal" aria-label="Learning goal" placeholder="Tell me what you want to learn…" maxlength="700">${esc(state.goal)}</textarea><div id="selected-reference"></div><div class="composer-tools"><button id="add-reference" type="button" class="plus" aria-label="Add reference" aria-expanded="false">${icon('plus')}</button><button type="submit" class="send" aria-label="Build sample learning plan" ${state.goal.trim()?'':'disabled'}>${icon('up')}</button></div></form><div class="examples" ${state.goal?'hidden':''}><button data-goal="Help me understand algebra.">Understand algebra</button><button data-goal="Help me revise algebra for an exam.">Prepare for an exam</button><button data-goal="Help me learn algebra from my notes.">Learn from my notes</button></div></section>`;
  paintReference();$('#goal').oninput=event=>{state.goal=event.target.value;$('#goal-form .send').disabled=!state.goal.trim();$('.examples').hidden=!!state.goal;};
  $('#goal-form').onsubmit=event=>{event.preventDefault();if(!state.goal.trim())return;guard(createPlan);};
  $('#add-reference').onclick=()=>referenceMenu($('#add-reference'));
  $$('[data-goal]').forEach(button=>button.onclick=()=>{state.goal=button.dataset.goal;$('#goal').value=state.goal;$('#goal').dispatchEvent(new Event('input'));$('#goal').focus();if(button.textContent==='Learn from my notes'&&!state.source)referenceMenu($('#add-reference'));});
}
function paintReference() {
  if(!$('#selected-reference'))return;
  $('#selected-reference').innerHTML=state.source?`<div class="attachment-chip"><button type="button" id="reference-preview" title="${esc(state.source.title)}">${fileIcon(state.source.type)}<span>${esc(state.source.title)}</span></button><button class="remove icon-close" type="button" id="remove-reference" aria-label="Remove selected reference">${icon('close')}</button></div>`:'';
  $('#reference-preview')?.addEventListener('click',()=>showSource(state.source));
  $('#remove-reference')?.addEventListener('click',()=>{state.source=null;paintReference();});
}
async function createPlan(){
  state.course=true;state.approved=false;state.goalOperation='pending';go('plan');$('#page-label').textContent=state.goal;
  await wait(1800);state.goalOperation=null;
  if(state.view==='plan'){renderPlan();focusView();}
}
function renderPlan(){
  if(state.goalOperation){content.innerHTML=`<section class="reading"><h1>${esc(state.goal)}</h1>${thinking('Preparing your plan…')}<p class="preview-note">Simulated preview. The example plan is fixed algebra content.</p></section>`;return;}
  content.innerHTML=`<section class="reading">${stages('Plan')}<h1>${state.approved?'Your learning plan':'A plan for your learning'}</h1><p class="muted">Sample algebra curriculum</p><ol class="plan-list"><li><span>01</span><div><strong>Keeping both sides balanced</strong><p>Understand why an equation stays equal.</p></div></li><li><span>02</span><div><strong>Variables and expressions</strong><p>Use symbols to represent values.</p></div></li><li><span>03</span><div><strong>Solving one-step equations</strong><p>Find and check an unknown value.</p></div></li></ol><button id="accept-plan" class="primary">${state.approved?'Return to lesson':'Accept sample plan'}</button></section>`;
  bindStages();$('#accept-plan').onclick=()=>{state.approved=true;state.progress='lesson';state.historyView=false;go('lesson');};
}
function copyButton(text){return `<button class="copy-answer" type="button" aria-label="Copy answer" data-copy="${esc(text)}" title="Copy answer">${icon('copy')}<span></span></button>`;}
function bindCopies(){ $$('.copy-answer').forEach(button=>button.onclick=async()=>{try{await navigator.clipboard.writeText(button.dataset.copy);button.innerHTML=icon('check')+'<span>Copied</span>';announce('Copied');setTimeout(()=>{if(button.isConnected)button.innerHTML=icon('copy')+'<span></span>';},1500);}catch{button.innerHTML='<span>Could not copy. Select the text above.</span>';}}); }
function renderLesson(){
  if(!state.approved){state.view='plan';renderPlan();return;}
  if(state.progress!=='lesson'&&!state.historyView){renderPractice();return;}
  const history=state.historyView;
  content.innerHTML=`<section class="reading">${stages(history?'Review':'Learn')}${history?'<div class="history-notice"><span>Saved lesson · Read only</span><button id="return-current">Return to current step</button></div>':''}<h1>${history?'Keeping both sides balanced':'Variables and expressions'}</h1><button id="lesson-source" class="source-chip">${fileIcon('pdf')}<span>Algebra course notes</span></button><p class="intro">${history?'An equation says two expressions are equal. Doing the same operation to both sides keeps them balanced.':`A <strong>variable</strong> is a symbol for a value. In ${math} + 3 = 8, ${math} is the missing value. An <strong>expression</strong>, like ${math} + 3, represents a value.`}</p><div class="worked"><h2>One worked example</h2><p class="equation">${math} + 3 = 8</p><p class="step"><span class="step-number">1</span>Subtract 3 from both sides.</p><p class="step"><span class="step-number">2</span>Simplify to find the missing value.</p><p class="result">${math} = 5</p></div>${history?'':`<div class="lesson-actions"><button id="explain-simply">${icon('explain')}Explain simply</button><button id="another-example">${icon('example')}Another example</button><button id="give-practice" class="primary">${icon('practice')}Give me practice</button></div><div id="support-result"></div><section class="ask-section"><h2>Ask about this lesson</h2>${questionForm()}</section>`}<div class="export"><button id="export-trigger" class="quiet" aria-expanded="false">${icon('download')}Download checkpoint as…</button></div></section>`;
  $('.worked .step').insertAdjacentHTML('afterend',`<p class="operation-equation">${math} + 3 − 3 = 8 − 3</p>`);
  bindStages();$('#lesson-source').onclick=()=>showSource(resources[0]);bindExport();
  $('#return-current')?.addEventListener('click',()=>{state.historyView=false;go('lesson');});
  if(history)return;
  $('#give-practice').onclick=()=>guard(()=>{state.progress='practice';go('lesson');});
  $('#explain-simply').onclick=()=>showSupport('simple');$('#another-example').onclick=()=>showSupport('example');
  bindQuestionForm();
}
function questionForm(){return `<form id="question-form" class="composer question-composer"><textarea id="question-input" aria-label="Ask about this lesson" placeholder="Ask about this lesson…" maxlength="1000" rows="1"></textarea><div class="composer-tools"><button type="submit" class="send" aria-label="Send question" disabled>${icon('up')}</button></div></form>`;}
function bindQuestionForm(){
  $('#question-input').oninput=event=>{$('#question-form .send').disabled=!event.target.value.trim();event.target.style.height='auto';event.target.style.height=Math.min(event.target.scrollHeight,140)+'px';};
  $('#question-form').onsubmit=event=>{event.preventDefault();const question=$('#question-input').value.trim();if(!question)return;guard(()=>startQuestion(question));};
}
async function showSupport(kind){
  const target=$('#support-result');if(!target||target.dataset.pending)return;target.dataset.pending='true';$('#explain-simply').disabled=$('#another-example').disabled=true;target.innerHTML=thinking(kind==='simple'?'Preparing a simpler explanation…':'Preparing an example…');
  await wait(1200);if(!target.isConnected)return;
  const text=kind==='simple'?'Think of x as a box with a number inside. If the box plus 3 equals 8, the number in the box is 5.':'You have x songs in a playlist and add 3 more. The expression x + 3 tells you how many songs you have now. If the total is 8, you started with 5.';
  target.innerHTML=`<p class="support-copy">${esc(text)}</p><div class="answer-actions">${copyButton(text)}</div>`;delete target.dataset.pending;$('#explain-simply').disabled=$('#another-example').disabled=false;bindCopies();
}
function getThread(){return state.threads.find(thread=>thread.id===state.thread);}
function startQuestion(question, mode='normal'){
  let thread=state.threads.find(item=>item.title.toLowerCase()===question.toLowerCase());
  if(thread&&mode==='normal'){
    showDialog('You asked this before','<p>Open the saved answer, or ask it as a separate question.</p><div class="dialog-footer"><button id="ask-separately" class="secondary">Ask separately</button><button id="open-answer" class="primary">Open previous answer</button></div>');
    $('#open-answer').onclick=()=>{closeDialog();state.thread=thread.id;go('chat');};$('#ask-separately').onclick=()=>{closeDialog();startQuestion(question,'separate');};return;
  }
  thread={id:'q'+Date.now(),title:question,messages:[],draft:question,operation:null};state.threads.push(thread);state.thread=thread.id;state.course=true;go('chat');sendReply(thread,question,mode);
}
function renderChat(){
  const thread=getThread();if(!thread)return go('lesson');
  const waiting=['pending','topic'].includes(thread.operation?.status);
  content.innerHTML=`<section class="reading"><button class="back-link" id="back-lesson">${icon('back')}Back to lesson</button><h1 class="chat-title">${esc(thread.title)}</h1><div id="chat-log">${thread.messages.map(message=>messageHTML(message)).join('')}${operationHTML(thread)}</div><form id="reply-form" class="composer chat-compose"><textarea id="reply-input" aria-label="Reply in this question chat" placeholder="${waiting?'Waiting for this reply…':'Ask your next question…'}" maxlength="1000" ${waiting?'disabled':''}>${waiting?'':esc(thread.draft)}</textarea><div class="composer-tools"><span class="hint">This learning: ${esc(state.courseTitle)}</span><button type="submit" class="send" aria-label="Send chat reply" ${!thread.draft.trim()||waiting?'disabled':''}>${icon('up')}</button></div></form><button class="jump-latest" aria-label="Jump to latest" hidden>${icon('up')}</button></section>`;
  $('#back-lesson').onclick=()=>guard(()=>{state.historyView=false;go('lesson');});
  $('#reply-input').oninput=event=>{thread.draft=event.target.value;$('#reply-form .send').disabled=!thread.draft.trim()||['pending','topic'].includes(thread.operation?.status);event.target.style.height='auto';event.target.style.height=Math.min(event.target.scrollHeight,140)+'px';};
  $('#reply-form').onsubmit=event=>{event.preventDefault();const text=thread.draft.trim();if(text&&!['pending','topic'].includes(thread.operation?.status))sendReply(thread,text);};
  $('#retry-reply')?.addEventListener('click',()=>sendReply(thread,thread.operation.text,'retry'));
  $('#edit-reply')?.addEventListener('click',()=>{thread.draft=thread.operation.text;thread.operation=null;renderChat();$('#reply-input').focus();});
  $('#finish-wait')?.addEventListener('click',()=>finishReply(thread));
  $('#topic-no')?.addEventListener('click',()=>{thread.operation=null;thread.draft='';if(!thread.messages.length){state.threads=state.threads.filter(item=>item!==thread);state.thread=null;go('lesson');}else renderChat();announce('Pending question discarded. Saved messages retained.');renderHistory();});
  $('#topic-yes')?.addEventListener('click',()=>{const text=thread.operation.text;thread.operation=null;state.courseTitle='New learning from your question';state.goal=text;state.approved=false;state.local={struggle:'',context:'',language:''};state.saved=snapshot();fillPattern();thread.messages.push({role:'user',text},{role:'assistant',text:'This preview keeps your question with the new learning. In the app, a new plan and a relevant reply would be generated after your confirmation.'});go('plan');});
  bindCopies();updateJump();
}
function messageHTML(message){return `<article class="chat-message ${message.role}"><div class="role-label">${message.role==='user'?'You':'Personal Learning'}</div><p>${esc(message.text)}</p>${message.role==='assistant'?`<div class="answer-actions">${copyButton(message.text)}</div>`:''}</article>`;}
function operationHTML(thread){
  const operation=thread.operation;if(!operation)return '';
  if(operation.status==='topic')return `<div class="topic-card"><p>This question is about another topic. Start a new learning?</p><div class="topic-actions"><button id="topic-no" class="secondary">No</button><button id="topic-yes" class="primary">Yes, start new learning</button></div></div>`;
  return `<article class="chat-message user pending-card"><div class="role-label">You <span>${operation.status==='error'?'· Not saved':''}</span></div><p>${esc(operation.text)}</p></article><div class="role-label">Personal Learning</div>${operation.status==='pending'?thinking()+(operation.hold?'<button id="finish-wait" class="quiet">Finish simulated reply</button>':''):errorBlock('The reply could not be completed. Your question is still here.','<button id="retry-reply">Retry</button><button id="edit-reply">Edit question</button>')}`;
}
async function sendReply(thread,text,mode='normal'){
  const requestId=mode==='retry'&&thread.operation?thread.operation.id:crypto.randomUUID();
  thread.draft=text;thread.operation={id:requestId,text,status:'pending',hold:mode==='hold'};
  if(state.view==='chat'&&state.thread===thread.id)renderChat();
  if(mode==='hold')return;
  await wait(1800);if(thread.operation?.id!==requestId)return;
  if(mode==='error'||state.nextFailure){state.nextFailure=false;thread.operation.status='error';}
  else if(/\b(python|javascript|coding|programming)\b/i.test(text)){thread.operation.status='topic';}
  else return finishReply(thread);
  if(state.view==='chat'&&state.thread===thread.id)renderChat();
}
function finishReply(thread){
  const text=thread.operation?.text;if(!text)return;
  const answer=/why.*hard|difficult/i.test(text)?'Algebra is unfamiliar because a letter can stand for a value. Try a number first: if x = 5, then x + 3 = 8. The letter lets the same idea work with different numbers.':/both|subtract/i.test(text)?'Both sides must stay equal. Subtracting 3 from each side changes x + 3 = 8 into x = 5 while keeping the balance.':'A variable represents a value; an expression combines values and operations. In x + 3 = 8, subtract 3 from both sides to get x = 5. Try replacing x with 5 to check it.';
  const nearBottom=document.documentElement.scrollHeight-window.scrollY-innerHeight<80;
  thread.messages.push({role:'user',text},{role:'assistant',text:answer});thread.draft='';thread.operation=null;
  if(state.view==='chat'&&state.thread===thread.id){const y=scrollY;renderChat();if(nearBottom)$('#reply-input').scrollIntoView({block:'end',behavior:'instant'});else window.scrollTo(0,y);}
  renderHistory();announce('Sample reply ready.');
}
function updateJump(){const button=$('.jump-latest');if(button){button.hidden=document.documentElement.scrollHeight-window.scrollY-innerHeight<80;button.onclick=()=>$('#reply-input').scrollIntoView({block:'end',behavior:'smooth'});}}
window.addEventListener('scroll',updateJump,{passive:true});

function renderPractice(){
  const practice=state.practice;
  content.innerHTML=`<section class="reading">${stages('Practice')}<h1>${practice.result==='diagnostic'?'Check one step':'Try it yourself'}</h1><p class="intro">Find the value of ${math}.</p><div class="worked"><h2>Practice problem</h2><p class="equation">${math} + 4 = 10</p></div><form id="practice-form" class="practice-form"><label for="practice-answer">Your answer</label><div class="field-shell"><textarea id="practice-answer" placeholder="Write your answer" maxlength="900">${esc(practice.answer)}</textarea></div><label for="practice-work">Show your reasoning</label><div class="field-shell"><textarea id="practice-work" placeholder="How did you get there?" maxlength="1400">${esc(practice.work)}</textarea></div><div class="reasoning-tools"><button id="reasoning-add" class="plus" aria-label="Add reasoning attachment" type="button" aria-expanded="false">${icon('plus')}</button><div id="reasoning-files"></div></div><button type="submit" class="attempt-submit" ${practice.answer.trim()?'':'disabled'}>Submit</button></form><div id="practice-result"></div></section>`;
  bindStages();paintReasoningFiles();
  $('#practice-answer').oninput=event=>{practice.answer=event.target.value;$('#practice-form .attempt-submit').disabled=!practice.answer.trim();};
  $('#practice-work').oninput=event=>practice.work=event.target.value;
  $('#reasoning-add').onclick=()=>openMenu($('#reasoning-add'),[{icon:'file',label:'Upload reasoning file',action:()=>showUpload('reasoning')},{icon:'image',label:'Upload an image',action:()=>showUpload('reasoning-image')}]);
  $('#practice-form').onsubmit=event=>{event.preventDefault();if(!practice.answer.trim())return;showDialog('Submit this attempt?',`<p>Review your answer before checking this sample problem.</p><div class="confirmation-summary"><h3>Your answer</h3><p>${esc(practice.answer)}</p><h3>Your reasoning</h3><p>${esc(practice.work||'No typed reasoning')}</p>${practice.files.length?`<p>${practice.files.length} sample attachment(s)</p>`:''}</div><div class="confirmation-actions"><button id="cancel-attempt" class="secondary">Cancel</button><button id="confirm-attempt" class="attempt-submit">Submit</button></div>`);$('#cancel-attempt').onclick=closeDialog;$('#confirm-attempt').onclick=()=>{closeDialog();checkPractice();};};
  if(practice.result)paintPracticeResult();
}
async function checkPractice(){
  const answer=state.practice.answer.trim(),form=$('#practice-form'),target=$('#practice-result');target.innerHTML=thinking('Checking your reasoning…');form.inert=true;$('#practice-form .attempt-submit').disabled=true;await wait(1500);
  state.practice.result=/^(?:x\s*=\s*)?6\s*$/i.test(answer)?'correct':'diagnostic';form.inert=false;
  if(target.isConnected)paintPracticeResult();
}
function paintPracticeResult(){
  const target=$('#practice-result');if(!target)return;
  if(state.practice.result==='correct'){
    target.innerHTML=`<div class="support-copy"><h2>That value works.</h2><p>Substituting 6 gives 6 + 4 = 10. This checks the sample answer; it does not measure mastery.</p><button id="finish-lesson" class="primary">Finish sample lesson</button></div>`;$('#finish-lesson').onclick=()=>go('complete');
  }else{
    target.innerHTML=`<div class="support-copy"><h2>Let’s check one step.</h2><p>What happens when you subtract 4 from both sides?</p><form id="diagnostic-form"><div class="field-shell"><textarea id="diagnostic" aria-label="Your next step" placeholder="Write the next step…">${esc(state.practice.diagnostic)}</textarea></div><button type="submit" class="secondary" style="margin-top:12px">Help with this step</button></form><div id="repair-result"></div></div>`;
    $('#diagnostic').oninput=event=>state.practice.diagnostic=event.target.value;
    $('#diagnostic-form').onsubmit=async event=>{event.preventDefault();if(!state.practice.diagnostic.trim())return;$('#repair-result').innerHTML=thinking('Working through this step…');await wait(1200);if(!$('#repair-result'))return;$('#repair-result').innerHTML='<p style="margin-top:16px">Subtracting 4 leaves x = 10 − 4, so x = 6.</p><button id="return-answer" class="secondary">Return to your answer</button>';$('#return-answer').onclick=()=>{state.practice.result='';renderPractice();$('#practice-answer').focus();};};
  }
  $('#practice-form .attempt-submit').disabled=false;
}
function paintReasoningFiles(){
  $('#reasoning-files').innerHTML=state.practice.files.map((file,i)=>`<div class="attachment-chip"><button type="button" data-file-preview="${i}" aria-label="Review extracted text for ${esc(file.title)}">${fileIcon(file.type)}<span>${esc(file.title)}</span></button><button type="button" class="remove icon-close" data-remove-file="${i}" aria-label="Remove ${esc(file.title)}">${icon('close')}</button></div>`).join('');
  $$('[data-file-preview]').forEach(button=>button.onclick=()=>showSource(state.practice.files[Number(button.dataset.filePreview)],true));
  $$('[data-remove-file]').forEach(button=>button.onclick=()=>{state.practice.files.splice(Number(button.dataset.removeFile),1);paintReasoningFiles();});
}
function renderComplete(){content.innerHTML=`<section class="reading completion">${stages('Review')}${icon('check')}<h1>A good place to pause.</h1><p class="intro">You’ve reached the end of this sample lesson.</p><h2>Your checkpoint</h2><ul><li>A variable represents a value.</li><li>An expression combines values and operations.</li><li>The same operation on both sides keeps an equation balanced.</li></ul><div class="lesson-actions"><button id="review-lesson" class="secondary">Review lesson</button><button id="start-another" class="primary">Start new learning</button></div><div class="export"><button id="export-trigger" class="quiet" aria-expanded="false">${icon('download')}Download checkpoint as…</button></div></section>`;bindStages();bindExport();$('#review-lesson').onclick=()=>{state.historyView=true;go('lesson');};$('#start-another').onclick=()=>guard(()=>go('home'));}

function referenceMenu(trigger){openMenu(trigger,[{icon:'file',label:'Upload a file',action:()=>showUpload('reference')},{icon:'link',label:'Paste a link',action:showLink},{icon:'example',label:'Use sample notes',action:()=>{state.source=resources[0];paintReference();}}]);}
function showUpload(destination='reference',scenario=''){
  const sequence=++uploadSequence;
  const reasoning=destination.startsWith('reasoning');
  showDialog(reasoning?'Add your reasoning':'Add a reference',`<div id="dropzone" class="dropzone">${icon('upload')}<p>Drop a file here</p><small>${destination==='reasoning-image'?'PNG, JPG or WEBP · Up to 2 MB':'PDF, DOCX, TXT or Markdown · Up to 2 MB'}</small><button id="choose-file" class="secondary">Choose file</button><input id="file-picker" type="file" accept="${destination==='reasoning-image'?'.png,.jpg,.jpeg,.webp':'.pdf,.docx,.txt,.md,.srt,.vtt'}" hidden></div><div id="upload-state"></div><p class="preview-note">This preview checks the file name and size only. Extraction is simulated; no file is uploaded.</p>`);
  $('#choose-file').onclick=()=>$('#file-picker').click();
  $('#file-picker').onchange=event=>{const file=event.target.files[0];if(file)processSelection(file,destination,sequence);else $('#choose-file').focus();};
  $('#dropzone').ondragover=event=>{event.preventDefault();$('#dropzone').classList.add('drag');};
  $('#dropzone').ondragleave=()=>$('#dropzone').classList.remove('drag');
  $('#dropzone').ondrop=event=>{event.preventDefault();$('#dropzone').classList.remove('drag');if(event.dataTransfer.files[0])processSelection(event.dataTransfer.files[0],destination,sequence);};
  if(scenario==='loading')processSelection({name:'Algebra course notes.pdf',size:12000},destination,sequence,true);
  if(scenario==='error')uploadError('This document exceeds 2 MB. Choose a smaller file.');
}
function uploadError(message){$('#upload-state').innerHTML=errorBlock(message,'<button id="choose-another">Choose another file</button>');$('#choose-another').onclick=()=>$('#file-picker').click();}
async function processSelection(file,destination,sequence,hold=false){
  const extension=file.name.split('.').pop().toLowerCase(),reasoning=destination.startsWith('reasoning');
  const allowed=destination==='reasoning-image'?['png','jpg','jpeg','webp']:['pdf','docx','txt','md','srt','vtt'];
  if(!allowed.includes(extension))return uploadError(/mp4|webm|mov/.test(extension)?'Video transcription is unavailable in this preview. Add a transcript instead.':'Choose a supported document or image for this action.');
  if(!file.size)return uploadError('This file is empty. Choose a file with content.');
  if(file.size>2*1024*1024)return uploadError('This document exceeds 2 MB. Choose a smaller file.');
  if(reasoning&&state.practice.files.length>=3)return uploadError('Up to three reasoning attachments can be selected. Remove one first.');
  const type=['png','jpg','jpeg','webp'].includes(extension)?'image':extension==='docx'?'docx':extension==='pdf'?'pdf':'md';
  const renderReady=()=>{
    if(sequence!==uploadSequence||!$('#upload-state'))return;
    const resource={id:'local-'+Date.now(),title:file.name,type,kind:'reference',meta:'Locally selected · Sample extraction',text:reasoning?'Sample extracted reasoning\nI subtract 4 from both sides.\nx + 4 − 4 = 10 − 4\nx = 6':'Sample extraction only. The selected file has not been read.\n\n'+sampleText};
    $('#upload-state').innerHTML=`<div class="upload-row">${fileIcon(type)}<div><strong>${esc(file.name)}</strong><small>Sample preview ready</small></div>${icon('check')}</div><div class="dialog-footer"><button id="preview-extraction" class="secondary">Review sample text</button><button id="use-file" class="primary">${reasoning?'Attach to reasoning':'Use this reference'}</button></div>`;
    $('#preview-extraction').onclick=()=>showSource(resource,reasoning,()=>{showUpload(destination);processSelection(file,destination,uploadSequence);});
    $('#use-file').onclick=()=>{if(reasoning){state.practice.files.push(resource);paintReasoningFiles();}else{state.source=resource;paintReference();}closeDialog();announce('Sample attachment selected.');};
  };
  $('#upload-state').innerHTML=`<div class="upload-row">${fileIcon(type)}<div><strong>${esc(file.name)}</strong>${thinking('Preparing sample text…')}</div></div>${hold?'<div class="dialog-footer"><button id="finish-extraction" class="secondary">Finish simulated extraction</button></div>':''}`;
  if(hold){$('#finish-extraction').onclick=renderReady;return;}
  await wait(1300);renderReady();
}
function showLink(){
  showDialog('Add a reference link','<form id="link-form" novalidate><label class="dialog-label" for="reference-link">Reference URL</label><div class="field-shell"><input id="reference-link" type="url" aria-describedby="link-error" placeholder="https://example.com/notes"></div><div id="link-error"></div><p class="preview-note">A local label only. This preview does not fetch the page.</p><div class="dialog-footer"><button type="submit" class="primary">Add reference</button></div></form>');
  const input=$('#reference-link');input.focus();
  input.oninput=()=>{input.removeAttribute('aria-invalid');$('#link-error').replaceChildren();};
  $('#link-form').onsubmit=event=>{
    event.preventDefault();
    try{
      const url=new URL(input.value);
      if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw Error();
      state.source={id:'url',title:url.hostname+' notes',type:'txt',text:'Sample reference preview. This URL has not been fetched.\n\n'+sampleText,meta:'Link label only'};
      paintReference();closeDialog();
    }catch{
      $('#link-error').innerHTML=errorBlock('Enter a complete HTTP or HTTPS link.');
      input.setAttribute('aria-invalid','true');input.focus();
    }
  };
}
function showSource(resource,reasoning=false,onBack=null){
  showDialog(reasoning?'Review extracted text':resource.title,`<p>${esc(reasoning?'Sample extracted text · '+resource.text.length+' characters':resource.meta||'Sample reference')} </p><div class="source-copy">${esc(resource.text)}</div><div class="dialog-footer">${onBack?'<button id="source-back" class="secondary">Back to attachment</button>':''}${!reasoning?'<button id="use-reference" class="primary">Use as reference</button>':''}</div>`,'dialog-source');
  $('#source-back')?.addEventListener('click',onBack);
  $('#use-reference')?.addEventListener('click',()=>guard(()=>{state.source=resource;closeDialog();go('home');}));
}
function bindExport(){const trigger=$('#export-trigger');if(!trigger)return;trigger.onclick=()=>openMenu(trigger,['md','docx','pdf'].map(type=>({mark:fileIcon(type),label:({md:'Markdown (.md)',docx:'Word (.docx)',pdf:'PDF (.pdf)'})[type],action:()=>download(type)})));}
function download(type){
  const anchor=document.createElement('a');anchor.href='samples/sample-checkpoint.'+type;anchor.download='sample-checkpoint.'+type;anchor.click();announce('Sample '+type.toUpperCase()+' checkpoint download started.');
}

function renderLibrary(){
  content.innerHTML=`<section class="reading"><h1>Library</h1><div class="list-toolbar"><div class="field-shell search-shell">${icon('search')}<input id="library-search" type="search" placeholder="Search references and saved explanations" aria-label="Search library" value="${esc(state.libraryQuery)}"></div></div><div class="filters" aria-label="Library filters">${[['all','All'],['reference','References'],['note','Notes']].map(([key,title])=>`<button data-filter="${key}" aria-pressed="${state.filter===key}">${title}</button>`).join('')}</div><p id="library-count" class="list-count" role="status"></p><div id="library-list"></div></section>`;
  $('#library-search').oninput=event=>{state.libraryQuery=event.target.value;paintLibraryRows();};
  $$('[data-filter]').forEach(button=>button.onclick=()=>{state.filter=button.dataset.filter;$$('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));paintLibraryRows();});paintLibraryRows();
}
function paintLibraryRows(){
  const terms=state.libraryQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches=resources.filter(resource=>(state.filter==='all'||state.filter===resource.kind)&&terms.every(term=>(resource.title+' '+resource.text+' '+resource.meta).toLowerCase().includes(term)));
  $('#library-count').textContent=`${matches.length} ${matches.length===1?'item':'items'}`;
  $('#library-list').innerHTML=matches.length?matches.map(resource=>`<button class="resource-row" data-resource="${resource.id}">${fileIcon(resource.type)}<span><strong>${esc(resource.title)}</strong><small>${esc(resource.meta)}</small></span></button>`).join(''):`<div class="empty"><h2>No matching items</h2><p>Try another keyword or clear the filter.</p><button id="clear-search" class="secondary">Clear search and filters</button></div>`;
  $$('[data-resource]').forEach(button=>button.onclick=()=>showSource(resources.find(resource=>resource.id===button.dataset.resource)));
  $('#clear-search')?.addEventListener('click',()=>{state.libraryQuery='';state.filter='all';renderLibrary();$('#library-search').focus();});
}
function renderActivity(){
  content.innerHTML=`<section class="reading"><h1>Activity</h1><div class="date-control"><label for="activity-date">Date</label><div class="field-shell"><input id="activity-date" type="date" value="${state.date}"></div><button id="all-dates">All dates</button></div><p id="activity-count" class="list-count" role="status"></p><div id="activity-list"></div></section>`;
  $('#activity-date').onchange=event=>{state.date=event.target.value;paintActivity();};$('#all-dates').onclick=()=>{state.date='';$('#activity-date').value='';paintActivity();};paintActivity();
}
function paintActivity(){
  const matches=events.filter(event=>!state.date||event.date===state.date);$('#activity-count').textContent=`${matches.length} sample ${matches.length===1?'event':'events'}`;
  $('#activity-list').innerHTML=matches.length?matches.map((event,index)=>`<button class="event-row" data-event="${index}">${icon(event.kind==='source'?'file':event.kind==='chat'?'example':'activity')}<span><strong>${esc(event.title)}</strong><small>${esc(event.meta)}</small></span><time datetime="${event.date}T${event.time}">${event.date==='2026-10-27'?'27 Oct':'26 Oct'} · ${event.time}</time></button>`).join(''):'<div class="empty"><h2>No activity on this date</h2><p>Choose another date, or select All dates.</p></div>';
  $$('[data-event]').forEach(button=>button.onclick=()=>{const event=matches[Number(button.dataset.event)];if(event.kind==='source')showSource(resources[0]);else if(event.kind==='chat'){state.thread='why';go('chat');}else{state.historyView=false;go('lesson');}});
}
function about(){showDialog('A detail-first interface','<p>A separate preview based on UI_UX_DETAIL_REVIEW.md. All lessons, conversations, dates and accounts here are sample content. Responses and extraction are simulated locally.</p><h3>Visual changes</h3><p>Stable reading width, compact stages, file-type icons, quieter controls, aligned loading, focus and hover states.</p><h3>New frontend behavior</h3><p>Recoverable inline errors, retained drafts, keyboard menus, copy feedback, source chips, guarded navigation and editable goal starters.</p><h3>Integration work</h3><p>Real upload phases, safe retries, cancellation, source citations and generated support modes need explicit backend or AI wiring. None is connected here.</p>');}
$('#about').onclick=about;
$('#preview-states').onclick=()=>{
  showDialog('Try an interface state','<p>These controls simulate a state without calling an AI or uploading files.</p><div class="state-choices">'+[
    ['wait','activity','Reply loading','Keep the indicator visible until you finish it.'],
    ['failure','alert','Reply failed','Keep the question and offer Retry or Edit.'],
    ['upload','upload','Reference processing','Inspect a simulated file-reading row.'],
    ['upload-error','file','Upload failed','See an error inside the active dialog.'],
    ['unsaved','settings','Unsaved changes','Try Keep editing, Discard changes or Save.'],
    ['complete','check','Lesson completed','Review or download the sample checkpoint.']
  ].map(([id,mark,title,copy])=>`<button data-scenario="${id}">${icon(mark)}<span>${title}<small>${copy}</small></span></button>`).join('')+'</div>');
  $$('[data-scenario]').forEach(button=>button.onclick=()=>{const scenario=button.dataset.scenario;closeDialog();guard(()=>runScenario(scenario));});
};
function runScenario(scenario){
  if(scenario==='wait'||scenario==='failure'){state.panel=false;syncPanel();startQuestion(scenario==='wait'?'How do I know what x means?':'Why do we use a letter?',scenario==='wait'?'hold':'error');}
  if(scenario==='upload'||scenario==='upload-error'){state.panel=false;syncPanel();go('home');showUpload('reference',scenario==='upload'?'loading':'error');}
  if(scenario==='unsaved'){if(!state.course){state.course=true;go('lesson');}openPanel();$('#style').value='Show one short example before practice.';readPattern();paintSave();requestPanelClose();}
  if(scenario==='complete'){state.panel=false;syncPanel();go('complete');}
}
window.addEventListener('beforeunload',event=>{if(dirty()){event.preventDefault();event.returnValue='';}});
navigation=createPreviewNavigation({
  routeForView,routeFromHash,hashForRoute,captureVisit,
  applyRoute:(route,visit)=>go(route.view,{route,visit,history:false}),
  hasUnsavedChanges:()=>{readPattern();return dirty();},confirmLeave:guard
});
fillPattern();go(navigation.initial.view,{route:navigation.initial,history:false,focus:false});
if(innerWidth>=1280&&!['library','activity'].includes(state.view)){state.panel=true;syncPanel();}
