<template>
<div class="navigation">
  <div class="line"/>
  <div class="nav-container">
    <span>发照片</span>
  </div>
</div>
</template>



<script>
export default {
  name: 'navigation',
  data() {
    return {
    }
  },
  methods: {
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
}
</style>
