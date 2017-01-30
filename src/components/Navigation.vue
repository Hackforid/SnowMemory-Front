<template>
<div class="navigation">
  <div class="line"/>
  <div class="nav-container">
    <div class="nav-left">
      <img class="logo" src="/static/img/logo.png" @click="gotoIndex"/>
      <span class="logo-name" @click="gotoIndex">SnowMemory</span>
    </div>
    <div class="nav-center">
    </div>
    <div class="nav-right">
      <span class="post-photo" @click="onNewPostClick" v-if="showPostBtn">发照片</span>
      <img class="right-logo user-logo" src="/static/img/user.png" v-if="username" @click="gotoUserInfo"/>
    </div>
  </div>
</div>
</template>



<script>
import bus from '../bus'
import router from '../router'
export default {
  name: 'navigation',
  data() {
    return {
    }
  },
  computed: {
    username() {
      return localStorage.username
    },
    showPostBtn() {
      console.log(this.$route)
      return this.$route.name == 'timeline'
    }
  },
  methods: {
    onNewPostClick() {
      bus.$emit('onNewPostClick')
    },
    gotoUserInfo() {
      router.push({
        name: 'userinfo',
        params: {username: this.username}
      })
    },
    gotoIndex() {
      router.push({
        name: 'timeline',
      })
    },
  },
  created() {
    bus.$on('showNewPostBtn', function() {
    })
  }
}
</script>



<style lang="scss">
@import '../assets/css/common';
.navigation {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 1;

    .line {
      background-color: #ddd;
      height: 1px;
      width: 100%;
      position: absolute;
      bottom: 0;
    }
  .nav-container {
    margin: 0 auto;
    height: 100%;
    max-width: 800px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .nav-left {
      flex: 1 0 0%;
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .nav-right {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .logo {
      height: 45px;
      width: 45px;
      cursor: pointer;
    }

    .logo-name {
      font-size: 24px;
      font-weight: bold;
      color: black;
      margin-left: 12px;
      cursor: pointer;
    }

    .right-logo {
      height: 20px;
      width: 20px;
      margin-left: 20px;
      cursor: pointer;
    }
  }
}
</style>
