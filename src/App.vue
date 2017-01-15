<template>
  <div>
    <div class="navigation">
      <div class="line"/>
    </div>
    <div class="root">
      <router-view></router-view>
    </div>
  </div>
</template>



<style lang="scss">
.navigation {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;

    .line {
      background-color: #ddd;
      height: 1px;
      width: 100%;
      position: absolute;
      bottom: 0;
    }
}

.root {
  margin: 0 auto;
  width: 640px;
  margin-top: 80px;
  position: relative;
}
</style>

<script>

import * as store from './utils/store'
import router from './router'

export default {
  name: 'app',
  data () {
    return {
    }
  },
  created () {
    console.log("created")
    if (!store.getAccessToken()) {
      router.push('login')
    } else {
      router.push('timeline')
    }
  },
}

</script>
