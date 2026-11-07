/* ---------- avatars ---------- */
var SKIN=['#FAD7BD','#F2BE98','#DFA07A','#BE7D52','#8F5A38','#5F3B26'];
var HAIRC=[['Black','#1F1A1C'],['Brown','#4B2E22'],['Chestnut','#7B4A2D'],['Auburn','#A5442A'],['Blonde','#D9B26A'],['Silver','#B9B4B8'],['Pink','#E26A9A'],['Blue','#3E6FD1']];
var TOPC=['#CF3463','#2B1B22','#7FB69E','#8EC5F0','#F4C85A','#B8A4E8'];
var BGC=['#FDE4EC','#FFE9C9','#E3F2E1','#E2EEFB','#EDE6FA','#FFF1B8','#EFE8E2','#FFD9CF'];
var HAIRS=[['none','Bald'],['buzz','Buzz'],['short','Short'],['quiff','Quiff'],['curly','Curly'],['afro','Afro'],['bob','Bob'],['long','Long'],['ponytail','Ponytail'],['bun','Bun'],['pigtails','Pigtails'],['scarf','Scarf']];
var EYES=[['round','Round'],['happy','Happy'],['sleepy','Sleepy'],['sparkle','Sparkle'],['wink','Wink']];
var MOUTHS=[['smile','Smile'],['grin','Grin'],['neutral','Calm'],['open','Wow'],['smirk','Smirk']];
var FH=[['none','None'],['stubble','Stubble'],['moustache','Moustache'],['goatee','Goatee'],['beard','Beard']];
var GLASS=[['none','None'],['round','Round'],['square','Square'],['shades','Shades']];
var HEAD=[['none','None'],['cap','Cap'],['beanie','Beanie'],['headband','Band'],['feather','Feather'],['flower','Flower'],['bow','Bow']];
var EXTRAS=[['blush','Blush'],['freckles','Freckles'],['bindi','Bindi'],['lipstick','Lipstick'],['earrings','Earrings']];
function shade(hex,amt){var n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;var f=function(v){return Math.max(0,Math.min(255,Math.round(amt<0?v*(1+amt):v+(255-v)*amt)))};return '#'+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1)}
function hairParts(k,c){
  var f=function(d,x){return '<path d="'+d+'" fill="'+c+'" '+(x||'')+'/>'};
  switch(k){
    case 'buzz':return {b:'',f:f('M31.5 42C31 27 40 23.5 50 23.5S69 27 68.5 42C65 33 58 30 50 30S35 33 31.5 42Z','opacity=".85"')};
    case 'short':return {b:'',f:f('M30 46C28 24 40 18 50 18S72 24 70 46C67 34 62 30 50 30S33 34 30 46Z')};
    case 'quiff':return {b:'',f:f('M30 44C27 22 42 12 56 15C68 17 72 28 70 44C67 33 60 28 50 28S33 33 30 44Z')};
    case 'curly':{var cs=[[34,32,7],[42,25,7.5],[51,22,7.5],[60,25,7.5],[67,32,7],[31,41,5.5],[69,41,5.5]];
      return {b:'',f:f('M31 44C31 30 69 30 69 44C65 36 35 36 31 44Z')+cs.map(function(a){return '<circle cx="'+a[0]+'" cy="'+a[1]+'" r="'+a[2]+'" fill="'+c+'"/>'}).join('')}}
    case 'afro':return {b:'<circle cx="50" cy="36" r="27" fill="'+c+'"/>',f:f('M33 40C33 30 42 27 50 27S67 30 67 40C62 34 56 33 50 33S38 34 33 40Z')};
    case 'bob':return {b:f('M28 40C26 66 32 71 37 72L63 72C68 71 74 66 72 40C72 18 28 18 28 40Z'),f:f('M30 44C29 24 40 19 50 19S71 24 70 44C66 33 60 30 50 30S34 33 30 44Z')};
    case 'long':return {b:f('M27 42C24 70 30 86 34 90L66 90C70 86 76 70 73 42C73 18 27 18 27 42Z'),f:f('M30 46C28 22 42 17 52 18C64 20 71 28 70 46C66 34 58 28 46 31C40 33 34 38 30 46Z')};
    case 'ponytail':return {b:f('M64 36C84 34 90 58 78 74C77 60 72 52 66 48Z'),f:f('M30 46C28 24 40 18 50 18S72 24 70 46C67 34 62 30 50 30S33 34 30 46Z')};
    case 'bun':return {b:'',f:'<circle cx="50" cy="13" r="9" fill="'+c+'"/>'+f('M30 46C28 24 40 18 50 18S72 24 70 46C67 34 62 30 50 30S33 34 30 46Z')};
    case 'pigtails':return {b:'<circle cx="24" cy="54" r="8.5" fill="'+c+'"/><circle cx="76" cy="54" r="8.5" fill="'+c+'"/>',f:f('M30 46C28 24 40 18 50 18S72 24 70 46C67 34 62 30 50 30S33 34 30 46Z')};
    case 'scarf':return {b:f('M25 52C22 16 78 16 75 52C75 64 71 74 65 76L35 76C29 74 25 64 25 52Z'),f:f('M31 42C33 27 67 27 69 42C64 35 58 33 50 33S36 35 31 42Z','')};
    default:return {b:'',f:''};
  }
}
function avatarSVG(a,size){
  var skin=SKIN[a.skin]||SKIN[1], sd=shade(skin,-.16), hc=(HAIRC[a.hairc]||HAIRC[0])[1], top=TOPC[a.top]||TOPC[0], bg=BGC[a.bg]||BGC[0];
  var dark='#2B1B22', hp=hairParts(a.hair,hc), brow=a.hair==='none'?'#5a4545':shade(hc,-.1), o='';
  o+='<rect width="100" height="100" fill="'+bg+'"/>';
  o+=hp.b;
  o+='<path d="M12 100C12 82 28 73 50 73S88 82 88 100Z" fill="'+top+'"/>';
  o+='<rect x="43" y="60" width="14" height="18" rx="5" fill="'+sd+'"/>';
  o+='<path d="M41 73C45 83 55 83 59 73Z" fill="'+skin+'"/>';
  if(a.hair!=='scarf')o+='<circle cx="30.5" cy="48" r="3.6" fill="'+skin+'"/><circle cx="69.5" cy="48" r="3.6" fill="'+skin+'"/>';
  o+='<ellipse cx="50" cy="46" rx="19.5" ry="22" fill="'+skin+'"/>';
  o+=hp.f;
  var ex=a.extras||[];
  if(ex.indexOf('blush')>=0)o+='<circle cx="38" cy="53" r="4" fill="#FF6F91" opacity=".35"/><circle cx="62" cy="53" r="4" fill="#FF6F91" opacity=".35"/>';
  if(ex.indexOf('freckles')>=0)o+='<g fill="'+sd+'"><circle cx="40" cy="51.5" r=".9"/><circle cx="43" cy="53" r=".9"/><circle cx="37.5" cy="53.5" r=".9"/><circle cx="60" cy="51.5" r=".9"/><circle cx="57" cy="53" r=".9"/><circle cx="62.5" cy="53.5" r=".9"/></g>';
  /* brows */
  o+='<path d="M38.5 40.5Q42.5 38.2 46.5 40" stroke="'+brow+'" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M53.5 40Q57.5 38.2 61.5 40.5" stroke="'+brow+'" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
  /* eyes */
  var L=43,R=57,y=46;
  switch(a.eyes){
    case 'happy':o+='<path d="M'+(L-3)+' '+(y+1)+'Q'+L+' '+(y-3)+' '+(L+3)+' '+(y+1)+'M'+(R-3)+' '+(y+1)+'Q'+R+' '+(y-3)+' '+(R+3)+' '+(y+1)+'" stroke="'+dark+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';break;
    case 'sleepy':o+='<path d="M'+(L-3)+' '+y+'H'+(L+3)+'M'+(R-3)+' '+y+'H'+(R+3)+'" stroke="'+dark+'" stroke-width="2" stroke-linecap="round"/>';break;
    case 'sparkle':o+='<circle cx="'+L+'" cy="'+y+'" r="2.9" fill="'+dark+'"/><circle cx="'+R+'" cy="'+y+'" r="2.9" fill="'+dark+'"/><circle cx="'+(L+1)+'" cy="'+(y-1)+'" r="1" fill="#fff"/><circle cx="'+(R+1)+'" cy="'+(y-1)+'" r="1" fill="#fff"/>';break;
    case 'wink':o+='<circle cx="'+L+'" cy="'+y+'" r="2.3" fill="'+dark+'"/><path d="M'+(R-3)+' '+(y+1)+'Q'+R+' '+(y-3)+' '+(R+3)+' '+(y+1)+'" stroke="'+dark+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';break;
    default:o+='<circle cx="'+L+'" cy="'+y+'" r="2.3" fill="'+dark+'"/><circle cx="'+R+'" cy="'+y+'" r="2.3" fill="'+dark+'"/>';
  }
  o+='<path d="M50 49Q52.5 53 49.5 53.6" stroke="'+sd+'" stroke-width="1.3" fill="none" stroke-linecap="round"/>';
  /* facial hair (under mouth) */
  var fc=hc;
  if(a.fh==='stubble')o+='<path d="M33 52C35 66 65 66 67 52C64 61 36 61 33 52Z" fill="'+fc+'" opacity=".3"/>';
  if(a.fh==='beard')o+='<path d="M31 50C32 72 68 72 69 50C66 62 58 64 50 64C42 64 34 62 31 50Z" fill="'+fc+'"/>';
  if(a.fh==='goatee')o+='<path d="M45 61C47 68 53 68 55 61C53 64 47 64 45 61Z" fill="'+fc+'"/>';
  /* mouth */
  var lip=ex.indexOf('lipstick')>=0, mc=lip?'#C2185B':dark, my=a.fh==='beard'?58:57;
  switch(a.mouth){
    case 'grin':o+='<path d="M44 '+(my-3)+'Q50 '+(my+6)+' 56 '+(my-3)+'Z" fill="#fff" stroke="'+mc+'" stroke-width="1.6" stroke-linejoin="round"/>';break;
    case 'neutral':o+='<path d="M45.5 '+my+'H54.5" stroke="'+mc+'" stroke-width="2" stroke-linecap="round"/>';break;
    case 'open':o+='<ellipse cx="50" cy="'+my+'" rx="3.5" ry="3" fill="'+(lip?'#8E0F42':'#7A2638')+'"/>';break;
    case 'smirk':o+='<path d="M45 '+my+'Q50 '+(my+2)+' 55.5 '+(my-2.5)+'" stroke="'+mc+'" stroke-width="2" fill="none" stroke-linecap="round"/>';break;
    default:o+='<path d="M44 '+(my-2)+'Q50 '+(my+4)+' 56 '+(my-2)+'" stroke="'+mc+'" stroke-width="2" fill="none" stroke-linecap="round"/>';
  }
  if(a.fh==='moustache'||a.fh==='goatee')o+='<path d="M42 53C45 50 49 52 50 53C51 52 55 50 58 53C55 56 52 55 50 54.5C48 55 45 56 42 53Z" fill="'+fc+'"/>';
  if(ex.indexOf('bindi')>=0)o+='<circle cx="50" cy="37" r="1.9" fill="#D6246E"/>';
  if(ex.indexOf('earrings')>=0)o+='<circle cx="30.5" cy="53" r="2" fill="#E8B54B"/><circle cx="69.5" cy="53" r="2" fill="#E8B54B"/>';
  /* glasses */
  if(a.glasses==='round')o+='<g fill="rgba(255,255,255,.18)" stroke="'+dark+'" stroke-width="1.6"><circle cx="43" cy="46" r="6.2"/><circle cx="57" cy="46" r="6.2"/><path d="M49.2 45.5H50.8" fill="none"/></g>';
  if(a.glasses==='square')o+='<g fill="rgba(255,255,255,.18)" stroke="'+dark+'" stroke-width="1.6"><rect x="36.5" y="40.5" width="12" height="10" rx="2.5"/><rect x="51.5" y="40.5" width="12" height="10" rx="2.5"/><path d="M48.5 45H51.5" fill="none"/></g>';
  if(a.glasses==='shades')o+='<g fill="'+dark+'"><rect x="35.5" y="41" width="13.5" height="9" rx="3.5"/><rect x="51" y="41" width="13.5" height="9" rx="3.5"/><rect x="48" y="43" width="4" height="1.6"/></g>';
  /* headwear */
  switch(a.head){
    case 'cap':o+='<path d="M30 38C31 19 69 19 70 38Z" fill="'+top+'"/><path d="M58 36H83C83 42 68 43 58 40Z" fill="'+shade(top,-.25)+'"/>';break;
    case 'beanie':o+='<path d="M29 38C28 12 72 12 71 38Z" fill="'+top+'"/><rect x="28" y="35" width="44" height="7" rx="3.5" fill="'+shade(top,-.25)+'"/><circle cx="50" cy="11" r="4.5" fill="'+shade(top,.25)+'"/>';break;
    case 'headband':o+='<path d="M31 37C40 30 60 30 69 37" fill="none" stroke="'+top+'" stroke-width="4.6" stroke-linecap="round"/>';break;
    case 'feather':o+='<g transform="rotate(14 62 26)"><path d="M62 28C63 10 77 3 86 6C85 17 75 28 62 28Z" fill="#FF8FB0"/><path d="M62 28L84 8" stroke="#CF3463" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>';break;
    case 'flower':o+='<g transform="translate(68 27)"><g fill="#FF9DB8"><circle cx="0" cy="-5" r="4"/><circle cx="4.8" cy="-1.5" r="4"/><circle cx="3" cy="4" r="4"/><circle cx="-3" cy="4" r="4"/><circle cx="-4.8" cy="-1.5" r="4"/></g><circle r="2.8" fill="#F6C945"/></g>';break;
    case 'bow':o+='<path d="M66 25L77 18V32Z M66 25L55 18V32Z" fill="'+top+'"/><circle cx="66" cy="25" r="3" fill="'+shade(top,-.25)+'"/>';break;
  }
  return '<svg viewBox="0 0 100 100" width="'+size+'" height="'+size+'" aria-hidden="true" focusable="false">'+o+'</svg>';
}
function av(p,size){return '<span class="av" style="--s:'+(size||40)+'px">'+avatarSVG(p.av||p,size||40)+'</span>'}
function randAv(kind){
  var girl=['bob','long','ponytail','bun','pigtails','curly','scarf','afro','quiff'], guy=['buzz','short','quiff','curly','afro','none','short'];
  var a={skin:Math.floor(Math.random()*6),hairc:Math.floor(Math.random()*5),top:Math.floor(Math.random()*6),bg:Math.floor(Math.random()*8),
    eyes:pick(EYES)[0],mouth:pick(MOUTHS)[0],glasses:pick(['none','none','none','round','square','shades'].map(function(x){return [x]}))[0],head:'none',fh:'none',hair:'short',extras:[]};
  var k=kind||pick(['guy','girl','neutral']);
  if(k==='guy'){a.hair=pick(guy);a.fh=pick(['none','none','stubble','moustache','beard','goatee']);if(Math.random()<.2)a.head=pick(['cap','beanie']);}
  else if(k==='girl'){a.hair=pick(girl);a.fh='none';if(Math.random()<.5)a.extras.push('earrings');if(Math.random()<.3)a.extras.push('lipstick');if(Math.random()<.3)a.extras.push('blush');if(Math.random()<.25)a.head=pick(['headband','flower','bow','feather']);}
  else{a.hair=pick(HAIRS)[0];a.fh=pick(['none','none','none','stubble']);if(Math.random()<.2)a.head=pick(['feather','cap','beanie','headband']);}
  if(a.hair==='scarf')a.head='none';
  return a;
}
