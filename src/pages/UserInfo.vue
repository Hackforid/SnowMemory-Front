<template>
<div class="info-container">
  <div class="info">
    <div class="info-avatar">
      <div class="info-avatar-img-div" :style="{backgroundImage: 'url(' + userinfo.user.avatar  + ')'}" v-if="userinfo" />
    </div>
    <div class="info-detail">
      <div class="info-username-box">
        <span class="info-username">{{userinfo && userinfo.user && userinfo.user.username}}</span>
        <span class="info-edit" @click="gotoAccount" v-if="username == currentUsername">编辑资料</span>
      </div>
      <span class="info-email">{{userinfo && userinfo.user && userinfo.user.email}}</span>
      <span class="info-photo-num">{{userinfo && userinfo.posts ? userinfo.posts.length : 0 }}<span class="info-photo-num-unit">张</span> </span>
    </div>
  </div>
  <div class="post-photos" v-if="userinfo && userinfo.posts">
    <div class="post-photo" v-for="post in userinfo.posts">
      <img :src="post.photos[0] + '-normal'" @click="gotoPostInfo(post.id)"/>
    </div>

  </div>
</div>
</template>

<style lang="scss">
.info-container {
  width: 900px;
  margin-left: -130px;

}
.info {
  width: 700px;
  display: flex;
  flex-direction: row;
  margin: 0 auto;

  padding-top: 50px;

  .info-avatar {
    width: 150px;
    height: 150px;
    .info-avatar-img-div {
      width:100%;
      height:100%;
      background-image: url(http://ojgpsx1q3.bkt.clouddn.com/photo_1486454108240.jpg);
      background-size: cover;
      background-position: center center;
      border-radius: 50%;
    }
  }

  .info-detail {
    margin-left: 50px;
    color: black;
    .info-username-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      .info-username {
        font-size: 34px;
        font-weight: 300;
        padding: 0px;
      }
      .info-edit {
        font-size: 16px;
        border: 1px solid #999;
        border-radius: 3px;
        color: #999;
        padding: 3px 10px;
        cursor: pointer;
        margin-top: 6px;
        margin-left: 12px;
      }
    }

    .info-email {
      display: block;
      font-size: 16px;
      margin-top: 8px;
    }

    .info-photo-num {
      display: block;
      font-size: 26px;
      margin-top: 16px;

      .info-photo-num-unit {
        color: #ddd;
        font-size: 8px;
        margin-left: 4px;
      }
    }
  }
}
.post-photos {
  box-sizing:: border-box;
  width: 100%;
  display: flex;
  flex-flow : row wrap;
  justify-content: space-around;
  margin-top: 50px;

  .post-photo {
    width: 30%;
    height: 0px;
    padding-top: 30%;
    margin-top: 22px;
    position: relative;

    img {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      object-fit: cover;
      height: 100%;
      width: 100%;
      cursor: pointer;
    }
  }


}
</style>


<script>
import {simpleRequest} from '../utils/network'
import LoadMoreContainer from '../components/LoadMoreContainer.vue'
import router from '../router'
import {basePageMixin} from './base.js'

export default {
  name: 'userinfo',
  mixins: [basePageMixin],
  components: {
  },
  data: function() {
    return {
      userinfo: null,
    }
  },
  computed: {
    username() {
      return this.$route.params.username
    },
    currentUsername() {
      return localStorage.username
    }
  },
  created() {
    this.initData()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.initData()
  },
  methods: {
    initData() {
      this.showUserInfo()
    },
    async showUserInfo() {
      try {
        this.userinfo = await getUserInfo(this.$route.params.username)
      } catch(e) {
        console.error(e)
      }
    },
    gotoAccount() {
      router.push({
        name: 'account'
      })
    },
    gotoPostInfo(id) {
      router.push({
        name: 'postinfo',
        params: {postId: id}
      })
    },
  }

}

function getUserInfo(username) {
  return simpleRequest({
    url: `/api/user/${username}/info`,
    data: {
      with_post: 1
    }
  })
}

</script>
