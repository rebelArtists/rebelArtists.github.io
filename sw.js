if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise((async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},s=(s,r)=>{Promise.all(s.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(s)};self.define=(s,i,a)=>{r[s]||(r[s]=Promise.resolve().then((()=>{let r={};const c={uri:location.origin+s.slice(1)};return Promise.all(i.map((s=>{switch(s){case"exports":return r;case"module":return c;default:return e(s)}}))).then((e=>{const s=a(...e);return r.default||(r.default=s),r}))})))}}define("./sw.js",["./workbox-7ce2238d"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/404.a9a6e4f2.css",revision:"2bd416b9b908fd1896a32bc6679822c5"},{url:"assets/404.e835ef60.js",revision:"2847e63f5a6967f296ba1e982908d8ac"},{url:"assets/CrowdsaleComp.a03a3355.js",revision:"0cdab25682e6ce55d7e2fe76cb1f59b5"},{url:"assets/CrowdsaleComp.e046f00b.css",revision:"0f38c12616f50fc006c21b90d7b44103"},{url:"assets/index.3a7766ab.js",revision:"56a6e383a0432a4664f07f82c0415da2"},{url:"assets/index.498ab9da.css",revision:"6ec3e3753a3a8a02874d8263b5a2ba88"},{url:"assets/mdb.umd.min.72a548b4.css",revision:"bdde5b5e28bf0bf04f29e95276620657"},{url:"assets/mdb.umd.min.8982d985.js",revision:"0d7851fe52d242beb507438eebbf1e8b"},{url:"assets/VAbout.1a2abd1d.css",revision:"a8a8ef4369e3457c9bb9c5667278bd61"},{url:"assets/VAbout.317c1ce5.js",revision:"3a651ae038349614f06ce7c5e678010a"},{url:"assets/vendor.1b9cd890.css",revision:"b2eda931afa5522db8c5fd4a305f11c7"},{url:"assets/vendor.904bcd4c.js",revision:"f8221942a0472236685a9bb81c1023ca"},{url:"assets/VFeed.3cb17118.css",revision:"871a5698c446bdd9fc4971d804096f65"},{url:"assets/VFeed.4e4e31ae.js",revision:"1c9c50632bb575d0747308d47c65ee0d"},{url:"assets/VPost.74df2816.js",revision:"ee0b3a66fbbf6f004699496e50d6b1cc"},{url:"assets/VPost.81f6d8d0.css",revision:"17e8378fda44bad13bac52d227d65183"},{url:"assets/VUser.0816751d.css",revision:"3156d2ef160bf437274f328eed52f5bf"},{url:"assets/VUser.9984e31c.js",revision:"c2442feb731796fde7fd6665f516c385"},{url:"index.html",revision:"9b8f52bf3b3c60a37d04a4888d39c343"},{url:"icons/icon-192x192.png",revision:"7c37ea90faf169cb14418fcbaabf1dcb"},{url:"icons/icon-256x256.png",revision:"b72cae97330e16e885486afcc30eca79"},{url:"icons/icon-384x384.png",revision:"069dfa0bffa10e0a28930ca61a0eec19"},{url:"icons/icon-512x512.png",revision:"291e7f103c832375cbee915d27e6d56d"},{url:"manifest.webmanifest",revision:"d2b1d164d0fee3c9528626922b2b7735"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
//# sourceMappingURL=sw.js.map
