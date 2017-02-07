<template>
  <div class="search-view">

    <input type="text"
           class="card-text-input"
           :placeholder="placeholder"
           autocomplete="off"
           @input="update($event.target.value)"
           @focus="onInputFocus(true)"
           @blur="onInputFocus(false)"
           v-model="searchText"
           />

    <div class="selects" v-if="(isInputFocused || isHoverSelected) && options.length > 0" v-on:mouseleave="leaveSelected">
      <div class="top-arrow"/>
      <div class="user-items">
        <div class="user-item" v-for="user in options"
          v-on:mouseenter="hoverSelect(user)"
          :class="{'item-hover': user.id == hoveredItemId}"
          @click="selectUser(user.username)"
          >
          <img class="user-avatar" :src="user.avatar ? user.avatar + '-avatar' : '/static/img/logo.png'"/>
          <div class="user-info">
            <span class="user-name">{{user.username}}</span>
            <span class="user-email">{{user.email}}</span>
          </div>
        </div>
      </div>
    <div>
  </div>
</template>



<script>
import router from '../router'
export default {
  name: 'searchView',
  props: ['users', 'placeholder', 'content'],
  data() {
    return {
      searchText: "",
      isInputFocused: false,
      hoveredItemId: null,
      isHoverSelected: false,
      options: this.users,
    }
  },
  watch: {
    users() {
      this.options = this.users
    },
    content() {
      this.searchText = this.content
    },
  },
  methods: {
    selectUser(username) {
      this.isHoverSelected = false
      this.isInputFocused = false
      this.searchText = null
      this.options = this.users

      this.$emit('selectUser', username)
    },
    update(val) {
      if (!val) {
        this.options = this.users
        return
      }
      val = val.toLowerCase()
      const options = []
      this.users.forEach(user=>{
        if (user.username.toLowerCase().includes(val) || user.email.toLowerCase().includes(val)) {
          options.push(user)
        }
      })
      this.options = options
    },
    onInputFocus(isFocused) {
      this.isInputFocused = isFocused
    },
    hoverSelect(user) {
      this.hoveredItemId = user.id
      this.isHoverSelected = true },
    leaveSelected() {
      this.isHoverSelected = false
    }
  }
}
</script>



<style lang="scss">
@import '../assets/css/common';

.search-view {
  overflow: visible;
  height: 28px;
  position: relative;


  input {
    box-sizing: border-box;
    text-align: center;
    height: 100%;
  }

  .selects {
    align-items: stretch;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 240px;

    background: #fff;
    border: solid 1px #e6e6e6;
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(0,0,0,.0975);

    margin-top: 15px;

    position: relative;

    .top-arrow {
      background: #fff;
      border: solid 1px #e6e6e6;
      box-shadow: 0 0 5px 1px rgba(0,0,0,.0975);
      height: 14px;
      left: 0;
      margin: auto;
      right: 0;
      top: -7px;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      width: 14px;
      content: ' ';
      position: absolute;
      z-index: 1;
    }


    .user-items {
      z-index: 2;
      background-color: #fff;
    }
  }


  .user-item {
    height: 70px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 12px;
    border-bottom: solid 1px #dbdbdb;
    cursor: pointer;


    .user-avatar {
      height: 32px;
      width: 32px;
      border: solid 1px #dbdbdb;
      border-radius: 30px;
      margin: 7px 10px 0 0;
    }

    .user-info {
      width: 100%;
      overflow:hidden;
      .user-name {
        font-weight: 600;
        color: #262626;
        font-size: 14px;
      }

      .user-email {
        color: #999;
        font-size: 14px;
      }
    }
  }

  .item-hover {
    background-color: #efefef;
  }
}
</style>
