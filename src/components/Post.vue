<template>
<div class="card post">
  <div class="post_header">
    <img class="avatar" :src="post.target && post.target.avatar ? (post.target.avatar + '-tiny') : '/static/img/logo.png'" @click="gotoUserInfo(post.target.username)" /><span @click="gotoUserInfo(post.target.username)" class="target">{{post.target && post.target.username}}</span>
    <span class="created-time">{{post.createdTime}}</span>
  </div>
  <img class="photo" :src="post.photos[0] + '-normal'" @click="gotoPostInfo()"/>
  <div class="author-line">
    <span class="author" @click="gotoUserInfo(post.author.username)">@{{post.author && post.author.username}}</span>
    <span class="author-comment">{{post.content}}</span>
  </div>
  <span class="btn-more-comment" v-if="!post.showAllComments" @click="showAllComments()">全部 {{post.comments.length}} 条评论</span>
  <div class="comment-item" v-for="comment of (!post.showAllComments ? post.comments.slice(post.comments.length - 5) : post.comments)" >
    <span class="comment-item-author" @click="gotoUserInfo(comment.author.username)"><b>{{comment.author.username}}</b></span>
    <span class="comment-item-content">{{comment.content}}</span>
    <span class="comment-item-delete" @click="onDeleteComment(comment)" v-if="comment.author.username == username">x</span>
  </div>
  <div class="new-comment">
    <input type="text" class="new-comment-input" placeholder="添加评论" v-model.trim="post.newComment" @keyup.enter="newComment"></input>
    <img class="new-comment-loading-progress" src="/static/img/loading_circle_progress.gif" v-if="post.isSendingComment" />
    <el-dropdown trigger="click" v-if="post.author.username == username" @command="handlePostCommand">
      <img class="new-comment-more" src="/static/img/post-more.png"/>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="delete" >删除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</div>
</template>


<style lang="scss">
@import '../assets/css/common';
.post {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 70px;
  box-sizing: border-box;

  .post_header {
    height: 36px;
    padding: 14px 24px;
    display: flex;
    align-items: center;

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
    }

    .target {
      font-size: 16px;
      margin-left: 18px;
      flex-grow: 1;
      cursor: pointer;
    }

    .created-time {
      font-size: 15px;
      color: #999;
    }
  }
  .photo {
    display: block;
    width: 100%;
    border-bottom: 1px solid #efefef;
    border-top: 1px solid #efefef;
    box-shadow: inset 0 0 20px 0 #efefef;
    background-color: #edeeee;
    cursor: pointer;
  }

  .author-line {
    margin: 12px;
    color: #262626;
    font-size: 16px;
    padding: 0;
    margin: 20px 24px 14px 23px;

    .author {
      font-weight: bold;
      cursor: pointer;
    }

    .author-comment {

    }
  }

  .btn-more-comment {
    margin-left: 24px;
    margin-bottom: 3px;
    font-size: 15px;
    line-height: 18px;
    cursor: pointer;
    color: #999;
  }

  .new-comment {
    box-sizing: border-box;
    padding-top: 24px;
    padding-bottom: 24px;
    margin-left: 24px;
    margin-right: 24px;
    margin-top: 12px;
    border-top: solid 1px #efefef;
    position: relative;

    display: flex;
    flex-direction: row;
    align-items: center;


    .new-comment-input {
      width: 100%;
      background: 0 0;
      border: none;
      outline: none;
      color: #262626;
      font-size: 14px;
      line-height: 17px;
      flex-grow: 1;
    }

    .new-comment-loading-progress {
      height: 10px;
      width: 10px;
      margin-right: 10px;
    }

    .new-comment-more {
      height: 24px;
      width: 24px;
      cursor: pointer;
    }
  }

  .comment-item {
    box-sizing: border-box;
    margin-left: 24px;
    margin-right: 24px;
    margin-bottom: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .comment-item-author {
      color: #262626;
      font-size: 15px;
      line-height: 18px;
      font-weight: 600;
      cursor: pointer;
    }

    .comment-item-content {
      color: #262626;
      padding-top: 1px;
      font-size: 14px;
      line-height: 18px;
      margin-left: 10px;
      flex-grow: 1;
    }

    .comment-item-delete {
      color: #c7c7c7;
      cursor: pointer;
      font-size: 15px;
    }
  }
}


</style>

<script>
import Vue from 'vue'
import router from '../router'
import {simpleRequest} from '../utils/network'
import { Message } from 'element-ui'

export default {
  name: 'post',
  props: ['post'],
  components: {
  },
  created() {
    this.$set(this.post, 'createdTime', computeCreatedTime(this.post.created_at))
    if (this.post.comments && this.post.comments.length > 5) {
      this.$set(this.post, 'showAllComments', false)
    } else {
      this.$set(this.post, 'showAllComments', true)
    }
    this.$set(this.post, 'isSendingComment', false)
  },
  computed: {
    username() {
      return localStorage.username
    }
  },
  methods: {
    gotoUserInfo(username) {
      router.push({
        name: 'userinfo',
        params: {username: username}
      })
    },
    gotoPostInfo() {
      router.push({
        name: 'postinfo',
        params: {postId: this.post.id}
      })
    },
    showAllComments() {
      this.post.showAllComments = true
    },
    async onDeleteComment(comment) {
      await this.$confirm({
        content: '确认删除该评论？'
      })
      try {
        await deleteComment(comment.post_id, comment.id)
      } catch(e) {
        console.error(e)
        return
      }
      this.post.comments = this.post.comments.filter(i=>i.id != comment.id)
    },
    async newComment() {
      if (!this.post.newComment) {
        return
      }
      this.post.isSendingComment = true
      try {
        const resp = await postComment(this.post, this.post.newComment)
        this.post.comments.push(resp.comment)
        this.post.newComment = ''
      } catch(e) {
        console.error(e)
      } finally {
        this.post.isSendingComment = false
      }
    },
    handlePostCommand(command) {
      switch(command) {
        case 'delete':
          this.deletePost()
          break;
      }
    },
    async deletePost() {
      await this.$confirm({
        content: '确认删除该照片?'
      })
      try {
        await deletePost(this.post.id)
        Message({
          message: '删除成功',
          type: 'success'
        })
        this.$emit('deleted', this.post.id)
      } catch(e) {
        console.log(e)
        Message({
          message: '删除失败',
          type: 'error'
        })
      }
    },
  }
}

function deleteComment(postId, commentId) {
  return simpleRequest({
    method: 'DELETE',
    url: `/api/post/${postId}/comment/${commentId}`
  })
}

function postComment(post, content) {
  return simpleRequest({
    method: 'POST',
    url: `/api/post/${post.id}/comment`,
    data: {
      content: content
    }
  })
}

function deletePost(postId) {
  return simpleRequest({
    method: 'DELETE',
    url: `/api/post/${postId}`
  })
}

function computeCreatedTime(createdAt) {
  const now = new Date()
  const date = new Date(createdAt)
  const interval = now - date
  const mintes = parseInt(interval / (1000 * 60))
  if (mintes < 60) {
    return `${mintes}分钟`
  }
  const hours = parseInt(mintes / 60)
  if (hours < 24) {
    return `${hours}小时`
  }

  const days = parseInt(hours / 24)
  if (days < 7) {
    return `${days}天`
  }

  try {
    return createdAt.substring(0, 10)
  } catch(e) {
    console.error(e)
  }
  return createdAt
}


</script>
