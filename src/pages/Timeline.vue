<template>
  <div class="container">
    <div class="card new_post">
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
    <div class="card post" v-for="post of posts">
      <div class="post_header">
        <span class="target">{{post.target.nickname}}</span>
      </div>
      <img class="photo" :src="post.photos[0]"/>
      <span class="author">@{{post.author.nickname}}</span>
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


  .new_post {
    box-sizing: border-box;
    margin-top: 40px;

    display: flex;
    flex-direction: column;
    padding: 24px;
    width: 100%;

    .post_input {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

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

    margin-top: 50px;

    .post_header {
      height: 36px;
      padding: 14px 20px;
      display: flex;
      align-items: center;

      .target {
        font-size: 16px;

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

    .author {
      display: block;
      align-self: flex-end;
      margin: 12px;
      color: #ddd;
    }
  }
}

</style>

<script>
import {requestAPI} from '../utils/network'
import * as store from '../utils/store'

export default {
  name: 'timeline',
  data: function() {
    return {
      message: "aaa",
      image: '',
      file: '',
      posts: [],
    }
  },
  created: async function() {
    console.log("created")
    const resp = await getPosts()
    this.posts = resp.result.list
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
      sendNewPost(this.message, file)
        .then(r=>{
          console.log(r)
        })
        .catch(e=>{
        console.error(e)
      })
    }
  }
}

async function sendNewPost(content, file) {
  const photo = await uploadImage(file)
  const post = await sendPost(content, photo)
  return post
}

async function uploadImage(file) {
  const fileType = file.name.substring(file.name.lastIndexOf('.'))
  const key = 'photo_' + new Date().getTime() + fileType
  const tokenResp = await getUploadToken(key)
  const token = tokenResp.result.token
  const uploadResp = await uploadFile(key, token, file)
  return "http://ojgpsx1q3.bkt.clouddn.com/" + key
}

function getUploadToken(key) {
  const req = new XMLHttpRequest()
  const url = `http://127.0.0.1:9501/api/store/upload_token?filename=${key}`
  req.open('GET', url)
  req.send()
  return requestAPIPromise(req)
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

function sendPost(content, photo) {
  const req = new XMLHttpRequest()
  req.open('POST', 'http://127.0.0.1:9501/api/post')
  req.setRequestHeader('content-type', 'application/json')
  const data = {
    author_id: 1,
    target_id: 1,
    photos: [photo],
    content: content
  }
  req.send(JSON.stringify(data))
  return requestAPIPromise(req)

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
  return requestAPI({
    url: '/api/post',
  })
}

</script>
