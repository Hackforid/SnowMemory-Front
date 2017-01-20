import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from './pages/Login.vue'
import Timeline from './pages/Timeline.vue'

const routes = [
  { path: '/', redirect: '/timeline'},
  { path: '/login', name: 'login', component: Login},
  { path: '/timeline', name: 'timeline', component: Timeline},
]

const router = new VueRouter({
  routes
})

export default router

