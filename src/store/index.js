import Vue from 'vue'
import Vuex from 'vuex'
import {simpleRequest} from '../utils/network'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    username: localStorage.username,
    users: [],
  },
  mutations: {
    setUsername(state, username) {
      state.username = username
    },
    setUsers(state, users) {
      state.users = users
    }
  },
  action: {
    async setUsername(context, username) {
      context.commit('setUsername', username)
      const users = (await getUsers()).users
      context.commit('setUsers', users)
    }
  }
})

function getUsers() {
  return simpleRequest({
    url: '/api/users',
  })
}

export default store
