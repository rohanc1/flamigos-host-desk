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

