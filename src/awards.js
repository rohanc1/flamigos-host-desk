
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
