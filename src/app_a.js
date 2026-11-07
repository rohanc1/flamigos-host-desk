
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
__KEEP__
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
