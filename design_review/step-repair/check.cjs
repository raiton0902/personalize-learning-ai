const {chromium}=require('../../frontend_tools/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base='http://127.0.0.1:8768/';
const shots=path.join(__dirname,'screenshots');fs.mkdirSync(shots,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.setDefaultTimeout(5000);
 const errors=[],external=[],checks=[],accessibility=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))external.push(r.url());});
 const click=name=>page.getByRole('button',{name,exact:true}).or(page.getByRole('menuitem',{name,exact:true})).click();
 async function settled(){await page.evaluate(async()=>Promise.allSettled(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished)));}
 async function shot(name){await settled();await page.screenshot({path:path.join(shots,name+'.png'),fullPage:true});}
 async function axe(name){await settled();await page.addScriptTag({path:path.resolve(__dirname,'../../frontend_tools/node_modules/axe-core/axe.min.js')});const r=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));accessibility.push({name,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});}
 async function fit(){const r=await page.evaluate(()=>({w:innerWidth,s:document.documentElement.scrollWidth}));assert(r.s<=r.w,JSON.stringify(r));}
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);await fit();await shot('01-stuck-step-dark');await axe('stuck-dark');await page.locator('#personalize').click();await shot('01b-pattern-dark');await click('Close learning pattern');await settled();
 await click("That's not where I'm stuck");await click('Working with negative numbers');assert.match(await page.locator('.correction-note').innerText(),/negative numbers/);checks.push('Correctable sample observation');
 await click('Work through this step');await page.locator('#repair-next').fill('8');await click('Check this step');assert.equal(await page.locator('#repair-next').getAttribute('aria-invalid'),'true');assert.equal(await page.locator('#repair-next').evaluate(e=>e===document.activeElement),true);
 await page.locator('#repair-next').fill('x = 5');await page.locator('#repair-next').press('Enter');await page.getByRole('heading',{name:'Your turn. A fresh equation.'}).waitFor();await shot('03-independent-problem');await axe('independent');
 await page.locator('#transfer-answer').fill('x = 6');await page.locator('#transfer-answer').press('Enter');assert.match(await page.locator('.result-summary h2').innerText(),/Solved independently/);await shot('04-independent-evidence');await axe('evidence');checks.push('Wrong correction focus, Enter submission, fixed changed answer, independent evidence');
 await click('Restart sample');await click('Work through this step');await page.locator('#repair-next').fill('5');await click('Check this step');await click('I need a hint');await page.locator('#transfer-answer').fill('6');await click('Check my answer');assert.equal(await page.locator('.result-summary h2').innerText(),'Solved with a hint');checks.push('Hint use changes evidence');
 await click('Review the repaired step');await shot('02-repair-step');
 await click('Switch to light theme');await shot('05-repair-light');await axe('repair-light');
 await page.locator('[data-route=home]').first().click();await page.locator('#new-learning').click();await page.locator('#remove-reference').click();await click('Prepare for an exam');assert.match(await page.locator('#goal').inputValue(),/exam/);assert.equal(await page.locator('#dialog').evaluate(e=>e.open),false);
 await click('Add reference');await click('Use an existing reference');await page.locator('#reference-search').fill('exam');await page.locator('[data-existing=exam]').click();assert.match(await page.locator('#selected-reference').innerText(),/Exam revision/);assert.match(await page.locator('#goal').inputValue(),/exam/);checks.push('Editable intent no generation; existing reference preserves goal');await shot('06-new-learning-light');await axe('home-light');
 await page.locator('#theme').click();await shot('07-new-learning-dark');
 await click('Add reference');await click('Use an existing reference');await shot('08-reuse-reference');await axe('reuse-dialog');await page.keyboard.press('Escape');
 await page.locator('[data-route=library]').first().click();await settled();assert.equal(await page.locator('#pattern').isHidden(),true);await page.locator('#library-search').fill('no such algebra material');assert.match(await page.locator('.empty h2').innerText(),/No matches/);await click('Clear search');await shot('09-library');await axe('library');checks.push('Search empty recovery and side panel restriction');
 await page.locator('[data-route=activity]').first().click();await page.locator('input[type=date]').fill('2026-10-26');await shot('10-activity');
 await page.locator('[data-route=home]').first().click();await click('Preview states');await page.locator('#sample-episode').click();await settled();
 for(const width of [360,390,768,1024,1280,1440]){await page.setViewportSize({width,height:900});await settled();await fit();}checks.push('Six viewport widths without overflow');
 await page.setViewportSize({width:390,height:844});await settled();await shot('11-phone-dark');await axe('phone-dark');
 await page.locator('#personalize').click();await settled();assert.equal(await page.locator('#style').evaluate(e=>e.tagName),'TEXTAREA');await shot('12-phone-pattern');await axe('phone-pattern');await click('Close learning pattern');
 await click('Switch to light theme');await shot('13-phone-light');await axe('phone-light');
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#personalize').click();await settled();assert.equal(await page.locator('#pattern').isVisible(),true);await click('Close learning pattern');checks.push('Reduced motion and retained text-input panel');
 await page.setViewportSize({width:1440,height:1000});await settled();
 await page.locator('#personalize').click();await settled();await page.locator('#style').fill('Keep the explanation short.');await click('Close learning pattern');await page.locator('#keep-editing').click();assert.equal(await page.locator('#style').inputValue(),'Keep the explanation short.');await click('Close learning pattern');await page.locator('#confirm-save').click();await page.getByRole('dialog').waitFor({state:'hidden'});await settled();checks.push('Dirty pattern Keep editing and Save protect changes');
 await page.locator('#question-input').fill('Why subtract both sides?');await page.locator('#question-input').press('Enter');await page.locator('#open-answer').click();await page.getByRole('heading',{name:'Why subtract both sides?'}).waitFor();await page.locator('#reply-input').fill('Does the balance stay equal?');await page.locator('#reply-input').press('Enter');await page.locator('.thinking').waitFor();await page.locator('#reply-input').waitFor({state:'visible'});await page.waitForFunction(()=>!document.querySelector('.thinking'));assert.equal(await page.locator('.chat-message.user').count(),2);await click('Back to lesson');checks.push('Saved question reopen, scoped follow-up and assistant loading');
 await click('Download checkpoint as…');const downloadPromise=page.waitForEvent('download');await click('Markdown (.md)');const download=await downloadPromise;assert.match(download.suggestedFilename(),/\.md$/);checks.push('Static sample checkpoint download');
 await page.locator('#new-learning').click();await click('Add reference');await click('Paste a link');await page.locator('#reference-link').fill('not a url');await page.locator('#reference-link').press('Enter');assert.equal(await page.locator('#reference-link').getAttribute('aria-invalid'),'true');await page.keyboard.press('Escape');
 await click('Preview states');await page.locator('#sample-other').click();await page.locator('[data-scenario=upload-error]').click();assert.match(await page.locator('#upload-state').innerText(),/2 MB/);await page.keyboard.press('Escape');checks.push('Upload error state retains recovery action');
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 const result={checks,errors,external,accessibility};fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(result,null,2));
 assert.equal(accessibility.flatMap(x=>x.violations).length,0,JSON.stringify(accessibility.filter(x=>x.violations.length),null,2));
 console.log(JSON.stringify({checks,axeViews:accessibility.length,violations:0,errors,external},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
