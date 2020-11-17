import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Vue from 'vue'
export default (function request(){
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
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
    return axios
})()
