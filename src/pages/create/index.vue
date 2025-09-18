<template>
  <view class="create-page">
    <!-- 页面标题和描述 -->
    <view class="page-header">
      <view class="header-title">创建你的项目</view>
      <view class="header-desc">您可以在您的项目里面与合作伙伴更方便的交流，创建您自己的项目并开始交流吧</view>
    </view>

    <!-- 创建我的 -->
    <view class="option-card" @tap="createMine">
      <view class="option-icon person">
        <text class="icon-person">👤</text>
      </view>
      <view class="option-content">
        <text class="option-title">创建我的</text>
      </view>
      <view class="arrow">›</view>
    </view>

    <!-- 使用模板 -->
    <view class="template-section">
      <view class="section-title">使用模板</view>

      <!-- 篮球 -->
      <view class="option-card" @tap="useTemplate('game')">
        <view class="option-icon game">
          <text class="template-icon">🏀</text>
        </view>
        <view class="option-content">
          <text class="option-title">篮球</text>
        </view>
        <view class="arrow">›</view>
      </view>

      <!-- 吃饭 -->
      <view class="option-card" @tap="useTemplate('study')">
        <view class="option-icon study">
          <text class="template-icon">🍽️</text>
        </view>
        <view class="option-content">
          <text class="option-title">吃饭</text>
        </view>
        <view class="arrow">›</view>
      </view>

      <!-- 朋友 -->
      <view class="option-card" @tap="useTemplate('friend')">
        <view class="option-icon friend">
          <text class="template-icon">👥</text>
        </view>
        <view class="option-content">
          <text class="option-title">朋友</text>
        </view>
        <view class="arrow">›</view>
      </view>
    </view>

    <!-- 已经有邀约 -->
    <view class="invitation-hint">已经有邀请？</view>

    <!-- 加入项目按钮 -->
    <view class="join-btn" @tap="joinProject">
      <text class="btn-icon">+</text>
      <text class="btn-text">加入项目</text>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'

export default {
  data() {
    return {
      templates: {
        game: {
          title: '篮球',
          description: '一起打篮球，结交新朋友'
        },
        study: {
          title: '吃饭',
          description: '一起聚餐，共享美食时光'
        },
        friend: {
          title: '朋友',
          description: '与朋友一起度过美好时光'
        }
      }
    }
  },
  methods: {
    createMine() {
      Taro.navigateTo({
        url: '/pages/create-detail/index'
      })
    },
    useTemplate(type) {
      const template = this.templates[type]
      Taro.navigateTo({
        url: `/pages/create-detail/index?type=${type}&title=${template.title}&description=${template.description}`
      })
    },
    joinProject() {
      Taro.navigateTo({
        url: '/pages/join/index'
      })
    }
  }
}
</script>

<style lang="less">
.create-page {
  padding: 0;
  background-color: #FFF5F7; /* 柔和的粉色背景 */
  min-height: 100vh;

  .page-header {
    padding: 0 20px;
    margin-bottom: 40px;

    .header-title {
      font-size: 32px; /* 稍微调小 */
      font-weight: bold;
      margin-bottom: 15px;
      color: #FF6B95; /* 粉色 */
    }

    .header-desc {
      font-size: 18px;
      color: #9E9E9E; /* 更新文字颜色 */
      line-height: 1.5;
      background-color: #FFF8E1; /* 淡黄色背景 */
      border-radius: 20px;
      padding: 12px 15px;
      border: 1px dashed #FFCC80; /* 虚线橙色边框 */
    }
  }

  .option-card {
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    border-radius: 25px; /* 更圆润 */
    padding: 18px 20px;
    margin: 0 20px 16px 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 2px solid #E2E0FF; /* 淡紫色边框 */
    transition: all 0.3s ease;

    &:active {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
    }

    .option-icon {
      width: 50px;
      height: 50px;
      border-radius: 25px; /* 圆形 */
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 16px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

      &.person {
        background: linear-gradient(135deg, #FFD6E0, #FF9EC4); /* 粉色渐变 */
      }

      &.game {
        background: linear-gradient(135deg, #C5CAE9, #7986CB); /* 紫色渐变 */
      }

      &.study {
        background: linear-gradient(135deg, #FFECB3, #FFD54F); /* 黄色渐变 */
      }

      &.friend {
        background: linear-gradient(135deg, #D1C4E9, #9575CD); /* 紫色渐变 */
      }

      .icon-person {
        font-size: 30px;
      }

      .template-icon {
        font-size: 30px;
      }
    }

    .option-content {
      flex: 1;
    }

    .option-title {
      font-size: 18px;
      font-weight: 500;
      color: #5D5A6C; /* 更新文字颜色 */
    }

    .arrow {
      font-size: 24px;
      color: #FF9EC4; /* 粉色 */
      font-weight: bold;
    }
  }

  .template-section {
    margin-top: 30px;
    padding: 0 20px;

    .section-title {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #FF6B95; /* 粉色 */
      text-align: center;
      background-color: #FFFFFF;
      border-radius: 30px; /* 胶囊形状 */
      padding: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      border: 2px dashed #FFD6E0; /* 虚线粉色边框 */
    }
  }

  .invitation-hint {
    text-align: center;
    color: #7986CB; /* 淡紫色 */
    font-size: 18px;
    margin: 30px 0 20px;
    background-color: #F8F8FF; /* 淡紫色背景 */
    border-radius: 20px;
    padding: 12px 15px;
    border: 1px dashed #C5CAE9; /* 虚线紫色边框 */
  }

  .join-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to right, #FF9EC4, #FF6B95); /* 粉色渐变 */
    color: white;
    margin: 0 20px;
    height: 10vh; /* 设置高度为屏幕高度的10% */
    border-radius: 40px; /* 更圆润的胶囊形状 */
    font-weight: bold;
    box-shadow: 0 5px 15px rgba(255, 107, 149, 0.3); /* 粉色阴影 */
    letter-spacing: 2px; /* 字间距 */
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(255, 107, 149, 0.3);
    }

    .btn-icon {
      font-size: 24px;
      margin-right: 10px;
    }

    .btn-text {
      font-size: 20px;
    }
  }
}
</style>
