<template>
  <view class="example-page">
    <view class="header">
      <text class="title">图标应用示例</text>
      <view class="back-btn" @tap="navigateBack">
        <Icon name="github" size={20} />
        <text>返回</text>
      </view>
    </view>
    
    <view class="section">
      <text class="section-title">活动类型选择</text>
      <view class="activity-types">
        <view 
          v-for="(type, index) in activityTypes" 
          :key="index"
          class="activity-type"
          :class="{ active: selectedType === type.value }"
          @tap="selectType(type.value)"
        >
          <Icon :name="type.icon" :color="selectedType === type.value ? '#ffffff' : '#333333'" size={28} />
          <text>{{ type.label }}</text>
        </view>
      </view>
    </view>
    
    <view class="section">
      <text class="section-title">社交分享</text>
      <view class="share-options">
        <view 
          v-for="(option, index) in shareOptions" 
          :key="index"
          class="share-option"
          @tap="share(option.value)"
        >
          <Icon :name="option.icon" :color="option.color" size={32} />
          <text>{{ option.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { Icon } from '../../components/icons';
import Taro from '@tarojs/taro';

export default {
  name: 'IconExamplePage',
  components: {
    Icon
  },
  data() {
    return {
      selectedType: 'basketball',
      activityTypes: [
        { label: '篮球', value: 'basketball', icon: 'basketball' },
        { label: '聚餐', value: 'dinner', icon: 'dinner' },
        { label: '学习', value: 'study', icon: 'study' },
        { label: '游戏', value: 'game', icon: 'game' },
        { label: '旅行', value: 'travel', icon: 'travel' },
        { label: '音乐', value: 'music', icon: 'music' }
      ],
      shareOptions: [
        { label: 'GitHub', value: 'github', icon: 'github', color: '#333333' },
        { label: 'Discord', value: 'discord', icon: 'discord', color: '#5865F2' },
        { label: 'Slack', value: 'slack', icon: 'slack', color: '#4A154B' },
        { label: 'Google', value: 'google', icon: 'google', color: '#4285F4' },
        { label: 'Facebook', value: 'facebook', icon: 'facebook', color: '#1877F2' },
        { label: 'Twitter', value: 'twitter', icon: 'twitter', color: '#1DA1F2' }
      ]
    };
  },
  methods: {
    navigateBack() {
      Taro.navigateBack();
    },
    selectType(type) {
      this.selectedType = type;
      console.log('选择活动类型:', type);
    },
    share(platform) {
      console.log('分享到平台:', platform);
      Taro.showToast({
        title: `已分享到${platform}`,
        icon: 'success',
        duration: 2000
      });
    }
  }
};
</script>

<style lang="less">
.example-page {
  padding: 20px;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    
    .title {
      font-size: 22px;
      font-weight: bold;
    }
    
    .back-btn {
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      padding: 8px 12px;
      border-radius: 20px;
      
      text {
        margin-left: 5px;
        font-size: 14px;
      }
    }
  }
  
  .section {
    margin-bottom: 30px;
    
    .section-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      display: block;
    }
  }
  
  .activity-types {
    display: flex;
    flex-wrap: wrap;
    
    .activity-type {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      margin-right: 15px;
      margin-bottom: 15px;
      background-color: #f5f5f5;
      border-radius: 12px;
      transition: all 0.3s ease;
      
      text {
        margin-top: 8px;
        font-size: 14px;
      }
      
      &.active {
        background-color: #1aad19;
        
        text {
          color: #ffffff;
        }
      }
    }
  }
  
  .share-options {
    display: flex;
    flex-wrap: wrap;
    
    .share-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80px;
      margin-right: 15px;
      margin-bottom: 15px;
      
      text {
        margin-top: 8px;
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>