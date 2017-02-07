<template>
  <load-more-container class="container" @onLoadMore="onLoadMorePost" ref="postLoader">
    <Post :post="post" @deleted="onPostDeleted"  v-for="post of posts"/>

    <el-dialog title="新的记忆" v-model="showPostDialog" size="small">
      <div class="new-post">
        <div class="card file-uploader">
          <span v-if="!loadingSelectedImage">+挑选照片</span>
          <img class="post-file-loading" v-if="loadingSelectedImage" src="/static/img/loading_circle_progress.gif" />
          <input class="post-file" @change="onFileChange" type="file" name="pic" id="pic" accept="image/gif, image/jpeg, image/png" />
        </div>
        <img class="post-img" v-if="image" :src="image"/>
        <typeahead v-if="image" class="target-input" :items="userOptions" @valueUpdate="targetNameUpdated" placeholder="照片的主人是?"></typeahead>
        <input type="text" class="post-content" v-if="image" v-model="message" placeholder="描述"></input>
        <span class="new-post-warning" v-if="newPostWarning">{{newPostWarning}}</span>
        <ex-button class="post-send" v-if="image" :status="sendPostBtnStatus" @click="onClickSend">发布</ex-button>
      </div>
    </el-dialog>


  </load-more-container>
</template>



<style lang="scss">
@import '../assets/css/common';
.container {
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;


  .new-post {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;

    .target-input {
      width: 100%;
      box-sizing: border-box;
      margin-top: 20px;
    }
    .file-uploader {
      box-sizing: border-box;
      position: relative;
      color: #1E88C7;
      text-decoration: none;
      text-indent: 0;
      text-align: center;
      font-size: 12px;
      line-height: 30px;
      min-height: 30px;

      span {
        position: absolute;
        position: absolute; left: 50%; top: 50%;
        transform: translate(-50%, -50%);
      }

      input {
        width: 100%;
        opacity: 0;
        filter: alpha(opacity=0);
        cursor: pointer;
      }

      img {
        position: absolute;
        position: absolute; left: 50%; top: 50%;
        transform: translate(-50%, -50%);
        height: 10px;
        width: 10px;
      }
    }

    .new-post-warning {
      color: red;
      font-size: 14px;
      margin-bottom: 10px;
      margin-left: 4px;
      margin-left: 12px;
      margin-top: 12px;
    }

    input::-webkit-calendar-picker-indicator {
      display: none;
    }

    .post-content {
      box-sizing: border-box;
      border: solid 1px #dbdbdb;
      border-radius: 3px;
      color: #262626;
      outline: none;
      font-size: 14px;
      padding: 3px 10px 3px 10px;
      min-height: 40px;
      margin-top: 12px;

      flex-grow: 1;
    }
  }

  .post-send {
    margin-top: 30px;
  }

  .post-img {
    display: block;
    width: 100%;
    height: auto;
    margin-top: 25px;
    box-shadow: 3px 3px 10px #ccc;
    border: 1px solid #ccc;
  }
}

</style>

<script>
import Vue from 'vue'
import {simpleRequest, uploadImage} from '../utils/network'
import * as store from '../utils/store'
import router from '../router'
import Typeahead from '../components/Typeahead'
import ExButton from '../components/ExButton.vue'
import bus from '../bus'
import LoadMoreContainer from '../components/LoadMoreContainer.vue'
import { Message } from 'element-ui'
import Post from '../components/Post.vue'
import {basePageMixin} from './base.js'

export default {
  name: 'timeline',
  mixins: [basePageMixin],
  components: {
    Typeahead, ExButton, LoadMoreContainer, Post,
  },
  data: function() {
    return {
      message: "",
      image: '',
      file: '',
      userOptions: [],
      posts: [],
      targetName: "",
      newPostWarning: "",
      showPostDialog: false,
      sendPostBtnStatus: 'default',
      loadingSelectedImage: false,
    }
  },
  computed: {
    username() {
      this.getUsers()
      return this.$store.state.username
    },
  },
  created: function() {
    const _ = this
    if (!store.getAuth()) {
      router.replace('login')
      return
    }

    if (this.posts.length == 0) {
      getPosts().then(r=>this.posts=r.posts)
    }

    bus.$on('onNewPostClick', this.showNewPostDialog)
  },
  destroyed() {
    bus.$off('onNewPostClick', this.showNewPostDialog)
  },
  methods: {
    async getUsers() {
      const users = (await getUsers()).users
      this.userOptions = users.map(e=>e.username)
    },
    showNewPostDialog() {
      console.log('new post')
      this.showPostDialog = true
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.file = files[0]
      this.createImage(files[0]);
    },
    createImage(file) {
      this.loadingSelectedImage = true
      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result;
        this.loadingSelectedImage = false
      };
      reader.readAsDataURL(file);
    },
    async onClickSend(e) {
      if (!this.file) {
        this.newPostWarning = "请选择需要发布的图片"
        return
      }
      if (!this.targetName) {
        this.newPostWarning = "你拍的谁？"
        return
      }
      this.newPostWarning = ''
      try {
        this.sendPostBtnStatus = 'loading'
        const postResp = await sendNewPost(this.message, this.file, this.targetName)
        this.showPostDialog = false
        this.posts.unshift(postResp.post)
        this.file = null
        this.message = null
        this.targetName = null
        this.image = null
      } catch(e) {
        this.newPostWarning = e.errmsg
      } finally {
        this.sendPostBtnStatus = 'default'
      }

    },
    targetNameUpdated(val) {
      this.targetName = val
    },
    async onLoadMorePost() {
      const start_id = this.posts[this.posts.length-1].id
      try {
        const resp = await getPosts(start_id, 5)
        this.posts = this.posts.concat(resp.posts)
      } catch(e) {
        console.error(e)
      } finally {
        this.$refs.postLoader.stopLoading()
      }
    },
    gotoUserInfo(username) {
      router.push({
        name: 'userinfo',
        params: {username: username}
      })
    },
    async deletePost(postId) {
      await this.$confirm({
        content: '确认删除该照片?'
      })
      try {
        await deletePost(postId)
        Message({
          message: '删除成功',
          type: 'success'
        })
        this.posts = this.posts.filter(post=>post.id != postId)
      } catch(e) {
        Message({
          message: '删除失败',
          type: 'error'
        })
      }
    },
    onPostDeleted(postId) {
      this.posts = this.posts.filter(post=>post.id != postId)
    }
  }
}

async function sendNewPost(content, file, username) {
  const photo = await uploadImage(file)
  const post = await sendPost(content, photo, username)
  return post
}

function sendPost(content, photo, targetname) {
  const data = {
    target_name: targetname,
    photos: [photo],
    content: content
  }
  return simpleRequest({
    method: 'POST',
    url: '/api/post',
    data: data
  })

}

async function getPosts(start_id=-1, limit=5) {
  const resp = await simpleRequest({
    url: '/api/post',
    data: {
      start_id: start_id,
      limit: limit,
    }
  })

  return resp
}

function getUsers() {
  return simpleRequest({
    url: '/api/users',
  })
}




</script>
