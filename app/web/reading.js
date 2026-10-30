function sentenceStart(text){return String(text??'').replace(/^(\s*(?:[>#*_]+\s*)?[“"'‘(]*)(\p{Ll})/u,(_m,prefix,letter)=>prefix+letter.toLocaleUpperCase())}
function cleanTutorText(text){return String(text??'').replace(/\{(?:reasoning|execution|relevance|analysis|final)\}/gi,'').replace(/\$(\d+)andIbuy\$([A-Za-z])\$/gi,(_m,amount,variable)=>amount+' and I buy $'+variable+'$')}
function normalizeLessonBlocks(text){
 return String(text??'').split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g).map((part,i)=>i%2?part:part.replace(/-{6,}\s*([\s\S]*?)\s*-{6,}/g,(whole,body)=>{
  const code=/\b(?:const|let|var)\s+\w+\s*=|\b(?:console\.log|print)\s*\(|\bdef\s+\w+\s*\(|\b(?:int|float|double)\s+\w+\s*[=;(]|#include\s*[<"]/.test(body);
  if(!code&&!/^\s*[-+\d.]+(?:\s+[-+\d.]+)*\s*$/.test(body))return whole;
  return '\n\n```text\n'+body.trim()+'\n```\n\n';
 })).join('');
}
function richText(text,tag='div'){
 const node=element(tag,undefined,'lesson-copy rendered-copy');const math=[];const marker='MATH'+crypto.randomUUID().replaceAll('-','').toUpperCase();
 const protectedText=sentenceStart(normalizeLessonBlocks(cleanTutorText(text))).replace(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)|(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$(?!\s)[^$\n]+?\$)/g,(whole,code)=>{if(code)return code;const display=whole.startsWith('$$')||whole.startsWith('\\[');const trim=whole.startsWith('$')?(display?2:1):2;const expression=whole.slice(trim,-trim);if(!expression.includes('\\')&&(/\b(?:have|buy|items|more|dollars|and)\b/i.test(expression)||/andIbuy/i.test(expression)))return expression.replace(/(\d)([A-Za-z])/g,'$1 $2').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/\bIbuy\b/g,'I buy');math.push({text:expression,display});return marker+(math.length-1)+'END'});
 node.innerHTML=DOMPurify.sanitize(marked.parse(protectedText,{breaks:true,gfm:true}),{ALLOWED_TAGS:['p','strong','em','del','ul','ol','li','blockquote','pre','code','a','br','hr','table','thead','tbody','tr','th','td','h1','h2','h3','h4'],ALLOWED_ATTR:['href','title']});
 const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);const texts=[];while(walker.nextNode())texts.push(walker.currentNode);
 const pattern=new RegExp(marker+'(\\d+)END','g');texts.forEach(t=>{if(t.parentElement.closest('code,pre'))return;const fragment=document.createDocumentFragment();let last=0,found=false;for(const match of t.textContent.matchAll(pattern)){found=true;fragment.append(document.createTextNode(t.textContent.slice(last,match.index)));const entry=math[Number(match[1])];const span=document.createElement('span');katex.render(entry.text,span,{displayMode:entry.display,throwOnError:false,trust:false,maxExpand:1000,strict:'ignore'});fragment.append(span);last=match.index+match[0].length}if(found){fragment.append(document.createTextNode(t.textContent.slice(last)));t.replaceWith(fragment)}});
 node.querySelectorAll('p').forEach(p=>{const tree=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);while(tree.nextNode()){const t=tree.currentNode;if(!t.textContent.trim())continue;if(!t.parentElement.closest('code,pre,.katex'))t.textContent=sentenceStart(t.textContent);break}});
 node.querySelectorAll('a').forEach(a=>a.rel='noopener noreferrer');return node;
}
paragraph=function(text){return richText(text)};
const readingElement=element;
element=function(tag,text,cls){const capitalized=text!==undefined&&(['h1','h2','h3','h4','summary','strong','button'].includes(tag)||cls==='history')?sentenceStart(text):text;if(tag==='li'&&text!==undefined)return richText(text,'li');if(tag==='p'&&cls==='lesson-copy')return richText(text,'div');return readingElement(tag,capitalized,cls)};
const readingCourse=renderCourse;
renderCourse=function(result){readingCourse(result);learningView.querySelector('.page-kicker')?.remove();learningView.classList.add('course-reading')};
const readingHome=home;home=function(){learningView.classList.remove('course-reading');readingHome()};
const readingRoute=route;route=function(view){learningView.classList.remove('course-reading');readingRoute(view)};
