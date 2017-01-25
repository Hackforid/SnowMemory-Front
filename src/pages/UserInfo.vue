<template>
<div class="info-container">
  <div class="info">
    <div class="info-avatar">
      <img class="info-avatar-img" :src="userinfo && userinfo.user && userinfo.user.avatar"/>
    </div>
    <div class="info-detail">
      <span class="info-username">{{userinfo && userinfo.user && userinfo.user.username}}</span>
      <span class="info-email">{{userinfo && userinfo.user && userinfo.user.email}}</span>
      <span class="info-photo-num">{{userinfo && userinfo.posts ? userinfo.posts.length : 0 }}<span class="info-photo-num-unit">张</span> </span>
    </div>
  </div>
  <div class="post-photos" v-if="userinfo && userinfo.posts">
    <div class="post-photo" v-for="post in userinfo.posts">
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
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  padding-top: 80px;

  .info-avatar {
    width: 90px;
    height: 90px;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }

  .info-detail {
    margin-left: 50px;
    color: black;
    .info-username {
      display: block;
      font-size: 26px;
      font-weight: bold;
    }

    .info-email {
      display: block;
      font-size: 16px;
      margin-top: 8px;
    }

    .info-photo-num {
      display: block;
      font-size: 26px;
      margin-top: 10px;

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

  .post-photo {
    background-color: blue;
    width: 30%;
    height: 0px;
    padding-top: 30%;
    margin-top: 12px;
    position: relative;
  }


}
</style>


<script>
import {simpleRequest} from '../utils/network'
import LoadMoreContainer from '../components/LoadMoreContainer.vue'

export default {
  name: 'userinfo',
  components: {
  },
  data: function() {
    return {
      userinfo: null,
    }
  },
  computed: {
  },
  created() {
    this.showUserInfo()
  },
  methods: {
    async showUserInfo() {
      try {
        this.userinfo = await getUserInfo(this.$route.params.username)
      } catch(e) {
        console.error(e)
      }
    },
  }

}

function getUserInfo(username) {
  return simpleRequest({
    url: `/api/user/${username}/info`
  })
}

</script>
