'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var g = require('fast-array-diff/dist/diff/lcs');
var w = require('fast-deep-equal');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var g__default = /*#__PURE__*/_interopDefaultLegacy(g);
var w__default = /*#__PURE__*/_interopDefaultLegacy(w);

var S={};function C(o,e,r="",a=[]){let n=Object.keys(o),t=Object.keys(e);if(n.length===0&&t.length===0)return a;for(let i=n.length-1;i>=0;i--){let p=n[i];u(o[p],e[p],`${r}/${p}`,p in e,a);}for(let i=0;i<t.length;i++){let p=t[i];!(p in o)&&e[p]!==void 0&&a.push({op:"add",path:`${r}/${p}`,value:e[p]});}return a}var v=o=>{};function x(o,e,r="",a=[],n=!1){return B(o,e,w__default["default"],r,a,n)}function T(o,e,r,a){let n=[];for(let t of o)if(t.type==="remove"){let i=e.slice(t.oldStart,t.oldEnd),p={startIdx:t.oldStart,length:i.length,lengthShift:0};for(let[d,s]of i.entries()){let l=t.oldStart+d,m=l+a.additionsIdxShift-a.removalsIdxShift+d;n.push({type:"remove",value:s,sourceArrayRemovalBatch:p,sourceArrayRemovalBatchPosition:d,sourceArrayIdx:l,totalShiftedIdx:m}),a.removalsIdxShift++;}}else if(t.type==="add"){let i=r.slice(t.newStart,t.newEnd),p={startIdx:t.oldStart,length:i.length};for(let[d,s]of i.entries()){let l=t.newStart+d,m=t.oldStart+d,f=m+a.additionsIdxShift-a.removalsIdxShift-d;n.push({type:"add",value:s,targetArrayIdx:l,sourceArrayAdditionBatch:p,sourceArrayAdditionBatchPosition:d,sourceArrayIdx:m,totalShiftedIdx:f}),a.additionsIdxShift++;}}return n}function k(o,e,r,a,n){for(let t of o)if(t.type==="remove"){let i=t.totalShiftedIdx-t.sourceArrayRemovalBatchPosition-t.sourceArrayRemovalBatch.lengthShift;e.push({op:"remove",path:`${r}/${i}`});}else t.type==="add"?e.push({op:"add",path:`${r}/${t.totalShiftedIdx}`,value:t.value}):t.type==="move"?e.push({op:"move",path:`${r}/${t.toShiftedIdx}`,from:`${r}/${t.fromShiftedIdx}`}):t.type==="replace"&&u(a[t.shiftedIdx],t.value,`${r}/${t.shiftedIdx}`,!0,e,n);}function B(o,e,r,a,n=[],t=!1){let i=-1,p=[],d=[],s=[],l={additionsIdxShift:0,removalsIdxShift:0};function m(f,$,O,R,L,I,A){let h=Object.freeze({type:f,oldStart:O,oldEnd:R,newStart:I,newEnd:A});if(f==="same"){i++;let y=[...s,...d];if(y.length===0)return;let c=T(y,o,e,l);s.length!==0&&d.length!==0&&(F(c),v()),p.push(...c),d.splice(0),s.splice(0);}else f==="add"?d.push(h):f==="remove"&&s.push(h);}return g__default["default"](o,e,r,m),m("same",[],0,0,[],0,0),i<=0?(n.push({op:"replace",path:a,value:e}),n):(k(p,n,a,o,t),n)}function F(o){for(let e=o.length-1;e>=0;e--)if(!(o[e].type!=="add"&&o[e].type!=="remove"))for(let r=e-1;r>=0;r--){if(o[r].type===o[e].type||o[r].type!=="add"&&o[r].type!=="remove")continue;let a=o[e].type==="add"?o[e]:o[r],n=o[e].type==="remove"?o[e]:o[r];if(a.targetArrayIdx===n.sourceArrayIdx){n.sourceArrayRemovalBatch.lengthShift--,o[r]={type:"replace",value:a.value,removedValue:n.value,shiftedIdx:n.sourceArrayIdx},o.splice(e,1);break}}}function b(o,e,r="",a=[],n=!1){let t=o.length,i=e.length;return t===0&&i===0?a:t===0?(a.push({op:"add",path:r,value:e}),a):i===0?(a.push({op:"replace",path:r,value:e}),a):t===1&&i===1?u(o[0],e[0],`${r}/0`,!0,a):x(o,e,r,a,n)}function u(o,e,r="",a=!1,n=[],t=!1){if(Object.is(o,e))return n;if(!a&&o!==void 0&&e===void 0)return n.push({op:"remove",path:r}),n;let i=o===null?"null":typeof o,p=e===null?"null":typeof e,d=i==="object"&&Array.isArray(o),s=p==="object"&&Array.isArray(e);return i!==p||d!==s?(n.push({op:"replace",path:r,value:e}),n):d&&s?(b(o,e,r,n,t),n):i==="object"?(C(o,e,r,n),n):(n.push({op:"replace",path:r,value:e}),n)}function J(o,e,r={}){return u(o,e,"",!1,[],Boolean(r.detectMoveOperations))}

exports.RFC6902 = S;
exports.compare = J;
exports.diffArrays = b;
exports.diffArraysUsingLcs = x;
exports.diffObjects = C;
exports.diffUnknownValues = u;
exports.getLcsBasedOperations = B;
