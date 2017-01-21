<template>
  <button class="btn-login card-btn" type="submit" @click="onLogin">{{ uiType == 'login' ? 'Login' : 'Register'}}</button>
</template>



<script>
export default {
  name: 'Button',
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
</style>
