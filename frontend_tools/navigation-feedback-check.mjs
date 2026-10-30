import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.setDefaultTimeout(15000);page.setDefaultNavigationTimeout(15000);
 const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message)});page.on('response',async r=>{if(r.status()>=400)console.log('HTTP',r.status(),r.url(),await r.text())});
 await page.goto('http://127.0.0.1:8781');
 await page.getByRole('button',{name:'Sign up',exact:true}).click();
 await page.getByLabel('Email',{exact:true}).fill('chat-'+Date.now()+'@example.test');
 await page.getByLabel('Password',{exact:true}).fill('chat-test-password');
 await page.getByLabel('Password',{exact:true}).press('Enter');
 await page.locator('.avatar').waitFor();
 await page.getByRole('button',{name:'Close learning pattern'}).click();
 await page.route('**/api/courses',async route=>{const response=await route.fetch();if(route.request().method()==='POST')await new Promise(resolve=>setTimeout(resolve,350));await route.fulfill({response})});
 await page.getByLabel('Learning goal',{exact:true}).fill('Learn Python variables');
 await page.getByLabel('Learning goal',{exact:true}).press('Enter');
 await page.locator('.thinking-indicator').waitFor();
 await page.getByRole('button',{name:'Accept this plan',exact:true}).click();
 await page.getByRole('button',{name:'Teach me this idea',exact:true}).click();
 await page.waitForFunction(()=>!pendingRequests.size,null,{timeout:15000});

 const question=page.getByLabel('Your question',{exact:true});
 await page.evaluate(()=>{window.invalidPrevented=false;document.addEventListener('invalid',e=>{window.invalidPrevented=e.defaultPrevented},true)});
 await question.press('Enter');
 assert(await page.evaluate(()=>window.invalidPrevented));
 await question.fill('wdoiqndnioqwd');await question.press('Enter');
 await page.locator('.question-feedback').waitFor();
 assert((await page.locator('.question-feedback').innerText()).includes('wdoiqndnioqwd'));
 assert.equal(await page.locator('.question-history').count(),0);
 await page.route('**/api/courses/*',async route=>{
  const response=await route.fetch();
  if(route.request().method()==='POST')await new Promise(resolve=>setTimeout(resolve,350));
  await route.fulfill({response});
 });
 await question.fill('Why is it hard');await question.press('Enter');
 await page.locator('.thinking-indicator').waitFor();
 assert.equal(await page.locator('.thinking-dot').evaluate(n=>getComputedStyle(n).animationName),'thinking-pulse');
 await page.locator('.chat-assistant').waitFor();
 assert.equal(await page.locator('.thinking-indicator').count(),0);
 const reply=page.getByRole('textbox',{name:'Reply in this question chat'});
 assert(await page.getByRole('button',{name:'Send chat reply'}).isDisabled());
 assert((await page.locator('.chat-composer').boundingBox()).height<=70);
 await reply.fill('wdoiqndnioqwd');await reply.press('Enter');
 await page.locator('.question-feedback').waitFor();
 assert.equal(await page.locator('.chat-user').count(),1);
 await page.getByRole('button',{name:'← Python variables',exact:true}).click();

 await question.fill('Why this subject hard??');await question.press('Enter');
 const suggestion=page.locator('.question-feedback');await suggestion.waitFor();
 assert.equal(await suggestion.evaluate(n=>n.getAnimations()[0].effect.getTiming().duration),1200);
 assert(await suggestion.evaluate(n=>n.inert));
 await question.fill('');assert.equal(await suggestion.count(),0);
 await question.fill('Why this subject hard??');await question.press('Enter');
 await suggestion.waitFor();await page.waitForFunction(()=>!document.querySelector('.question-feedback').inert);
 await question.fill('A different question');assert.equal(await suggestion.count(),0);
 await page.emulateMedia({reducedMotion:'reduce'});
 await question.fill('Why this subject hard??');await question.press('Enter');await suggestion.waitFor();
 assert.equal(await suggestion.evaluate(n=>n.getAnimations().length),0);
 await question.fill('');assert.equal(await suggestion.count(),0);
 await page.emulateMedia({reducedMotion:'no-preference'});
 let failNext=false;
 await page.route('**/api/courses/*',async route=>{
  if(route.request().method()!=='GET')return route.fallback();
  if(failNext){failNext=false;await new Promise(r=>setTimeout(r,400));return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Synthetic navigation failure'})})}
  const response=await route.fetch();await new Promise(r=>setTimeout(r,700));await route.fulfill({response});
 });
 for(const theme of ['dark','light']){
  await page.evaluate(theme=>{themeChoice=theme;applyTheme()},theme);
  await page.getByRole('button',{name:'New learning',exact:true}).click();
  await page.locator('.course-title').first().click();
  assert(await page.evaluate(()=>document.body.inert));
  assert(await page.evaluate(()=>!document.querySelector('.hero').hidden&&learningView.hidden));
  assert.equal(await page.locator('.hero').evaluate(n=>getComputedStyle(n).opacity),'1');
  assert.equal(await page.locator('body').evaluate(n=>getComputedStyle(n).filter),'none');
  const rail=await page.locator('[data-view=library]').boundingBox();
  await page.mouse.click(rail.x+rail.width/2,rail.y+rail.height/2);
  assert(await page.evaluate(()=>!document.querySelector('.hero').hidden));
  await page.waitForFunction(()=>!document.body.inert&&!learningView.hidden);
  assert.equal(await page.locator('.learning-view').evaluate(n=>getComputedStyle(n).opacity),'1');
  await page.screenshot({path:'app/local_results/navigation-ready-'+theme+'.png'});
 }
 await page.getByRole('button',{name:'New learning',exact:true}).click();failNext=true;
 await page.locator('.course-title').first().click();
 await page.waitForFunction(()=>!document.body.inert);
 assert(await page.evaluate(()=>!document.querySelector('.hero').hidden));
 assert((await page.locator('#live-status').innerText()).includes('Synthetic navigation failure'));
 await page.evaluate(()=>{show('Test dialog','<button>Test action</button>');void perform('load',()=>new Promise(resolve=>{window.finishTestLoad=resolve}))});
 assert(await page.locator('dialog[open]').evaluate(n=>n.inert));
 await page.evaluate(()=>window.finishTestLoad());await page.waitForFunction(()=>!document.body.inert);
 assert(!(await page.locator('dialog[open]').evaluate(n=>n.inert)));await page.keyboard.press('Escape');
 assert.deepEqual(errors,[]);
 console.log('Passed suggestion cancellation on clear/edit, 1200ms reveal, reduced motion, unchanged source page, global/modal interaction lock, no dimming in both themes, and navigation failure recovery.');
} finally {await browser.close()}
