import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    timelinePosts: [],
    timelineScroll: 0,
  },
  mutations: {
    setTimelinePosts(state, posts) {
      state.timelinePosts = posts
    }
  }
})

export default store
