const {chromium}=require('../../frontend_tools/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base='http://127.0.0.1:'+process.argv[2];
const goal="I got an exam tomorrow on Calculus derivatives, chain rule, and optimization in 5 hours, I'm stuck on word problems and no calculator is allowed";
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  for(const theme of ['dark','light'])for(const [width,height] of [[1440,1000],[390,844]]){
   const ctx=await browser.newContext({viewport:{width,height}});
   await ctx.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
   const p=await ctx.newPage();p.setDefaultTimeout(8000);
   const errors=[],creates=[];p.on('pageerror',e=>errors.push(e.message));
   p.on('request',r=>{if(r.method()==='POST'&&r.url()===base+'/api/courses')creates.push(r.postDataJSON())});
   await p.goto(base);await p.locator('.auth-button.signup:not([disabled])').waitFor();
   await p.evaluate(t=>{themeChoice=t;applyTheme();syncThemeLabels()},theme);
   await p.getByLabel('Learning goal',{exact:true}).fill('Calculus');
   assert.equal(await p.locator('.examples button').count(),5);
   await p.locator('.cramming-starter').first().click();
   assert.match(await p.locator('.goal').inputValue(),/Calculus.*exam tomorrow/);
   assert.equal(await p.locator('#cramming-toggle').getAttribute('aria-pressed'),'true');
   await p.waitForFunction(color=>getComputedStyle(document.querySelector('#cramming-toggle')).color===color,theme==='dark'?'rgb(237, 62, 101)':'rgb(180, 31, 67)');
   assert.equal(await p.locator('.composer').evaluate(e=>getComputedStyle(e).animationName),'cram-perimeter');
   const box=await p.locator('.secondary').boundingBox(),toggle=await p.locator('#cramming-toggle').boundingBox(),personalize=await p.locator('.personalize').boundingBox();
   assert(toggle.x>personalize.x+personalize.width && toggle.x+toggle.width<=box.x+box.width);
   assert(Math.abs((toggle.y+toggle.height/2)-(personalize.y+personalize.height/2))<2);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   const shots=path.join(__dirname,'artifacts','cramming');fs.mkdirSync(shots,{recursive:true});
   await p.screenshot({path:path.join(shots,`home-${theme}-${width}.png`)});
   await p.locator('#cramming-toggle').click();
   assert.equal(await p.locator('#cramming-toggle').getAttribute('aria-pressed'),'false');
   await p.getByLabel('Learning goal',{exact:true}).fill(goal);
   assert.equal(await p.locator('#cramming-toggle').getAttribute('aria-pressed'),'true');
   await p.getByLabel('Learning goal',{exact:true}).press('Enter');
   const pending=await p.evaluate(()=>JSON.parse(sessionStorage.getItem('pending-guest-learning')));
   assert.equal(pending.profile.cramming,true);
   await p.getByLabel('Email',{exact:true}).fill(`cram-${theme}-${width}@example.invalid`);
   await p.getByLabel('Password',{exact:true}).fill('synthetic-cramming-pass');
   await p.locator('.auth-submit').click();await p.locator('.cramming-scope').waitFor();
   assert.equal(creates.length,1);assert.equal(creates[0].profile.cramming,true);
   assert.equal(await p.locator('[data-track]').count(),0);
   assert.equal(await p.locator('#intake-input-intended_outcome').inputValue(),'Calculus derivatives, chain rule, and optimization');
   assert.match(await p.locator('#intake-input-starting_knowledge').inputValue(),/word problems/);
   assert.match(await p.locator('#intake-input-time_budget').inputValue(),/5 hours/);
   assert.match(await p.locator('#intake-input-requirements').inputValue(),/no calculator/);
   await p.locator('#intake-input-time_budget').fill('3 hours');
   await p.locator('#intake-input-starting_knowledge').fill('Chain rule is weakest');
   await p.screenshot({path:path.join(shots,`intake-${theme}-${width}.png`),fullPage:true});
   await p.getByRole('button',{name:'Start cramming plan',exact:true}).click();
   await p.locator('.curriculum-hierarchy').waitFor();
   assert.deepEqual(await p.locator('.module-level').allTextContents(),['Beginner','Intermediate','Advanced']);
   await require('./plan_targets.cjs')(p);
   assert.equal(await p.getByRole('button',{name:'Extend to Advanced path',exact:true}).count(),0);
   assert.equal(await p.evaluate(()=>currentState.profile.time_budget),'3 hours');
   await p.evaluate(()=>home());
   await p.locator('.personalize').click();await p.locator('.right-panel:visible').waitFor();
   if(width>1050){
    const left=p.getByRole('separator',{name:'Resize learning history sidebar'});
    const right=p.getByRole('separator',{name:'Resize learning pattern panel'});
    async function drag(handle,delta){const b=await handle.boundingBox();await p.mouse.move(b.x+b.width/2,b.y+180);await p.mouse.down();await p.mouse.move(b.x+b.width/2+delta,b.y+180,{steps:8});await p.mouse.up();}
    await drag(left,40);await left.press('ArrowRight');
    assert.equal(await left.getAttribute('aria-valuenow'),'308');
    assert.equal(Math.round((await p.locator('.sidebar').boundingBox()).width),308);
    await drag(right,-32);await right.press('ArrowLeft');
    assert.equal(await right.getAttribute('aria-valuenow'),'358');
    assert.equal(Math.round((await p.locator('.right-panel').boundingBox()).width),358);
    assert.equal(await p.evaluate(()=>document.body.classList.contains('is-resizing')),false);
    await p.reload();await p.locator('.avatar').waitFor();
    assert.equal(await p.evaluate(()=>localStorage.getItem('personal-learning-sidebar-width')),'308');
    assert.equal(await left.getAttribute('aria-valuenow'),'308');
    assert.equal(await right.getAttribute('aria-valuenow'),'358');
    assert.equal(Math.round((await p.locator('.right-panel').boundingBox()).width),358);
    await left.press('End');assert.equal(await left.getAttribute('aria-valuenow'),'420');
    await right.press('End');assert.equal(await right.getAttribute('aria-valuenow'),'480');
    await p.setViewportSize({width:1051,height:1000});
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await p.setViewportSize({width,height});
    await left.dblclick({position:{x:5,y:180}});await right.dblclick({position:{x:5,y:180}});
    assert.equal(await left.getAttribute('aria-valuenow'),'252');assert.equal(await right.getAttribute('aria-valuenow'),'310');
   }else{
    assert.equal(await p.locator('.sidebar-resizer').isVisible(),false);
    assert.equal(await p.locator('.right-panel-resizer').isVisible(),false);
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   }
   assert.equal(creates.length,1);
   await p.locator('.close-panel').click();
   await p.emulateMedia({reducedMotion:'reduce'});
   await p.locator('.cramming-starter').last().click();
   assert.equal(await p.locator('.composer').evaluate(e=>getComputedStyle(e).animationName),'none');
   assert.deepEqual(errors,[]);
   await ctx.close();
  }
  console.log('4 both-theme/viewport guest cramming, editable intake, full progression and desktop resize/persistence scenarios passed.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
