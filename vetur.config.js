// vetur.config.js
module.exports = {
  // 项目根目录
  projects: [
    {
      // 项目根目录
      root: './',
      // 包含Vue文件的目录
      package: './package.json',
      // 全局组件目录
      globalComponents: [
        './src/components/**/*.vue'
      ],
      // 使用Taro的Vue3配置
      tsconfig: './tsconfig.json',
      // 使用jsconfig.json
      jsconfig: './jsconfig.json'
    }
  ]
};