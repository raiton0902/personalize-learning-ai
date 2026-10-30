const {chromium}=require('../../frontend_tools/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base='http://127.0.0.1:8769/';
const shots=path.join(__dirname,'screenshots');fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(5000);
 const errors=[],outside=[],mutations=[],checks=[],accessibility=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))outside.push(r.url());if(r.method()!=='GET')mutations.push(r.method()+' '+r.url());});
 const click=name=>page.getByRole('button',{name,exact:true}).or(page.getByRole('menuitem',{name,exact:true})).click();
 async function settled(){await page.evaluate(async()=>Promise.allSettled(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished)));}
 async function shot(name){await settled();await page.screenshot({path:path.join(shots,name+'.png'),fullPage:!name.startsWith('phone-')});}
 async function axe(name){await settled();await page.addScriptTag({path:path.resolve(__dirname,'../../frontend_tools/node_modules/axe-core/axe.min.js')});const r=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));accessibility.push({name,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});}
 async function configure(view,outcome='failure',hold=true){await click('Preview states');await page.locator('#demo-outcome').selectOption(outcome);await page.locator('#hold-demo-wait').setChecked(hold);await page.locator('[data-preview-view="'+view+'"]').click();await settled();}
 async function scenario(selector){await click('Preview states');await page.locator(selector).click();await settled();}
 const kinds=[['teach','teach','Teach me this idea','Preparing your lesson…'],['practice','lesson','Give me practice','Writing a practice problem…'],['submit','practice','Submit answer','Checking your answer…'],['help','help','Help with this step','Preparing help…']];
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);await shot('01-submit-ready-dark');await axe('ready-dark');
 assert.equal(await page.locator('.stages [data-saved-plan] svg').count(),0);
 assert.equal(await page.locator('#open-demo-help').innerText(),'Need help?');
 assert.deepEqual(await page.locator('#open-demo-help').evaluate(e=>({bg:getComputedStyle(e).backgroundColor,text:getComputedStyle(e).color})),{bg:'rgb(255, 255, 255)',text:'rgb(0, 0, 0)'});
 checks.push('Plan has no tick; Need help? uses white fill and black text');
 for(const [kind,view,trigger,label] of kinds){
  await configure(view);
  if(kind==='submit'){await page.locator('#demo-answer').fill('x = 5');await page.locator('#demo-work').fill('My retained reasoning\nSubtract 3 on each side.');}
  await click(trigger);assert.equal(await page.locator('#operation-feedback .thinking').innerText(),label);
  assert.equal(await page.locator('#proposal-surface').evaluate(e=>e.inert),true);assert.equal(await page.locator('.rail').evaluate(e=>e.inert),true);assert.equal(await page.locator('#operation-feedback').evaluate(e=>!!e.closest('[inert]')),false);
  await shot(kind+'-waiting-dark');if(kind==='submit')await axe('submit-wait');
  await click('Finish preview wait');await page.locator('.operation-error').waitFor();assert.equal(await page.locator('#proposal-surface').evaluate(e=>e.inert),false);await shot(kind+'-error-dark');if(kind==='submit'){assert.equal(await page.locator('#demo-work').inputValue(),'My retained reasoning\nSubtract 3 on each side.');assert.match(await page.locator('#demo-files').innerText(),/My working.md/);await axe('submit-error');}
  await click('Try again');await click('Finish preview wait');assert.equal(await page.locator('.operation-error').count(),0);checks.push(kind+': correctly placed wait, global interaction lock, preserved draft, inline failure and local retry');
 }
 await configure('practice','unknown');await click('Submit answer');await click('Finish preview wait');assert.equal(await page.locator('#retry-operation').count(),0);await click('Check saved result');await click('Return to draft');await click('Edit answer');assert.equal(await page.locator('#demo-answer').evaluate(e=>e===document.activeElement),true);checks.push('Unknown completion has reconcile action, no misleading retry');
 await configure('practice');await page.locator('#demo-answer').fill('');assert.equal(await page.locator('#demo-submit').isDisabled(),true);await page.locator('#demo-answer').fill('5');await page.locator('#demo-work').fill('Line one');await page.locator('#demo-work').press('Shift+Enter');assert.match(await page.locator('#demo-work').inputValue(),/\n/);await page.locator('#demo-answer').press('Enter');await click('Finish preview wait');await click('Edit answer');checks.push('Empty submit disabled, Enter submits, Shift+Enter preserved');
 await click('Switch to light theme');await configure('practice');await click('Submit answer');await shot('submit-waiting-light');await axe('wait-light');await click('Finish preview wait');await shot('submit-error-light');await axe('error-light');await click('Edit answer');
 await configure('home');
 assert.equal(await page.locator('.home-subtitle').count(),0);assert.equal(await page.locator('#page-label').innerText(),'');
 for(const [width,height] of [[1440,1000],[1280,800],[390,844],[360,640]]){
  await page.setViewportSize({width,height});await settled();await page.evaluate(()=>scrollTo(0,0));
  const geometry=await page.evaluate(()=>{const home=document.querySelector('.home-first-screen').getBoundingClientRect(),title=document.querySelector('.home-first-screen h1').getBoundingClientRect();return {fold:document.querySelector('.resume-learning').getBoundingClientRect().top,height:innerHeight,homeCenter:home.x+home.width/2,titleCenter:title.x+title.width/2,align:getComputedStyle(document.querySelector('.home-first-screen h1')).textAlign};});
  assert(Math.abs(geometry.fold-geometry.height)<=1,JSON.stringify(geometry));assert(Math.abs(geometry.homeCenter-geometry.titleCenter)<=1);assert.equal(geometry.align,'center');
  await shot('home-fold-'+width+'-'+height);
 }
 await page.setViewportSize({width:1440,height:1000});await settled();await page.evaluate(()=>scrollTo(0,0));await axe('home-owner-refinement');
 await page.locator('.resume-learning').scrollIntoViewIfNeeded();assert(await page.evaluate(()=>scrollY>0));checks.push('Centered title without subtitle/header label; divider at viewport bottom at four sizes and continuation reachable by scroll');
 await page.evaluate(()=>scrollTo(0,0));await page.locator('#goal').fill('Keep this goal while I choose a reference.');await click('Add reference');await click('Use an existing reference');await page.locator('#reference-search').fill('exam');await page.locator('[data-existing=exam]').click();assert.match(await page.locator('#selected-reference').innerText(),/Exam revision/);assert.match(await page.locator('#goal').inputValue(),/Keep this goal/);await click('Remove selected reference');assert.equal(await page.locator('.attachment-chip').count(),0);await shot('home-reference-light');checks.push('Existing reference selected and removable without losing goal');
 await scenario('[data-demo-library=empty]');assert.equal(await page.locator('.empty h2').innerText(),'Your library is empty');await shot('library-empty-light');await axe('library-empty');
 await scenario('[data-demo-library=category-empty]');assert.equal(await page.locator('.empty h2').innerText(),'No saved explanations yet');assert.equal(await page.locator('[data-filter=note] .filter-count').innerText(),'0');await click('Show all items');assert.equal(await page.locator('.resource-row').count(),2);
 await scenario('#demo-library-normal');await page.locator('#library-search').fill('missing sample');assert.match(await page.locator('.empty h2').innerText(),/No matches/);await click('Clear search');assert.equal(await page.locator('.resource-row').count(),4);
 await scenario('[data-demo-library=error]');await shot('library-error-light');await click('Try again');assert.equal(await page.locator('.resource-row').count(),4);checks.push('Distinct whole/category/search/fetch library states with count and recovery');
 await scenario('#demo-activity-empty');assert.equal(await page.locator('.empty h2').innerText(),'No activity yet');await scenario('#demo-activity-normal');await page.locator('#activity-date').fill('2026-10-20');await shot('activity-history-range');assert.match(await page.locator('.empty h2').innerText(),/outside the sample history/);await click('Show all loaded events');assert.equal(await page.locator('.event-row').count(),3);checks.push('Empty activity and older-than-loaded history distinguished');
 await configure('practice');await page.locator('#personalize').click();await settled();assert.equal(await page.locator('#style').evaluate(e=>e.tagName),'TEXTAREA');await shot('pattern-light');await click('Close learning pattern');await settled();
 for(const width of [360,390,768,1024,1280,1440]){await page.setViewportSize({width,height:900});await settled();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
 await page.setViewportSize({width:390,height:844});await settled();await shot('phone-ready-light');await axe('phone-ready');await click('Submit answer');await shot('phone-wait-light');await click('Finish preview wait');await shot('phone-error-light');await axe('phone-error');await click('Edit answer');await click('Switch to dark theme');await shot('phone-ready-dark');await axe('phone-dark');
 await page.emulateMedia({reducedMotion:'reduce'});await click('Submit answer');assert.equal(await page.locator('.thinking-dot').evaluate(e=>getComputedStyle(e).animationName),'none');await click('Finish preview wait');await click('Edit answer');checks.push('Six widths, both themes, text panel, static reduced-motion waiting');
 assert.deepEqual(errors,[]);assert.deepEqual(outside,[]);assert.deepEqual(mutations,[]);
 const result={checks,errors,outside,mutations,accessibility};fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(result,null,2));
 assert.equal(accessibility.flatMap(x=>x.violations).length,0,JSON.stringify(accessibility.filter(x=>x.violations.length),null,2));
 console.log(JSON.stringify({checks,axeViews:accessibility.length,violations:0,errors,outside,mutations},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
