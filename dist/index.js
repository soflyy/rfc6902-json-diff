'use strict';

var _={};function g(n,e,r,t="",i=[]){let o=Object.keys(n),a=Object.keys(e);if(o.length===0&&a.length===0)return i;for(let p=o.length-1;p>=0;p--){let u=o[p];v(n[u],e[u],r,`${t}/${u}`,u in e,i);}for(let p=0;p<a.length;p++){let u=a[p];!(u in n)&&e[u]!==void 0&&i.push({op:"add",path:`${t}/${u}`,value:e[u]});}return i}function q(n,e){let{b:r,eq:t,stack_base:i}=n,{i:o,N:a,j:p,M:u,Z:s,stack_top:l}=n;for(;;){if(e===0){e:for(;a>0&&u>0;){r.fill(0,0,2*s);let x=a-u,w=a+u,y=w&1,T=o+a-1,I=p+u-1,S=(w+y)/2,d;n:for(let m=0;m<=S;m++){let b=2*Math.max(0,m-u)-m,h=m-2*Math.max(0,m-a);for(let c=b;c<=h;c+=2){let A=r[c-1-s*Math.floor((c-1)/s)],F=r[c+1-s*Math.floor((c+1)/s)],C=c===-m||c!==m&&A<F?F:A+1,O=C-c,f=C,k=O;for(;f<a&&k<u&&t(o+f,p+k);)f++,k++;if(r[c-s*Math.floor(c/s)]=f,y===1&&(d=x-c)>=1-m&&d<m&&f+r[s+d-s*Math.floor(d/s)]>=a)if(m>1||f!==C){i[l++]=o+f,i[l++]=a-f,i[l++]=p+k,i[l++]=u-k,a=C,u=O,s=2*(Math.min(a,u)+1);continue e}else break n}for(let c=b;c<=h;c+=2){let A=r[s+c-1-s*Math.floor((c-1)/s)],F=r[s+c+1-s*Math.floor((c+1)/s)],C=c===-m||c!==m&&A<F?F:A+1,O=C-c,f=C,k=O;for(;f<a&&k<u&&t(T-f,I-k);)f++,k++;if(r[s+c-s*Math.floor(c/s)]=f,y===0&&(d=x-c)>=-m&&d<=m&&f+r[d-s*Math.floor(d/s)]>=a)if(m>0||f!==C){i[l++]=o+a-C,i[l++]=C,i[l++]=p+u-O,i[l++]=O,a=a-f,u=u-k,s=2*(Math.min(a,u)+1);continue e}else break n}}if(a!==u){u>a?(o+=a,p+=a,u-=a,a=0):(o+=u,p+=u,a-=u,u=0);break}}if(a+u!==0)if(n.pxe===o||n.pye===p)n.pxe=o+a,n.pye=p+u;else {let x=n.pxs;if(n.oxs=n.pxs,n.oxe=n.pxe,n.oys=n.pys,n.oye=n.pye,n.pxs=o,n.pxe=o+a,n.pys=p,n.pye=p+u,x>=0)return n.i=o,n.N=a,n.j=p,n.M=u,n.Z=s,n.stack_top=l,1}}if(e===0||e===1){if(l===0)return 2;u=i[--l],p=i[--l],a=i[--l],o=i[--l],s=2*(Math.min(a,u)+1),e=0;}}}var M=class{constructor(e){this.state=e;this.c=0;}[Symbol.iterator](){return this}next(){let{state:e}=this;if(this.c>1)return {done:!0,value:void 0};let r=q(e,this.c);return this.c=r,r===1?{done:!1,value:[e.oxs,e.oxe,e.oys,e.oye]}:e.pxs>=0?{done:!1,value:[e.pxs,e.pxe,e.pys,e.pye]}:{done:!0,value:void 0}}};function E(n,e,r,t,i){let o=(Math.min(e,t)+1)*2,a=e+t,p=new(a<256?Uint8Array:a<65536?Uint16Array:Uint32Array)(2*o);return new M({i:n,N:e,j:r,M:t,Z:o,b:p,eq:i,pxs:-1,pxe:-1,pys:-1,pye:-1,oxs:-1,oxe:-1,oys:-1,oye:-1,stack_top:0,stack_base:[]})}function L(n,e,r){let[t,i,o]=[0,n.length,e.length],a=r??((p,u)=>n[p]===e[u]);for(;t<i&&t<o&&a(t,t);)t++;if(t===i&&t===o)return [][Symbol.iterator]();for(;a(--i,--o)&&i>t&&o>t;);return E(t,i+1-t,t,o+1-t,a)}function*j(n,e,r){let t=ArrayBuffer.isView(n)?Uint8Array.prototype.subarray:n.slice;for(let i of L(n,e,r))i[2]=t.call(e,i[2],i[3]),yield i;}function V(n,e,r,t="",i=[],o=!1){return D(n,e,r,t,i,o)}function P(n,e,r,t,i){for(let o of n)switch(o.type){case"add":{e.push({op:"add",path:`${r}/${o.totalShiftedIdx}`,value:o.value});break}case"remove":{let a=o.totalShiftedIdx-o.sourceArrayRemovalBatchPosition;e.push({op:"remove",path:`${r}/${a}`});break}case"replace":{v(o.removedValue,o.value,t,`${r}/${o.shiftedIdx}`,!0,e,i);break}case"move":{e.push({op:"move",path:`${r}/${o.toShiftedIdx}`,from:`${r}/${o.fromShiftedIdx}`});break}}}function D(n,e,r,t,i=[],o=!1){let a=[],p=j(n,e,(w,y)=>r(n[w],e[y])),u=0,s=0,l=0,x=0;for(let w of p){let[y,T]=w,[,,I]=w;y+=s-u,T+=s-u,x!==y&&(l+=y-x),x=T;let S=0,d=0,m=0;for(let b=0,h=y;h<T;b++,h++)I[b]===void 0?(a.push({type:"remove",value:n[h],totalShiftedIdx:h,sourceArrayRemovalBatchPosition:d}),d++):(a.push({type:"replace",value:I[b],shiftedIdx:h,removedValue:n[h]}),m++);for(let b=m;b<I.length;b++)a.push({type:"add",value:I[b],totalShiftedIdx:y+b}),S++;s+=S,u+=d;}return x<n.length&&(l+=n.length-x),l<1?(i.push({op:"replace",path:t,value:e}),i):(P(a,i,t,r,o),i)}function B(n,e,r,t="",i=[],o=!1){let a=n.length,p=e.length;if(a===0&&p===0)return i;if(a===0){for(let u=0;u<e.length;u++)i.push({op:"add",path:`${t}/${u}`,value:e[u]});return i}return p===0?(i.push({op:"replace",path:t,value:e}),i):a===1&&p===1?v(n[0],e[0],r,`${t}/0`,!0,i):V(n,e,r,t,i,o)}function v(n,e,r,t="",i=!1,o=[],a=!1){if(Object.is(n,e))return o;if(!i&&n!==void 0&&e===void 0)return o.push({op:"remove",path:t}),o;let p=n===null?"null":typeof n,u=e===null?"null":typeof e,s=p==="object"&&Array.isArray(n),l=u==="object"&&Array.isArray(e);return p!==u||s!==l?(o.push({op:"replace",path:t,value:e}),o):s&&l?(B(n,e,r,t,o,a),o):p==="object"?(g(n,e,r,t,o),o):(o.push({op:"replace",path:t,value:e}),o)}var U=Object.prototype.hasOwnProperty;function R(n,e){if(n===e)return !0;let r,t;if(n&&e&&(r=n.constructor)===e.constructor){if(r===Date)return n.getTime()===e.getTime();if(r===RegExp)return n.toString()===e.toString();if(r===Array){if((t=n.length)===e.length)for(;t--&&R(n[t],e[t]););return t===-1}if(!r||typeof n=="object"){t=0;for(r in n)if(U.call(n,r)&&++t&&!U.call(e,r)||!(r in e)||!R(n[r],e[r]))return !1;return Object.keys(e).length===t}}return n!==n&&e!==e}function K(n){if(!n)return R;let e=new WeakMap;return (r,t)=>{var i,o,a,p;if(typeof r=="object"&&r!==null&&typeof t=="object"&&t!==null){if(e.has(r)&&((i=e.get(r))==null?void 0:i.includes(t))||e.has(t)&&((o=e.get(t))==null?void 0:o.includes(r)))return !0;let u=R(r,t);return u&&(e.has(r)?(a=e.get(r))==null||a.push(t):e.set(r,[t]),e.has(t)?(p=e.get(t))==null||p.push(r):e.set(t,[r])),u}else return R(r,t)}}function ue(n,e,r={}){let t=K(Boolean(r.doCaching));return v(n,e,t,"",!1,[],Boolean(r.detectMoveOperations))}

exports.RFC6902 = _;
exports.compare = ue;
exports.diffArrays = B;
exports.diffArraysUsingLcs = V;
exports.diffObjects = g;
exports.diffUnknownValues = v;
exports.getLcsBasedOperations = D;
