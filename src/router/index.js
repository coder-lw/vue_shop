import Vue from 'vue'
import VueRouter from 'vue-router'
// 组件导入 login_home_welcome懒加载分组
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Hoem.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// 组件导入 user_rights_roles懒加载分组
const Users = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/Roles.vue')


// 组件导入 cate_params懒加载分组
const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params.vue')

// 组件导入 list_add懒加载分组
const List = () => import(/* webpackChunkName: "list_add" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "list_add" */ '../components/goods/Add.vue')

// 组件导入 order_report懒加载分组
const Order = () => import(/* webpackChunkName: "order_report" */ '../components/orders/Order.vue')
const Report  = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report.vue')
Vue.use(VueRouter)

const routes = [
  {path:'/', redirect:'/login'},
  {path:'/login',component:Login},
  {
    path:'/home', 
    component:Home,
    redirect:'/welcome',
    children:[
    {path:'/welcome', component:Welcome},
    {path:'/users', component:Users},
    {path:'/rights', component:Rights},
    {path:'/roles', component:Roles},
    {path:'/categories', component:Cate},
    {path:'/params', component:Params},
    {path:'/goods', component:List},
    {path:'/goods/add', component:Add},
    {path:'/orders', component:Order},
    {path:'/reports', component:Report},
  ]},
]

const router = new VueRouter({
  routes
})

// 请求网页的权限处理
router.beforeEach((to, from, next) => {
  // to表示将要访问的路径
  // from代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //    next()代表放行   next('/login')代表强制跳转的路径

  // 判断用户访问的是不是登录页
  if(to.path === '/login') return next()
  //现在时访问权限页 把token从sessionstorage中保存到一个变量中 用做判断登录状态
  const tokenStr = window.sessionStorage.getItem('token')
  // 判断访问权限页面的用户 是否携带token 
  if(tokenStr) return next()
  // 如果没携带 强制回到登录页
  next('/login')
})

export default router
