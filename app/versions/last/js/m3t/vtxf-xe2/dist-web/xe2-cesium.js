/*! For license information please see xe2-cesium.js.LICENSE.txt */
var XE2;(()=>{"use strict";var e={54552:(e,r)=>{Object.defineProperty(r,"__esModule",{value:!0}),r.getCurrentScriptPath=void 0,r.getCurrentScriptPath=function(){return document.currentScript.src}},55344:(e,r,t)=>{var s,i,c,n,o,u;Object.defineProperty(r,"__esModule",{value:!0}),n=(c=(0,t(54552).getCurrentScriptPath)()).slice(0,c.lastIndexOf("/"))+"/",u=null!==(s=null==(o=window.xbsjDirs)?void 0:o.xbsjRendererDir)&&void 0!==s?s:(null!==(i=null==o?void 0:o.xe2BaseDir)&&void 0!==i?i:"js/")+"vtxf-xe2-assets/dist-web/js/vtxf-renderer/dist-web/",document.write('        <script src="'.concat(u,'xr-cesium.js"><\/script>\n        <script src="').concat(n,'xe2-base-cesium.js"><\/script>\n        <script src="').concat(n,'xe2-cesium-objects.js"><\/script>\n    '))},59645:e=>{e.exports=XE2["xe2-utils"]}},r={};function t(s){var i=r[s];if(void 0!==i)return i.exports;var c=r[s]={exports:{}};return e[s](c,c.exports,t),c.exports}var s,i={};s=i,Object.defineProperty(s,"__esModule",{value:!0}),(0,t(59645).registerScript)(),t(55344),(XE2=void 0===XE2?{}:XE2)["xe2-cesium"]=i})();