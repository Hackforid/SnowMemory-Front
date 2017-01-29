<template>
  <el-dialog :title="title" v-model="dialogVisible" :show-close="showClose" size="tiny" :close-on-click-modal="showClose" :close-on-press-escape="showClose">
    <span>{{content}}</span>
    <div class="dialog-buttons" slot="footer">
      <span v-show="showCancel" class="dialog-button cancel" @click="onClickCancel">取消</span>
      <span class="dialog-button confirm" @click="onClickConfirm">确认</span>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.dialog-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  .dialog-button {
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;
  }

  .cancel {
    margin-right: 12px;
    color: gray;
  }

  .confirm {
    color: black;
  }
}

</style>

<script>
import ExButton from '../components/ExButton.vue'

export default {
  name: 'confirm',
  components: {
    ExButton
  },
  data: function() {
    return {
      resolve: null,
      reject: null,
      dialogVisible: true,
      showClose: false
    }
  },
  methods: {
  }
}


</script>
