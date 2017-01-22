<template>
<div class="button-box">

  <button :class="{btn: true, disabled: btnStatus == 'loading'}" @click="onBtnClick">
    <slot/>
  </button>
  <img class="progress" src="/static/img/loading_circle_progress.gif" v-if="btnStatus == 'loading'" />
</div>
</template>



<script>
export default {
  name: 'Button',
  props: ['status'],
  data() {
    return {
    }
  },
  computed: {
    btnStatus() {
      if (!this.status) {
        return 'default'
      } else {
        return this.status
      }
    }
  },
  methods: {
    onBtnClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>



<style lang="scss">
@import '../assets/css/common';

.button-box {
  width: 100%;
  box-sizing: border-box;
  min-height: 32px;
  position: relative;

  .btn {
  box-sizing: border-box;
    width: 100%;
    min-height: 32px;

    font-size: 16px;
    background: #3897f0;
    color: #fff;
    border-radius: 3px;
    border: 1px solid #3897f0;
    outline: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-sapce: nowrap;
    cursor: pointer;
  }

  .progress {
    position: absolute;
    top: calc(50% - 6px);
    right: calc(50% - 6px);
    color: #3897f0;
    cursor: pointer;
    width: 12px;
    height: 12px;
    cursor: default;
  }

  .disabled {
    opacity: .4;
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
