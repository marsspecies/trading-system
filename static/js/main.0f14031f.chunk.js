(this["webpackJsonptrading-system"]=this["webpackJsonptrading-system"]||[]).push([[0],{103:function(t,e){},105:function(t,e){},290:function(t,e,n){},291:function(t,e,n){"use strict";n.r(e);var r=n(15),o=n.n(r),a=n(85),c=n.n(a),i=(n(93),n(24)),u=n(86),l=n(6),s=n.n(l),d=n(49),h=n(37),f=n.n(h),b="CRO/USDT",p=function(){var t=Object(d.a)(s.a.mark((function t(){var e,n,r=arguments;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=r.length>0&&void 0!==r[0]?r[0]:"1d",n=new f.a.huobipro,t.next=4,n.fetchOHLCV(b,e);case 4:return t.abrupt("return",t.sent);case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();var v=n(50),y=function(t){var e=new Date(t);return"".concat(e.getFullYear(),"/").concat(e.getMonth()+1,"/").concat(e.getDate())},m=function(t,e){var n=[],r=[],o=[],a=[],c=Object(v.a)(t).reverse(),i=c[0],u=Number(((i[3]+i[2])/2).toFixed(4));i[0],i[1],i[2],i[3];c.slice(1).forEach((function(t,e){var o=Number(((t[3]+t[2])/2).toFixed(4));a.push(o);var c=Number((2*u-t[1]).toFixed(4)),i=Number((2*u-t[0]).toFixed(4)),l=Number((2*u-t[3]).toFixed(4)),s=Number((2*u-t[2]).toFixed(4)),d=Number((2*u-o).toFixed(4));r.push(d),n.push([c,i,l,s])}));var l=Object(v.a)(e).reverse(),s=l[0];return l.slice(1).forEach((function(t,e){o.push(y(2*s-t))})),{futureData:n,futureAverageData:r,futureDates:o}},g=n(21),S=function(){var t=Object(r.useRef)(),e=function(t,e){var n=Object(r.useState)(null),o=Object(i.a)(n,2),a=o[0],c=o[1],u=Object(r.useState)(null),l=Object(i.a)(u,2),s=l[0],d=l[1],h=Object(r.useState)(!1),f=Object(i.a)(h,2),b=f[0],p=f[1];return[Object(r.useCallback)((function(){return p(!0),t.apply(void 0,arguments).then((function(t){return t&&c(t),t})).catch((function(t){var n;return console.error(t),d(t||"error ocurred in useAsyncCall hook"),null===e||void 0===e||null===(n=e.onFailed)||void 0===n||n.call(e,t),t})).finally((function(){p(!1)}))}),[t,e]),{result:a,error:s,loading:b}]}(p),n=Object(i.a)(e,2),o=n[0],a=n[1].result;return Object(r.useEffect)((function(){o()}),[o]),Object(r.useEffect)((function(){if(a&&t.current){var e=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"1d",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:30,r=[],o=[],a=[];t.forEach((function(t){var e=y(t[0]);o.push(t[0]),a.push(e),r.push([t[1],t[4],t[3],t[2]])}));var c=r.slice(r.length-n-1),i=o.slice(r.length-n-1),u=m(c,i),l=u.futureData,s=u.futureDates,d=u.futureAverageData,h=function(t){return t.map((function(){return["-","-","-","-"]}))},f=function(t){return t.map((function(){return"-"}))};function b(t,e){for(var n=[],r=0,o=e.length;r<o;r++)if(r<t)n.push("-");else{for(var a=0,c=0;c<t;c++)a+=e[r-c][1];n.push((a/t).toFixed(4))}return n}var p="CRO_USDT ".concat(e);return{legend:{data:[p,"Future","Future-average","MA5","MA10","MA20","MA30"]},tooltip:{trigger:"axis",axisPointer:{animation:!1,type:"cross",lineStyle:{color:"#376df4",width:2,opacity:1}}},xAxis:{type:"category",data:a.concat(s),axisLine:{lineStyle:{color:"#8392A5"}}},yAxis:{scale:!0,axisLine:{lineStyle:{color:"#8392A5"}},splitLine:{show:!1}},grid:{bottom:80},dataZoom:[{textStyle:{color:"#8392A5"},handleIcon:"path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",dataBackground:{areaStyle:{color:"#8392A5"},lineStyle:{opacity:.8,color:"#8392A5"}},start:80},{type:"inside"}],series:[{type:"candlestick",name:p,data:r.concat(h(l)),itemStyle:{color:"#FD1050",color0:"#0CF49B",borderColor:"#FD1050",borderColor0:"#0CF49B"}},{name:"Future",type:"candlestick",data:h(r).concat(l),showAllSymbol:!0,itemStyle:{normal:{color:"#ddd",color0:"#ddd",borderColor:"#fa6464",borderColor0:"#32C896"}}},{name:"Future-average",type:"line",data:f(r).concat(d),smooth:!0,showSymbol:!1,itemStyle:{color:"#000"},lineStyle:{width:1,color:"#ccc"}},{name:"MA5",type:"line",data:b(5,r).concat(f(l)),smooth:!0,showSymbol:!1,lineStyle:{width:1}},{name:"MA10",type:"line",data:b(10,r).concat(f(l)),smooth:!0,showSymbol:!1,lineStyle:{width:1}},{name:"MA20",type:"line",data:b(20,r).concat(f(l)),smooth:!0,showSymbol:!1,lineStyle:{width:1}},{name:"MA30",type:"line",data:b(30,r).concat(f(l)),smooth:!0,showSymbol:!1,lineStyle:{width:1}}]}}(a,"1d",100);t.current.setOption(e)}}),[a]),Object(g.jsx)("div",{id:"kline",style:{width:"100%",height:"100vh"},ref:function(e){e&&(t.current=u.a(e))}})};n(290);var j=function(){return Object(g.jsx)("div",{className:"App",children:Object(g.jsx)(S,{})})},x=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,295)).then((function(e){var n=e.getCLS,r=e.getFID,o=e.getFCP,a=e.getLCP,c=e.getTTFB;n(t),r(t),o(t),a(t),c(t)}))};c.a.render(Object(g.jsx)(o.a.StrictMode,{children:Object(g.jsx)(j,{})}),document.getElementById("root")),x()},93:function(t,e,n){}},[[291,1,2]]]);
//# sourceMappingURL=main.0f14031f.chunk.js.map