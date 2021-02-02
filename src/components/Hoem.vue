<template>
  
    <el-container class="home-container boxw" >
      <!-- 头部 -->
      <el-header>
        <div>
          <img src="../assets/rou.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type='info' @click="backLogin">退出</el-button>
      </el-header>
      <!-- 主题区域 -->
    
      <el-container class="content_box">
        <!-- 侧边栏 -->
      
        <el-aside :width = "isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单区域 -->
          <el-menu
            :default-active="activePath"
            :router="true"
            :collapse-transition="false"
            :collapse="isCollapse"
            :unique-opened="true"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409BFF">
            <!-- 一级菜单 -->
            <!-- 绑定唯一值 -->
            <el-submenu :index="item.id+''" v-for="(item,index) in menuList" :key="item.id">
              <!-- 一级菜单得模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class='iconsObj[item.id]' class="iconfont"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
             <!-- 二级菜单 -->
              <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children"
                :key="subitem.id" @click="saveNavState('/'+subitem.path)">
                <!-- 二级菜单得模板区域 -->
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu> 
          </el-menu>
        </el-aside>
        <!-- 右侧主题区域 -->
        <el-main>
          <!-- home子路由占位区域 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>    
      
    
    
  
</template>
<script>
export default {
  name:'Home',
  data(){
    return {
      // 左侧菜单栏数据
     menuList:[],
     iconsObj:{
       '125':'el-icon-s-custom',
       '103':'el-icon-s-marketing',
       '101':'el-icon-s-goods',
       '102':'el-icon-tickets',
       '145':'el-icon-s-platform'
     },
     isCollapse:false,
     activePath:''
    }
  },
  
  methods: {
    backLogin(){
      window.sessionStorage.clear('token');
      this.$router.push('/login')
    },
    getMenuList(){
      this.$http.get('menus').then(res => {
        const data = res.data
        console.log(data)
        // 判断状态码不是200 显示失败信息
        if(data.meta.status !== 200) return this.$message.error(data.meta.msg)
        // 保存数据到外部
        this.menuList = data.data
        console.log(this.menuList)

      })
      
    },
    // 点击按钮切换菜单得折叠与展开
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
      
    },
    // 保存连接得激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
    }
  },

  created(){
    console.log(this.$route)
    this.getMenuList()
    // this.$router.push('/welcome')
    this.activePath = window.sessionStorage.getItem('activePath')
  },
 
}
</script>

<style scoped>
.content_box{
  width: 100%;
  height: calc(100vh - 100px) !important;
}
.boxw{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
}
.el-header div{
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header img{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 10px#ddd;
  padding: 2px;
  background-color: #fff;
  
}
.el-header div span{
  margin-left: 20px;
}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color:#EAEDF1;
  height: 100%;
}
.iconfont{
  margin-right: 10px;
}
.el-menu{
  border-right: none;
}
.toggle-button{
  background-color: #4A5064;
  text-align: center;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  /* 字体间距 */
  letter-spacing: 0.2em;
  cursor: pointer;
  user-select:none;
}
</style>