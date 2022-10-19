'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var B = require('fast-array-diff/dist/diff/lcs');
var U = require('fast-deep-equal');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var B__default = /*#__PURE__*/_interopDefaultLegacy(B);
var U__default = /*#__PURE__*/_interopDefaultLegacy(U);

var g={};function $(p,e,a="",t=[]){let r=Object.keys(p),o=Object.keys(e);if(r.length===0&&o.length===0)return t;for(let n=r.length-1;n>=0;n--){let s=r[n];i(p[s],e[s],`${a}/${s}`,s in e,t);}for(let n=0;n<o.length;n++){let s=o[n];!(s in p)&&e[s]!==void 0&&t.push({op:"add",path:`${a}/${s}`,value:e[s]});}return t}function A(p,e,a="",t=[]){return L(p,e,U__default["default"],a,t)}function L(p,e,a=(o,n)=>o===n,t,r=[]){let o=null,n=null,s=[],m=0,f=0,k=-1,C=[];function F(O,x,c,w,b,R,h){if(O==="same"){if(k++,n!==null)for(let u=0;u<n.items.length;u++)C.push({op:"remove",path:`${t}/${n.oldPos}`});if(o!==null)for(let u=0;u<o.items.length;u++)C.push({op:"add",value:o.items[u],path:`${t}/${o.oldPos+u}`});s!==null&&C.push(...s),n=null,o=null,s=[];}else if(O==="remove"){let u=c-f+m;if(n===null&&(n={type:"remove",oldPos:u,newPos:R,items:[]}),o!==null)for(let l=c,d=0;l<w;++l,d++){let y=o.items.shift();if(y){m--;let T=x[l],v=i(T,y,`${t}/${c+d}`);s.push(...v),n.oldPos++;}else n.items.push(x[l]),f++;}else for(let l=c;l<w;++l)n.items.push(x[l]),f++;}else if(O==="add"){let u=c-f+m;if(o===null&&(o={type:"add",oldPos:u,newPos:R,items:[]}),n!==null)for(let l=R,d=0;l<h;++l,d++){let y=n.items.shift();if(y){f--;let T=y,P=b[l],v=i(T,P,`${t}/${u+d}`);s.push(...v),o.oldPos++;}else o.items.push(b[l]),m++;}else for(let l=R;l<h;++l)o.items.push(b[l]),m++;}}return B__default["default"](p,e,a,F),F("same",[],0,0,[],0,0),k>0?r.push(...C):r.push({op:"replace",path:t,value:e}),r}function I(p,e,a="",t=[]){let r=p.length,o=e.length;return r===0&&o===0?t:r===0?(t.push({op:"add",path:a,value:e}),t):o===0?(t.push({op:"replace",path:a,value:e}),t):r===1&&o===1?i(p[0],e[0],`${a}/0`,!0,t):A(p,e,a,t)}function i(p,e,a="",t=!1,r=[]){if(Object.is(p,e))return r;if(!t&&p!==void 0&&e===void 0)return r.push({op:"remove",path:a}),r;let o=p===null?"null":typeof p,n=e===null?"null":typeof e,s=o==="object"&&Array.isArray(p),m=n==="object"&&Array.isArray(e);return o!==n||s!==m?(r.push({op:"replace",path:a,value:e}),r):s&&m?(I(p,e,a,r),r):o==="object"?($(p,e,a,r),r):(r.push({op:"replace",path:a,value:e}),r)}function Y(p,e){return i(p,e)}

exports.RFC6902 = g;
exports.compare = Y;
exports.diffArrays = I;
exports.diffArraysUsingLcs = A;
exports.diffObjects = $;
exports.diffUnknownValues = i;
exports.getLcsBasedOperations = L;
