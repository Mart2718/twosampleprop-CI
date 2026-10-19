// Runs axe-core (WCAG 2.1 AA, including color contrast) on all three steps in Chromium,
// plus a phone-width overflow check. Run: npx playwright install chromium && node tests/accessibility.js
const {chromium}=require('playwright');const axeSrc=require('axe-core').source;
const SP=require('os').tmpdir()+'/';
(async()=>{const b=await chromium.launch();
const pg=await b.newPage({viewport:{width:1200,height:1500}});await pg.goto('file://'+require('path').join(__dirname,'..','index.html'));
const run=async(tag)=>{await pg.addScriptTag({content:axeSrc});const r=await pg.evaluate(async()=>{const r=await axe.run(document);return r.violations.map(v=>v.id+'('+v.nodes.length+'): '+v.nodes.slice(0,3).map(n=>n.target.join(' ')+' '+(n.any[0]?.message||'')).join(' | '));});console.log(tag,r.length?r:'no violations');};
await pg.click('[data-v="cat"]');await pg.click('[data-g="2"]');await pg.click('#lock');await run('step1');
await pg.screenshot({path:SP+'v12_s1.png'});
await pg.click('#t2');await run('step2');
await pg.click('#t3');await pg.click('[data-app="prop"]');await pg.click('[data-cond="yes"]');await pg.click('[data-level="0.95"]');
await pg.fill('#lo-0','0.020');await pg.fill('#hi-0','0.197');await pg.click('#check');await pg.click('[data-z="no"]');await pg.click('[data-dir="g1"]');
await pg.click('[data-level="0.99"]');await pg.click('[data-pred="wider"]');await pg.fill('#lo-0','-0.008');await pg.fill('#hi-0','0.225');await pg.click('#check');
await run('step3');await pg.click('#m-teacher');await run('step3-teacher');
await pg.screenshot({path:SP+'v12_s3.png',fullPage:true});
await pg.setViewportSize({width:390,height:900});await pg.click('#m-student');
console.log('mobile scrollWidth',await pg.evaluate(()=>document.documentElement.scrollWidth));
await pg.evaluate(()=>window.scrollTo(0,0));await pg.screenshot({path:SP+'v12_m.png',fullPage:false});
await b.close();})();
