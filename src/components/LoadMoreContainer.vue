<template>
<div>
  <slot/>
  <img class="loading-more-progress" src="/static/img/loading_circle_progress.gif" v-if="isShowLoading" />
</div>
</template>

<style>
  .loading-more-progress {
    margin: 12px auto;
  }

</style>

<script>
export default {
  name: 'LoadMoreContainer',
  props: ['disable'],
  created() {
    window.addEventListener('scroll', this.onScroll)
  },
  data() {
    return {
      isShowLoading: false,
      lastLoadingTime: 0,
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll() {
      if (!this.disable && !this.isShowLoading && getDocumentTop() + getWindowHeight() == getScrollHeight()) {

        const currentTime = new Date().getTime()
        if (currentTime - this.lastLoadingTime < 1000) {
          return
        }
        this.lastLoadingTime = currentTime
        this.isShowLoading = true
        this.$emit('onLoadMore')
      }
    },
    stopLoading() {
      this.isShowLoading = false
    },
    startLoading() {
      this.isShowLoading = true
    }
  }
}

//文档高度
function getDocumentTop() {
  var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}

//可视窗口高度
function getWindowHeight() {
  var windowHeight = 0;
  if (document.compatMode == "CSS1Compat") {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
}

//滚动条滚动高度
function getScrollHeight() {
  var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
  return scrollHeight;
}
</script>
