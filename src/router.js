import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from './pages/Login.vue'
import Timeline from './pages/Timeline.vue'
import UserInfo from './pages/UserInfo.vue'
import Account from './pages/Account.vue'
import PostInfo from './pages/PostInfo.vue'
//const PostInfo = resolve => {
  //import('./pages/PostInfo.vue').then(module=>resolve(module.default))
//}


const routes = [
  { path: '/', redirect: '/timeline'},
  { path: '/login', name: 'login', component: Login},
  { path: '/user/:username', name: 'userinfo', component: UserInfo},
  { path: '/timeline', name: 'timeline', component: Timeline},
  { path: '/account', name: 'account', component: Account},
  { path: '/post/:postId', name: 'postinfo', component: PostInfo},
]

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router

