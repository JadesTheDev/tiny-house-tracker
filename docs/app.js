'use strict';

const categories=[
{id:'trailer',icon:'🛻',title:'Trailer & Chassis',desc:'Foundation, axles, deck, weight ratings and roadworthiness.',items:['Suitable trailer or chassis','VIN, title & registration review','Axle, tire & brake inspection','Structural frame assessment','Decking and attachment plan'],notes:'Target: approximately 8.5 × 16 ft, with 8 × 16 ft also under consideration. Verify load ratings and legal dimensions before purchase.'},
{id:'framing',icon:'🪵',title:'Framing & Lumber',desc:'Reclaimed boards, studs, beams, subfloor and structural lumber.',items:['Floor framing lumber','Wall studs and plates','Roof rafters or trusses','Subfloor panels','Reclaimed finish wood'],notes:'Prioritize reclaimed lumber where suitable; verify condition, species, dimensions and structural use.'},
{id:'roof',icon:'🏡',title:'Roofing & Exterior',desc:'Roof panels, weather barrier, siding, gutters and shutters.',items:['Roof covering','Underlayment and flashing','Weather-resistant barrier','Exterior siding','Functional shutters','Roof drainage materials'],notes:'Plan generous overhangs, durable weatherproofing and functional shutters.'},
{id:'windows',icon:'🪟',title:'Windows & Doors',desc:'Operable windows, entry door, seals, screens and cat-resistant hardware.',items:['Main entry door','Operable loft windows','Book nook window','Window flashing and seals','Insect screens','Cat-resistant door hardware'],notes:'Avoid lever-style handles CoffeeBean can open. Favor high operable loft windows.'},
{id:'insulation',icon:'🌿',title:'Insulation & Envelope',desc:'Floor, wall and roof insulation, air sealing and moisture control.',items:['Floor insulation','Wall insulation','Roof insulation','Air sealing supplies','Vapor/moisture strategy'],notes:'Assess insulation for the final climate and condensation risk. Experimental mycelium insulation requires careful validation.'},
{id:'kitchen',icon:'🍳',title:'Kitchen',desc:'Cabinetry, appliances, sink, ventilation and countertop.',items:['Cabinets extending to ceiling','Exterior-ducted range hood','Sink and faucet','Countertop','Compact refrigerator','Toaster-oven / air fryer combo'],notes:'No dust-catching gap above cabinets. Range hood MUST exhaust outdoors; recirculating is not acceptable.'},
{id:'bath',icon:'🛁',title:'Bathroom & Plumbing',desc:'Indoor toilet, bidet, shower, water lines and drainage.',items:['Indoor toilet system','Bidet-compatible plumbing','Shower enclosure','Bathroom sink','Fresh water lines','Drainage and venting'],notes:'Indoor bathroom is essential. Preserve a functional bidet and practical nighttime access.'},
{id:'power',icon:'⚡',title:'Electrical & Energy',desc:'Solar, storage, outlets, lighting, cooling and safe distribution.',items:['Electrical load plan','Solar equipment','Battery storage','Inverter and protection','Air conditioning','Lighting and outlets'],notes:'Air conditioning is non-negotiable. Design electrical safety and sizing before buying components.'},
{id:'interior',icon:'📚',title:'Interior & Storage',desc:'Stair storage, wainscoting, trim, shelves and finishes.',items:['Storage staircase','Open-side stair guardrail','Poplar or reclaimed wainscoting','Decorative panel details','Plum floral wallpaper','Shelving and trim'],notes:'Traditional decorative raised-panel wainscoting; warm cream or bone shades; dark plum floral wallpaper.'},
{id:'heating',icon:'🔥',title:'Heating & Ventilation',desc:'Heating, fresh air, exhaust and humidity management.',items:['Heating system design','Small wood stove feasibility','Combustion air and clearances','Bathroom exhaust','Fresh-air ventilation','CO and smoke alarms'],notes:'Consider a small wall-mounted wood stove only if appropriate clearances, weight, venting and codes can be met.'},
{id:'outdoors',icon:'🌱',title:'Outdoor & Catio',desc:'Cat enclosure, steps, rainwater and outdoor living.',items:['Catio framing and mesh','Exterior steps','Rainwater collection design','Outdoor storage','Entry landing'],notes:'South-side kitchen and catio are part of the broader design concept.'},
{id:'tools',icon:'🧰',title:'Tools & Workshop',desc:'Borrow, salvage or buy the equipment needed for the build.',items:['Measuring and layout tools','Drill and driver','Saw and blades','Clamps and work supports','Protective equipment','Material storage plan'],notes:'Borrow or buy secondhand tools when practical; inspect electrical and mechanical safety.'}
];

const $=id=>document.getElementById(id),storeKey='hearth-haul-v1';

let state={};
try{const parsed=JSON.parse(localStorage.getItem(storeKey)||'{}');
  if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))state=parsed}catch(e){}
let current=null;

function section(id){if(!state[id]||typeof state[id]!=='object')state[id]={};
  const s=state[id];
  if(!Array.isArray(s.items))s.items=[];
  if(!Array.isArray(s.finds))s.finds=[];
  if(typeof s.notes!=='string')s.notes=categories.find(c=>c.id===id)?.notes||'';
  return s}
function materialRows(c){const s=section(c.id);
  return [...c.items.map((name,i)=>({id:'base-'+i,name,qty:1,estimate:null,base:true})),...s.items].map(item=>({...item,...(s.edits?.[item.id]||{})}))}
function persist(){try{localStorage.setItem(storeKey,JSON.stringify(state))}catch(e){alert('Browser storage unavailable. Export your data to keep a backup.')}} 
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n||0);

function stats(){let total=0,owned=0,spent=0,finds=0;
  for(const c of categories){const s=section(c.id);
    const rows=materialRows(c);
    total+=rows.length;
    owned+=rows.filter(r=>r.owned).length;
    spent+=rows.reduce((sum,r)=>sum+(Number(r.paid)||0),0);
    finds+=s.finds.length}return {total,owned,spent,finds}}
function renderHome(){const st=stats();
  $('stats').innerHTML=[['Elements',categories.length],['Materials collected',st.owned+' / '+st.total],['Spent so far',money(st.spent)],['Saved finds',st.finds]].map(([label,value])=>'<div class="stat"><span>'+label+'</span><strong>'+value+'</strong></div>').join('');
  const q=$('category-search').value.trim().toLowerCase();
  const cards=$('cards');
  cards.replaceChildren();
  for(const c of categories.filter(c=>(c.title+' '+c.desc).toLowerCase().includes(q))){const rows=materialRows(c),done=rows.filter(x=>x.owned).length;
    const btn=document.createElement('button');
    btn.className='card';
    btn.type='button';
    btn.innerHTML='<div class="card-top"><span class="glyph">'+c.icon+'</span><span class="arrow">↗</span></div><h3></h3><p></p><div class="meter"><i style="width:'+Math.round(100*done/Math.max(1,rows.length))+'%"></i></div><div class="card-foot"><span>'+done+' / '+rows.length+' collected</span><span>'+section(c.id).finds.length+' saved finds</span></div>';
    btn.querySelector('h3').textContent=c.title;
    btn.querySelector('p').textContent=c.desc;
    btn.onclick=()=>openCategory(c.id);
    cards.append(btn)}if(!cards.children.length){const empty=document.createElement('div');
    empty.className='empty';
    empty.textContent='No house elements match your search.';
    cards.append(empty)}}
function openCategory(id){const c=categories.find(x=>x.id===id);
  if(!c)return;
  current=id;
  location.hash=encodeURIComponent(id);
  $('home').classList.add('hidden');
  $('detail').classList.remove('hidden');
  $('detail-title').textContent=c.title;
  $('detail-description').textContent=c.desc;
  $('detail-icon').textContent=c.icon;
  $('notes').value=section(id).notes;
  renderDetail();
  scrollTo({top:0,behavior:'instant'})}
function goHome(){current=null;
  history.replaceState(null,'',location.pathname+location.search);
  $('detail').classList.add('hidden');
  $('home').classList.remove('hidden');
  renderHome();
  scrollTo({top:0,behavior:'instant'})}
function renderDetail(){if(!current)return;
  const c=categories.find(x=>x.id===current),s=section(current),rows=materialRows(c),done=rows.filter(x=>x.owned).length,spent=rows.reduce((sum,x)=>sum+(Number(x.paid)||0),0),estimated=rows.reduce((sum,x)=>sum+(Number(x.estimate)||0),0);
  $('detail-progress').textContent=done+' of '+rows.length+' materials collected';
  $('detail-meter').style.width=Math.round(100*done/Math.max(1,rows.length))+'%';
  $('detail-cost').textContent='Recorded spending: '+money(spent)+(estimated?' · Estimated materials: '+money(estimated):'');
  const root=$('items');
  root.replaceChildren();
  for(const item of rows){const row=document.createElement('div');
    row.className='item';
    const check=document.createElement('input');
    check.type='checkbox';
    check.checked=!!item.owned;
    check.setAttribute('aria-label','Collected '+item.name);
    check.onchange=()=>{editItem(item.id,{owned:check.checked});
      renderDetail()};
    const middle=document.createElement('div');
    const title=document.createElement('div');
    title.className='item-title';
    title.textContent=item.name;
    const sub=document.createElement('div');
    sub.className='item-sub';
    sub.textContent='Qty: '+(item.qty||1)+(item.estimate!=null?' · Est. '+money(item.estimate):'')+(item.paid!=null?' · Paid '+money(item.paid):'')+(item.note?' · '+item.note:'');
    middle.append(title,sub);
    const controls=document.createElement('div');
    controls.className='item-controls';
    const edit=document.createElement('button');
    edit.type='button';
    edit.className='small-btn';
    edit.textContent='Edit';
    edit.onclick=()=>editDialog(item);
    controls.append(edit);
    if(!item.base){const del=document.createElement('button');
      del.type='button';
      del.className='small-btn';
      del.textContent='Remove';
      del.onclick=()=>{if(confirm('Remove this material?')){s.items=s.items.filter(x=>x.id!==item.id);
          persist();
          renderDetail()}};
      controls.append(del)}row.append(check,middle,controls);
    root.append(row)}
const finds=$('finds');
  finds.replaceChildren();
  if(!s.finds.length){const p=document.createElement('div');
    p.className='empty';
    p.textContent='No finds saved yet. Your next thrifted treasure goes here.';
    finds.append(p)}for(const f of s.finds){const row=document.createElement('div');
    row.className='saved-find';
    const name=document.createElement('strong');
    name.textContent=f.name;
    const meta=document.createElement('div');
    meta.className='item-sub';
    meta.textContent=[f.source,f.price!==''?money(f.price):''].filter(Boolean).join(' · ');
    const link=document.createElement('a');
    link.href=f.url;
    link.target='_blank';
    link.rel='noopener noreferrer';
    link.textContent='Open listing ↗';
    const remove=document.createElement('button');
    remove.className='small-btn';
    remove.textContent='Remove';
    remove.style.marginLeft='12px';
    remove.onclick=()=>{if(confirm('Remove saved find?')){s.finds=s.finds.filter(x=>x.id!==f.id);
        persist();
        renderDetail()}};
    row.append(name,meta,link,remove);
    finds.append(row)}}
function editItem(id,patch){const s=section(current);
  if(id.startsWith('base-')){s.edits??={};
    s.edits[id]={...(s.edits[id]||{}),...patch}}else{s.items=s.items.map(x=>x.id===id?{...x,...patch}:x)}persist()}
function editDialog(item){const qty=prompt('Quantity needed:',String(item.qty||1));
  if(qty===null)return;
  const n=Number(qty);
  if(!Number.isInteger(n)||n<1){alert('Enter a whole quantity of at least 1.');
    return}const est=prompt('Estimated cost in dollars (blank = unknown):',item.estimate??'');
  if(est===null)return;
  const paid=prompt('Amount actually paid in dollars (blank = none recorded):',item.paid??'');
  if(paid===null)return;
  const note=prompt('Material notes:',item.note||'');
  if(note===null)return;
  const priceOk=x=>x===''||(Number.isFinite(Number(x))&&Number(x)>=0);
  if(!priceOk(est)||!priceOk(paid)){alert('Costs must be positive numbers or blank.');
    return}editItem(item.id,{qty:n,estimate:est===''?null:Number(est),paid:paid===''?null:Number(paid),note});
  renderDetail()}
$('add-item').onsubmit=e=>{e.preventDefault();
  const name=$('new-item').value.trim(),qty=Number($('new-qty').value),est=$('new-estimate').value;
  if(!name||!Number.isInteger(qty)||qty<1)return;
  section(current).items.push({id:'custom-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name,qty,estimate:est===''?null:Number(est),owned:false});
  persist();
  e.target.reset();
  $('new-qty').value=1;
  renderDetail()};

$('add-find').onsubmit=e=>{e.preventDefault();
  const name=$('find-name').value.trim(),url=$('find-url').value.trim();
  let parsed;
  try{parsed=new URL(url)}catch{return alert('Please enter a valid URL.')}if(!['https:','http:'].includes(parsed.protocol)||!name)return alert('Please enter an HTTP(S) listing URL.');
  section(current).finds.push({id:'find-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name,url:parsed.href,price:$('find-price').value,source:$('find-source').value.trim()});
  persist();
  e.target.reset();
  renderDetail()};

$('save-notes').onclick=()=>{section(current).notes=$('notes').value;
  persist();
  const b=$('save-notes');
  b.textContent='Saved ✓';
  setTimeout(()=>b.textContent='Save notes',1200)};

$('export-btn').onclick=()=>{const payload=JSON.stringify({version:1,exportedAt:new Date().toISOString(),sections:state},null,2);
  const blob=new Blob([payload],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;
  a.download='tiny-house-tracker-backup.json';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1500)};

$('home-btn').onclick=goHome;
$('back-btn').onclick=goHome;
$('explore-btn').onclick=()=>$('build-start').scrollIntoView({behavior:'smooth'});
$('category-search').oninput=renderHome;
window.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(categories.some(c=>c.id===id)){if(current!==id)openCategory(id)}else if(current)goHome()});
renderHome();
const initial=decodeURIComponent(location.hash.slice(1));
if(categories.some(c=>c.id===initial))openCategory(initial);
