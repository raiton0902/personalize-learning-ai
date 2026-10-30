function folderMount({stage,svg,read},value){
const {Cam,fit,proj,facing,rings,prism,solid,put,mk,tween,tset,tval,tdone,pointer,register,disposer,unproj}=HL;
 const bag=disposer(),C=Cam(45,.5,2.1);fit(C,[[-55,-36,0],[55,40,0],[-55,-36,65],[55,40,65]],200,166);
 const P=proj(C),front=facing(C),g=mk('g',{},svg);
 const rear=solid(g),back=rings(-54,-30,54,-26,3,.6);put(rear,prism(P,front,...back,0,59));
 const tab=solid(g),tabRing=rings(-48,-30,-14,-26,2,.5);put(tab,prism(P,front,...tabRing,56,66));
 const papers=[0,1,2].map(i=>({s:solid(g),r:rings(-47,-21+i*8,47,-18+i*8,1,.5),tw:tween(0),last:NaN}));
 const face=solid(g),faceRing=rings(-54,18,54,24,3,.8);put(face,prism(P,front,...faceRing,0,43));face.sil.classList.add('hi');
 let active=false,lift=value,rowHovered=false;
 function draw(p,z){if(p.last===z)return;p.last=z;put(p.s,prism(P,front,...p.r,4,51+z))}
 papers.forEach(p=>draw(p,0));
 const loop=register(stage,(_dt,now)=>{let moving=false;papers.forEach(p=>{draw(p,tval(p.tw,now));if(!tdone(p.tw,now))moving=true});g.append(face.g);return moving});bag.add(loop.unregister);
 function choose(on){if(on===active)return;active=on;const now=performance.now();papers.forEach((p,i)=>{tset(p.tw,on?lift*(1-i*.22):0,now,i*40);p.s.sil.classList.toggle('hi',on&&i===0)});face.sil.classList.toggle('hi',!on);read.textContent=on?'references':'rest';loop.wake()}
 bag.add(pointer(stage,{move:([x,y])=>{const [u,v]=unproj(C,x,y,32);choose(rowHovered||(Math.abs(u)<65&&v>-48&&v<42))},leave:()=>choose(rowHovered)}));bag.add(()=>svg.replaceChildren());
 return {setHovered(on){rowHovered=on;choose(on)},set(v){lift=v;const was=active;active=!was;choose(was)},destroy:bag.dispose};
}
hairline({name:'folder',means:'A tabbed reference folder: its papers rise together when your pointer reaches it.',rules:[1,2,3,4,5,7,8,9,10],range:[5,11,18],tour:[[195,155],[230,140],[170,180],null],mount:folderMount});
