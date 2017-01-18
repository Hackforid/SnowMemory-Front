<template>
  <div class="typeahead">

    <input type="text"
           class="card-text-input"
           placeholder="choose a user"
           autocomplete="off"
           @input="update($event.target.value)"
           list="cars"
           />
    <datalist id="cars">
        <option v-for="item of items" :value="item">
    </datalist>

  </div>
</template>



<script>
export default {
  name: 'typeahead',
  props: ['items'],
  data() {
    return {
    }
  },
  methods: {
    update(val) {
      this.$emit('valueUpdate', val)
    }
  }
}
</script>



<style lang="scss">
@import '../assets/css/common';
input {
  box-sizing: border-box;
}
</style>
