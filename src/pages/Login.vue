<template>
  <div class="container">
    <div class="card login-box">
        <span class="login-error" v-if="error">{{error}}</span>
        <input type="text" name="email" id="email" class="card-text-input login-input" placeholder="Email" v-model="email" v-if="uiType != 'login'"/>
        <div class="verify-code-box" v-if="uiType != 'login'">
          <input type="text" name="code" id="code" class="card-text-input login-input" placeholder="验证码" v-model="code" />
          <span class="send-verify-code-btn" @click="sendVerifyCode" v-if="!isWaitingSendVerifyCode">发送验证码</span>
          <img class="send-verify-code-progress" src="/static/img/loading_circle_progress.gif" v-if="isWaitingSendVerifyCode"/>
        </div>
        <input type="text" name="username" id="username" class="card-text-input login-input" placeholder="用户名" v-model="username"/>
        <input type="password" name="password" id="password" class="card-text-input login-input" placeholder="密码" v-model="password"/>
        <ex-button class="btn-login" :status="loginBtnStatus" @click="onLogin">{{ uiType == 'login' ? 'Login' : 'Register'}}</ex-button>
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

  .login-input {
    margin-top: 10px;
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

  .verify-code-box {
    width: 100%;
    position: relative;
    .send-verify-code-btn {
      position: absolute;
      top: calc(50% - 1px);
      line-height: 12px;
      font-size: 12px;
      color: #3897f0;
      right: 10px;
      cursor: pointer;
    }

    .send-verify-code-progress {
      position: absolute;
      top: 50%;
      font-size: 12px;
      color: #3897f0;
      right: 30px;
      cursor: pointer;
      width: 12px;
      height: 12px;
    }
  }
  .login-error {
    color: red;
    font-size: 14px;
    margin-left: 4px;
    align-self: flex-start;
  }

}
</style>
<script>
import SHA256 from 'js-sha256'
import {simpleRequest} from '../utils/network'
import * as store from '../utils/store'
import router from '../router'
import { Notification } from 'element-ui'
import ExButton from '../components/ExButton.vue'

export default {
  name: 'login',
  components: {
    ExButton,
  },
  data() {
    return {
      username: '',
      password: '',
      uiType: 'register',
      email: '',
      code: '',
      error: '',
      isWaitingSendVerifyCode: false,
      loginBtnStatus: 'default',
    }
  },
  computed: {
  },
  methods: {
    async onLogin(e) {
      if (!this.username || !this.password) {
        return
      }
      let user = null
      if (this.uiType == 'login') {
        try {
          this.loginBtnStatus = 'loading'
          user = await login(this.username, this.password)
          this.error = ''
        } catch(e) {
          this.error = e.errmsg
        } finally {
          this.loginBtnStatus = 'default'
        }
      } else {
        try {
          this.loginBtnStatus = 'loading'
          user = await register(this.username, this.password, this.email, this.code)
          this.error = ''
        } catch(e) {
          this.error = e.errmsg
        } finally {
          this.loginBtnStatus = 'default'
        }
      }
      if (user && user.access_token) {
        store.saveAuth(user.user.username, user.access_token)
        router.replace('timeline')
      }
    },
    changeUIType(e) {
      this.uiType = this.uiType == 'login' ? 'register' : 'login'
    },
    async sendVerifyCode() {
      console.log('send code')
      if (!this.email) {
        this.error = "请填写邮箱"
        return
      }
      try {
        this.isWaitingSendVerifyCode = true
        const resp = await sendVerifyCode(this.email)
        this.error = ''
        Notification({
          title: '发送成功',
          message: '请到注册邮箱查看验证码',
          type: 'success',
        });
      } catch(e) {
        this.error = e.errmsg
        Notification({
          title: '发送失败',
          message: e.errmsg,
          type: 'error',
        });
      } finally {
        this.isWaitingSendVerifyCode = false
      }
    }
  }
}

async function register(username, password, email, code) {
  const pwd = passwordHash(password)
  const resp = await simpleRequest({
    method: 'POST',
    url: '/api/register',
    data: {
      username,
      password: pwd,
      email: email,
      code: code,
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

async function sendVerifyCode(email) {
  const resp = await simpleRequest({
    url: `/api/register?email=${email}`
  })
  return resp
}


function passwordHash(password) {
  return SHA256.sha256(password + 'tcfyNXf3Swg7erXPvBBYWWwCTuxDLP0NQYoN')
}
</script>

