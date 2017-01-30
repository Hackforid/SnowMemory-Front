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
      const postId = this.$route.params.postId
      if (!postId) {
        return
      }
      const resp = await getPost(postId)
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

