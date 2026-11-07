(function(){
'use strict';
/* ===== core.js ===== */
/* ---------- tiny helpers ---------- */
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var uid=function(){return Math.random().toString(36).slice(2,9)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var pick=function(a){return a[Math.floor(Math.random()*a.length)]};
var shuffle=function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a};
var ordw=function(n){var s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0])};
var ICONS={
  feather:'<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  trash:'<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  dice:'<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.2"/><circle cx="15" cy="15" r="1.2"/><circle cx="15" cy="9" r="1.2"/><circle cx="9" cy="15" r="1.2"/>',
  play:'<path d="M7 5l12 7-12 7z"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 3-5.5 6-5.5s6 2 6 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5c3 0 5 1.8 5 4.5"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  check:'<path d="M5 12l5 5 10-11"/>',
  screen:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  up:'<path d="M6 15l6-6 6 6"/>',down:'<path d="M6 9l6 6 6-6"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".8"/><circle cx="4.5" cy="12" r=".8"/><circle cx="4.5" cy="18" r=".8"/>',
  board:'<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M5 5H3v2a3 3 0 0 0 3 3M19 5h2v2a3 3 0 0 1-3 3M12 14v4M8 20h8"/>',
  cards:'<rect x="3.5" y="6" width="11" height="14" rx="2"/><path d="M8 4h9a2.5 2.5 0 0 1 2.5 2.5V16"/>',
  quiz:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01"/>',
  moon:'<path d="M20 14A8 8 0 1 1 10 4a6.5 6.5 0 0 0 10 10z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
  star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  crown:'<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',
  share:'<path d="M4 12v7h16v-7M12 16V4M8 8l4-4 4 4"/>',
  sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',
  camera:'<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  cross:'<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  vote:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M8 12l3 3 5-6"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M3 3l18 18M10.6 5.1A9.7 9.7 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6A16.5 16.5 0 0 0 2 12s4 7 10 7c1.7 0 3.2-.5 4.5-1.2"/>',
  undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-4"/>',
  table:'<rect x="3" y="9" width="18" height="4" rx="2"/><path d="M6 13v6M18 13v6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  medal:'<circle cx="12" cy="15" r="5"/><path d="M8.5 3l3.5 7M15.5 3L12 10"/>',
  swap:'<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
  chev:'<path d="M9 6l6 6-6 6"/>',
  mask:'<path d="M4 6c5 2 11 2 16 0v6c0 4-3 7-8 7s-8-3-8-7z"/><path d="M8.5 11h.01M15.5 11h.01"/>'
};
var ico=function(n,cls){return '<svg class="i '+(cls||'')+'" viewBox="0 0 24 24" aria-hidden="true">'+(ICONS[n]||'')+'</svg>'};

/* ---------- state ---------- */
var KEY='flamigos-host-v3',WKEY='flamigos-who';
function defaultRoles(){return [
  {id:'r-vil',name:'Villager',side:'town',line:'',fill:true},
  {id:'r-maf',name:'Mafia',side:'mafia',line:'Mafia, open your eyes. Choose who to eliminate. Close your eyes.'},
  {id:'r-doc',name:'Doctor',side:'town',line:'Doctor, open your eyes. Choose someone to save. Close your eyes.'},
  {id:'r-det',name:'Detective',side:'town',line:'Detective, open your eyes. Point at one suspect. Close your eyes.'}]}
function fresh(){return {v:3,awards:defaultAwards(),title:'Saturday meetup',admins:['Rohan','Ronak','Rutuja'],people:[],tables:[],teams:[],roles:defaultRoles(),logs:[],mafia:null,
  rules:{place:[10,7,5,3],rest:1,mWin:8,mSurv:2,mBonus:2,mPart:1,mMvp:3},
  phases:{cards:{mins:60,start:null,end:null},trivia:{mins:45,start:null,end:null},mafia:{mins:45,start:null,end:null}},
  feed:[],snap:{},celebrate:true,rev:0}}
function norm(o){var f=fresh();Object.keys(f).forEach(function(k){if(o[k]==null)o[k]=f[k]});
  Object.keys(f.rules).forEach(function(k){if(o.rules[k]==null)o.rules[k]=f.rules[k]});
  ['cards','trivia','mafia'].forEach(function(k){if(!o.phases[k])o.phases[k]=f.phases[k]});
  /* awards: drop anything malformed and make sure the four known awards always exist */
  var KINDS=['top','dress','mvp','host'],seenK={};
  o.awards=(Array.isArray(o.awards)?o.awards:[]).filter(function(a){return a&&KINDS.indexOf(a.kind)>=0&&!seenK[a.kind]&&(seenK[a.kind]=1)});
  f.awards.forEach(function(d){if(!seenK[d.kind])o.awards.push(d)});
  o.awards.forEach(function(a){if(!Array.isArray(a.winners))a.winners=[];if(a.kind==='mvp'&&(!a.votes||typeof a.votes!=='object'))a.votes={}});
  return o}
function load(){try{var r=localStorage.getItem(KEY);if(!r)return null;var o=JSON.parse(r);return o&&o.v===3?norm(o):null}catch(e){return null}}
var S=load()||fresh();
var warned=false;
function saveLocal(){try{localStorage.setItem(KEY,JSON.stringify(S));warned=false;return true}catch(e){if(!warned){warned=true;toast('This device is out of space. Remove a game photo so saving can continue.')}return false}}
function persist(){S.rev=(S.rev||0)+1;var ok=saveLocal();if(typeof markDirty==='function')markDirty();return ok}
var WHO=null;try{WHO=localStorage.getItem(WKEY)}catch(e){}
if(WHO&&S.admins.indexOf(WHO)<0)WHO=null;
function setWho(n){WHO=n;try{localStorage.setItem(WKEY,n)}catch(e){}}
var UI={tab:'people',phase:'cards',filter:'all',sheet:null,preview:'phone',confirm:null,tv:false,pop:{},hide:false};
var PH={cards:{name:'Card games',short:'Cards',color:'var(--c-cards)',icon:'cards',blurb:'Seat players at tables, then log who won and the finishing order.'},
  trivia:{name:'Trivia',short:'Trivia',color:'var(--c-trivia)',icon:'quiz',blurb:'Make teams of 2 or 3 (or duos), then log each round.'},
  mafia:{name:'Khufia Mafia',short:'Mafia',color:'var(--c-mafia)',icon:'moon',blurb:'Deal roles, run the nights and days, log who is out, then the winner and MVP.'},
  awards:{name:'Awards',short:'Awards',color:'var(--gold)',icon:'medal',blurb:'Name the awards, pick the winners, then reveal them on the board.'},
  bonus:{name:'Bonus feathers',short:'Bonus',color:'var(--c-bonus)',icon:'star',blurb:'Extra feathers for best sport, best bluff, anything.'}};
var SCHED=['cards','trivia','mafia'];
function P(id){for(var i=0;i<S.people.length;i++)if(S.people[i].id===id)return S.people[i];return null}
function nm(id){var p=P(id);return p?p.name:'Someone'}
function TB(id){for(var i=0;i<S.tables.length;i++)if(S.tables[i].id===id)return S.tables[i];return null}
function roleById(id){for(var i=0;i<S.roles.length;i++)if(S.roles[i].id===id)return S.roles[i];return null}
function pstat(ph){var c=S.phases[ph];if(c.end)return 'done';if(c.start)return 'now';
  for(var i=0;i<SCHED.length;i++){var k=SCHED[i],d=S.phases[k];if(!d.end&&!d.start)return k===ph?'next':'later'}return 'later'}
var STL={done:'Done',now:'Now',next:'Up next',later:'Later'};
function fmt(s){var m=Math.floor(s/60),x=s%60;return (m<10?'0':'')+m+':'+(x<10?'0':'')+x}
function clockText(ph){var c=S.phases[ph];if(c.end&&c.start)return fmt(Math.floor((c.end-c.start)/1000));if(!c.start)return c.mins+':00';
  var left=c.mins*60-Math.floor((Date.now()-c.start)/1000);return (left<0?'+':'')+fmt(Math.abs(left))}
function hhmm(ts){return new Date(ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}

/* ---------- images ---------- */
function readImg(file,cb){
  if(!file)return;
  if(!/^image\//.test(file.type)){toast('Please choose a photo');return}
  var fr=new FileReader();fr.onerror=function(){toast('Could not read that photo')};
  fr.onload=function(){var im=new Image();im.onerror=function(){toast('Could not open that photo')};
    im.onload=function(){var m=560,w=im.width||1,h=im.height||1,s=Math.min(1,m/Math.max(w,h)),c=document.createElement('canvas');
      c.width=Math.max(1,Math.round(w*s));c.height=Math.max(1,Math.round(h*s));
      var g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(im,0,0,c.width,c.height);
      var u;try{u=c.toDataURL('image/jpeg',.72)}catch(e){toast('Could not shrink that photo');return}cb(u)};
    im.src=fr.result};
  fr.readAsDataURL(file);
}


/* ===== avatars.js ===== */
/* ---------- avatars ---------- */
var SKIN=['#FAD7BD','#F2BE98','#DFA07A','#BE7D52','#8F5A38','#5F3B26'];
var HAIRC=[['Black','#1F1A1C'],['Brown','#4B2E22'],['Chestnut','#7B4A2D'],['Auburn','#A5442A'],['Blonde','#D9B26A'],['Silver','#B9B4B8'],['Pink','#E26A9A'],['Blue','#3E6FD1']];
var TOPC=['#CF3463','#2B1B22','#7FB69E','#8EC5F0','#F4C85A','#B8A4E8'];
var BGC=['#FDE4EC','#FFE9C9','#E3F2E1','#E2EEFB','#EDE6FA','#FFF1B8','#EFE8E2','#FFD9CF'];
var HAIRS=[['none','Bald'],['buzz','Buzz'],['short','Short'],['quiff','Quiff'],['curly','Curly'],['afro','Afro'],['bob','Bob'],['long','Long'],['ponytail','Ponytail'],['bun','Bun'],['pigtails','Pigtails'],['scarf','Scarf']];
var EYES=[['round','Round'],['happy','Happy'],['sleepy','Sleepy'],['sparkle','Sparkle'],['wink','Wink']];
var MOUTHS=[['smile','Smile'],['grin','Grin'],['neutral','Calm'],['open','Wow'],['smirk','Smirk']];
var FH=[['none','None'],['stubble','Stubble'],['moustache','Moustache'],['goatee','Goatee'],['beard','Beard']];
var GLASS=[['none','None'],['round','Round'],['square','Square'],['shades','Shades']];
var HEAD=[['none','None'],['cap','Cap'],['beanie','Beanie'],['headband','Band'],['feather','Feather'],['flower','Flower'],['bow','Bow']];
var EXTRAS=[['blush','Blush'],['freckles','Freckles'],['bindi','Bindi'],['lipstick','Lipstick'],['earrings','Earrings']];
function shade(hex,amt){var n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;var f=function(v){return Math.max(0,Math.min(255,Math.round(amt<0?v*(1+amt):v+(255-v)*amt)))};return '#'+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1)}
function hairParts(k,c){
  var f=function(d,x){return '<path d="'+d+'" fill="'+c+'" '+(x||'')+'/>'};
  switch(k){
    case 'buzz':return {b:'',f:f('M31.5 42C31 27 40 23.5 50 23.5S69 27 68.5 42C65 33 58 30 50 30S35 33 31.5 42Z','opacity=".85"')};
    case 'short':return {b:'',f:f('M30 46C28 24 40 18 50 18S72 24 70 46C67 34 62 30 50 30S33 34 30 46Z')};
    case 'quiff':return {b:'',f:f('M30 44C27 22 42 12 56 15C68 17 72 28 70 44C67 33 60 28 50 28S33 33 30 44Z')};
    case 'curly':{var cs=[[34,32,7],[42,25,7.5],[51,22,7.5],[60,25,7.5],[67,32,7],[31,41,5.5],[69,41,5.5]];
      return {b:'',f:f('M31 44C31 30 69 30 69 44C65 36 35 36 31 44Z')+cs.map(function(a){return '<circle cx="'+a[0]+'" cy="'+a[1]+'" r="'+a[2]+'" fill="'+c+'"/>'}).join('')}}
    case 'afro':return {b:'<circle cx="50" cy="36" r="27" fill="'+c+'"/>',f:f('M33 40C33 30 42 27 50 27S67 30 67 40C62 34 56 33 50 33S38 34 33 40Z')};
    case 'bob':return {b:f('M28 40C26 66 32 71 37 72L63 72C68 71 74 66 72 40C72 18 28 18 28 40Z'),f:f('M30 44C29 24 40 19 50 19S71 24 70 44C66 33 60 30 50 30S34 33 30 44Z')};
    case 'long':return {b:f('M27 42C24 70 30 86 34 90L66 90C70 86 76 70 73 42C73 18 27 18 27 42Z'),f:f('M30 46C28 22 42 17 52 18C64 20 71 28 70 46C66 34 58 28 46 31C40 33 34 38 30 46Z')};
    case 'ponytail':return {b:f('M64 36C84 34 90 58 78 74C77 60 72 52 66 48Z'),f:f('M30 46C28 24 40 18 50 18S72 24 70 46C67 34 62 30 50 30S33 34 30 46Z')};
    case 'bun':return {b:'',f:'<circle cx="50" cy="13" r="9" fill="'+c+'"/>'+f('M30 46C28 24 40 18 50 18S72 24 70 46C67 34 62 30 50 30S33 34 30 46Z')};
    case 'pigtails':return {b:'<circle cx="24" cy="54" r="8.5" fill="'+c+'"/><circle cx="76" cy="54" r="8.5" fill="'+c+'"/>',f:f('M30 46C28 24 40 18 50 18S72 24 70 46C67 34 62 30 50 30S33 34 30 46Z')};
    case 'scarf':return {b:f('M25 52C22 16 78 16 75 52C75 64 71 74 65 76L35 76C29 74 25 64 25 52Z'),f:f('M31 42C33 27 67 27 69 42C64 35 58 33 50 33S36 35 31 42Z','')};
    default:return {b:'',f:''};
  }
}
function avatarSVG(a,size){
  var skin=SKIN[a.skin]||SKIN[1], sd=shade(skin,-.16), hc=(HAIRC[a.hairc]||HAIRC[0])[1], top=TOPC[a.top]||TOPC[0], bg=BGC[a.bg]||BGC[0];
  var dark='#2B1B22', hp=hairParts(a.hair,hc), brow=a.hair==='none'?'#5a4545':shade(hc,-.1), o='';
  o+='<rect width="100" height="100" fill="'+bg+'"/>';
  o+=hp.b;
  o+='<path d="M12 100C12 82 28 73 50 73S88 82 88 100Z" fill="'+top+'"/>';
  o+='<rect x="43" y="60" width="14" height="18" rx="5" fill="'+sd+'"/>';
  o+='<path d="M41 73C45 83 55 83 59 73Z" fill="'+skin+'"/>';
  if(a.hair!=='scarf')o+='<circle cx="30.5" cy="48" r="3.6" fill="'+skin+'"/><circle cx="69.5" cy="48" r="3.6" fill="'+skin+'"/>';
  o+='<ellipse cx="50" cy="46" rx="19.5" ry="22" fill="'+skin+'"/>';
  o+=hp.f;
  var ex=a.extras||[];
  if(ex.indexOf('blush')>=0)o+='<circle cx="38" cy="53" r="4" fill="#FF6F91" opacity=".35"/><circle cx="62" cy="53" r="4" fill="#FF6F91" opacity=".35"/>';
  if(ex.indexOf('freckles')>=0)o+='<g fill="'+sd+'"><circle cx="40" cy="51.5" r=".9"/><circle cx="43" cy="53" r=".9"/><circle cx="37.5" cy="53.5" r=".9"/><circle cx="60" cy="51.5" r=".9"/><circle cx="57" cy="53" r=".9"/><circle cx="62.5" cy="53.5" r=".9"/></g>';
  /* brows */
  o+='<path d="M38.5 40.5Q42.5 38.2 46.5 40" stroke="'+brow+'" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M53.5 40Q57.5 38.2 61.5 40.5" stroke="'+brow+'" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
  /* eyes */
  var L=43,R=57,y=46;
  switch(a.eyes){
    case 'happy':o+='<path d="M'+(L-3)+' '+(y+1)+'Q'+L+' '+(y-3)+' '+(L+3)+' '+(y+1)+'M'+(R-3)+' '+(y+1)+'Q'+R+' '+(y-3)+' '+(R+3)+' '+(y+1)+'" stroke="'+dark+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';break;
    case 'sleepy':o+='<path d="M'+(L-3)+' '+y+'H'+(L+3)+'M'+(R-3)+' '+y+'H'+(R+3)+'" stroke="'+dark+'" stroke-width="2" stroke-linecap="round"/>';break;
    case 'sparkle':o+='<circle cx="'+L+'" cy="'+y+'" r="2.9" fill="'+dark+'"/><circle cx="'+R+'" cy="'+y+'" r="2.9" fill="'+dark+'"/><circle cx="'+(L+1)+'" cy="'+(y-1)+'" r="1" fill="#fff"/><circle cx="'+(R+1)+'" cy="'+(y-1)+'" r="1" fill="#fff"/>';break;
    case 'wink':o+='<circle cx="'+L+'" cy="'+y+'" r="2.3" fill="'+dark+'"/><path d="M'+(R-3)+' '+(y+1)+'Q'+R+' '+(y-3)+' '+(R+3)+' '+(y+1)+'" stroke="'+dark+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';break;
    default:o+='<circle cx="'+L+'" cy="'+y+'" r="2.3" fill="'+dark+'"/><circle cx="'+R+'" cy="'+y+'" r="2.3" fill="'+dark+'"/>';
  }
  o+='<path d="M50 49Q52.5 53 49.5 53.6" stroke="'+sd+'" stroke-width="1.3" fill="none" stroke-linecap="round"/>';
  /* facial hair (under mouth) */
  var fc=hc;
  if(a.fh==='stubble')o+='<path d="M33 52C35 66 65 66 67 52C64 61 36 61 33 52Z" fill="'+fc+'" opacity=".3"/>';
  if(a.fh==='beard')o+='<path d="M31 50C32 72 68 72 69 50C66 62 58 64 50 64C42 64 34 62 31 50Z" fill="'+fc+'"/>';
  if(a.fh==='goatee')o+='<path d="M45 61C47 68 53 68 55 61C53 64 47 64 45 61Z" fill="'+fc+'"/>';
  /* mouth */
  var lip=ex.indexOf('lipstick')>=0, mc=lip?'#C2185B':dark, my=a.fh==='beard'?58:57;
  switch(a.mouth){
    case 'grin':o+='<path d="M44 '+(my-3)+'Q50 '+(my+6)+' 56 '+(my-3)+'Z" fill="#fff" stroke="'+mc+'" stroke-width="1.6" stroke-linejoin="round"/>';break;
    case 'neutral':o+='<path d="M45.5 '+my+'H54.5" stroke="'+mc+'" stroke-width="2" stroke-linecap="round"/>';break;
    case 'open':o+='<ellipse cx="50" cy="'+my+'" rx="3.5" ry="3" fill="'+(lip?'#8E0F42':'#7A2638')+'"/>';break;
    case 'smirk':o+='<path d="M45 '+my+'Q50 '+(my+2)+' 55.5 '+(my-2.5)+'" stroke="'+mc+'" stroke-width="2" fill="none" stroke-linecap="round"/>';break;
    default:o+='<path d="M44 '+(my-2)+'Q50 '+(my+4)+' 56 '+(my-2)+'" stroke="'+mc+'" stroke-width="2" fill="none" stroke-linecap="round"/>';
  }
  if(a.fh==='moustache'||a.fh==='goatee')o+='<path d="M42 53C45 50 49 52 50 53C51 52 55 50 58 53C55 56 52 55 50 54.5C48 55 45 56 42 53Z" fill="'+fc+'"/>';
  if(ex.indexOf('bindi')>=0)o+='<circle cx="50" cy="37" r="1.9" fill="#D6246E"/>';
  if(ex.indexOf('earrings')>=0)o+='<circle cx="30.5" cy="53" r="2" fill="#E8B54B"/><circle cx="69.5" cy="53" r="2" fill="#E8B54B"/>';
  /* glasses */
  if(a.glasses==='round')o+='<g fill="rgba(255,255,255,.18)" stroke="'+dark+'" stroke-width="1.6"><circle cx="43" cy="46" r="6.2"/><circle cx="57" cy="46" r="6.2"/><path d="M49.2 45.5H50.8" fill="none"/></g>';
  if(a.glasses==='square')o+='<g fill="rgba(255,255,255,.18)" stroke="'+dark+'" stroke-width="1.6"><rect x="36.5" y="40.5" width="12" height="10" rx="2.5"/><rect x="51.5" y="40.5" width="12" height="10" rx="2.5"/><path d="M48.5 45H51.5" fill="none"/></g>';
  if(a.glasses==='shades')o+='<g fill="'+dark+'"><rect x="35.5" y="41" width="13.5" height="9" rx="3.5"/><rect x="51" y="41" width="13.5" height="9" rx="3.5"/><rect x="48" y="43" width="4" height="1.6"/></g>';
  /* headwear */
  switch(a.head){
    case 'cap':o+='<path d="M30 38C31 19 69 19 70 38Z" fill="'+top+'"/><path d="M58 36H83C83 42 68 43 58 40Z" fill="'+shade(top,-.25)+'"/>';break;
    case 'beanie':o+='<path d="M29 38C28 12 72 12 71 38Z" fill="'+top+'"/><rect x="28" y="35" width="44" height="7" rx="3.5" fill="'+shade(top,-.25)+'"/><circle cx="50" cy="11" r="4.5" fill="'+shade(top,.25)+'"/>';break;
    case 'headband':o+='<path d="M31 37C40 30 60 30 69 37" fill="none" stroke="'+top+'" stroke-width="4.6" stroke-linecap="round"/>';break;
    case 'feather':o+='<g transform="rotate(14 62 26)"><path d="M62 28C63 10 77 3 86 6C85 17 75 28 62 28Z" fill="#FF8FB0"/><path d="M62 28L84 8" stroke="#CF3463" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>';break;
    case 'flower':o+='<g transform="translate(68 27)"><g fill="#FF9DB8"><circle cx="0" cy="-5" r="4"/><circle cx="4.8" cy="-1.5" r="4"/><circle cx="3" cy="4" r="4"/><circle cx="-3" cy="4" r="4"/><circle cx="-4.8" cy="-1.5" r="4"/></g><circle r="2.8" fill="#F6C945"/></g>';break;
    case 'bow':o+='<path d="M66 25L77 18V32Z M66 25L55 18V32Z" fill="'+top+'"/><circle cx="66" cy="25" r="3" fill="'+shade(top,-.25)+'"/>';break;
  }
  return '<svg viewBox="0 0 100 100" width="'+size+'" height="'+size+'" aria-hidden="true" focusable="false">'+o+'</svg>';
}
function av(p,size){return '<span class="av" style="--s:'+(size||40)+'px">'+avatarSVG(p.av||p,size||40)+'</span>'}
function randAv(kind){
  var girl=['bob','long','ponytail','bun','pigtails','curly','scarf','afro','quiff'], guy=['buzz','short','quiff','curly','afro','none','short'];
  var a={skin:Math.floor(Math.random()*6),hairc:Math.floor(Math.random()*5),top:Math.floor(Math.random()*6),bg:Math.floor(Math.random()*8),
    eyes:pick(EYES)[0],mouth:pick(MOUTHS)[0],glasses:pick(['none','none','none','round','square','shades'].map(function(x){return [x]}))[0],head:'none',fh:'none',hair:'short',extras:[]};
  var k=kind||pick(['guy','girl','neutral']);
  if(k==='guy'){a.hair=pick(guy);a.fh=pick(['none','none','stubble','moustache','beard','goatee']);if(Math.random()<.2)a.head=pick(['cap','beanie']);}
  else if(k==='girl'){a.hair=pick(girl);a.fh='none';if(Math.random()<.5)a.extras.push('earrings');if(Math.random()<.3)a.extras.push('lipstick');if(Math.random()<.3)a.extras.push('blush');if(Math.random()<.25)a.head=pick(['headband','flower','bow','feather']);}
  else{a.hair=pick(HAIRS)[0];a.fh=pick(['none','none','none','stubble']);if(Math.random()<.2)a.head=pick(['feather','cap','beanie','headband']);}
  if(a.hair==='scarf')a.head='none';
  return a;
}

/* ===== celebrate.js ===== */
/* ---------- celebration ---------- */
var FEATHER='<svg viewBox="0 0 24 24"><path d="M3 21C3 10 10 3 21 3c0 9-6 16-18 18z" fill="FILL"/><path d="M3 21L15 9" stroke="STROKE" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';
function reduced(){try{return window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}
function shower(n){
  if(!S.celebrate||reduced())return;
  var fx=$('#fx');if(!fx)return;
  var cols=[['#FF7C9C','#CF3463'],['#FFC2D1','#CF3463'],['#FFFFFF','#E8B54B'],['#F6C945','#9A6B0E'],['#FF9DB8','#CF3463']];
  if(document.documentElement.getAttribute('data-theme')==='diwali')cols=[['#F6B73C','#B5304F'],['#FFD27A','#B86A06'],['#F0803C','#B5304F'],['#FFE7B0','#B86A06'],['#FF9DB8','#B5304F']];
  var W=window.innerWidth;
  for(var i=0;i<n;i++){
    var c=pick(cols),el=document.createElement('span');el.className='fth';
    el.style.left=(Math.random()*(W-30))+'px';
    el.style.setProperty('--w',(18+Math.random()*22)+'px');
    el.style.setProperty('--dx',((Math.random()-.5)*180)+'px');
    el.style.setProperty('--dur',(2.2+Math.random()*1.6)+'s');
    el.style.setProperty('--delay',(Math.random()*.7)+'s');
    el.style.setProperty('--r0',(Math.random()*360)+'deg');
    el.style.setProperty('--r1',(Math.random()*360+180)+'deg');
    el.innerHTML=FEATHER.replace('FILL',c[0]).replace('STROKE',c[1]);
    fx.appendChild(el);
    (function(e){setTimeout(function(){if(e.parentNode)e.parentNode.removeChild(e)},5200)})(el);
  }
}
function toast(msg){
  var box=$('#toasts');if(!box)return;var t=document.createElement('div');t.className='toast';t.textContent=msg;box.appendChild(t);
  while(box.children.length>3)box.removeChild(box.firstChild);
  setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t)},3800);
}
function announce(id,head,subtxt){
  var p=P(id);if(!p)return;var el=document.createElement('div');el.className='ann';el.setAttribute('role','status');
  el.innerHTML=av(p,48)+'<div><b>'+esc(head||(p.name+' takes the lead'))+'</b><small>'+esc(subtxt||'New number one on the Flock Board')+'</small></div>';
  document.body.appendChild(el);setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el)},3800);
}

/* ===== score.js ===== */

/* ---------- scoring ---------- */
function placePts(i){var R=S.rules;return i<R.place.length?R.place[i]:R.rest}
function mPts(pl,winner,mvp){var R=S.rules,won=pl.side===winner,p=won?R.mWin:R.mPart;
  if(won&&pl.alive!==false)p+=R.mSurv;if(won&&pl.side==='mafia')p+=R.mBonus;if(mvp&&mvp===pl.id)p+=R.mMvp||0;return p}
function teamTotals(){
  var out={};S.teams.forEach(function(t){out[t.id]=0});
  S.logs.forEach(function(l){if(l.phase!=='trivia')return;S.teams.forEach(function(t){out[t.id]+=(l.scores&&l.scores[t.id])||0})});
  return out;
}
function teamRanks(){
  var tt=teamTotals(),arr=S.teams.map(function(t){return {t:t,v:tt[t.id]}}).sort(function(a,b){return b.v-a.v||a.t.name.localeCompare(b.t.name)});
  var r=0,prev=null;arr.forEach(function(x,i){if(prev===null||x.v!==prev){r=i+1;prev=x.v}x.rank=r});return arr;
}
function totals(){
  var T={},R=S.rules;
  S.people.forEach(function(p){T[p.id]={cards:0,trivia:0,mafia:0,bonus:0,total:0,wins:0,losses:0,cw:0,cl:0,tb:{},nt:0,mg:0,mw:0,mwM:0,mwT:0,surv:0,first:0,mvp:0,streak:0,trWin:false,inC:false,inT:false,inM:false}});
  var logs=S.logs.slice().sort(function(a,b){return a.ts-b.ts});
  function win(x){x.wins++;x.streak++}
  function lose(x){x.losses++;x.streak=0}
  logs.forEach(function(l){
    if(l.phase==='cards'){
      var pl=(l.players&&l.players.length)?l.players:(l.order||[]);
      pl.forEach(function(id){var x=T[id];if(!x)return;var i=(l.order||[]).indexOf(id);
        x.cards+=i>=0?placePts(i):R.rest;x.inC=true;x.tb[l.tableId||l.table||'t']=1;
        if(i===0){x.cw++;win(x)}else{x.cl++;lose(x)}});
    }else if(l.phase==='mafia'){
      (l.players||[]).forEach(function(pl){var x=T[pl.id];if(!x)return;
        var side=pl.side||(pl.role==='mafia'?'mafia':'town'),won=side===l.winner;
        x.mafia+=mPts({id:pl.id,side:side,alive:pl.alive!==false},l.winner,l.mvp);
        x.inM=true;x.mg++;if(pl.alive!==false)x.surv++;if(l.mvp===pl.id)x.mvp++;if(l.first===pl.id)x.first++;
        if(won){x.mw++;if(side==='mafia')x.mwM++;else x.mwT++;win(x)}else lose(x)});
    }else if(l.phase==='bonus'){var b=T[l.pid];if(b)b.bonus+=l.pts||0}
  });
  if(S.logs.some(function(l){return l.phase==='trivia'})){
    teamRanks().forEach(function(tr){var pts=placePts(tr.rank-1);
      (tr.t.members||[]).forEach(function(id){var x=T[id];if(!x)return;x.trivia+=pts;x.inT=true;
        if(tr.rank===1&&tr.v>0){x.trWin=true;x.wins++}else x.losses++})});
  }
  Object.keys(T).forEach(function(k){var x=T[k];x.total=x.cards+x.trivia+x.mafia+x.bonus;x.nt=Object.keys(x.tb).length});
  return T;
}
function ranked(T,filter){
  var key=(filter&&filter!=='all'&&filter!=='teams'&&filter!=='badges')?filter:'total';
  var arr=S.people.map(function(p){return {p:p,t:T[p.id]}}).sort(function(a,b){return b.t[key]-a.t[key]||b.t.wins-a.t.wins||a.p.name.localeCompare(b.p.name)});
  var r=0,prev=null;arr.forEach(function(x,i){if(prev===null||x.t[key]!==prev){r=i+1;prev=x.t[key]}x.rank=r;x.v=x.t[key]});return arr;
}
function rankMap(T){var m={};ranked(T,'all').forEach(function(x){m[x.p.id]=x.rank});return m}
function leaderOf(T){var r=ranked(T,'all');return r.length&&r[0].v>0?r[0].p.id:null}

/* ---------- badges ---------- */
var BADGES=[
  {k:'hat',n:'Hat-trick',d:'3 or more card wins',ic:'cards',t:function(x){return x.cw>=3}},
  {k:'shark',n:'Card Shark',d:'Most card wins (at least 2)',ic:'cards',t:function(x,c){return x.cw>=2&&x.cw===c.maxCw}},
  {k:'hop',n:'Table Hopper',d:'Played at 2 or more tables',ic:'table',t:function(x){return x.nt>=2}},
  {k:'triple',n:'Triple Threat',d:'Played cards, trivia and mafia',ic:'star',t:function(x){return x.inC&&x.inT&&x.inM}},
  {k:'quiz',n:'Quiz Brain',d:'On the top trivia team',ic:'quiz',t:function(x){return x.trWin}},
  {k:'tongue',n:'Silver Tongue',d:'Won a mafia game as Mafia',ic:'moon',t:function(x){return x.mwM>0}},
  {k:'eye',n:'Sharp Eye',d:'Won a mafia game as Town',ic:'eye',t:function(x){return x.mwT>0}},
  {k:'surv',n:'Survivor',d:'Alive at the end of a mafia game',ic:'check',t:function(x){return x.surv>0}},
  {k:'mvp',n:'Crowd Favourite',d:'Voted MVP by the room',ic:'crown',t:function(x){return x.mvp>0}},
  {k:'first',n:'First Casualty',d:'First one out in a mafia game',ic:'cross',t:function(x){return x.first>0}},
  {k:'fire',n:'On Fire',d:'Won 2 or more in a row',ic:'sparkle',t:function(x){return x.streak>=2}},
  {k:'fan',n:'Fan Favourite',d:'Earned bonus feathers',ic:'feather',t:function(x){return x.bonus>0}}
];
function bctx(T){var m=0;S.people.forEach(function(p){if(T[p.id].cw>m)m=T[p.id].cw});return {maxCw:m}}
function badgesOf(x,c){return BADGES.filter(function(b){return b.t(x,c)})}
function bdgPills(list,max){
  if(!list.length||max===0)return '';var show=max?list.slice(0,max):list,h=show.map(function(b){return '<span class="bdg" title="'+esc(b.d)+'">'+ico(b.ic)+esc(b.n)+'</span>'}).join('');
  if(max&&list.length>max)h+='<span class="bdg">+'+(list.length-max)+'</span>';return h;
}

/* ---------- commit ---------- */
function describe(l){
  if(l.phase==='cards')return (l.title||'Card game')+(l.table?' · '+l.table:'');
  if(l.phase==='trivia')return l.title||'Trivia round';
  if(l.phase==='mafia')return (l.title||'Mafia game')+' · '+(l.winner==='mafia'?'Mafia won':'Town won');
  return l.title||'Bonus feathers';
}
/* One place that measures what changed on the board. fn() mutates S. */
function mutate(label,phase,fn,opts){
  var silent=opts&&opts.silent;
  var B=totals(),RB=rankMap(B),LB=leaderOf(B);
  fn();
  var A=totals(),LA=leaderOf(A),deltas=[];
  S.people.forEach(function(p){var d=A[p.id].total-B[p.id].total;if(d)deltas.push({id:p.id,d:d})});
  var item=null;
  if(!silent){S.snap=RB;item={id:uid(),ts:Date.now(),phase:phase,title:label,by:WHO||'',deltas:deltas,lead:(LA&&LA!==LB)?LA:null};S.feed.push(item);S.feed=S.feed.slice(-40)}
  persist();render();
  if(item)react(item);
}
function commitLog(log,isEdit){
  if(isEdit){log.ed=WHO||''}else{log.by=WHO||''}
  mutate(describe(log),log.phase,function(){
    if(isEdit){var i=S.logs.findIndex(function(x){return x.id===log.id});if(i>=0)S.logs[i]=log;else S.logs.push(log)}else S.logs.push(log);
  },{silent:isEdit});
}
function react(f){
  if(f.award){toast(f.title);shower(46);announce(f.award.pid,f.title,f.award.kind||'Award');return}
  var gains=f.deltas.filter(function(x){return x.d>0}).sort(function(a,b){return b.d-a.d});
  var txt=gains.slice(0,3).map(function(x){return nm(x.id)+' +'+x.d}).join(', ');
  toast(f.title+(txt?': '+txt:''));
  shower(gains.length?28:10);
  if(f.lead)announce(f.lead);
}


/* ===== board.js ===== */

/* ---------- board ---------- */
function ago(ts){var s=Math.max(0,Math.round((Date.now()-ts)/1000));if(s<45)return 'just now';var m=Math.round(s/60);if(m<60)return m+' min ago';return hhmm(ts)}
function whoLine(ps){return ps.length===1?esc(ps[0].name):esc(ps[0].name)+' +'+(ps.length-1)}
function legendHTML(){return '<div class="legend">'+['cards','trivia','mafia','bonus'].map(function(k){return '<span><i style="background:'+PH[k].color+'"></i>'+PH[k].short+'</span>'}).join('')+'</div>'}
function titlesFor(T){
  var out=[],m=0;S.people.forEach(function(p){if(T[p.id].total>m)m=T[p.id].total});
  if(m>0)out.push({n:'Alpha Flamingo',sub:'Most feathers overall',ps:S.people.filter(function(p){return T[p.id].total===m})});
  var bestUp=null,rm=rankMap(T);S.people.forEach(function(p){var o=S.snap&&S.snap[p.id];if(o==null)return;var g=o-rm[p.id];if(g>0&&(!bestUp||g>bestUp.g))bestUp={p:p,g:g}});
  if(bestUp)out.push({n:'Fast Climber',sub:'Up '+bestUp.g+' place'+(bestUp.g>1?'s':'')+' on the last log',ps:[bestUp.p]});
  return out;
}
function schedHTML(){
  return '<div class="sched">'+SCHED.map(function(k){var st=pstat(k),c=S.phases[k];
    var when=st==='done'?'Finished '+hhmm(c.end):st==='now'?'Started '+hhmm(c.start):'';
    return '<div class="sch '+(st==='now'?'now':'')+'"><b>'+ico(PH[k].icon)+'<span>'+PH[k].short+'</span></b><span class="st '+(st==='now'?'now':st==='done'?'done':'')+'">'+STL[st]+'</span>'+(when?'<span class="when">'+when+'</span>':'')+'</div>'}).join('')+'</div>';
}
function npThumb(src,icon){return src?'<img class="npimg" src="'+src+'" alt="">':'<span class="npph">'+ico(icon)+'</span>'}
function nowPlayingHTML(dock){
  var rows='',M=S.mafia;
  if(M){var alive=M.players.filter(function(a){return a.alive}).length;
    rows+='<div class="npr">'+npThumb(M.img,'moon')+'<div><b>'+esc(M.title)+'</b><small>'+(M.step==='setup'?'Getting ready · '+M.players.length+' players':(M.ph==='night'?'Night ':'Day ')+M.n+' · '+alive+' of '+M.players.length+' still in')+'</small></div></div>'}
  if(!S.phases.cards.end){S.tables.slice(0,dock?3:24).forEach(function(t){
    rows+='<div class="npr">'+npThumb(t.img,'table')+'<div><b>'+esc(t.name)+' · '+esc(t.game||'Game')+'</b><small>'+(t.players&&t.players.length?esc(t.players.map(nm).join(', ')):'No one seated yet')+'</small></div></div>'})}
  if(S.teams.length&&!S.phases.trivia.end){var rn=S.logs.filter(function(l){return l.phase==='trivia'}).length;
    rows+='<div class="npr">'+npThumb('','quiz')+'<div><b>Trivia</b><small>'+S.teams.length+' teams · '+rn+' round'+(rn===1?'':'s')+' played</small></div></div>'}
  if(!rows)return '';
  return '<div class="panel"><h3>'+ico('play')+'Now playing</h3><div class="np">'+rows+'</div></div>';
}
function boardHTML(mode){
  var T=totals(),F=UI.filter,dock=mode==='dock',live=mode==='live',max=0,ctx=bctx(T);
  var filt=['all','cards','trivia','mafia','teams','badges','awards','bonus'];
  var flab={all:'Overall',cards:'Cards',trivia:'Trivia',mafia:'Mafia',teams:'Teams',badges:'Badges',awards:'Awards',bonus:'Bonus'};
  var h='<div class="board mode-'+mode+'"><div class="bwrap">';
  h+='<div class="bhead"><div><h2>The Flock Board</h2><div class="livechip">Live</div></div><div class="filters" role="tablist" aria-label="Board view">'+filt.map(function(k){return '<button class="chip '+(F===k?'on':'')+'" role="tab" aria-selected="'+(F===k)+'" data-act="filter" data-v="'+k+'">'+flab[k]+'</button>'}).join('')+'</div></div>';
  h+=schedHTML();
  if(!S.people.length){
    h+='<div class="bempty"><div class="hand">The flock is gathering.</div><div>Names appear here as the host adds them, and scores land the moment they are logged.</div></div>';
    var np0=nowPlayingHTML(dock);if(np0)h+=np0;
    return h+'</div></div>';
  }
  if(F==='teams'){
    var tr=teamRanks();h+='<div class="rows">';
    if(!tr.length)h+='<div class="bempty"><div class="hand">No teams yet.</div><div>Trivia teams show up here once the host makes them.</div></div>';
    var rounds=S.logs.filter(function(l){return l.phase==='trivia'});
    tr.forEach(function(x){
      h+='<div class="tm"><div class="rk">'+(x.v>0?x.rank:'–')+'</div><div style="min-width:0"><div class="nm">'+esc(x.t.name)+'</div><div class="stack-av" style="margin-top:4px">'+(x.t.members||[]).map(function(id){var p=P(id);return p?av(p,live?34:28):''}).join('')+'</div>'+(rounds.length?'<div class="rnds">'+rounds.map(function(l,i){return '<span title="'+esc(l.title)+'">R'+(i+1)+' · '+((l.scores&&l.scores[x.t.id])||0)+'</span>'}).join('')+'</div>':'')+'</div><div class="val">'+x.v+'</div></div>';
    });
    return h+'</div></div></div>';
  }
  if(F==='awards'){h+=awardCardsHTML(T,live);return h+'</div></div>'}
  if(F==='badges'){
    var list0=BADGES.map(function(b){return {b:b,ps:S.people.filter(function(p){return b.t(T[p.id],ctx)})}}).sort(function(a,c){return (c.ps.length>0)-(a.ps.length>0)});
    h+='<div class="bwall">'+list0.map(function(x){return '<div class="bcard '+(x.ps.length?'':'off')+'"><h3><span class="bi">'+ico(x.b.ic)+'</span>'+esc(x.b.n)+'</h3><div class="hint">'+esc(x.b.d)+'</div>'+
      (x.ps.length?'<div class="holders">'+x.ps.map(function(p){return '<span class="hold">'+av(p,24)+esc(p.name)+'</span>'}).join('')+'</div>':'<div class="hint">Not earned yet</div>')+'</div>'}).join('')+'</div>';
    return h+'</div></div>';
  }
  var list=ranked(T,F);list.forEach(function(x){if(x.v>max)max=x.v});
  var any=max>0,shown=dock?list.slice(0,8):list;
  h+='<div class="bgrid"><div class="bcol">';
  if(any){
    var top=list.filter(function(x){return x.rank<=3&&x.v>0}).slice(0,3);
    var order=top.length>=3?[top[1],top[0],top[2]]:(top.length===2?[top[1],top[0]]:[top[0]]);
    h+='<div class="podium" style="grid-template-columns:'+(order.length===3?'minmax(0,1fr) minmax(0,1.15fr) minmax(0,1fr)':order.length===2?'minmax(0,1fr) minmax(0,1.15fr)':'minmax(0,1fr)')+'">';
    order.forEach(function(x){var pos=x.rank,cls='p'+Math.min(pos,3),big=live?1.25:1;
      h+='<div class="pod '+cls+'"><div class="crown">'+(pos===1?ico('crown'):'')+'</div>'+av(x.p,Math.round((pos===1?(dock?64:84):(dock?52:64))*big))+'<div class="nm">'+esc(x.p.name)+'</div><div class="pts2">'+x.v+' feathers</div><div class="blk">'+pos+'</div></div>';
    });
    h+='</div>';
  }else{
    h+='<div class="bempty"><div class="hand">The board is stretching.</div><div>No scores yet. The first result you save puts everyone on the board and showers the room with feathers.</div></div>';
  }
  h+=legendHTML()+'<div class="rows">';
  shown.forEach(function(x){
    var d=(S.snap&&S.snap[x.p.id]!=null&&F==='all')?(S.snap[x.p.id]-x.rank):0,bar='';
    if(max>0){
      if(F==='all')bar=['cards','trivia','mafia','bonus'].map(function(k){var w=x.t[k]/max*100;return w>0?'<i style="width:'+w+'%;background:'+PH[k].color+'"></i>':''}).join('');
      else bar='<i style="width:'+(x.v/max*100)+'%;background:'+PH[F].color+'"></i>';
    }
    var bl=badgesOf(x.t,ctx),played=x.t.wins+x.t.losses>0,aw=awardPills(x.p.id,T);
    var sub=(played||bl.length||aw)?'<div class="sub">'+(played?'<span class="wl">'+x.t.wins+'W – '+x.t.losses+'L</span>':'')+aw+bdgPills(bl,aw?(dock?0:1):(dock?1:2))+'</div>':'';
    h+='<div class="rrow" data-pid="'+x.p.id+'"><div class="rk">'+(max>0?x.rank:'–')+'</div>'+av(x.p,live?48:40)+'<div style="min-width:0"><div class="nm"><span>'+esc(x.p.name)+'</span>'+(d!==0?'<span class="mv '+(d<0?'dn':'')+'">'+ico(d>0?'up':'down')+Math.abs(d)+'</span>':'')+'</div>'+sub+'<div class="bar" aria-hidden="true">'+bar+'</div></div><div class="val">'+x.v+'<small>feathers</small></div></div>';
  });
  if(dock&&list.length>8)h+='<div class="hint" style="text-align:center">Plus '+(list.length-8)+' more on the full board</div>';
  h+='</div></div><div class="bcol">';
  var np=nowPlayingHTML(dock);if(np)h+=np;
  h+=awardsMini(T,dock);
  if(!dock){
    var ts=titlesFor(T);
    if(ts.length)h+='<div class="panel"><h3>'+ico('sparkle')+'Flock titles</h3><div class="titles">'+ts.map(function(t){return '<div class="ttl">'+av(t.ps[0],36)+'<div style="min-width:0"><b>'+esc(t.n)+'</b><small>'+whoLine(t.ps)+' · '+esc(t.sub)+'</small></div></div>'}).join('')+'</div></div>';
  }
  var feed=S.feed.slice().reverse().slice(0,dock?3:8);
  h+='<div class="panel"><h3>'+ico('feather')+'What just happened</h3>';
  if(!feed.length)h+='<div class="hint">Nothing yet. Every saved result shows up here.</div>';
  else h+='<div class="feed">'+feed.map(function(f){var g=f.deltas.filter(function(x){return x.d>0}).sort(function(a,b){return b.d-a.d}).slice(0,3);
    return '<div class="fi"><span class="d" style="background:'+(PH[f.phase]||PH.bonus).color+'">'+ico((PH[f.phase]||PH.bonus).icon)+'</span><div><b>'+esc(f.title)+'</b><div>'+(g.length?g.map(function(x){return esc(nm(x.id))+' <b>+'+x.d+'</b>'}).join(', '):(f.award?'Award revealed':'Logged'))+'</div><time>'+ago(f.ts)+(f.by?' · logged by '+esc(f.by):'')+'</time></div></div>'}).join('')+'</div>';
  h+='</div></div></div></div></div>';
  return h;
}

/* ===== views.js ===== */

/* ---------- shared bits ---------- */
function ordersHTML(ids,pts){return '<div class="order">'+ids.map(function(id,i){var p=P(id);if(!p)return '';return '<span class="ord">'+av(p,24)+'<b>'+esc(p.name)+'</b><em>'+(pts?pts(i):ordw(i+1))+'</em></span>'}).join('')+'</div>'}
function stackAv(ids,s){return '<div class="stack-av">'+(ids||[]).map(function(id){var p=P(id);return p?av(p,s||30):''}).join('')+'</div>'}
function imgField(target,src,label){
  return '<div class="f"><span>'+label+'</span><div class="imgf">'+(src?'<img class="imgp" src="'+src+'" alt="Photo preview">':'<div class="imgph">'+ico('image')+'<span>No photo yet. Add one so everyone can see what is being played.</span></div>')+
    '<div class="row"><button type="button" class="btn sm" data-act="img-pick" data-t="'+target+'">'+ico('camera')+(src?'Change photo':'Add photo')+'</button>'+(src?'<button type="button" class="btn sm" data-act="img-clear" data-t="'+target+'">Remove</button>':'')+'</div>'+
    '<input type="file" accept="image/*" hidden data-in="img" data-t="'+target+'" id="file-'+target+'"></div></div>';
}
function whoCls(n){var i=S.admins.indexOf(n);return ' c'+(i<0?0:i%4)}
function whoInitial(n){return esc((n||'?').charAt(0).toUpperCase())}

/* ---------- gate + header ---------- */
function loginView(){
  var sel=UI.loginHost;
  var h='<div class="gate"><div class="card gatec"><span class="mark big">'+ico('feather')+'</span><h1>Host sign-in</h1>';
  if(!SYNC.configured){
    return h+'<p class="muted">The server is running but no hosts are set up yet. Add the <b>HOSTS</b> secret in Cloudflare (see the README), then refresh.</p><a class="btn" href="#live">'+ico('screen')+'Open the live board</a></div></div>';
  }
  if(!sel){
    h+='<p class="muted">Pick your name, then enter your PIN. Everything you log is tagged with your name.</p><div class="who">'+SYNC.hosts.map(function(n,i){return '<button class="whobtn" data-act="login-pick" data-n="'+esc(n)+'"><span class="ini c'+(i%4)+'">'+whoInitial(n)+'</span>'+esc(n)+'</button>'}).join('')+'</div>';
  }else{
    h+='<div class="whobtn" style="cursor:default"><span class="ini c'+Math.max(0,SYNC.hosts.indexOf(sel))%4+'">'+whoInitial(sel)+'</span>'+esc(sel)+'</div>'+
      '<form id="loginform" class="stack" style="width:100%"><label class="sr" for="pin">PIN</label><input id="pin" type="password" inputmode="numeric" autocomplete="current-password" placeholder="Your PIN" style="text-align:center;font-size:20px;letter-spacing:.2em"><button class="btn primary" type="submit">Sign in</button><button class="btn" type="button" data-act="login-back">Not '+esc(sel)+'?</button></form>';
  }
  return h+'<p class="hint">Just watching? <a href="#live">Open the live board</a>. No sign-in needed.</p></div></div>';
}
function gateView(){
  return '<div class="gate"><div class="card gatec"><span class="mark big">'+ico('feather')+'</span><h1>Who is logging tonight?</h1>'+
    '<p class="muted">Pick your name. Everything you log is tagged with it, so the feed shows who entered what.</p>'+
    '<div class="who">'+S.admins.map(function(n){return '<button class="whobtn" data-act="who" data-n="'+esc(n)+'"><span class="ini'+whoCls(n)+'">'+whoInitial(n)+'</span>'+esc(n)+'</button>'}).join('')+'</div>'+
    '<form id="addadmin" class="addrow"><label class="sr" for="adm-name">Another host</label><input id="adm-name" type="text" placeholder="Another host" maxlength="30" autocomplete="off"><button class="btn" type="submit">'+ico('plus')+'Add</button></form>'+
    '<p class="hint">This is a quick name pick for tonight, not a password. Real sign-in comes with the full app. Viewers never see this screen: they open the live link.</p></div></div>';
}
function tabsHTML(kind){
  var T=[['people','People','users',S.people.length],['games','Games','cards',S.logs.length],['board','Board','board',null],['share','Share','share',null]];
  return T.map(function(t){var on=UI.tab===t[0];return '<button class="'+(on?'on':'')+'" data-act="nav" data-v="'+t[0]+'" aria-current="'+(on?'page':'false')+'">'+ico(t[2])+'<span>'+t[1]+(kind==='top'&&t[3]!=null?' ('+t[3]+')':'')+'</span></button>'}).join('');
}

/* ---------- people ---------- */
function peopleView(){
  var h='<div class="card"><h2>Who is here tonight?</h2><div class="sub">Type names or paste a list. Everyone gets a random face you can change.</div>'+
    '<form id="addform" class="addbox"><label class="sr" for="addname">Names</label><textarea id="addname" rows="2" placeholder="Type a name, press Enter. Or paste: Asha, Ben, Chitra" autocomplete="off"></textarea>'+
    '<div class="row"><button class="btn primary" type="submit">'+ico('plus')+'Add to the flock</button><span class="hint">Commas or new lines separate names. Shift+Enter for a new line.</span></div></form></div>';
  if(!S.people.length){
    h+='<div class="empty"><div class="big">'+ico('feather')+'</div><h3>No names yet</h3><p class="muted">Type the first name above and the flock begins. Nothing is pre-filled.</p>'+(isServer()?'':'<button class="btn soft sm" data-act="practice">Try it with practice names and scores</button>')+'</div>';
    return h;
  }
  h+='<div class="row between"><h2>'+S.people.length+' in the flock</h2><div class="row">'+(UI.confirm==='clearall'?'<button class="btn danger sm" data-act="clearall-yes">Yes, remove everyone</button><button class="btn sm" data-act="confirm-no">Keep</button>':'<button class="btn sm" data-act="clearall">Clear everyone</button>')+'</div></div>';
  var T=totals();
  h+='<div class="people">'+S.people.map(function(p){var t=T[p.id].total;
    return '<div class="pcard"><button class="avb" data-act="avatar" data-id="'+p.id+'" aria-label="Change '+esc(p.name)+'\'s face">'+av(p,52)+'</button><div class="grow"><div class="nm">'+esc(p.name)+'</div><div class="sc">'+(t?t+' feathers':'No score')+'</div></div>'+
      '<button class="ibtn" data-act="avatar" data-id="'+p.id+'" aria-label="Edit '+esc(p.name)+'">'+ico('edit')+'</button>'+
      (UI.confirm==='rm-'+p.id?'<button class="btn danger sm" data-act="rm-yes" data-id="'+p.id+'">Remove?</button>':'<button class="ibtn" data-act="rm" data-id="'+p.id+'" aria-label="Remove '+esc(p.name)+'">'+ico('trash')+'</button>')+'</div>'}).join('')+'</div>';
  return h;
}

/* ---------- games ---------- */
function clockHTML(ph){
  var c=S.phases[ph],st=pstat(ph);
  if(st==='done')return '<div class="clock" aria-label="Phase clock"><span class="hint">Took</span><span class="big">'+clockText(ph)+'</span><button class="btn sm" data-act="ph-reopen" data-ph="'+ph+'">Reopen</button><button class="btn sm" data-act="ph-reset" data-ph="'+ph+'">Reset</button></div>';
  if(st==='now')return '<div class="clock" aria-label="Phase clock"><span class="big" data-clock="'+ph+'">'+clockText(ph)+'</span><span class="hint">left</span><button class="btn sm primary" data-act="ph-end" data-ph="'+ph+'">End phase</button></div>';
  return '<div class="clock" aria-label="Phase clock"><span class="big" data-clock="'+ph+'">'+clockText(ph)+'</span><input type="number" min="5" max="240" value="'+c.mins+'" data-in="clockmins" data-ph="'+ph+'" aria-label="Minutes"><span class="hint">min</span><button class="btn sm primary" data-act="ph-start" data-ph="'+ph+'">'+ico('play')+'Start</button></div>';
}
function gamesView(){
  var ph=UI.phase,counts={};
  ['cards','trivia','mafia','bonus'].forEach(function(k){counts[k]=S.logs.filter(function(l){return l.phase===k}).length+' logged'});
  counts.awards=S.awards.filter(function(a){return a.on&&a.revealed}).length+' revealed';
  var h='<div class="seg" role="tablist" aria-label="Meetup phase">'+['cards','trivia','mafia','bonus','awards'].map(function(k){
    var st=SCHED.indexOf(k)>=0?pstat(k):'';
    return '<button role="tab" aria-selected="'+(ph===k)+'" class="'+(ph===k?'on':'')+'" data-act="phase" data-v="'+k+'">'+(st==='now'||st==='done'?'<i class="sdot '+st+'" title="'+STL[st]+'"></i>':'')+ico(PH[k].icon)+'<span>'+PH[k].short+'</span><small>'+counts[k]+'</small></button>'}).join('')+'</div>';
  var sched=SCHED.indexOf(ph)>=0,st=sched?pstat(ph):'';
  h+='<div class="phero" style="--pc:'+PH[ph].color+'"><div class="row" style="flex-wrap:nowrap;gap:14px"><span class="pico">'+ico(PH[ph].icon)+'</span><div class="grow"><h2>'+PH[ph].name+'</h2><div class="sub">'+PH[ph].blurb+'</div></div>'+(sched?'<span class="st '+(st==='now'?'now':st==='done'?'done':'')+'">'+STL[st]+'</span>':'')+'</div>'+(sched?clockHTML(ph):'')+'</div>';
  if(ph==='cards')h+=cardsPanel();
  else if(ph==='trivia')h+=triviaPanel();
  else if(ph==='mafia')h+=mafiaView();
  else if(ph==='awards')h+=awardsPanel();
  else h+=bonusPanel();
  h+='<details class="rules"><summary>Scoring rules (tap to edit)</summary><div class="rgrid">'+
    [0,1,2,3].map(function(i){return '<label>'+ordw(i+1)+' place<input type="number" min="0" data-in="rule" data-k="place" data-i="'+i+'" value="'+S.rules.place[i]+'"></label>'}).join('')+
    '<label>Everyone else (lost)<input type="number" min="0" data-in="rule" data-k="rest" value="'+S.rules.rest+'"></label>'+
    '<label>Mafia: winning side<input type="number" min="0" data-in="rule" data-k="mWin" value="'+S.rules.mWin+'"></label>'+
    '<label>Mafia: survivor bonus<input type="number" min="0" data-in="rule" data-k="mSurv" value="'+S.rules.mSurv+'"></label>'+
    '<label>Mafia: bonus for a mafia win<input type="number" min="0" data-in="rule" data-k="mBonus" value="'+S.rules.mBonus+'"></label>'+
    '<label>Mafia: losing side<input type="number" min="0" data-in="rule" data-k="mPart" value="'+S.rules.mPart+'"></label>'+
    '<label>Mafia: MVP vote bonus<input type="number" min="0" data-in="rule" data-k="mMvp" value="'+S.rules.mMvp+'"></label></div>'+
    '<p class="hint" style="padding-bottom:16px">Cards: finishing order scores place points, everyone else at the table scores the lost points. Trivia: every member gets the placing points of their team.</p></details>';
  return h;
}
function emptyBlock(icon,title,text,btn){return '<div class="empty"><div class="big">'+ico(icon)+'</div><h3>'+title+'</h3><p class="muted">'+text+'</p>'+(btn||'')+'</div>'}
function cardsPanel(){
  var noP=!S.people.length;
  var h='<div class="row between"><div><h2>Tables</h2><div class="sub">Seat players, pick the game, add a photo. Each table can play something different.</div></div><button class="btn primary" data-act="newtable" '+(noP?'disabled':'')+'>'+ico('plus')+'New table</button></div>';
  if(noP)h+='<div class="hint">Add names on the People tab first.</div>';
  if(!S.tables.length){
    h+=emptyBlock('table','No tables yet','Make a table for each group: name it, choose the game, seat the players. Then log who won and in what order.');
  }else{
    h+='<div class="tgrid">'+S.tables.map(function(t){
      var rounds=S.logs.filter(function(l){return l.phase==='cards'&&l.tableId===t.id}).sort(function(a,b){return a.ts-b.ts}),last=rounds[rounds.length-1];
      return '<div class="tcard">'+(t.img?'<img class="timg" src="'+t.img+'" alt="'+esc(t.game||'Game')+' at '+esc(t.name)+'">':'<div class="tph">'+ico('table')+'</div>')+
        '<div class="tbody"><div class="row" style="flex-wrap:nowrap;justify-content:space-between"><div class="grow"><div class="tname">'+esc(t.name)+'</div></div><span class="gchip">'+esc(t.game||'Pick a game')+'</span></div>'+
        (t.players&&t.players.length?stackAv(t.players,32)+'<div class="pnames">'+esc(t.players.map(nm).join(', '))+'</div>':'<div class="pnames">Nobody seated yet</div>')+
        (last&&last.order&&last.order.length?'<div class="hint">'+rounds.length+' round'+(rounds.length>1?'s':'')+' · last won by <b>'+esc(nm(last.order[0]))+'</b></div>':'')+
        '<div class="row"><button class="btn primary sm" data-act="cardres" data-id="'+t.id+'" '+((t.players||[]).length<2?'disabled':'')+'>'+ico('check')+'Log result</button><button class="ibtn" data-act="edittable" data-id="'+t.id+'" aria-label="Edit '+esc(t.name)+'">'+ico('edit')+'</button>'+
        (UI.confirm==='dt-'+t.id?'<button class="btn danger sm" data-act="deltable-yes" data-id="'+t.id+'">Delete?</button>':'<button class="ibtn" data-act="deltable" data-id="'+t.id+'" aria-label="Delete '+esc(t.name)+'">'+ico('trash')+'</button>')+'</div></div></div>'}).join('')+'</div>';
  }
  var logs=S.logs.filter(function(l){return l.phase==='cards'}).slice().reverse();
  if(logs.length)h+='<div class="row between"><h2>Results</h2></div><div class="loglist">'+logs.map(logCard).join('')+'</div>';
  return h;
}
function triviaPanel(){
  var h='<div class="row"><button class="btn" data-act="teams">'+ico('users')+'Teams ('+S.teams.length+')</button><button class="btn primary" data-act="newround" '+(S.people.length?'':'disabled')+'>'+ico('plus')+'Log a round</button></div>';
  if(S.teams.length){var tr=teamRanks();
    h+='<div class="teamgrid">'+tr.map(function(x){return '<div class="team"><div class="th"><span class="tn">'+esc(x.t.name)+'</span><span class="tag win">#'+x.rank+' · '+x.v+'</span></div>'+stackAv(x.t.members,30)+'<div class="hint">'+(esc((x.t.members||[]).map(nm).join(', '))||'No members yet')+'</div></div>'}).join('')+'</div>';
  }
  var logs=S.logs.filter(function(l){return l.phase==='trivia'}).slice().reverse();
  if(!logs.length)h+=emptyBlock('quiz','No rounds yet',S.teams.length?'Log the first round and team scores appear on the board.':'Make teams first (2 or 3 each, or duos), then log each round.');
  else h+='<div class="loglist">'+logs.map(logCard).join('')+'</div>';
  return h;
}
function bonusPanel(){
  var h='<div class="row"><button class="btn primary" data-act="newbonus" '+(S.people.length?'':'disabled')+'>'+ico('plus')+'Give bonus feathers</button></div>';
  var logs=S.logs.filter(function(l){return l.phase==='bonus'}).slice().reverse();
  if(!logs.length)h+=emptyBlock('star','No bonus feathers yet','Best sport, best bluff, helped set up. Anything worth a few extra feathers.');
  else h+='<div class="loglist">'+logs.map(logCard).join('')+'</div>';
  return h;
}
function logCard(l){
  var meta=hhmm(l.ts)+(l.by?' · '+esc(l.by):'');
  var h='<div class="log"><div class="lh"><div><div class="t">'+esc(describe(l))+'</div><div class="hint">'+meta+'</div></div><div class="row">'+
    '<button class="ibtn" data-act="editlog" data-id="'+l.id+'" aria-label="Edit result">'+ico('edit')+'</button>'+
    (UI.confirm==='dl-'+l.id?'<button class="btn danger sm" data-act="dellog-yes" data-id="'+l.id+'">Delete?</button>':'<button class="ibtn" data-act="dellog" data-id="'+l.id+'" aria-label="Delete result">'+ico('trash')+'</button>')+'</div></div>';
  if(l.img)h+='<img class="imgp" src="'+l.img+'" alt="">';
  if(l.phase==='cards'){
    var pl=(l.players&&l.players.length)?l.players:l.order,lost=pl.filter(function(id){return l.order.indexOf(id)<0});
    h+=ordersHTML(l.order,function(i){return '+'+placePts(i)});
    if(lost.length)h+='<div class="lost"><span>Lost:</span>'+lost.map(function(id){var p=P(id);return p?'<span class="ord">'+av(p,22)+'<b>'+esc(p.name)+'</b><em>+'+S.rules.rest+'</em></span>':''}).join('')+'</div>';
  }
  if(l.phase==='trivia')h+='<div class="order">'+S.teams.map(function(t){return '<span class="ord"><b>'+esc(t.name)+'</b><em>'+((l.scores&&l.scores[t.id])||0)+'</em></span>'}).join('')+'</div>';
  if(l.phase==='mafia'){
    h+='<div class="row"><span class="tag '+(l.winner==='mafia'?'mafia':'win')+'">'+(l.winner==='mafia'?'Mafia won':'Town won')+'</span>'+(l.nights?'<span class="hint">'+l.nights+' night'+(l.nights>1?'s':'')+'</span>':'')+(l.mvp?'<span class="bdg">'+ico('crown')+'MVP '+esc(nm(l.mvp))+'</span>':'')+'</div>'+
      '<div class="order">'+(l.players||[]).map(function(pl){var p=P(pl.id);if(!p)return '';return '<span class="ord">'+av(p,24)+'<b>'+esc(p.name)+'</b><span class="rpill '+(pl.side==='mafia'?'mafia':'')+'">'+esc(pl.roleName||'Town')+(pl.alive===false?' · '+(pl.out==='voted'?'voted out':'died'):'')+'</span></span>'}).join('')+'</div>';
  }
  if(l.phase==='bonus'){var p=P(l.pid);h+='<div class="order">'+(p?'<span class="ord">'+av(p,24)+'<b>'+esc(p.name)+'</b><em>+'+l.pts+'</em></span>':'')+(l.note?'<span class="hint">'+esc(l.note)+'</span>':'')+'</div>'}
  return h+'</div>';
}

/* ---------- Khufia Mafia desk ---------- */
function newMafia(){var n=S.logs.filter(function(l){return l.phase==='mafia'}).length+1;
  return {id:uid(),title:'Khufia Mafia '+n,img:'',step:'setup',players:[],comp:null,n:1,ph:'night',events:[],winner:null,votes:{},mvp:null}}
function fillRole(){return S.roles.filter(function(r){return r.fill})[0]||S.roles.filter(function(r){return r.side==='town'})[0]||S.roles[0]}
function suggestComp(n){var c={},maf=S.roles.filter(function(r){return r.side==='mafia'})[0];
  var doc=roleById('r-doc'),det=roleById('r-det');
  if(maf)c[maf.id]=Math.max(1,Math.round(n/4));if(n>=5&&doc)c[doc.id]=1;if(n>=6&&det)c[det.id]=1;return c}
function compOf(M){return M.comp||suggestComp(M.players.length)}
function compSum(M){var c=compOf(M),f=fillRole(),s=0;S.roles.forEach(function(r){if(f&&r.id===f.id)return;s+=c[r.id]||0});return s}
function mCounts(M){var al=0,ma=0,tw=0;M.players.forEach(function(pl){if(!pl.alive)return;al++;var r=roleById(pl.role);if(r&&r.side==='mafia')ma++;else tw++});return {al:al,ma:ma,tw:tw}}
function mAuto(M){if(M.players.length<2)return null;var c=mCounts(M);if(c.ma===0)return 'town';if(c.ma>=c.tw)return 'mafia';return null}
function autoMvp(M){var best=0,id=null,tie=false;Object.keys(M.votes||{}).forEach(function(k){var v=M.votes[k];if(v>best){best=v;id=k;tie=false}else if(v===best&&v>0)tie=true});return (best>0&&!tie)?id:null}
function firstOut(M){var e=(M.events||[]).filter(function(x){return x.t==='died'||x.t==='voted'})[0];return e?e.pid:null}
function mSides(M,w){return M.players.map(function(pl){var r=roleById(pl.role)||{name:'Villager',side:'town'};return {id:pl.id,role:pl.role,roleName:r.name,side:r.side,alive:pl.alive,out:pl.out}})}
function mafiaView(){
  var M=S.mafia,h='';
  if(!M){
    h+='<div class="card"><h2>Ready when you are</h2><div class="sub">Add everyone who is playing, give each person a role, then run the nights and days from here. Roles stay hidden on the live board until you save the result.</div>'+
      '<div class="row" style="margin-top:14px"><button class="btn primary" data-act="mnew" '+(S.people.length>=3?'':'disabled')+'>'+ico('moon')+'Start a new game</button><button class="btn" data-act="roles">'+ico('mask')+'Roles ('+S.roles.length+')</button></div>'+
      (S.people.length>=3?'':'<div class="hint" style="margin-top:8px">Add at least 3 names on the People tab first.</div>')+'</div>';
    var logs=S.logs.filter(function(l){return l.phase==='mafia'}).slice().reverse();
    if(logs.length)h+='<h2>Past games</h2><div class="loglist">'+logs.map(logCard).join('')+'</div>';
    return h;
  }
  if(M.step==='setup')return mSetup(M);
  if(M.step==='play')return mPlay(M);
  return mFinish(M);
}
function mSetup(M){
  var n=M.players.length,comp=compOf(M),fill=fillRole(),sum=compSum(M),rem=n-sum,assigned=M.players.filter(function(p){return p.role&&roleById(p.role)}).length;
  var hasMaf=M.players.some(function(p){var r=roleById(p.role);return r&&r.side==='mafia'});
  var ok=n>=3&&assigned===n&&hasMaf;
  var h='<div class="card"><div class="row between"><div><h2>Set up the game</h2><div class="sub">Step 1 of 3 · players and roles</div></div>'+cancelBtn('sm')+'</div>'+
    '<div class="f" style="margin-top:12px"><label for="m-title"><span>Game name</span></label><input id="m-title" type="text" data-in="mtitle" value="'+esc(M.title)+'" maxlength="60"></div>'+imgField('mafia',M.img,'Game photo or poster (optional)')+'</div>';
  h+='<div class="card"><div class="row between"><h3>Who is playing? ('+n+')</h3><div class="row"><button class="btn sm" data-act="m-all">Everyone</button><button class="btn sm" data-act="m-none">Clear</button></div></div>'+
    '<div class="pchips" style="margin-top:10px">'+S.people.map(function(p){var on=M.players.some(function(x){return x.id===p.id});return '<button type="button" class="pchip '+(on?'on':'')+'" data-act="m-pick" data-id="'+p.id+'" aria-pressed="'+on+'">'+av(p,30)+'<b>'+esc(p.name)+'</b></button>'}).join('')+'</div></div>';
  h+='<div class="card"><div class="row between"><div><h3>Roles</h3><div class="hint">Set how many of each, then deal at random, or pick each person below.</div></div><button class="btn sm" data-act="roles">'+ico('edit')+'Edit roles</button></div><div class="compgrid" style="margin-top:12px">'+
    S.roles.filter(function(r){return !(fill&&r.id===fill.id)}).map(function(r){var v=comp[r.id]||0;
      return '<div class="crow"><div><b>'+esc(r.name)+'</b> <span class="rpill '+(r.side==='mafia'?'mafia':'')+'">'+(r.side==='mafia'?'Mafia side':'Town side')+'</span></div><div class="stepper"><button type="button" class="ibtn" data-act="m-comp" data-id="'+r.id+'" data-d="-1" aria-label="Fewer '+esc(r.name)+'">−</button><b style="min-width:24px;text-align:center">'+v+'</b><button type="button" class="ibtn" data-act="m-comp" data-id="'+r.id+'" data-d="1" aria-label="More '+esc(r.name)+'">+</button></div></div>'}).join('')+
    (fill?'<div class="crow"><div><b>'+esc(fill.name)+'</b> <span class="hint">everyone else</span></div><b>'+Math.max(0,rem)+'</b></div>':'')+'</div>'+
    (rem<0?'<div class="hint" style="color:var(--danger);margin-top:8px">More roles than players. Lower a count or add players.</div>':'')+
    '<div class="row" style="margin-top:12px"><button class="btn primary" data-act="m-deal" '+(n<3||rem<0?'disabled':'')+'>'+ico('dice')+'Deal random roles</button><button class="btn" data-act="m-clearroles" '+(assigned?'':'disabled')+'>Clear roles</button></div></div>';
  if(n){
    h+='<div class="card"><h3>Each player\'s role</h3><div class="stack" style="margin-top:10px">'+M.players.map(function(pl){var p=P(pl.id);if(!p)return '';
      return '<div class="mp" style="grid-template-columns:auto minmax(0,1fr) minmax(120px,170px)">'+av(p,36)+'<div class="nm">'+esc(p.name)+'</div><select data-in="mrole" data-id="'+pl.id+'" aria-label="Role for '+esc(p.name)+'"><option value="">Pick a role</option>'+S.roles.map(function(r){return '<option value="'+r.id+'" '+(pl.role===r.id?'selected':'')+'>'+esc(r.name)+'</option>'}).join('')+'</select></div>'}).join('')+'</div></div>';
  }
  var why=n<3?'Pick at least 3 players.':assigned<n?(n-assigned)+' still need a role.':!hasMaf?'Give at least one player a Mafia-side role.':'';
  h+='<div class="row"><button class="btn primary" data-act="mstart" '+(ok?'':'disabled')+'>'+ico('moon')+'Start Night 1</button>'+(why?'<span class="hint">'+why+'</span>':'')+'</div>';
  return h;
}
function mScript(M){
  var night=M.ph==='night',c=mCounts(M),lines='';
  if(night){
    lines+='<div class="sl plain"><b>Everyone</b>Close your eyes. It is Night '+M.n+'.</div>';
    S.roles.forEach(function(r){if(!r.line)return;var cnt=M.players.filter(function(p){return p.alive&&p.role===r.id}).length;if(!cnt)return;
      lines+='<div class="sl"><b>'+esc(r.name)+' · '+cnt+' alive</b>'+esc(r.line)+'</div>'});
    lines+='<div class="sl plain"><b>Everyone</b>Open your eyes. It is Day '+M.n+'.</div>';
  }else{
    var died=M.events.filter(function(e){return e.t==='died'&&e.n===M.n}).map(function(e){return nm(e.pid)});
    lines+='<div class="sl plain"><b>Overnight</b>'+(died.length?esc(died.join(' and '))+(died.length>1?' were':' was')+' eliminated in the night.':'Nobody was eliminated in the night.')+'</div>';
    lines+='<div class="sl plain"><b>Everyone</b>Discuss, then vote someone out. '+c.al+' players are still in.</div>';
  }
  return '<div class="card"><h3>'+ico('mask')+' Say this</h3><div class="script" style="margin-top:10px">'+lines+'</div></div>';
}
function mPlay(M){
  var c=mCounts(M),night=M.ph==='night',auto=mAuto(M);
  var h='<div class="card"><div class="nightbig"><span class="orb '+(night?'night':'day')+'">'+ico(night?'moon':'sun')+'</span><div class="grow"><div class="hint">'+esc(M.title)+' · Step 2 of 3</div><h2>'+(night?'Night ':'Day ')+M.n+'</h2></div>'+
    '<button class="btn primary" data-act="mnext">'+ico(night?'sun':'moon')+(night?'Go to Day '+M.n:'Go to Night '+(M.n+1))+'</button></div>'+
    '<div class="cnts" style="margin-top:14px"><div class="cnt"><b>'+c.al+'</b><span>Alive</span></div><div class="cnt"><b>'+(UI.hide?'?':c.ma)+'</b><span>Mafia side</span></div><div class="cnt"><b>'+(UI.hide?'?':c.tw)+'</b><span>Town side</span></div></div></div>';
  if(auto)h+='<div class="banner"><div><b>'+(auto==='town'?'Town looks like it has won':'Mafia looks like it has won')+'</b><div class="hint">'+(auto==='town'?'No mafia left.':'Mafia are level with, or outnumber, the town.')+'</div></div><button class="btn primary" data-act="mfinish">'+ico('check')+'Finish game</button></div>';
  h+=mScript(M);
  h+='<div class="card"><div class="row between"><h3>Players</h3><button class="btn sm" data-act="m-hide">'+ico(UI.hide?'eye':'eyeoff')+(UI.hide?'Show roles':'Hide roles')+'</button></div><div class="mps" style="margin-top:10px">'+M.players.map(function(pl){
    var p=P(pl.id);if(!p)return '';var r=roleById(pl.role)||{name:'No role',side:'town'};
    var ev=M.events.filter(function(e){return e.pid===pl.id&&(e.t==='died'||e.t==='voted')})[0];
    return '<div class="mp '+(pl.alive?'':'out')+'">'+av(p,40)+'<div style="min-width:0"><div class="nm">'+esc(p.name)+'</div><div>'+(UI.hide?'<span class="rpill">Role hidden</span>':'<span class="rpill '+(r.side==='mafia'?'mafia':'')+'">'+esc(r.name)+'</span>')+(pl.alive?'':' <span class="hint">'+(pl.out==='voted'?'Voted out':'Died')+(ev?' · '+(ev.ph==='night'?'Night ':'Day ')+ev.n:'')+'</span>')+'</div></div>'+
      '<div class="acts">'+(pl.alive?'<button class="btn sm" data-act="mdie" data-id="'+pl.id+'" data-how="died">'+ico('cross')+'Died</button><button class="btn sm" data-act="mdie" data-id="'+pl.id+'" data-how="voted">'+ico('vote')+'Voted out</button>':'<button class="btn sm" data-act="mrev" data-id="'+pl.id+'">'+ico('undo')+'Undo</button>')+'</div></div>'}).join('')+'</div></div>';
  h+='<div class="card"><h3>Timeline</h3><div class="tl" style="margin-top:10px">'+M.events.slice().reverse().map(function(e){
    var ic=e.t==='night'?'moon':e.t==='day'?'sun':e.t==='died'?'cross':'vote',role='';
    if(e.pid&&!UI.hide){var pl=M.players.filter(function(x){return x.id===e.pid})[0],r=pl&&roleById(pl.role);role=r?' ('+esc(r.name)+')':''}
    var txt=e.t==='night'?'Night '+e.n+' begins':e.t==='day'?'Day '+e.n+' begins':e.t==='died'?esc(nm(e.pid))+' died'+role+' · '+(e.ph==='night'?'Night ':'Day ')+e.n:esc(nm(e.pid))+' voted out'+role+' · Day '+e.n;
    return '<div><span class="d">'+ico(ic)+'</span><span>'+txt+'</span></div>'}).join('')+'</div></div>';
  h+='<div class="row"><button class="btn primary" data-act="mfinish">'+ico('check')+'Finish game</button>'+cancelBtn('')+'</div>';
  return h;
}
function mFinish(M){
  var auto=mAuto(M),w=M.winner||auto,mvp=M.mvp||autoMvp(M);
  var h='<div class="card"><div class="row between"><div><h2>Wrap up</h2><div class="sub">Step 3 of 3 · winner, MVP, points</div></div><button class="btn sm" data-act="mback">Back to the game</button></div>'+
    '<div class="f" style="margin-top:12px"><span>Who won?</span><div class="row"><button type="button" class="chip '+(w==='town'?'on':'')+'" data-act="m-win" data-v="town">Town won'+(auto==='town'?' (suggested)':'')+'</button><button type="button" class="chip '+(w==='mafia'?'on':'')+'" data-act="m-win" data-v="mafia">Mafia won'+(auto==='mafia'?' (suggested)':'')+'</button></div></div></div>';
  h+='<div class="card"><h3>'+ico('crown')+' MVP vote</h3><div class="hint">Ask the room who was the MVP and tap + for each vote. The top name is picked for you. Tap MVP to choose someone else.</div><div class="stack" style="margin-top:10px">'+M.players.map(function(pl){
    var p=P(pl.id);if(!p)return '';var v=M.votes[pl.id]||0,top=mvp===pl.id;
    return '<div class="vrow '+(top?'top':'')+'">'+av(p,36)+'<div style="min-width:0"><div class="nm" style="font-weight:600">'+esc(p.name)+(top?' <span class="bdg">'+ico('crown')+'MVP</span>':'')+'</div></div><div class="row" style="flex-wrap:nowrap"><div class="stepper"><button type="button" class="ibtn" data-act="m-vote" data-id="'+pl.id+'" data-d="-1" aria-label="Remove a vote for '+esc(p.name)+'">−</button><b style="min-width:22px;text-align:center">'+v+'</b><button type="button" class="ibtn" data-act="m-vote" data-id="'+pl.id+'" data-d="1" aria-label="Add a vote for '+esc(p.name)+'">+</button></div><button type="button" class="chip '+(top?'on':'')+'" data-act="m-mvp" data-id="'+pl.id+'" aria-pressed="'+top+'">MVP</button></div></div>'}).join('')+'</div></div>';
  var sides=mSides(M);
  h+='<div class="card"><h3>Feathers from this game</h3><div class="pts" style="margin-top:10px">'+(w?sides.map(function(pl){return esc(nm(pl.id))+' <b>+'+mPts(pl,w,mvp)+'</b>'}).join(' · '):'Pick the winner to see the feathers.')+'</div></div>';
  h+='<div class="row"><button class="btn primary" data-act="msave" '+(w?'':'disabled')+'>'+ico('check')+'Save game and show feathers</button></div>';
  return h;
}

/* ---------- share ---------- */
function standingsText(){
  var T=totals(),r=ranked(T,'all'),t='Flamigos · '+S.title+'\nThe Flock Board\n\n';
  if(!r.length||r[0].v===0)return t+'No scores yet.';
  r.filter(function(x){return x.v>0}).forEach(function(x){t+=x.rank+'. '+x.p.name+' — '+x.v+' feathers\n'});
  var tr=teamRanks();if(tr.length&&tr[0].v>0){t+='\nTrivia teams\n';tr.forEach(function(x){t+=x.rank+'. '+x.t.name+' — '+x.v+'\n'})}
  return t.trim();
}
function liveLink(){var b=location.href.split('#')[0];return b+'#live'}
function strip(a){return JSON.parse(JSON.stringify(a||[],function(k,v){return k==='img'?undefined:v}))}
function exportCode(){return JSON.stringify({v:2,from:WHO||'',title:S.title,admins:S.admins,people:S.people,tables:strip(S.tables),teams:S.teams,roles:S.roles,logs:strip(S.logs),rules:S.rules,phases:S.phases,feed:S.feed,mafia:S.mafia?strip([S.mafia])[0]:null})}
function importCode(raw,mode){
  var o;try{o=JSON.parse(String(raw||'').trim())}catch(e){toast('That code is not valid. Copy it again from the other device.');return}
  if(!o||o.v!==2||!Array.isArray(o.people)){toast('That code is not from this app.');return}
  var imgs={};S.tables.forEach(function(t){if(t.img)imgs[t.id]=t.img});S.logs.forEach(function(l){if(l.img)imgs[l.id]=l.img});if(S.mafia&&S.mafia.img)imgs[S.mafia.id]=S.mafia.img;
  if(mode==='replace'){
    S.title=o.title||S.title;S.admins=o.admins||S.admins;S.people=o.people;S.tables=o.tables||[];S.teams=o.teams||[];S.roles=o.roles||S.roles;S.logs=o.logs||[];S.rules=o.rules||S.rules;S.phases=o.phases||S.phases;S.feed=o.feed||[];S.mafia=o.mafia||null;S.snap={};
    S.tables.concat(S.logs,S.mafia?[S.mafia]:[]).forEach(function(x){if(imgs[x.id]&&!x.img)x.img=imgs[x.id]});
    norm(S);persist();render();toast('This device now matches the code.');return;
  }
  var added=0,add=function(src,key,count){var have={};S[key].forEach(function(x){have[x.id]=1});(src||[]).forEach(function(x){if(!have[x.id]){S[key].push(x);have[x.id]=1;if(count)added++}})};
  add(o.people,'people');add(o.tables,'tables');add(o.teams,'teams');add(o.roles,'roles');add(o.logs,'logs',true);add(o.feed,'feed');
  S.feed.sort(function(a,b){return a.ts-b.ts});S.feed=S.feed.slice(-40);
  persist();render();toast(added?added+' new result'+(added>1?'s':'')+' added.':'Nothing new in that code.');
}
function shareView(){
  var link=liveLink();
  var h='<div class="sgrid"><div class="card"><h2>Live link</h2><div class="sub">Anyone with this link watches the board update as you log. Viewers see the board only.</div>'+
    '<div class="linkbox"><input id="lnk" type="text" readonly value="'+esc(link)+'" aria-label="Live link"><button class="btn primary" data-act="copy" data-t="lnk">'+ico('copy')+'Copy</button></div>'+
    '<div class="row" style="margin-top:12px"><a class="btn" href="#live">'+ico('screen')+'Open as a viewer</a><button class="btn" data-act="bigscreen">'+ico('screen')+'Laptop screen mode</button></div>'+
    '<div class="qr"><div class="q" id="qr"></div><div class="hint">Scan to open the live board</div></div></div>'+
    '<div class="card"><div class="row between"><div><h2>Preview</h2><div class="sub">The same board, sized for each screen.</div></div><div class="devbar" style="margin:0"><button class="chip '+(UI.preview==='phone'?'on':'')+'" data-act="dev" data-v="phone">Phone</button><button class="chip '+(UI.preview==='desk'?'on':'')+'" data-act="dev" data-v="desk">Laptop</button></div></div>'+
    '<div class="devframe '+UI.preview+'" id="devframe" style="margin-top:12px"><div class="vp" id="vp">'+boardHTML('live')+'</div></div></div>'+
    '<div class="card"><h2>Hosts</h2><div class="sub">'+(isServer()?'Hosts sign in with their own PIN. Their name appears next to what they log.':'Each host picks their name on their own device. Their name appears next to what they log.')+'</div><div class="row" style="margin-top:10px">'+S.admins.map(function(n){return '<span class="hold" style="font-size:14px"><span class="ini'+whoCls(n)+'" style="width:28px;height:28px;font-size:13px">'+whoInitial(n)+'</span>'+esc(n)+(n===WHO?' (you)':'')+'</span>'}).join('')+'</div>'+
    (isServer()?'':'<form id="addadmin" class="addrow" style="margin-top:12px"><label class="sr" for="adm-name2">Add a host</label><input id="adm-name2" type="text" placeholder="Add a host" maxlength="30" autocomplete="off"><button class="btn" type="submit">'+ico('plus')+'Add</button></form>')+'</div>'+
    '<div class="card"><h2>Post the standings</h2><div class="sub">Copy the ranking and paste it into WhatsApp or Instagram.</div><textarea class="stdtext" id="std" readonly style="margin-top:10px">'+esc(standingsText())+'</textarea><div class="row" style="margin-top:10px"><button class="btn primary" data-act="copy" data-t="std">'+ico('copy')+'Copy standings</button></div></div>'+
    (isServer()?'<div class="card wide"><h2>Live sync</h2><div class="sub">Every host\'s phone, the laptop board and every viewer share one live scoreboard. Changes show up within a few seconds. If your connection drops, results are kept on this device and sent when it returns.</div></div>':
'<div class="card wide"><h2>Log from another device</h2><div class="sub">Phones and laptops do not talk to each other yet. Until the full app, move results by code: copy this device\'s code, paste it on the other device, then add new results or replace. Photos stay on the device that added them.</div>'+
    '<div class="sgrid" style="margin-top:12px"><div class="f"><span>This device\'s code</span><textarea class="syncbox" id="syncout" readonly>'+esc(exportCode())+'</textarea><div class="row"><button class="btn primary sm" data-act="copy" data-t="syncout">'+ico('copy')+'Copy code</button></div></div>'+
    '<div class="f"><span>Code from another device</span><textarea class="syncbox" id="syncin" placeholder="Paste a code here"></textarea><div class="row"><button class="btn sm primary" data-act="sync-add">Add new results</button>'+(UI.confirm==='sync-rep'?'<button class="btn danger sm" data-act="sync-rep-yes">Yes, replace this device</button><button class="btn sm" data-act="confirm-no">Keep</button>':'<button class="btn sm" data-act="sync-rep">Replace this device</button>')+'</div></div></div></div>')+
    '<div class="card"><h2>Settings</h2><div class="stack" style="margin-top:10px"><div class="tgl"><div><b>Feather celebrations</b><div class="hint">A short shower when a result is saved or the lead changes.</div></div><button class="switch" role="switch" aria-checked="'+S.celebrate+'" aria-label="Feather celebrations" data-act="celebrate"></button></div>'+
    '<div class="row"><button class="btn sm" data-act="theme">'+ico('sun')+'Change the look</button><button class="btn sm" data-act="test">'+ico('feather')+'Test a shower</button>'+(UI.confirm==='clearscores'?'<button class="btn danger sm" data-act="clearscores-yes">Yes, clear all scores</button><button class="btn sm" data-act="confirm-no">Keep</button>':'<button class="btn sm" data-act="clearscores">Clear all scores, keep names</button>')+'</div></div></div>'+
    ''+(isServer()?'':'<div class="note wide">Local mode: this site has no server behind it, so everything stays in this browser. Deploy it with the Cloudflare Pages Functions in the README for live sync across devices and PIN sign-in.</div>')+'</div>';
  return h;
}

/* ---------- shells ---------- */
function hostView(){
  var dock=(UI.tab==='people'||UI.tab==='games');
  var body=UI.tab==='people'?peopleView():UI.tab==='games'?gamesView():UI.tab==='board'?'<div class="card" style="padding:16px">'+boardHTML('host')+'</div>':shareView();
  return '<div class="shell"><header class="top"><div class="brand"><span class="mark">'+ico('feather')+'</span><div>Flamigos<small>Host desk</small></div></div>'+
    '<label class="sr" for="mtitle">Meetup title</label><input id="mtitle" class="title-in" type="text" value="'+esc(S.title)+'" data-in="title" maxlength="60"><nav class="tabs" aria-label="Sections">'+tabsHTML('top')+'</nav>'+
    '<div class="tools">'+syncChip()+'<button class="ibtn" data-act="theme" aria-label="Change the look">'+ico('sun')+'</button><button class="whochip" data-act="whosheet" aria-label="Logging as '+esc(WHO)+(isServer()?'. Sign out':'. Switch host')+'"><span class="ini'+whoCls(WHO)+'">'+whoInitial(WHO)+'</span><span style="text-align:left"><small>Logging as</small>'+esc(WHO)+'</span>'+ico(isServer()?'chev':'swap')+'</button></div></header>'+
    '<main class="stage '+(dock?'has-dock':'')+'"><section class="main">'+body+'</section>'+(dock?'<aside class="dock" aria-label="Live board preview"><div class="card" style="padding:16px">'+boardHTML('dock')+'<div class="row" style="margin-top:12px"><a class="btn sm" href="#board">Full board</a><a class="btn sm" href="#share">Share</a></div></div></aside>':'')+'</main>'+
    '<nav class="tabbar" aria-label="Sections">'+tabsHTML('bar')+'</nav></div>';
}
function liveView(){
  return '<div class="live"><button class="btn sm tvexit" data-act="tvexit">'+ico('x')+'Exit</button><header class="livetop"><div class="brand"><span class="mark">'+ico('feather')+'</span><div><div style="font-size:14px;color:var(--muted);font-family:var(--body);font-weight:600">Flamigos</div><h1>'+esc(S.title)+'</h1></div></div>'+
    '<div class="acts">'+syncChip()+'<button class="ibtn" data-act="theme" aria-label="Change the look">'+ico('sun')+'</button><button class="btn" data-act="bigscreen">'+ico('screen')+'Laptop screen mode</button></div></header>'+boardHTML('live')+
    '<div class="livefoot">Updates live as the hosts log. <a href="#people">Host desk</a></div></div>';
}

/* ===== app_a.js ===== */

/* ---------- sheets ---------- */
function frame(title,body,foot){
  return '<div class="sheet-back" data-act="sheet-bg"><div class="sheet" role="dialog" aria-modal="true" aria-label="'+esc(title)+'"><div class="sh"><h2>'+esc(title)+'</h2><button class="ibtn" data-act="sheet-close" aria-label="Close">'+ico('x')+'</button></div><div class="sb">'+body+'</div><div class="sf">'+foot+'</div></div></div>';
}
function foot(save,label,dis){return '<button class="btn" data-act="sheet-close">Cancel</button>'+(save?'<button class="btn primary" data-act="'+save+'" '+(dis?'disabled':'')+'>'+ico('check')+label+'</button>':'')}
function pchips(sel,act,showOrd,pool){
  return '<div class="pchips">'+(pool||S.people.map(function(p){return p.id})).map(function(id){var p=P(id);if(!p)return '';var i=sel.indexOf(id);
    return '<button type="button" class="pchip '+(i>=0?'on':'')+'" data-act="'+act+'" data-id="'+id+'" aria-pressed="'+(i>=0)+'">'+av(p,30)+'<b>'+esc(p.name)+'</b>'+(i>=0&&showOrd?'<i>'+ordw(i+1)+'</i>':'')+'</button>'}).join('')+'</div>';
}
function cardsPreview(ED){
  var pool=ED.players||[];
  if(!ED.order.length)return 'Tap players in the order they finished. The first tap is the winner. Everyone you do not tap counts as lost.';
  var lost=pool.filter(function(id){return ED.order.indexOf(id)<0});
  return '<b>Feathers:</b> '+ED.order.map(function(id,i){return esc(nm(id))+' +'+placePts(i)}).join(' · ')+(lost.length?'<br><b>Lost (+'+S.rules.rest+' each):</b> '+esc(lost.map(nm).join(', ')):'');
}
var GAMES=['Uno','Bluff','Rummy','Teen Patti','Hearts','Exploding Kittens','Monopoly Deal'];
var SHEETS={
  bonus:function(ED){
    var aw=[['Best sport',3],['Best bluff',3],['Teacher\'s pet',3],['Funniest',3],['Brought snacks',2]];
    return frame(ED.id?'Edit bonus':'Give bonus feathers',
      '<div class="f"><span>Who gets it?</span><div class="pchips">'+S.people.map(function(p){return '<button type="button" class="pchip '+(ED.pid===p.id?'on':'')+'" data-act="b-pick" data-id="'+p.id+'" aria-pressed="'+(ED.pid===p.id)+'">'+av(p,30)+'<b>'+esc(p.name)+'</b></button>'}).join('')+'</div></div>'+
      '<div class="f"><span>For what?</span><div class="sugg">'+aw.map(function(a){return '<button type="button" class="chip '+(ED.title===a[0]?'on':'')+'" data-act="b-aw" data-t="'+esc(a[0])+'" data-n="'+a[1]+'">'+esc(a[0])+'</button>'}).join('')+'</div></div>'+
      '<div class="f"><label for="ed-title"><span>Or write your own</span></label><input id="ed-title" data-in="ed" data-k="title" value="'+esc(ED.title)+'" placeholder="Best table talk"></div>'+
      '<div class="f"><span>Feathers</span><div class="stepper"><button type="button" class="ibtn" data-act="b-n" data-d="-1" aria-label="Fewer">−</button><input type="number" data-in="ed" data-k="pts" data-num="1" value="'+ED.pts+'" aria-label="Feathers"><button type="button" class="ibtn" data-act="b-n" data-d="1" aria-label="More">+</button></div></div>',
      foot('save-bonus','Give feathers',!ED.pid||!ED.pts));
  },
  teams:function(){
    var assigned={};S.teams.forEach(function(t){(t.members||[]).forEach(function(id){assigned[id]=1})});
    var free=S.people.filter(function(p){return !assigned[p.id]});
    if(!UI.pop.team||!S.teams.some(function(t){return t.id===UI.pop.team}))UI.pop.team=S.teams[0]?S.teams[0].id:null;
    var n=UI.pop.n||Math.max(2,Math.min(6,Math.round(S.people.length/3))||2);UI.pop.n=n;
    var body='<div class="f"><span>Shuffle everyone into teams</span><div class="row"><div class="stepper"><button type="button" class="ibtn" data-act="t-n" data-d="-1" aria-label="Fewer teams">−</button><input type="number" id="t-n" value="'+n+'" data-in="tn" aria-label="Number of teams"><button type="button" class="ibtn" data-act="t-n" data-d="1" aria-label="More teams">+</button></div>'+
      '<button type="button" class="btn primary" data-act="t-shuffle" '+(S.people.length<2?'disabled':'')+'>'+ico('dice')+'Shuffle into '+n+' teams</button></div><div class="hint">'+(S.people.length?'About '+(S.people.length/n).toFixed(1).replace('.0','')+' people per team. You can move people by hand after.':'Add names first.')+'</div></div>';
    body+='<div class="f"><span>Not on a team yet ('+free.length+')</span>'+(free.length?'<div class="pchips">'+free.map(function(p){return '<button type="button" class="pchip" data-act="t-add" data-id="'+p.id+'">'+av(p,28)+'<b>'+esc(p.name)+'</b></button>'}).join('')+'</div><div class="hint">Tap a name to add them to the highlighted team.</div>':'<div class="hint">Everyone is on a team.</div>')+'</div>';
    body+='<div class="f"><span>Teams</span><div class="stack">'+S.teams.map(function(t){var on=UI.pop.team===t.id;
      return '<div class="team" style="'+(on?'border-color:var(--brand)':'')+'"><div class="th"><button type="button" class="chip '+(on?'on':'')+'" data-act="t-sel" data-id="'+t.id+'">'+(on?'Adding to this team':'Select')+'</button><button type="button" class="ibtn" data-act="t-del" data-id="'+t.id+'" aria-label="Delete '+esc(t.name)+'">'+ico('trash')+'</button></div>'+
      '<input type="text" data-in="tname" data-id="'+t.id+'" value="'+esc(t.name)+'" aria-label="Team name" maxlength="40"><div class="pchips">'+((t.members||[]).map(function(id){var p=P(id);return p?'<button type="button" class="pchip on" data-act="t-rm" data-id="'+id+'" data-tid="'+t.id+'" aria-label="Remove '+esc(p.name)+' from team">'+av(p,26)+'<b>'+esc(p.name)+'</b>'+ico('x')+'</button>':''}).join('')||'<span class="hint">No members yet</span>')+'</div></div>'}).join('')+
      '<button type="button" class="btn" data-act="t-new">'+ico('plus')+'Add a team</button></div></div>';
    return frame('Trivia teams',body,'<button class="btn primary" data-act="sheet-close">'+ico('check')+'Done</button>');
  },
  avatar:function(ED){
    var p=P(ED.id);if(!p)return '';var a=p.av;
    function opts(list,key,ex){return '<div class="optgrid">'+list.map(function(o){var on=a[key]===o[0];return '<button type="button" class="opt '+(on?'on':'')+'" data-act="av-set" data-k="'+key+'" data-v="'+o[0]+'" aria-pressed="'+on+'" aria-label="'+o[1]+'">'+(ex?av(Object.assign({},a,(function(){var q={};q[key]=o[0];return q})()),44):'')+'<span>'+o[1]+'</span></button>'}).join('')+'</div>'}
    function txt(list,key){return '<div class="sugg">'+list.map(function(o){var on=a[key]===o[0];return '<button type="button" class="chip '+(on?'on':'')+'" data-act="av-set" data-k="'+key+'" data-v="'+o[0]+'" aria-pressed="'+on+'">'+o[1]+'</button>'}).join('')+'</div>'}
    function sw(cols,key){return '<div class="sw">'+cols.map(function(c,i){var col=Array.isArray(c)?c[1]:c;var on=a[key]===i;return '<button type="button" class="'+(on?'on':'')+'" style="background:'+col+'" data-act="av-set" data-k="'+key+'" data-v="'+i+'" data-num="1" aria-pressed="'+on+'" aria-label="'+(Array.isArray(c)?c[0]:'Option '+(i+1))+'"></button>'}).join('')+'</div>'}
    var body='<div class="avprev">'+av(p,120)+'<div class="row"><button type="button" class="btn sm" data-act="av-rand" data-v="guy">'+ico('dice')+'Guy</button><button type="button" class="btn sm" data-act="av-rand" data-v="girl">'+ico('dice')+'Girl</button><button type="button" class="btn sm" data-act="av-rand" data-v="neutral">'+ico('dice')+'Neutral</button></div><div class="hint">Quick looks, then fine-tune below.</div></div>'+
      '<div class="f"><label for="av-name"><span>Name</span></label><input id="av-name" data-in="pname" data-id="'+p.id+'" value="'+esc(p.name)+'" maxlength="40"></div>'+
      '<div class="f"><span>Skin</span>'+sw(SKIN,'skin')+'</div>'+
      '<div class="f"><span>Hair</span>'+opts(HAIRS,'hair',true)+'</div>'+
      '<div class="f"><span>Hair colour</span>'+sw(HAIRC,'hairc')+'</div>'+
      '<div class="f"><span>Facial hair</span>'+opts(FH,'fh',true)+'</div>'+
      '<div class="f"><span>Eyes</span>'+txt(EYES,'eyes')+'</div>'+
      '<div class="f"><span>Mouth</span>'+txt(MOUTHS,'mouth')+'</div>'+
      '<div class="f"><span>Glasses</span>'+opts(GLASS,'glasses',true)+'</div>'+
      '<div class="f"><span>Headwear</span>'+opts(HEAD,'head',true)+'</div>'+
      '<div class="f"><span>Face extras</span><div class="sugg">'+EXTRAS.map(function(o){var on=(a.extras||[]).indexOf(o[0])>=0;return '<button type="button" class="chip '+(on?'on':'')+'" data-act="av-extra" data-v="'+o[0]+'" aria-pressed="'+on+'">'+o[1]+'</button>'}).join('')+'</div></div>'+
      '<div class="f"><span>Top colour</span>'+sw(TOPC,'top')+'</div>'+
      '<div class="f"><span>Background</span>'+sw(BGC,'bg')+'</div>';
    return frame('Make a face',body,'<button class="btn primary" data-act="sheet-close">'+ico('check')+'Done</button>');
  }

};
SHEETS.table=function(ED){
  var seated={};S.tables.forEach(function(t){if(t.id!==ED.id)(t.players||[]).forEach(function(id){seated[id]=t.name})});
  return frame(ED.id?'Edit table':'New table',
    '<div class="f"><label for="ed-name"><span>Table name</span></label><input id="ed-name" type="text" data-in="ed" data-k="name" value="'+esc(ED.name)+'" maxlength="40" data-autofocus></div>'+
    '<div class="f"><label for="ed-game"><span>Game being played</span></label><input id="ed-game" type="text" data-in="ed" data-k="game" value="'+esc(ED.game)+'" placeholder="Uno, Bluff, Rummy" maxlength="40"></div>'+
    '<div class="sugg">'+GAMES.map(function(g){return '<button type="button" class="chip '+(ED.game===g?'on':'')+'" data-act="ed-set" data-k="game" data-v="'+esc(g)+'">'+esc(g)+'</button>'}).join('')+'</div>'+
    imgField('sheet',ED.img,'Game photo (optional)')+
    '<div class="f"><span>Who is seated here? ('+ED.players.length+')</span><div class="pchips">'+S.people.map(function(p){var on=ED.players.indexOf(p.id)>=0,at=seated[p.id];
      return '<button type="button" class="pchip '+(on?'on':'')+(at?' dis':'')+'" data-act="tb-pick" data-id="'+p.id+'" aria-pressed="'+on+'" '+(at?'disabled':'')+'>'+av(p,30)+'<b>'+esc(p.name)+'</b>'+(at?'<small>at '+esc(at)+'</small>':'')+'</button>'}).join('')+'</div><div class="hint">Each person sits at one table at a time. Move someone by removing them from their old table first.</div></div>',
    foot('save-table','Save table',!(ED.name||'').trim()));
};
SHEETS.cardres=function(ED){
  var t=TB(ED.tableId);
  return frame(ED.id?'Edit result':'Log result'+(t?' · '+t.name:''),
    '<div class="f"><label for="ed-title"><span>Game</span></label><input id="ed-title" type="text" data-in="ed" data-k="title" value="'+esc(ED.title)+'" placeholder="Uno, Bluff, Rummy" data-autofocus></div>'+
    '<div class="sugg">'+GAMES.map(function(g){return '<button type="button" class="chip '+(ED.title===g?'on':'')+'" data-act="ed-set" data-k="title" data-v="'+esc(g)+'">'+esc(g)+'</button>'}).join('')+'</div>'+
    '<div class="f"><span>Tap players in finishing order</span>'+pchips(ED.order,'ed-order',true,ED.players)+'</div><div class="pts">'+cardsPreview(ED)+'</div>',
    foot('save-cards','Save result',!ED.order.length));
};
SHEETS.round=function(ED){
  var body='';
  if(!S.teams.length)body='<div class="empty"><h3>No teams yet</h3><p class="muted">Make the teams first.</p><button class="btn primary" data-act="teams">'+ico('users')+'Make teams</button></div>';
  else body='<div class="f"><label for="ed-title"><span>Round name</span></label><input id="ed-title" type="text" data-in="ed" data-k="title" value="'+esc(ED.title)+'" data-autofocus></div>'+
    imgField('sheet',ED.img,'Round photo (optional)')+
    '<div class="f"><span>Points this round</span><div class="stack">'+S.teams.map(function(t){var v=ED.scores[t.id]||0;
      return '<div class="srow"><div class="row" style="flex-wrap:nowrap;min-width:0">'+stackAv((t.members||[]).slice(0,3),28)+'<b style="overflow:hidden;text-overflow:ellipsis">'+esc(t.name)+'</b></div>'+
      '<div class="stepper"><button type="button" class="ibtn" data-act="score" data-id="'+t.id+'" data-d="-1" aria-label="Minus one for '+esc(t.name)+'">−</button><input type="number" data-in="score" data-id="'+t.id+'" value="'+v+'" aria-label="Points for '+esc(t.name)+'"><button type="button" class="ibtn" data-act="score" data-id="'+t.id+'" data-d="1" aria-label="Plus one for '+esc(t.name)+'">+</button></div></div>'}).join('')+'</div></div>';
  return frame(ED.id?'Edit round':'Log a trivia round',body,foot(S.teams.length?'save-round':'','Save round'));
};
SHEETS.who=function(){
  if(isServer())return frame('Signed in','<div class="whobtn" style="cursor:default"><span class="ini'+whoCls(WHO)+'">'+whoInitial(WHO)+'</span>'+esc(WHO)+'</div><p class="hint">Signing out keeps everything on the server. You can sign back in with your PIN.</p>','<button class="btn" data-act="sheet-close">Stay</button><button class="btn primary" data-act="signout">Sign out</button>');
  return frame('Switch host','<div class="who">'+S.admins.map(function(n){return '<button class="whobtn" data-act="who" data-n="'+esc(n)+'"><span class="ini'+whoCls(n)+'">'+whoInitial(n)+'</span>'+esc(n)+(n===WHO?' <span class="hint">(you)</span>':'')+'</button>'}).join('')+'</div>'+
    '<form id="addadmin" class="addrow"><label class="sr" for="adm-name3">Add a host</label><input id="adm-name3" type="text" placeholder="Add a host" maxlength="30" autocomplete="off"><button class="btn" type="submit">'+ico('plus')+'Add</button></form>'+
    '<p class="hint">A name pick for this device, not a password.</p>','<button class="btn primary" data-act="sheet-close">Done</button>');
};
SHEETS.roles=function(){
  var body='<div class="hint">Khufia Mafia roles. The line is what you read out at night. Leave it empty for roles that do not wake up.</div>'+S.roles.map(function(r){
    return '<div class="rolerow"><div class="row" style="flex-wrap:nowrap"><input type="text" data-in="rname" data-id="'+r.id+'" value="'+esc(r.name)+'" aria-label="Role name" maxlength="30"><button type="button" class="ibtn" data-act="rs-del" data-id="'+r.id+'" aria-label="Delete '+esc(r.name)+'" '+(S.roles.length<2?'disabled':'')+'>'+ico('trash')+'</button></div>'+
      '<div class="row"><button type="button" class="chip '+(r.side==='town'?'on':'')+'" data-act="rs-side" data-id="'+r.id+'" data-v="town">Town side</button><button type="button" class="chip '+(r.side==='mafia'?'on':'')+'" data-act="rs-side" data-id="'+r.id+'" data-v="mafia">Mafia side</button><button type="button" class="chip '+(r.fill?'on':'')+'" data-act="rs-fill" data-id="'+r.id+'" aria-pressed="'+(!!r.fill)+'">Everyone else</button></div>'+
      '<textarea rows="2" data-in="rline" data-id="'+r.id+'" aria-label="Announce line for '+esc(r.name)+'" placeholder="What you say when this role wakes up">'+esc(r.line||'')+'</textarea></div>'}).join('')+
    '<div class="row"><button type="button" class="btn" data-act="rs-add">'+ico('plus')+'Add a role</button><button type="button" class="btn sm" data-act="rs-reset">Reset to the four defaults</button></div>';
  return frame('Mafia roles',body,'<button class="btn primary" data-act="sheet-close">'+ico('check')+'Done</button>');
};
SHEETS.mafedit=function(ED){
  var pl=(ED.players||[]).map(function(p){return p.id});
  return frame('Edit mafia result',
    '<div class="f"><label for="ed-title"><span>Game name</span></label><input id="ed-title" type="text" data-in="ed" data-k="title" value="'+esc(ED.title)+'"></div>'+
    '<div class="f"><span>Who won?</span><div class="row"><button type="button" class="chip '+(ED.winner==='town'?'on':'')+'" data-act="me-win" data-v="town">Town won</button><button type="button" class="chip '+(ED.winner==='mafia'?'on':'')+'" data-act="me-win" data-v="mafia">Mafia won</button></div></div>'+
    '<div class="f"><span>MVP</span><div class="pchips"><button type="button" class="pchip '+(!ED.mvp?'on':'')+'" data-act="me-mvp" data-id=""><b>No MVP</b></button>'+pl.map(function(id){var p=P(id);return p?'<button type="button" class="pchip '+(ED.mvp===id?'on':'')+'" data-act="me-mvp" data-id="'+id+'" aria-pressed="'+(ED.mvp===id)+'">'+av(p,30)+'<b>'+esc(p.name)+'</b></button>':''}).join('')+'</div></div>',
    foot('save-mafedit','Save changes'));
};
function renderSheet(first){
  var root=$('#sheet-root');if(!UI.sheet){root.innerHTML='';document.body.classList.remove('lock');return}
  var old=$('.sb',root),st=old?old.scrollTop:0;
  root.innerHTML=SHEETS[UI.sheet.kind](UI.sheet.ED);
  document.body.classList.add('lock');
  var nb=$('.sb',root);if(nb)nb.scrollTop=st;
  if(first){var f=$('[data-autofocus]',root);if(f){try{f.focus({preventScroll:true})}catch(e){}}}
}
function openSheet(kind,ED){UI.sheet={kind:kind,ED:ED||{}};renderSheet(true)}
function closeSheet(){UI.sheet=null;renderSheet()}

/* ---------- helpers for actions ---------- */
function cancelBtn(cls){
  return UI.confirm==='mcancel'?'<button class="btn danger '+cls+'" data-act="mcancel-yes">Yes, cancel game</button><button class="btn '+cls+'" data-act="confirm-no">Keep</button>':'<button class="btn '+cls+'" data-act="mcancel">Cancel game</button>';
}
function addNames(raw){
  var parts=String(raw||'').split(/[,\n;]+/).map(function(s){return s.trim().replace(/\s+/g,' ')}).filter(Boolean);
  var have={};S.people.forEach(function(p){have[p.name.toLowerCase()]=1});
  var skipped=[],added=0;
  parts.forEach(function(n){n=n.slice(0,40);if(have[n.toLowerCase()]){skipped.push(n);return}have[n.toLowerCase()]=1;S.people.push({id:uid(),name:n,av:randAv()});added++});
  if(added)persist();
  render();
  var ta=$('#addname');if(ta)ta.focus();
  if(skipped.length)toast('Already in the flock: '+skipped.join(', ')+'. Add a last initial to tell them apart.');
  else if(added>1)toast(added+' added to the flock');
}
function addAdmin(raw){
  var n=String(raw||'').trim().replace(/\s+/g,' ').slice(0,30);if(!n)return;
  if(S.admins.some(function(a){return a.toLowerCase()===n.toLowerCase()})){toast(n+' is already a host');return}
  S.admins.push(n);persist();render();if(UI.sheet)renderSheet();toast(n+' added as a host');
}
function practice(){
  var names=['Kabir','Meher','Zoya','Neel','Isha','Dev','Tara','Veer'];
  S=fresh();S.title='Practice meetup';
  names.forEach(function(n,i){S.people.push({id:uid(),name:n,av:randAv(i%2?'girl':'guy')})});
  var id=function(n){return S.people.filter(function(p){return p.name===n})[0].id},ids=function(a){return a.map(id)};
  var ts=Date.now()-1000*60*50,by=['Rohan','Ronak','Rutuja'];
  var t1={id:uid(),name:'Table 1',game:'Uno',img:'',players:ids(['Kabir','Meher','Isha','Tara'])},t2={id:uid(),name:'Table 2',game:'Bluff',img:'',players:ids(['Zoya','Dev','Neel','Veer'])};
  S.tables=[t1,t2];
  var cg=function(t,title,order,dt,b){S.logs.push({id:uid(),phase:'cards',tableId:t.id,table:t.name,title:title,players:t.players.slice(),order:ids(order),by:b,ts:ts+60000*dt})};
  cg(t1,'Uno',['Meher','Kabir'],4,by[0]);cg(t2,'Bluff',['Zoya','Dev','Neel'],9,by[1]);cg(t1,'Uno',['Meher','Tara'],18,by[0]);cg(t2,'Rummy',['Veer','Zoya','Dev','Neel'],26,by[2]);
  var T=[['Quizzly Bears',['Kabir','Meher']],['Les Quizerables',['Zoya','Neel']],['Pun Intended',['Isha','Dev']],['Nacho Average Team',['Tara','Veer']]];
  S.teams=T.map(function(t){return {id:uid(),name:t[0],members:ids(t[1])}});
  var sc=function(a){var o={};S.teams.forEach(function(t,i){o[t.id]=a[i]});return o};
  S.logs.push({id:uid(),phase:'trivia',title:'Round 1: Movies',scores:sc([6,4,5,3]),by:by[1],ts:ts+60000*32});
  S.logs.push({id:uid(),phase:'trivia',title:'Round 2: Food',scores:sc([4,7,3,5]),by:by[1],ts:ts+60000*38});
  var rl=[['Dev','r-maf',false,'voted'],['Neel','r-vil',true,null],['Zoya','r-doc',true,null],['Isha','r-det',true,null],['Veer','r-maf',true,null],['Kabir','r-vil',false,'died']];
  S.logs.push({id:uid(),phase:'mafia',title:'Khufia Mafia 1',winner:'town',nights:3,mvp:id('Zoya'),first:id('Kabir'),by:by[0],ts:ts+60000*44,
    players:rl.map(function(a){var r=roleById(a[1]);return {id:id(a[0]),role:a[1],roleName:r.name,side:r.side,alive:a[2],out:a[3]}})});
  S.logs.push({id:uid(),phase:'bonus',title:'Best bluff',pid:id('Zoya'),pts:3,by:by[2],ts:ts+60000*46});
  S.phases.cards.start=ts;S.phases.cards.end=ts+60000*30;S.phases.trivia.start=ts+60000*31;S.phases.trivia.end=ts+60000*40;S.phases.mafia.start=ts+60000*41;S.phases.mafia.end=ts+60000*47;
  S.snap=rankMap(totals());
  S.feed.push({id:uid(),ts:Date.now()-60000*3,phase:'mafia',title:'Khufia Mafia 1 · Town won',by:by[0],deltas:[{id:id('Zoya'),d:13},{id:id('Neel'),d:10}],lead:null});
  persist();render();toast('Practice names and scores loaded. Clear everyone when you are ready for real names.');
}
function mp(id){return S.mafia&&S.mafia.players.filter(function(p){return p.id===id})[0]}
function pushEv(t,pid){S.mafia.events.push({id:uid(),t:t,n:S.mafia.n,ph:S.mafia.ph,pid:pid||null,ts:Date.now()})}
function setImg(t,u){if(t==='sheet'&&UI.sheet){UI.sheet.ED.img=u;renderSheet()}else if(t==='mafia'&&S.mafia){S.mafia.img=u;persist();render()}}
function bumpCleanup(id){
  S.people=S.people.filter(function(p){return p.id!==id});
  S.teams.forEach(function(t){t.members=(t.members||[]).filter(function(m){return m!==id})});
  S.tables.forEach(function(t){t.players=(t.players||[]).filter(function(m){return m!==id})});
  S.logs.forEach(function(l){if(l.order)l.order=l.order.filter(function(m){return m!==id});if(l.players)l.players=l.players.filter(function(m){return (m&&m.id!==undefined)?m.id!==id:m!==id});if(l.mvp===id)l.mvp=null;if(l.first===id)l.first=null});
  S.logs=S.logs.filter(function(l){return !(l.phase==='bonus'&&l.pid===id)});
  if(S.mafia){S.mafia.players=S.mafia.players.filter(function(p){return p.id!==id});if(S.mafia.mvp===id)S.mafia.mvp=null}
  S.awards.forEach(function(a){a.winners=(a.winners||[]).filter(function(w){return w!==id});if(a.votes)delete a.votes[id];if(a.pick===id)a.pick=null});
}

/* ===== app_b.js ===== */

/* ---------- actions ---------- */
var wl=null;
function wake(){try{if(navigator.wakeLock&&navigator.wakeLock.request){navigator.wakeLock.request('screen').then(function(l){wl=l;if(l.addEventListener)l.addEventListener('release',function(){wl=null})},function(){})}}catch(e){}}
function tvOff(){UI.tv=false;document.body.classList.remove('tv');if(wl){try{wl.release()}catch(e){}wl=null}}
function clearRun(){S.phases={cards:{mins:S.phases.cards.mins,start:null,end:null},trivia:{mins:S.phases.trivia.mins,start:null,end:null},mafia:{mins:S.phases.mafia.mins,start:null,end:null}}}
function delayedConfirm(key){UI.confirm=key;render();setTimeout(function(){if(UI.confirm===key){UI.confirm=null;render()}},3500)}
var ACT={
  nav:function(el){location.hash=el.dataset.v},
  phase:function(el){UI.phase=el.dataset.v;render()},
  filter:function(el){UI.filter=el.dataset.v;render()},
  who:function(el){setWho(el.dataset.n);UI.sheet=null;renderSheet();render();toast('Logging as '+el.dataset.n)},
  whosheet:function(){openSheet('who',{})},
  roles:function(){openSheet('roles',{})},
  practice:function(){practice()},
  clearall:function(){UI.confirm='clearall';render()},
  'clearall-yes':function(){S.people=[];S.logs=[];S.teams=[];S.tables=[];S.mafia=null;S.feed=[];S.snap={};S.awards=defaultAwards();clearRun();UI.confirm=null;persist();render();toast('Cleared. Start fresh.')},
  clearscores:function(){UI.confirm='clearscores';render()},
  'clearscores-yes':function(){S.logs=[];S.feed=[];S.snap={};S.mafia=null;S.awards.forEach(function(a){a.revealed=false;a.winners=[];a.votes={};a.pick=null});clearRun();UI.confirm=null;persist();render();toast('Scores cleared. Names, tables and teams kept.')},
  'confirm-no':function(){UI.confirm=null;render()},
  rm:function(el){delayedConfirm('rm-'+el.dataset.id)},
  'rm-yes':function(el){bumpCleanup(el.dataset.id);UI.confirm=null;persist();render()},
  dellog:function(el){delayedConfirm('dl-'+el.dataset.id)},
  'dellog-yes':function(el){var id=el.dataset.id,l=S.logs.filter(function(x){return x.id===id})[0];UI.confirm=null;
    mutate('',l?l.phase:'cards',function(){S.logs=S.logs.filter(function(x){return x.id!==id})},{silent:true})},
  newtable:function(){openSheet('table',{name:'Table '+(S.tables.length+1),game:'',img:'',players:[]})},
  edittable:function(el){var t=TB(el.dataset.id);if(t)openSheet('table',JSON.parse(JSON.stringify(t)))},
  deltable:function(el){delayedConfirm('dt-'+el.dataset.id)},
  'deltable-yes':function(el){S.tables=S.tables.filter(function(t){return t.id!==el.dataset.id});UI.confirm=null;persist();render()},
  cardres:function(el){var t=TB(el.dataset.id);if(!t)return;openSheet('cardres',{tableId:t.id,title:t.game||'',players:(t.players||[]).slice(),order:[]})},
  newround:function(){var n=S.logs.filter(function(l){return l.phase==='trivia'}).length+1;openSheet('round',{title:'Round '+n,scores:{},img:''})},
  newbonus:function(){openSheet('bonus',{title:'',pid:null,pts:3})},
  editlog:function(el){var l=S.logs.filter(function(x){return x.id===el.dataset.id})[0];if(!l)return;var c=JSON.parse(JSON.stringify(l));
    if(l.phase==='cards'){c.players=c.players&&c.players.length?c.players:c.order.slice();c.title=c.title||'';openSheet('cardres',c)}
    else if(l.phase==='trivia'){c.img=c.img||'';openSheet('round',c)}
    else if(l.phase==='mafia')openSheet('mafedit',c);
    else openSheet('bonus',c)},
  teams:function(){openSheet('teams',{})},
  avatar:function(el){openSheet('avatar',{id:el.dataset.id})},
  'sheet-close':function(){closeSheet()},
  'sheet-bg':function(el,e){if(e.target===el)closeSheet()},
  'ed-set':function(el){UI.sheet.ED[el.dataset.k]=el.dataset.v;renderSheet()},
  'ed-order':function(el){var o=UI.sheet.ED.order,i=o.indexOf(el.dataset.id);if(i>=0)o.splice(i,1);else o.push(el.dataset.id);renderSheet()},
  'tb-pick':function(el){var E=UI.sheet.ED,i=E.players.indexOf(el.dataset.id);if(i>=0)E.players.splice(i,1);else E.players.push(el.dataset.id);renderSheet()},
  'save-table':function(){var E=UI.sheet.ED;if(!(E.name||'').trim())return;
    var t={id:E.id||uid(),name:E.name.trim(),game:(E.game||'').trim(),img:E.img||'',players:E.players.slice()};
    var i=S.tables.findIndex(function(x){return x.id===t.id});if(i>=0)S.tables[i]=t;else S.tables.push(t);
    persist();closeSheet();render();toast(t.name+' saved')},
  'save-cards':function(){var E=UI.sheet.ED;if(!E.order.length)return;var t=TB(E.tableId);
    commitLog({id:E.id||uid(),phase:'cards',tableId:E.tableId,table:t?t.name:(E.table||''),title:(E.title||'').trim()||(t&&t.game)||'Card game',players:E.players.slice(),order:E.order.slice(),by:E.by,ts:E.ts||Date.now()},!!E.id);
    closeSheet()},
  score:function(el){var E=UI.sheet.ED,id=el.dataset.id;E.scores[id]=(Number(E.scores[id])||0)+Number(el.dataset.d);renderSheet()},
  'save-round':function(){var E=UI.sheet.ED,sc={};S.teams.forEach(function(t){sc[t.id]=Number(E.scores[t.id])||0});
    commitLog({id:E.id||uid(),phase:'trivia',title:(E.title||'').trim()||'Trivia round',img:E.img||'',scores:sc,by:E.by,ts:E.ts||Date.now()},!!E.id);closeSheet()},
  'b-pick':function(el){UI.sheet.ED.pid=el.dataset.id;renderSheet()},
  'b-aw':function(el){UI.sheet.ED.title=el.dataset.t;UI.sheet.ED.pts=Number(el.dataset.n);renderSheet()},
  'b-n':function(el){var E=UI.sheet.ED;E.pts=Math.max(0,(Number(E.pts)||0)+Number(el.dataset.d));renderSheet()},
  'save-bonus':function(){var E=UI.sheet.ED;if(!E.pid||!E.pts)return;commitLog({id:E.id||uid(),phase:'bonus',title:(E.title||'').trim()||'Bonus feathers',pid:E.pid,pts:Number(E.pts)||0,by:E.by,ts:E.ts||Date.now()},!!E.id);closeSheet()},
  't-n':function(el){UI.pop.n=Math.max(2,Math.min(12,(UI.pop.n||2)+Number(el.dataset.d)));renderSheet()},
  't-shuffle':function(){var n=Math.max(2,UI.pop.n||2),ids=shuffle(S.people.map(function(p){return p.id}));
    var names=shuffle(['Quizzly Bears','Les Quizerables','Pun Intended','Nacho Average Team','Trivia Newton-John','Brainy Bunch','Quiz Khalifa','Smarty Pants','Know-It-Owls','Fact Checkers','Wise Cracks','Mind Palace']);
    S.teams=[];for(var i=0;i<n;i++)S.teams.push({id:uid(),name:names[i%names.length],members:[]});
    ids.forEach(function(id,i){S.teams[i%n].members.push(id)});UI.pop.team=S.teams[0].id;persist();renderSheet();render()},
  't-sel':function(el){UI.pop.team=el.dataset.id;renderSheet()},
  't-add':function(el){var t=S.teams.filter(function(x){return x.id===UI.pop.team})[0];if(!t){toast('Add a team first');return}t.members=(t.members||[]).concat([el.dataset.id]);persist();renderSheet();render()},
  't-rm':function(el){var t=S.teams.filter(function(x){return x.id===el.dataset.tid})[0];t.members=t.members.filter(function(m){return m!==el.dataset.id});persist();renderSheet();render()},
  't-new':function(){var t={id:uid(),name:'Team '+(S.teams.length+1),members:[]};S.teams.push(t);UI.pop.team=t.id;persist();renderSheet();render()},
  't-del':function(el){S.teams=S.teams.filter(function(t){return t.id!==el.dataset.id});persist();renderSheet();render()},
  'av-set':function(el){var p=P(UI.sheet.ED.id),v=el.dataset.v;p.av[el.dataset.k]=el.dataset.num?Number(v):v;if(el.dataset.k==='hair'&&v==='scarf')p.av.head='none';persist();renderSheet();render()},
  'av-extra':function(el){var p=P(UI.sheet.ED.id),e=p.av.extras||[],i=e.indexOf(el.dataset.v);if(i>=0)e.splice(i,1);else e.push(el.dataset.v);p.av.extras=e;persist();renderSheet();render()},
  'av-rand':function(el){var p=P(UI.sheet.ED.id);p.av=randAv(el.dataset.v);persist();renderSheet();render()},
  /* schedule */
  'ph-start':function(el){var c=S.phases[el.dataset.ph];c.start=Date.now();c.end=null;persist();render();toast(PH[el.dataset.ph].name+' started')},
  'ph-end':function(el){var c=S.phases[el.dataset.ph];c.end=Date.now();persist();render();toast(PH[el.dataset.ph].name+' finished')},
  'ph-reopen':function(el){S.phases[el.dataset.ph].end=null;persist();render()},
  'ph-reset':function(el){var c=S.phases[el.dataset.ph];c.start=null;c.end=null;persist();render()},
  /* photos */
  'img-pick':function(el){var f=$('#file-'+el.dataset.t);if(f)f.click()},
  'img-clear':function(el){setImg(el.dataset.t,'')},
  /* mafia roles sheet */
  'rs-add':function(){S.roles.push({id:'r-'+uid(),name:'New role',side:'town',line:''});persist();renderSheet()},
  'rs-del':function(el){if(S.roles.length<2)return;S.roles=S.roles.filter(function(r){return r.id!==el.dataset.id});persist();renderSheet();render()},
  'rs-side':function(el){var r=roleById(el.dataset.id);if(r){r.side=el.dataset.v;persist();renderSheet();render()}},
  'rs-fill':function(el){S.roles.forEach(function(r){r.fill=false});var r=roleById(el.dataset.id);if(r)r.fill=true;persist();renderSheet();render()},
  'rs-reset':function(){S.roles=defaultRoles();persist();renderSheet();render()},
  /* mafia desk */
  mnew:function(){S.mafia=newMafia();persist();render()},
  mcancel:function(){UI.confirm='mcancel';render();setTimeout(function(){if(UI.confirm==='mcancel'){UI.confirm=null;render()}},4000)},
  'mcancel-yes':function(){S.mafia=null;UI.confirm=null;UI.hide=false;persist();render()},
  'm-pick':function(el){var M=S.mafia,id=el.dataset.id,i=M.players.findIndex(function(p){return p.id===id});if(i>=0)M.players.splice(i,1);else M.players.push({id:id,role:null,alive:true,out:null});persist();render()},
  'm-all':function(){var M=S.mafia;S.people.forEach(function(p){if(!M.players.some(function(x){return x.id===p.id}))M.players.push({id:p.id,role:null,alive:true,out:null})});persist();render()},
  'm-none':function(){S.mafia.players=[];persist();render()},
  'm-comp':function(el){var M=S.mafia,c=Object.assign({},compOf(M));c[el.dataset.id]=Math.max(0,(c[el.dataset.id]||0)+Number(el.dataset.d));M.comp=c;persist();render()},
  'm-deal':function(){var M=S.mafia,c=compOf(M),f=fillRole(),list=[];
    S.roles.forEach(function(r){if(f&&r.id===f.id)return;for(var i=0;i<(c[r.id]||0);i++)list.push(r.id)});
    var ids=shuffle(M.players.map(function(p){return p.id}));list=shuffle(list).slice(0,ids.length);
    while(list.length<ids.length)list.push(f.id);
    ids.forEach(function(id,i){var pl=mp(id);if(pl)pl.role=list[i]});persist();render();toast('Roles dealt. Check the list before you start.')},
  'm-clearroles':function(){S.mafia.players.forEach(function(p){p.role=null});persist();render()},
  mstart:function(){var M=S.mafia;M.step='play';M.ph='night';M.n=1;M.events=[];M.players.forEach(function(p){p.alive=true;p.out=null});pushEv('night');
    var c=S.phases.mafia;if(!c.start){c.start=Date.now();c.end=null}persist();render();window.scrollTo(0,0)},
  mnext:function(){var M=S.mafia;if(M.ph==='night'){M.ph='day';pushEv('day')}else{M.n++;M.ph='night';pushEv('night')}persist();render()},
  mdie:function(el){var pl=mp(el.dataset.id);if(!pl||!pl.alive)return;pl.alive=false;pl.out=el.dataset.how;pushEv(el.dataset.how,pl.id);persist();render()},
  mrev:function(el){var M=S.mafia,pl=mp(el.dataset.id);if(!pl)return;pl.alive=true;pl.out=null;M.events=M.events.filter(function(e){return !(e.pid===pl.id&&(e.t==='died'||e.t==='voted'))});persist();render()},
  'm-hide':function(){UI.hide=!UI.hide;render()},
  mfinish:function(){var M=S.mafia;M.step='finish';if(!M.winner)M.winner=mAuto(M);persist();render();window.scrollTo(0,0)},
  mback:function(){S.mafia.step='play';persist();render()},
  'm-win':function(el){S.mafia.winner=el.dataset.v;persist();render()},
  'm-vote':function(el){var M=S.mafia,id=el.dataset.id;M.votes[id]=Math.max(0,(M.votes[id]||0)+Number(el.dataset.d));persist();render()},
  'm-mvp':function(el){var M=S.mafia;M.mvp=(M.mvp===el.dataset.id)?null:el.dataset.id;persist();render()},
  msave:function(){var M=S.mafia,w=M.winner||mAuto(M);if(!w)return;
    var log={id:uid(),phase:'mafia',title:(M.title||'').trim()||'Khufia Mafia',img:M.img||'',winner:w,nights:M.n,mvp:M.mvp||autoMvp(M)||null,votes:M.votes,first:firstOut(M),players:mSides(M),events:M.events,by:WHO||'',ts:Date.now()};
    var c=S.phases.mafia;
    mutate(describe(log),'mafia',function(){S.logs.push(log);S.mafia=null;if(c.start&&!c.end)c.end=Date.now()});UI.hide=false;window.scrollTo(0,0)},
  'me-win':function(el){UI.sheet.ED.winner=el.dataset.v;renderSheet()},
  'me-mvp':function(el){UI.sheet.ED.mvp=el.dataset.id||null;renderSheet()},
  'save-mafedit':function(){var E=UI.sheet.ED;commitLog(E,true);closeSheet()},
  /* share */
  copy:function(el){var src=$('#'+el.dataset.t);if(!src)return;var text=src.value;
    var done=function(){toast('Copied')};
    var fb=function(){try{src.focus();src.select();document.execCommand('copy');done()}catch(e){toast('Press Ctrl+C to copy the selected text')}};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done,fb)}else fb()},
  'sync-add':function(){var t=$('#syncin');importCode(t&&t.value,'add')},
  'sync-rep':function(){UI.confirm='sync-rep';render()},
  'sync-rep-yes':function(){var t=$('#syncin'),v=t&&t.value;UI.confirm=null;importCode(v,'replace')},
  dev:function(el){UI.preview=el.dataset.v;render()},
  celebrate:function(){S.celebrate=!S.celebrate;persist();render()},
  test:function(){var was=S.celebrate;S.celebrate=true;shower(30);S.celebrate=was;if(reduced())toast('Reduced motion is on, so feathers stay put.')},
  bigscreen:function(){
    UI.tv=true;
    if(location.hash!=='#live')location.hash='live';else document.body.classList.add('tv');
    try{var r=document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();if(r&&r.catch)r.catch(function(){})}catch(e){}
    wake();
  },
  tvexit:function(){try{if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen()}catch(e){}tvOff();render()}
};
document.addEventListener('click',function(e){var el=e.target.closest('[data-act]');if(!el)return;var f=ACT[el.dataset.act];if(!f)return;if(el.tagName==='A')return;f(el,e)});
document.addEventListener('input',function(e){
  var el=e.target;if(!el.dataset||!el.dataset.in)return;var k=el.dataset.in;
  if(k==='ed'){UI.sheet.ED[el.dataset.k]=el.dataset.num?(Number(el.value)||0):el.value}
  else if(k==='score'){UI.sheet.ED.scores[el.dataset.id]=Number(el.value)||0}
  else if(k==='title'){S.title=el.value;persist()}
  else if(k==='pname'){var p=P(el.dataset.id);if(p){p.name=el.value;persist()}}
  else if(k==='tname'){var t=S.teams.filter(function(x){return x.id===el.dataset.id})[0];if(t){t.name=el.value;persist()}}
  else if(k==='tn'){UI.pop.n=Math.max(2,Math.min(12,Number(el.value)||2))}
  else if(k==='rule'){var n=Math.max(0,Number(el.value)||0);if(el.dataset.k==='place')S.rules.place[Number(el.dataset.i)]=n;else S.rules[el.dataset.k]=n;persist()}
  else if(k==='clockmins'){S.phases[el.dataset.ph].mins=Math.max(5,Number(el.value)||60);persist()}
  else if(k==='mtitle'){if(S.mafia){S.mafia.title=el.value;persist()}}
  else if(k==='mrole'){var pl=mp(el.dataset.id);if(pl){pl.role=el.value||null;persist();render()}}
  else if(k==='rname'){var r=roleById(el.dataset.id);if(r){r.name=el.value;persist()}}
  else if(k==='rline'){var r2=roleById(el.dataset.id);if(r2){r2.line=el.value;persist()}}
});
document.addEventListener('submit',function(e){
  if(e.target.id==='addform'){e.preventDefault();var ta=$('#addname');addNames(ta.value)}
  else if(e.target.id==='addadmin'){e.preventDefault();var inp=$('input',e.target);addAdmin(inp&&inp.value);if(inp)inp.value=''}
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&UI.sheet){closeSheet();return}
  if(e.key==='Enter'&&!e.shiftKey&&e.target.id==='addname'){e.preventDefault();addNames(e.target.value)}
});
document.addEventListener('change',function(e){var el=e.target;if(!el.dataset)return;
  if(el.dataset.in==='img'){var f=el.files&&el.files[0];if(f)readImg(f,function(u){finishImg(el.dataset.t,u)});try{el.value=''}catch(x){}return}
  if(el.dataset.in==='pname'){render();if(UI.sheet)renderSheet()}
  if(el.dataset.in==='tname'){render()}
});

/* ---------- render + routing ---------- */
function afterRender(){
  if(UI.tab==='share'&&!isLive()&&WHO){
    var q=$('#qr');
    if(q){var ok=false;if(window.QRCode){try{q.innerHTML='';new QRCode(q,{text:liveLink(),width:150,height:150,colorDark:'#2B1B22',colorLight:'#ffffff'});ok=true}catch(e){}}
      if(!ok&&q.parentNode&&q.parentNode.parentNode)q.parentNode.hidden=true}
    fitPreview();
  }
}
function fitPreview(){
  var fr=$('#devframe'),vp=$('#vp');if(!fr||!vp)return;
  var base=UI.preview==='phone'?390:1100,avail=fr.clientWidth-24,sc=Math.min(1,avail/base);
  vp.style.transform='scale('+sc+')';
  fr.style.height=(vp.offsetHeight*sc+24)+'px';
  fr.style.justifyContent=sc<1?'flex-start':'center';
}
function isLive(){return location.hash==='#live'}
function render(){
  var h=(location.hash||'#people').slice(1),live=h==='live';
  if(!live)UI.tab=['people','games','board','share'].indexOf(h)>=0?h:'people';
  document.body.classList.toggle('is-live',live);
  if(!live){tvOff()}
  else if(UI.tv)document.body.classList.add('tv');
  $('#app').innerHTML=live?liveView():(WHO?hostView():(isServer()?loginView():gateView()));
  afterRender();
  if(UI.sheet)renderSheet();
}
window.addEventListener('hashchange',function(){UI.confirm=null;window.scrollTo(0,0);render()});
window.addEventListener('resize',function(){fitPreview()});
document.addEventListener('fullscreenchange',function(){if(!document.fullscreenElement&&UI.tv){tvOff();render()}});
document.addEventListener('visibilitychange',function(){if(!document.hidden&&UI.tv&&!wl)wake()});
window.addEventListener('storage',function(e){
  if(isServer()||e.key!==KEY||!e.newValue)return;
  var old=S,nw;try{nw=JSON.parse(e.newValue)}catch(x){return}
  if(!nw||nw.v!==3)return;
  var seen={};(old.feed||[]).forEach(function(f){seen[f.id]=1});
  S=norm(nw);
  var fresh2=(S.feed||[]).filter(function(f){return !seen[f.id]});
  var ae=document.activeElement;var typing=ae&&(ae.tagName==='TEXTAREA'||ae.tagName==='INPUT'||ae.tagName==='SELECT')&&!UI.sheet;
  if(!typing)render();
  fresh2.forEach(function(f){react(f)});
});
setInterval(function(){$$('[data-clock]').forEach(function(el){el.textContent=clockText(el.dataset.clock)})},1000);
setInterval(function(){if(isLive()&&!UI.sheet)render()},30000);
/* laptop screen mode: if the board is taller than the screen, drift down slowly, pause, then return to the top */
var tvWait=60;
setInterval(function(){
  if(!UI.tv||!isLive()||reduced())return;
  var max=document.documentElement.scrollHeight-window.innerHeight;if(max<8)return;
  if(tvWait>0){tvWait--;return}
  if(window.scrollY>=max-1){tvWait=80;window.scrollTo(0,0);return}
  window.scrollBy(0,1);
},50);

/* ===== awards.js ===== */

/* ---------- awards ---------- */
function defaultAwards(){return [
  {id:'top',kind:'top',on:true,title:'Alpha Flamingo',winners:[],note:'',revealed:false},
  {id:'dress',kind:'dress',on:true,title:'Plumage Royale',winners:[],note:'',revealed:false},
  {id:'mvp',kind:'mvp',on:true,title:'Flock Favourite',winners:[],votes:{},pick:null,note:'',revealed:false},
  {id:'host',kind:'host',on:false,title:'The Golden Feather',winners:[],note:'',revealed:false}]}
var AWK={
  top:{label:'Top of the leaderboard',how:'Goes to whoever leads the board. Revealing locks it in.',names:['Alpha Flamingo','Crown Feather Supreme','Lord of the Flock','The Pinnacle Plume','Boss of the Board']},
  dress:{label:'Best dressed',how:'Hosts pick who wore it best.',names:['Plumage Royale','Runway Wingspan','Peacock of the Night','Best Feathered Fit','Fit Check Champion']},
  mvp:{label:'MVP of the night',how:'The room votes, hosts tally the votes.',names:['Flock Favourite','The Crowd Pleaser','Heart of the Flock','Most Valued Plumage','Squad Magnet']},
  host:{label:'Host\'s pick',how:'Optional. A host picks anyone, for any reason.',names:['The Golden Feather','Wildcard Wing','Chief\'s Choice','The Surprise Squawk','Quiet Legend']}
};
function awardById(id){for(var i=0;i<S.awards.length;i++)if(S.awards[i].id===id)return S.awards[i];return null}
function topLeaders(T){var r=ranked(T,'all');return (r.length&&r[0].v>0)?r.filter(function(x){return x.rank===1&&x.v>0}).map(function(x){return x.p.id}):[]}
function topVote(votes){var best=0,id=null,tie=false;Object.keys(votes||{}).forEach(function(k){var v=votes[k];if(v>best){best=v;id=k;tie=false}else if(v===best&&v>0)tie=true});return (best>0&&!tie)?id:null}
function awardWinners(a,T){
  var ids=(a.kind==='top'&&!a.revealed)?topLeaders(T||totals()):(a.winners||[]);
  return ids.filter(function(id){return P(id)});
}
function whoPill(id,s){var p=P(id);return p?'<span class="hold">'+av(p,s||24)+esc(p.name)+'</span>':''}
/* small gold pills on leaderboard rows: the top award shows live, the others once revealed */
function awardPills(pid,T){
  var out=[];
  S.awards.forEach(function(a){if(!a.on)return;if(a.kind!=='top'&&!a.revealed)return;
    if(awardWinners(a,T).indexOf(pid)>=0)out.push('<span class="bdg aw" title="'+esc(AWK[a.kind].label)+'">'+ico(a.kind==='top'?'crown':'medal')+esc(a.title)+'</span>')});
  return out.join('');
}
function awardCardsHTML(T,live){
  var list=S.awards.filter(function(a){return a.on});
  if(!list.length)return '<div class="bempty"><div class="hand">No awards set up.</div><div>Hosts can turn awards on in the Games tab.</div></div>';
  return '<div class="awgrid">'+list.map(function(a){
    var ws=awardWinners(a,T),show=a.revealed||a.kind==='top';
    return '<div class="awcard big '+(a.revealed?'won':'')+'"><div class="awk">'+esc(AWK[a.kind].label)+'</div><h3 class="awt">'+esc(a.title)+'</h3>'+
      (show&&ws.length?'<div class="awwin">'+ws.map(function(id){var p=P(id);return '<div class="awp">'+av(p,live?72:60)+'<b>'+esc(p.name)+'</b></div>'}).join('')+'</div>'+(a.revealed&&a.note?'<div class="awnote">“'+esc(a.note)+'”</div>':'')+(a.kind==='top'&&!a.revealed?'<div class="hint">Leading right now</div>':'')
        :'<div class="awlock">'+ico('medal')+'<span>'+(a.kind==='top'?'No scores yet':'Revealed at the ceremony')+'</span></div>')+'</div>'}).join('')+'</div>';
}
function awardsMini(T,dock){
  var rows=S.awards.filter(function(a){return a.on&&(a.revealed||a.kind==='top')}).map(function(a){var ws=awardWinners(a,T);if(!ws.length)return '';
    return '<div class="npr"><span class="npph">'+ico(a.kind==='top'?'crown':'medal')+'</span><div><b>'+esc(a.title)+'</b><small>'+esc(ws.map(nm).join(', '))+(a.kind==='top'&&!a.revealed?' · leading':'')+'</small></div></div>'}).join('');
  return rows?'<div class="panel"><h3>'+ico('medal')+'Awards</h3><div class="np">'+rows+'</div>'+(dock?'':'')+'</div>':'';
}
function awardsPanel(){
  var T=totals();
  var h='<div class="row between"><div><h2>Awards</h2><div class="sub">Name each award, pick who gets it, then reveal it on the board when you are ready.</div></div><button class="btn primary" data-act="aw-all">'+ico('crown')+'Reveal all</button></div>';
  h+='<div class="awgrid">'+S.awards.map(function(a){
    var ws=awardWinners(a,T),st=!a.on?'Off':a.revealed?'Revealed':'Hidden';
    return '<div class="awcard '+(a.on?'':'off')+'"><div class="row between" style="flex-wrap:nowrap"><span class="awk">'+esc(AWK[a.kind].label)+'</span><span class="st '+(a.revealed?'now':'')+'">'+st+'</span></div><h3 class="awt">'+esc(a.title)+'</h3>'+
      (ws.length?'<div class="holders">'+ws.map(function(id){return whoPill(id)}).join('')+'</div>':'<div class="hint">'+(a.kind==='top'?'Nobody has scored yet.':'Not picked yet.')+'</div>')+
      (a.kind==='top'&&ws.length&&!a.revealed?'<div class="hint">Leading right now</div>':'')+(a.note?'<div class="hint">“'+esc(a.note)+'”</div>':'')+
      '<div class="row"><button class="btn sm" data-act="aw-edit" data-id="'+a.id+'">'+ico('edit')+'Edit</button>'+(a.on?(a.revealed?'<button class="btn sm" data-act="aw-hide" data-id="'+a.id+'">Hide again</button>':'<button class="btn primary sm" data-act="aw-reveal" data-id="'+a.id+'">'+ico('crown')+'Reveal</button>'):'')+'</div></div>'}).join('')+'</div>';
  h+='<div class="note">Revealing shows the winner on the live board with a feather shower. The top award is set by the leaderboard at the moment you reveal it.</div>';
  return h;
}
SHEETS.award=function(ED){
  var k=AWK[ED.kind],T=totals(),body='';
  body+='<div class="f"><label for="aw-title"><span>Give it a name</span></label><input id="aw-title" type="text" data-in="ed" data-k="title" value="'+esc(ED.title)+'" maxlength="40" data-autofocus></div>'+
    '<div class="sugg">'+k.names.map(function(n){return '<button type="button" class="chip '+(ED.title===n?'on':'')+'" data-act="ed-set" data-k="title" data-v="'+esc(n)+'">'+esc(n)+'</button>'}).join('')+'<button type="button" class="chip" data-act="aw-surprise">'+ico('dice')+'Surprise me</button></div>'+
    '<div class="tgl"><div><b>Use this award</b><div class="hint">'+esc(k.how)+'</div></div><button type="button" class="switch" role="switch" aria-checked="'+(!!ED.on)+'" aria-label="Use this award" data-act="aw-on"></button></div>';
  if(ED.kind==='top'){
    var ls=topLeaders(T);body+='<div class="pts">'+(ls.length?'<b>Leading now:</b> '+esc(ls.map(nm).join(', ')):'Nobody has scored yet.')+' This award follows the leaderboard automatically.</div>';
  }else if(ED.kind==='mvp'){
    var auto=topVote(ED.votes),mv=ED.pick||auto;
    body+='<div class="f"><span>Tally the room\'s votes</span><div class="hint">Tap + for each vote. The top name wins unless you tap MVP on someone else.</div><div class="stack">'+S.people.map(function(p){var v=(ED.votes&&ED.votes[p.id])||0,top=mv===p.id;
      return '<div class="vrow '+(top?'top':'')+'">'+av(p,34)+'<div class="nm" style="font-weight:600;min-width:0">'+esc(p.name)+'</div><div class="row" style="flex-wrap:nowrap"><div class="stepper"><button type="button" class="ibtn" data-act="aw-vote" data-id="'+p.id+'" data-d="-1" aria-label="Remove a vote for '+esc(p.name)+'">−</button><b style="min-width:22px;text-align:center">'+v+'</b><button type="button" class="ibtn" data-act="aw-vote" data-id="'+p.id+'" data-d="1" aria-label="Add a vote for '+esc(p.name)+'">+</button></div><button type="button" class="chip '+(top?'on':'')+'" data-act="aw-mvp" data-id="'+p.id+'" aria-pressed="'+top+'">MVP</button></div></div>'}).join('')+'</div></div>';
  }else{
    body+='<div class="f"><span>Who gets it? ('+(ED.winners||[]).length+')</span>'+pchips(ED.winners||[],'aw-pick',false)+'<div class="hint">Pick one person, or tap two for a tie.</div></div>';
  }
  body+='<div class="f"><label for="aw-note"><span>One line shown under the winner (optional)</span></label><input id="aw-note" type="text" data-in="ed" data-k="note" value="'+esc(ED.note||'')+'" maxlength="90" placeholder="For the sherwani and sneakers combo"></div>';
  return frame('Edit award',body,foot('save-award','Save award'));
};
Object.assign(ACT,{
  'aw-edit':function(el){var a=awardById(el.dataset.id);if(a){var c=JSON.parse(JSON.stringify(a));c.votes=c.votes||{};c.winners=c.winners||[];openSheet('award',c)}},
  'aw-surprise':function(){var E=UI.sheet.ED,n=AWK[E.kind].names.filter(function(x){return x!==E.title});E.title=pick(n);renderSheet()},
  'aw-on':function(){UI.sheet.ED.on=!UI.sheet.ED.on;renderSheet()},
  'aw-pick':function(el){var w=UI.sheet.ED.winners,i=w.indexOf(el.dataset.id);if(i>=0)w.splice(i,1);else{w.push(el.dataset.id);if(w.length>2)w.shift()}renderSheet()},
  'aw-vote':function(el){var E=UI.sheet.ED;E.votes=E.votes||{};E.votes[el.dataset.id]=Math.max(0,(E.votes[el.dataset.id]||0)+Number(el.dataset.d));renderSheet()},
  'aw-mvp':function(el){var E=UI.sheet.ED;E.pick=(E.pick===el.dataset.id)?null:el.dataset.id;renderSheet()},
  'save-award':function(){var E=UI.sheet.ED,a=awardById(E.id);if(!a)return;
    a.title=(E.title||'').trim()||AWK[a.kind].names[0];a.on=!!E.on;a.note=(E.note||'').trim();
    if(a.kind==='mvp'){a.votes=E.votes||{};a.pick=E.pick||null;var w=a.pick||topVote(a.votes);a.winners=w?[w]:[]}
    else if(a.kind!=='top')a.winners=(E.winners||[]).slice();
    persist();closeSheet();render();toast('Saved '+a.title)},
  'aw-reveal':function(el){revealAward(awardById(el.dataset.id),false)},
  'aw-hide':function(el){var a=awardById(el.dataset.id);if(a){a.revealed=false;persist();render()}},
  'aw-all':function(){var n=0;S.awards.forEach(function(a){if(a.on&&!a.revealed&&revealAward(a,true))n++});if(!n)toast('Nothing to reveal yet. Pick winners first.')}
});
function revealAward(a,quiet){
  if(!a||!a.on)return false;
  if(a.kind==='top')a.winners=topLeaders(totals());
  if(!a.winners||!a.winners.length){if(!quiet)toast(a.kind==='top'?'Nobody has scored yet.':'Pick a winner first (tap Edit).');return false}
  a.revealed=true;
  var f={id:uid(),ts:Date.now(),phase:'awards',title:a.winners.map(nm).join(' and ')+' won '+a.title,by:WHO||'',deltas:[],lead:null,award:{pid:a.winners[0],title:a.title,kind:AWK[a.kind].label}};
  S.feed.push(f);S.feed=S.feed.slice(-40);persist();render();react(f);return true;
}

/* ===== theme.js ===== */

/* ---------- themes: auto, bright, night, diwali ---------- */
var TKEY='flamigos-theme';
function themePref(){try{return localStorage.getItem(TKEY)||'auto'}catch(e){return 'auto'}}
function themeNow(){var p=themePref();if(p!=='auto')return p;try{return window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'bright'}catch(e){return 'bright'}}
function applyTheme(){document.documentElement.setAttribute('data-theme',themeNow());
  var m=$('meta[name="theme-color"]');if(m){var c={bright:'#FFF7F9',night:'#1A1116',diwali:'#FFF2DE'};m.setAttribute('content',c[themeNow()]||'#FFF7F9')}}
try{window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){if(themePref()==='auto')applyTheme()})}catch(e){}
var THEMES=[['auto','Match my device','Bright by day, night mode after dark',['#FFFFFF','#C73865','#1A1116']],
  ['bright','Bright','White fading to blush pink',['#FFFFFF','#FBE5EE','#C73865']],
  ['night','Night','Easy on the eyes, good for a dim room',['#1A1116','#3E2D37','#FF86A5']],
  ['diwali','Diwali','Warm cream, marigold and a string of lights',['#FFF2DE','#F6B73C','#B5304F']]];
SHEETS.theme=function(){
  var cur=themePref();
  return frame('Look',
    '<div class="swatches">'+THEMES.map(function(t){return '<button type="button" class="swopt '+(cur===t[0]?'on':'')+'" data-act="theme-set" data-v="'+t[0]+'" aria-pressed="'+(cur===t[0])+'"><span class="swchips">'+t[3].map(function(c){return '<i style="background:'+c+'"></i>'}).join('')+'</span><span><b>'+t[1]+'</b><small>'+t[2]+'</small></span>'+(cur===t[0]?ico('check'):'')+'</button>'}).join('')+'</div>'+
    '<p class="hint">This only changes how it looks on this device. The laptop screen and your phone can use different looks.</p>',
    '<button class="btn primary" data-act="sheet-close">Done</button>');
};
Object.assign(ACT,{
  theme:function(){openSheet('theme',{})},
  'theme-set':function(el){try{localStorage.setItem(TKEY,el.dataset.v)}catch(e){}applyTheme();renderSheet();render();
    if(el.dataset.v==='diwali'){var was=S.celebrate;S.celebrate=true;shower(22);S.celebrate=was}}
});

/* ===== sync.js ===== */

/* ---------- live sync (Cloudflare Pages Functions + D1) ----------
   If /api/hosts answers, the app runs in "server" mode: hosts sign in with a PIN, every change is pushed to the server,
   and every screen polls for changes. If it does not answer (plain static hosting), the app runs in "local" mode on this device. */
var SYNC={mode:'local',rev:0,base:null,dirty:false,busy:false,status:'local',hosts:[],configured:true,timer:null};
var AUTHK='flamigos-auth',AUTH=null;
try{AUTH=JSON.parse(localStorage.getItem(AUTHK)||'null')}catch(e){}
function isServer(){return SYNC.mode==='server'}
function clone(o){return JSON.parse(JSON.stringify(o))}
function hdrs(){var h={'content-type':'application/json'};if(AUTH){h['x-host']=AUTH.host;h['x-pin']=AUTH.pin}return h}
function api(method,url,body){return fetch(url,{method:method,headers:hdrs(),body:body?JSON.stringify(body):undefined,cache:'no-store'})}
function withTimeout(p,ms){return new Promise(function(res,rej){var t=setTimeout(function(){rej(new Error('timeout'))},ms);p.then(function(v){clearTimeout(t);res(v)},function(e){clearTimeout(t);rej(e)})})}
function syncChip(){
  if(!isServer())return '<span class="sync local" id="syncchip" title="Saved on this device only">Local</span>';
  var m={ok:['ok','Live'],saving:['saving','Saving'],offline:['off','Offline']}[SYNC.status]||['ok','Live'];
  return '<span class="sync '+m[0]+'" id="syncchip">'+m[1]+'</span>';
}
function paintSync(s){SYNC.status=s;var el=$('#syncchip');if(el){var m={ok:['ok','Live'],saving:['saving','Saving'],offline:['off','Offline']}[s]||['ok','Live'];el.className='sync '+m[0];el.textContent=m[1]}}
function markDirty(){
  if(!isServer()||!AUTH)return;
  SYNC.dirty=true;paintSync('saving');clearTimeout(SYNC.timer);SYNC.timer=setTimeout(push,350);
}
/* three-way merge by id, so two hosts logging at the same time never wipe each other out */
function idx(a){var m={};(a||[]).forEach(function(x){m[x.id]=x});return m}
function mergeState(base,mine,theirs){
  base=base||{};var out=clone(theirs);
  ['people','tables','teams','roles','logs','feed','awards'].forEach(function(k){
    var b=idx(base[k]),m=idx(mine[k]),res=out[k]||[],pos={};
    res.forEach(function(x,i){pos[x.id]=i});
    (mine[k]||[]).forEach(function(x){var bx=b[x.id];
      if(!bx){if(pos[x.id]===undefined){pos[x.id]=res.length;res.push(x)}}
      else if(JSON.stringify(bx)!==JSON.stringify(x)&&pos[x.id]!==undefined)res[pos[x.id]]=x});
    (base[k]||[]).forEach(function(bx){if(!m[bx.id]){var i=res.findIndex(function(y){return y.id===bx.id});if(i>=0)res.splice(i,1)}});
    out[k]=res});
  ['title','rules','phases','mafia','celebrate','snap'].forEach(function(k){if(JSON.stringify(mine[k])!==JSON.stringify(base[k]))out[k]=mine[k]});
  out.feed.sort(function(a,b){return a.ts-b.ts});out.feed=out.feed.slice(-40);
  return out;
}
function adopt(state,rev){
  var seen={},first=!SYNC.base;(S.feed||[]).forEach(function(f){seen[f.id]=1});
  if(state==null){if(!AUTH&&first)S=fresh();SYNC.rev=rev;SYNC.base=clone(S);if(AUTH&&first){SYNC.dirty=true;markDirty()}return}
  S=norm(state);if(isServer())S.admins=SYNC.hosts.slice();
  SYNC.rev=rev;SYNC.base=clone(S);saveLocal();
  if(!first)(S.feed||[]).filter(function(f){return !seen[f.id]}).forEach(function(f){react(f)});
}
function typingNow(){var ae=document.activeElement;return !!(ae&&(ae.tagName==='TEXTAREA'||ae.tagName==='INPUT'||ae.tagName==='SELECT'))}
var renderPending=false;
function renderSoon(){
  var ae=document.activeElement;
  if(typingNow()&&(ae.tagName==='SELECT'||ae.value)){renderPending=true;return}
  var id=ae&&ae.id&&typingNow()?ae.id:null;
  render();
  if(id){var n=document.getElementById(id);if(n)n.focus()}
}
document.addEventListener('focusout',function(){if(renderPending)setTimeout(function(){if(renderPending&&!typingNow()){renderPending=false;render()}},250)});
async function pull(force){
  var r=await withTimeout(fetch('/api/state'+(force?'':'?since='+SYNC.rev),{headers:hdrs(),cache:'no-store'}),8000);
  if(!r.ok)throw new Error('http '+r.status);var j=await r.json();
  if(j.same)return false;
  adopt(j.state,j.rev);return true;
}
async function push(){
  if(!isServer()||!AUTH||SYNC.busy||!SYNC.dirty)return;
  SYNC.busy=true;SYNC.dirty=false;
  var sent=clone(S);
  try{
    var r=await withTimeout(api('PUT','/api/state',{baseRev:SYNC.rev,state:sent}),15000);
    if(r.status===200){var j=await r.json();SYNC.rev=j.rev;SYNC.base=sent}
    else if(r.status===409){var j2=await r.json();var merged=mergeState(SYNC.base,clone(S),j2.state);merged.admins=SYNC.hosts.slice();
      var seen={};(S.feed||[]).forEach(function(f){seen[f.id]=1});
      S=norm(merged);SYNC.rev=j2.rev;SYNC.base=clone(j2.state);saveLocal();SYNC.dirty=true;
      (S.feed||[]).filter(function(f){return !seen[f.id]}).forEach(function(f){react(f)});renderSoon()}
    else if(r.status===401||r.status===429){signOut(r.status===429?'Too many wrong PINs. Wait a few minutes.':'Your sign-in expired. Please sign in again.');SYNC.busy=false;return}
    else throw new Error('http '+r.status);
    if(!SYNC.dirty)paintSync('ok');
  }catch(e){SYNC.dirty=true;paintSync('offline');setTimeout(push,4000)}
  SYNC.busy=false;
  if(SYNC.dirty&&SYNC.status!=='offline')setTimeout(push,150);
}
function poll(){
  if(!isServer()||document.hidden||SYNC.busy||SYNC.dirty)return;
  pull(false).then(function(changed){if(SYNC.status==='offline')paintSync('ok');if(changed)renderSoon()},function(){paintSync('offline')});
}
async function signIn(host,pin){
  var r;try{r=await withTimeout(fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({host:host,pin:pin})}),8000)}catch(e){toast('Could not reach the server. Check your connection.');return false}
  if(r.status===429){toast('Too many wrong PINs. Wait a few minutes.');return false}
  if(!r.ok){toast('That PIN did not match.');return false}
  AUTH={host:host,pin:pin};try{localStorage.setItem(AUTHK,JSON.stringify(AUTH))}catch(e){}
  WHO=host;
  try{await pull(true)}catch(e){}
  render();toast('Signed in as '+host);return true;
}
function signOut(msg){
  AUTH=null;WHO=null;try{localStorage.removeItem(AUTHK)}catch(e){}
  SYNC.base=null;SYNC.dirty=false;
  pull(true).catch(function(){}).then(function(){render();if(msg)toast(msg)});
}
/* photos: in server mode they are uploaded and stored by link, so the shared state stays small */
async function uploadImg(dataUrl){
  var r=await withTimeout(api('POST','/api/img',{data:dataUrl}),20000);if(!r.ok)throw new Error('upload');
  var j=await r.json();return j.url;
}
function finishImg(t,u){
  if(!isServer()){setImg(t,u);return}
  toast('Uploading photo');
  uploadImg(u).then(function(url){setImg(t,url)},function(){toast('Could not upload that photo. Check your connection and try again.')});
}
Object.assign(ACT,{
  'login-pick':function(el){UI.loginHost=el.dataset.n;render();var i=$('#pin');if(i)i.focus()},
  'login-back':function(){UI.loginHost=null;render()},
  signout:function(){signOut('Signed out');closeSheet()}
});
document.addEventListener('submit',function(e){
  if(e.target.id==='loginform'){e.preventDefault();var pin=$('#pin').value.trim();if(!pin||!UI.loginHost)return;signIn(UI.loginHost,pin).then(function(ok){if(!ok){var i=$('#pin');if(i){i.value='';i.focus()}}})}
});
async function boot(){
  applyTheme();
  try{
    var r=await withTimeout(fetch('/api/hosts',{cache:'no-store'}),2500);
    var ct=r.headers.get('content-type')||'';
    if(r.ok&&ct.indexOf('json')>=0){var j=await r.json();
      if(j&&Array.isArray(j.hosts)){SYNC.mode='server';SYNC.hosts=j.hosts;SYNC.configured=j.hosts.length>0;S.admins=j.hosts.slice()}}
  }catch(e){}
  if(isServer()){
    WHO=null;
    if(AUTH){
      try{var v=await withTimeout(fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({host:AUTH.host,pin:AUTH.pin})}),6000);
        if(v.ok)WHO=AUTH.host;else{AUTH=null;try{localStorage.removeItem(AUTHK)}catch(e){}}}catch(e){WHO=AUTH.host}
    }
    try{await pull(true)}catch(e){SYNC.status='offline'}
    setInterval(poll,3000);
    document.addEventListener('visibilitychange',function(){if(!document.hidden)poll()});
  }
  render();
}
boot();

})();
