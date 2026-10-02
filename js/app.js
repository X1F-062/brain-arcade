const $=s=>document.querySelector(s),R=n=>Math.floor(Math.random()*n),sleep=ms=>new Promise(r=>setTimeout(r,ms));
let S={best:{mem:0,str:0,mat:0},hist:[],plays:0,day:'',done:[],streak:0,last:''};
try{const r=localStorage.getItem('ba_v1');if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}
const save=()=>{try{localStorage.setItem('ba_v1',JSON.stringify(S))}catch(e){}try{fetch('/api/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(S)}).catch(()=>{})}catch(e){}};
const dstr=d=>new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10),today=dstr(new Date()),yest=dstr(new Date(Date.now()-864e5));
if(S.day!==today){S.day=today;S.done=[]}
let snd=true,ac,timer,alive=false;
function beep(f,d=.1,t='square'){if(!snd)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type=t;o.frequency.value=f;g.gain.value=.04;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
const sOk=()=>{beep(660,.07);setTimeout(()=>beep(990,.1),70)},sNo=()=>beep(130,.25,'sawtooth');
function togSnd(){snd=!snd;$('#snd').textContent='Ses: '+(snd?'açık':'kapalı')}
function togTheme(){const r=document.documentElement,l=matchMedia('(prefers-color-scheme:light)').matches;const cur=r.dataset.theme||(l?'light':'dark');r.dataset.theme=cur==='dark'?'light':'dark'}

const G={};const CATS=['Hafıza','Dikkat','Hız','Esneklik','Problem çözme'];
const sh=a=>a.slice().sort(()=>Math.random()-.5);
const mk=(q,ans,wr)=>{const o=sh([ans,...wr]);return{q,o,a:o.indexOf(ans)}};
const near=(v,n=3)=>{const t=new Set();while(t.size<n){const x=v+(1+R(6))*(R(2)?1:-1);if(x>=0&&x!==v)t.add(x)}return[...t]};
const sm=t=>`<small style="font:24px 'VT323',monospace;color:var(--mut)">${t}</small>`;
const CC=[['KIRMIZI','#ff5a5a'],['MAVİ','#4cc9f0'],['YEŞİL','#5cf08b'],['SARI','#ffcf3f']];
function gTF(){const m=9+lvl*3,a=1+R(m),b=1+R(m),t=a+b,v=R(2)?t:t+(R(2)?1:-1)*(1+R(2));return{q:`${a} + ${b} = ${v}`,o:['Doğru','Yanlış'],a:v===t?0:1}}
function gCmp(){const m=5+lvl*4,a=[1+R(m),1+R(m)],b=[1+R(m),1+R(m)],x=a[0]+a[1],y=b[0]+b[1];if(x===y)return gCmp();return{q:`${a[0]}+${a[1]} ? ${b[0]}+${b[1]}`,o:['Soldaki büyük','Sağdaki büyük'],a:x>y?0:1}}
function gPar(){const n=10+R(90*lvl);return{q:n,o:['Tek','Çift'],a:n%2?0:1}}
function gSeq(){const d=2+R(5+lvl),s0=R(20),i=R(5),v=[0,1,2,3,4].map(j=>s0+d*j),ans=v[i];return mk(v.map((x,j)=>j===i?'?':x).join(', '),ans,near(ans))}
function gSeqH(){const a=1+R(4+lvl),b=2+R(5+lvl),v=[R(9)];for(let j=1;j<6;j++)v.push(v[j-1]+(j%2?a:b));const i=2+R(4),ans=v[i];return mk(v.map((x,j)=>j===i?'?':x).join(', '),ans,near(ans))}
function gOp(){const a=2+R(8+lvl),b=2+R(8),f={'+':a+b,'−':a-b,'×':a*b},ks=Object.keys(f),op=ks[R(3)],c=f[op];if(ks.some(x=>x!==op&&f[x]===c))return gOp();return{q:`${a} ? ${b} = ${c}`,o:ks,a:ks.indexOf(op)}}
function gChain(){const a=2+R(9+lvl*2),b=2+R(9),c=1+R(a+b-1),m=lvl>2&&R(2),v=m?a*b+c:a+b-c;return mk(m?`${a} × ${b} + ${c}`:`${a} + ${b} − ${c}`,v,near(v))}
function gLg(){const L=sh(['A','B','C','D']),st=sh([0,1,2].map(i=>`${L[i]} > ${L[i+1]}`));return mk(st.join('&nbsp;&nbsp; ')+'<br>'+sm('En büyük hangisi?'),L[0],L.slice(1))}
function gEq(){const t=8+R(20+lvl*5),ex=v=>{const a=1+R(v-1);return R(2)?`${a} + ${v-a}`:`${v+a} − ${a}`};return mk(sm('Hangisi '+t+' eder?'),ex(t),near(t).map(ex))}
function gCnt(){const n=3+R(4+lvl),len=14+lvl,a=Array(len).fill('☆');let c=0;while(c<n){const i=R(len);if(a[i]==='☆'){a[i]='★';c++}}return mk(a.join('')+'<br>'+sm('Kaç ★ var?'),n,near(n))}
const gFl=anti=>()=>{const d=R(2),f=Math.random()<.6?1-d:d,A=['←','→'];return{q:A[f].repeat(2)+A[d]+A[f].repeat(2),o:['← Sol','Sağ →'],a:anti?1-d:d}};
function gSS(){const w=R(4),ink=R(4),r=R(2);return{q:sm(r?'RENGİ seç':'KELİMEYİ seç')+'<br><span style="color:'+CC[ink][1]+'">'+CC[w][0]+'</span>',o:CC.map(c=>c[0]),a:r?ink:w}}
function gSw(){const n=1+R(9),r=R(2);return{q:`<span style="color:${r?'var(--cyan)':'var(--pink)'}">${n}</span><br>`+sm(r?'Turkuaz: çift mi?':"Pembe: 5'ten büyük mü?"),o:['Evet','Hayır'],a:(r?n%2===0:n>5)?0:1}}
function gSL(){const L='AEIOUBCDFGKLMNPRSTZ'[R(19)],d=1+R(9),r=R(2);return{q:`${L}${d}<br>`+sm(r?'Rakam tek mi?':'Harf sesli mi?'),o:['Evet','Hayır'],a:(r?d%2===1:'AEIOU'.includes(L))?0:1}}
const A=(id,cat,n,ic,d,run,o={})=>G[id]=Object.assign({cat,n,ic,d,run,target:250},o);
const FS='clamp(15px,4.4vw,26px)';
A('mem','Hafıza','Hafıza Dizisi','▦','Yanan kareleri izle, aynı sırayla tekrar et. Doğru bildikçe dizi uzar, yanlışta kısalır. 3 canın var.',runMem,{target:400});
A('memr','Hafıza','Ters Dizi','◀','Yanan kareleri izle, sonra TERS sırayla tekrar et. 3 canın var.',runMem,{target:400,rv:1});
A('mem16','Hafıza','Dev Dizi','▩','4x4 büyük tahtada dizi ezberi. 3 canın var.',runMem,{target:400,n:16});
A('dig','Hafıza','Sayı Hafızası','№','Sayıyı ezberle, gizlenince tuş takımıyla gir. Her doğruda bir rakam uzar.',runDig,{target:300});
A('loc','Hafıza','Konum Hafızası','◈','4x4 tahtada yanan kareleri ezberle, sonra hepsini bul.',runLoc,{target:300,n:4});
A('pairs','Hafıza','Kart Eşleştir','❖','16 kartta 8 çifti bul. Hızlı bitirirsen bonus alırsın.',runPairs,{target:300});
A('odd','Dikkat','Farklı Emoji','◎','Aynı görünen emojiler arasındaki farklı olanı bul. Doğru bildikçe tahta büyür. 30 saniye.',runOdd,{s:[['🍎','🍏'],['🐱','🐶'],['🌞','🌝'],['😀','😃']]});
A('oddbd','Dikkat','Harf Tuzağı','b/d','Birbirine benzeyen harflerden farklı olanı bul. 30 saniye.',runOdd,{s:[['b','d'],['p','q'],['n','u']]});
A('odd69','Dikkat','Rakam Tuzağı','6/9','Benzer rakamların arasındaki farklıyı bul. 30 saniye.',runOdd,{s:[['6','9'],['2','5'],['3','8']]});
A('flank','Dikkat','Ok Yönü','↔','Ortadaki okun yönünü seç, yandakilere kanma. 30 saniye.',runQ,{gen:gFl(0),fs:''});
A('cnt','Dikkat','Yıldız Say','★','Satırdaki dolu yıldızları say. 30 saniye.',runQ,{gen:gCnt,fs:FS});
A('loc5','Dikkat','Işık Avı','✦','5x5 tahtada yanan kareleri ezberle ve bul.',runLoc,{target:300,n:5});
A('mat','Hız','Hızlı Hesap','±','Doğru sonucu mümkün olduğunca çabuk bul. Seri yaptıkça sorular zorlaşır. 30 saniye.',runMat);
A('tf','Hız','Doğru mu Yanlış mı','✓','Toplama doğruysa Doğru, değilse Yanlış seç. 30 saniye.',runQ,{gen:gTF});
A('cmp','Hız','Hangisi Büyük','&gt;','İki toplamdan büyük olanı seç. 30 saniye.',runQ,{gen:gCmp,fs:FS});
A('par','Hız','Tek mi Çift mi','½','Sayı tekse Tek, çiftse Çift seç. 30 saniye.',runQ,{gen:gPar});
A('tap','Hız','Işığı Yakala','◉','Yanan kareye hızla dokun. Ne kadar seri yaparsan o kadar hızlanır. 30 saniye.',runTap);
A('react','Hız','Refleks','⚡','Kutu yeşile dönünce hemen bas. 5 deneme, erken basarsan puan yok.',runReact,{target:300});
A('str','Esneklik','Renk Çatışması','◐','Yazının ne yazdığını değil, hangi renkte yazıldığını seç. 30 saniye.',runStr,{target:300});
A('strsw','Esneklik','Renk ya da Kelime','⇄','Kural her turda değişir: bazen rengi, bazen kelimeyi seç. 30 saniye.',runQ,{gen:gSS});
A('flankA','Esneklik','Ters Ok','↺','Ortadaki okun TERS yönünü seç. 30 saniye.',runQ,{gen:gFl(1)});
A('sw','Esneklik','Kural Değiştir','⚑','Sayının rengine göre kural değişir: turkuaz çift mi, pembe 5\'ten büyük mü. 30 saniye.',runQ,{gen:gSw});
A('swl','Esneklik','Harf ve Rakam','Aa','Her turda kural değişir: rakam tek mi ya da harf sesli mi. 30 saniye.',runQ,{gen:gSL});
A('nogo','Esneklik','Kırmızıya Basma','⊘','Mavi ışığa bas, kırmızıya dokunma. 30 saniye.',runTap,{dc:1});
A('seq','Problem çözme','Eksik Sayı','…','Dizideki eksik sayıyı bul. 30 saniye.',runQ,{gen:gSeq,fs:FS});
A('seqh','Problem çözme','Zor Dizi','⋯','İki farklı adımla ilerleyen dizideki eksik sayıyı bul. 30 saniye.',runQ,{gen:gSeqH,fs:FS});
A('op','Problem çözme','Eksik İşlem','?','Eşitliği doğru yapan işlemi seç. 30 saniye.',runQ,{gen:gOp});
A('chain','Problem çözme','Zincir Hesap','∑','Üç sayılı işlemin sonucunu bul. 30 saniye.',runQ,{gen:gChain,fs:FS});
A('lg','Problem çözme','Mantık Zinciri','⊢','Verilen karşılaştırmalardan en büyüğü çıkar. 30 saniye.',runQ,{gen:gLg,fs:FS});
A('eq','Problem çözme','Eşit Olanı Bul','=','Verilen sayıya eşit olan ifadeyi seç. 30 saniye.',runQ,{gen:gEq,fs:FS});
const ALL=Object.keys(G),dn=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
const ORDER=[0,1,2].map(i=>{const a=ALL.filter(k=>G[k].cat===CATS[(dn+i)%5]);return a[dn%a.length]});
const BADGES=[['İlk adım','İlk oyununu bitir',s=>s.plays>=1],['Isınma turu','10 oyun tamamla',s=>s.plays>=10],['Düzenli','3 günlük seri yap',s=>s.streak>=3],['Alışkanlık','7 günlük seri yap',s=>s.streak>=7],['Hedef avcısı','Bir oyunda hedef skoru geç',s=>ALL.some(k=>(s.best[k]||0)>=G[k].target)],['Çok yönlü','5 kategoriyi de dene',s=>CATS.every(c=>ALL.some(k=>G[k].cat===c&&(s.best[k]||0)>0))]];
function resetAll(){if(!confirm('Tüm ilerleme silinsin mi?'))return;S={best:{},hist:[],plays:0,day:today,done:[],streak:0,last:''};save();home()}
const app=$('#app');

/* ---------- ANA SAYFA ---------- */
function home(){
 clearInterval(timer);alive=false;
 const nxt=ORDER.find(k=>!S.done.includes(k));
 const pct=k=>Math.min(100,Math.round((S.best[k]||0)/G[k].target*100)),cp=c=>Math.round(ALL.filter(k=>G[k].cat===c).reduce((a,k)=>a+pct(k),0)/6);
 const bpi=Math.round(CATS.reduce((a,c)=>a+cp(c),0)/5*10);
 const last=S.hist.slice(-12);const mx=Math.max(1,...last.map(h=>h.s));
 app.innerHTML=`
 <section class="box hero">
  <div>
   <h1>Zihnini ısıt.<br>Rekorunu kır.</h1>
   <p>Hafıza, esneklik ve hız üzerine kısa oyunlar. Her hamlede anında geri bildirim alırsın, zorluk sana göre ayarlanır.</p>
   <button class="btn big" onclick="${nxt?`start('${nxt}')`:`document.getElementById('games').scrollIntoView()`}">${nxt?'Günlük antrenmanı başlat':'Bugünkü antrenman tamam'}</button>
  </div>
  <div class="crt" aria-hidden="true"><div class="mini" id="mini">${'<i></i>'.repeat(9)}</div></div>
 </section>
 <section class="box"><h2>Bugünkü antrenman</h2><div class="cards" style="margin-top:14px">
  ${ORDER.map((k,i)=>`<div class="gc"><span class="tag">${i+1}. oyun · ${G[k].cat}</span><span class="ic">${G[k].ic}</span><h3>${G[k].n}</h3>
  <span class="${S.done.includes(k)?'done':''}">${S.done.includes(k)?'✔ Bugün tamamlandı':'Henüz oynanmadı'}</span></div>`).join('')}
 </div></section>
 <section class="box"><h2>İlerleme</h2>
  <div class="stats" style="margin:14px 0">
   <div class="stat"><b>${bpi}</b>Beyin puanı</div><div class="stat"><b>${S.streak}</b>Gün serisi</div><div class="stat"><b>${S.plays}</b>Toplam oyun</div>
  </div>
  ${CATS.map(c=>`<div class="skill"><span>${c}</span><div class="meter" role="img" aria-label="${c} %${cp(c)}"><i style="width:${cp(c)}%"></i></div><b class="px" style="font-size:10px">%${cp(c)}</b></div>`).join('')}
  <h3 style="margin:18px 0 10px">Son oyunların skoru</h3>
  ${last.length?`<div class="hist">${last.map(h=>`<i title="${G[h.g].n}: ${h.s}" style="height:${Math.max(5,h.s/mx*100)}%"></i>`).join('')}</div>`:'<p>Henüz oyun yok. İlk skorunu kaydet, grafik burada belirsin.</p>'}
 </section>
 <section class="box"><h2>Rozetler</h2><div class="cards" style="margin-top:14px">${BADGES.map(b=>{const u=b[2](S);return `<div class="gc" style="opacity:${u?1:.45}"><h3>${u?'★':'☆'} ${b[0]}</h3><span>${b[1]}</span></div>`}).join('')}</div><button class="btn alt" style="margin-top:14px" onclick="resetAll()">Verileri sıfırla</button></section>
 <section class="box" id="games"><h2>Tüm oyunlar (${ALL.length})</h2>${CATS.map(c=>`<h3 style="margin:20px 0 10px;color:var(--yel)">${c}</h3><div class="cards">${ALL.filter(k=>G[k].cat===c).map(k=>`<div class="gc"><span class="ic">${G[k].ic}</span><h3>${G[k].n}</h3><span>Rekor: ${S.best[k]||0}</span><button class="btn alt" onclick="start('${k}')">Oyna</button></div>`).join('')}</div>`).join('')}</section>`;
 let t=0;const m=[...document.querySelectorAll('#mini i')];
 const iv=setInterval(()=>{if(!$('#mini')){clearInterval(iv);return}m.forEach(x=>x.classList.remove('on'));m[R(9)].classList.add('on');t++},700);
}

/* ---------- OYUN ÇERÇEVESİ ---------- */
let sc,lvl,streak,right,total;
function frame(k,hudExtra=''){
 app.innerHTML=`<section class="box"><div class="hud"><span id="sc">Skor 0</span><span id="lv">Seviye 1</span><span id="ex">${hudExtra}</span></div>
 <div class="bar"><i id="tb"></i></div><div class="stage" id="st"></div><div class="fb" id="fb" aria-live="polite">&nbsp;</div>
 <button class="btn alt" onclick="home()">Çık</button></section>`;
}
function intro(k){
 clearInterval(timer);alive=false;
 app.innerHTML=`<section class="box" style="text-align:center"><span class="tag">${G[k].cat}</span><h2 style="margin:14px 0">${G[k].n}</h2><p style="max-width:520px;margin:0 auto 16px;font-size:28px">${G[k].d}</p>
 <p style="color:var(--mut)">Rekorun: ${S.best[k]||0}</p><button class="btn big" onclick="go('${k}')">Başla</button> <button class="btn alt" onclick="home()">Geri</button></section>`;
}
function start(k){intro(k)}
function go(k){sc=0;lvl=1;streak=0;right=0;total=0;alive=true;G[k].run(k)}
function hud(){$('#sc').textContent='Skor '+sc;$('#lv').textContent='Seviye '+lvl+(streak>1?' · seri x'+streak:'')}
function fb(txt,good){const f=$('#fb'),s=$('#st');if(!f)return;f.textContent=txt;f.className='fb '+(good?'good':'bad');s.classList.remove('good','bad');void s.offsetWidth;s.classList.add(good?'good':'bad');good?sOk():sNo()}
const praise=['Süper!','Harika!','Tam isabet!','Bu seri güzel!','Odak tam!'],oops=['Olmadı, devam.','Yanlış, bir sonrakine odaklan.','Kaçtı, toparla.'];
function runTimer(sec,k){
 const t0=Date.now();clearInterval(timer);
 timer=setInterval(()=>{const left=sec*1000-(Date.now()-t0);const b=$('#tb'),e=$('#ex');if(!b){clearInterval(timer);return}
  b.style.width=Math.max(0,left/(sec*10))+'%';e.textContent=Math.ceil(Math.max(0,left)/1000)+' sn';
  if(left<=0){clearInterval(timer);alive=false;end(k)}},100);
}

/* ---------- OYUN 1: HAFIZA ---------- */
async function runMem(k){
 frame(k,'<span class="lives">♥♥♥</span>');let lives=3,len=3,seq=[],inp=[],accept=false;
 const N=G[k].n||9,CL=Math.round(Math.sqrt(N)),RV=G[k].rv;$('#st').innerHTML=`<div class="pad" style="grid-template-columns:repeat(${CL},1fr)" id="pad">${Array.from({length:N},(_,i)=>`<button data-i="${i}" aria-label="Kare ${i+1}"></button>`).join('')}</div>`;
 const bs=[...document.querySelectorAll('#pad button')];
 const flash=async(i,ms=420)=>{bs[i].classList.add('on');beep(300+i*70,.18,'triangle');await sleep(ms);bs[i].classList.remove('on');await sleep(150)};
 async function round(){
  accept=false;seq=Array.from({length:len},()=>R(N));inp=[];lvl=len-2;hud();
  $('#fb').textContent='İzle…';$('#fb').className='fb';await sleep(600);
  for(const i of seq){if(!alive)return;await flash(i)}
  if(!alive)return;$('#fb').textContent='Sıra sende!';accept=true;
 }
 bs.forEach(b=>b.onclick=async()=>{
  if(!accept||!alive)return;const i=+b.dataset.i;inp.push(i);total++;
  if(i===(RV?seq.slice().reverse():seq)[inp.length-1]){right++;b.classList.add('on');beep(300+i*70,.12,'triangle');setTimeout(()=>b.classList.remove('on'),150);
   if(inp.length===seq.length){accept=false;streak++;sc+=len*10+streak*5;hud();fb(praise[R(praise.length)]+' +'+(len*10+streak*5),true);len++;await sleep(900);if(alive)round()}
  }else{accept=false;streak=0;lives--;b.classList.add('wrong');$('.lives').textContent='♥'.repeat(lives)+'♡'.repeat(3-lives);
   fb('Yanlış kare. Dizi 1 kısalıyor.',false);len=Math.max(2,len-1);await sleep(900);b.classList.remove('wrong');
   if(lives<=0){alive=false;end(k)}else if(alive)round()}
 });
 round();
}

/* ---------- OYUN 2: RENK ÇATIŞMASI ---------- */
function runStr(k){
 frame(k);const C=[['KIRMIZI','#ff5a5a'],['MAVİ','#4cc9f0'],['YEŞİL','#5cf08b'],['SARI','#ffcf3f']];
 $('#st').innerHTML=`<div class="word" id="w"></div><div class="opts">${C.map((c,i)=>`<button data-i="${i}"><span style="color:${c[1]}">■</span> ${c[0]}</button>`).join('')}</div>`;
 let ink=0;
 const nxt=()=>{const w=R(4);ink=Math.random()<.8?(w+1+R(3))%4:w;const e=$('#w');e.textContent=C[w][0];e.style.color=C[ink][1]};
 document.querySelectorAll('.opts button').forEach(b=>b.onclick=()=>{
  if(!alive)return;total++;
  if(+b.dataset.i===ink){right++;streak++;const p=10+Math.min(streak,10);sc+=p;lvl=1+Math.floor(streak/5);fb(streak>2?praise[R(praise.length)]+' x'+streak:'Doğru +'+p,true)}
  else{streak=0;sc=Math.max(0,sc-5);lvl=1;fb(oops[R(oops.length)]+' -5',false)}
  hud();nxt()});
 nxt();runTimer(30,k);
}

/* ---------- OYUN 3: HIZLI HESAP ---------- */
function runMat(k){
 frame(k);$('#st').innerHTML=`<div class="q" id="q"></div><div class="opts" id="o"></div>`;let ans=0;
 const nxt=()=>{const m=6+lvl*6;let a=1+R(m),b=1+R(m),op=['+','-','×'][R(lvl>=3?3:2)];
  if(op==='-'&&b>a)[a,b]=[b,a];if(op==='×'){a=2+R(4+lvl);b=2+R(9)}
  ans=op==='+'?a+b:op==='-'?a-b:a*b;$('#q').textContent=`${a} ${op} ${b}`;
  const s=new Set([ans]);while(s.size<4){const d=(1+R(5))*(R(2)?1:-1);const v=ans+d;if(v>=0)s.add(v)}
  $('#o').innerHTML=[...s].sort(()=>Math.random()-.5).map(v=>`<button data-v="${v}">${v}</button>`).join('');
  document.querySelectorAll('#o button').forEach(b=>b.onclick=()=>{if(!alive)return;total++;
   if(+b.dataset.v===ans){right++;streak++;sc+=10+lvl*2;if(streak%3===0)lvl++;fb(streak>2?'Seri x'+streak+'! Sorular zorlaşıyor':'Doğru!',true)}
   else{streak=0;lvl=Math.max(1,lvl-1);fb('Doğrusu '+ans+'. Seviye düştü.',false)}
   hud();nxt()})};
 nxt();runTimer(30,k);
}

/* ---------- YENİ OYUN MOTORLARI ---------- */
function runQ(k){frame(k);const g=G[k].gen;$('#st').innerHTML='<div class="q" id="q"></div><div class="opts" id="o"></div>';
 const nx=()=>{const x=g();const q=$('#q');q.innerHTML=x.q;q.style.fontSize=G[k].fs||'';$('#o').innerHTML=x.o.map((v,i)=>`<button data-i="${i}">${v}</button>`).join('');
  document.querySelectorAll('#o button').forEach(b=>b.onclick=()=>{if(!alive)return;total++;
   if(+b.dataset.i===x.a){right++;streak++;sc+=10+lvl*2;lvl=1+Math.floor(streak/4);fb(streak>2?praise[R(praise.length)]+' x'+streak:'Doğru!',true)}
   else{streak=0;lvl=Math.max(1,lvl-1);fb(oops[R(oops.length)]+' Doğrusu: '+String(x.o[x.a]).replace(/<[^>]*>/g,''),false)}
   hud();nx()})};
 nx();runTimer(30,k)}
function runOdd(k){frame(k);const P=G[k].s,st=$('#st');let ix;
 const nx=()=>{const n=Math.min(6,3+Math.floor(streak/4)),p=P[R(P.length)],w=R(2),[a,b]=w?[p[1],p[0]]:p;ix=R(n*n);lvl=n-2;
  st.innerHTML=`<div class="opts" style="grid-template-columns:repeat(${n},1fr);width:min(100%,380px)">${Array.from({length:n*n},(_,i)=>`<button data-i="${i}" style="font-size:${n>4?20:28}px;padding:8px 0">${i===ix?b:a}</button>`).join('')}</div>`;
  st.querySelectorAll('button').forEach(x=>x.onclick=()=>{if(!alive)return;total++;
   if(+x.dataset.i===ix){right++;streak++;sc+=10+n;fb(streak>2?praise[R(praise.length)]+' x'+streak:'Buldun!',true)}else{streak=0;fb('Yanlış kare. Yeni tahta.',false)}
   hud();nx()})};
 nx();runTimer(30,k)}
function runTap(k){frame(k);const N=G[k].n||9,dc=G[k].dc;$('#st').innerHTML=`<div class="pad" style="grid-template-columns:repeat(3,1fr)" id="pad">${'<button></button>'.repeat(N)}</div>`;
 const bs=[...document.querySelectorAll('#pad button')];let cur=-1,kind=0,tm;const clr=()=>bs.forEach(b=>b.className='');
 const show=()=>{if(!alive)return;clr();cur=R(N);kind=dc&&Math.random()<.4?1:0;bs[cur].className=kind?'wrong':'on';
  tm=setTimeout(()=>{if(!alive)return;if(!kind){streak=0;total++;fb('Kaçırdın!',false);hud()}cur=-1;clr();setTimeout(show,150)},Math.max(450,1000-lvl*90))};
 bs.forEach((b,i)=>b.onclick=()=>{if(!alive||i!==cur)return;clearTimeout(tm);total++;
  if(kind){streak=0;sc=Math.max(0,sc-10);fb('Kırmızıya basma! -10',false)}else{right++;streak++;sc+=10;lvl=1+Math.floor(streak/4);fb(streak>2?praise[R(praise.length)]+' x'+streak:'Yakaladın!',true)}
  hud();cur=-1;clr();setTimeout(show,150)});
 show();runTimer(30,k)}
function runReact(k){frame(k);$('#ex').textContent='0/5';let n=0,t0=0,to,ready=false;
 $('#st').innerHTML='<button id="rb" class="btn big" style="width:min(100%,330px);height:200px;background:var(--bad)">Bekle…</button>';const b=$('#rb');
 const arm=()=>{ready=false;b.style.background='var(--bad)';b.textContent='Bekle…';to=setTimeout(()=>{ready=true;t0=Date.now();b.style.background='var(--ok)';b.textContent='BAS!'},1200+R(2200))};
 b.onclick=()=>{if(!alive)return;total++;
  if(!ready){clearTimeout(to);streak=0;fb('Erken bastın! 0 puan',false)}else{const ms=Date.now()-t0,p=Math.max(0,Math.round((600-ms)/6));ready=false;sc+=p;right++;fb(ms+' ms  +'+p,ms<350)}
  n++;lvl=Math.min(5,n+1);hud();$('#ex').textContent=n+'/5';if(n>=5){alive=false;setTimeout(()=>end(k),900)}else setTimeout(arm,900)};
 arm()}
async function runDig(k){frame(k,'<span class="lives">♥♥♥</span>');let lives=3,len=3,s0='',inp='',acc=false;
 $('#st').innerHTML='<div class="big-n" id="dn"></div><div class="opts" style="grid-template-columns:repeat(3,1fr);width:min(100%,300px)" id="kp">'+[1,2,3,4,5,6,7,8,9,'⌫',0,'✔'].map(v=>`<button data-v="${v}">${v}</button>`).join('')+'</div>';
 async function round(){acc=false;s0='';for(let i=0;i<len;i++)s0+=R(10);lvl=len-2;hud();$('#dn').textContent=s0;$('#fb').textContent='Ezberle…';$('#fb').className='fb';
  await sleep(800+len*450);if(!alive)return;inp='';$('#dn').textContent='?';$('#fb').textContent='Şimdi gir ve ✔ bas';acc=true}
 document.querySelectorAll('#kp button').forEach(b=>b.onclick=async()=>{if(!acc||!alive)return;const v=b.dataset.v;beep(400,.04);
  if(v==='⌫')inp=inp.slice(0,-1);else if(v!=='✔'){if(inp.length<len)inp+=v}
  else{if(!inp)return;acc=false;total++;
   if(inp===s0){right++;streak++;sc+=len*10;fb('Doğru! +'+len*10,true);len++}
   else{streak=0;lives--;$('.lives').textContent='♥'.repeat(lives)+'♡'.repeat(3-lives);fb('Doğrusu '+s0,false);len=Math.max(3,len-1)}
   hud();await sleep(1100);if(lives<=0){alive=false;end(k)}else if(alive)round();return}
  $('#dn').textContent=inp||'?'});
 round()}
async function runLoc(k){frame(k,'<span class="lives">♥♥♥</span>');const n=G[k].n,N=n*n;let lives=3,L=3,set=[],found=[],acc=false;
 $('#st').innerHTML=`<div class="pad" style="grid-template-columns:repeat(${n},1fr)" id="pad">${'<button></button>'.repeat(N)}</div>`;const bs=[...document.querySelectorAll('#pad button')];
 async function round(){acc=false;found=[];bs.forEach(b=>b.className='');set=[];while(set.length<L){const x=R(N);if(!set.includes(x))set.push(x)}lvl=L-2;hud();
  $('#fb').textContent='Işıkları ezberle…';$('#fb').className='fb';await sleep(500);set.forEach(i=>bs[i].className='on');await sleep(900+L*250);
  if(!alive)return;bs.forEach(b=>b.className='');$('#fb').textContent='Yanan kareleri bul!';acc=true}
 bs.forEach((b,i)=>b.onclick=async()=>{if(!acc||!alive||found.includes(i))return;total++;
  if(set.includes(i)){found.push(i);b.className='on';beep(500+found.length*60,.08);right++;
   if(found.length===L){acc=false;streak++;sc+=L*12;hud();fb('Hepsini buldun! +'+L*12,true);L++;await sleep(900);if(alive)round()}}
  else{acc=false;streak=0;lives--;b.className='wrong';set.forEach(j=>{if(!found.includes(j))bs[j].className='on'});$('.lives').textContent='♥'.repeat(lives)+'♡'.repeat(3-lives);
   fb('Yanlış kare, doğruları gösteriyorum',false);L=Math.max(3,L-1);hud();await sleep(1300);if(lives<=0){alive=false;end(k)}else if(alive)round()}});
 round()}
function runPairs(k){frame(k);const E=['🍎','🐱','⭐','🚀','🎈','🎵','🐟','🌙'],cards=sh([...E,...E]);let open=[],lock=false,found=0;const t0=Date.now();
 $('#st').innerHTML=`<div class="pad" style="grid-template-columns:repeat(4,1fr)" id="pad">${cards.map((e,i)=>`<button style="font-size:30px"></button>`).join('')}</div>`;
 const bs=[...document.querySelectorAll('#pad button')];
 timer=setInterval(()=>{const e=$('#ex');if(!e){clearInterval(timer);return}e.textContent=Math.floor((Date.now()-t0)/1000)+' sn'},500);
 bs.forEach((b,i)=>b.onclick=async()=>{if(lock||!alive||b.textContent)return;b.textContent=cards[i];b.classList.add('on');beep(400+i*20,.06);open.push(i);
  if(open.length===2){lock=true;total++;const[a,c]=open;await sleep(650);
   if(cards[a]===cards[c]){right++;found++;streak++;sc+=20;fb('Eşleşti! +20',true);bs[a].disabled=bs[c].disabled=true;
    if(found===8){clearInterval(timer);alive=false;sc+=Math.max(0,90-Math.floor((Date.now()-t0)/1000))*3;hud();setTimeout(()=>end(k),700)}}
   else{streak=0;sc=Math.max(0,sc-3);fb('Eşleşmedi',false);[a,c].forEach(x=>{bs[x].textContent='';bs[x].classList.remove('on')})}
   open=[];lock=false;hud()}})}

/* ---------- SONUÇ ---------- */
function end(k){
 const prev=S.best[k]||0,rec=sc>prev&&sc>0;if(rec)S.best[k]=sc;S.plays++;S.hist.push({g:k,s:sc});S.hist=S.hist.slice(-30);
 if(!S.done.includes(k))S.done.push(k);
 if(S.last!==today){S.streak=S.last===yest?S.streak+1:1;S.last=today}
 save();const acc=total?Math.round(right/total*100):0;
 const msg=acc>=90?'Neredeyse hatasız. Zorluğu artırmaya hazırsın.':acc>=70?'Sağlam bir tur. Hızını koruyup hataları azalt.':'Acele etme: önce doğruluk, hız sonradan gelir.';
 const nxt=ORDER.find(x=>!S.done.includes(x)),diff=sc-prev;
 app.innerHTML=`<section class="box" style="text-align:center"><h2>${G[k].n} bitti</h2>
 <div class="big-n" style="margin:18px 0">${sc}</div>${rec?'<span class="new">Yeni rekor!</span>':''}
 <div class="stats" style="margin:18px 0"><div class="stat"><b>%${acc}</b>Doğruluk</div><div class="stat"><b>${right}/${total}</b>Doğru cevap</div><div class="stat"><b>${rec?'+'+(sc-prev):diff}</b>Rekora göre</div></div>
 <p style="font-size:28px;max-width:520px;margin:0 auto 16px">${msg}</p>
 <button class="btn big" onclick="${nxt?`start('${nxt}')`:'home()'}">${nxt?'Sıradaki oyun':'Ana sayfa'}</button>
 <button class="btn alt" onclick="go('${k}')">Tekrar oyna</button> <button class="btn alt" onclick="home()">Ana sayfa</button></section>`;
}
document.addEventListener('keydown',e=>{if(!alive||e.repeat)return;
 if(e.key==='Escape'){home();return}
 if(e.code==='Space'&&$('#rb')){e.preventDefault();$('#rb').click();return}
 if($('#kp'))return;const o=[...document.querySelectorAll('.opts button')],n=+e.key;
 if(o.length&&o.length<=4){if(n>=1&&n<=o.length)o[n-1].click();else if(o.length===2&&e.key==='ArrowLeft')o[0].click();else if(o.length===2&&e.key==='ArrowRight')o[1].click()}});
home();
fetch('/api/progress').then(r=>r.ok?r.json():null).then(d=>{if(d&&d.plays>S.plays){S=Object.assign(S,d);if(S.day!==today){S.day=today;S.done=[]}save();if($('#games'))home()}}).catch(()=>{});

