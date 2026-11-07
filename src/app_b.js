
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
