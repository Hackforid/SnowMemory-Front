<template>
  <div class="outer">
    <Navigation/>
    <div class="root">
        <router-view></router-view>
    </div>
  </div>
</template>



<style lang="scss">

body {
  background-color: #fafafa;
}

.root {
  margin: 0 auto;
  width: 640px;
  margin-top: 80px;
  position: relative;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
</style>
<script>

import * as store from './utils/store'
import router from './router'
import Navigation from './components/Navigation.vue'

export default {
  name: 'app',
  components: {
    Navigation
  },
  data () {
    return {
    }
  },
}

</script>
