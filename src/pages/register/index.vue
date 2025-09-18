<template>
  <view class="register-page">
    <view class="form-title">活动报名</view>
    
    <view class="activity-info">
      <view class="activity-title">{{ activity.title }}</view>
      <view class="activity-time">{{ activity.time }}</view>
      <view class="activity-location">{{ activity.location }}</view>
    </view>
    
    <view class="form-section">
      <view class="form-item">
        <view class="form-label">参加人数</view>
        <view class="counter-input">
          <view class="counter-btn minus" @tap="decreaseCount">-</view>
          <input 
            class="counter-value" 
            type="number" 
            v-model="form.count" 
            disabled
          />
          <view class="counter-btn plus" @tap="increaseCount">+</view>
        </view>
        <view class="form-tip">还剩 {{ activity.maxParticipants - activity.currentParticipants }} 个名额</view>
      </view>
      
      <view class="form-item">
        <view class="form-label">出发地</view>
        <input 
          class="form-input" 
          type="text" 
          v-model="form.departureLocation" 
          placeholder="请输入出发地"
        />
      </view>
      
      <view class="form-item">
        <view class="form-label">联系方式</view>
        <input 
          class="form-input" 
          type="number" 
          v-model="form.contact" 
          placeholder="请输入手机号码"
        />
      </view>
      
      <view class="form-item">
        <view class="form-label">备注信息</view>
        <textarea 
          class="form-textarea" 
          v-model="form.remark" 
          placeholder="请输入备注信息"
        />
      </view>
    </view>
    
    <view class="form-section" v-if="activity.materials && activity.materials.length > 0">
      <view class="section-title">物品认领</view>
      
      <view 
        class="material-item" 
        v-for="(item, index) in activity.materials" 
        :key="index"
      >
        <view class="material-info">
          <view class="material-name">{{ item.name }}</view>
          <view class="material-quantity">{{ item.claimedQuantity }}/{{ item.quantity }}</view>
        </view>
        <view 
          class="claim-btn" 
          :class="{ claimed: form.claimedMaterials.includes(item.id), disabled: item.claimedQuantity >= item.quantity && !form.claimedMaterials.includes(item.id) }" 
          @tap="toggleClaimMaterial(item.id)"
        >
          {{ form.claimedMaterials.includes(item.id) ? '已认领' : (item.claimedQuantity >= item.quantity ? '已满' : '认领') }}
        </view>
      </view>
    </view>
    
    <view class="submit-btn" @tap="submitForm">提交报名</view>
  </view>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'RegisterActivity',
  setup() {
    // 模拟活动数据
    const activity = reactive({
      id: '1',
      title: '周末爬山活动',
      time: '2023-09-20 08:00',
      location: '莫干山',
      currentParticipants: 15,
      maxParticipants: 20,
      materials: [
        { id: '1', name: '帐篷', quantity: 3, claimedQuantity: 2 },
        { id: '2', name: '烧烤架', quantity: 2, claimedQuantity: 1 },
        { id: '3', name: '便携音箱', quantity: 1, claimedQuantity: 1 }
      ]
    })
    
    // 表单数据
    const form = reactive({
      count: 1,
      departureLocation: '',
      contact: '',
      remark: '',
      claimedMaterials: []
    })
    
    // 增加人数
    const increaseCount = () => {
      if (form.count < (activity.maxParticipants - activity.currentParticipants)) {
        form.count++
      } else {
        wx.showToast({
          title: '超出可报名人数',
          icon: 'none'
        })
      }
    }
    
    // 减少人数
    const decreaseCount = () => {
      if (form.count > 1) {
        form.count--
      }
    }
    
    // 切换认领物品
    const toggleClaimMaterial = (materialId) => {
      const material = activity.materials.find(item => item.id === materialId)
      
      // 如果已经认领，则取消认领
      if (form.claimedMaterials.includes(materialId)) {
        const index = form.claimedMaterials.indexOf(materialId)
        form.claimedMaterials.splice(index, 1)
        material.claimedQuantity--
        return
      }
      
      // 如果未认领且还有剩余，则认领
      if (material.claimedQuantity < material.quantity) {
        form.claimedMaterials.push(materialId)
        material.claimedQuantity++
      } else {
        wx.showToast({
          title: '该物品已被认领完',
          icon: 'none'
        })
      }
    }
    
    // 提交表单
    const submitForm = () => {
      // 表单验证
      if (!form.departureLocation) {
        wx.showToast({
          title: '请输入出发地',
          icon: 'none'
        })
        return
      }
      
      if (!form.contact) {
        wx.showToast({
          title: '请输入联系方式',
          icon: 'none'
        })
        return
      }
      
      // 验证手机号格式（11位数字）
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(form.contact)) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return
      }
      
      // 验证备注长度不超过100字
      if (form.remark && form.remark.length > 100) {
        wx.showToast({
          title: '备注不能超过100字',
          icon: 'none'
        })
        return
      }
      
      // 提交表单
      console.log('提交报名表单', form)
      
      // 显示加载中
      wx.showLoading({
        title: '提交中...'
      })
      
      // 实际项目中应调用API提交表单
      try {
        // 模拟API调用
        setTimeout(() => {
          // 隐藏加载中
          wx.hideLoading()
          
          // 提交成功
          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              setTimeout(() => {
                wx.navigateBack()
              }, 2000)
            }
          })
        }, 1500)
      } catch (error) {
        // 隐藏加载中
        wx.hideLoading()
        
        // 显示错误信息
        wx.showToast({
          title: '报名失败，请重试',
          icon: 'none'
        })
        
        console.error('报名失败', error)
      }
    }
    
    return {
      activity,
      form,
      increaseCount,
      decreaseCount,
      toggleClaimMaterial,
      submitForm
    }
  }
}
</script>

<style lang="less">
.register-page {
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
    background-color: #FFFFFF;
    border-radius: 20px; /* 更圆润 */
    padding: 18px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 2px solid #E2E0FF; /* 淡紫色边框 */
    
    .activity-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
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
      margin-right: 5px;
    }
  }
  
  .form-section {
    background-color: #FFFFFF;
    border-radius: 20px; /* 更圆润 */
    padding: 18px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 2px solid #E2E0FF; /* 淡紫色边框 */
    
    .section-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #FF6B95; /* 粉色 */
      text-align: center;
    }
  }
  
  .form-item {
    margin-bottom: 15px;
    
    .form-label {
      font-size: 16px;
      color: #7986CB; /* 淡紫色 */
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .form-input {
      width: 100%;
      height: 40px;
      border: 2px solid #E2E0FF; /* 淡紫色边框 */
      border-radius: 30px; /* 胶囊形状 */
      padding: 0 15px;
      box-sizing: border-box;
      font-size: 14px;
      background-color: #F8F8FF; /* 淡紫色背景 */
      color: #5D5A6C;
      transition: all 0.3s ease;
      
      &:focus {
        border-color: #FF6B95; /* 粉色边框 */
        box-shadow: 0 2px 8px rgba(255, 107, 149, 0.2);
        outline: none;
      }
    }
    
    .form-textarea {
      width: 100%;
      height: 100px;
      border: 2px solid #E2E0FF; /* 淡紫色边框 */
      border-radius: 20px; /* 胶囊形状 */
      padding: 12px 15px;
      box-sizing: border-box;
      font-size: 14px;
      background-color: #F8F8FF; /* 淡紫色背景 */
      color: #5D5A6C;
      resize: none;
      transition: all 0.3s ease;
      
      &:focus {
        border-color: #FF6B95; /* 粉色边框 */
        box-shadow: 0 2px 8px rgba(255, 107, 149, 0.2);
        outline: none;
      }
    }
    
    .form-tip {
      font-size: 12px;
      color: #FF6B95; /* 粉色 */
      margin-top: 5px;
    }
    
    .counter-input {
      display: flex;
      align-items: center;
      
      .counter-btn {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #F8F8FF;
        font-size: 20px;
        font-weight: bold;
        border: 2px solid #E2E0FF;
        color: #7986CB;
        
        &.minus {
          border-radius: 20px 0 0 20px;
        }
        
        &.plus {
          border-radius: 0 20px 20px 0;
        }
      }
      
      .counter-value {
        width: 60px;
        height: 40px;
        border-top: 2px solid #E2E0FF;
        border-bottom: 2px solid #E2E0FF;
        text-align: center;
        font-size: 16px;
        background-color: #F8F8FF;
        color: #5D5A6C;
      }
    }
  }
  
  .material-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #E2E0FF;
    
    &:last-child {
      border-bottom: none;
    }
    
    .material-info {
      .material-name {
        font-size: 14px;
        color: #5D5A6C;
        margin-bottom: 5px;
      }
      
      .material-quantity {
        font-size: 12px;
        color: #7986CB;
      }
    }
    
    .claim-btn {
      padding: 8px 15px;
      border-radius: 30px; /* 胶囊形状 */
      font-size: 12px;
      background: linear-gradient(to right, #FF8FAB, #FF6B95); /* 粉色渐变 */
      color: #fff;
      box-shadow: 0 2px 5px rgba(255, 107, 149, 0.2);
      
      &.claimed {
        background: linear-gradient(to right, #A5D6A7, #66BB6A); /* 绿色渐变 */
        box-shadow: 0 2px 5px rgba(102, 187, 106, 0.2);
      }
      
      &.disabled {
        background: #E0E0E0;
        color: #9E9E9E;
        box-shadow: none;
      }
    }
  }
  
  .submit-btn {
    background: linear-gradient(to right, #FF8FAB, #FF6B95); /* 粉色渐变 */
    color: #fff;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 30px; /* 胶囊形状 */
    font-size: 18px;
    font-weight: bold;
    margin-top: 30px;
    box-shadow: 0 4px 10px rgba(255, 107, 149, 0.3);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 5px rgba(255, 107, 149, 0.2);
    }
  }
}
</style>