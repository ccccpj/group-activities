<template>
  <view class="index">
    <view class="tabs">
      <view 
        class="tab" 
        :class="{ active: activeTab === 'created' }" 
        @tap="activeTab = 'created'"
      >
        我的活动
      </view>
      <view 
        class="tab" 
        :class="{ active: activeTab === 'joined' }" 
        @tap="activeTab = 'joined'"
      >
        我参加的
      </view>
    </view>
    
    <view class="content">
      <view v-if="activeTab === 'created'">
        <view v-if="myActivities.length > 0">
          <view 
            v-for="(activity, index) in myActivities" 
            :key="index"
            class="activity-card"
            @tap="navigateToDetail(activity.id)"
          >
            <view class="activity-title">{{ activity.title }}</view>
            <view class="activity-time">{{ activity.time }}</view>
            <view class="activity-location">{{ activity.location }}</view>
            <view class="activity-status" :class="activity.status">{{ activity.statusText }}</view>
          </view>
        </view>
        <view v-else class="empty-tip">暂无创建的活动</view>
      </view>
      
      <view v-if="activeTab === 'joined'">
        <view v-if="joinedActivities.length > 0">
          <view 
            v-for="(activity, index) in joinedActivities" 
            :key="index"
            class="activity-card"
            @tap="navigateToDetail(activity.id)"
          >
            <view class="activity-title">{{ activity.title }}</view>
            <view class="activity-time">{{ activity.time }}</view>
            <view class="activity-location">{{ activity.location }}</view>
            <view class="activity-status" :class="activity.status">{{ activity.statusText }}</view>
          </view>
        </view>
        <view v-else class="empty-tip">暂无参加的活动</view>
      </view>
    </view>
    
    <view class="create-btn" @tap="navigateToCreate">创建活动</view>
  </view>
</template>

<script>
import './index.less'
import { ref } from 'vue'

export default {
  name: 'Index',
  setup() {
    const activeTab = ref('created')
    
    // 模拟数据
    const myActivities = ref([
      {
        id: '1',
        title: '周末爬山活动',
        time: '2023-09-20 08:00',
        location: '莫干山',
        status: 'ongoing',
        statusText: '进行中'
      },
      {
        id: '2',
        title: '团建烧烤',
        time: '2023-09-25 18:00',
        location: '城市公园',
        status: 'upcoming',
        statusText: '即将开始'
      }
    ])
    
    const joinedActivities = ref([
      {
        id: '3',
        title: '篮球比赛',
        time: '2023-09-18 15:00',
        location: '体育馆',
        status: 'completed',
        statusText: '已结束'
      }
    ])
    
    const navigateToDetail = (id) => {
      wx.navigateTo({
        url: `/pages/detail/index?id=${id}`
      })
    }
    
    const navigateToCreate = () => {
      wx.switchTab({
        url: '/pages/create/index'
      })
    }
    
    return {
      activeTab,
      myActivities,
      joinedActivities,
      navigateToDetail,
      navigateToCreate
    }
  }
}
</script>
