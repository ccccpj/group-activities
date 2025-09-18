<template>
  <view class="webview-container">
    <web-view :src="url"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: ''
    }
  },
  onLoad(options) {
    if (options.url) {
      this.url = decodeURIComponent(options.url)
    }
  }
}
</script>

<style lang="less">
.webview-page {
  height: 100vh;
  background-color: #FFF5F7; /* 柔和的粉色背景 */
  
  .webview {
    width: 100%;
    height: 100%;
    border-radius: 20px 20px 0 0; /* 顶部圆角 */
    overflow: hidden;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
  }
  
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 245, 247, 0.9); /* 半透明粉色背景 */
    backdrop-filter: blur(5px); /* 毛玻璃效果 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    .loading-icon {
      width: 50px;
      height: 50px;
      margin-bottom: 15px;
      animation: rotate 1s linear infinite;
      color: #FF6B95; /* 粉色 */
      background-color: #FFFFFF;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 4px 10px rgba(255, 107, 149, 0.3);
    }
    
    .loading-text {
      font-size: 16px;
      color: #7986CB; /* 淡紫色 */
      font-weight: 500;
      background-color: #FFFFFF;
      padding: 8px 20px;
      border-radius: 20px; /* 胶囊形状 */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      border: 2px solid #E2E0FF; /* 淡紫色边框 */
    }
    
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
  
  .error {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #FFF5F7; /* 柔和的粉色背景 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    
    .error-icon {
      font-size: 60px;
      color: #FF6B95; /* 粉色 */
      margin-bottom: 20px;
      background-color: #FFFFFF;
      border-radius: 50%;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(255, 107, 149, 0.3);
      border: 2px solid #FFD6E0; /* 粉色边框 */
    }
    
    .error-title {
      font-size: 20px;
      font-weight: bold;
      color: #FF6B95; /* 粉色 */
      margin-bottom: 15px;
    }
    
    .error-message {
      font-size: 16px;
      color: #7986CB; /* 淡紫色 */
      text-align: center;
      margin-bottom: 25px;
      background-color: #FFFFFF;
      padding: 15px 20px;
      border-radius: 20px; /* 胶囊形状 */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      border: 2px solid #E2E0FF; /* 淡紫色边框 */
      max-width: 80%;
    }
    
    .retry-btn {
      padding: 12px 30px;
      background: linear-gradient(to right, #FF8FAB, #FF6B95); /* 粉色渐变 */
      color: white;
      font-size: 16px;
      font-weight: bold;
      border-radius: 30px; /* 胶囊形状 */
      box-shadow: 0 4px 10px rgba(255, 107, 149, 0.3);
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.95);
        box-shadow: 0 2px 5px rgba(255, 107, 149, 0.2);
      }
    }
  }
}
</style>