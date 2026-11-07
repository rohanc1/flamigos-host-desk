
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
