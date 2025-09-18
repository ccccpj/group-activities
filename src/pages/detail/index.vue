<template>
  <view class="detail-page">
    <!-- 活动卡片 -->
    <view class="activity-card">
      <view class="activity-title">{{ activity.title }}</view>
      <view class="activity-info">
        <view class="info-item">
          <view class="info-label">时间</view>
          <view class="info-value">{{ activity.time }}</view>
        </view>
        <view class="info-item">
          <view class="info-label">地点</view>
          <view class="info-value">{{ activity.location }}</view>
        </view>
        <view class="info-item">
          <view class="info-label">人数</view>
          <view class="info-value">{{ activity.currentParticipants }}/{{ activity.maxParticipants }}</view>
        </view>
        <view class="info-item">
          <view class="info-label">状态</view>
          <view class="info-value status" :class="activity.status">{{ activity.statusText }}</view>
        </view>
      </view>
      <view class="activity-desc">{{ activity.description }}</view>
    </view>
    
    <!-- 统计信息 -->
    <view class="stats-card">
      <view class="card-title">活动统计</view>
      <view class="stats-grid">
        <view class="stats-item">
          <view class="stats-value">{{ activity.currentParticipants }}</view>
          <view class="stats-label">已报名</view>
        </view>
        <view class="stats-item">
          <view class="stats-value">{{ activity.checkedInCount }}</view>
          <view class="stats-label">已签到</view>
        </view>
        <view class="stats-item">
          <view class="stats-value">{{ activity.materialClaimedCount }}</view>
          <view class="stats-label">物品认领</view>
        </view>
      </view>
    </view>
    
    <!-- 物料认领列表 -->
    <view class="materials-card" v-if="activity.materials && activity.materials.length > 0">
      <view class="card-title">物料认领</view>
      <view class="material-list">
        <view 
          class="material-item" 
          v-for="(item, index) in activity.materials" 
          :key="index"
        >
          <view class="material-name">{{ item.name }}</view>
          <view class="material-quantity">{{ item.claimedQuantity }}/{{ item.quantity }}</view>
          <view class="material-status" :class="{ claimed: item.claimedQuantity >= item.quantity }">{{ item.claimedQuantity >= item.quantity ? '已认领' : '认领中' }}</view>
        </view>
      </view>
    </view>
    
    <!-- 报名人员列表 -->
    <view class="participants-card">
      <view class="card-title">报名人员 ({{ activity.participants.length }})</view>
      <view class="participant-list">
        <view 
          class="participant-item" 
          v-for="(person, index) in activity.participants" 
          :key="index"
        >
          <view class="participant-avatar">
            <image :src="person.avatar" mode="aspectFill"></image>
          </view>
          <view class="participant-info">
            <view class="participant-name">{{ person.name }}</view>
            <view class="participant-detail">{{ person.joinTime }} · {{ person.count }}人</view>
          </view>
          <view class="participant-status" :class="{ checked: person.checkedIn }">
            {{ person.checkedIn ? '已签到' : '未签到' }}
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部按钮 -->
    <view class="bottom-btns">
      <view 
        class="btn register-btn" 
        v-if="activity.status === 'upcoming' || activity.status === 'ongoing'"
        @tap="navigateToRegister"
      >
        我要报名
      </view>
      <view 
        class="btn checkin-btn" 
        v-if="activity.status === 'ongoing' && isParticipant"
        @tap="navigateToCheckin"
      >
        签到
      </view>
      <view 
        class="btn summary-btn" 
        v-if="activity.status === 'completed' && isCreator"
        @tap="navigateToSummary"
      >
        活动总结
      </view>
    </view>
  </view>
</template>

<script>
import { ref, reactive, computed } from 'vue'

export default {
  name: 'ActivityDetail',
  setup() {
    // 模拟数据
    const activity = reactive({
      id: '1',
      title: '周末爬山活动',
      time: '2023-09-20 08:00',
      location: '莫干山',
      status: 'ongoing',
      statusText: '进行中',
      description: '这是一个周末爬山活动，我们将一起登上莫干山，欣赏美丽的风景，呼吸新鲜空气，放松身心。请准备好登山装备和充足的水。',
      currentParticipants: 15,
      maxParticipants: 20,
      checkedInCount: 10,
      materialClaimedCount: 5,
      materials: [
        { name: '帐篷', quantity: 3, claimedQuantity: 3 },
        { name: '烧烤架', quantity: 2, claimedQuantity: 1 },
        { name: '便携音箱', quantity: 1, claimedQuantity: 1 }
      ],
      participants: [
        { 
          id: '1', 
          name: '张三', 
          avatar: 'https://via.placeholder.com/50', 
          joinTime: '09-15', 
          count: 2, 
          checkedIn: true 
        },
        { 
          id: '2', 
          name: '李四', 
          avatar: 'https://via.placeholder.com/50', 
          joinTime: '09-16', 
          count: 1, 
          checkedIn: true 
        },
        { 
          id: '3', 
          name: '王五', 
          avatar: 'https://via.placeholder.com/50', 
          joinTime: '09-17', 
          count: 3, 
          checkedIn: false 
        }
      ]
    })
    
    // 判断当前用户是否是参与者
    const isParticipant = ref(true)
    
    // 判断当前用户是否是创建者
    const isCreator = ref(true)
    
    const navigateToRegister = () => {
      wx.navigateTo({
        url: `/pages/register/index?id=${activity.id}`
      })
    }
    
    const navigateToCheckin = () => {
      wx.navigateTo({
        url: `/pages/checkin/index?id=${activity.id}`
      })
    }
    
    const navigateToSummary = () => {
      wx.navigateTo({
        url: `/pages/summary/index?id=${activity.id}`
      })
    }
    
    return {
      activity,
      isParticipant,
      isCreator,
      navigateToRegister,
      navigateToCheckin,
      navigateToSummary
    }
  }
}
</script>

<style lang="less">
.detail-page {
  padding: 20px;
  padding-bottom: 100px;
  background-color: #FFF5F7; /* 柔和的粉色背景 */
  
  .activity-card, .stats-card, .materials-card, .participants-card {
    background-color: #FFFFFF;
    border-radius: 20px; /* 更圆润 */
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 2px solid #E2E0FF; /* 淡紫色边框 */
  }
  
  .activity-card {
    .activity-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #FF6B95; /* 粉色 */
    }
    
    .activity-info {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 15px;
      
      .info-item {
        width: 50%;
        margin-bottom: 10px;
        
        .info-label {
          font-size: 14px;
          color: #7986CB; /* 淡紫色 */
          margin-bottom: 3px;
          font-weight: 500;
        }
        
        .info-value {
          font-size: 14px;
          color: #5D5A6C; /* 更新文字颜色 */
          background-color: #F8F8FF; /* 淡紫色背景 */
          padding: 8px 12px;
          border-radius: 15px; /* 胶囊形状 */
          display: inline-block;
          
          &.status {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px; /* 胶囊形状 */
            font-size: 12px;
            font-weight: bold;
            
            &.upcoming {
              background-color: #E1F5FE;
              color: #29B6F6;
              border: 1px solid #81D4FA;
            }
            
            &.ongoing {
              background-color: #E8F5E9;
              color: #66BB6A;
              border: 1px solid #A5D6A7;
            }
            
            &.completed {
              background-color: #F5F5F5;
              color: #9E9E9E;
              border: 1px solid #E0E0E0;
            }
          }
        }
      }
    }
    
    .activity-desc {
      font-size: 14px;
      color: #5D5A6C; /* 更新文字颜色 */
      line-height: 1.5;
      background-color: #FFF8E1; /* 淡黄色背景 */
      border-radius: 15px;
      padding: 12px 15px;
      border: 1px dashed #FFCC80; /* 虚线橙色边框 */
    }
  }
  
  .card-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #FF6B95; /* 粉色 */
    text-align: center;
  }
  
  .stats-grid {
    display: flex;
    justify-content: space-around;
    
    .stats-item {
      text-align: center;
      background-color: #F8F8FF; /* 淡紫色背景 */
      border-radius: 20px;
      padding: 12px 15px;
      width: 30%;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      
      .stats-value {
        font-size: 22px;
        font-weight: bold;
        color: #7986CB; /* 淡紫色 */
      }
      
      .stats-label {
        font-size: 12px;
        color: #9E9E9E; /* 更新文字颜色 */
        margin-top: 5px;
      }
    }
  }
  
  .material-list {
    .material-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 15px;
      border-bottom: 1px dashed #E2E0FF; /* 虚线紫色边框 */
      margin-bottom: 8px;
      background-color: #F8F8FF; /* 淡紫色背景 */
      border-radius: 15px;
      
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      .material-name {
        font-size: 14px;
        color: #5D5A6C; /* 更新文字颜色 */
        font-weight: 500;
      }
      
      .material-quantity {
        font-size: 14px;
        color: #7986CB; /* 淡紫色 */
      }
      
      .material-status {
        font-size: 12px;
        font-weight: bold;
        background-color: #E1F5FE;
        color: #29B6F6;
        padding: 5px 10px;
        border-radius: 15px; /* 胶囊形状 */
        
        &.claimed {
          background-color: #E8F5E9;
          color: #66BB6A;
        }
      }
    }
  }
  
  .participant-list {
    .participant-item {
      display: flex;
      align-items: center;
      padding: 12px 15px;
      border-bottom: 1px dashed #E2E0FF; /* 虚线紫色边框 */
      margin-bottom: 8px;
      background-color: #F8F8FF; /* 淡紫色背景 */
      border-radius: 15px;
      
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      .participant-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
        border: 2px solid #FFD6E0; /* 粉色边框 */
        
        image {
          width: 100%;
          height: 100%;
        }
      }
      
      .participant-info {
        flex: 1;
        
        .participant-name {
          font-size: 14px;
          color: #5D5A6C; /* 更新文字颜色 */
          margin-bottom: 3px;
          font-weight: 500;
        }
        
        .participant-detail {
          font-size: 12px;
          color: #9E9E9E; /* 更新文字颜色 */
        }
      }
      
      .participant-status {
        font-size: 12px;
        font-weight: bold;
        background-color: #FFEBEE;
        color: #EF5350;
        padding: 5px 10px;
        border-radius: 15px; /* 胶囊形状 */
        
        &.checked {
          background-color: #E8F5E9;
          color: #66BB6A;
        }
      }
    }
  }
  
  .bottom-btns {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding: 15px 20px;
    background-color: rgba(255, 245, 247, 0.9); /* 半透明粉色背景 */
    backdrop-filter: blur(5px); /* 毛玻璃效果 */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    
    .btn {
      flex: 1;
      height: 45px;
      line-height: 45px;
      text-align: center;
      border-radius: 30px; /* 胶囊形状 */
      font-size: 16px;
      margin: 0 5px;
      font-weight: bold;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.98);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      &.register-btn {
        background: linear-gradient(to right, #81D4FA, #29B6F6); /* 蓝色渐变 */
        color: white;
      }
      
      &.checkin-btn {
        background: linear-gradient(to right, #A5D6A7, #66BB6A); /* 绿色渐变 */
        color: white;
      }
      
      &.summary-btn {
        background: linear-gradient(to right, #FFE082, #FFD54F); /* 黄色渐变 */
        color: white;
      }
    }
  }
}
</style>