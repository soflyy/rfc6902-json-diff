'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var B = require('fast-array-diff/dist/diff/lcs');
var U = require('fast-deep-equal');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var B__default = /*#__PURE__*/_interopDefaultLegacy(B);
var U__default = /*#__PURE__*/_interopDefaultLegacy(U);

var g={};function $(t,e,a="",p=[]){let n=Object.keys(t),o=Object.keys(e);if(n.length===0&&o.length===0)return p;for(let r=n.length-1;r>=0;r--){let s=n[r];i(t[s],e[s],`${a}/${s}`,s in e,p);}for(let r=0;r<o.length;r++){let s=o[r];!(s in t)&&e[s]!==void 0&&p.push({op:"add",path:`${a}/${s}`,value:e[s]});}return p}function A(t,e,a="",p=[]){return L(t,e,U__default["default"],a,p)}function L(t,e,a=(o,r)=>o===r,p,n=[]){let o=null,r=null,s=[],m=0,f=0,k=-1,C=[];function F(O,x,c,h,b,R,w){if(O==="same"){if(k++,r!==null)for(let u=0;u<r.items.length;u++)C.push({op:"remove",path:`${p}/${r.oldPos}`});if(o!==null)for(let u=0;u<o.items.length;u++)C.push({op:"add",value:o.items[u],path:`${p}/${o.oldPos+u}`});s!==null&&C.push(...s),r=null,o=null,s=[];}else if(O==="remove"){let u=c-f+m;if(r===null&&(r={type:"remove",oldPos:u,newPos:R,items:[]}),o!==null)for(let l=c,d=0;l<h;++l,d++){let y=o.items.shift();if(y){m--;let T=x[l],v=i(T,y,`${p}/${c+d}`);s.push(...v),r.oldPos++;}else r.items.push(x[l]),f++;}else for(let l=c;l<h;++l)r.items.push(x[l]),f++;}else if(O==="add"){let u=c-f+m;if(o===null&&(o={type:"add",oldPos:u,newPos:R,items:[]}),r!==null)for(let l=R,d=0;l<w;++l,d++){let y=r.items.shift();if(y){f--;let T=y,P=b[l],v=i(T,P,`${p}/${u+d}`);s.push(...v),o.oldPos++;}else o.items.push(b[l]),m++;}else for(let l=R;l<w;++l)o.items.push(b[l]),m++;}}return B__default["default"](t,e,a,F),F("same",[],0,0,[],0,0),k>0?n.push(...C):n.push({op:"replace",path:p,value:e}),n}function I(t,e,a="",p=[]){let n=t.length,o=e.length;return n===0&&o===0?p:n===0?(p.push({op:"add",path:a,value:e}),p):o===0?(p.push({op:"replace",path:a,value:t}),p):n===1&&o===1?i(t[0],e[0],`${a}/0`,!0,p):A(t,e,a,p)}function i(t,e,a="",p=!1,n=[]){if(Object.is(t,e))return n;if(!p&&t!==void 0&&e===void 0)return n.push({op:"remove",path:a}),n;let o=t===null?"null":typeof t,r=e===null?"null":typeof e,s=o==="object"&&Array.isArray(t),m=r==="object"&&Array.isArray(e);return o!==r||s!==m?(n.push({op:"replace",path:a,value:e}),n):s&&m?(I(t,e,a,n),n):o==="object"?($(t,e,a,n),n):(n.push({op:"replace",path:a,value:e}),n)}function Y(t,e){return i(t,e)}

exports.RFC6902 = g;
exports.compare = Y;
exports.diffArrays = I;
exports.diffArraysUsingLcs = A;
exports.diffObjects = $;
exports.diffUnknownValues = i;
exports.getLcsBasedOperations = L;
