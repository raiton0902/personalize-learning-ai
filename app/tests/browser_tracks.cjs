const {chromium}=require('../../frontend_tools/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('fs'),path=require('path');
const base='http://127.0.0.1:'+process.argv[2];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  let index=0;
  for(const theme of ['dark','light'])for(const [width,height] of [[1440,1000],[390,844]])for(const mode of ['signup','login','redirect']){
   const ctx=await browser.newContext({viewport:{width,height}});
   await ctx.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
   const p=await ctx.newPage();p.setDefaultTimeout(5000);
   const errors=[];p.on('pageerror',e=>errors.push(e.message));
   const creates=[];p.on('request',r=>{if(r.method()==='POST'&&r.url()===base+'/api/courses')creates.push(r.postDataJSON())});
   const email=`tracks-${index++}@example.invalid`,password='synthetic-browser-pass';
   if(mode==='login'){
    assert.equal((await p.request.post(base+'/api/auth/signup',{data:{email,password}})).status(),200);
    await p.request.post(base+'/api/logout');
   }
   await p.goto(base);await p.locator('.auth-button.signup:not([disabled])').waitFor();
   await p.evaluate(t=>{themeChoice=t;applyTheme();syncThemeLabels()},theme);
   if(mode==='signup'){
    await p.getByLabel('Learning goal',{exact:true}).fill('Cancelled guest goal');
    await p.getByRole('button',{name:'Sign up',exact:true}).click();
    assert(await p.evaluate(()=>sessionStorage.getItem('pending-guest-learning')));
    await p.getByRole('button',{name:'Back to learning',exact:true}).click();
    await p.getByLabel('Learning goal',{exact:true}).fill('   ');
    await p.getByRole('button',{name:'Sign up',exact:true}).click();
    assert.equal(await p.evaluate(()=>pendingGuestLearning),null);
    assert.equal(await p.evaluate(()=>sessionStorage.getItem('pending-guest-learning')),null);
    await p.getByRole('button',{name:'Back to learning',exact:true}).click();
   }
   const goal='I want to learn C++ to build STL tools for my university exam next Friday, I have 4 hours this week and already know basic Python loops';
   await p.getByLabel('Learning goal',{exact:true}).fill(goal);
   if(mode==='signup')await p.getByLabel('Learning goal',{exact:true}).press('Enter');
   else await p.getByRole('button',{name:mode==='login'?'Log in':'Sign up',exact:true}).click();
   const pending=await p.evaluate(()=>JSON.parse(sessionStorage.getItem('pending-guest-learning')));
   assert.equal(pending.profile.goal,goal);assert(pending.request_id);
   if(mode==='redirect'){
    await p.request.post(base+'/api/auth/signup',{data:{email,password}});
    await p.route('**/assets/learning-ui.js',async r=>{await new Promise(resolve=>setTimeout(resolve,400));await r.continue()});
    await p.reload();
   }else{
    await p.getByLabel('Email',{exact:true}).fill(email);await p.getByLabel('Password',{exact:true}).fill(password);
    if(mode==='login'){
     await p.getByLabel('Password',{exact:true}).fill('incorrect-password');
     await p.locator('.auth-submit').click();
     await p.locator('#live-status.error').waitFor();
     assert.equal(creates.length,0);
     assert(await p.evaluate(()=>sessionStorage.getItem('pending-guest-learning')));
     await p.getByLabel('Password',{exact:true}).fill(password);
    }
    await p.locator('.auth-submit').click();
   }
   await p.locator('.intake-card').waitFor();
   assert.equal(creates.length,1);assert.equal(creates[0].request_id,pending.request_id);
   assert.equal(await p.evaluate(()=>sessionStorage.getItem('pending-guest-learning')),null);
   assert.equal(await p.locator('.right-panel').isVisible(),false);
   assert.match(await p.locator('#intake-input-intended_outcome').inputValue(),/STL/);
   assert.match(await p.locator('#intake-input-starting_knowledge').inputValue(),/Python loops/);
   assert.match(await p.locator('#intake-input-time_budget').inputValue(),/4 hours/);
   assert.match(await p.locator('#intake-input-requirements').inputValue(),/exam/);
   await p.locator('#intake-input-time_budget').fill('Edited: 2 hours');
   assert.equal(await p.locator('#intake-input-time_budget').inputValue(),'Edited: 2 hours');
   assert.equal(await p.locator('[data-track]').count(),0);
   await p.locator('#intake-input-time_budget').focus();await p.keyboard.press('Tab');await p.keyboard.press('Shift+Tab');
   assert.equal(await p.locator('#intake-input-time_budget').evaluate(e=>getComputedStyle(e).outlineStyle),'none');
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(mode==='signup'){
    const shots=path.resolve(__dirname,'../../docs/qa/screenshots/tracks');fs.mkdirSync(shots,{recursive:true});
    await p.screenshot({path:path.join(shots,`${theme}-${width}.png`),fullPage:true});
   }
   await p.getByRole('button',{name:'Propose curriculum',exact:true}).click();await p.locator('.curriculum-hierarchy').waitFor();
   assert.equal(await p.locator('.module-card').count(),3);
   assert.deepEqual(await p.locator('.module-level').allTextContents(),['Beginner','Intermediate','Advanced']);
   await require('./plan_targets.cjs')(p);
   assert.equal(await p.getByRole('button',{name:'Extend to Advanced path',exact:true}).count(),0);
   await p.getByRole('button',{name:'Request changes',exact:true}).click();
   assert.equal(await p.locator('dialog [data-track]').count(),0);
   await p.locator('#done').click();
   assert.deepEqual(errors,[]);
   await p.reload();await p.locator('.avatar').waitFor();assert.equal(creates.length,1);
   await ctx.close();
  }
  console.log('12 guest/auth/redirect + unified curriculum/theme/viewport scenarios passed; redirect is simulated, Google consent untested.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
