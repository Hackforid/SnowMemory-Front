//const HOST = "http://127.0.0.1:9501"
const HOST = "http://snow.smilehacker.com"
import * as store from './store'
import router from '../router'

export async function simpleRequest(option) {
  let resp = null
  let req = requestAPI(option)
  try { resp = await requestAPIPromise(req)
  } catch(e) {
    if (e.errcode == 3000) {
      store.saveAuth(null, null)
      router.push("login")
      return
    } else {
      throw e
    } 
  }
  return resp.result
}

export function requestAPI(option) {
  const req = new XMLHttpRequest()
  let url = HOST + option.url
  option.method = option.method || 'GET'
  let data = null
  if (option.data) {
    if (option.method == 'GET' || option.method == 'DELETE') {
      if (!url.includes('?')) {
        url += "?"
      }
      for (var key in option.data) {
        url += `&${key}=${option.data[key]}`
      }
    } else {
      data = option.data
    }
  }
  req.open(option.method, url)
  req.setRequestHeader('content-type', 'application/json')
  const auth = store.getAuth()
  if (auth) {
    req.setRequestHeader("username", auth.username)
    req.setRequestHeader("Authorization", auth.accessToken)
  }
  if (option.headers) {
    for (var key in option.headers) {
      req.setRequestHeader(key, option.data[key])
    }
  }
  if (data) {
    req.send(JSON.stringify(data))
  } else {
    req.send()
  }
  return req
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

export async function uploadImage(file) {
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

