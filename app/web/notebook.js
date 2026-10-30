const {Cam,fit,proj,facing,rings,prism,solid,put,mk,seg,unproj,tween,tset,tval,tdone,pointer,register,disposer}=HL;
function mount({stage,svg,read},value){
  const bag=disposer(),C=Cam(45,.5,1.7);
  fit(C,[[-76,-56,0],[76,64,0],[-76,64,30],[76,-56,42]],200,166);
  const P=proj(C),front=facing(C),g=mk('g',{},svg);
  for(let i=0;i<2;i++){
    const reference=solid(g),r=rings(18+i*12,-60-i*7,62+i*8,-18,3,1);
    put(reference,prism(P,front,...r,1,2+i));
  }
  const cover=solid(g),coverR=rings(-76,-48,76,58,6,1.5);
  put(cover,prism(P,front,...coverR,0,4));
  const leaves=[{x0:-70,x1:-3,y0:-42,y1:52},{x0:3,x1:70,y0:-42,y1:52}];
  const pages=leaves.map((p,i)=>{
    const base=solid(g),r=rings(p.x0,p.y0,p.x1,p.y1,3,1);
    put(base,prism(P,front,...r,4,8+i));
    const sheet=solid(g),lines=mk('path',{class:'nf lo'},g);
    return {...p,sheet,lines,r,a:tween(i?3:0),last:NaN};
  });
  const spine=mk('path',{class:'nf lo',d:seg(P(0,-39,9),P(0,49,9))},g);
  let lift=value,active=-1,pageContent=null;
  function contentPose(p,z){
    if(!pageContent)return;
    const hinge=p.x0<0?p.x1:p.x0;
    const Q=(x,y)=>P(x,y,10.3+z*Math.abs(x-hinge)/67);
    pageContent(pages.indexOf(p),[Q(p.x0+8,p.y0+10),Q(p.x0+58,p.y0+10),Q(p.x0+8,p.y0+80)]);
  }
  function draw(p,z){
    if(z===p.last)return;p.last=z;
    const hinge=p.x0<0?p.x1:p.x0;
    const Q=(x,y,h)=>P(x,y,h+z*Math.abs(x-hinge)/67);
    put(p.sheet,prism(Q,front,...p.r,9,10));
    let d='';for(let j=0;j<5;j++)d+=seg(Q(p.x0+10,-20+j*12,10.1),Q(p.x1-10,-20+j*12,10.1));
    p.lines.setAttribute('d',d);
    contentPose(p,z);
  }
  pages.forEach((p,i)=>draw(p,i?3:0));pages[1].sheet.sil.classList.add('hi');
  const loop=register(stage,(_dt,now)=>{let moving=false;pages.forEach(p=>{draw(p,tval(p.a,now));if(!tdone(p.a,now))moving=true});return moving});bag.add(loop.unregister);
  function choose(a){if(a===active)return;const from=a>=0?a:active;active=a;const now=performance.now();pages.forEach((p,i)=>{tset(p.a,a<0?(i?3:0):i===a?lift:2,now,Math.abs(i-from)*40);p.sheet.sil.classList.toggle('hi',a<0?i===1:i===a)});read.textContent=a<0?'rest':'page '+(a+1);loop.wake()}
  bag.add(pointer(stage,{move:([x,y])=>{const [u,v]=unproj(C,x,y,10);choose(v>=-48&&v<=60&&u>=-76&&u<=76?(u<0?0:1):-1)},leave:()=>choose(-1)}));
  bag.add(()=>svg.replaceChildren());
  return {setPageContent(callback){pageContent=callback;pages.forEach(p=>contentPose(p,p.last))},set(v){lift=v;const a=active;active=-2;choose(a)},destroy:bag.dispose};
}
hairline({name:'notebook',means:'An open notebook: the page nearest your pointer lifts gently, then settles back into place.',rules:[1,3,4,5,7,8,9,10],range:[10,22,34],tour:[[155,156],[245,185],[200,125],null],mount});
