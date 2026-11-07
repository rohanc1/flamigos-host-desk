
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
