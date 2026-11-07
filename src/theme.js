
/* ---------- themes: auto, bright, night, diwali ---------- */
var TKEY='flamigos-theme';
function themePref(){try{return localStorage.getItem(TKEY)||'auto'}catch(e){return 'auto'}}
function themeNow(){var p=themePref();if(p!=='auto')return p;try{return window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'bright'}catch(e){return 'bright'}}
function applyTheme(){document.documentElement.setAttribute('data-theme',themeNow());
  var m=$('meta[name="theme-color"]');if(m){var c={bright:'#FFF7F9',night:'#1A1116',diwali:'#FFF2DE'};m.setAttribute('content',c[themeNow()]||'#FFF7F9')}}
try{window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){if(themePref()==='auto')applyTheme()})}catch(e){}
var THEMES=[['auto','Match my device','Bright by day, night mode after dark',['#FFFFFF','#C73865','#1A1116']],
  ['bright','Bright','White fading to blush pink',['#FFFFFF','#FBE5EE','#C73865']],
  ['night','Night','Easy on the eyes, good for a dim room',['#1A1116','#3E2D37','#FF86A5']],
  ['diwali','Diwali','Warm cream, marigold and a string of lights',['#FFF2DE','#F6B73C','#B5304F']]];
SHEETS.theme=function(){
  var cur=themePref();
  return frame('Look',
    '<div class="swatches">'+THEMES.map(function(t){return '<button type="button" class="swopt '+(cur===t[0]?'on':'')+'" data-act="theme-set" data-v="'+t[0]+'" aria-pressed="'+(cur===t[0])+'"><span class="swchips">'+t[3].map(function(c){return '<i style="background:'+c+'"></i>'}).join('')+'</span><span><b>'+t[1]+'</b><small>'+t[2]+'</small></span>'+(cur===t[0]?ico('check'):'')+'</button>'}).join('')+'</div>'+
    '<p class="hint">This only changes how it looks on this device. The laptop screen and your phone can use different looks.</p>',
    '<button class="btn primary" data-act="sheet-close">Done</button>');
};
Object.assign(ACT,{
  theme:function(){openSheet('theme',{})},
  'theme-set':function(el){try{localStorage.setItem(TKEY,el.dataset.v)}catch(e){}applyTheme();renderSheet();render();
    if(el.dataset.v==='diwali'){var was=S.celebrate;S.celebrate=true;shower(22);S.celebrate=was}}
});
