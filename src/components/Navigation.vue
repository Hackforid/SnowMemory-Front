<template>
<div class="navigation">
  <div class="line"/>
  <div class="nav-container">
    <div class="nav-left">
    </div>
    <div class="nav-center">
    </div>
    <div class="nav-right">
      <span class="post-photo" @click="onNewPostClick">发照片</span>
    </div>
  </div>
</div>
</template>



<script>
import bus from '../bus'
export default {
  name: 'navigation',
  data() {
    return {
    }
  },
  methods: {
    onNewPostClick() {
      bus.$emit('onNewPostClick')
    }
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
    max-width: 900px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .nav-left {
      flex: 1 0 0%;
    }

    .nav-right {
    }
  }
}
</style>
