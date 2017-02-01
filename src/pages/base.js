export const basePageMixin = {
  created() {
    this.historyKey = window.history.state.key
    const _data = this.$route.meta[this.historyKey]
    if (_data) {
      Object.keys(_data).forEach(key=>{
        this[key] = _data[key]
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this) {
      this.$route.meta[this.historyKey] = this.$data
    }
    next()
  },
}
