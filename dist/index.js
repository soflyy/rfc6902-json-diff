'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var L = require('fast-array-diff/dist/diff/lcs');
var V = require('fast-deep-equal');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var L__default = /*#__PURE__*/_interopDefaultLegacy(L);
var V__default = /*#__PURE__*/_interopDefaultLegacy(V);

var B={};function U(e){return e.charAt(0)==="/"&&(e=e.substring(1)),e.endsWith("/")&&(e=e.substring(0,e.length-1)),e}function u(e,o){return `${e}/${U(String(o))}`}function F(e,o,p=""){let a=[],i=Object.keys(e),n=Object.keys(o);for(let r=i.length-1;r>=0;r--){let t=i[r],f=e[t],c=o[t];a.push(...m(f,c,u(p,t),Object.prototype.hasOwnProperty.call(o,t)));}for(let r=0;r<n.length;r++){let t=n[r];!Object.prototype.hasOwnProperty.call(e,t)&&o[t]!==void 0&&a.push({op:"add",path:u(p,t),value:o[t]});}return a}function A(e,o,p=""){return K(e,o,V__default["default"],p)}function K(e,o,p=(i,n)=>i===n,a){let i=[],n=null,r=null,t=[],f=0,c=0;function w(C,R,d,g,b,O,h){if(C==="same"){if(r!==null)for(let l=0;l<r.items.length;l++)i.push({op:"remove",path:u(a,r.oldPos)});if(n!==null)for(let l=0;l<n.items.length;l++)i.push({op:"add",value:n.items[l],path:u(a,n.oldPos+l)});t!==null&&i.push(...t),r=null,n=null,t=[];}else if(C==="remove"){let l=d-c+f;if(r===null&&(r={type:"remove",oldPos:l,newPos:O,items:[]}),n!==null)for(let s=d,y=0;s<g;++s,y++){let x=n.items.shift();if(x){f--;let T=R[s],P=x,v=u(a,String(d+y)),k=m(T,P,v);t.push(...k),r.oldPos++;}else r.items.push(R[s]),c++;}else for(let s=d;s<g;++s)r.items.push(R[s]),c++;}else if(C==="add"){let l=d-c+f;if(n===null&&(n={type:"add",oldPos:l,newPos:O,items:[]}),r!==null)for(let s=O,y=0;s<h;++s,y++){let x=r.items.shift();if(x){c--;let T=x,P=b[s],v=u(a,String(l+y)),k=m(T,P,v);t.push(...k),n.oldPos++;}else n.items.push(b[s]),f++;}else for(let s=O;s<h;++s)n.items.push(b[s]),f++;}}return L__default["default"](e,o,p,w),w("same",[],0,0,[],0,0),i}function I(e,o,p=""){let a=e.length,i=o.length;return a===0&&i===0?[]:a===0?[{op:"add",path:p,value:o}]:i===0?[{op:"replace",path:p,value:e}]:a===1&&i===1?m(e[0],o[0],u(p,0)):A(e,o,p)}function m(e,o,p="",a=!1){if(e===o)return [];if(!a&&e!==void 0&&o===void 0)return [{op:"remove",path:p}];let i=e===null?"null":typeof e,n=o===null?"null":typeof o,r=Array.isArray(e),t=Array.isArray(o);return i!==n||r!==t?[{op:"replace",path:p,value:o}]:r&&t?I(e,o,p):i==="object"?F(e,o,p):[{op:"replace",path:p,value:o}]}function ee(e,o){return m(e,o)}

exports.RFC6902 = B;
exports.appendToPath = u;
exports.compare = ee;
exports.diffArrays = I;
exports.diffArraysUsingLcs = A;
exports.diffObjects = F;
exports.diffUnknownValues = m;
exports.getLcsBasedOperations = K;
exports.normalizePathComponent = U;
