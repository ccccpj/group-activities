<template>
  <view class="summary-page">
    <view class="form-title">活动总结</view>
    
    <view class="activity-info">
      <view class="activity-title">{{ activity.title }}</view>
      <view class="activity-time">{{ activity.time }}</view>
      <view class="activity-location">{{ activity.location }}</view>
      <view class="activity-status completed">已结束</view>
    </view>
    
    <view class="summary-tabs">
      <view 
        class="tab" 
        :class="{ active: activeTab === 'expense' }" 
        @tap="activeTab = 'expense'"
      >
        费用结算
      </view>
      <view 
        class="tab" 
        :class="{ active: activeTab === 'memory' }" 
        @tap="activeTab = 'memory'"
      >
        纪念卡片
      </view>
      <view 
        class="tab" 
        :class="{ active: activeTab === 'archive' }" 
        @tap="activeTab = 'archive'"
      >
        归档数据
      </view>
    </view>
    
    <view class="summary-content">
      <!-- 费用结算 -->
      <view v-if="activeTab === 'expense'" class="expense-container">
        <view class="expense-form">
          <view class="form-item">
            <view class="form-label">总费用</view>
            <input 
              class="form-input" 
              type="digit" 
              v-model="expense.totalAmount" 
              placeholder="请输入总费用"
            />
          </view>
          
          <view class="form-item">
            <view class="form-label">费用类型</view>
            <picker 
              mode="selector" 
              :range="expenseTypes" 
              @change="onExpenseTypeChange"
            >
              <view class="picker-value">{{ expense.type || '请选择费用类型' }}</view>
            </picker>
          </view>
          
          <view class="form-item">
            <view class="form-label">分摊方式</view>
            <picker 
              mode="selector" 
              :range="splitMethods" 
              @change="onSplitMethodChange"
            >
              <view class="picker-value">{{ expense.splitMethod || '请选择分摊方式' }}</view>
            </picker>
          </view>
          
          <view class="form-item">
            <view class="form-label">备注</view>
            <textarea 
              class="form-textarea" 
              v-model="expense.remark" 
              placeholder="请输入备注信息"
            />
          </view>
        </view>
        
        <view class="expense-result" v-if="expense.totalAmount && expense.splitMethod">
          <view class="result-title">费用分摊结果</view>
          <view 
            class="result-item" 
            v-for="(item, index) in splitResults" 
            :key="index"
          >
            <view class="person-name">{{ item.name }}</view>
            <view class="person-amount">¥ {{ item.amount.toFixed(2) }}</view>
          </view>
        </view>
        
        <view class="action-btns">
          <view class="calculate-btn" @tap="calculateSplit">计算分摊</view>
          <view class="share-btn" @tap="shareExpense">分享结算</view>
        </view>
      </view>
      
      <!-- 纪念卡片 -->
      <view v-if="activeTab === 'memory'" class="memory-container">
        <view class="memory-card">
          <view class="card-header">
            <view class="card-title">{{ activity.title }}</view>
            <view class="card-date">{{ activity.time.split(' ')[0] }}</view>
          </view>
          
          <view class="card-content">
            <view class="upload-photos">
              <view class="upload-title">活动照片</view>
              <view class="photo-list">
                <view 
                  class="photo-item" 
                  v-for="(photo, index) in memoryCard.photos" 
                  :key="index"
                >
                  <image :src="photo" mode="aspectFill"></image>
                  <view class="delete-icon" @tap="deletePhoto(index)">×</view>
                </view>
                <view class="add-photo" @tap="addPhoto" v-if="memoryCard.photos.length < 9">+</view>
              </view>
            </view>
            
            <view class="memory-text">
              <view class="text-title">活动感想</view>
              <textarea 
                class="text-input" 
                v-model="memoryCard.text" 
                placeholder="写下你对这次活动的感想..."
              />
            </view>
          </view>
          
          <view class="card-footer">
            <view class="participant-count">{{ activity.currentParticipants }}人参与</view>
            <view class="location-tag">{{ activity.location }}</view>
          </view>
        </view>
        
        <view class="action-btns">
          <view class="save-btn" @tap="saveMemoryCard">保存卡片</view>
          <view class="share-btn" @tap="shareMemoryCard">分享卡片</view>
        </view>
      </view>
      
      <!-- 归档数据 -->
      <view v-if="activeTab === 'archive'" class="archive-container">
        <view class="stats-card">
          <view class="stats-title">活动数据统计</view>
          <view class="stats-grid">
            <view class="stats-item">
              <view class="stats-value">{{ activity.currentParticipants }}</view>
              <view class="stats-label">参与人数</view>
            </view>
            <view class="stats-item">
              <view class="stats-value">{{ activity.checkedInCount }}</view>
              <view class="stats-label">签到人数</view>
            </view>
            <view class="stats-item">
              <view class="stats-value">{{ (activity.checkedInCount / activity.currentParticipants * 100).toFixed(0) }}%</view>
              <view class="stats-label">签到率</view>
            </view>
          </view>
        </view>
        
        <view class="archive-options">
          <view class="option-item" @tap="exportData">
            <view class="option-icon">📊</view>
            <view class="option-text">导出数据</view>
          </view>
          <view class="option-item" @tap="generateReport">
            <view class="option-icon">📝</view>
            <view class="option-text">生成报告</view>
          </view>
          <view class="option-item" @tap="archiveActivity">
            <view class="option-icon">📦</view>
            <view class="option-text">归档活动</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, reactive, computed } from 'vue'

export default {
  name: 'ActivitySummary',
  setup() {
    // 模拟活动数据
    const activity = reactive({
      id: '1',
      title: '周末爬山活动',
      time: '2023-09-20 08:00',
      location: '莫干山',
      currentParticipants: 15,
      checkedInCount: 12,
      participants: [
        { id: '1', name: '张三', count: 2 },
        { id: '2', name: '李四', count: 1 },
        { id: '3', name: '王五', count: 3 },
        { id: '4', name: '赵六', count: 1 }
      ]
    })
    
    const activeTab = ref('expense')
    
    // 费用结算数据
    const expense = reactive({
      totalAmount: '',
      type: '',
      splitMethod: '',
      remark: ''
    })
    
    const expenseTypes = ['餐饮', '交通', '住宿', '门票', '其他']
    const splitMethods = ['平均分摊', '按人数分摊']
    
    const onExpenseTypeChange = (e) => {
      expense.type = expenseTypes[e.detail.value]
    }
    
    const onSplitMethodChange = (e) => {
      expense.splitMethod = splitMethods[e.detail.value]
    }
    
    // 计算分摊结果
    const splitResults = computed(() => {
      if (!expense.totalAmount || !expense.splitMethod) return []
      
      const totalAmount = parseFloat(expense.totalAmount)
      const results = []
      
      if (expense.splitMethod === '平均分摊') {
        const perPerson = totalAmount / activity.participants.length
        
        activity.participants.forEach(person => {
          results.push({
            name: person.name,
            amount: perPerson
          })
        })
      } else if (expense.splitMethod === '按人数分摊') {
        let totalCount = 0
        activity.participants.forEach(person => {
          totalCount += person.count
        })
        
        const perPerson = totalAmount / totalCount
        
        activity.participants.forEach(person => {
          results.push({
            name: person.name,
            amount: perPerson * person.count
          })
        })
      }
      
      return results
    })
    
    // 计算分摊
    const calculateSplit = () => {
      if (!expense.totalAmount) {
        wx.showToast({
          title: '请输入总费用',
          icon: 'none'
        })
        return
      }
      
      if (!expense.splitMethod) {
        wx.showToast({
          title: '请选择分摊方式',
          icon: 'none'
        })
        return
      }
      
      console.log('计算分摊', splitResults.value)
    }
    
    // 分享费用结算
    const shareExpense = () => {
      if (splitResults.value.length === 0) {
        wx.showToast({
          title: '请先计算分摊',
          icon: 'none'
        })
        return
      }
      
      console.log('分享费用结算')
      wx.showToast({
        title: '分享成功',
        icon: 'success'
      })
    }
    
    // 纪念卡片数据
    const memoryCard = reactive({
      photos: [
        'https://via.placeholder.com/100',
        'https://via.placeholder.com/100'
      ],
      text: ''
    })
    
    // 添加照片
    const addPhoto = () => {
      if (memoryCard.photos.length >= 9) return
      
      console.log('添加照片')
      memoryCard.photos.push('https://via.placeholder.com/100')
    }
    
    // 删除照片
    const deletePhoto = (index) => {
      memoryCard.photos.splice(index, 1)
    }
    
    // 保存纪念卡片
    const saveMemoryCard = () => {
      console.log('保存纪念卡片', memoryCard)
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }
    
    // 分享纪念卡片
    const shareMemoryCard = () => {
      console.log('分享纪念卡片')
      wx.showToast({
        title: '分享成功',
        icon: 'success'
      })
    }
    
    // 导出数据
    const exportData = () => {
      console.log('导出数据')
      wx.showToast({
        title: '导出成功',
        icon: 'success'
      })
    }
    
    // 生成报告
    const generateReport = () => {
      console.log('生成报告')
      wx.showToast({
        title: '报告生成成功',
        icon: 'success'
      })
    }
    
    // 归档活动
    const archiveActivity = () => {
      console.log('归档活动')
      wx.showModal({
        title: '确认归档',
        content: '归档后活动将不可编辑，确认归档吗？',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '归档成功',
              icon: 'success',
              duration: 2000,
              success: () => {
                setTimeout(() => {
                  wx.navigateBack()
                }, 2000)
              }
            })
          }
        }
      })
    }
    
    return {
      activity,
      activeTab,
      expense,
      expenseTypes,
      splitMethods,
      splitResults,
      onExpenseTypeChange,
      onSplitMethodChange,
      calculateSplit,
      shareExpense,
      memoryCard,
      addPhoto,
      deletePhoto,
      saveMemoryCard,
      shareMemoryCard,
      exportData,
      generateReport,
      archiveActivity
    }
  }
}
</script>

<style lang="less">
.summary-page {
  padding: 20px;
  background-color: #FFF5F7; /* 柔和的粉色背景 */
  
  .form-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    color: #FF6B95; /* 粉色标题 */
  }
  
  .activity-info {
    background-color: #fff;
    border-radius: 20px; /* 更圆润的边角 */
    padding: 18px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 2px solid #E2E0FF; /* 淡紫色边框 */
    
    .activity-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #FF6B95; /* 粉色标题 */
      text-align: center;
    }
    
    .activity-time, .activity-location {
      font-size: 14px;
      color: #7986CB; /* 淡紫色文字 */
      margin-bottom: 8px;
      background-color: #F8F8FF; /* 淡紫色背景 */
      padding: 8px 12px;
      border-radius: 20px; /* 胶囊形状 */
      display: inline-block;
      margin-right: 10px;
    }
    
    .activity-status {
      display: inline-block;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 20px; /* 胶囊形状 */
      margin-top: 8px;
      font-weight: bold;
      
      &.completed {
        background-color: #F8F8FF;
        color: #7986CB; /* 淡紫色 */
        border: 1px solid #E2E0FF;
      }
    }
  }
  
  .summary-tabs {
    display: flex;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 30px; /* 更圆润的边角 */
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 2px solid #E2E0FF; /* 淡紫色边框 */
    
    .tab {
      flex: 1;
      text-align: center;
      padding: 14px 0;
      font-size: 15px;
      color: #7986CB; /* 淡紫色文字 */
      transition: all 0.3s ease;
      
      &.active {
        background: linear-gradient(to right, #FF8FAB, #FF6B95); /* 粉色渐变 */
        color: #fff;
        font-weight: bold;
      }
    }
  }
  
  .summary-content {
    background-color: #fff;
    border-radius: 20px; /* 更圆润的边角 */
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    border: 2px solid #E2E0FF; /* 淡紫色边框 */
  }
  
  .form-item {
    margin-bottom: 15px;
    
    .form-label {
      font-size: 14px;
      color: #333;
      margin-bottom: 5px;
    }
    
    .form-input {
      width: 100%;
      height: 40px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0 10px;
      box-sizing: border-box;
      font-size: 14px;
    }
    
    .form-textarea {
      width: 100%;
      height: 80px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      box-sizing: border-box;
      font-size: 14px;
    }
    
    .picker-value {
      width: 100%;
      height: 40px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0 10px;
      box-sizing: border-box;
      font-size: 14px;
      line-height: 40px;
      color: #666;
    }
  }
  
  .expense-result {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f5f5f5;
    
    .result-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    
    .result-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .person-name {
        font-size: 14px;
        color: #333;
      }
      
      .person-amount {
        font-size: 14px;
        color: #ff4d4f;
        font-weight: bold;
      }
    }
  }
  
  .action-btns {
    display: flex;
    margin-top: 20px;
    
    .calculate-btn, .save-btn, .share-btn {
      flex: 1;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 4px;
      font-size: 14px;
      margin: 0 5px;
    }
    
    .calculate-btn, .save-btn {
      background-color: #f5f5f5;
      color: #666;
    }
    
    .share-btn {
      background-color: #1296db;
      color: #fff;
    }
  }
  
  .memory-card {
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
    
    .card-header {
      padding: 15px;
      background-color: #f9f9f9;
      border-bottom: 1px solid #eee;
      
      .card-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .card-date {
        font-size: 12px;
        color: #999;
      }
    }
    
    .card-content {
      padding: 15px;
      
      .upload-photos {
        margin-bottom: 20px;
        
        .upload-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .photo-list {
          display: flex;
          flex-wrap: wrap;
          
          .photo-item, .add-photo {
            width: 80px;
            height: 80px;
            margin-right: 10px;
            margin-bottom: 10px;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
          }
          
          .photo-item {
            image {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .delete-icon {
              position: absolute;
              top: 0;
              right: 0;
              width: 20px;
              height: 20px;
              background-color: rgba(0, 0, 0, 0.5);
              color: #fff;
              font-size: 16px;
              text-align: center;
              line-height: 20px;
            }
          }
          
          .add-photo {
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #999;
          }
        }
      }
      
      .memory-text {
        .text-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .text-input {
          width: 100%;
          height: 100px;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
          box-sizing: border-box;
          font-size: 14px;
        }
      }
    }
    
    .card-footer {
      padding: 10px 15px;
      background-color: #f9f9f9;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #999;
    }
  }
  
  .stats-card {
    margin-bottom: 20px;
    
    .stats-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    
    .stats-grid {
      display: flex;
      justify-content: space-around;
      
      .stats-item {
        text-align: center;
        
        .stats-value {
          font-size: 24px;
          font-weight: bold;
          color: #1296db;
        }
        
        .stats-label {
          font-size: 12px;
          color: #999;
          margin-top: 5px;
        }
      }
    }
  }
  
  .archive-options {
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
    
    .option-item {
      text-align: center;
      
      .option-icon {
        font-size: 30px;
        margin-bottom: 10px;
      }
      
      .option-text {
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>