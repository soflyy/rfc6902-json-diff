var P={};function B(n,e,r,t="",o=[]){let i=Object.keys(n),a=Object.keys(e);if(i.length===0&&a.length===0)return o;for(let p=i.length-1;p>=0;p--){let u=i[p];C(n[u],e[u],r,`${t}/${u}`,u in e,o);}for(let p=0;p<a.length;p++){let u=a[p];!(u in n)&&e[u]!==void 0&&o.push({op:"add",path:`${t}/${u}`,value:e[u]});}return o}function _(n,e){let{b:r,eq:t,stack_base:o}=n,{i,N:a,j:p,M:u,Z:s,stack_top:l}=n;for(;;){if(e===0){e:for(;a>0&&u>0;){r.fill(0,0,2*s);let x=a-u,k=a+u,f=k&1,O=i+a-1,I=p+u-1,S=(k+f)/2,b;n:for(let m=0;m<=S;m++){let A=2*Math.max(0,m-u)-m,y=m-2*Math.max(0,m-a);for(let c=A;c<=y;c+=2){let T=r[c-1-s*Math.floor((c-1)/s)],F=r[c+1-s*Math.floor((c+1)/s)],v=c===-m||c!==m&&T<F?F:T+1,w=v-c,d=v,h=w;for(;d<a&&h<u&&t(i+d,p+h);)d++,h++;if(r[c-s*Math.floor(c/s)]=d,f===1&&(b=x-c)>=1-m&&b<m&&d+r[s+b-s*Math.floor(b/s)]>=a)if(m>1||d!==v){o[l++]=i+d,o[l++]=a-d,o[l++]=p+h,o[l++]=u-h,a=v,u=w,s=2*(Math.min(a,u)+1);continue e}else break n}for(let c=A;c<=y;c+=2){let T=r[s+c-1-s*Math.floor((c-1)/s)],F=r[s+c+1-s*Math.floor((c+1)/s)],v=c===-m||c!==m&&T<F?F:T+1,w=v-c,d=v,h=w;for(;d<a&&h<u&&t(O-d,I-h);)d++,h++;if(r[s+c-s*Math.floor(c/s)]=d,f===0&&(b=x-c)>=-m&&b<=m&&d+r[b-s*Math.floor(b/s)]>=a)if(m>0||d!==v){o[l++]=i+a-v,o[l++]=v,o[l++]=p+u-w,o[l++]=w,a=a-d,u=u-h,s=2*(Math.min(a,u)+1);continue e}else break n}}if(a!==u){u>a?(i+=a,p+=a,u-=a,a=0):(i+=u,p+=u,a-=u,u=0);break}}if(a+u!==0)if(n.pxe===i||n.pye===p)n.pxe=i+a,n.pye=p+u;else {let x=n.pxs;if(n.oxs=n.pxs,n.oxe=n.pxe,n.oys=n.pys,n.oye=n.pye,n.pxs=i,n.pxe=i+a,n.pys=p,n.pye=p+u,x>=0)return n.i=i,n.N=a,n.j=p,n.M=u,n.Z=s,n.stack_top=l,1}}if(e===0||e===1){if(l===0)return 2;u=o[--l],p=o[--l],a=o[--l],i=o[--l],s=2*(Math.min(a,u)+1),e=0;}}}var M=class{constructor(e){this.state=e;this.c=0;}[Symbol.iterator](){return this}next(){let{state:e}=this;if(this.c>1)return {done:!0,value:void 0};let r=_(e,this.c);return this.c=r,r===1?{done:!1,value:[e.oxs,e.oxe,e.oys,e.oye]}:e.pxs>=0?{done:!1,value:[e.pxs,e.pxe,e.pys,e.pye]}:{done:!0,value:void 0}}};function q(n,e,r,t,o){let i=(Math.min(e,t)+1)*2,a=e+t,p=new(a<256?Uint8Array:a<65536?Uint16Array:Uint32Array)(2*i);return new M({i:n,N:e,j:r,M:t,Z:i,b:p,eq:o,pxs:-1,pxe:-1,pys:-1,pye:-1,oxs:-1,oxe:-1,oys:-1,oye:-1,stack_top:0,stack_base:[]})}function E(n,e,r){let[t,o,i]=[0,n.length,e.length],a=r??((p,u)=>n[p]===e[u]);for(;t<o&&t<i&&a(t,t);)t++;if(t===o&&t===i)return [][Symbol.iterator]();for(;a(--o,--i)&&o>t&&i>t;);return q(t,o+1-t,t,i+1-t,a)}function*V(n,e,r){let t=ArrayBuffer.isView(n)?Uint8Array.prototype.subarray:n.slice;for(let o of E(n,e,r))o[2]=t.call(e,o[2],o[3]),yield o;}function j(n,e,r,t="",o=[],i=!1){return D(n,e,r,t,o,i)}function L(n,e,r,t,o){for(let i of n)switch(i.type){case"add":{e.push({op:"add",path:`${r}/${i.totalShiftedIdx}`,value:i.value});break}case"remove":{let a=i.shiftedIdx-i.sourceArrayRemovalBatchPosition;e.push({op:"remove",path:`${r}/${a}`});break}case"replace":{C(i.removedValue,i.value,t,`${r}/${i.shiftedIdx}`,!0,e,o);break}case"move":{e.push({op:"move",path:`${r}/${i.toShiftedIdx}`,from:`${r}/${i.fromShiftedIdx}`});break}}}function D(n,e,r,t,o=[],i=!1){let a=[],p=V(n,e,(k,f)=>r(n[k],e[f])),u=0,s=0,l=0,x=0;for(let k of p){let[f,O]=k,[,,I]=k,S=f;f+=s-u,O+=s-u,x!==f&&(l+=f-x),x=O;let b=0,m=0,A=0;for(let y=0,c=f;c<O;y++,c++)I[y]===void 0?(a.push({type:"remove",shiftedIdx:c,sourceArrayRemovalBatchStartIdx:S,sourceArrayRemovalBatchPosition:m}),m++):(a.push({type:"replace",value:I[y],shiftedIdx:c,removedValue:n[S+y]}),A++);for(let y=A;y<I.length;y++)a.push({type:"add",value:I[y],totalShiftedIdx:f+y}),b++;s+=b,u+=m;}return x<n.length&&(l+=n.length-x),l<1?(o.push({op:"replace",path:t,value:e}),o):(i&&K(a,r,n),L(a,o,t,r,i),o)}function K(n,e,r){for(let t=n.length-1;t>=0;t--){let o=n[t];if(o.type!=="add"&&o.type!=="remove")continue;let i=o.type==="add"?o.value:r[o.sourceArrayRemovalBatchStartIdx+o.sourceArrayRemovalBatchPosition];for(let a=t-1;a>=0;a--){let p=n[a];if(p.type===o.type||p.type!=="add"&&p.type!=="remove")continue;let u=p.type==="add"?p.value:r[p.sourceArrayRemovalBatchStartIdx+p.sourceArrayRemovalBatchPosition];if(!e(i,u))continue;let s=o.type==="add"?o:p,l=o.type==="remove"?o:p;n[a]={type:"move",fromShiftedIdx:l.shiftedIdx,toShiftedIdx:s.totalShiftedIdx,value:s.value},n.splice(t,1);break}}}function $(n,e,r,t="",o=[],i=!1){let a=n.length,p=e.length;if(a===0&&p===0)return o;if(a===0){for(let u=0;u<e.length;u++)o.push({op:"add",path:`${t}/${u}`,value:e[u]});return o}return p===0?(o.push({op:"replace",path:t,value:e}),o):a===1&&p===1?C(n[0],e[0],r,`${t}/0`,!0,o):j(n,e,r,t,o,i)}function C(n,e,r,t="",o=!1,i=[],a=!1){if(Object.is(n,e))return i;if(!o&&n!==void 0&&e===void 0)return i.push({op:"remove",path:t}),i;let p=n===null?"null":typeof n,u=e===null?"null":typeof e,s=p==="object"&&Array.isArray(n),l=u==="object"&&Array.isArray(e);return p!==u||s!==l?(i.push({op:"replace",path:t,value:e}),i):s&&l?($(n,e,r,t,i,a),i):p==="object"?(B(n,e,r,t,i),i):(i.push({op:"replace",path:t,value:e}),i)}var U=Object.prototype.hasOwnProperty;function R(n,e){if(n===e)return !0;let r,t;if(n&&e&&(r=n.constructor)===e.constructor){if(r===Date)return n.getTime()===e.getTime();if(r===RegExp)return n.toString()===e.toString();if(r===Array){if((t=n.length)===e.length)for(;t--&&R(n[t],e[t]););return t===-1}if(!r||typeof n=="object"){t=0;for(r in n)if(U.call(n,r)&&++t&&!U.call(e,r)||!(r in e)||!R(n[r],e[r]))return !1;return Object.keys(e).length===t}}return n!==n&&e!==e}function N(n){if(!n)return R;let e=new WeakMap;return (r,t)=>{if(typeof r=="object"&&r!==null&&typeof t=="object"&&t!==null){if(e.has(r)&&e.get(r)?.includes(t)||e.has(t)&&e.get(t)?.includes(r))return !0;let o=R(r,t);return o&&(e.has(r)?e.get(r)?.push(t):e.set(r,[t]),e.has(t)?e.get(t)?.push(r):e.set(t,[r])),o}else return R(r,t)}}function ue(n,e,r={}){let t=N(Boolean(r.doCaching));return C(n,e,t,"",!1,[],Boolean(r.detectMoveOperations))}

export { P as RFC6902, ue as compare, $ as diffArrays, j as diffArraysUsingLcs, B as diffObjects, C as diffUnknownValues, D as getLcsBasedOperations };
