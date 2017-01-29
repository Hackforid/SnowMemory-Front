<template>
  <load-more-container class="container" @onLoadMore="onLoadMorePost" ref="postLoader">

    <div class="card post" v-for="post of posts" >
      <div class="post_header">
        <img class="avatar" :src="post.target && post.target.avatar" /><span class="target">{{post.target && post.target.username}}</span>
      </div>
      <img class="photo" :src="post.photos[0]"/>
      <div class="author-line">
        <span class="author">@{{post.author && post.author.username}}</span>
        <span class="author-comment">{{post.content}}</span>
      </div>
      <span class="btn-more-comment" v-if="!post.showAllComments && post.comments.length > 5" @click="showAllComments(post.id)">全部 {{post.comments.length}} 条评论</span>
      <div class="comment-item" v-for="comment of post.comments.length > 5 && !post.showAllComments ? post.comments.slice(post.comments.length - 5) : post.comments" >
        <span class="comment-item-author"><b>{{comment.author.username}}</b></span>
        <span class="comment-item-content">{{comment.content}}</span>
        <span class="comment-item-delete" @click="onDeleteComment(comment)" v-if="comment.author.username == username">x</span>
      </div>
      <div class="new-comment">
        <input type="text" class="new-comment-input" placeholder="添加评论" :value="post.newComment" @keyup.enter="newComment(post, $event.target.value)"></input>
        <img class="new-comment-loading-progress" src="/static/img/loading_circle_progress.gif" v-if="post.isSendingComment" />
      </div>
    </div>
    <el-dialog title="新的记忆" v-model="showPostDialog" size="small">
      <div class="new-post">
        <div class="card file-uploader">
          <span>+挑选照片</span>
          <input class="post_file" @change="onFileChange" type="file" name="pic" id="pic" accept="image/gif, image/jpeg, image/png" />
        </div>
        <img class="post-img" v-if="image" :src="image"/>
        <typeahead v-if="image" class="target-input" :items="users" @valueUpdate="targetNameUpdated"></typeahead>
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

  .post {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 70px;
    box-sizing: border-box;

    .post_header {
      height: 36px;
      padding: 14px 24px;
      display: flex;
      align-items: center;

      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }

      .target {
        font-size: 16px;
        margin-left: 18px;
      }
    }
    .photo {
      display: block;
      width: 100%;
      /*height: 600px;*/
      /*object-fit: contain;*/
      border-bottom: 1px solid #efefef;
      border-top: 1px solid #efefef;
      box-shadow: inset 0 0 20px 0 #efefef;
      background-color: #edeeee;
    }

    .author-line {
      margin: 12px;
      color: #262626;
      font-size: 16px;
      padding: 0;
      margin: 20px 24px 14px 23px;

      .author {
        font-weight: bold;
      }

      .author-comment {

      }
    }

    .btn-more-comment {
      margin-left: 24px;
      margin-bottom: 3px;
      font-size: 15px;
      line-height: 18px;
      cursor: pointer;
      color: #999;
    }

    .new-comment {
      box-sizing: border-box;
      padding-top: 24px;
      padding-bottom: 24px;
      margin-left: 24px;
      margin-right: 24px;
      border-top: solid 1px #dbdbdb;
      position: relative;

      .new-comment-input {
        width: 100%;
        background: 0 0;
        border: none;
        outline: none;
        color: #262626;
        font-size: 14px;
        line-height: 17px;
      }

      .new-comment-loading-progress {
        position: absolute;
        right: 10px;
        top: 50%;
        height: 10px;
        width: 10px;
        transform: translate(0%, -50%);
      }
    }

    .comment-item {
      box-sizing: border-box;
      margin-left: 24px;
      margin-right: 24px;
      margin-bottom: 6px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .comment-item-author {
        color: #262626;
        font-size: 15px;
        line-height: 18px;
        font-weight: 600;
      }

      .comment-item-content {
        color: #262626;
        padding-top: 1px;
        font-size: 14px;
        line-height: 18px;
        margin-left: 10px;
        flex-grow: 1;
      }

      .comment-item-delete {
        color: #c7c7c7;
        cursor: pointer;
        font-size: 15px;
      }
    }
  }
}

</style>

<script>
import Vue from 'vue'
import {simpleRequest} from '../utils/network'
import * as store from '../utils/store'
import router from '../router'
import Typeahead from '../components/Typeahead'
import ExButton from '../components/ExButton.vue'
import bus from '../bus'
import LoadMoreContainer from '../components/LoadMoreContainer.vue'

export default {
  name: 'timeline',
  components: {
    Typeahead, ExButton, LoadMoreContainer,
  },
  data: function() {
    return {
      message: "",
      image: '',
      file: '',
      posts: [],
      users: [],
      targetName: "",
      newPostWarning: "",
      showPostDialog: false,
      sendPostBtnStatus: 'default',
    }
  },
  computed: {
    username() {
      return localStorage.username
    }
  },
  created: function() {
    const _ = this
    console.log('created')
    if (!store.getAuth()) {
      router.replace('login')
      return
    }
    getPosts().then(r=>this.posts=r.posts)
    getUsers().then(r=>this.users=r.users.map(e=>e.username))

    bus.$on('onNewPostClick', this.showNewPostDialog)
    this.$confirm({
      title: 'title'
    })
  },
  beforeMount() {
    console.log('before mount')
  },
  mounted() {
    console.log('mount')
  },
  destroyed() {
    console.log('destroyed')
    bus.$off('onNewPostClick', this.showNewPostDialog)
  },
  methods: {
    async onDeleteComment(comment) {
      try {
        await deleteComment(comment.post_id, comment.id)
      } catch(e) {
        console.error(e)
        return
      }
      const postIndex = this.posts.findIndex(e=>{
        return e.id == comment.post_id;
      })
      const post = this.posts[postIndex]
      post.comments = post.comments.filter(i=>i.id != comment.id)
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
      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async onClickSend(e) {
      if (!this.file) {
        this.newPostWarning = "请选择需要发布的图片"
        return
      }
      if (!this.targetName) {
        this.newPostWarning = "请选择图片的主人"
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
    async newComment(post, content) {
      if (!content.trim()) {
        return
      }
      const position = this.posts.findIndex(e=>{
        return e.id == post.id;
      })
      post.newComment = content
      try {
        post.isSendingComment = true
        Vue.set(this.posts, position, post)
        const resp = await postComment(post, content)

        if (post.comments.length <= 5) {
          post.showAllComments = true
        } 
        post.comments.push(resp.comment)
        post.newComment = ''
      } catch(e) {
        console.error(e)
      } finally {
        post.isSendingComment = false
        Vue.set(this.posts, position, post)
      }
    },
    showAllComments(id) {
      const index = this.posts.findIndex(e=>{return e.id == id})
      const post = this.posts[index]
      post.showAllComments = true
      Vue.set(this.posts, index, post)
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
    }
  }
}

async function sendNewPost(content, file, username) {
  const photo = await uploadImage(file)
  const post = await sendPost(content, photo, username)
  return post
}

async function uploadImage(file) {
  const fileType = file.name.substring(file.name.lastIndexOf('.'))
  const key = 'photo_' + new Date().getTime() + fileType
  const tokenResp = await getUploadToken(key)
  const token = tokenResp.token
  const uploadResp = await uploadFile(key, token, file)
  return "http://ojgpsx1q3.bkt.clouddn.com/" + key
}

function getUploadToken(key) {
  return simpleRequest({
    method: 'GET',
    url: "/api/store/upload_token",
    data: {
      filename: key
    }
  })
}

function uploadFile(key, token, file) {
  const req = new XMLHttpRequest()
  const data = new FormData()
  data.append("key", key)
  data.append("token", token)
  data.append("file", file)
  req.open('POST', 'http://up-z1.qiniu.com')
  req.send(data)
  return requestPromise(req)
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

function requestPromise(req) {
  return new Promise((resolve, reject) => {
    req.onloadend = function() {
      if (req.status == 200) {
        resolve(req.responseText)
      } else {
        reject(req.statusText)
      }
    }
  })
}

function requestAPIPromise(req) {
  const promise = requestPromise(req)
  return new Promise((resolve, reject) => {
    promise.then(r=>{
      const data = JSON.parse(r)
      if (data.errcode == 0) {
        resolve(data)
      } else {
        reject(data)
      }
    }).catch(e=>{
      console.error(e)
      reject({errcode: 1000, errmsg: "network error"})
    })
  })
}

function getPosts(start_id=-1, limit=5) {
  return simpleRequest({
    url: '/api/post',
    data: {
      start_id: start_id,
      limit: limit,
    }
  })
}

function getUsers() {
  return simpleRequest({
    url: '/api/users',
  })
}

function postComment(post, content) {
  return simpleRequest({
    method: 'POST',
    url: `/api/post/${post.id}/comment`,
    data: {
      content: content
    }
  })
}

function deleteComment(postId, commentId) {
  return simpleRequest({
    method: 'DELETE',
    url: `/api/post/${postId}/comment/${commentId}`
  })
}


</script>
