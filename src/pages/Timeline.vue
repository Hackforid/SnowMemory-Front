<template>
  <div class="container">
    <div class="card new-post">
      <span class="new-post-warning" v-if="newPostWarning">{{newPostWarning}}</span>
      <typeahead class="target-input" :items="users" @valueUpdate="targetNameUpdated"></typeahead>
      <div class="post_input">
        <input type="text" class="post_content" v-model="message" placeholder="type you message"></input>
        <span class="card file_uploader">
          +
          <input class="post_file" @change="onFileChange" type="file" name="pic" id="pic" accept="image/gif, image/jpeg, image/png" />
        </span>
      </div>
      <img class="post_img" v-if="image" :src="image"/>
      <button class="post_send" v-if="image && message" @click="onClickSend">send</button>
    </div>



    <div class="card post" v-for="post of posts" :key="post.id">
      <div class="post_header">
        <img class="avatar" :src="post.target && post.target.avatar" /><span class="target">{{post.target && post.target.username}}</span>
      </div>
      <img class="photo" :src="post.photos[0]"/>
      <div class="author-line">
        <span class="author">@{{post.author && post.author.username}}</span>
        <span class="author-comment">{{post.content}}</span>
      </div>
      <div class="comment-item" v-for="comment of post.comments">
        <span class="comment-item-author"><b>{{comment.author.username}}</b></span>
        <span class="comment-item-content">{{comment.content}}</span>
      </div>
      <div class="new-comment">
        <input type="text" class="new-comment-input" placeholder="添加评论" @keyup.enter="newComment(post.id, $event.target.value)"></input>
      </div>
    </div>


  </div>
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
    margin-top: 40px;

    display: flex;
    flex-direction: column;
    padding: 24px;
    width: 100%;

    .target-input {
      width: 100%;
      box-sizing: border-box;
    }

    .new-post-warning {
      color: red;
      font-size: 14px;
      margin-bottom: 10px;
      margin-left: 4px;
    }

    input::-webkit-calendar-picker-indicator {
      display: none;
    }

    .post_input {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center; 
      margin-top: 20px;
      .post_content {
        box-sizing: border-box;
        border: solid 1px #dbdbdb;
        border-radius: 3px;
        color: #262626;
        outline: none;
        font-size: 14px;
        padding: 3px 10px 3px 10px;
        min-height: 40px;

        flex-grow: 1;
      }

      .file_uploader {
        position: relative;
        display: inline-block;
        padding: 4px 12px;
        overflow: hidden;
        color: #1E88C7;
        text-decoration: none;
        text-indent: 0;
        text-align: center;
        width: 30px;
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
        border: solid 1px #dbdbdb;

        flex-grow: 0;
        input {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;

          opacity: 0;
          filter: alpha(opacity=0);
          cursor: pointer
        }
      }
    }
  }

  .post_send {
    margin-top: 30px;
    height: 30px;
    border: solid 1px #dbdbdb;
    border-radius: 5px;
    background-color: white;
    width: 50%;
    align-self: center;
  }

  .post_img {
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
    margin-top: 50px;
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
      height: auto;
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
      margin: 24px;

      .author {
      }

      .author-comment {

      }
    }

    .new-comment {
      box-sizing: border-box;
      padding-top: 24px;
      padding-bottom: 24px;
      margin-left: 24px;
      margin-right: 24px;
      border-top: solid 1px #dbdbdb;

      .new-comment-input {
        width: 100%;
        background: 0 0;
        border: none;
        outline: none;
        color: #262626;
        font-size: 14px;
        line-height: 17px;
      }
    }

    .comment-item {
      box-sizing: border-box;
      margin-left: 24px;
      margin-right: 24px;
      margin-bottom: 6px;

      .comment-item-author {
        color: #262626;
        text-decoration: none;
        font-size: 15px;
        line-height: 18px;
        font-weight: 600;
      }

      .comment-item-content {
        color: #262626;
        font-size: 14px;
        line-height: 17px;
        margin-left: 10px;
      }
    }
  }
}

</style>

<script>
import {simpleRequest} from '../utils/network'
import * as store from '../utils/store'
import router from '../router'
import Typeahead from '../components/Typeahead'

export default {
  name: 'timeline',
  components: {
    Typeahead
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
    }
  },
  computed: {
    username() {
      return localStorage.username
    }
  },
  created: function() {
    if (!store.getAuth()) {
      router.replace('login')
      return
    }
    getPosts().then(r=>this.posts=r.list)
    getUsers().then(r=>this.users=r.users.map(e=>e.username))
  },
  methods: {
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
    onClickSend(e) {
      const file = this.file
      if (!this.file) {
        this.newPostWarning = "请选择需要发布的图片"
        return
      }
      if (!this.targetName) {
        this.newPostWarning = "请选择图片的主人"
        return
      }
      if (!this.message) {
        this.newPostWarning = "请输入描述"
        return
      }
      sendNewPost(this.message, file, this.targetName)
        .then(r=>{
          console.log(r)
        })
        .catch(e=>{
        console.error(e)
      })
    },
    targetNameUpdated(val) {
      this.targetName = val
    },
    newComment(postId, content) {
      postComment(postId, content)
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

function getPosts() {
  return simpleRequest({
    url: '/api/post',
  })
}

function getUsers() {
  return simpleRequest({
    url: '/api/users',
  })
}

function postComment(postId, content) {
  return simpleRequest({
    method: 'POST',
    url: `/api/post/${postId}/comment`,
    data: {
      content: content
    }
  })
}

</script>
