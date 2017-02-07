<template>
  <div class="typeahead">

    <input type="text"
           class="card-text-input"
           :placeholder="placeholder"
           autocomplete="off"
           @input="update($event.target.value)"
           list="options"
           @keyup.enter="keyEnter"
           v-model="text"
           />
    <datalist id="options">
        <option v-for="item of items" :value="item">
    </datalist>

  </div>
</template>



<script>
export default {
  name: 'typeahead',
  props: ['items', 'placeholder'],
  data() {
    return {
      text: "",
    }
  },
  methods: {
    update(val) {
      this.$emit('valueUpdate', val)
    },
    keyEnter() {
      this.$emit('enter', this.text)
    },
  }
}
</script>



<style lang="scss">
@import '../assets/css/common';
input {
  box-sizing: border-box;
}
</style>
