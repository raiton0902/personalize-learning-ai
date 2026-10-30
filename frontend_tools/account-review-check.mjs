import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:1440,height:1000}});await p.goto('http://127.0.0.1:8765');
assert(await p.locator('body').evaluate(n=>n.classList.contains('guest')));assert(!(await p.locator('.sidebar').isVisible()));await p.screenshot({path:'design_review/guest.png'});
await p.getByRole('button',{name:'Personalize',exact:true}).click();assert(await p.getByRole('heading',{name:'Create your account'}).isVisible());await p.screenshot({path:'design_review/auth.png'});
await p.getByRole('button',{name:'Preview signed-in experience'}).click();assert(await p.locator('.right-panel').isVisible());assert.equal(await p.locator('.learning-card').count(),2);await p.screenshot({path:'design_review/signed-in.png'});
await p.getByRole('button',{name:'Close learning pattern'}).click();await p.getByRole('button',{name:'Open learning pattern'}).click();assert(await p.locator('.right-panel').isVisible());await p.getByRole('button',{name:'Close learning pattern'}).click();await p.locator('.learning-card').first().click();assert(await p.locator('.learning-view').isVisible());await p.getByRole('button',{name:'Back to new learning'}).click();
await p.getByRole('button',{name:'Account menu'}).click();await p.getByRole('button',{name:'Log out',exact:true}).click();assert(!(await p.locator('.sidebar').isVisible()));
await p.setViewportSize({width:390,height:844});await p.screenshot({path:'design_review/guest-mobile.png'});assert(await p.evaluate(()=>document.documentElement.scrollWidth===innerWidth));await b.close();console.log('Passed guest/auth preview, automatic right panel, two learning sessions, reopen/close, logout, mobile overflow.');

