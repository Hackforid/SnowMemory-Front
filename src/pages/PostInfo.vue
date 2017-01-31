<template>
  <Post class="post-info" :post="post" v-if="post">
</template>

<style>
.post-info {
  margin-top: 150px;
  margin-bottom: 100px;
}
</style>

<script>
import Post from '../components/Post.vue'
import {simpleRequest} from '../utils/network'

export default {
  name: 'postinfo',
  components: {
    Post
  },
  data() {
    return {
      post: null,
    }
  },
  watch: {
    '$route': 'getPost'
  },
  created() {
    this.getPost()
  },
  methods: {
    async getPost() {
      this.post = null
      const postId = this.$route.params.postId
      if (!postId) {
        return
      }
      const resp = await getPost(postId)
      //window.scrollTo(0, 0)
      this.post = resp.post
    }
  }
}

function getPost(postId) {
  return simpleRequest({
    url: `/api/post/${postId}`
  })
}
</script>

