(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{228:function(t){t.exports=JSON.parse('{"title":"Morse Code","items":[{"icon":"mdiRadioTower","title":"Home","to":"/"}]}')},232:function(t,e,n){"use strict";n(34);var r=n(2),o=n(228),c=n(79);function l(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}var v={data:function(){return function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(e){Object(r.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({clipped:!1,drawer:!1,fixed:!1,miniVariant:!0,icons:{mdiMenuLeft:c.e,mdiMenuRight:c.f,mdiThemeLightDark:c.n,mdiRadioTower:c.i,mdiMenu:c.d}},o)},mounted:function(){var t=this;setTimeout((function(){var e=window.matchMedia("(prefers-color-scheme: dark)").matches;t.$vuetify.theme.dark=e}),0)}},d=n(71),m=n(107),f=n.n(m),_=n(339),h=n(344),w=n(340),V=n(229),y=n(345),O=n(161),k=n(162),x=n(100),j=n(163),C=n(66),P=n(341),T=n(346),L=n(342),M=n(230),N=n(343),component=Object(d.a)(v,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",{attrs:{dark:""}},[n("v-navigation-drawer",{attrs:{"mini-variant":t.miniVariant,app:""},model:{value:t.drawer,callback:function(e){t.drawer=e},expression:"drawer"}},[n("v-list",t._l(t.items,(function(e,i){return n("v-list-item",{key:i,attrs:{to:e.to,router:"",exact:""}},[n("v-list-item-action",[n("v-icon",[t._v(t._s(t.icons[e.icon]))])],1),t._v(" "),n("v-list-item-content",[n("v-list-item-title",{domProps:{textContent:t._s(e.title)}})],1)],1)})),1)],1),t._v(" "),n("v-app-bar",{attrs:{flat:"",dense:"",app:""}},[n("v-app-bar-nav-icon",{attrs:{tile:""},on:{click:function(e){e.stopPropagation(),t.drawer=!t.drawer}}},[n("v-icon",[t._v(t._s(t.icons.mdiMenu))])],1),t._v(" "),n("v-btn",{attrs:{icon:"",tile:""},on:{click:function(e){e.stopPropagation(),t.miniVariant=!t.miniVariant}}},[n("v-icon",[t._v(t._s(t.miniVariant?t.icons.mdiMenuRight:t.icons.mdiMenuLeft))])],1),t._v(" "),n("v-toolbar-title",{domProps:{textContent:t._s(t.title)}}),t._v(" "),n("v-spacer"),t._v(" "),n("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on;return[n("v-btn",t._g({attrs:{tile:"",icon:""},on:{click:function(e){e.stopPropagation(),t.$vuetify.theme.dark^=!0}}},r),[n("v-icon",[t._v(t._s(t.icons.mdiThemeLightDark))])],1)]}}])},[t._v("\n      Toggle Dark mode\n      ")])],1),t._v(" "),n("v-main",[n("v-container",{staticClass:"pa-0",attrs:{fluid:""}},[n("Nuxt")],1)],1)],1)}),[],!1,null,null,null);e.a=component.exports;f()(component,{VApp:_.a,VAppBar:h.a,VAppBarNavIcon:w.a,VBtn:V.a,VContainer:y.a,VIcon:O.a,VList:k.a,VListItem:x.a,VListItemAction:j.a,VListItemContent:C.a,VListItemTitle:C.b,VMain:P.a,VNavigationDrawer:T.a,VSpacer:L.a,VToolbarTitle:M.a,VTooltip:N.a})},243:function(t,e,n){n(244),t.exports=n(245)},59:function(t,e,n){"use strict";var r={layout:"empty",props:{error:{type:Object,default:null}},data:function(){return{pageNotFound:"404 Not Found",otherError:"An error occurred"}},head:function(){return{title:404===this.error.statusCode?this.pageNotFound:this.otherError}}},o=n(71),c=n(107),l=n.n(c),v=n(345),d=n(338),component=Object(o.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",{staticClass:"pa-5 d-flex flex-column align-center justify-center",attrs:{fluid:""}},[n("h1",{staticClass:"text-h1 ma-5"},[t._v("\n    "+t._s(404===t.error.statusCode?t.pageNotFound:t.otherError)+"\n  ")]),t._v(" "),n("v-simple-table",{attrs:{dense:""}},[n("thead",[n("tr",[n("th",{staticClass:"text-left"},[t._v("Key")]),t._v(" "),n("th",{staticClass:"text-left"},[t._v("Value")])])]),t._v(" "),n("tbody",t._l(t.error,(function(e,r){return n("tr",{key:r},[n("td",[t._v(t._s(r))]),t._v(" "),n("td",[t._v(t._s(e))])])})),0)]),t._v(" "),n("NuxtLink",{staticClass:"text-button",attrs:{to:"/"}},[t._v(" Home page ")])],1)}),[],!1,null,null,null);e.a=component.exports;l()(component,{VContainer:v.a,VSimpleTable:d.a})}},[[243,4,1,5]]]);