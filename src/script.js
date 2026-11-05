const face=document.querySelector('#face');
const no=document.querySelector('#no');
const yes=document.querySelector('#yes');
const slot=document.querySelector('#no-slot');
const invitation=document.querySelector('#invitation');
const reveal=document.querySelector('#reveal');
const bubble=document.querySelector('#bubble');
const rope=document.querySelector('#rope path');
const status=document.querySelector('#status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let faceX=0,faceY=0,noX=0,noY=0,facing=-1;
let busy=false,attempts=0,previous=null,run=0,frame=0,bubbleTimer=0;
const faceSize=()=>face.offsetWidth;
const home=()=>({x:Math.max(20,innerWidth-faceSize()-24),y:Math.max(20,innerHeight-faceSize()-25)});
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const inside=(p,r,pad=0)=>p.x>=r.left-pad&&p.x<=r.right+pad&&p.y>=r.top-pad&&p.y<=r.bottom+pad;
const distance=(p,r)=>Math.hypot(Math.max(r.left-p.x,0,p.x-r.right),Math.max(r.top-p.y,0,p.y-r.bottom));
function paintFace(){face.style.transform=`translate3d(${faceX}px,${faceY}px,0)`;face.style.setProperty('--direction',facing);}
function paintNo(angle=0){no.style.transform=`translate3d(${noX}px,${noY}px,0) rotate(${angle}deg)`;}
function mouth(){const s=faceSize();return{x:faceX+s*(facing===1?.81:.19),y:faceY+s*.65};}
function paintRope(){
 const m=mouth(),r=no.getBoundingClientRect();
 const end={x:facing===1?r.left:r.right,y:r.top+r.height/2};
 rope.setAttribute('d',`M${m.x},${m.y} Q${(m.x+end.x)/2},${(m.y+end.y)/2+9} ${end.x},${end.y}`);
}
function say(text){
 clearTimeout(bubbleTimer);bubble.textContent=text;bubble.hidden=false;
 bubble.classList.toggle('flustered',attempts>=3);
 bubble.style.transform=`translate3d(${clamp(faceX+faceSize()/2-80,22,innerWidth-190)}px,${faceY<100?faceY+faceSize()+12:Math.max(24,faceY-65)}px,0)`;
 status.textContent=text;
 bubbleTimer=setTimeout(()=>{bubble.hidden=true;},2200);
}
function tween(duration,draw,id){
 return new Promise(resolve=>{
  const start=performance.now();
  function step(now){
   if(id!==run){resolve(false);return;}
   const t=reduced.matches?1:Math.min(1,(now-start)/duration);
   draw(t);
   if(t<1)frame=requestAnimationFrame(step);else{frame=0;resolve(true);}
  }
  frame=requestAnimationFrame(step);
 });
}
const ease=t=>1-Math.pow(1-t,3);
function destination(p,r){
 const s=faceSize(),gap=24,margin=25;
 const low=clamp(innerHeight-105,90,innerHeight-r.height-30);
 const high=75;
 const options=[];
 for(const left of [true,false])for(const y of [high,low]){
  const x=left?margin+s+gap:innerWidth-margin-s-gap-r.width;
  const headX=left?margin:x+r.width+gap;
  options.push({x:clamp(x,margin,innerWidth-r.width-margin),y,headX,left});
 }
 // Keep the whole face/button pair in view and away from the centered Yes.
 const yr=yes.getBoundingClientRect();
 const safe=options.filter(o=>!(o.x<yr.right+20&&o.x+r.width>yr.left-20&&o.y<yr.bottom+20&&o.y+r.height>yr.top-20));
 return (safe.length?safe:options).sort((a,b)=>{
  const score=o=>Math.hypot(o.x+r.width/2-p.x,o.y+r.height/2-p.y)+Math.hypot(o.x-r.left,o.y-r.top)*.3;
  return score(b)-score(a);
 })[0];
}
async function steal(p){
 if(busy||invitation.hidden)return;
 busy=true;attempts++;const id=++run;
 clearTimeout(bubbleTimer);bubble.hidden=true;
 const r=no.getBoundingClientRect(),dest=destination(p,r),s=faceSize();
 if(!no.classList.contains('stolen')){
  noX=r.left;noY=r.top;no.classList.add('stolen');paintNo();
 }
 facing=dest.left?1:-1;
 const pickup={x:(dest.left?r.left:r.right)-s*(facing===1?.81:.19),y:r.top+r.height/2-s*.65};
 const start={x:faceX,y:faceY};face.dataset.mode='fetching';
 if(!await tween(250,t=>{const e=ease(t);faceX=start.x+(pickup.x-start.x)*e;faceY=start.y+(pickup.y-start.y)*e;paintFace();},id))return;
 face.dataset.mode='grabbing';paintRope();
 if(!await tween(150,()=>{},id))return;
 face.dataset.mode='dragging';
 const from={x:noX,y:noY};
 const finalFace={x:dest.headX,y:clamp(dest.y+r.height/2-s*.65,22,innerHeight-s-22)};
 if(!await tween(760,t=>{
  const head=ease(Math.min(1,t*1.15));
  const button=ease(Math.max(0,(t-.10)/.90));
  faceX=pickup.x+(finalFace.x-pickup.x)*head;
  faceY=pickup.y+(finalFace.y-pickup.y)*head+Math.sin(t*Math.PI*8)*3*(1-t);
  noX=from.x+(dest.x-from.x)*button;noY=from.y+(dest.y-from.y)*button;
  paintFace();paintNo(Math.sin(t*Math.PI*6)*5*(1-t));paintRope();
 },id))return;
 rope.setAttribute('d','');face.dataset.mode='idle';busy=false;previous=null;
 const lines=["nope. mine now.","you saw nothing.","bro stawpp","stop being meannn","stop chasing my button","i'm going to remember this"];
 say(lines[Math.min(attempts-1,lines.length-1)]);
}
document.addEventListener('pointermove',event=>{
 if(event.pointerType!=='mouse')return;
 const p={x:event.clientX,y:event.clientY},last=previous;previous=p;
 if(busy||invitation.hidden||!last||inside(p,yes.getBoundingClientRect(),15))return;
 const r=no.getBoundingClientRect(),near=distance(p,r),before=distance(last,r);
 if(near<85&&near<before-.4)steal(p);
});
no.addEventListener('click',()=>{const r=no.getBoundingClientRect();steal({x:r.left+r.width/2,y:r.top+r.height/2});});
function clear(){run++;cancelAnimationFrame(frame);frame=0;clearTimeout(bubbleTimer);rope.setAttribute('d','');bubble.hidden=true;busy=false;}
yes.addEventListener('click',()=>{
 clear();invitation.hidden=true;reveal.hidden=false;face.hidden=true;status.textContent='';
 document.querySelector('#reveal-title').focus({preventScroll:true});
});
function reset(){
 clear();attempts=0;previous=null;no.classList.remove('stolen');no.style.transform='';
 face.hidden=false;face.dataset.mode='idle';facing=-1;
 const h=home();faceX=h.x;faceY=h.y;paintFace();status.textContent='';
}
document.querySelector('#replay').addEventListener('click',()=>{
 reveal.hidden=true;invitation.hidden=false;reset();yes.focus({preventScroll:true});
});
window.addEventListener('resize',()=>{if(!invitation.hidden)reset();});
reset();
