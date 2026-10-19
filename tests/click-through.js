// Clicks through every scenario and problem (all levels, common wrong answers). Run: node tests/click-through.js
const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true});const w=dom.window,d=w.document;
const errs=[];w.addEventListener('error',e=>errs.push(e.message));
const q=s=>d.querySelector(s),click=s=>{const e=q(s);if(!e)throw new Error('missing '+s);e.click();};
// Step 1: answer all scenarios correctly via known keys
const S=w.eval('SCEN');let n=0;
for(let i=0;i<S.length;i++){click(`[data-j="${i}"]`);click(`[data-v="${S[i].v}"]`);click(`[data-g="${S[i].g}"]`);click('#lock');if(q('#scen-card .fb.ok'))n++;}
console.log('step1 correct',n,'/',S.length, q('.score').textContent);
// wrong answer feedback
// Step 3
const P=w.eval('PROBS'),key=w.eval('key');
for(let i=0;i<P.length;i++){
  q(`#plist [data-i="${i}"]`).click();const p=P[i];
  click(`[data-app="${p.type==='prop'?'mean':'prop'}"]`); if(!q('#prob-card .fb.no'))throw 'no wrong app fb';
  click(`[data-app="${p.type}"]`);click('[data-cond="yes"]');
  const res=[];
  for(const [j,L] of [0.95,0.90,0.99].entries()){
    click(`[data-level="${L}"]`); if(j>0) click('[data-pred="wider"]');
    const k=key(p,L),set=(lo,hi)=>{const a=q(`#lo-${i}`),b=q(`#hi-${i}`);a.value=lo;a.dispatchEvent(new w.Event('input'));b.value=hi;b.dispatchEvent(new w.Event('input'));click('#check');const m=q('.inputs + .fb .tag');return m?m.textContent:('SOLVED '+(q('[data-z]')?'interp-shown':''));};
    const r={};
    r.swap=set((-k.hi).toFixed(4),(-k.lo).toFixed(4));
    const oth=key(p,L===0.95?0.99:0.95);r.lvl=set(oth.lo.toFixed(4),oth.hi.toFixed(4));
    r.rev=set(k.hi.toFixed(4),k.lo.toFixed(4));
    r.center=set((k.est-k.me*1.4).toFixed(4),(k.est+k.me*1.4).toFixed(4));
    if(p.type==='prop'){r.pct=null;}
    r.ok=set(k.lo.toFixed(p.type==='prop'?3:2),k.hi.toFixed(p.type==='prop'?3:2));
    click(`[data-z="${(k.lo<=0&&k.hi>=0)?'yes':'no'}"]`);
    const dir=k.lo>0?'g1':k.hi<0?'g2':'zero';click(`[data-dir="${dir}"]`);
    r.sent=!!q('.sentence');r.fin=q('#prob-card').querySelectorAll('.fb.ok').length;
    res.push([L,r]);
  }
  console.log('P'+p.id,JSON.stringify(res.map(([L,r])=>[L,r.swap,r.lvl,r.rev,r.center,r.ok,r.sent])));
  console.log('   compare table rows:',(()=>{const b=[...d.querySelectorAll('#prob-card .stepbox')].pop();return b.querySelectorAll('tbody tr').length+' rows; '+b.textContent.slice(-110);})());
}
// percent entry on prop
q('#plist [data-i="0"]').click();
console.log('teacher toggle');click('#m-teacher');console.log(d.body.className);
console.log('errors',errs);
