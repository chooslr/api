"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var Koa=_interopDefault(require("koa")),Router=_interopDefault(require("koa-router")),BodyParser=_interopDefault(require("koa-bodyparser")),JWT=_interopDefault(require("koa-jwt")),OAuth=_interopDefault(require("oauth-1.0a")),got=_interopDefault(require("got")),assert=_interopDefault(require("assert")),crypto=require("crypto"),slicedToArray=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var o=[],r=!0,n=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(r=(i=s.next()).done)&&(o.push(i.value),!t||o.length!==t);r=!0);}catch(e){n=!0,a=e}finally{try{!r&&s.return&&s.return()}finally{if(n)throw a}}return o}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),endpoints={info:"/info",followings:"/followings",explores:"/explores",dashboard:"/dashboard",likes:"/likes",follow:"/follow",unfollow:"/unfollow",reblog:"/reblog",delete:"/delete"},joinParams=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.entries(e).filter(function(e){var t=slicedToArray(e,2);t[0];return t[1]});return t.length?"?"+t.map(function(e){var t=slicedToArray(e,2);return t[0]+"="+t[1]}).join("&"):""},BASE_URL="https://api.tumblr.com/v2",BLOG_URL=BASE_URL+"/blog",USER_URL=BASE_URL+"/user",INFO_URL=USER_URL+"/info",FOLLOWINGS_URL=USER_URL+"/following",DASHBOARD_URL=USER_URL+"/dashboard",LIKES_URL=USER_URL+"/likes",FOLLOW_URL=USER_URL+"/follow",UNFOLLOW_URL=USER_URL+"/unfollow",IDENTIFIER_URL=function(e){return e+".tumblr.com"},POST_URL=function(e){return BLOG_URL+"/"+IDENTIFIER_URL(e)+"/post"},REBLOG_URL=function(e){return POST_URL(e)+"/reblog"},DELETE_URL=function(e){return POST_URL(e)+"/delete"},EXPLORE_URLs=["trending","staff-picks","text","photos","gifs","quotes","video"].map(function(e){return"https://www.tumblr.com/explore/"+e}),HoOAuthAuthorization=function(e,t){var o=OAuth({consumer:{key:e,secret:t},signature_method:"HMAC-SHA1",hash_function:function(e,t){return crypto.createHmac("sha1",t).update(e).digest("base64")}});return function(e,t,r,n){var a=o.authorize({url:e,method:t},{key:r,secret:n});return o.toHeader(a).Authorization}},server=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.timeout,o=void 0===t?1e4:t,r=e.jwt,n=(r=void 0===r?{}:r).secret,a=r.cookieName,i=void 0===a?"chooslr:jwt":a,s=r.stateName,u=void 0===s?"user":s,d=e.oauth,c=(d=void 0===d?{}:d).consumerKey,l=d.consumerSecret,f=d.tokenName,y=void 0===f?"token":f,h=d.secretName,b=void 0===h?"secret":h;assert(n,"required jwt.secret"),assert(c,"required oauth.consumerKey"),assert(l,"required oauth.consumerSecret");var _=HoOAuthAuthorization(c,l),m=BodyParser(),L=JWT({key:u,cookie:i,secret:n,passthrough:!1}),R=(new Router).get(endpoints.info,L,async function(e,t){var o=INFO_URL,r=e.state[u],n=r[y],a=r[b],i=got(o,{method:"GET",json:!0,headers:{Authorization:_(o,"GET",n,a)}});e.body=await i.then(function(e){return e.body}),await t()}).get(endpoints.followings,L,async function(e,t){var o=e.query,r=o.limit,n=o.offset,a=FOLLOWINGS_URL+joinParams({limit:r,offset:n}),i=e.state[u],s=i[y],d=i[b],c=got(a,{method:"GET",json:!0,headers:{Authorization:_(a,"GET",s,d)}});e.body=await c.then(function(e){return e.body}),await t()}).get(endpoints.explores,async function(e,t){var o=EXPLORE_URLs.map(function(e){return got.get(e).then(function(e){return e.body})}),r=await Promise.all(o);e.body={meta:{status:200,msg:"OK"},response:{htmls:r}},await t()}).get(endpoints.dashboard,L,async function(e,t){var o=e.query,r=o.limit,n=o.offset,a=o.type,i=o.since_id,s=o.before_id,d=o.reblog_info,c=o.notes_info,l=DASHBOARD_URL+joinParams({limit:r,offset:n,type:a,since_id:i,before_id:s,reblog_info:d,notes_info:c}),f=e.state[u],h=f[y],m=f[b],L=got(l,{method:"GET",json:!0,headers:{Authorization:_(l,"GET",h,m)}});e.body=await L.then(function(e){return e.body}),await t()}).get(endpoints.likes,L,async function(e,t){var o=e.query,r=o.limit,n=o.offset,a=o.before,i=o.after,s=o.reblog_info,d=o.notes_info,c=LIKES_URL+joinParams({limit:r,offset:n,before:a,after:i,reblog_info:s,notes_info:d}),l=e.state[u],f=l[y],h=l[b],m=got(c,{method:"GET",json:!0,headers:{Authorization:_(c,"GET",f,h)}});e.body=await m.then(function(e){return e.body}),await t()}).post(endpoints.follow,L,m,async function(e,t){var o=e.request.body.account;e.assert(o,400,"/follow need { account } as body");var r=FOLLOW_URL,n=e.state[u],a=n[y],i=n[b],s=got(r,{method:"POST",json:!0,headers:{Authorization:_(r,"POST",a,i)},body:{url:"http://"+IDENTIFIER_URL(o)}});e.body=await s.then(function(e){return e.body}),await t()}).post(endpoints.unfollow,L,m,async function(e,t){var o=e.request.body.account;e.assert(o,400,"/unfollow need { account } as body");var r=UNFOLLOW_URL,n=e.state[u],a=n[y],i=n[b],s=got(r,{method:"POST",json:!0,headers:{Authorization:_(r,"POST",a,i)},body:{url:"http://"+IDENTIFIER_URL(o)}});e.body=await s.then(function(e){return e.body}),await t()}).post(endpoints.reblog,L,m,async function(e,t){var o=e.request.body,r=o.account,n=o.id,a=o.reblog_key,i=o.comment,s=o.native_inline_images;e.assert(r,400,"/reblog need { account } as body"),e.assert(n,400,"/reblog need { id } as body"),e.assert(a,400,"/reblog need { reblog_key } as body");var d=REBLOG_URL(r),c=e.state[u],l=c[y],f=c[b],h=got(d,{method:"POST",json:!0,headers:{Authorization:_(d,"POST",l,f)},body:{id:n,reblog_key:a,comment:i,native_inline_images:s}});e.body=await h.then(function(e){return e.body}),await t()}).post(endpoints.delete,L,m,async function(e,t){var o=e.request.body,r=o.account,n=o.id;e.assert(r,400,"/delete need { account } as body"),e.assert(n,400,"/delete need { id } as body");var a=DELETE_URL(r),i=e.state[u],s=i[y],d=i[b],c=got(a,{method:"POST",json:!0,headers:{Authorization:_(a,"POST",s,d)},body:{id:n}});e.body=await c.then(function(e){return e.body}),await t()});return(new Koa).use(async function(e,t){e.req.setTimeout(o);try{await t()}catch(t){console.error(t),e.status=t.status||500,e.set("Content-Type","application/problem+json; charset=utf-8"),e.body={meta:{status:e.status,msg:t.message||"Internal Server Error"}}}}).use(R.routes()).use(R.allowedMethods({throw:!0}))};module.exports=server;
