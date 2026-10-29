const beforePracticeUI=renderCourse;
renderCourse=function(result){beforePracticeUI(result);setupReasoningFiles()};
function setupReasoningFiles(){
 const work=learningView.querySelector('#attempt-work');if(!work)return;
 const form=work.closest('form');const attachments=[];
 const tools=element('div',undefined,'reasoning-tools');
 const add=button('',()=>{options.hidden=!options.hidden;add.setAttribute('aria-expanded',String(!options.hidden))},'reasoning-add');
 add.setAttribute('aria-label','Attach reasoning');add.setAttribute('aria-expanded','false');
 add.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg>';
 const options=element('div',undefined,'reasoning-menu');options.hidden=true;
 const picker=element('input');picker.type='file';picker.hidden=true;picker.setAttribute('aria-label','Reasoning attachment');
 function choose(accept){options.hidden=true;add.setAttribute('aria-expanded','false');picker.accept=accept;picker.click()}
 const file=button('',()=>choose('.md,.pdf,.docx'));
 file.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h6"/></svg><span>Upload file</span>';
 const image=button('',()=>choose('.png,.jpg,.jpeg,.webp'));
 image.innerHTML='<svg class="image-outline" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m4 18 6-6 4 4 3-3 4 5"/></svg><span>Upload image</span>';
 options.append(file,image);const chips=element('div',undefined,'reasoning-attachments');
 picker.onchange=async()=>{
  const upload=picker.files[0];if(!upload)return;
  if(attachments.length>=3){liveStatus.textContent='Choose up to three reasoning attachments.';liveStatus.classList.add('error');return}
  await perform('reasoning',async()=>{
   const status=element('span','Reading attachment…','attachment-status');tools.append(status);
   try{
    const data=new FormData();data.append('file',upload);
    const response=await api('/api/courses/'+currentCourse+'/reasoning',{method:'POST',body:data});attachments.push(response.file);paint();
   }finally{status.remove();picker.value=''}
  });
 };
 function paint(){
  chips.replaceChildren();attachments.forEach((attachment,index)=>{
   const chip=element('div',undefined,'reasoning-chip');
   const name=button(attachment.name,()=>{show(attachment.name,'');const preview=element('pre',attachment.text,'source-preview');document.querySelector('#dialog-body').append(preview)});
   name.textContent=attachment.name;name.title='Review extracted text';
   const remove=button('×',()=>{attachments.splice(index,1);paint()});remove.setAttribute('aria-label','Remove '+attachment.name);
   chip.append(name,remove);chips.append(chip);
  });
 }
 tools.append(add,options,picker);work.after(tools,chips);
 tools.addEventListener('keydown',event=>{if(event.key==='Escape'){options.hidden=true;add.setAttribute('aria-expanded','false');add.focus()}});
 document.addEventListener('click',event=>{if(!tools.isConnected)return;if(!tools.contains(event.target)){options.hidden=true;add.setAttribute('aria-expanded','false')}},{signal:formCleanupSignal(form)});
 const submit=form.querySelector('button[type=submit]');submit.textContent='Submit';submit.classList.add('attempt-submit');
 form.onsubmit=event=>{
  event.preventDefault();if(!form.checkValidity())return;
  const payload={answer:form.querySelector('#attempt-answer').value,work:work.value,attachment_ids:attachments.map(file=>file.id)};
  show('Are you sure you want to submit?','');dialog.classList.add('submit-dialog');document.querySelector('#done').textContent='Cancel';
  document.querySelector('#dialog-body').append(button('Submit',()=>{dialog.close();courseAction('attempt',payload)},'attempt-submit confirm-attempt'));
 };
}
function formCleanupSignal(form){
 const controller=new AbortController();
 const observer=new MutationObserver(()=>{if(!form.isConnected){controller.abort();observer.disconnect()}});
 observer.observe(learningView,{childList:true});return controller.signal;
}
dialog.addEventListener('close',()=>{dialog.classList.remove('submit-dialog');document.querySelector('#done').textContent='Close'});
