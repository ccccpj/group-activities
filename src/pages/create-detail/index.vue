<template>
  <view class="create-detail-page">
    <!-- 导航栏已移除 -->
    
    <scroll-view scroll-y class="scrollable-content">
      <view class="form-container">
        <view class="form-item">
          <view class="label">活动标题</view>
          <input type="text" v-model="formData.title" placeholder="请输入活动标题" />
        </view>
        
        <view class="form-item">
          <view class="label">活动描述</view>
          <textarea v-model="formData.description" placeholder="请简要描述活动内容和要求（两行）" class="description-textarea"></textarea>
        </view>
        
        <view class="form-item">
          <view class="label">活动时间</view>
          <view class="time-quick-select">
            <view 
              v-for="(day, index) in quickDays" 
              :key="'day-'+index" 
              :class="['quick-option', selectedDay === day.value ? 'selected' : '']" 
              @tap="selectDay(day.value)">
              {{ day.label }}
            </view>
          </view>
          <view class="time-quick-select">
            <view 
              v-for="(period, index) in quickPeriods" 
              :key="'period-'+index" 
              :class="['quick-option', selectedPeriod === period.value ? 'selected' : '']" 
              @tap="selectPeriod(period.value)">
              {{ period.label }}
            </view>
          </view>
          <view class="time-detail">
            <view class="time-row">
              <view class="time-label">具体日期</view>
              <picker mode="date" :value="formData.date" @change="onDateChange">
                <view class="picker-value time-value">{{ formData.date || '请选择日期' }}</view>
              </picker>
            </view>
            <view class="time-row">
              <view class="time-label">具体时间</view>
              <picker mode="time" :value="formData.time" @change="onTimeChange">
                <view class="picker-value time-value">{{ formData.time || '请选择时间' }}</view>
              </picker>
            </view>
            <view class="time-row">
              <view class="time-label">持续时间</view>
              <picker mode="selector" :range="durationOptions" :value="durationIndex" @change="onDurationChange">
                <view class="picker-value time-value">{{ durationOptions[durationIndex] }}</view>
              </picker>
            </view>
            <!-- 更多时间选项已移除 -->
          </view>
        </view>
        
        <view class="form-item">
          <view class="label">活动地点</view>
          <view class="location-picker" @tap="chooseLocation">
            <view class="picker-value">{{ formData.location.name || '请选择地点' }}</view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="label">活动链接</view>
          <input type="text" v-model="formData.link" placeholder="请输入第三方小程序或网页链接" />
          <view class="link-tips">支持微信小程序、公众号文章或网页链接</view>
        </view>
        
        <!-- 底部占位，确保内容可以滚动到底部按钮上方 -->
        <view class="bottom-placeholder"></view>
      </view>
    </scroll-view>
    
    <view class="submit-btn" @tap="submitForm">提交</view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'

export default {
  data() {
    return {
      formData: {
        title: '',
        description: '',
        date: '',
        time: '',
        duration: '2小时',
        link: '',
        location: {
          name: '',
          address: '',
          latitude: 0,
          longitude: 0
        }
      },
      quickDays: [
        { label: '周一', value: 'monday' },
        { label: '周二', value: 'tuesday' },
        { label: '周三', value: 'wednesday' },
        { label: '周四', value: 'thursday' },
        { label: '周五', value: 'friday' },
        { label: '周六', value: 'saturday' },
        { label: '周日', value: 'sunday' }
      ],
      quickPeriods: [
        { label: '上午', value: 'morning' },
        { label: '下午', value: 'afternoon' },
        { label: '晚上', value: 'evening' }
      ],
      selectedDay: '',
      selectedPeriod: '',
      durationOptions: ['1小时', '2小时', '3小时', '半天', '全天'],
      durationIndex: 1
    }
  },
  onLoad(options) {
    // 如果是从模板创建，填充模板数据
    if (options.type) {
      this.formData.title = options.title || ''
      this.formData.description = options.description || ''
    }
    
    // 初始化日期和时间
    if (!this.formData.date) {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      this.formData.date = `${year}-${month}-${day}`
    }
    
    if (!this.formData.time) {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      this.formData.time = `${hours}:${minutes}`
    }
    
    // 根据当前日期设置选中的快速选择按钮
    this.updateQuickSelectFromDate()
  },
  methods: {
    updateQuickSelectFromDate() {
      if (!this.formData.date) return
      
      // 解析日期
      const dateParts = this.formData.date.split('-')
      if (dateParts.length !== 3) return
      
      const year = parseInt(dateParts[0])
      const month = parseInt(dateParts[1]) - 1 // 月份从0开始
      const day = parseInt(dateParts[2])
      
      const dateObj = new Date(year, month, day)
      const dayOfWeek = dateObj.getDay() // 0是周日，1-6是周一到周六
      
      // 映射到我们的值
      const dayMap = {
        0: 'sunday',
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday'
      }
      
      this.selectedDay = dayMap[dayOfWeek]
      
      // 根据时间设置时段
      if (this.formData.time) {
        const timeParts = this.formData.time.split(':')
        if (timeParts.length === 2) {
          const hour = parseInt(timeParts[0])
          
          if (hour >= 5 && hour < 12) {
            this.selectedPeriod = 'morning'
          } else if (hour >= 12 && hour < 18) {
            this.selectedPeriod = 'afternoon'
          } else {
            this.selectedPeriod = 'evening'
          }
        }
      }
    },
    
    selectDay(day) {
      this.selectedDay = day
      this.updateDateFromQuickSelect()
    },
    selectPeriod(period) {
      this.selectedPeriod = period
      this.updateDateFromQuickSelect()
    },
    updateDateFromQuickSelect() {
      if (!this.selectedDay) return
      
      const today = new Date()
      let targetDate = new Date(today)
      
      // 设置日期
      const dayMap = {
        'monday': 1,
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6,
        'sunday': 0
      }
      
      const selectedDayNumber = dayMap[this.selectedDay]
      const currentDayNumber = today.getDay()
      
      // 计算到下一个选定日期的天数
      let daysUntil = (selectedDayNumber - currentDayNumber + 7) % 7
      if (daysUntil === 0) daysUntil = 7 // 如果是同一天，则选择下周的同一天
      
      targetDate.setDate(today.getDate() + daysUntil)
      
      // 格式化日期为YYYY-MM-DD
      const year = targetDate.getFullYear()
      const month = String(targetDate.getMonth() + 1).padStart(2, '0')
      const day = String(targetDate.getDate()).padStart(2, '0')
      this.formData.date = `${year}-${month}-${day}`
      
      // 设置时间
      if (this.selectedPeriod === 'morning') {
        this.formData.time = '09:00'
      } else if (this.selectedPeriod === 'afternoon') {
        this.formData.time = '14:00'
      } else if (this.selectedPeriod === 'evening') {
        this.formData.time = '19:00'
      }
    },
    onDateChange(e) {
      this.formData.date = e.detail.value
      this.updateQuickSelectFromDate()
    },
    onTimeChange(e) {
      this.formData.time = e.detail.value
      this.updateQuickSelectFromDate()
    },
    onDurationChange(e) {
      this.durationIndex = e.detail.value
      this.formData.duration = this.durationOptions[this.durationIndex]
    },
    chooseLocation() {
      Taro.chooseLocation({
        success: (res) => {
          this.formData.location = {
            name: res.name,
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          }
        }
      })
    },
    submitForm() {
      // 表单验证
      if (!this.formData.title) {
        Taro.showToast({
          title: '请输入活动标题',
          icon: 'none'
        })
        return
      }
      
      if (!this.formData.date || !this.formData.time) {
        Taro.showToast({
          title: '请选择活动时间',
          icon: 'none'
        })
        return
      }
      
      if (!this.formData.location.name) {
        Taro.showToast({
          title: '请选择活动地点',
          icon: 'none'
        })
        return
      }
      
      // 处理活动链接
      if (this.formData.link) {
        // 这里可以添加链接格式验证
        // 微信小程序暂不支持直接跳转到其他小程序，需要通过API实现
        console.log('活动链接:', this.formData.link)
      }
      
      // 提交表单
      Taro.showLoading({
        title: '提交中...'
      })
      
      // 模拟提交
      setTimeout(() => {
        Taro.hideLoading()
        Taro.showToast({
          title: '创建成功',
          icon: 'success'
        })
        
        // 返回首页
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      }, 1000)
    },
    
    // 处理第三方链接跳转
    handleLinkNavigation(link) {
      // 判断链接类型
      if (link.startsWith('wxapp://')) {
        // 微信小程序链接
        const appId = link.replace('wxapp://', '')
        Taro.navigateToMiniProgram({
          appId: appId,
          success: (res) => {
            console.log('跳转成功', res)
          },
          fail: (err) => {
            console.error('跳转失败', err)
            Taro.showToast({
              title: '跳转失败',
              icon: 'none'
            })
          }
        })
      } else if (link.startsWith('http://') || link.startsWith('https://')) {
        // 网页链接，使用web-view组件或调用系统浏览器
        Taro.navigateTo({
          url: `/pages/webview/index?url=${encodeURIComponent(link)}`
        })
      } else {
        Taro.showToast({
          title: '不支持的链接格式',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style lang="less">
.create-detail-page {
  padding: 0 20px;
  background-color: #FFF5F7; /* 柔和的粉色背景 */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
  
  /* 导航栏样式已移除 */
  
  .scrollable-content {
    flex: 1;
    height: calc(100vh - 10vh - 20px);
    overflow-y: auto;
  }
  
  .form-container {
    margin-top: 30px;
    padding-bottom: 30px;
    
    .form-item {
      margin-bottom: 25px;
      background-color: #FFFFFF;
      border-radius: 20px;
      padding: 15px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      
      .label {
        font-size: 18px;
        margin-bottom: 12px;
        font-weight: 500;
        color: #FF6B95; /* 可爱的粉色 */
      }
      
      input, textarea, .picker-value, .location-picker {
        width: 100%;
        background-color: #F8F8FF;
        border-radius: 30px; /* 胶囊形状 */
        padding: 16px 20px;
        font-size: 16px;
        box-sizing: border-box;
        border: 2px solid #FFD6E0; /* 粉色边框 */
        color: #5D5A6C;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        
        &:focus {
          border-color: #FF9EC4; /* 聚焦时变为粉色边框 */
          box-shadow: 0 2px 8px rgba(255, 158, 196, 0.2);
          outline: none;
        }
      }
      
      textarea {
        height: 120px;
        font-size: 14px;
      }
      
      .description-textarea {
        height: 60px; /* 调整为两行高度 */
        border-radius: 20px !important; /* 文本域使用更圆润的边角 */
      }
      
      .picker-value {
        color: #5D5A6C;
      }
      
      .time-quick-select {
        display: flex;
        margin-bottom: 15px;
        
        .quick-option {
          flex: 1;
          text-align: center;
          background-color: #F8F8FF;
          padding: 12px 0;
          margin: 0 5px;
          border-radius: 30px; /* 胶囊形状 */
          font-size: 14px;
          color: #5D5A6C;
          border: 2px solid #E2E0FF; /* 淡紫色边框 */
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          
          &:first-child {
            margin-left: 0;
          }
          
          &:last-child {
            margin-right: 0;
          }
          
          &.selected {
            background-color: #FF9EC4; /* 粉色背景 */
            color: white;
            font-weight: bold;
            border-color: #FF6B95;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(255, 107, 149, 0.2);
          }
        }
      }
      
      .time-detail {
        background-color: #F8F8FF;
        border-radius: 20px;
        padding: 15px;
        border: 2px dashed #C5CAE9; /* 虚线边框，可爱风格 */
        
        .time-row {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          
          .time-label {
            width: 100px;
            font-size: 14px;
            color: #7986CB; /* 淡紫色 */
            font-weight: 500;
          }
          
          .time-value {
            flex: 1;
            padding: 10px 15px;
            background-color: #FFFFFF;
            border-radius: 30px; /* 胶囊形状 */
            border: 2px solid #D1C4E9; /* 淡紫色边框 */
            color: #5D5A6C;
          }
        }
        
        .more-time {
          text-align: center;
          color: #FF6B95; /* 粉色 */
          font-size: 14px;
          padding: 10px 0;
          font-weight: bold;
        }
      }
      
      .link-tips {
        margin-top: 10px;
        font-size: 12px;
        color: #9E9E9E;
        padding: 0 10px;
        text-align: center;
        background-color: #FFF8E1; /* 淡黄色背景 */
        border-radius: 20px;
        padding: 8px 15px;
        border: 1px dashed #FFCC80; /* 虚线橙色边框 */
      }
    }
  }
  
  .bottom-placeholder {
    height: 30px;
  }
  
  .submit-btn {
    background: linear-gradient(to right, #FF9EC4, #FF6B95); /* 粉色渐变 */
    color: white;
    text-align: center;
    height: 10vh; /* 设置高度为屏幕高度的10% */
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 40px; /* 更圆润的胶囊形状 */
    font-size: 20px;
    font-weight: bold;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    margin: 0 20px 20px;
    box-shadow: 0 5px 15px rgba(255, 107, 149, 0.3); /* 粉色阴影 */
    letter-spacing: 2px; /* 字间距 */
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(255, 107, 149, 0.3);
    }
  }
}
</style>