let savedPattern=null;
const preferenceKeys=['language','level','tone','interest','context','pace'];
function patternValues(){const p=fieldsProfile();return Object.fromEntries(preferenceKeys.map(key=>[key,p[key]]))}
function patternDirty(){return savedPattern!==null&&JSON.stringify(patternValues())!==JSON.stringify(savedPattern)}
function paintPatternButton(){const dirty=patternDirty();profileSave.textContent=dirty?'Save?':'Saved';profileSave.classList.toggle('unsaved',dirty);profileSave.disabled=!dirty||pendingRequests.has('profile');document.querySelector('.confirm-save')?.classList.toggle('unsaved',dirty)}
const originalFillPattern=fillProfile;
fillProfile=function(p){originalFillPattern(p);savedPattern=patternValues();paintPatternButton()};
const originalApplyLanguage=applyLanguage;
applyLanguage=function(value){originalApplyLanguage(value);paintPatternButton()};
rightPanel.addEventListener('input',paintPatternButton);rightPanel.addEventListener('change',paintPatternButton);
async function savePattern(){return await perform('profile',async()=>{profileSave.disabled=true;const p=fieldsProfile();await api('/api/profile',{method:'POST',body:JSON.stringify({...p,course_id:currentCourse})});currentUser.profile={tone:p.tone,interest:p.interest};if(currentState)currentState.profile=p;savedPattern=patternValues();originalApplyLanguage(preferredLanguage.value.trim());paintPatternButton();return true})}
profileSave.onclick=async()=>{await savePattern();paintPatternButton()};
document.querySelector('.close-panel').onclick=()=>{
 if(!patternDirty()){setPanel(false);return}
 show('Discard changes?','');dialog.classList.add('discard-dialog');const box=document.querySelector('#dialog-body');box.append(element('p','Your changes won’t be saved.'));
 box.append(button('Discard changes',()=>{const restored={...fieldsProfile(),...savedPattern};fillProfile(restored);dialog.close();setPanel(false)},'discard-pattern'));
 const save=button('Save',async()=>{save.disabled=true;const success=await savePattern();save.disabled=false;if(success){dialog.close();setPanel(false)}},'confirm-save unsaved');box.append(save);document.querySelector('#done').textContent='Keep editing';
};
dialog.addEventListener('close',()=>{document.querySelector('#done').textContent='Close';dialog.classList.remove('discard-dialog')});

function checkpointControl(){const old=learningView.querySelector('.export-link');if(!old)return;const wrapper=element('div',undefined,'checkpoint-download');const menu=element('div',undefined,'checkpoint-menu');menu.hidden=true;menu.setAttribute('role','menu');menu.setAttribute('aria-label','Checkpoint format');const download=button('',()=>{menu.hidden=!menu.hidden;download.setAttribute('aria-expanded',String(!menu.hidden))},'checkpoint-trigger');download.setAttribute('aria-haspopup','menu');download.setAttribute('aria-expanded','false');download.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"/></svg><span>Download checkpoint as…</span>';[['md','Markdown (.md)'],['docx','Word (.docx)'],['pdf','PDF (.pdf)']].forEach(([value,label])=>{const choice=button('',()=>{menu.hidden=true;download.setAttribute('aria-expanded','false');location.href='/api/courses/'+currentCourse+'/export?format='+value});choice.setAttribute('role','menuitem');choice.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h6"/></svg>';choice.append(element('span',label));menu.append(choice)});wrapper.addEventListener('keydown',event=>{const items=[...menu.querySelectorAll('button')];if(event.key==='Escape'){menu.hidden=true;download.setAttribute('aria-expanded','false');download.focus()}else if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();menu.hidden=false;download.setAttribute('aria-expanded','true');const i=items.indexOf(document.activeElement);items[(i+(event.key==='ArrowDown'?1:-1)+items.length)%items.length].focus()}});wrapper.append(download,menu);old.replaceWith(wrapper);bindIconMotion()}
document.addEventListener('click',event=>{if(event.target.closest('.checkpoint-download'))return;document.querySelectorAll('.checkpoint-menu').forEach(menu=>{menu.hidden=true;menu.closest('.checkpoint-download').querySelector('.checkpoint-trigger').setAttribute('aria-expanded','false')})});
const originalCourseRenderer=renderCourse;renderCourse=function(result){originalCourseRenderer(result);checkpointControl()};
savedPattern=patternValues();paintPatternButton();

const originalSourceSelection=selectedSource;selectedSource=function(resource){originalSourceSelection(resource);if(!resource)document.querySelector('#source-state').textContent=''};if(!selectedReference)document.querySelector('#source-state').textContent='';
