import Confirm from './Confirm.vue'
import Vue from 'vue'

const install = function(Vue, options={}) {
  const confirmConstructor = Vue.extend(Confirm)
  let confirmInstance = null
  Vue.prototype.$confirm = function(config) {
    return new Promise((resolve, reject) => {
      confirmInstance = new confirmConstructor({
        el: document.createElement('div'),
        data: function() {
          return {
            title: config.title,
            content: config.content,
            showCancel: config.showCancel || true
          }
        },
        methods: {
          onClickConfirm() {
            resolve()
            this.close()
          },
          onClickCancel() {
            reject()
            this.close()
          },
          close() {
            this.dialogVisible = false
            confirmInstance.$el.remove()
          }
        }
      })
      document.body.appendChild(confirmInstance.$el)
    })
  }
}

export default {
  install
}
