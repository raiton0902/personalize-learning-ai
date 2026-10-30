const {chromium}=require('../../frontend_tools/node_modules/playwright');
const path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage();
  await page.route('http://localhost/reading-test',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><main></main>'}));
  await page.goto('http://localhost/reading-test');
  for(const file of ['vendor/marked.js','vendor/purify.js','vendor/katex.js'])await page.addScriptTag({path:path.join(__dirname,'../web',file)});
  await page.evaluate(()=>{
   window.element=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
   window.renderCourse=()=>{};window.home=()=>{};window.route=()=>{};
  });
  await page.addScriptTag({path:path.join(__dirname,'../web/reading.js')});
  const result=await page.evaluate(()=>{
   const old='Then code ---------- const playerScore = 0; console.log(playerScore); ---------- runs as ---------- 0 10 1 ----------';
   const node=richText(old);document.querySelector('main').append(node);
   const valid='```typescript\nconst template = "$x$";\nconsole.log(template);\n```\n\nOutput:\n```text\n$x$\n```\n\nSolve $x^2=4$.\n\n$$\\frac{1}{2}+x=3$$';
   const formatted=richText(valid);document.querySelector('main').append(formatted);
   const tilde=richText('~~~python\nprice = "$5$"\n~~~');
   const safe=richText('```html\n<script>alert(1)</script>\n```');
   return {old:[...node.querySelectorAll('pre code')].map(e=>e.textContent.trim()),
    code:[...formatted.querySelectorAll('pre code')].map(e=>e.textContent),math:formatted.querySelectorAll('.katex').length,
    tilde:tilde.querySelector('pre code').textContent,scripts:safe.querySelectorAll('script').length,
    prose:normalizeLessonBlocks('Before ------ ordinary explanation ------ after'),
    preserved:normalizeLessonBlocks('```text\n------ 12 ------\n```')};
  });
  assert.deepEqual(result.old,['const playerScore = 0; console.log(playerScore);','0 10 1']);
  assert(result.code[0].includes('const template = "$x$";\nconsole.log(template);'));
  assert.equal(result.math,2);assert(result.tilde.includes('"$5$"'));assert.equal(result.scripts,0);
  assert.equal(result.prose,'Before ------ ordinary explanation ------ after');
  assert.equal(result.preserved,'```text\n------ 12 ------\n```');
  console.log('Code/output fence recovery, Markdown, inline/display math, tilde fences and escaping passed.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
