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
