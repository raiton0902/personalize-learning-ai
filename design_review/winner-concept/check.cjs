const {chromium}=require('../../frontend_tools/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:960}});
 page.setDefaultTimeout(6000);
 const errors=[],external=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:8766/')&&!request.url().startsWith('blob:'))external.push(request.url())});
 const click=name=>page.getByRole('button',{name,exact:true}).click();
 const shot=name=>page.screenshot({path:'app/local_results/interface-proposal/'+name+'.png'});
 await page.goto('http://127.0.0.1:8766');
 await click('Understand algebra');
 assert.equal(await page.locator('#goal').inputValue(),'Help me understand algebra.');
 await click('Add reference');await shot('proposed-home-dark');await page.keyboard.press('Escape');
 assert(await page.locator('#upload-menu').isHidden());
 await click('Add reference');await click('Paste a link');
 await page.getByLabel('Reference URL',{exact:true}).fill('https://example.com/algebra');
 await click('Add to preview');assert(await page.locator('.attachment-chip').isVisible());
 await page.locator('#goal').press('Enter');await click('Accept this sample plan');await click('Personalize');
 for(const id of ['style','struggle'])assert.equal(await page.locator('#'+id).evaluate(e=>e.tagName),'TEXTAREA');
 for(const id of ['interest','context'])assert.equal(await page.locator('#'+id).evaluate(e=>e.tagName),'INPUT');
 await page.locator('#style').fill('One short example');await click('Close learning pattern');await click('Keep editing');await click('Save?');
 await page.locator('#language-choice').click();await page.getByLabel('Reply language',{exact:true}).fill('Indonesian');await click('Apply');await click('Save?');
 await page.locator('#style').fill('Changed');await click('Close learning pattern');await click('Discard changes');await click('Personalize');
 assert.equal(await page.locator('#style').inputValue(),'One short example');
 await click('Explain simply');assert(await page.locator('.inline-result').isVisible());
 await click('Give me practice');await page.getByLabel('Your answer',{exact:true}).fill('x = 6');await click('Check sample answer');assert((await page.locator('#practice-result').innerText()).includes('Correct'));
 await click('Learn');await page.locator('#style').evaluate(e=>e.blur());await page.waitForTimeout(250);await shot('proposed-lesson-dark');
 await click('Switch to light theme');await page.waitForTimeout(300);await shot('proposed-lesson-light');
 await click('Library');assert(await page.locator('#pattern').isHidden());assert(!(await page.locator('.sidebar').isVisible()));
 await page.getByRole('searchbox',{name:'Search library'}).fill('variables');assert.equal(await page.locator('#library-list>button').count(),1);
 await page.getByRole('searchbox',{name:'Search library'}).fill('nothing');assert(await page.locator('.empty').isVisible());
 await click('Activity');await page.getByLabel('Date',{exact:true}).fill('2026-10-25');assert(await page.locator('.empty').isVisible());await click('All dates');assert.equal(await page.locator('.event').count(),3);
 await page.locator('.event').first().click();await click('Close learning pattern');await page.locator('#expand').click();await click('Why is it hard?');
 await page.getByRole('textbox',{name:'Question',exact:true}).fill('A follow-up');await page.getByRole('textbox',{name:'Question',exact:true}).press('Enter');assert((await page.locator('.preview-draft').innerText()).includes('does not generate'));
 await page.locator('#back-lesson').click();
 await page.addScriptTag({path:'frontend_tools/node_modules/axe-core/axe.min.js'});
 const audits=[];
 for(const theme of ['light','dark']){
  await page.evaluate(value=>document.documentElement.dataset.theme=value,theme);await page.waitForTimeout(250);
  const violations=await page.evaluate(async()=>{const result=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  audits.push({theme,violations});
 }
 await click('Personalize');await page.locator('#style').evaluate(e=>e.blur());
 for(const width of [1440,1024,390,360]){
  await page.setViewportSize({width,height:844});
  if(width<700&&await page.locator('#pattern').isVisible())await click('Close learning pattern');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow at '+width);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.documentElement.dataset.theme='light');await page.waitForTimeout(200);await shot('proposed-mobile');
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 fs.writeFileSync('app/local_results/interface-proposal/verification.json',JSON.stringify({errors,external,audits},null,2));
 console.log(JSON.stringify({errors,external,audits},null,2));
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
