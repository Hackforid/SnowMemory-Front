import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from './pages/Login.vue'
import Timeline from './pages/Timeline.vue'
import UserInfo from './pages/UserInfo.vue'
import Account from './pages/Account.vue'

const routes = [
  { path: '/', redirect: '/timeline'},
  { path: '/login', name: 'login', component: Login},
  { path: '/user/:username', name: 'userinfo', component: UserInfo},
  { path: '/timeline', name: 'timeline', component: Timeline},
  { path: '/account', name: 'account', component: Account},
]

const router = new VueRouter({
  routes
})

export default router

