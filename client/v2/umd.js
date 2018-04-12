!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.tumblrV2={})}(this,function(t){"use strict";var e=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},n=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),r=function(){return function(t,e){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return function(t,e){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}(t,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),o=function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)},i=function(){return fetch.apply(void 0,arguments).then(function(t){return a(t.status)?t.json():u(t.statusText)}).then(function(t){return a(t.meta.status)?t.response:u(t.meta.msg)})},a=function(t){return 200===t||201===t},u=function(t,e){throw e?new TypeError(t):new Error(t)},s=function(t,e,n){return!t&&u(e,n)},c=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=Object.entries(t).filter(function(t){var e=r(t,2),n=(e[0],e[1]);return f(n)});return e.length?"?"+e.map(function(t){var e=r(t,2);return e[0]+"="+e[1]}).join("&"):""},f=function(t){return Boolean(t)||"number"==typeof t},l=function(t){return function(){var e=t.next(),n=e.done,r=e.value;return Promise.resolve(r).then(function(t){return{res:t,done:n}})}},h=function(t){var e,n;return n=(e=[]).concat.apply(e,o(t.filter(function(t){return t.tags}).map(function(t){return t.tags}))),[].concat(o(new Set(n).values()))},p=function(t){return"https://api.tumblr.com/v2/blog/"+function(t){return t+".tumblr.com"}(t)},d=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=n.type,o=n.tag,a=n.id,u=n.limit,s=n.offset,f=n.reblog_info,l=n.notes_info,h=n.filter;return i(p(t)+"/posts"+c({api_key:e,type:r,tag:o,id:a,limit:u,offset:s,reblog_info:f,notes_info:l,filter:h}),{method:"GET",mode:"cors"})},y=function(t,e,n){return d(t,e,n).then(function(t){return t.posts})},v=function(t,e,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},o=r.reblog_info,i=r.notes_info;return d(t,e,{id:n,reblog_info:o,notes_info:i}).then(function(t){return t.posts[0]})},m=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=n.type,o=n.tag;return d(t,e,{limit:1,type:r,tag:o}).then(function(t){return t.total_posts})},g=function(t,e){return function(t,e){return i(p(t)+"/info"+c({api_key:e}),{method:"GET",mode:"cors"})}(t,e).then(function(t){return t.blog})},x=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:64;return p(t)+"/avatar/"+e};var w,b=(function(t){!function(e){var n,r=Object.prototype,o=r.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",u=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag",c=e.regeneratorRuntime;if(c)t.exports=c;else{(c=e.regeneratorRuntime=t.exports).wrap=x;var f="suspendedStart",l="suspendedYield",h="executing",p="completed",d={},y={};y[a]=function(){return this};var v=Object.getPrototypeOf,m=v&&v(v(S([])));m&&m!==r&&o.call(m,a)&&(y=m);var g=k.prototype=b.prototype=Object.create(y);_.prototype=g.constructor=k,k.constructor=_,k[s]=_.displayName="GeneratorFunction",c.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===_||"GeneratorFunction"===(e.displayName||e.name))},c.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,k):(t.__proto__=k,s in t||(t[s]="GeneratorFunction")),t.prototype=Object.create(g),t},c.awrap=function(t){return{__await:t}},E(I.prototype),I.prototype[u]=function(){return this},c.AsyncIterator=I,c.async=function(t,e,n,r){var o=new I(x(t,e,n,r));return c.isGeneratorFunction(e)?o:o.next().then(function(t){return t.done?t.value:o.next()})},E(g),g[s]="Generator",g[a]=function(){return this},g.toString=function(){return"[object Generator]"},c.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},c.values=S,j.prototype={constructor:j,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(P),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,o){return u.type="throw",u.arg=t,e.next=r,o&&(e.method="next",e.arg=n),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],u=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var s=o.call(a,"catchLoc"),c=o.call(a,"finallyLoc");if(s&&c){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&o.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var i=r;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,d):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),P(n),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;P(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:S(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=n),d}}}function x(t,e,n,r){var o=e&&e.prototype instanceof b?e:b,i=Object.create(o.prototype),a=new j(r||[]);return i._invoke=function(t,e,n){var r=f;return function(o,i){if(r===h)throw new Error("Generator is already running");if(r===p){if("throw"===o)throw i;return T()}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var u=O(a,n);if(u){if(u===d)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===f)throw r=p,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r=h;var s=w(t,e,n);if("normal"===s.type){if(r=n.done?p:l,s.arg===d)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(r=p,n.method="throw",n.arg=s.arg)}}}(t,n,a),i}function w(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}function b(){}function _(){}function k(){}function E(t){["next","throw","return"].forEach(function(e){t[e]=function(t){return this._invoke(e,t)}})}function I(t){var e;this._invoke=function(n,r){function i(){return new Promise(function(e,i){!function e(n,r,i,a){var u=w(t[n],t,r);if("throw"!==u.type){var s=u.arg,c=s.value;return c&&"object"==typeof c&&o.call(c,"__await")?Promise.resolve(c.__await).then(function(t){e("next",t,i,a)},function(t){e("throw",t,i,a)}):Promise.resolve(c).then(function(t){s.value=t,i(s)},a)}a(u.arg)}(n,r,e,i)})}return e=e?e.then(i,i):i()}}function O(t,e){var r=t.iterator[e.method];if(r===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=n,O(t,e),"throw"===e.method))return d;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return d}var o=w(r,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,d;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,d):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,d)}function L(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(L,this),this.reset(!0)}function S(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,i=function e(){for(;++r<t.length;)if(o.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=n,e.done=!0,e};return i.next=i}}return{next:T}}function T(){return{value:n,done:!0}}}(function(){return this}()||Function("return this")())}(w={exports:{}},w.exports),w.exports),_=function(){return this}()||Function("return this")(),k=_.regeneratorRuntime&&Object.getOwnPropertyNames(_).indexOf("regeneratorRuntime")>=0,E=k&&_.regeneratorRuntime;_.regeneratorRuntime=void 0;var I=b;if(k)_.regeneratorRuntime=E;else try{delete _.regeneratorRuntime}catch(t){_.regeneratorRuntime=void 0}var O=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},L=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),P=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)},j=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e},S=I.mark(G),T=I.mark(q),A=function(t){return"function"==typeof t},R=function(t){return"number"==typeof t},H=function(t,e,n){if(t)throw n?new TypeError(e):new Error(e)};function G(t){var e;return I.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:e=0;case 1:if(!(e<t)){n.next=7;break}return n.next=4,e;case 4:e++,n.next=1;break;case 7:case"end":return n.stop()}},S,this)}var N=function(t){return[].concat(function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}(G(t)))},F=function(){function t(e,n){O(this,t),H(!R(e),'Indexes as Super class that first arg:length must be "number"',!0),H(e<=0,"Indexes as Super class that first arg:length must be > 0"),H(!R(n),'Indexes as Super class that second arg:maxIncrement must be "number"',!0),H(n<=0,"Indexes as Super class that second arg:maxIncrement must be > 0"),this._length=e,this._maxIncrement=n,this.indexes=new Set}return L(t,[{key:"indexesAdd",value:function(t){this.indexes.add(t)}},{key:"indexesHas",value:function(t){return this.indexes.has(t)}},{key:"indexesExtend",value:function(t){var e=this,n=this._maxIncrement,r=this._length-1,o=N(n).map(function(e){return t+e}).filter(function(t){return!e.indexesHas(t)&&t<=r});return H(!o.length,"indexesAdded.length === 0, but not still done"),o.forEach(function(t){return e.indexesAdd(t)}),o}},{key:"done",value:function(){return this.indexes.size===this._length}}]),t}(),M=function(t){function e(t){var n=t.length,r=t.maxIncrement;O(this,e);var o=j(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,n,r));return o.index=0,o.maxIncrement=r,o}return P(e,F),L(e,[{key:"nextIndexes",value:function(){return this.indexesExtend(this.index)}},{key:"prepare",value:function(){this.index+=this.maxIncrement}}]),e}(),Y=function(t){function e(t){var n=t.length,r=t.maxIncrement;O(this,e);var o=j(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,n,r));return o.length=n,o.lastIndex=n-1,o.index=o.createIndex(),o}return P(e,F),L(e,[{key:"createIndex",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=Math.round(this.lastIndex*Math.random());return"number"!=typeof n||this.indexesHas(n)?e<3?(e++,this.createIndex(e)):N(this.length).find(function(e){return!t.indexesHas(e)}):n}},{key:"nextIndexes",value:function(){return this.indexesExtend(this.index)}},{key:"prepare",value:function(){this.index=this.createIndex()}}]),e}(),C=function(t,e){return H(!A(t.nextIndexes),"tiloop first argument as indexes must have method:nextIndexes",!0),H(!A(t.done),"tiloop first argument as indexes must have method:done",!0),H(!A(e),'tiloop second argument as user must be "function"',!0),q(t,e)};function q(t,e){var n,r;return I.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:if(n=t.nextIndexes(),r=e(n),!t.done()){o.next=7;break}return o.abrupt("return",r);case 7:return o.next=9,r;case 9:t.prepare&&A(t.prepare)&&t.prepare(),o.next=0;break;case 12:case"end":return o.stop()}},T,this)}var z=async function(t,e,n){var r=n||{},i=r.type,a=r.denom,u=void 0===a?4:a,c=r.maxNum,f=void 0===c?3:c,h=await m(t,e,{type:i});s(h>0,"sampling account has no posts");var p=Math.floor(h/u);s(p>0,"sampling account has no posts");var d=C(new Y({length:h,maxIncrement:p}),function(n){return y(t,e,{type:i,offset:n[0],limit:n.length<f?n.length:f})}),v=l(d);return await async function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new Set,r=await e(),i=r.done;return r.res.forEach(function(t){return n.add(t)}),i?[].concat(o(n.values())):t(e,n)}(v)},B=function(){return z.apply(void 0,arguments).then(h)},V=async function(t,e,n){var r=n||{},o=r.offset,i=void 0===o?0:o,a=r.limit,u=void 0===a?20:a,c=r.type,f=r.tag,h=r.reblog_info,p=r.notes_info,d=r.filter;s(u<=20,"HoPosts > invalid limit");var v=await m(t,e,{type:c,tag:f});s(i<v,"HoPosts > invalid offset");var g=C(new M({length:v-i,maxIncrement:u}),function(n){return y(t,e,{offset:n[0]+i,limit:n.length,type:c,tag:f,reblog_info:h,notes_info:p,filter:d})});return l(g)},D=async function(t,e,n){var r=n||{},o=r.offset,i=void 0===o?0:o,a=r.limit,u=void 0===a?20:a,c=r.type,f=r.tag,h=r.reblog_info,p=r.notes_info,d=r.filter;s(u<=20,"HoPostsRandom > invalid limit");var v=await m(t,e,{type:c,tag:f});s(i<v,"HoPostsRandom > invalid offset");var g=C(new Y({length:v-i,maxIncrement:u}),function(n){return y(t,e,{offset:n[0]+i,limit:n.length,type:c,tag:f,reblog_info:h,notes_info:p,filter:d})});return l(g)},J=function(){function t(n){e(this,t),this.api_key=n}return n(t,[{key:"posts",value:function(t,e){return y(t,this.api_key,e)}},{key:"post",value:function(t,e,n){return v(t,this.api_key,e,n)}},{key:"total",value:function(t,e){return m(t,this.api_key,e)}},{key:"blog",value:function(t){return g(t,this.api_key)}},{key:"avatar",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:64;return x(t,e)}},{key:"samplingPosts",value:function(t,e){return z(t,this.api_key,e)}},{key:"samplingTags",value:function(t,e){return B(t,this.api_key,e)}},{key:"HoPosts",value:function(){return V(account,this.api_key,params)}},{key:"HoPostsRandom",value:function(){return D(account,this.api_key,params)}}]),t}();t.posts=y,t.post=v,t.total=m,t.blog=g,t.avatar=x,t.samplingPosts=z,t.samplingTags=B,t.HoPosts=V,t.HoPostsRandom=D,t.POST_TYPES=["quote","text","chat","photo","link","video","audio","answer"],t.default=J,Object.defineProperty(t,"__esModule",{value:!0})});
