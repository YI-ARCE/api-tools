import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'three-dots/dist/three-dots.min.css';
import {Notification} from 'element-ui';
import App from './App.vue'
import preload from './common/preload.js'
import router from './common/router'
import request from './common/response'

// require('brace/theme/chrome')
import "brace/ext/language_tools"; // language extension

import "brace/mode/json";

import "brace/snippets/json";

import "brace/theme/chrome";

Vue.use(ElementUI);
Vue.config.productionTip = false

Vue.prototype.$y = preload

Vue.prototype.$notify = Notification

Vue.prototype.$yiarce = request

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
