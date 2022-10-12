'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var I = require('fast-array-diff/dist/diff/lcs');
var g = require('fast-deep-equal');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var I__default = /*#__PURE__*/_interopDefaultLegacy(I);
var g__default = /*#__PURE__*/_interopDefaultLegacy(g);

var A={};function h(t,e,a="",p=[]){let r=Object.getOwnPropertyNames(t),o=Object.getOwnPropertyNames(e);if(r.length===0&&o.length===0)return p;for(let n=r.length-1;n>=0;n--){let s=r[n];u(t[s],e[s],`${a}/${s}`,s in e,p);}for(let n=0;n<o.length;n++){let s=o[n];!(s in t)&&e[s]!==void 0&&p.push({op:"add",path:`${a}/${s}`,value:e[s]});}return p}function P(t,e,a="",p=[]){return B(t,e,g__default["default"],a,p)}function B(t,e,a=(o,n)=>o===n,p,r=[]){let o=null,n=null,s=[],m=0,f=0;function v(R,O,c,w,x,C,F){if(R==="same"){if(n!==null)for(let l=0;l<n.items.length;l++)r.push({op:"remove",path:`${p}/${n.oldPos}`});if(o!==null)for(let l=0;l<o.items.length;l++)r.push({op:"add",value:o.items[l],path:`${p}/${o.oldPos+l}`});s!==null&&r.push(...s),n=null,o=null,s=[];}else if(R==="remove"){let l=c-f+m;if(n===null&&(n={type:"remove",oldPos:l,newPos:C,items:[]}),o!==null)for(let i=c,d=0;i<w;++i,d++){let y=o.items.shift();if(y){m--;let b=O[i],T=u(b,y,`${p}/${c+d}`);s.push(...T),n.oldPos++;}else n.items.push(O[i]),f++;}else for(let i=c;i<w;++i)n.items.push(O[i]),f++;}else if(R==="add"){let l=c-f+m;if(o===null&&(o={type:"add",oldPos:l,newPos:C,items:[]}),n!==null)for(let i=C,d=0;i<F;++i,d++){let y=n.items.shift();if(y){f--;let b=y,k=x[i],T=u(b,k,`${p}/${l+d}`);s.push(...T),o.oldPos++;}else o.items.push(x[i]),m++;}else for(let i=C;i<F;++i)o.items.push(x[i]),m++;}}return I__default["default"](t,e,a,v),v("same",[],0,0,[],0,0),r}function $(t,e,a="",p=[]){let r=t.length,o=e.length;return r===0&&o===0?p:r===0?(p.push({op:"add",path:a,value:e}),p):o===0?(p.push({op:"replace",path:a,value:t}),p):r===1&&o===1?u(t[0],e[0],`${a}/0`,!0,p):P(t,e,a,p)}function u(t,e,a="",p=!1,r=[]){if(Object.is(t,e))return r;if(!p&&t!==void 0&&e===void 0)return r.push({op:"remove",path:a}),r;let o=t===null?"null":typeof t,n=e===null?"null":typeof e,s=o==="object"&&Array.isArray(t),m=n==="object"&&Array.isArray(e);return o!==n||s!==m?(r.push({op:"replace",path:a,value:e}),r):s&&m?($(t,e,a,r),r):o==="object"?(h(t,e,a,r),r):(r.push({op:"replace",path:a,value:e}),r)}function W(t,e){return u(t,e)}

exports.RFC6902 = A;
exports.compare = W;
exports.diffArrays = $;
exports.diffArraysUsingLcs = P;
exports.diffObjects = h;
exports.diffUnknownValues = u;
exports.getLcsBasedOperations = B;
