const assert=require('node:assert/strict');
module.exports=async function verifyTargets(page){
 await page.evaluate(()=>{
  const state=JSON.parse(JSON.stringify(currentState));
  state.curriculum.objectives[0].outcome='Write $y = \\beta_0 + \\beta_1 x + \\varepsilon$ and explain $R^2$.';
  renderCourse({id:currentCourse,state});
  renderCourse({id:currentCourse,state});
 });
 assert.equal(await page.locator('.plan-learner-targets').count(),1);
 assert.equal(await page.locator('.plan-learner-targets > li').count(),await page.evaluate(()=>currentState.curriculum.objectives.length));
 const layout=await page.evaluate(()=>({
  orphan:[...learningView.children].filter(e=>e.matches('.lesson-copy.rendered-copy')).length,
  list:getComputedStyle(learningView.querySelector('.plan-learner-targets')).listStyleType,
  fonts:[...learningView.querySelectorAll('.plan-learner-targets li, .plan-learner-targets li p, .module-lesson-outcome li p')].map(e=>getComputedStyle(e).fontSize)
 }));
 assert.equal(layout.orphan,1); // Scope note only; outcomes belong to lists.
 assert.equal(layout.list,'disc');assert(layout.fonts.every(size=>size==='13px'));
 assert.equal(await page.locator('.plan-learner-targets > li').first().locator('.katex').count(),2);
 assert.equal(await page.locator('.module-lesson-outcome').first().locator('.katex').count(),2);
 const fs=require('node:fs'),path=require('node:path');
 const shots=path.join(__dirname,'artifacts','plan-targets');fs.mkdirSync(shots,{recursive:true});
 const view=await page.evaluate(()=>({theme:document.documentElement.dataset.uiTheme,cramming:!!currentState.profile.cramming}));
 await page.screenshot({path:path.join(shots,`${view.cramming?'cramming':'standard'}-${view.theme}-${page.viewportSize().width}.png`),fullPage:true});
};
