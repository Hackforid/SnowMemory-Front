<template>
  <div class="container">
    <div class="card login-box">
        <input type="text" name="username" id="username" class="card-text-input" placeholder="Username" v-model="username"/>
        <input type="password" name="password" id="password" class="card-text-input" placeholder="Password" v-model="password"/>
        <button class="btn-login card-btn" type="submit" @click="onLogin">{{ uiType == 'login' ? 'Login' : 'Register'}}</button>
        <span class="btn-ui-type" @click="changeUIType">{{ uiType == 'login' ? 'Register' : 'Login'}}</span>
    </div>
  </div>
</template>
<style lang="scss">
@import '../assets/css/common';
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-box {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  margin-top: 200px;
  padding: 24px;
  width: 400px;

  input#password {
    margin-top: 10px;
  }

  .card-text-input {
    background: 0 0;
    border: 1px solid #dbdbdb;
    border-radius: 3px;
    color: #262626;
    font-size: 14px;
    padding: 9px 8px 7px;
    width: 100%
  }

  .card-btn {
    box-sizing: content-box;
    width: 100%;
    line-height: 28px;
    padding: 0 8px;
    font-size: 16px;
    curosr: pointer;
    background: #3897f0;
    color: #fff;
    border-radius: 3px;
    border: 1px solid #3897f0;
    outline: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-sapce: nowrap;
  }

  .btn-login {
    margin-top: 18px;
  }

  .btn-ui-type {
    color: #3897f0;
    font-size: 14px;
    align-self: flex-end;
    margin-top: 12px;
  }

}
</style>
<script>
import SHA256 from 'js-sha256'
import {simpleRequest} from '../utils/network'
import * as store from '../utils/store'
import router from '../router'
export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
      uiType: 'login',
    }
  },
  methods: {
    async onLogin(e) {
      if (!this.username || !this.password) {
        return
      }
      let user = null
      if (this.uiType == 'login') {
        user = await login(this.username, this.password)
      } else {
        user = await register(this.username, this.password)
      }
      if (user && user.access_token) {
        store.saveAuth(user.username, user.access_token)
        router.replace('timeline')
      }
    },
    changeUIType(e) {
      this.uiType = this.uiType == 'login' ? 'register' : 'login'
    }
  }
}

async function register(username, password) {
  const pwd = passwordHash(password)
  const resp = await simpleRequest({
    method: 'POST',
    url: '/api/register',
    data: {
      username,
      password: pwd,
    }
  })
  return resp
}

async function login(username, password) {
  const pwd = passwordHash(password)
  const resp = await simpleRequest({
    method: 'POST',
    url: '/api/auth',
    data: {
      username,
      password: pwd,
    }
  })
  return resp
}


function passwordHash(password) {
  return SHA256.sha256(password + 'tcfyNXf3Swg7erXPvBBYWWwCTuxDLP0NQYoN')
}
  </script>

