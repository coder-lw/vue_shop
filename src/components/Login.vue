<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/rou.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm"  label-width="0px" class="login_form" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reserLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>

export default {
  
  name:'Login',
  data(){
    return {
      // 这是登录表单得数据绑定对象
      loginForm:{
        // 具体得数据
        username:'',
        password:''
      },
      // 这是表单的饿验证规则对象
      loginFormRules:{
        // 验证用户名是否合法
        username:[
          // 必填项 不填显示提醒内容  失去焦点的时候触发
          { required: true, message: '肉肉：请输入用户名', trigger: 'blur' },
          // 长度在3-10个字符之间
          { min: 3, max: 10, message: '肉肉：需要的长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password:[
           { required: true, message: '肉肉：请输入密码', trigger: 'blur' },
          // 长度在3-10个字符之间
          { min: 5, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reserLoginForm(){
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      // 预校验
      this.$refs.loginFormRef.validate((valid) => {
        // 验证失败就不发送请求
        if(!valid) return
        // 校验成功 发送请求
        this.$http.post('login',this.loginForm).then(res => {
          // 依据返回数据里面的状态码  判断登录正确还是错误
          console.log('哈哈')
          const data = res.data
          console.log(data);
          // 状态码不是200的都是失败  提示错误弹窗
          if(data.meta.status !== 200) return this.$message.error('啥都不是')
          this.$message.success('成功的肉肉')
          // 1、存储token到sessionStroage
          window.sessionStorage.setItem('token', data.data.token);
          // 2、登陆成功 存储token 跳转页面 
          this.$router.push('/home')

          


        })
        
      })
    }

  },
}
</script>

<style scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  background-color: #fff;
  height: 300px;
  width: 450px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
  

}
.avatar_box{
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #ddd;
  
  background-color: #fff;
  
}
.avatar_box img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>