function setActiveView(view){document.querySelectorAll('.rail-button').forEach(b=>{const selected=b.dataset.view===view;b.classList.toggle('selected',selected);if(selected)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})}
const closeLearningPanel=document.querySelector('.close-panel');closeLearningPanel.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const originalNotebookScene=syncFigure;
syncFigure=function(){originalNotebookScene();if(!guestStage||!figureHandle?.setPageContent)return;const overlay=document.createElement('div');overlay.className='math-overlay';overlay.setAttribute('aria-hidden','true');const formulas=[['a² + b² = c²','y = mx + b','∑ k = n(n+1)/2','f(x) = x² + 3','2x + 3 = 11','∫ x dx = x²/2'],['sin²θ + cos²θ = 1','E = mc²','Δy / Δx = m','P(A) = n / N','x = (−b ± √D)/2a','lim 1/n = 0']];const pages=formulas.map((lines,i)=>{const p=document.createElement('div');p.className='math-page math-page-'+i;lines.forEach((formula,j)=>{const line=document.createElement('div');line.textContent=formula;line.className=j%2?'formula-crimson':'formula-ice';p.append(line)});overlay.append(p);return p});guestStage.append(overlay);figureHandle.setPageContent((i,[a,b,c])=>{pages[i].style.transform=`matrix(${(b[0]-a[0])/50},${(b[1]-a[1])/50},${(c[0]-a[0])/70},${(c[1]-a[1])/70},${a[0]},${a[1]})`})};
document.addEventListener('keydown',event=>{
 if(event.key!=='Enter'||event.shiftKey||event.isComposing||event.keyCode===229)return;
 const input=event.target;if(!input.matches('textarea,input:not([type=file]):not([type=date]):not([type=range]):not([type=checkbox]):not([type=radio])'))return;
 const form=input.closest('form');if(form){event.preventDefault();if(form.checkValidity())form.requestSubmit();else form.querySelector(':invalid')?.focus();return}
 if(input.matches('.goal')){event.preventDefault();document.querySelector('.send').click();return}
 if(input.closest('.right-panel')){event.preventDefault();document.querySelector('.save-pattern')?.click();return}
 if(input.closest('#dialog-body')){event.preventDefault();const action=[...document.querySelectorAll('#dialog-body button')].find(b=>!b.disabled);action?.click();return}
 if(input.matches('[type=search],.search')){event.preventDefault();input.dispatchEvent(new Event('input',{bubbles:true}))}
});
function renderQuestionThreads(){
 const section=element('section',undefined,'question-threads');section.append(element('h2','Questions along the way'),paragraph('Ask about this lesson. Your questions and replies stay with this learning session.'));
 (currentState.followups||[]).forEach(thread=>{const details=element('details',undefined,'question-thread');details.append(element('summary',thread.question),element('p',thread.answer,'lesson-copy'),element('small',new Date(thread.created).toLocaleString()));section.append(details)});
 const form=element('form');form.innerHTML='<label for="followup-question">Your question</label><textarea id="followup-question" maxlength="1000" placeholder="For example: Why do we subtract from both sides?" required></textarea><button type="submit">Ask about this lesson</button><small>Enter to ask · Shift+Enter for a new line</small>';
 form.onsubmit=event=>{event.preventDefault();courseAction('question',{text:document.querySelector('#followup-question').value})};section.append(form);learningView.append(section);
}

matchMedia('(max-width:760px)').addEventListener('change',event=>{if(event.matches){document.querySelector('.sidebar').classList.add('closed');document.body.classList.add('collapsed')}});
