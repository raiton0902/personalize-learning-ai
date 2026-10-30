async function createLearning(payload){
 payload={...payload,request_id:payload.request_id||crypto.randomUUID()};
 if(!currentUser){captureGuestLearning(payload);auth('signup');return}
 await perform('create',async()=>{
  document.body.classList.remove('overview-page','new-learning-pattern');setActiveView('home');
  currentCourse=null;currentState=null;bodyView();learningView.classList.remove('question-chat');learningView.classList.add('course-reading','generating-learning');
  learningView.append(element('h1',payload.profile.goal));window.scrollTo(0,0);
  const back=()=>{home();document.querySelector('.goal').value=payload.profile.goal};
  try{
   const result=await thinkingRequest(()=>api('/api/courses',{method:'POST',body:JSON.stringify(payload)}));
   if(result.similar_learning){
    const box=element('section',undefined,'question-feedback similar-learning');
    box.append(element('p','You already have a similar learning: “'+result.similar_learning.title+'”.'));
    const choices=element('div');choices.append(button('Open learning',()=>loadCourse(result.similar_learning.id)),button('Create separately',()=>createLearning({...payload,similar_choice:'new'})),button('Back',back));box.append(choices);learningView.append(box);return;
   }
   await refreshData();renderCourse(result);
  }catch(error){
   learningView.append(element('p',error.message,'generation-error'),button('Try again',()=>createLearning(payload)),button('Back',back));
  }
 });
}
document.querySelector('.send').onclick=()=>{
 const payload={profile:fieldsProfile(),resource_id:selectedReference?.id};
 if(!payload.profile.goal.trim())return;
 createLearning(payload);
};
const beforeLearningUI=renderCourse;
renderCourse=function(result){
 beforeLearningUI(result);learningView.classList.remove('generating-learning','learning-review');
 const state=result.state;
 if(state.stage==='plan'&&state.plan_language_mismatch){
  const warning=element('section',undefined,'language-repair');
  warning.append(element('p','Some plan text does not match '+state.response_language+'.'),button('Regenerate in '+state.response_language,()=>courseAction('revise',{text:'Rewrite every title, outcome and scope note entirely in '+state.response_language+'. Preserve the subject and objective ordering.'})));
  learningView.querySelector('h1').after(warning);
 }
 const history=state.lesson_history||[];
 if(!history.length&&!state.attempts?.length)return;
 const label=element('label','Review lessons and tests','history-picker');
 const select=element('select');select.setAttribute('aria-label','Review lessons and tests');
 const initial=element('option','Choose a saved step or test');initial.value='';select.append(initial);
 history.forEach(entry=>{const option=element('option',(entry.recovered?'Saved: ':'Step '+(entry.index+1)+': ')+entry.title+(entry.version&&entry.version!==state.version?' (earlier plan)':''));option.value=entry.id;select.append(option)});
 if(state.attempts?.length){const option=element('option','All saved tests');option.value='saved-tests';select.append(option)}
 label.append(select);learningView.querySelector('.source-line').after(label);
 select.onchange=()=>{if(select.value)showLearningReview(result,select.value)};
};
function showLearningReview(result,id){
 const state=result.state;const entry=state.lesson_history?.find(item=>item.id===id);
 if(id!=='saved-tests'&&!entry)return;
 bodyView();learningView.classList.add('course-reading','learning-review');
 learningView.append(button('← Return to current step',()=>{learningView.classList.remove('learning-review');renderCourse(result)},'back-to-lesson'));
 learningView.append(element('h1',entry?.title||'Saved tests'));
 if(entry){
  learningView.append(paragraph(entry.lesson.explanation));
  if(entry.lesson.worked_example?.length){const steps=element('ol');entry.lesson.worked_example.forEach(text=>steps.append(element('li',text)));learningView.append(steps)}
  entry.practices.forEach((practice,index)=>{
   learningView.append(element('h2','Test '+(index+1)),paragraph(practice.question.prompt));
   if(practice.attempt){learningView.append(element('h3','Your answer'),paragraph(practice.attempt.answer));if(practice.attempt.work)learningView.append(paragraph(practice.attempt.work))}
   if(practice.assessment)learningView.append(element('h3','Feedback'),paragraph(practice.assessment.evidence));
   if(practice.repair)learningView.append(paragraph(practice.repair.explanation));
   if(practice.assessment&&practice.question.solution){
    const solution=practice.question.solution.trim();
    if (/^no[\s_-]*solution[.!]?$/i.test(solution)) learningView.append(paragraph('No worked solution is available for this test.'));
    else learningView.append(element('h3','Worked solution'),paragraph(solution));
   }
  });
 }else state.attempts.forEach((attempt,index)=>{
  learningView.append(element('h2','Test '+(index+1)),paragraph(attempt.question),element('h3','Your answer'),paragraph(attempt.answer));
  if(attempt.work)learningView.append(paragraph(attempt.work));if(attempt.assessment)learningView.append(paragraph(attempt.assessment.evidence));
 });
 window.scrollTo(0,0);
}
