import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

// 导入全局样式表
import './assets/css/global.css'
// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor"
// 导入富文本编辑器 对应得样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入进度条的包 包括对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截 对config做预处理
  // 请求时request中展示进度条
axios.interceptors.request.use(config => {
  NProgress.start();
  // 通过axios请求拦截器添加token，保证拥有获取数据得权限
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response 拦截器中 隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done();
  return config
})
Vue.prototype.$http = axios


Vue.config.productionTip = false
// 安装tree表格插件
Vue.component('tree-table',TreeTable)

// 将富文本编辑器 注册为全局可用得组件
Vue.use(VueQuillEditor)


// 定义一个时间过滤器 全局得
Vue.filter('dateFormat',function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + "").padStart(2,'0')
  const d = (dt.getDate() + "").padStart(2,'0')
  const hh = (dt.getHours() + "").padStart(2,'0')
  const mm = (dt.getMinutes() + "").padStart(2,'0')
  const ss = (dt.getSeconds() + "").padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
