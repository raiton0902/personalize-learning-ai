const {chromium} = require('../../frontend_tools/node_modules/playwright');
const assert = require('node:assert/strict');
const base = 'http://127.0.0.1:' + process.argv[2];

(async () => {
 const browser = await chromium.launch({channel: 'chrome', headless: true});
 try {
  let index = 0;
  for (const theme of ['dark', 'light']) for (const [width, height] of [[1440, 1000], [390, 844]]) {
   const ctx = await browser.newContext({viewport: {width, height}});
   await ctx.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
   const p = await ctx.newPage(); p.setDefaultTimeout(8000);
   const errors = []; p.on('pageerror', error => errors.push(error.message));
   assert.equal((await ctx.request.post(base + '/api/auth/signup', {data: {email: `workflow-${index++}@example.invalid`, password: 'synthetic-audit-password'}})).status(), 200);
   await p.goto(base); await p.locator('.avatar').waitFor();
   await p.waitForFunction(() => typeof currentUser !== 'undefined' && currentUser && !document.body.inert);
   await p.evaluate(t => {themeChoice = t; applyTheme(); syncThemeLabels()}, theme);

   for (const action of ['skip_intake', 'intake']) {
    const cramming = action === 'intake';
    const created = await (await ctx.request.post(base + '/api/courses', {data: {profile: {goal: 'Learn biology ' + action, cramming, intended_outcome: 'Understand cells', time_budget: '3 hours'}}})).json();
    await p.evaluate(id => loadCourse(id), created.id);
    await p.locator('#intake-form').waitFor();
    assert.equal(await p.locator('#intake-input-time_budget').getAttribute('maxlength'), '200');
    await p.locator('#intake-input-intended_outcome').fill('Explain cell division');
    const routePath = base + '/api/courses/' + created.id;
    let release, started;
    const gate = new Promise(resolve => release = resolve);
    const began = new Promise(resolve => started = resolve);
    const posts = [];
    const delayed = async route => {
     if (route.request().method() !== 'POST') return route.continue();
     posts.push(route.request().postDataJSON()); started();
     await gate; await route.continue();
    };
    await p.route(routePath, delayed);
    const trigger = p.locator(action === 'skip_intake' ? '#skip-intake-btn' : '#submit-intake-btn');
    await trigger.click(); await began;
    assert.equal(await p.evaluate(() => document.body.inert), true, 'All navigation must lock during a course action');
    assert.equal(await trigger.getAttribute('aria-busy'), 'true', 'Busy state belongs to the clicked control');
    // A second event while pending must not submit another request, even with a different action.
    await p.evaluate(() => { void courseAction('skip_intake', {provisional: true}); });
    assert.equal(posts.length, 1);
    release();
    await p.locator('.curriculum-hierarchy').waitFor();
    await p.waitForFunction(() => !document.body.inert);
    assert.equal(posts.length, 1, 'One click reaches the plan');
    assert.equal(await p.evaluate(() => currentState.stage), 'plan');
    await p.unroute(routePath, delayed);

    // Preferences must not erase course intake fields when saved from the right panel.
    // Tone is universal and survives between courses, so use a distinct value per action.
    await p.evaluate(() => setPanel(true));
    await p.locator('#style').fill('One small step at a time ' + action);
    await p.locator('.save-pattern').click();
    await p.waitForFunction(() => !document.body.inert);
    const saved = await (await ctx.request.get(routePath)).json();
    assert.equal(saved.state.profile.intended_outcome, 'Explain cell division');
    assert.equal(saved.state.profile.time_budget, '3 hours');
    await p.evaluate(() => setPanel(false));

    // List refresh failure after a successful action must not masquerade as generation failure.
    await p.route(base + '/api/activity', route => route.fulfill({status: 503, contentType: 'application/json', body: JSON.stringify({error: 'Synthetic history refresh failure'})}));
    await p.getByRole('button', {name: 'Accept this plan', exact: true}).click();
    await p.waitForFunction(() => currentState.stage === 'ready' && !document.body.inert);
    assert.equal(await p.locator('#retry-operation').count(), 0);
    await p.unroute(base + '/api/activity');
    await p.getByRole('button', {name: 'Teach me this idea', exact: true}).click();
    await p.waitForFunction(() => currentState.stage === 'lesson' && !document.body.inert);
    assert.equal(await p.locator('.operation-error').count(), 0);
   }

   // Lost response: retry the exact mutation ID and recover the already-saved plan.
   const created = await (await ctx.request.post(base + '/api/courses', {data: {profile: {goal: 'Learn chemistry'}}})).json();
   const routePath = base + '/api/courses/' + created.id;
   await p.evaluate(id => loadCourse(id), created.id);
   let firstPayload;
   await p.route(routePath, async route => {
    if (route.request().method() !== 'POST') return route.continue();
    firstPayload = route.request().postDataJSON();
    await route.fetch(); await route.abort('failed');
   });
   await p.locator('#skip-intake-btn').click(); await p.locator('#retry-operation').waitFor();
   assert.equal(await p.evaluate(() => document.body.inert), false);
   await p.unroute(routePath);
   const replay = p.waitForResponse(r => r.url() === routePath && r.request().method() === 'POST');
   await p.locator('#retry-operation').click();
   const response = await replay;
   assert.equal(response.request().postDataJSON().request_id, firstPayload.request_id);
   assert.equal((await response.json()).deduplicated, true);
   await p.locator('.curriculum-hierarchy').waitFor();
   await p.waitForFunction(() => !document.body.inert);

   // A failed Save must keep the navigation confirmation open and retain the edits.
   await p.evaluate(() => setPanel(true)); await p.locator('#style').fill('An unsaved change');
   await p.route(base + '/api/profile', route => route.fulfill({status: 400, contentType: 'application/json', body: '{"error":"Synthetic save failure"}'}));
   await p.evaluate(() => {window.auditNavigated = false; guardNavigation(() => {window.auditNavigated = true})});
   await p.locator('#confirm-save').click(); await p.locator('dialog .dialog-error').waitFor();
   assert.equal(await p.evaluate(() => window.auditNavigated), false);
   assert.equal(await p.locator('#style').inputValue(), 'An unsaved change');
   await p.locator('#keep-editing').click();
   assert.deepEqual(errors, []);
   assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
   await ctx.close();
  }
  console.log('Workflow consistency: single-click standard/Cramming, operation locking, refresh failure, lost-response deduplication, scoped preferences and failed-save guard passed at two sizes in both themes.');
 } finally {await browser.close()}
})().catch(error => {console.error(error); process.exitCode = 1});
