<template>
  <view class="icons-page">
    <view class="page-header">
      <view class="title">图标库展示</view>
      <view class="subtitle">使用SVG图标替代图片</view>
      <view class="example-btn" @tap="navigateToExample">
        <text>查看应用示例</text>
        <Icon name="github" size={16} />
      </view>
    </view>
    
    <icon-demo />
    
    <view class="usage-section">
      <view class="section-title">使用方法</view>
      <view class="code-block">
        <text>// 方法一：导入单个图标
import { GitHubIcon, DiscordIcon } from '../../components/icons';

// 在模板中使用
&lt;GitHubIcon /&gt;
&lt;DiscordIcon /&gt;</text>
      </view>
      
      <view class="code-block">
        <text>// 方法二：使用通用图标组件
import { Icon } from '../../components/icons';

// 使用图标（支持自定义颜色和大小）
&lt;Icon name="github" /&gt;
&lt;Icon name="basketball" color="#ff5500" size={32} /&gt;</text>
      </view>
    </view>
    
    <view class="usage-section">
      <view class="section-title">通用图标组件示例</view>
      <view class="icon-examples">
        <view class="icon-example">
          <Icon name="github" size={32} />
          <text class="icon-label">默认颜色</text>
        </view>
        <view class="icon-example">
          <Icon name="basketball" color="#ff5500" size={32} />
          <text class="icon-label">自定义颜色</text>
        </view>
        <view class="icon-example">
          <Icon name="music" color="#8a2be2" size={40} />
          <text class="icon-label">自定义大小</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import './index.less'
import IconDemo from '../../components/IconDemo'
import { Icon } from '../../components/icons'
import Taro from '@tarojs/taro'

export default {
  name: 'IconsPage',
  components: {
    IconDemo,
    Icon
  },
  methods: {
    navigateToExample() {
      Taro.navigateTo({
        url: '/pages/icons/example'
      });
    }
  }
}
</script>