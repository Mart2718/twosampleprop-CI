// Verifies the interval math inside index.html against SciPy reference values.
// Run: node tests/stats-check.js
const fs=require('fs'),path=require('path'),{JSDOM}=require('jsdom');
const dom=new JSDOM(fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'),{runScripts:'dangerously'});
const w=dom.window,key=w.eval('key'),P=w.eval('PROBS');
// SciPy reference (Wald for proportions, Welch for means), 4 decimals
const REF={1:{.9:[0.0342,0.1830],.95:[0.0199,0.1972],.99:[-0.0079,0.2251]},
 3:{.9:[0.1706,0.2602],.95:[0.1620,0.2688],.99:[0.1452,0.2855]},
 5:{.9:[-0.0327,0.1433],.95:[-0.0496,0.1601],.99:[-0.0826,0.1931]},
 4:{.9:[0.3534,8.6466],.95:[-0.4585,9.4585],.99:[-2.0741,11.0741]},
 2:{.9:[-1.2008,-0.3992],.95:[-1.2790,-0.3210],.99:[-1.4342,-0.1658]},
 6:{.9:[-1.7679,4.9679],.95:[-2.4289,5.6289],.99:[-3.7469,6.9469]}};
let bad=0;
for(const p of P)for(const L of [.9,.95,.99]){const k=key(p,L),r=REF[p.id][L];
  const ok=Math.abs(k.lo-r[0])<6e-5&&Math.abs(k.hi-r[1])<6e-5;if(!ok)bad++;
  console.log(`${ok?'ok  ':'FAIL'} problem ${p.id} ${L*100}%  (${k.lo.toFixed(4)}, ${k.hi.toFixed(4)})`);}
console.log(bad?`${bad} mismatches`:'All intervals match SciPy.');process.exit(bad?1:0);
