import Vue from 'vue'
import App from './App'

import router from './router'
import { Notification } from 'element-ui';
Vue.use(Notification)

const app = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
