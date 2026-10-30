const formatArt={
 md:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M5 15V9l3 4 3-4v6m3-3 2 3 2-3m-2-3v6"/>',
 docx:'<path d="M7 3h11l3 3v15H7zM11 8h7M11 12h7M11 16h7"/><path d="m2 8 2 9 2-6 2 6 2-9"/>',
 pdf:'<path d="M5 2h10l4 4v16H5zM15 2v5h5"/><path d="M8 17c3-4 4-7 4-8-1 5 1 7 4 7-4-2-6-1-8 1z"/>'};
function decorateFileIcons(){document.querySelectorAll('.checkpoint-menu button').forEach((b,i)=>{const format=['md','docx','pdf'][i];b.dataset.format=format;b.querySelector('svg').innerHTML=formatArt[format]})}
const threadCourseRenderer=renderCourse;renderCourse=function(result){document.body.classList.remove('new-learning-pattern');learningView.classList.remove('question-chat');threadCourseRenderer(result);decorateFileIcons()};
const openQuestionTrees=new Set();
renderHistory=function(){const root=document.querySelector('#history');root.replaceChildren();savedCourses.forEach(course=>{
 const row=element('div',undefined,'course-tree-row');const title=button(course.title,()=>loadCourse(course.id),'history course-title');title.dataset.courseId=course.id;row.append(title);
 const questions=course.questions||[];const list=element('div',undefined,'course-questions');list.hidden=!openQuestionTrees.has(course.id);
 if(questions.length){const toggle=button('',()=>{list.hidden=!list.hidden;toggle.setAttribute('aria-expanded',String(!list.hidden));if(list.hidden)openQuestionTrees.delete(course.id);else openQuestionTrees.add(course.id)},'course-expand');toggle.setAttribute('aria-label','Questions for '+course.title);toggle.setAttribute('aria-expanded',String(!list.hidden));toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';row.append(toggle);questions.forEach(q=>list.append(button(q.question,()=>openQuestionChat(course.id,q.id),'history question-history')))}
 root.append(row,list)
 });document.querySelector('.course-heading').hidden=true;document.querySelector('.search').oninput=event=>{const query=event.target.value.toLowerCase();[...root.querySelectorAll('.course-tree-row')].forEach(row=>{const list=row.nextElementSibling;const titleMatches=row.textContent.toLowerCase().includes(query);const childMatches=list.textContent.toLowerCase().includes(query);row.hidden=!!query&&!titleMatches&&!childMatches;list.hidden=query?!(titleMatches||childMatches):!openQuestionTrees.has(savedCourses[[...root.querySelectorAll('.course-tree-row')].indexOf(row)]?.id)})};bindIconMotion();
};
renderQuestionThreads=function(){const section=element('section',undefined,'question-threads compact-questions');section.append(element('h2','Ask about this lesson'));const form=element('form');form.innerHTML='<label for="followup-question">Your question</label><textarea id="followup-question" maxlength="1000" placeholder="What would you like to ask?" required></textarea><button type="submit">Ask</button>';form.onsubmit=event=>{event.preventDefault();courseAction('question',{text:document.querySelector('#followup-question').value})};section.append(form);learningView.append(section)};
const baseThreadAction=courseAction;
const scopeHome=home;home=function(){learningView.classList.remove('question-chat');scopeHome();document.body.classList.add('new-learning-pattern');if(currentUser)fillProfile({tone:currentUser.profile.tone||'',interest:currentUser.profile.interest||'',language:'automatic',level:'',context:''})};
document.querySelector('.new').onclick=()=>{selectedSource(null);document.querySelector('.goal').value='';home()};
renderHistory();decorateFileIcons();
