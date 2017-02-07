<template>
<div class="navigation">
  <div class="line"/>
  <div class="nav-container">
    <div class="nav-left">
      <img class="logo" src="/static/img/logo.png" @click="gotoIndex"/>
      <span class="logo-name" @click="gotoIndex">SnowMemory</span>
    </div>
    <div class="nav-center">
      <search-view placeholder="搜索" :users="users"/>
    </div>
    <div class="nav-right">
      <span class="post-photo" @click="onNewPostClick" v-if="showPostBtn">发照片</span>
      <img class="right-logo user-logo" src="/static/img/user.png" v-if="username" @click="gotoUserInfo"/>
    </div>
  </div>
</div>
</template>


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
    position: relative;

    .nav-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }

    .nav-right {
      display: flex;
      flex-direction: row;
      align-items: center;
      float: right;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
    }

    .nav-center {
      height: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
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

    .post-photo {
      cursor: pointer;
    }

    .search-input{
      width: 200px;
    }
  }
}
</style>


<script>
import bus from '../bus'
import router from '../router'
import {simpleRequest} from '../utils/network'
import SearchView from '../components/SearchView'
export default {
  name: 'navigation',
  components: {
    SearchView,
  },
  data() {
    return {
      searchValue: '',
      users: [],
    }
  },
  computed: {
    username() {
      this.getUsers()
      return this.$store.state.username
    },
    showPostBtn() {
      return this.$route.name == 'timeline'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
    },
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
    async getUsers() {
      try {
        const users = (await getUsers()).users
        this.users = users
      } catch(e) {
      }
    },
  },
}

function getUsers() {
  return simpleRequest({
    url: '/api/users',
  })
}

</script>

