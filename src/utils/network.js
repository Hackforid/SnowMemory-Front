const HOST = "http://127.0.0.1:9501"


export function requestAPI(option) {
  const req = new XMLHttpRequest()
  let url = HOST + option.url
  option.method = option.method || 'GET'
  let data = null
  if (option.data) {
    if (option.method == 'GET' || option.method == 'DELETE') {
      if (!url.includes('?')) {
        option.url += "?"
      }
      for (key in option.data) {
        url += `&${key}=${option.data[key]}`
      }
    } else {
      data = option.data
    }
  }
  req.open(option.method, url)
  req.setRequestHeader('content-type', 'application/json')
  if (option.headers) {
    for (key in option.headers) {
      req.setRequestHeader(key, option.data[key])
    }
  }
  if (data) {
    req.send(JSON.stringify(data))
  } else {
    req.send()
  }
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