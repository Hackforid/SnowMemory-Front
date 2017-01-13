<template>
  <div>
<div class="navigation">
  <div class="line"/>
</div>
<div class="container">
  <textarea v-model="message" placeholder="add multiple lines"></textarea>
  <img v-if="image" :src="image"/>
  <input @change="onFileChange" type="file" name="pic" id="pic" accept="image/gif, image/jpeg" />
  <button id="btn-send" @click="onClickSend">send</button>
</div>
</div>
</template>



<style lang="scss">
.navigation {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;

    .line {
      background-color: #ddd;
      height: 1px;
      width: 100%;
      position: absolute;
      bottom: 0;
    }
}

.container {
  margin-top: 80px;
}

</style>

<script>
export default {
  name: 'app',
  data: function() {
    return {
      message: "aaa",
      image: '',
      file: ''
    }
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
          console.log(e)
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
  const key = 'photo_' + new Date().getTime()
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
</script>
