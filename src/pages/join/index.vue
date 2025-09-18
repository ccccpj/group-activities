<template>
  <view class="join-page">
    <view class="nav-bar">
      <view class="back-btn" @tap="goBack">返回</view>
      <view class="title">加入项目</view>
    </view>
    
    <view class="form-container">
      <view class="form-item">
        <view class="label">项目ID</view>
        <input type="text" v-model="projectId" placeholder="请输入项目ID" />
      </view>
      
      <view class="form-item">
        <view class="label">您的姓名</view>
        <input type="text" v-model="userName" placeholder="请输入您的姓名" />
      </view>
      
      <view class="form-item">
        <view class="label">联系方式</view>
        <input type="text" v-model="contact" placeholder="请输入您的联系方式" />
      </view>
    </view>
    
    <view class="submit-btn" @tap="joinProject">加入项目</view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'

export default {
  data() {
    return {
      projectId: '',
      userName: '',
      contact: ''
    }
  },
  methods: {
    goBack() {
      Taro.navigateBack()
    },
    joinProject() {
      // 表单验证
      if (!this.projectId) {
        Taro.showToast({
          title: '请输入项目ID',
          icon: 'none'
        })
        return
      }
      
      if (!this.userName) {
        Taro.showToast({
          title: '请输入您的姓名',
          icon: 'none'
        })
        return
      }
      
      if (!this.contact) {
        Taro.showToast({
          title: '请输入联系方式',
          icon: 'none'
        })
        return
      }
      
      // 提交表单
      Taro.showLoading({
        title: '加入中...'
      })
      
      // 模拟提交
      setTimeout(() => {
        Taro.hideLoading()
        Taro.showToast({
          title: '加入成功',
          icon: 'success'
        })
        
        // 返回首页
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      }, 1000)
    }
  }
}
</script>

<style lang="less">
.join-page {
  padding: 0 20px;
  background-color: #f8f8f8;
  min-height: 100vh;
  
  .nav-bar {
    display: flex;
    align-items: center;
    height: 60px;
    position: relative;
    margin-top: 10px;
    
    .back-btn {
      font-size: 20px;
      color: #333;
    }
    
    .title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 24px;
      font-weight: bold;
    }
  }
  
  .form-container {
    margin-top: 30px;
    
    .form-item {
      margin-bottom: 25px;
      
      .label {
        font-size: 20px;
        margin-bottom: 12px;
        font-weight: 500;
      }
      
      input {
        width: 100%;
        background-color: #fff;
        border-radius: 12px;
        padding: 16px;
        font-size: 18px;
        box-sizing: border-box;
      }
    }
  }
  
  .submit-btn {
    background-color: #8bc34a;
    color: white;
    text-align: center;
    height: 10vh; /* 设置高度为屏幕高度的10% */
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    font-size: 22px;
    font-weight: bold;
    margin-top: 40px;
  }
}
</style>