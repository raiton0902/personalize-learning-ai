async function openQuestionChat(courseId,questionId){
 await perform('load',async()=>{showQuestionChat(await api('/api/courses/'+courseId),questionId);window.scrollTo(0,0)})
}
function showQuestionChat(result,questionId){
 const question=result.state.followups?.find(q=>q.id===questionId);
 if(!question)throw Error('This saved question was not found.');
 currentCourse=result.id;currentState=result.state;
 document.body.classList.remove('new-learning-pattern','overview-page');
 fillProfile(currentState.profile);setActiveView('home');bodyView();
 learningView.classList.add('course-reading','question-chat');
 learningView.append(button('← '+sentenceStart(result.state.curriculum.title),()=>renderCourse(result),'back-to-lesson'),element('h1',question.question));
 if(currentState.approved_version!==currentState.version)learningView.append(button('Review and accept your new learning plan',()=>renderCourse(result),'review-chat-plan'));
 const log=element('div',undefined,'chat-log');log.setAttribute('aria-live','polite');
 function message(role,text){
  const bubble=element('article',undefined,'chat-message chat-'+role);
  bubble.append(element('small',role==='user'?'You':'Personal Learning'),richText(text));log.append(bubble);
 }
 (question.messages||[{role:'user',content:question.question},{role:'assistant',content:question.answer}]).forEach(m=>message(m.role,m.content));
 async function sendAction(action,extra){
  return await perform('course',async()=>{
   const response=await thinkingRequest(()=>api('/api/courses/'+result.id,{method:'POST',body:JSON.stringify({action,thread_id:question.id,...extra})}));
   if(questionFeedback(response,extra.text,choice=>sendAction(action,{...extra,similar_choice:choice})))return false;
   await refreshData();if(response.thread_id)showQuestionChat(response,response.thread_id);else renderCourse(response);return true;
  });
 }
 if(question.pending){
  message('user',question.pending.text);
  const card=element('section',undefined,'topic-decision');
  const choices=element('div');
  if(question.pending.can_reconsider){
   card.append(element('p','This question refers to your current learning.'));
   choices.append(button('Ask in this learning',()=>sendAction('chat_reconsider',{pending_id:question.pending.id})),button('Discard question',()=>sendAction('chat_discard',{pending_id:question.pending.id})));
  }else{
   card.append(element('p','This topic is outside this learning. Would you like to start a new learning?'));
   choices.append(button('Yes',()=>sendAction('chat_transfer',{pending_id:question.pending.id})),button('No',()=>sendAction('chat_discard',{pending_id:question.pending.id})));
  }
  card.append(choices);log.append(card);
 }
 const composer=element('form',undefined,'chat-composer');
 composer.noValidate=true;
 composer.innerHTML='<textarea aria-label="Reply in this question chat" rows="1" maxlength="1000" placeholder="Ask your next question…"></textarea><button type="submit" aria-label="Send chat reply">↑</button>';
 const input=composer.querySelector('textarea');let requestId=crypto.randomUUID();
 const send=composer.querySelector('button');input.disabled=!!question.pending;send.disabled=true;
 composer.onsubmit=async event=>{event.preventDefault();const text=input.value.trim();if(text)await sendAction('chat',{text,request_id:requestId})};
 input.addEventListener('input',()=>{requestId=crypto.randomUUID();send.disabled=!input.value.trim()||!!question.pending;input.style.height='auto';input.style.height=Math.min(140,input.scrollHeight)+'px'});learningView.append(log,composer);bindIconMotion();
}
const beforeLiveChatAction=baseThreadAction;
courseAction=async function(action,data){
 if(action!=='question')return beforeLiveChatAction(action,data);
 await perform('course',async()=>{
  const result=await thinkingRequest(()=>api('/api/courses/'+currentCourse,{method:'POST',body:JSON.stringify({action,...data,request_id:crypto.randomUUID()})}));
  if(questionFeedback(result,data.text,choice=>courseAction(action,{...data,similar_choice:choice})))return;
  await refreshData();showQuestionChat(result,result.thread_id);
 });
};
async function thinkingRequest(operation){
 const indicator=element('div',undefined,'thinking-indicator');indicator.setAttribute('role','status');
 indicator.innerHTML='<span class="thinking-dot" aria-hidden="true"></span><span>Thinking</span>';
 const root=learningView.hidden?document.querySelector('.hero'):learningView;
 const anchor=root.querySelector('.chat-composer')||root.querySelector('.compact-questions form')||root.querySelector('.composer');
 if(anchor){if(root===learningView)anchor.before(indicator);else anchor.after(indicator)}else root.append(indicator);
 root.setAttribute('aria-busy','true');
 try{return await operation()}finally{indicator.remove();root.removeAttribute('aria-busy')}
}
function questionFeedback(response,text,retry){
 if(!response.similar_question&&!response.clarification&&!response.service_error)return false;
 dismissQuestionFeedback();
 const box=element('section',undefined,'question-feedback');box.setAttribute('role','status');
 if(response.similar_question){
  box.append(element('p','You asked something similar: “'+response.similar_question.question+'”.'));
  const actions=element('div');actions.append(button('Open previous answer',()=>openQuestionChat(response.id,response.similar_question.id)),button('Ask separately',()=>retry('new')));box.append(actions);
 }else box.append(element('p',response.clarification||response.service_error));
 const anchor=learningView.querySelector('.chat-composer')||learningView.querySelector('.compact-questions form');
 const source=anchor?.querySelector('textarea');
 if(typeof text==='string'&&source&&source.value.trim()!==text.trim())return true;
 if(anchor)anchor.before(box);else learningView.append(box);
 if(response.similar_question&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  box.inert=true;
  box.reveal=box.animate([
   {opacity:0,transform:'translateY(6px)'},
   {opacity:0,transform:'translateY(6px)',offset:.15},
   {opacity:1,transform:'translateY(0)'}
  ],{duration:1200,easing:'cubic-bezier(.22,.7,.3,1)',fill:'both'});
  box.reveal.finished.then(()=>{box.inert=false}).catch(()=>{});
 }
 return true;
}
function dismissQuestionFeedback(){
 const feedback=learningView.querySelector('.question-feedback');
 if(feedback){feedback.reveal?.cancel();feedback.remove()}
}
document.addEventListener('input',event=>{
 if(event.target.matches('#followup-question,.chat-composer textarea'))dismissQuestionFeedback();
});

// Keep field validity and accessible focus without browser validation bubbles.
document.addEventListener('invalid',event=>{event.preventDefault();event.target.setAttribute('aria-invalid','true')},true);
document.addEventListener('input',event=>event.target.removeAttribute('aria-invalid'));

