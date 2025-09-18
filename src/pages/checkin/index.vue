<template>
  <view class="checkin-page">
    <view class="form-title">活动签到</view>
    
    <view class="activity-info">
      <view class="activity-title">{{ activity.title }}</view>
      <view class="activity-time">{{ activity.time }}</view>
      <view class="activity-location">{{ activity.location }}</view>
    </view>
    
    <view class="checkin-tabs">
      <view 
        class="tab" 
        :class="{ active: activeTab === 'qrcode' }" 
        @tap="activeTab = 'qrcode'"
      >
        二维码签到
      </view>
      <view 
        class="tab" 
        :class="{ active: activeTab === 'location' }" 
        @tap="activeTab = 'location'"
      >
        定位签到
      </view>
    </view>
    
    <view class="checkin-content">
      <!-- 二维码签到 -->
      <view v-if="activeTab === 'qrcode'" class="qrcode-container">
        <view v-if="isCreator" class="qrcode-display">
          <view class="qrcode-image">
            <!-- 这里应该是动态生成的二维码 -->
            <view class="qrcode-placeholder">活动签到二维码</view>
            <!-- 实际项目中应使用二维码生成组件 -->
            <view v-if="qrcodeContent" class="qrcode-content">{{ qrcodeContent }}</view>
          </view>
          <view class="qrcode-tip">请参与者扫描此二维码进行签到</view>
          <view class="refresh-btn" @tap="refreshQRCode">刷新二维码</view>
        </view>
        
        <view v-else class="qrcode-scanner">
          <view class="scan-btn" @tap="scanQRCode">扫描二维码</view>
          <view class="scan-tip">请扫描活动组织者提供的二维码</view>
        </view>
      </view>
      
      <!-- 定位签到 -->
      <view v-if="activeTab === 'location'" class="location-container">
        <view class="map-container">
          <!-- 这里应该是地图组件 -->
          <view class="map-placeholder">地图加载中...</view>
        </view>
        
        <view class="location-info">
          <view class="info-item">
            <view class="info-label">活动地点</view>
            <view class="info-value">{{ activity.location }}</view>
          </view>
          <view class="info-item">
            <view class="info-label">当前位置</view>
            <view class="info-value">{{ currentLocation || '获取中...' }}</view>
          </view>
          <view class="info-item">
            <view class="info-label">距离</view>
            <view class="info-value">{{ distance || '计算中...' }}</view>
          </view>
        </view>
        
        <view class="location-actions">
          <view class="refresh-location-btn" @tap="getLocation">刷新位置</view>
          <view 
            class="checkin-btn" 
            :class="{ disabled: !canCheckin }" 
            @tap="locationCheckin"
          >
            {{ canCheckin ? '签到' : '距离过远，无法签到' }}
          </view>
        </view>
      </view>
    </view>
    
    <!-- 签到成功提示 -->
    <view class="success-modal" v-if="showSuccessModal">
      <view class="success-content">
        <view class="success-icon">✓</view>
        <view class="success-title">签到成功</view>
        <view class="success-message">您已成功签到{{ activity.title }}</view>
        <view class="close-btn" @tap="closeSuccessModal">确定</view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'ActivityCheckin',
  setup() {
    // 活动数据
    const activity = reactive({
      id: '1',
      title: '周末爬山活动',
      time: '2023-09-20 08:00',
      location: '莫干山',
      latitude: 30.2457, // 莫干山的大致经纬度
      longitude: 119.8156
    })
    
    const activeTab = ref('qrcode')
    const isCreator = ref(false) // 是否是活动创建者
    const currentLocation = ref('')
    const distance = ref('')
    const canCheckin = ref(false)
    const showSuccessModal = ref(false)
    
    // 生成签到码内容
    const generateQRCodeContent = () => {
      // 实际项目中应生成包含活动ID、时间戳和签名的内容
      const timestamp = new Date().getTime()
      const qrContent = JSON.stringify({
        activityId: activity.id,
        timestamp,
        signature: `${activity.id}_${timestamp}_signature`
      })
      return qrContent
    }
    
    // 二维码内容
    const qrcodeContent = ref('')
    
    // 刷新二维码
    const refreshQRCode = () => {
      console.log('刷新二维码')
      // 生成新的二维码内容
      qrcodeContent.value = generateQRCodeContent()
      wx.showToast({
        title: '二维码已刷新',
        icon: 'success'
      })
    }
    
    // 初始化二维码
    if (isCreator.value) {
      refreshQRCode()
    }
    
    // 扫描二维码
    const scanQRCode = () => {
      console.log('扫描二维码')
      // 实际项目中应使用微信小程序的扫码API
      wx.scanCode({
        success: (res) => {
          try {
            // 解析二维码内容
            const scanData = JSON.parse(res.result)
            
            // 验证二维码内容
            if (scanData.activityId === activity.id) {
              // 验证时间戳是否在有效期内（例如10分钟）
              const currentTime = new Date().getTime()
              const qrCodeTime = scanData.timestamp
              
              if (currentTime - qrCodeTime < 10 * 60 * 1000) {
                // 签到成功
                showSuccessModal.value = true
              } else {
                wx.showToast({
                  title: '二维码已过期',
                  icon: 'none'
                })
              }
            } else {
              wx.showToast({
                title: '无效的二维码',
                icon: 'none'
              })
            }
          } catch (e) {
            wx.showToast({
              title: '无效的二维码格式',
              icon: 'none'
            })
          }
        },
        fail: () => {
          wx.showToast({
            title: '扫码失败',
            icon: 'none'
          })
        }
      })
    }
    
    // 获取位置
    const getLocation = () => {
      console.log('获取位置')
      // 实际项目中应使用微信小程序的定位API
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          const latitude = res.latitude
          const longitude = res.longitude
          
          // 计算与活动地点的距离（简化版）
          const distanceValue = calculateDistance(
            latitude, 
            longitude, 
            activity.latitude, 
            activity.longitude
          )
          
          // 获取地址信息
          wx.reverseGeocoder({
            location: {
              latitude,
              longitude
            },
            success: (res) => {
              currentLocation.value = res.address || '未知地点'
              distance.value = `${distanceValue.toFixed(0)}米`
              // 如果距离小于200米，允许签到
              canCheckin.value = distanceValue < 200
            },
            fail: () => {
              currentLocation.value = '获取地址失败'
              distance.value = `${distanceValue.toFixed(0)}米`
              canCheckin.value = distanceValue < 200
            }
          })
        },
        fail: () => {
          wx.showToast({
            title: '获取位置失败',
            icon: 'none'
          })
        }
      })
    }
    
    // 计算两点之间的距离（简化版，单位：米）
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371000 // 地球半径，单位米
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLon = (lon2 - lon1) * Math.PI / 180
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return R * c
    }
    
    // 定位签到
    const locationCheckin = () => {
      if (!canCheckin.value) {
        wx.showToast({
          title: '距离过远，无法签到',
          icon: 'none'
        })
        return
      }
      
      console.log('定位签到')
      showSuccessModal.value = true
    }
    
    // 关闭成功提示
    const closeSuccessModal = () => {
      showSuccessModal.value = false
      wx.navigateBack()
    }
    
    // 初始化获取位置
    getLocation()
    
    return {
      activity,
      activeTab,
      isCreator,
      currentLocation,
      distance,
      canCheckin,
      showSuccessModal,
      refreshQRCode,
      scanQRCode,
      getLocation,
      locationCheckin,
      closeSuccessModal
    }
  }
}
</script>

<style lang="less">
.checkin-page {
  padding: 20px;
  background-color: #FFF5F7; /* 柔和的粉色背景 */
  
  .form-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    color: #FF6B95; /* 粉色 */
  }
  
  .activity-info {
    background-color: #fff;
    border-radius: 20px; /* 更圆润的胶囊形状 */
    padding: 18px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 2px solid #E2E0FF; /* 淡紫色边框 */
    
    .activity-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #FF6B95; /* 粉色 */
      text-align: center;
    }
    
    .activity-time, .activity-location {
      font-size: 14px;
      color: #7986CB; /* 淡紫色 */
      margin-bottom: 8px;
      background-color: #F8F8FF; /* 淡紫色背景 */
      padding: 8px 12px;
      border-radius: 20px; /* 胶囊形状 */
      display: inline-block;
      width: 100%;
    }
  }
  
  .checkin-tabs {
    display: flex;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 30px; /* 胶囊形状 */
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 2px solid #E2E0FF; /* 淡紫色边框 */
    
    .tab {
      flex: 1;
      text-align: center;
      padding: 15px 0;
      font-size: 16px;
      color: #7986CB; /* 淡紫色 */
      transition: all 0.3s ease;
      
      &.active {
        background: linear-gradient(to right, #FF8FAB, #FF6B95); /* 粉色渐变 */
        color: #fff;
        font-weight: bold;
      }
    }
  }
  
  .checkin-content {
    background-color: #fff;
    border-radius: 20px; /* 更圆润的胶囊形状 */
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    min-height: 300px;
    border: 2px solid #E2E0FF; /* 淡紫色边框 */
  }
  
  .qrcode-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .qrcode-display {
      text-align: center;
      
      .qrcode-image {
        width: 200px;
        height: 200px;
        margin: 0 auto 20px;
        background-color: #F8F8FF; /* 淡紫色背景 */
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px; /* 更圆润 */
        border: 2px dashed #E2E0FF; /* 虚线紫色边框 */
        
        .qrcode-placeholder {
          font-size: 14px;
          color: #7986CB; /* 淡紫色 */
        }
      }
      
      .qrcode-tip {
        font-size: 14px;
        color: #7986CB; /* 淡紫色 */
        margin-bottom: 20px;
      }
      
      .refresh-btn {
        display: inline-block;
        padding: 10px 25px;
        background: linear-gradient(to right, #81D4FA, #29B6F6); /* 蓝色渐变 */
        color: #fff;
        border-radius: 30px; /* 胶囊形状 */
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(41, 182, 246, 0.3);
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.95);
        }
      }
    }
    
    .qrcode-scanner {
      text-align: center;
      
      .scan-btn {
        display: inline-block;
        padding: 12px 30px;
        background: linear-gradient(to right, #FF8FAB, #FF6B95); /* 粉色渐变 */
        color: #fff;
        border-radius: 30px; /* 胶囊形状 */
        font-size: 16px;
        margin-bottom: 20px;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(255, 107, 149, 0.3);
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.95);
        }
      }
      
      .scan-tip {
        font-size: 14px;
        color: #7986CB; /* 淡紫色 */
      }
    }
  }
  
  .location-container {
    .map-container {
      height: 200px;
      background-color: #F8F8FF; /* 淡紫色背景 */
      margin-bottom: 20px;
      border-radius: 20px; /* 更圆润 */
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed #E2E0FF; /* 虚线紫色边框 */
      
      .map-placeholder {
        font-size: 14px;
        color: #7986CB; /* 淡紫色 */
      }
    }
    
    .location-info {
      margin-bottom: 20px;
      
      .info-item {
        display: flex;
        margin-bottom: 12px;
        background-color: #F8F8FF; /* 淡紫色背景 */
        padding: 10px 15px;
        border-radius: 20px; /* 胶囊形状 */
        
        .info-label {
          width: 80px;
          font-size: 14px;
          color: #7986CB; /* 淡紫色 */
          font-weight: 500;
        }
        
        .info-value {
          flex: 1;
          font-size: 14px;
          color: #5D5A6C; /* 更新文字颜色 */
        }
      }
    }
    
    .location-actions {
      display: flex;
      justify-content: space-between;
      
      .refresh-location-btn, .checkin-btn {
        padding: 12px 0;
        text-align: center;
        border-radius: 30px; /* 胶囊形状 */
        font-size: 14px;
        font-weight: bold;
        transition: all 0.3s ease;
      }
      
      .refresh-location-btn {
        width: 30%;
        background-color: #F8F8FF; /* 淡紫色背景 */
        color: #7986CB; /* 淡紫色 */
        border: 2px solid #E2E0FF; /* 淡紫色边框 */
        
        &:active {
          transform: scale(0.95);
        }
      }
      
      .checkin-btn {
        width: 65%;
        background: linear-gradient(to right, #FF8FAB, #FF6B95); /* 粉色渐变 */
        color: #fff;
        box-shadow: 0 4px 10px rgba(255, 107, 149, 0.3);
        
        &:active {
          transform: scale(0.95);
        }
        
        &.disabled {
          background: linear-gradient(to right, #E0E0E0, #BDBDBD); /* 灰色渐变 */
          color: #fff;
          box-shadow: none;
        }
      }
    }
  }
  
  .success-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    
    .success-content {
      width: 80%;
      background-color: #fff;
      border-radius: 30px; /* 胶囊形状 */
      padding: 30px 20px;
      text-align: center;
      border: 3px solid #E2E0FF; /* 淡紫色边框 */
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      
      .success-icon {
        width: 70px;
        height: 70px;
        line-height: 70px;
        background: linear-gradient(to right, #81D4FA, #29B6F6); /* 蓝色渐变 */
        color: #fff;
        font-size: 35px;
        border-radius: 50%;
        margin: 0 auto 20px;
        box-shadow: 0 5px 15px rgba(41, 182, 246, 0.3);
      }
      
      .success-title {
        font-size: 22px;
        font-weight: bold;
        color: #FF6B95; /* 粉色 */
        margin-bottom: 15px;
      }
      
      .success-message {
        font-size: 16px;
        color: #7986CB; /* 淡紫色 */
        margin-bottom: 25px;
      }
      
      .close-btn {
        display: inline-block;
        padding: 12px 35px;
        background: linear-gradient(to right, #FF8FAB, #FF6B95); /* 粉色渐变 */
        color: #fff;
        border-radius: 30px; /* 胶囊形状 */
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(255, 107, 149, 0.3);
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
}
</style>