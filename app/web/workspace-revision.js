const workspaceIcons={home:'<path d="m3 10 9-7 9 7v10H3zM9 20v-7h6v7"/>',new:'<path d="M12 4H6a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-6M15 3l6 6M10 14l2-6 6-6 6 6-6 6z"/>',search:'<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',library:'<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="9" y="4" width="5" height="16" rx="1"/><path d="m16 5 4-1 3 15-4 1z"/>',activity:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l-4 3"/>',folder:'<path d="M3 8V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'};
function workspaceIcon(name){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+workspaceIcons[name]+'</svg>'}
const rail=document.createElement('nav');rail.className='icon-rail';rail.setAttribute('aria-label','Workspace');
rail.innerHTML=['home','library','activity'].map((name,i)=>'<button class="rail-button '+(i===0?'selected':'')+'" data-view="'+name+'" aria-label="'+({home:'Home',library:'Library',activity:'View activity'}[name])+'" title="'+({home:'Home',library:'Library',activity:'Activity'}[name])+'">'+workspaceIcon(name)+'</button>').join('');document.body.append(rail);
const originalHome=home,originalSigned=setSigned,originalHeader=header;
const preferences=matchMedia('(prefers-color-scheme: dark)');
let themeChoice=localStorage.getItem('personal-learning-theme')==='light'?'light':'dark';
function actualTheme(){return themeChoice==='system'?(preferences.matches?'dark':'light'):themeChoice}
function applyTheme(){document.documentElement.dataset.uiTheme=actualTheme();localStorage.setItem('personal-learning-theme',themeChoice);document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===themeChoice)));if(guestStage)guestStage.dataset.theme=actualTheme()}
function appearance(){themeChoice=actualTheme()==='dark'?'light':'dark';applyTheme();syncThemeLabels()}
function syncThemeLabels(){const next=actualTheme()==='dark'?'light':'dark';document.querySelectorAll('.guest-theme,[data-account="Appearance"]').forEach(b=>{b.setAttribute('aria-label','Switch to '+next+' theme');b.title='Switch to '+next+' theme';if(b.dataset.account)b.textContent='Switch to '+next+' theme'})}
let guestStage=null,figureHandle=null,figureTour=null;
HL.inject(document);
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
HL.setReducedMotion(motionPreference.matches);
motionPreference.addEventListener('change',()=>{HL.setReducedMotion(motionPreference.matches);if(motionPreference.matches){figureTour?.stop();figureTour=null}});
function removeFigure(){figureTour?.stop();figureTour=null;figureHandle?.destroy();figureHandle=null;guestStage?.remove();guestStage=null}
function syncFigure(){removeFigure();if(signedIn||$('.hero').hidden)return;guestStage=document.createElement('div');guestStage.className='guest-notebook';guestStage.setAttribute('role','img');guestStage.setAttribute('data-hairline','notebook');guestStage.dataset.theme=actualTheme();guestStage.setAttribute('aria-label','Interactive notebook illustration');const drawing=HL.mk('svg',{viewBox:'0 0 400 320','aria-hidden':'true'},guestStage);$('.intro').prepend(guestStage);const read={textContent:'rest'};figureHandle=notebookFigure.mount({stage:guestStage,svg:drawing,read},22);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)figureTour=HL.tour(guestStage,notebookFigure.tour)}
function decorateSidebar(){
  $('.sidebar .brand').textContent='Personal Learning';$('.new').innerHTML=workspaceIcon('new')+'<span>New learning</span>';
  $('.workspace-links')?.remove();
  $('.sidebar .account').textContent='Sample workspace';
  $('.group')?.replaceChildren(document.createTextNode('Pinned'));
  let course=$('.course-heading');if(!course){course=document.createElement('button');course.type='button';course.className='course-heading';course.innerHTML=workspaceIcon('folder')+'<span>Algebra foundations</span>';$ ('#history').before(course)}course.onclick=()=>openCourse();
}
function openCourse(){
  $('.hero').hidden=true;authPage.hidden=true;learningView.hidden=false;
  learningView.innerHTML='<div class="page-kicker">COURSE · SAMPLE CONTENT</div><h1>Algebra foundations</h1><p>Your learning sessions for equations and coordinates.</p><div class="resource-list"></div>';
  samples.forEach((s,i)=>{const b=document.createElement('button');b.innerHTML=workspaceIcon('folder')+'<div><strong></strong><small></small></div><span>→</span>';b.querySelector('strong').textContent=s.title;b.querySelector('small').textContent=s.progress+' · Next: '+s.next;b.onclick=()=>openLesson(i);learningView.querySelector('.resource-list').append(b)});
  window.scrollTo(0,0);
}
header=function(){originalHeader();const accountTheme=document.querySelector('[data-account="Appearance"]');if(accountTheme)accountTheme.onclick=()=>{$('.account-menu').hidden=true;$('.avatar').setAttribute('aria-expanded','false');appearance()};if(!signedIn){const t=document.createElement('button');t.className='guest-theme';t.textContent='◐';t.onclick=appearance;authActions.prepend(t)}syncThemeLabels()};
setSigned=function(value){originalSigned(value);document.body.classList.toggle('workspace-signed',value);removeFigure();if(value){const avatar=$('.account-dock .avatar');avatar.title='Account';}decorateSidebar()};
let restorePatternOnHome=false;
function leaveHomePanels(){if(!document.body.classList.contains('overview-page'))restorePatternOnHome=!rightPanel.hidden;setPanel(false);document.body.classList.add('overview-page')}
home=function(){const returningFromOverview=document.body.classList.contains('overview-page');document.body.classList.remove('overview-page');originalHome();if(returningFromOverview&&signedIn)setPanel(restorePatternOnHome);document.querySelectorAll('.rail-button').forEach(b=>b.classList.toggle('selected',b.dataset.view==='home'));syncFigure()};
const originalAuth=auth;auth=function(mode){removeFigure();originalAuth(mode);const google=$('.google');google.innerHTML='<svg class="google-logo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M43.6 24.5c0-1.5-.1-2.9-.4-4.3H24v8.1h11a9.4 9.4 0 0 1-4.1 6.2v5.2h6.7c3.9-3.6 6-8.8 6-15.2z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.2c-1.8 1.2-4.1 1.9-6.8 1.9-5.3 0-9.8-3.6-11.4-8.4H5.7v5.4A20.4 20.4 0 0 0 24 44z"/><path fill="#FBBC05" d="M12.6 27.4a12.2 12.2 0 0 1 0-7.8v-5.4H5.7a20 20 0 0 0 0 18.6z"/><path fill="#EA4335" d="M24 11.2c3 0 5.6 1 7.7 3l5.8-5.8A19.3 19.3 0 0 0 24 3 20.4 20.4 0 0 0 5.7 14.2l6.9 5.4A12 12 0 0 1 24 11.2z"/></svg><span>Continue with Google</span>'};
const originalLesson=openLesson;openLesson=function(i){removeFigure();originalLesson(i)};
function route(view){
  if(!signedIn){auth('signup');return}document.querySelectorAll('.rail-button').forEach(b=>b.classList.toggle('selected',b.dataset.view===view));
  if(view==='home'){home();return}if(view==='search'){const sidebar=$('.sidebar');sidebar.classList.remove('closed');document.body.classList.remove('collapsed');$('.search').focus();return}
  leaveHomePanels();$('.hero').hidden=true;authPage.hidden=true;learningView.hidden=false;
  if(view==='library')learningView.innerHTML='<div class="page-kicker">YOUR WORKSPACE</div><h1>Library</h1><p>Your references and saved explanations, together.</p><div class="library-tabs"><button class="active">All</button><button>References</button><button>Notes</button></div><div class="resource-list"><button data-resource="reference"><span>'+workspaceIcon('folder')+'</span><div><strong>Algebra course reference</strong><small>Reference · Sample document</small></div><span>↗</span></button><button data-resource="note"><span>'+workspaceIcon('library')+'</span><div><strong>Keeping both sides balanced</strong><small>Saved explanation · Equations</small></div><span>↗</span></button></div><p class="sample-note">Sample library — no personal files are loaded.</p>';
  else learningView.innerHTML='<div class="page-kicker">YOUR WORKSPACE</div><h1>Activity</h1><p>Pick up where you left off.</p><div class="activity-day">Today</div><button class="activity-item" data-lesson="0">'+workspaceIcon('activity')+'<div><strong>Practised solving equations</strong><small>Completed step 2 of 5 · Continue learning →</small></div></button><div class="activity-day">Yesterday</div><button class="activity-item" data-lesson="1">'+workspaceIcon('activity')+'<div><strong>Started points on a line</strong><small>Completed step 1 of 4 · Continue learning →</small></div></button><p class="sample-note">Sample activity — dates and progress are illustrative.</p>';
  learningView.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>openLesson(Number(b.dataset.lesson)));
  learningView.querySelectorAll('[data-resource]').forEach(b=>b.onclick=()=>show(b.dataset.resource==='reference'?'Algebra course reference':'Keeping both sides balanced',b.dataset.resource==='reference'?'<p>Sample reference: linear equations, substitution, and points on a line.</p><p>In the live product this would open the source document.</p>':'<p>Subtract the same amount from both sides to keep an equation balanced. For 2x + 3 = 11, subtract 3 to get 2x = 8.</p><p>Sample saved explanation.</p>'));
  learningView.querySelectorAll('.library-tabs button').forEach((b,i)=>b.onclick=()=>{learningView.querySelectorAll('.library-tabs button').forEach(n=>n.classList.remove('active'));b.classList.add('active');learningView.querySelector('[data-resource="reference"]').hidden=i===2;learningView.querySelector('[data-resource="note"]').hidden=i===1});window.scrollTo(0,0)
}
rail.querySelectorAll('button').forEach(b=>b.onclick=()=>route(b.dataset.view));
preferences.addEventListener('change',()=>{if(themeChoice==='system')applyTheme()});
decorateSidebar();header();applyTheme();home();
