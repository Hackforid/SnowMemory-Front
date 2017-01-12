<template>
<div class="navigation">
  <div class="line"/>
</div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="scss">
.navigation {
  background-color: #ffffff;
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

</style>
