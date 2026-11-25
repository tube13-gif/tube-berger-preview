function e(e){let t=e.querySelector(`.tv-logo`),n=e.querySelector(`.tv-canvas`),r=e.querySelector(`.spot[data-id="tv"]`),i=e.querySelector(`.scene`),a=e.querySelector(`.tv`),o=e.querySelector(`.tv-osd`),s=o.querySelector(`.osd-screen`),c=o.querySelector(`.osd-menu`),l=e.querySelector(`.osd-bar`),u=l.querySelector(`.osd-back`),d=l.querySelector(`.osd-yt`),f=e.querySelector(`.tv-front`),p=e.querySelector(`.tv-front-top`),m=window.matchMedia(`(prefers-reduced-motion: reduce)`),h=(e,t)=>e+Math.random()*(t-e),g=t.hasAttribute(`data-fill`),_=n.getContext(`webgl`,{antialias:!1,alpha:!1}),v={};if(_){let e=(e,t)=>{let n=_.createShader(e);return _.shaderSource(n,t),_.compileShader(n),n},t=_.createProgram();_.attachShader(t,e(_.VERTEX_SHADER,`attribute vec2 p; varying vec2 v; void main(){ v = p*.5+.5; gl_Position = vec4(p,0.,1.); }`)),_.attachShader(t,e(_.FRAGMENT_SHADER,`precision mediump float;
uniform sampler2D T; uniform vec2 R; uniform float t, g, gy, amt, cx, cy, fl, gain, lift; varying vec2 v;
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
float n1(float x){ float i=floor(x), f=fract(x); f=f*f*(3.-2.*f); return mix(h(vec2(i,.5)), h(vec2(i+1.,.5)), f); }
vec3 yiq(vec3 c){ return vec3(dot(c,vec3(.299,.587,.114)), dot(c,vec3(.596,-.274,-.322)), dot(c,vec3(.211,-.523,.312))); }
vec3 rgb(vec3 c){ return vec3(c.x+.956*c.y+.621*c.z, c.x-.272*c.y-.647*c.z, c.x-1.106*c.y+1.703*c.z); }
vec3 S(vec2 u){
  vec2 q = vec2(.5+(u.x-.5)*cx, .5+(u.y-.5)*cy);
  if(q.x<0.||q.x>1.||q.y<0.||q.y>1.) return vec3(0.);
  return texture2D(T, q).rgb;
}
void main(){
  vec2 u = vec2(v.x, 1.-v.y);
  float line = floor(u.y*R.y), fr = floor(t*30.), px = 1./R.x;
  // Zeitbasisfehler: langsame Welle plus Zittern jeder Zeile
  float w = (n1(u.y*5.+t*1.1)-.5)*.004*amt + (h(vec2(line,fr))-.5)*.0018*amt;
  // Störband während einer Störung
  float band = smoothstep(.07,0.,abs(u.y-gy))*g;
  w += band*(h(vec2(line,fr+3.))-.5)*.09 + g*(n1(u.y*14.+t*31.)-.5)*.022;
  // Kopfumschaltung: der untere Rand kippt weg und rauscht
  float hs = smoothstep(.055,0.,1.-u.y)*amt;
  w += hs*(.02+.012*sin(t*5.)+(h(vec2(line,fr+9.))-.5)*.05);
  u.x += w;
  u.y += (h(vec2(floor(t*10.),1.))-.5)*.003*amt + g*(h(vec2(fr,2.))-.5)*.02;
  // Helligkeit: leicht weich, mit Überschwinger an Kanten
  float y = (yiq(S(u-vec2(px,0.))).x + 2.*yiq(S(u)).x + yiq(S(u+vec2(px,0.))).x)*.25;
  y += (y - yiq(S(u-vec2(3.*px,0.))).x)*.22*amt;
  // Farbe: viel unschärfer, nach rechts und unten versetzt
  vec2 c = vec2(0.); vec2 cu = u + vec2(-3.*px, -1.5/R.y)*amt;
  for(int i=-4;i<=4;i++){ c += yiq(S(cu+vec2(float(i)*2.2*px,0.))).yz; }
  c /= 9.;
  float cb = floor(u.x*R.x/10.)+fr;
  c += (vec2(h(vec2(line*.5, cb)), h(vec2(line*.5+40., cb)))-.5)*.05*amt;
  y += (h(u*R+fr)-.5)*.06*amt;
  // Aussetzer: kurze weiße Striche mit Schweif
  float d = h(vec2(line, fr+17.));
  if(d > 1.-(.006+.05*g)*amt){ float dx = u.x-h(vec2(line, fr+23.)); if(dx>0.) y += exp(-dx*22.)*.85; }
  float sn = h(vec2(floor(u.x*R.x*.6)+fr*7., line));
  y = mix(y, sn, band*.65); c *= 1.-band*.8;
  y = mix(y, sn, hs*.55); c *= 1.-hs*.6;
  // Röhre: überbelichtet und kühl. Wenig Farbe, das Schwarz glimmt blau,
  // helle Stellen brennen aus. So passt das Bild zum blauen Licht, das im
  // Raumbild auf den Kindern liegt.
  float vg = 1. - .35*dot(v-.5, v-.5)*2.;
  y = (y*gain + lift*vg) * fl;
  vec3 o = rgb(vec3(y, c*.62)) * vec3(.8,.95,1.) + vec3(0.,.015,.045);
  gl_FragColor = vec4(clamp(o,0.,1.),1.);
}`)),_.linkProgram(t),_.useProgram(t),_.getProgramParameter(t,_.LINK_STATUS)||console.error(`TV-Shader:`,_.getProgramInfoLog(t)),_.bindBuffer(_.ARRAY_BUFFER,_.createBuffer()),_.bufferData(_.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),_.STATIC_DRAW);let r=_.getAttribLocation(t,`p`);_.enableVertexAttribArray(r),_.vertexAttribPointer(r,2,_.FLOAT,!1,0,0),_.bindTexture(_.TEXTURE_2D,_.createTexture());for(let[e,t]of[[_.TEXTURE_WRAP_S,_.CLAMP_TO_EDGE],[_.TEXTURE_WRAP_T,_.CLAMP_TO_EDGE],[_.TEXTURE_MIN_FILTER,_.LINEAR],[_.TEXTURE_MAG_FILTER,_.LINEAR]])_.texParameteri(_.TEXTURE_2D,e,t);for(let e of[`R`,`t`,`g`,`gy`,`amt`,`cx`,`cy`,`fl`,`gain`,`lift`])v[e]=_.getUniformLocation(t,e);_.uniform2f(v.R,n.width,n.height)}else e.classList.add(`no-gl`);let y=!0,b=!1,x=0,S=0,C=.5,w=0,T=performance.now()+1800,E=1,D=0;function O(e,t,r,i=!1){if(!_||e.readyState<2)return;let a=e.videoWidth/e.videoHeight/(n.width/n.height);_.texImage2D(_.TEXTURE_2D,0,_.RGB,_.RGB,_.UNSIGNED_BYTE,e),_.uniform1f(v.cx,i?1/a:.8),_.uniform1f(v.cy,i?1:a*.8),_.uniform1f(v.fl,E),_.uniform1f(v.gain,g?1.75:1.9),_.uniform1f(v.lift,g?.2:.42),_.uniform1f(v.t,t/1e3%600),_.uniform1f(v.g,S),_.uniform1f(v.gy,C),_.uniform1f(v.amt,r),_.drawArrays(_.TRIANGLE_STRIP,0,4)}function k(e){if(!y){b=!1;return}x++;let n=t;e>T&&(w=e+h(120,520),T=e+h(1400,5200),C=h(.1,.85));let r=e<w;S+=(+!!r-S)*.4,r?E=h(.45,1.3):D>0?(D--,E=h(.5,.75)):(E=1+h(-.09,.09),Math.random()<.035&&(D=Math.floor(h(1,5)))),O(n,e,1,g),requestAnimationFrame(k)}function A(){m.matches||(t.play().catch(()=>{}),b||(b=!0,requestAnimationFrame(k)))}m.matches&&(t.addEventListener(`seeked`,()=>O(t,0,.5),{once:!0}),t.addEventListener(`loadeddata`,()=>{t.currentTime=6},{once:!0}),t.readyState>=2&&(t.currentTime=6)),A(),new IntersectionObserver(([e])=>{y=e.isIntersecting,y?A():t.pause()},{threshold:.15}).observe(e);for(let e of[`touchend`,`click`])window.addEventListener(e,()=>{y&&t.paused&&A()},{passive:!0});let j=!1;function M(){let t=e.getBoundingClientRect(),n=a.getBoundingClientRect();o.style.left=`${n.left-t.left}px`,o.style.top=`${n.top-t.top}px`,o.style.width=`${n.width}px`,o.style.height=`${n.height}px`;let r=f.getBoundingClientRect();p.style.left=`${r.left-t.left}px`,p.style.top=`${r.top-t.top}px`,p.style.width=`${r.width}px`,p.style.height=`${r.height}px`,l.style.left=`0`,l.style.width=`100%`,l.style.top=`${Math.max(4,r.top-t.top+6)}px`}function N(){s.querySelector(`iframe`)?.remove(),c.hidden=!1,u.hidden=!0;for(let e of l.querySelectorAll(`.osd-num`))e.removeAttribute(`aria-current`);d.href=d.dataset.channel}function P(e){let t=e.dataset.id;s.querySelector(`iframe`)?.remove();let n=[...c.querySelectorAll(`button`)];l.querySelectorAll(`.osd-num`).forEach((t,r)=>t.toggleAttribute(`aria-current`,n[r]===e));let r=document.createElement(`iframe`);r.src=`https://www.youtube-nocookie.com/embed/${t}?autoplay=1&rel=0`,r.title=e.dataset.title,r.allow=`autoplay; encrypted-media; picture-in-picture; fullscreen`,r.allowFullscreen=!0,r.referrerPolicy=`strict-origin-when-cross-origin`,c.hidden=!0,u.hidden=!1,s.append(r),d.href=`https://www.youtube.com/watch?v=${t}`}function F(){if(j)return;j=!0;let t=e.getBoundingClientRect(),n=a.getBoundingClientRect(),r=Math.min(t.width*.94/n.width,t.height*.8/n.height);i.style.scale=String(Math.max(1,r));let s=i.querySelector(`.scene-img`);s&&(s.sizes=`400vw`),e.classList.add(`is-playing`),setTimeout(()=>{j&&(M(),N(),o.hidden=!1,p.hidden=!1,l.hidden=!1,c.querySelector(`button`).focus({preventScroll:!0}))},m.matches?0:920)}function I(){j&&(j=!1,N(),o.hidden=!0,p.hidden=!0,l.hidden=!0,i.style.scale=``,e.classList.remove(`is-playing`),r.focus({preventScroll:!0}))}r.addEventListener(`click`,F),o.addEventListener(`click`,e=>{let t=e.target.closest(`.osd-menu button`);t&&P(t)}),l.addEventListener(`click`,e=>{let t=e.target,n=t.closest(`.osd-num`);n?P(c.querySelectorAll(`button`)[Number(n.dataset.n)]):t.closest(`.osd-back`)?N():t.closest(`.osd-off`)&&I()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&I()}),window.addEventListener(`resize`,()=>{j&&M()}),new IntersectionObserver(([e])=>{e.isIntersecting||I()},{threshold:.3}).observe(e)}function t(e,t){let n=null,r=[...document.querySelectorAll(`.spot[data-sound]`)],i=[...new Set(r.flatMap(e=>[e.dataset.sound,e.dataset.fallback??``]).filter(Boolean))],a=new Map,o=null,s=sessionStorage.getItem(`sound`)!==`off`,c=null;window.__sound=()=>({on:s,ctx:o?.state??`none`,buffers:a.size,stored:sessionStorage.getItem(`sound`)});let l=()=>{t.setAttribute(`aria-pressed`,String(s)),t.classList.toggle(`off`,!s),t.textContent=s?`On`:`Off`};l();let u=new Map,d=e=>!e||!o?Promise.resolve():(u.has(e)||u.set(e,(async()=>{try{let t=await fetch(`/tube-berger-preview/sounds/${e}.mp3`);if(!t.ok)return;a.set(e,await o.decodeAudioData(await t.arrayBuffer()))}catch{}})()),u.get(e));async function f(){o||(o=new AudioContext({latencyHint:`interactive`}),Promise.all(i.map(d)).then(()=>{n&&m(p(n))})),o.state!==`running`&&await o.resume().catch(()=>{})}for(let e of[`pointerdown`,`mousedown`,`click`,`touchend`,`keydown`])window.addEventListener(e,()=>{s&&f()},{passive:!0});let p=e=>a.has(e.dataset.sound)?e.dataset.sound:e.dataset.fallback??``;function m(e){let t=a.get(e);if(!s||!o||o.state!==`running`||!t)return;let n=o.currentTime;c&&(c.gain.gain.cancelScheduledValues(n),c.gain.gain.setTargetAtTime(0,n,.02),c.src.stop(n+.12));let r=o.createBufferSource();r.buffer=t;let i=o.createGain();i.gain.setValueAtTime(0,n),i.gain.linearRampToValueAtTime(.7,n+.006),r.connect(i).connect(o.destination),r.start(n),c={src:r,gain:i}}let h=-1e9;window.addEventListener(`touchstart`,()=>{h=performance.now()},{passive:!0});for(let e of r){let t=()=>{m(p(e)),e.classList.remove(`flash`),e.offsetWidth,e.classList.add(`flash`)};if(e.dataset.trigger===`click`){let n=()=>{e.classList.remove(`flash`),e.offsetWidth,e.classList.add(`flash`)};e.addEventListener(`pointerenter`,e=>{e.pointerType!==`touch`&&n()}),e.addEventListener(`click`,async()=>{await f(),await d(e.dataset.sound),a.has(e.dataset.sound)||await d(e.dataset.fallback??``),t()})}else e.addEventListener(`pointerenter`,r=>{n=e,r.pointerType!==`touch`&&t()}),e.addEventListener(`pointerleave`,()=>{n===e&&(n=null)}),e.addEventListener(`click`,async()=>{performance.now()-h>1e3||(await f(),await d(e.dataset.sound),a.has(e.dataset.sound)||await d(e.dataset.fallback??``),t())}),e.addEventListener(`focus`,t)}t.addEventListener(`click`,()=>{s=!s,sessionStorage.setItem(`sound`,s?`on`:`off`),l(),s?f().then(()=>d(`tv`)).then(()=>m(`tv`)):c&&o&&c.gain.gain.setTargetAtTime(0,o.currentTime,.02)})}function n(e){let t=e.querySelector(`.holo-canvas`),n=e.querySelector(`.holo-img`);if(!t||!n)return null;let r=window.matchMedia(`(prefers-reduced-motion: reduce)`),i=(e,t)=>e+Math.random()*(t-e),a=t.getContext(`webgl`,{antialias:!1,alpha:!0,premultipliedAlpha:!0});if(!a)return null;let o=(e,t)=>{let n=a.createShader(e);return a.shaderSource(n,t),a.compileShader(n),n},s=a.createProgram();if(a.attachShader(s,o(a.VERTEX_SHADER,`attribute vec2 p; varying vec2 v; void main(){ v = p*.5+.5; gl_Position = vec4(p,0.,1.); }`)),a.attachShader(s,o(a.FRAGMENT_SHADER,`precision mediump float;
uniform sampler2D T; uniform vec2 R; uniform float t, g, gy, fl, pad; varying vec2 v;
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
float n1(float x){ float i=floor(x), f=fract(x); f=f*f*(3.-2.*f); return mix(h(vec2(i,.5)), h(vec2(i+1.,.5)), f); }
// Deckkraft des Logos; es ist kleiner als die Fläche, damit der Schein Platz hat
float A(vec2 u){
  vec2 q = (u-.5)*pad+.5;
  if(q.x<0.||q.x>1.||q.y<0.||q.y>1.) return 0.;
  return texture2D(T, q).a;
}
void main(){
  vec2 u = vec2(v.x, 1.-v.y);
  float line = floor(u.y*R.y*.5), fr = floor(t*24.), px = 1./R.x;
  // ruhiges Schwanken plus Zittern jeder Zeile
  float w = (n1(u.y*5.+t*.7)-.5)*.006 + (h(vec2(line,fr))-.5)*.0025;
  // Störung: ein Band reißt seitlich aus, das ganze Bild verrutscht in Streifen
  float band = smoothstep(.1,0.,abs(u.y-gy))*g;
  w += band*(h(vec2(floor(u.y*46.),fr))-.5)*.3 + g*(h(vec2(floor(u.y*9.),fr+5.))-.5)*.05;
  u.x += w;
  u.y += g*(h(vec2(fr,2.))-.5)*.04;
  float sp = px*(2.5+16.*g);
  float a = A(u), ar = A(u+vec2(sp,0.)), ab = A(u-vec2(sp,0.));
  // Schein um das Logo
  float halo = 0.;
  for(int i=0;i<8;i++){
    float an = float(i)*.7854; vec2 d = vec2(cos(an), sin(an)*R.x/R.y);
    halo += A(u+d*px*9.) + A(u+d*px*22.);
  }
  halo /= 16.;
  // Zeilenraster, das langsam durchläuft, und Rauschen im Licht
  float scan = .62 + .38*sin(u.y*R.y*1.5708 - t*9.);
  float nz = h(u*R+fr);
  // Helle Ursprungsfarbe (Arndt, 24.11.2026): blasses Eisblau mit fast
  // weißem Kern. Damit es vor der hellen Wand lesbar bleibt, liegt darunter
  // ein weicher, tieferer blauer Schein.
  float sn = h(vec2(floor(u.x*R.x*.5)+fr*7., line));
  vec3 c = vec3(.5,.84,1.);
  c += vec3(.4,-.2,0.)*clamp(ar-a,0.,1.) + vec3(-.2,.1,0.)*clamp(ab-a,0.,1.);
  c = mix(c, vec3(.88,.97,1.), a*ar*ab*scan*.7);
  float la = max(a, max(ar, ab))*(.62+.38*scan)*(.85+.3*nz) + band*step(.55, sn)*.4;
  // ausgefallene Zeilen
  if(h(vec2(line, fr+17.)) > .985-.25*g) la *= .15;
  float k = min(fl, 1.);
  la = clamp(la*k, 0., 1.);
  float ha = clamp(halo*.6*k, 0., 1.)*(1.-la);
  vec3 o = clamp(c*(.9+.15*fl),0.,1.)*la + vec3(.16,.5,1.)*ha;
  gl_FragColor = vec4(o, la+ha);
}`)),a.linkProgram(s),a.useProgram(s),!a.getProgramParameter(s,a.LINK_STATUS))return console.error(`Holo-Shader:`,a.getProgramInfoLog(s)),null;a.bindBuffer(a.ARRAY_BUFFER,a.createBuffer()),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),a.STATIC_DRAW);let c=a.getAttribLocation(s,`p`);a.enableVertexAttribArray(c),a.vertexAttribPointer(c,2,a.FLOAT,!1,0,0),a.bindTexture(a.TEXTURE_2D,a.createTexture());for(let[e,t]of[[a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE],[a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE],[a.TEXTURE_MIN_FILTER,a.LINEAR],[a.TEXTURE_MAG_FILTER,a.LINEAR]])a.texParameteri(a.TEXTURE_2D,e,t);let l={};for(let e of[`R`,`t`,`g`,`gy`,`fl`,`pad`])l[e]=a.getUniformLocation(s,e);a.uniform2f(l.R,t.width,t.height),a.uniform1f(l.pad,1.3),a.clearColor(0,0,0,0);let u=!1,d=!0,f=!1,p=0,m=.5,h=0,g=performance.now()+1200,_=1,v=0,y=0,b=0;function x(e){a.uniform1f(l.t,e/1e3%600),a.uniform1f(l.g,p),a.uniform1f(l.gy,m),a.uniform1f(l.fl,_),a.clear(a.COLOR_BUFFER_BIT),a.drawArrays(a.TRIANGLE_STRIP,0,4)}function S(e){if(!d||!u){f=!1;return}e>g&&(h=e+i(90,420),g=e+i(900,4200),m=i(.2,.8),Math.random()<.3&&(v=Math.floor(i(2,9))));let t=e<h;t||(b=0),p+=((t?1+b:0)-p)*.45;let n=.86+.14*Math.sin(e/900);v>0?(v--,_=i(.05,.3),v===0&&(y=10)):y>0?(y--,_=n+y*.06):_=t?i(.5,1.35):n+i(-.06,.06),x(e),requestAnimationFrame(S)}function C(){u&&(r.matches?(p=0,_=.95,x(0)):f||(f=!0,requestAnimationFrame(S)))}function w(){a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0),a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,n),u=!0,e.classList.add(`has-holo`),C()}return n.complete&&n.naturalWidth?w():n.addEventListener(`load`,w,{once:!0}),new IntersectionObserver(([e])=>{d=e.isIntersecting,d&&C()},{threshold:.05}).observe(e),{glitch(){if(!u||r.matches)return;let e=performance.now();b=.8,h=e+600,g=h+i(1500,4200),m=i(.25,.75),v=4,C()}}}var r=document.querySelector(`.room`),i=n(document.querySelector(`.pod`));document.querySelector(`.pod-spot[data-id="pod-console"]`)?.addEventListener(`click`,()=>i?.glitch()),e(r),t(r,document.querySelector(`.btn-sound`));var a=window.matchMedia(`(prefers-reduced-motion: reduce)`),o=r.querySelector(`.room-caption`);for(let e of r.querySelectorAll(`.spot`)){if(!e.dataset.caption)continue;let t=()=>{o.textContent=e.dataset.caption,o.classList.add(`on`)},n=()=>o.classList.remove(`on`);e.addEventListener(`pointerenter`,t),e.addEventListener(`focus`,t),e.addEventListener(`pointerleave`,n),e.addEventListener(`blur`,n)}{let e=r.querySelector(`.scene`),t=parseFloat(r.style.getPropertyValue(`--focus`))/100,n=0,i=i=>{let a=r.clientWidth,o=e.offsetWidth,s=a/2-t*o;n=o<=a?0:Math.min(-s,Math.max(a-o-s,i)),r.style.setProperty(`--pan`,`${n}px`)},a=null,o=0,s=0,c=0;r.addEventListener(`touchstart`,e=>{e.touches.length!==1||r.classList.contains(`is-playing`)?a=`y`:(a=null,o=e.touches[0].clientX,s=e.touches[0].clientY,c=n)},{passive:!0}),r.addEventListener(`touchmove`,t=>{if(a===`y`||e.offsetWidth<=r.clientWidth)return;let n=t.touches[0].clientX-o,l=t.touches[0].clientY-s;if(!a){if(Math.abs(n)<6&&Math.abs(l)<6||(a=Math.abs(n)>Math.abs(l)?`x`:`y`,a===`y`))return;r.classList.add(`is-panning`)}t.cancelable&&t.preventDefault(),i(c+n)},{passive:!1});let l=()=>{a=null,r.classList.remove(`is-panning`)};r.addEventListener(`touchend`,l),r.addEventListener(`touchcancel`,l),window.addEventListener(`resize`,()=>i(n)),r.querySelector(`.tv-btn, .spot[data-id="tv"]`)?.addEventListener(`click`,()=>i(0),{capture:!0})}var s=document.querySelector(`.club-film`);if(s&&!a.matches){let e=!1;new IntersectionObserver(([t])=>{e=t.isIntersecting,e?(s.src||=s.dataset.src,s.play().catch(()=>{})):s.pause()},{threshold:.2}).observe(s);for(let t of[`touchend`,`click`])window.addEventListener(t,()=>{e&&s.paused&&s.play().catch(()=>{})},{passive:!0})}{let e=document.querySelector(`.player`),t=e.querySelector(`.player-slot`),n=[...document.querySelectorAll(`.play`)],r=()=>{t.replaceChildren(),e.hidden=!0,document.body.classList.remove(`has-player`),n.forEach(e=>e.removeAttribute(`aria-pressed`))};for(let i of n)i.addEventListener(`click`,()=>{if(i.getAttribute(`aria-pressed`)===`true`){r();return}let a=document.createElement(`iframe`);a.src=`https://open.spotify.com/embed/track/${i.dataset.track}?theme=0`,a.title=`${i.dataset.title} on Spotify`,a.height=`80`,a.allow=`autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture`,t.replaceChildren(a),e.hidden=!1,document.body.classList.add(`has-player`),n.forEach(e=>e.setAttribute(`aria-pressed`,String(e===i)))});e.querySelector(`.player-close`).addEventListener(`click`,r)}for(let e of document.querySelectorAll(`.embed`))e.querySelector(`button`).addEventListener(`click`,()=>{let t=document.createElement(`iframe`);t.src=e.dataset.embed,t.title=e.dataset.title,t.height=e.dataset.h,t.allow=`autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture`,t.loading=`lazy`,e.replaceChildren(t)},{once:!0});var c=0;function l(e){let t=window.scrollY,n=e-t;if(a.matches||Math.abs(n)<4){window.scrollTo(0,e);return}let r=Math.min(2800,Math.max(1e3,Math.abs(n)*.9)),i=performance.now(),o=++c,s=e=>{if(o!==c)return;let a=Math.min(1,(e-i)/r),l=a<.5?4*a*a*a:1-(-2*a+2)**3/2;window.scrollTo(0,t+n*l),a<1&&requestAnimationFrame(s)};requestAnimationFrame(s)}for(let e of[`wheel`,`touchstart`,`keydown`])window.addEventListener(e,()=>{c++},{passive:!0});document.addEventListener(`click`,e=>{let t=e.target.closest(`a[href^="#"]`),n=t&&document.querySelector(t.getAttribute(`href`));if(!t||!n)return;e.preventDefault();let r=document.querySelector(`.bar`).offsetHeight,i=n.id===`top`?0:n.getBoundingClientRect().top+window.scrollY-r-12;l(Math.min(i,document.documentElement.scrollHeight-window.innerHeight)),history.replaceState(null,``,t.getAttribute(`href`)),n.setAttribute(`tabindex`,`-1`),n.focus({preventScroll:!0})});