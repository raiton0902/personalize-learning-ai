const baseRoute=route;
route=function(view){baseRoute(view);if(!signedIn)return;if(view==='library')setupLibrarySearch();if(view==='activity')setupActivityCalendar();bindIconMotion()};
function setupLibrarySearch(){
  const rows=[...learningView.querySelectorAll('[data-resource]')];rows.forEach(b=>b.lastElementChild.remove());
  const search=document.createElement('div');search.className='library-search';search.innerHTML=workspaceIcon('search')+'<input type="search" aria-label="Search library" placeholder="Search titles, topics, or saved content">';
  learningView.querySelector('.library-tabs').before(search);
  const status=document.createElement('p');status.className='filter-status';status.setAttribute('role','status');learningView.querySelector('.resource-list').after(status);
  const searchTexts={reference:'algebra equations substitution points coordinates course reference sample document',note:'keeping both sides balanced subtract amount equations 2x 3 11 saved explanation'};
  let selected=0;
  function filter(){const query=search.querySelector('input').value.trim().toLowerCase();const terms=query.split(/\s+/).filter(Boolean);let count=0;rows.forEach(b=>{const type=b.dataset.resource;const haystack=b.textContent.toLowerCase()+' '+searchTexts[type];const typeMatch=selected===0||(selected===1&&type==='reference')||(selected===2&&type==='note');b.hidden=!(typeMatch&&terms.every(term=>haystack.includes(term)));if(!b.hidden)count++});status.textContent=count===0?'No matching items. Try another keyword.':count+' '+(count===1?'item':'items')}
  search.querySelector('input').oninput=filter;
  learningView.querySelectorAll('.library-tabs button').forEach((b,i)=>b.onclick=()=>{selected=i;learningView.querySelectorAll('.library-tabs button').forEach(n=>n.classList.toggle('active',n===b));filter()});filter();
}
function setupActivityCalendar(){
  const dates=['2026-10-25','2026-10-24'];
  learningView.querySelectorAll('.activity-item').forEach((b,i)=>b.dataset.date=dates[i]);
  learningView.querySelectorAll('.activity-day').forEach((h,i)=>{h.dataset.date=dates[i];h.textContent=new Intl.DateTimeFormat('en',{dateStyle:'long',timeZone:'UTC'}).format(new Date(dates[i]+'T12:00:00Z'))});
  const control=document.createElement('div');control.className='activity-filter';control.innerHTML='<label for="activity-date">Filter by date</label><div><input id="activity-date" type="date" aria-label="Activity date"><button class="clear-date" type="button">All dates</button></div>';
  learningView.querySelector('.activity-day').before(control);
  const status=document.createElement('p');status.className='filter-status';status.setAttribute('role','status');control.after(status);
  function filter(){const date=control.querySelector('input').value;let count=0;learningView.querySelectorAll('.activity-item,.activity-day').forEach(n=>{n.hidden=!!date&&n.dataset.date!==date;if(n.classList.contains('activity-item')&&!n.hidden)count++});status.textContent=count===0?'No activity on this date.':(date?'Activity on '+date:'Showing all activity')}
  control.querySelector('input').oninput=filter;control.querySelector('input').onchange=filter;control.querySelector('button').onclick=()=>{control.querySelector('input').value='';filter()};
  learningView.querySelector('.sample-note').textContent='Sample activity for October 24–25, 2026. Live activity will use the learner’s local dates.';filter();
}
const folderHandles=new Map();
function installHairlineFolders(){
  for(const [stage,handle] of folderHandles){if(!stage.isConnected){handle.destroy();folderHandles.delete(stage)}}
  document.querySelectorAll('.course-heading>svg,[data-resource="reference"]>span>svg').forEach(icon=>{
    const stage=document.createElement('span');stage.className='folder-motion';stage.setAttribute('data-hairline','folder');stage.dataset.theme=actualTheme();stage.setAttribute('aria-hidden','true');icon.replaceWith(stage);
    const drawing=HL.mk('svg',{viewBox:'0 0 400 320'},stage);const handle=folderFigure.mount({stage,svg:drawing,read:{textContent:'rest'}},11);folderHandles.set(stage,handle);
    const row=stage.closest('button');
    if(row){const enter=()=>handle.setHovered(true),leave=()=>handle.setHovered(false);row.addEventListener('pointerenter',enter);row.addEventListener('pointerleave',leave);row.addEventListener('focus',enter);row.addEventListener('blur',leave);const destroy=handle.destroy;handle.destroy=()=>{row.removeEventListener('pointerenter',enter);row.removeEventListener('pointerleave',leave);row.removeEventListener('focus',enter);row.removeEventListener('blur',leave);destroy()}}
  });
}
function bindIconMotion(){installHairlineFolders();document.querySelectorAll('button').forEach(button=>{
  if(button.matches('#add,.send')||button.closest('.plus-wrap'))return;
  if(button.querySelector('svg')&&!button.querySelector('.folder-motion'))button.classList.add('motion-icon-button');
  if(button.matches('.avatar,.guest-theme,.close-panel'))button.classList.add('motion-symbol-button');
})}
const motionHome=home;home=function(){motionHome();bindIconMotion()};
const motionAuth=auth;auth=function(mode){motionAuth(mode);bindIconMotion()};
const motionHeader=header;header=function(){motionHeader();bindIconMotion()};
const discoveryTheme=applyTheme;applyTheme=function(){discoveryTheme();folderHandles.forEach((_handle,stage)=>stage.dataset.theme=actualTheme())};
const motionCourse=openCourse;openCourse=function(){motionCourse();bindIconMotion()};
const iconObserver=new MutationObserver(()=>bindIconMotion());iconObserver.observe(document.body,{childList:true,subtree:true});bindIconMotion();
