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
