'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var O = require('fast-array-diff/dist/diff/lcs');
var b = require('fast-deep-equal');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var O__default = /*#__PURE__*/_interopDefaultLegacy(O);
var b__default = /*#__PURE__*/_interopDefaultLegacy(b);

var I={};function x(e,t,n="",r=[]){let o=Object.keys(e),i=Object.keys(t);if(o.length===0&&i.length===0)return r;for(let a=o.length-1;a>=0;a--){let d=o[a];u(e[d],t[d],`${n}/${d}`,d in t,r);}for(let a=0;a<i.length;a++){let d=i[a];!(d in e)&&t[d]!==void 0&&r.push({op:"add",path:`${n}/${d}`,value:t[d]});}return r}function v(e,t,n="",r=[],o=!1){return R(e,t,b__default["default"],n,r,o)}function R(e,t,n,r,o=[],i=!1){let a=-1,d=[];function f(p,s,y,l,A,C,h){p==="same"&&a++,d.push({type:p,oldStart:y,oldEnd:l,newStart:C,newEnd:h});}if(O__default["default"](e,t,n,f),f("same",[],0,0,[],0,0),a<=0)return o.push({op:"replace",path:r,value:t}),o;let m=[];for(let p of d){let s=p.oldStart;p.type==="remove"?e.slice(p.oldStart,p.oldEnd).forEach(l=>{m.push({type:"remove",value:l,idx:s,shiftedIdx:0,shiftedRemovalIdx:0});}):p.type==="add"&&t.slice(p.newStart,p.newEnd).forEach(l=>{m.push({type:"add",value:l,idx:s,shiftedIdx:0});});}k(m),w(m),i&&S(m,n);for(let p of m)p.type==="remove"?o.push({op:"remove",path:`${r}/${p.shiftedRemovalIdx}`}):p.type==="add"?o.push({op:"add",path:`${r}/${p.shiftedIdx}`,value:p.value}):p.type==="move"?o.push({op:"move",path:`${r}/${p.toShiftedIdx}`,from:`${r}/${p.fromShiftedIdx}`}):p.type==="replace"&&u(e[p.shiftedIdx],p.value,`${r}/${p.shiftedIdx}`,!0,o,i);return o}function w(e){for(let t=e.length-1;t>=0;t--)if(!(e[t].type!=="add"&&e[t].type!=="remove"))for(let n=t-1;n>=0;n--){if(e[n].type===e[t].type||e[n].type!=="add"&&e[n].type!=="remove")continue;let r=e[t].type==="add"?e[t]:e[n],o=e[t].type==="remove"?e[t]:e[n];if(r.shiftedIdx===o.shiftedIdx){e[n]={type:"replace",value:r.value,shiftedIdx:o.shiftedIdx},e.splice(t,1);break}}}function S(e,t){for(let n=0;n<e.length;n++)if(!(e[n].type!=="add"&&e[n].type!=="remove"))for(let r=e.length-1;r>n;r--){if(e[r].type===e[n].type||e[r].type!=="add"&&e[r].type!=="remove"||!t(e[n].value,e[r].value))continue;let o=e[n].type==="add"?e[n]:e[r],i=e[n].type==="remove"?e[n]:e[r],a=0,d=i.idx>o.idx?-1:0;e[n]={type:"move",fromShiftedIdx:i.shiftedIdx+d,toShiftedIdx:o.shiftedIdx+a,value:o.value},e.splice(r,1);}}function k(e){let t=0,n=0,r=[];for(let o of e){if(o.type!=="add"&&o.type!=="remove")continue;let i=o.idx;r[i]===void 0&&(r[i]={additionsIdxShift:0,removalsIdxShift:0});let a=t-n,d=r[i].additionsIdxShift-r[i].removalsIdxShift,f=a-d;o.type==="add"?(o.idx+=r[i].additionsIdxShift,o.shiftedIdx=o.idx+f,t++,r[i].additionsIdxShift++):o.type==="remove"&&(o.idx+=r[i].removalsIdxShift,o.shiftedIdx=o.idx+f,o.shiftedRemovalIdx=i+f,n++,r[i].removalsIdxShift++);}}function c(e,t,n="",r=[],o=!1){let i=e.length,a=t.length;return i===0&&a===0?r:i===0?(r.push({op:"add",path:n,value:t}),r):a===0?(r.push({op:"replace",path:n,value:t}),r):i===1&&a===1?u(e[0],t[0],`${n}/0`,!0,r):v(e,t,n,r,o)}function u(e,t,n="",r=!1,o=[],i=!1){if(Object.is(e,t))return o;if(!r&&e!==void 0&&t===void 0)return o.push({op:"remove",path:n}),o;let a=e===null?"null":typeof e,d=t===null?"null":typeof t,f=a==="object"&&Array.isArray(e),m=d==="object"&&Array.isArray(t);return a!==d||f!==m?(o.push({op:"replace",path:n,value:t}),o):f&&m?(c(e,t,n,o,i),o):a==="object"?(x(e,t,n,o),o):(o.push({op:"replace",path:n,value:t}),o)}function G(e,t,n={}){return u(e,t,"",!1,[],Boolean(n.detectMoveOperations))}

exports.RFC6902 = I;
exports.compare = G;
exports.diffArrays = c;
exports.diffArraysUsingLcs = v;
exports.diffObjects = x;
exports.diffUnknownValues = u;
exports.getLcsBasedOperations = R;
