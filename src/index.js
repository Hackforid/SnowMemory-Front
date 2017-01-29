import Vue from 'vue'
import App from './App'

import router from './router'
import { Dialog, Dropdown, DropdownItem, DropdownMenu} from 'element-ui';
import store from './store'
import ExDialog from './components/ExDialog'
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
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
