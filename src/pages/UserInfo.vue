<template>
<div>
  <div class="info">
    <div class="info-avatar">
    </div>
    <div class="info-detail">
      <span class="info-username"></span>
      <span class="info-email"></span>
    </div>
  </div>
  <div class="photos">

  </div>
</div>
</template>


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
    getUserInfo()
  },
  method: {

  }

}

function getUserInfo(username) {
  return simpleRequest({
    url: `/api/user/${username}/info`
  })
}

</script>
