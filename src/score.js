
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

