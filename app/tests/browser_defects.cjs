// QA-03..QA-06, intake/history/menu follow-ups, UI-01..UI-08: isolated regression evidence.
const {chromium}=require('../../frontend_tools/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const base='http://127.0.0.1:'+process.argv[2],phase=process.argv[3]||'after';
const out=path.resolve(__dirname,'../../.ui_review/2026-10-29-fixes');
fs.mkdirSync(path.join(out,'data'),{recursive:true});fs.mkdirSync(path.join(out,'screenshots'),{recursive:true});
const checks=[];
const visual=[];
const axeEvidence=[];
const focusEvidence=[];
function metrics(){
 const rgb=value=>{const a=(value.match(/[\d.]+/g)||[]).map(Number);return a.length>=3?[a[0],a[1],a[2],a[3]??1]:[0,0,0,0]};
 const over=(a,b)=>[...a.slice(0,3).map((n,i)=>n*a[3]+b[i]*(1-a[3])),1];
 const luminance=c=>c.slice(0,3).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4}).reduce((a,n,i)=>a+n*[.2126,.7152,.0722][i],0);
 const ratio=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
 const hex=c=>'#'+c.slice(0,3).map(n=>Math.round(n).toString(16).padStart(2,'0')).join('');
 function background(e){const chain=[];for(let n=e;n;n=n.parentElement)chain.unshift(rgb(getComputedStyle(n).backgroundColor));return chain.reduce((b,a)=>over(a,b),[255,255,255,1])}
 const pairs=[],bounds=[],sizes=[],targets=[];
 for(const e of document.querySelectorAll('body *')){
  if(!e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})||e.closest('[aria-hidden="true"],.guest-notebook'))continue;
  if(document.querySelector('dialog[open]')&&!e.closest('dialog[open]'))continue;
  const c=getComputedStyle(e),r=e.getBoundingClientRect(),selector=e.id?'#'+e.id:e.tagName.toLowerCase()+'.'+(typeof e.className==='string'?e.className:'');
  if(e.closest('button:disabled,[aria-disabled="true"]'))continue;
  const b=background(e);
  const add=(kind,color,min)=>{const foreground=over(rgb(color),b);pairs.push({selector,kind,foreground:hex(foreground),background:hex(b),ratio:ratio(foreground,b),min})};
  if([...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))add('text',c.color,parseFloat(c.fontSize)>=24||parseFloat(c.fontSize)>=18.66&&+c.fontWeight>=700?3:4.5);
  if(e.matches('input,textarea')&&e.getAttribute('placeholder'))add('placeholder',getComputedStyle(e,'::placeholder').color,4.5);
  if(e.matches('svg')&&!e.closest('.katex'))add('icon',c.color,3);
  if(e.matches('input:not([type=file]),textarea,select')&&!e.matches('.goal,.library-search input,.chat-composer textarea'))bounds.push({selector,ratio:ratio(over(rgb(c.borderTopColor),b),b),width:parseFloat(c.borderTopWidth)});
  if(innerWidth<=390){
   if(e.matches('p,.lesson-copy,li')&&!e.matches('.episode-eyebrow,.filter-status,.sample-note')&&!e.closest('.katex,.equation-stack'))sizes.push({selector,type:'prose',size:parseFloat(c.fontSize),lineHeight:parseFloat(c.lineHeight)/parseFloat(c.fontSize)});
   if(e.matches('small,label,.meta-pill,.line-label,.flag-tag,.filter-count,.episode-eyebrow,.filter-status'))sizes.push({selector,type:'meta',size:parseFloat(c.fontSize),lineHeight:parseFloat(c.lineHeight)/parseFloat(c.fontSize)});
   if(e.matches('button,input:not([type=hidden]),select,summary'))targets.push({selector,width:r.width,height:r.height});
  }
 }
 return {pairs,bounds,sizes,targets,overflow:document.documentElement.scrollWidth>innerWidth};
}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
 const p=await context.newPage();p.setDefaultTimeout(3000);
 async function check(id,fn){try{await fn();checks.push({id,pass:true})}catch(e){checks.push({id,pass:false,error:String(e)});}}
 async function verifyFocus(locator,theme){
  await locator.focus();await p.keyboard.press('Tab');await p.keyboard.press('Shift+Tab');
  const c=await locator.evaluate(e=>{const s=getComputedStyle(e);return {tag:e.tagName,outline:s.outlineStyle,width:s.outlineWidth,offset:s.outlineOffset,color:s.outlineColor}});
  focusEvidence.push({theme,...c});if(c.tag==='INPUT'||c.tag==='TEXTAREA'){assert.equal(c.outline,'none')}else{assert.equal(c.outline,'solid');assert.equal(c.width,'2px');assert.equal(c.offset,'3px');assert.equal(c.color,theme==='dark'?'rgb(184, 192, 204)':'rgb(82, 88, 102)')}
 }
 const click=name=>p.getByRole('button',{name,exact:true}).click();
 const home=()=>p.evaluate(()=>{document.querySelector('dialog[open]')?.close();home();setPanel(false)});
 try{
 await p.goto(base);await click('Sign up');await p.getByLabel('Email',{exact:true}).fill('regression@example.invalid');await p.getByLabel('Password',{exact:true}).fill('synthetic-test-only');await p.locator('.auth-submit').click();await p.locator('.avatar').waitFor();await home();
 await click('Library');
 for(const [index,ext] of ['txt','md','docx','pdf'].entries())await check('QA-03 Library refresh after '+ext+' upload',async()=>{
  await click('+ Add a reference');await p.getByLabel('Reference file',{exact:true}).setInputFiles(path.join(process.argv[4],'regression.'+ext));await click('Read file');await p.getByRole('heading',{name:'regression.'+ext,exact:true}).waitFor();await click('Close');await p.getByRole('button',{name:new RegExp('regression\\.'+ext)}).waitFor();assert.match(await p.locator('.filter-status').innerText(),new RegExp((index+1)+' items?'));
 });
 await home();await p.getByLabel('Learning goal',{exact:true}).fill('I want to learn physics');await click('Build my learning plan');await p.locator('.intake-card').waitFor();
 await p.locator('#intake-input-intended_outcome').fill('Understand motion');await p.locator('#intake-input-starting_knowledge').fill('Beginner');await click('Save draft');await p.locator('#submit-intake-btn:not([disabled])').waitFor();
 await check('QA follow-up intake re-edit',async()=>{await p.locator('#intake-input-intended_outcome').waitFor();await p.locator('#intake-input-intended_outcome').fill('Understand force');await click('Save draft');await p.locator('#submit-intake-btn:not([disabled])').waitFor();assert.equal(await p.locator('#intake-input-intended_outcome').inputValue(),'Understand force')});
 await home();
 await check('QA-04 honest draft progress',async()=>{assert(!/1 of 0 objectives/.test(await p.locator('.learning-card').innerText()));assert.match(await p.locator('.learning-card').innerText(),/Draft.*Finish setup/)});
 await check('QA follow-up history after source selection',async()=>{
  await click('Add reference');await p.getByRole('button',{name:/Use an existing reference/}).click();await p.locator('[data-existing]').first().click();await p.locator('.course-title').first().click();await p.locator('.intake-card').waitFor();
 });
 await home();
 await check('QA-05 old date below cap',async()=>{await p.evaluate(()=>{savedActivity=[{id:'one',created:'2026-10-28T12:00:00Z',title:'Test event'}];bodyView();setActiveView('activity');renderActivity()});await p.getByLabel('Activity date',{exact:true}).fill('2000-01-01');assert.match(await p.locator('#activity-list').innerText(),/No activity on this date/)});
 await check('QA-05 old date at cap',async()=>{await p.evaluate(()=>{savedActivity=Array.from({length:500},(_,i)=>({id:String(i),created:'2026-10-28T12:00:00Z',title:'Test event'}));renderActivity()});assert.match(await p.locator('#activity-list').innerText(),/500-event window/)});
 await home();
 await check('QA-06 extraction error inside modal',async()=>{await click('Add reference');await p.getByRole('button',{name:/Paste link/}).click();await p.getByLabel('Reference link',{exact:true}).fill('https://example.invalid/');await p.route('**/api/resources',r=>r.fulfill({status:400,json:{error:'Fixture extraction failed'}}));await click('Read reference');await p.getByRole('dialog').getByRole('alert').waitFor();assert.match(await p.getByRole('dialog').getByRole('alert').innerText(),/Fixture extraction failed/);await p.unroute('**/api/resources')});
 await home();await click('Account menu');
 await check('QA follow-up account menu ARIA',async()=>{await p.getByRole('button',{name:/Switch to .* theme/}).click();assert.equal(await p.getByRole('button',{name:'Account menu',exact:true}).getAttribute('aria-expanded'),'false')});
 await home();await p.evaluate(()=>{setSigned(false);home()});
 for(const theme of ['dark','light']){
  await p.evaluate(t=>{themeChoice=t;applyTheme();syncThemeLabels()},theme);await p.waitForTimeout(250);
  await check('UI-05 axe notebook '+theme,async()=>{await p.addScriptTag({path:path.resolve(__dirname,'../../frontend_tools/node_modules/axe-core/axe.min.js')});const a=await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(a.violations.map(v=>v.id),[])});
  await check('UI-04 textarea and button keyboard focus '+theme,async()=>{await verifyFocus(p.getByLabel('Learning goal',{exact:true}),theme);await verifyFocus(p.locator('.guest-theme'),theme)});
  await p.screenshot({path:path.join(out,'screenshots',phase+'-home-'+theme+'.png')});
 }
 const fixture={id:'synthetic-ui',state:{stage:'repair',version:1,approved_version:1,objective_index:0,
  profile:{goal:'Learn equations',language:'automatic',tone:'Brief',interest:''},source:{id:'general',title:'Learning goal',text:'Synthetic reference'},
  curriculum:{title:'Linear equations',objectives:[{id:'linear',title:'Keep both sides balanced',outcome:'Solve a linear equation',minutes:10,source_ids:['general'],prerequisites:[]}]},
  lesson:{explanation:'Subtract the same amount from both sides. Divide both sides by the coefficient.',worked_example:['3x + 5 = 20','3x = 15','x = 5']},
  question:{id:'synthetic-question',prompt:'Solve 3x + 5 = 20.'},attempt:{answer:'8',work:'3x + 5 = 20\n3x = 20 + 5'},assessment:{status:'incorrect',evidence:'Check the subtraction.',possible_gap:'Sign change'},
  repair:{explanation:'Subtract 5 on each side.',observation:'Check the operation.'},lesson_history:[],attempts:[],
  episode:{steps:[{number:1,label:'Find the step',completed:true},{number:2,label:'Repair it',active:true},{number:3,label:'Try independently'}],
   work_sheet:{has_flagged_step:true,lines:[{text:'3x + 5 = 20'},{text:'3x = 20 + 5',flagged:true,span:{start:8,end:9,quoted_text:'+'}}]},observation:{id:'fixture',text:'Check the operation.',choices:[]}}}};
 await p.evaluate(()=>setSigned(true));
 for(const theme of ['dark','light'])for(const [width,height] of [[1440,900],[1024,768],[390,844],[360,640]]){
  await p.setViewportSize({width,height});
  await p.evaluate(({theme,fixture})=>{themeChoice=theme;applyTheme();syncThemeLabels();renderCourse(fixture);setPanel(false)}, {theme,fixture});await p.waitForTimeout(300);
  await check(`UI-08 first viewport and disclosure ${theme}/${width}`,async()=>{const box=await p.locator('.work-sheet').boundingBox();assert(box&&box.y<height-44);const summary=p.locator('.lesson-recap summary');await summary.focus();await summary.press('Enter');assert.equal(await p.locator('.lesson-recap').getAttribute('open'),'');await summary.press('Enter')});
  for(const state of ['repair','practice','review','library','login','signup']){
   if(state==='practice')await p.evaluate(f=>renderCourse({...f,state:{...f.state,stage:'attempt'}}),fixture);
   if(state==='review')await p.evaluate(f=>renderCourse({...f,state:{...f.state,stage:'lesson',review_status:{due_items:[{id:'linear',title:'Balance equations',label:'Due review',mode:'review'}]}}}),fixture);
   if(state==='library')await p.evaluate(()=>{bodyView();setActiveView('library');renderLibrary()});
   if(state==='login'||state==='signup')await p.evaluate(mode=>auth(mode),state);
   if(state==='login'&&width===1440)await check('UI-04 email input keyboard focus '+theme,()=>verifyFocus(p.getByLabel('Email',{exact:true}),theme));
   await p.waitForTimeout(220);const m=await p.evaluate(metrics);visual.push({theme,width,state,...m});
   await check(`UI-01..03 contrast ${state}/${theme}/${width}`,async()=>{assert.deepEqual(m.pairs.filter(x=>x.ratio<x.min),[])});
   await check(`UI-06 boundaries ${state}/${theme}/${width}`,async()=>{assert.deepEqual(m.bounds.filter(x=>x.width&&x.ratio<3),[])});
   const accessibility=await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
   axeEvidence.push({state,theme,width,violations:accessibility.violations,incomplete:accessibility.incomplete.map(x=>({id:x.id,nodes:x.nodes.length}))});
   await check(`UI axe ${state}/${theme}/${width}`,async()=>{assert.deepEqual(accessibility.violations.map(x=>x.id),[])});
   if(width<=390)await check(`UI-07 touch ${state}/${theme}/${width}`,async()=>{assert(!m.overflow);assert.deepEqual(m.targets.filter(x=>x.width<43.9||x.height<43.9),[]);assert.deepEqual(m.sizes.filter(x=>x.size<(x.type==='prose'?16:12)||x.lineHeight<(x.type==='prose'?1.5:1.4)-.01),[])});
   await p.screenshot({path:path.join(out,'screenshots',`${phase}-verified-${state}-${theme}-${width}.png`)});
  }
 }
 }finally{await context.close();await browser.close();fs.writeFileSync(path.join(out,'data',phase+'-functional.json'),JSON.stringify(checks,null,2));fs.writeFileSync(path.join(out,'data',phase+'-dom.json'),JSON.stringify(visual,null,2));fs.writeFileSync(path.join(out,'data',phase+'-axe.json'),JSON.stringify(axeEvidence,null,2));fs.writeFileSync(path.join(out,'data',phase+'-focus.json'),JSON.stringify(focusEvidence,null,2));console.log(JSON.stringify(checks.filter(c=>!c.pass)));if(checks.some(c=>!c.pass))process.exitCode=1;}
})().catch(e=>{console.error(e);process.exitCode=1});
