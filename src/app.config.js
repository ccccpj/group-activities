export default {
  pages: [
    'pages/index/index',
    'pages/create/index',
    'pages/detail/index',
    'pages/register/index',
    'pages/checkin/index',
    'pages/summary/index',
    'pages/create-detail/index',
    'pages/join/index',
    'pages/webview/index',
    'pages/icons/index',
    'pages/icons/example'
  ],
  requiredPrivateInfos: [
    'chooseLocation'
  ],
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于活动地点的选择'
    }
  },
  navigateToMiniProgramAppIdList: [
    // 这里需要添加允许跳转的小程序AppID列表
    // 例如: 'wxe5f52902cf4de896'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '群活动',
    navigationBarTextStyle: 'black'
  }
}
