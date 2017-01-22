import Vue from 'vue'
import App from './App'

import router from './router'
import { Notification, Dialog } from 'element-ui';
import store from './store'
Vue.use(Notification)
Vue.use(Dialog)


const app = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App
  }
})
