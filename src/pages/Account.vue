<template>
<div class="account-container">
  <div class="card userinfo-container category">
    <span class="category-title">设置</span>
    <div class="form-item">
      <span class="form-label">用户名</span>
        <input type="text" class="form-input card-text-input"  v-model.trim="newUsername" placeholder="新用户名"></input>
    </div>
    <ex-button @click="onChangeUserInfo" class="form-button" :custom-style="formButtonStyle" :status="changeUsernameButtonStatus">提交</ex-button>
  </div>
  <div class="card password-container category">
    <span class="category-title">密码</span>
    <div class="form-item">
      <span class="form-label">当前密码</span>
        <input type="password" class="form-input card-text-input"  v-model.trim="oldPassword" placeholder="当前密码"></input>
    </div>
    <div class="form-item new-password">
      <span class="form-label">新密码</span>
        <input type="password" class="form-input card-text-input"  v-model.trim="newPassword" placeholder="新密码"></input>
    </div>
    <ex-button @click="onChangePassword" class="form-button" :custom-style="formButtonStyle" :status="changePasswordButtonStatus">提交</ex-button>
  </div>
</div>
</template>

<style lang="scss">
@import '../assets/css/common';

.account-container {
  box-sizing: border-box;
  padding-top: 40px;
}

.category {
  box-sizing: border-box;
  padding: 24px;

  .category-title {
    display: block;
    color: #ddd;
    font-size: 16px;
    font-weight: 300;
    margin-bottom: 30px;
    margin-left: 20px;
  }
}

.form-item {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;

  .form-label {
    width: 100px;
    text-align: right;
    color: #262626;
    font-size: 16px;
    font-weight: 600;
  }

  .form-input {
    width: 100%;
    margin-left: 18px;
  }

}
.form-button {
  width: 50px;
  margin-left: 120px;
  margin-top: 15px;
}

.new-password {
  margin-top: 18px;
}

.password-container {
  margin-top: 30px;
}


</style>

<script>
import ExButton from '../components/ExButton.vue'
import {simpleRequest} from '../utils/network'
import { Message } from 'element-ui'
import * as store from '../utils/store'
import { passwordHash } from '../utils/auth'

export default {
  name: 'account',
  components: {
    ExButton,
  },
  data: function() {
    return {
      newUsername: null,
      oldPassword: null,
      newPassword: null,
      changePasswordButtonStatus: 'default',
      changeUsernameButtonStatus: 'default',
      formButtonStyle: {
        color: '#262626',
        'border-color': '#262626',
        'background-color': 'white',
      },
    }
  },
  methods: {
    async onChangeUserInfo() {
      if (!this.newUsername || !this.newUsername.trim()) {
        return
      }
      const username = this.newUsername.trim()
      await this.$confirm({
        content: '确认修改用户名？'
      })
      this.changeUsernameButtonStatus = 'loading'
      try {
        const resp = await changeUsername(username)
        Message({
          message: '修改成功',
          type: 'success'
        })
        this.newUsername = null
        store.saveAuth(resp.user.username, resp.access_token)
      } catch(e) {
        Message({
          message: '修改失败 ' + e.errmsg,
          type: 'error'
        })
      }
      this.changeUsernameButtonStatus = 'default'
    },
    async onChangePassword() {
      if (!this.oldPassword || !this.newPassword) {
        return
      }
      await this.$confirm({
        content: '确认修改密码？'
      })
      this.changePasswordButtonStatus = 'loading'
      try {
        const resp = await changePassword(this.oldPassword, this.newPassword)
        Message({
          message: '修改成功',
          type: 'success'
        })
        this.newPassword = null
        this.oldPassword = null
      } catch(e) {
        console.error(e)
        Message({
          message: '修改失败 ' + e.errmsg,
          type: 'error'
        })
      }
      this.changePasswordButtonStatus = 'default'
    },
  },
}

function changeUsername(username) {
  return simpleRequest({
    url: '/api/account/edit/username',
    method: 'PUT',
    data: {
      username
    }
  })
}

function changePassword(oldPwd, newPwd) {
  oldPwd = passwordHash(oldPwd)
  newPwd = passwordHash(newPwd)
  return simpleRequest({
    url: '/api/account/edit/password',
    method: 'PUT',
    data: {
      old_password: oldPwd,
      new_password: newPwd,
    }
  })
}
</script>
