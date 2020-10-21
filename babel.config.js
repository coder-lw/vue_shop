// 定义一个空数组
const prodPlugins = []
// 判断当前是开发阶段还是发布阶段
if(process.env.NODE_ENV === 'production'){
  // 说明当前是产品的发布模式 就在数组里push这个配置 清除consloe
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    // 去除consloe的配置项 直接放数组 里面会依据清空是否存在清空consloe
    ...prodPlugins,
    // 懒加载插件配置
    "@babel/plugin-syntax-dynamic-import"
  ]
}