
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
