<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 输入框 -->
        <el-row :gutter="100">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList()" ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <!-- 点击添加用户 显示对话框 把addDialogVisible设置为true  -->
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
     <!-- 用户列表 -->
     <el-table :data="userList" border stripe max-height="600">
       <el-table-column label="#" type="index"></el-table-column>
       <el-table-column label="姓名" prop="username"></el-table-column>
       <el-table-column label="邮箱" prop="email"></el-table-column>
       <el-table-column label="电话" prop="mobile"></el-table-column>
       <el-table-column label="角色" prop="role_name"></el-table-column>  
       <el-table-column label="状态">
         <template slot-scope="scope">
           <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
          </el-switch>
         </template>
       </el-table-column>
       <el-table-column label="操作" width="180px">
         <template v-slot="scope">
           <!-- 修改按钮 -->
           <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
           <!-- 删除 -->
           <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
           <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <!-- 分配角色按钮 -->
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
           </el-tooltip>
         </template>
       </el-table-column>
     </el-table>
     <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      @close="addDialogClosed"
      title="添加用户"
      :visible.sync="addDialogVisible" 
      width="50%">
      <!-- 内容主题区域 -->
      <el-form :model="addForm" :rules="ruleaddForm" ref="ruleFormRef" label-width="80px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <!-- 点击隐藏和确定都可以隐藏对话框 -->
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改的对话框 -->
    <el-dialog
      @closed="editDialogClosed"
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      >
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px" >
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      @close="setRoleDialogVisible"
      :visible.sync="setDialogVisible"
      width="50%">
      <div>当前用户 : {{userInfo.username}}</div>
      <div>当前角色 : {{userInfo.role_name}}</div>
      <p>分配新角色 :
          <el-select v-model="selectRoleId" placeholder="请选择" ref>
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template> 

<script>
export default {
  name:'Users',
  data(){
    // 定义自定义校验规则
    var checkEmail = (rule,value,cb) => {
      // 验证邮箱的规则   
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
        // 合法的
        return cb()
      }
      // 非法的
      cb(new Error('请输入合法的邮箱'))

    }
    var checkmobile = (rule,value,cb) => {
      // 验证手机号的规则
      // 验证手机的正则表达式
      const regmobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regmobile.test(value)){
        // 合法的
        return cb()
      }
      // 非法的
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表得参数对象
      queryInfo:{
        // 搜索关键字
        query:'',
        // 当前的页数
        pagenum:1,
        // 当前每页显示多少条数据
        pagesize:2
      },
      userList:[], //用户数据列表
      total:0 , //总数居条数
      // 控制添加对话框的显示和隐藏
      addDialogVisible:false,
      // 添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      // 添加表单验证规则的对象
      ruleaddForm:{
        username:[
          { required: true, message: '肉肉：请输入用户名', trigger: 'blur' },
          // 长度在3-10个字符之间
          { min: 3, max: 10, message: '肉肉：需要的长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
           { required: true, message: '肉肉：请输入密码', trigger: 'blur' },
          // 长度在3-10个字符之间
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '肉肉：请输入邮箱', trigger: 'blur' },
          // 长度在3-10个字符之间
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '手机号不能为空'},
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      // 控制用户修改对话框显示与隐藏
      editDialogVisible:false,
      // 查询到的用户信息对象 保存
      editForm:{},
      // 修改用户表单的验证规则
      editFormRules:{
        email:[
          { required: true, message: '肉肉：请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '手机号不能为空'},
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框显示与隐藏
      setDialogVisible:false,
      // 以选中的角色id值
      selectRoleId: '',
      // 保存当前点击分配角色 一栏的用户信息
      userInfo:{},
      // 当前的最新数据库中的角色列表
      roleList:[]
        
      
    }
  },
  created() {
    // 请求用户列表数据
    this.getUserList()
    
  },
  methods:{
    // 请求当前展示数据
    getUserList(){
      this.$http.get('users',{params:this.queryInfo }).then(res => {
        // console.log(res)
        if(res.data.meta.status !== 200) return this.$message.error('获取用户列表失败')
        // 上面排除之后 这里就是请求成功 来保存数据
        this.userList = res.data.data.users
        
        this.total = res.data.data.total
        this.isTrue = res.data.data
        console.log(this.userList);
      })
    },
    // 监听切换下拉菜单页
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      // 重新请求数据 作展示
      this.getUserList()
    },
    // 监听页码的改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      // 重新请求数据 作展示
      this.getUserList()

    },
    // 监听switch开关状态的改变
    userStateChange(userinfo){
      console.log(userinfo)
      // 调用接口 修改用户状态 保存到数据库
      this.$http.put("users/"+userinfo.id+"/state/"+userinfo.mg_state).then(res => {
      // 判断返回结果
        console.log(res)
        if(res.data.meta.status == 200){
          //成功弹出显示修改状态成功
         return this.$message.success('更新用户状态成功')
      

        } 
        // 如果失败了 就没有修改是数据库中数据 所以需要把sewitch手动更改的值改回去
          userinfo.mg_state = !userinfo.mg_state //保证界面和修改之前一样
          this.$message.error('更新用户状态失败')
      
      })
    },
    addDialogClosed(){
      this.$refs.ruleFormRef.resetFields()
    },
    // 预验证  提交修改数据
    adduser(){
      this.$refs.ruleFormRef.validate(valid => {
        if(!valid) return
        // 成功了 发起添加用户的网络请求
        this.$http.post('users',this.addForm).then(res => {
          if(res.data.meta.status !== 201) return this.$message.error('添加失败')
          // 添加用户成功
          this.$message.success('添加用户成功')
          // 重新发请求 调用列表数据展示
          this.getUserList()
        })
        
        this.addDialogVisible = false
      })
    },
    // 展示用户编辑的对话框
    showEditDialog(id){
      this.editDialogVisible = true
      // 根据用户id查询用户信息 发生数据请求
      this.$http.get('users/'+id).then(res => {
        if(res.data.meta.status !== 200) return this.$message.error('修改数据失败')
        // 成功 保存查询到的数据  已被渲染修改用户表单使用
        this.editForm = res.data.data
        
      })

    },
    // 监听修改用户对话框的关闭事件 重置表单
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改信息  请求
    edituser(){
      // 预验证
      this.$refs.editFormRef.validate(valid => {
        if(!valid) return
        // 发送请求 提交修改数据
        this.$http.put('users/'+this.editForm.id,this.editForm).then(res => {
          if(res.data.meta.status !== 200) return this.$messsage.error('修改失败')
          this.$message.success('修改成功')
          // 重新请求数据 做展示修改后的结果
          this.getUserList()
          // 关闭兑换框
          this.editDialogVisible = false
        })
      })
    },
    // 根据id删除对应的用户信息 提示
    removeUserById(id){
      // 询问用户是否清除数据
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          // 判断返回的字符串是否等于成功时返回当饿字符串  confirm
          if(res === 'confirm'){
            // 根据id删除数据 发送请求
            this.$http.delete('users/'+id).then(res => {
              // 判断状态码 显示对应信息
            if(res.data.meta.status !== 200) return this.$message.info('删除失败')
            // 请求成功 删除成功
            this.$message.success('删除成功')
            // 重新请求用于展示本页面的数据
            this.getUserList()
          })
          }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 显示分配角色对话框
    setRole(userInfo){
      this.setDialogVisible = true
      // 请求角色列表 调取API
      this.$http.get('roles').then(res => {
        console.log(res)
        if(res.data.meta.status !== 200){
          return this.$message.error('请求数据失败')
        }
        this.$message.success('请求角色列表成功')
        //保存数据库当前所有的角色列表 用作实时展示
        this.roleList = res.data.data
      })
      

      // 将当前电即分配按钮的用户信息保存到外部
      this.userInfo = userInfo
    },
    // 点击按钮分配角色
    saveRoleInfo(){
      // 发送请求 分配角色
      this.$http.put('users/'+this.userInfo.id+'/role',{rid:this.selectRoleId}).then(res => {
        if(res.data.meta.status !== 200) return this.$message.error('分配角色失败')
        this.$message.success('分配角色成功')
        this.getUserList()
        this.setDialogVisible = false
      })
    },
    // 监听对话框关闭 重置下拉列表
    setRoleDialogVisible(){
      this.selectRoleId = ''
      this.userInfo = {}
    }

}
}
</script>
<style  scoped>

</style>