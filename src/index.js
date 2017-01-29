import Vue from 'vue'
import App from './App'

import router from './router'
import { Notification, Dialog } from 'element-ui';
import store from './store'
import ExDialog from './components/ExDialog'
Vue.use(Notification)
Vue.use(Dialog)
Vue.use(ExDialog)


const app = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App
  }
})
