const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ST=['Placed','Preparing','Ready','Picked'];
const seed=[["Veg Thali","Meals",70,25,"🍛"],["Chole Bhature","Meals",60,20,"🥘"],["Paneer Wrap","Meals",55,15,"🌯"],["Samosa","Snacks",15,60,"🥟"],["Veg Burger","Snacks",40,30,"🍔"],["French Fries","Snacks",35,30,"🍟"],["Cold Coffee","Drinks",30,40,"🧋"],["Masala Chai","Drinks",10,80,"☕"],["Lemon Soda","Drinks",20,40,"🥤"],["Brownie","Desserts",45,20,"🍫"],["Ice Cream","Desserts",25,35,"🍦"]].map((a,i)=>({id:i+1,name:a[0],cat:a[1],price:a[2],stock:a[3],em:a[4]}));
let S={menu:seed,orders:[],next:101},cart={},cat='All',edit=null;
try{const r=localStorage.getItem('qb');if(r)S=JSON.parse(r)}catch(e){}
const save=()=>{try{localStorage.setItem('qb',JSON.stringify(S))}catch(e){}};
function toast(m,ok=true){const t=$('toast');t.textContent=m;t.className='show '+(ok?'ok':'no');clearTimeout(t._t);t._t=setTimeout(()=>t.className='',2600)}
const tabs=[['menu','🍽️ Menu'],['cart','🛒 Cart'],['queue','⏱️ Queue'],['admin','🛠️ Admin'],['dash','📊 Dashboard']];
function go(id){document.querySelectorAll('section').forEach(s=>s.classList.toggle('on',s.id==id));renderNav(id);if(id=='dash')dash();if(id=='cart')rCart();if(id=='queue')rQ();if(id=='admin')rA();try{history.replaceState(null,'','#'+id)}catch(e){}}
function renderNav(a){const n=Object.values(cart).reduce((x,y)=>x+y,0);$('nav').innerHTML=tabs.map(t=>`<button class="${t[0]==a?'on':''}" onclick="go('${t[0]}')">${t[1]}${t[0]=='cart'&&n?`<span class="badgeCart">${n}</span>`:''}</button>`).join('')}
function rMenu(){const cats=['All',...new Set(S.menu.map(i=>i.cat))];$('chips').innerHTML=cats.map(c=>`<button class="chip ${c==cat?'on':''}" onclick="cat='${c}';rMenu()">${c}</button>`).join('');
let l=S.menu.filter(i=>(cat=='All'||i.cat==cat)&&i.name.toLowerCase().includes($('q').value.toLowerCase()));const s=$('sort').value;if(s=='p')l.sort((a,b)=>a.price-b.price);if(s=='n')l.sort((a,b)=>a.name.localeCompare(b.name));
$('items').innerHTML=l.length?l.map((i,k)=>`<div class="card" style="animation-delay:${k*40}ms"><div class="em">${esc(i.em)}</div><h3>${esc(i.name)}</h3><div class="tag">${esc(i.cat)} · ${i.stock>0?i.stock+' left':'Sold out'}</div><div class="row" style="border:0"><span class="price">₹${i.price}</span><button class="btn" ${i.stock<1?'disabled':''} onclick="add(${i.id})">Add +</button></div></div>`).join(''):'<div class="empty">No items found 😕</div>'}
function add(id){const i=S.menu.find(x=>x.id==id);if((cart[id]||0)>=i.stock)return toast('Only '+i.stock+' available','');cart[id]=(cart[id]||0)+1;toast(i.name+' added to cart');renderNav('menu')}
function total(){return Object.entries(cart).reduce((s,[id,q])=>s+q*S.menu.find(i=>i.id==id).price,0)}
function rCart(){const e=Object.entries(cart);$('cl').innerHTML=e.length?e.map(([id,q])=>{const i=S.menu.find(x=>x.id==id);return `<div class="row"><span>${esc(i.em)} ${esc(i.name)}</span><span><button class="chip" onclick="chg(${id},-1)">−</button> <b>${q}</b> <button class="chip" onclick="chg(${id},1)">+</button> ₹${q*i.price}</span></div>`}).join(''):'<div class="empty">Cart is empty. Add something tasty! 😋</div>';
$('tot').textContent='Total: ₹'+total();const now=new Date();$('sl').innerHTML=[10,20,30,45,60].map(m=>{const d=new Date(now.getTime()+m*6e4);const t=d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});return `<option>${t}</option>`}).join('')}
function chg(id,d){const i=S.menu.find(x=>x.id==id);const n=(cart[id]||0)+d;if(n>i.stock)return toast('Stock limit reached','');if(n<=0)delete cart[id];else cart[id]=n;rCart();renderNav('cart')}
$('place').onclick=()=>{const n=$('nm').value.trim(),r=$('rl').value.trim(),e=$('ce');e.textContent='';
if(!Object.keys(cart).length){e.textContent='Cart is empty.';return toast('Add items first','')}
if(!/^[A-Za-z ]{3,}$/.test(n)){e.textContent='Enter a valid name (letters only, min 3).';return toast('Invalid name','')}
if(!/^[A-Za-z0-9-]{4,12}$/.test(r)){e.textContent='Roll/ID must be 4–12 letters or digits.';return toast('Invalid roll number','')}
const items=Object.entries(cart).map(([id,q])=>{const i=S.menu.find(x=>x.id==id);i.stock-=q;return{n:i.name,q,p:i.price}});
const o={token:'T'+S.next++,name:n,roll:r,slot:$('sl').value,items,total:total(),status:0,time:Date.now()};S.orders.unshift(o);cart={};save();toast('Order placed! Your token is '+o.token);$('nm').value=$('rl').value='';rMenu();go('queue')};
function rQ(){const q=$('tq').value.toLowerCase(),f=$('sf').value;const l=S.orders.filter(o=>(!f||ST[o.status]==f)&&(o.token+o.name+o.roll).toLowerCase().includes(q));
$('ql').innerHTML=l.length?l.map(o=>`<div class="row"><div><b>${o.token}</b> · ${esc(o.name)} <small class="tag">(${esc(o.roll)})</small><div class="tag">${o.items.map(i=>esc(i.n)+' ×'+i.q).join(', ')} · ₹${o.total} · Pickup ${esc(o.slot)}</div></div><div><span class="badge ${ST[o.status]}">${ST[o.status]}</span> ${o.status<3?`<button class="btn alt" onclick="adv('${o.token}')">Next ▶</button>`:''}</div><div class="steps">${ST.map((s,i)=>`<i class="${i<=o.status?'d':''}"></i>`).join('')}</div></div>`).join(''):'<div class="empty">No orders in the queue yet 🎉</div>'}
function adv(t){const o=S.orders.find(x=>x.token==t);if(o.status<3){o.status++;save();rQ();toast(t+' is now '+ST[o.status])}}
function rA(){$('al').innerHTML='<h2>Menu Items</h2>'+S.menu.map(i=>`<div class="row"><span>${esc(i.em)} <b>${esc(i.name)}</b> <span class="tag">${esc(i.cat)} · ₹${i.price} · stock ${i.stock}</span></span><span><button class="btn alt" onclick="ed(${i.id})">Edit</button> <button class="btn del" onclick="del(${i.id})">Delete</button></span></div>`).join('')}
$('save').onclick=()=>{const n=$('an').value.trim(),p=+$('ap').value,s=$('as').value,e=$('ae2');e.textContent='';
if(n.length<2)return e.textContent='Item name is required (min 2 chars).',toast('Fix the form','');
if(!(p>0))return e.textContent='Price must be greater than 0.',toast('Invalid price','');
if(s===''||+s<0||!Number.isInteger(+s))return e.textContent='Stock must be a whole number, 0 or more.',toast('Invalid stock','');
if(S.menu.some(i=>i.name.toLowerCase()==n.toLowerCase()&&i.id!=edit))return e.textContent='This item already exists.',toast('Duplicate item','');
const d={name:n,cat:$('ac').value,price:p,stock:+s,em:$('ae').value||'🍽️'};
if(edit){Object.assign(S.menu.find(i=>i.id==edit),d);toast('Item updated')}else{S.menu.push({id:Date.now(),...d});toast('Item added successfully')}
save();rst();rA();rMenu()};
function ed(id){const i=S.menu.find(x=>x.id==id);edit=id;$('an').value=i.name;$('ac').value=i.cat;$('ap').value=i.price;$('as').value=i.stock;$('ae').value=i.em;$('ft').textContent='✏️ Update Item';$('cancel').style.display='';scrollTo({top:0,behavior:'smooth'})}
function rst(){edit=null;['an','ap','as','ae'].forEach(x=>$(x).value='');$('ft').textContent='➕ Add Menu Item';$('cancel').style.display='none'}$('cancel').onclick=rst;
function del(id){if(confirm('Delete this item?')){S.menu=S.menu.filter(i=>i.id!=id);save();rA();rMenu();toast('Item deleted')}}
function count(el,v){let n=0;const st=Math.max(1,Math.ceil(v/30));const t=setInterval(()=>{n=Math.min(v,n+st);el.firstChild.textContent=n;if(n>=v)clearInterval(t)},30)}
function dash(){const o=S.orders,rev=o.reduce((s,x)=>s+x.total,0);
const data=[['s1','Total Orders',o.length],['s2','Revenue (₹)',rev],['s3','In Queue',o.filter(x=>x.status<3).length],['s4','Ready to Pick',o.filter(x=>x.status==2).length]];
$('st').innerHTML=data.map(d=>`<div class="stat ${d[0]}"><b>0</b>${d[1]}</div>`).join('');document.querySelectorAll('.stat b').forEach((b,i)=>count(b.parentNode.firstElementChild,data[i][2]));
const bar=(el,rows)=>{const m=Math.max(1,...rows.map(r=>r[1]));$(el).innerHTML=rows.length?rows.map(r=>`<div><b style="width:90px">${esc(r[0])}</b><span data-w="${r[1]/m*100}"></span> ${r[1]}</div>`).join(''):'<div class="empty">No data yet</div>';setTimeout(()=>document.querySelectorAll('#'+el+' span').forEach(s=>s.style.width=s.dataset.w*.6+'%'),60)};
bar('b1',ST.map((s,i)=>[s,o.filter(x=>x.status==i).length]));
const c={};o.forEach(x=>x.items.forEach(i=>c[i.n]=(c[i.n]||0)+i.q));bar('b2',Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,5))}
function rQ(){const q=$('tq').value.toLowerCase(),f=$('sf').value,m=o=>(o.token+o.name+o.roll).toLowerCase().includes(q);
const rd=S.orders.filter(o=>o.status==2);
$('ns').innerHTML=rd.length?rd.map(o=>`<span class="tok">${o.token}<small>${esc(o.name)}</small></span>`).join(''):'<div class="tag">Abhi koi order ready nahi hai</div>';
const ic=['🧾','👨‍🍳','🔔','✅'],ds=['Naya order aaya','Ban raha hai','Pickup ke liye ready','Mil gaya'],bt=['Start Cooking','Mark Ready','Handed Over'];
$('ql').innerHTML=ST.map((s,k)=>{if(f&&f!=s)return'';const l=S.orders.filter(o=>o.status==k&&m(o));return `<div class="col c${k}"><div class="ch"><span>${ic[k]} ${s}</span><span class="cnt">${l.length}</span></div><div class="tag">${ds[k]}</div>${l.length?l.map(o=>`<div class="oc"><div class="row" style="border:0;padding:0"><b>${o.token}</b><span class="tag">⏰ ${esc(o.slot)}</span></div><div>${esc(o.name)} <small class="tag">${esc(o.roll)}</small></div><div class="tag">${o.items.map(i=>esc(i.n)+' ×'+i.q).join(', ')}</div><div class="row" style="border:0;padding:4px 0 0"><b>₹${o.total}</b>${k<3?`<button class="btn alt" onclick="adv('${o.token}')">${bt[k]} ▶</button>`:''}</div></div>`).join(''):'<div class="empty">Empty</div>'}</div>`}).join('')}
function rA(){const low=S.menu.filter(i=>i.stock>0&&i.stock<=5).length,out=S.menu.filter(i=>i.stock<1).length;
$('as2').innerHTML=[['s1','Menu Items',S.menu.length],['s2','Pending Orders',S.orders.filter(o=>o.status<3).length],['s4','Low Stock',low],['s3','Sold Out',out]].map(d=>`<div class="stat ${d[0]}"><b>${d[2]}</b>${d[1]}</div>`).join('');
$('al').innerHTML='<h2>📋 Inventory</h2>'+S.menu.map(i=>`<div class="ir"><span class="ie">${esc(i.em)}</span><div class="ig"><b>${esc(i.name)}</b><div class="tag">${esc(i.cat)} · ₹${i.price}</div></div><div class="stk"><button class="chip" onclick="stk(${i.id},-1)">−</button><b class="${i.stock<1?'bd':i.stock<=5?'lw':''}">${i.stock}</b><button class="chip" onclick="stk(${i.id},1)">+</button></div><span><button class="btn alt" onclick="ed(${i.id})">✏️</button> <button class="btn del" onclick="del(${i.id})">🗑️</button></span></div>`).join('')}
function stk(id,d){const i=S.menu.find(x=>x.id==id);i.stock=Math.max(0,i.stock+d);save();rA();rMenu()}
$('q').oninput=$('sort').onchange=rMenu;$('tq').oninput=$('sf').onchange=rQ;
rMenu();go(['menu','cart','queue','admin','dash'].includes(location.hash.slice(1))?location.hash.slice(1):'menu');
