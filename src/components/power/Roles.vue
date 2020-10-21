<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row >
        <el-col>
          <!-- 添加角色按钮 -->
          <el-button type="primary" @click="showAddDialogVisible" >添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList"  border stripe max-height="500">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom',i1 ===0 ? 'bdtop' : '','center'] ">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套 渲染二级权限 -->
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bdtop','center']">
                  <!-- 二级 -->
                  <el-col :span="6" >
                    <el-tag closable type="success" @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag type="warning" closable 
                            v-for="(item3,i3) in item2.children"
                            @close="removeRightById(scope.row,item3.id)" 
                            :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" 
                      icon="el-icon-edit" 
                      size="mini" 
                      @click="showEidtDialog(scope.row)"
                      >编辑</el-button>
            <!-- 删除 -->
            <el-button type="danger"
             icon="el-icon-delete" 
             size="mini" @click="removeRolesById(scope.row.id)">删除</el-button>
            <!-- 分配权限列表 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
      <!-- 添加用户对话框 -->
      <el-dialog
         @close="addDialogClosed"
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        >
        <!-- 添加角色表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改对话框 -->
      <el-dialog
         
        title="提示"
        :visible.sync="eidtDialogVisible"
        width="50%"
        >
        <!-- 修改角色表单 -->
        <el-form :model="editForm" :rules="addFormRules" ref="eidtFormRef" label-width="100px" @close="eidtDialogClosed">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="eidtDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="eidtRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        @close="setRightDialogClosed"
        :visible.sync="setRightDialogVisible"
        width="50%">
        <!-- tree控件 -->
        <el-tree ref="treeRef" :default-checked-keys="defKeys" node-key="id" default-expand-all show-checkbox :data="rightsList" :props="treeProps"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRight">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
  name:'Roles',
  data(){
    return {
      // 当前页展示数据
      rolesList:[],
      // 添加对话框显示
      addDialogVisible:false,
      // 添加角色数据
      addForm:{
        roleName:'',
        roleDesc:'',
        
      },
      // 添加角色验证对象
      addFormRules:{
        roleName:[
          { required: true, message: '肉肉：请输入角色名称', trigger: 'blur' },
          // 长度在3-10个字符之间
          { min: 2, max: 10, message: '肉肉：需要的长度在 2 到 10 个字符', trigger: 'blur' }
        ],
      },
      // 编辑按钮显示变量
      eidtDialogVisible:false,
      // 修改数据保存
      editForm:{
        roleName:'',
        roleDesc:'',
        
      },
      // 分配权限对话框变量
      setRightDialogVisible:false,
      // 保存所有权限列表数据
      rightsList:[],
      // 树形控件得属性绑定对象
      treeProps:{
        children:'children',
        label:'authName'
      },
      // 默认选中的节点id值数组
      defKeys:[],
      // 当前被点击分配权限的 角色id
      roleId:''
    }
  },
  created(){
    this.getRolesList()
  },
  methods: {
    // 请求角色列表
    getRolesList(){
      this.$http.get('roles').then(res => {
        // console.log(res)
        if(res.data.meta.status !== 200) return
        this.rolesList = res.data.data
        console.log(this.rolesList)

      })
    },
    // 对话框关闭之后 重置添加角色表单
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    // 点击添加按钮显示对话框
    showAddDialogVisible(){
      this.addDialogVisible = true
    },
    // 预验证 并且发送添加请求
    addRoles(){
        //预验证对话框
      this.$refs.addFormRef.validate(valid => {
        if(!valid) return this.$message.error('添加角色失败')
      // 提交数据 保存添加好的角色数据
        this.$http.post('roles',this.addForm).then(res => {
          console.log(res)
          if(res.data.meta.status !== 201) return this.$message.error('添加用户失败')
          // 成功请求数据 重新请求角色列表
          this.$message.success('添加角色成功')
          this.getRolesList()
          this.addForm = {}
          
        })
        // 关闭对话框
        this.addDialogVisible = false

      })
    },
    // 编辑按钮点击展示对话框
    showEidtDialog(data){
      this.eidtDialogVisible = true
      // 获取当前角色的信息
      this.editForm = data
      // console.log(this.editForm)
    },
    // 保存修改数据
    eidtRoles(){
      this.$refs.eidtFormRef.validate(valid => {
        if(!valid) return
        this.$http.put('roles/'+this.editForm.id,this.editForm).then(res => {
          console.log(res)
          if(res.data.meta.status !== 200) return this.$message.error('编辑失败')
          //编辑修改成功
          this.$message.success('修改角色成功')
          this.getRolesList()
          // 关闭对话框
          this.eidtDialogVisible = false
        })
      })
    },
    // 关闭修改对话框之后 重置表单
    eidtDialogClosed(){
      this.$refs.eidtFormRef.resetFields()
    },
    // 删除角色信息
    removeRolesById(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 根据用户id 发送请求 删除信息
          this.$http.delete('roles/'+id).then(res => {
            if(res.data.meta.status !== 200) return this.$message.error('删除角色失败')
            this.$message.success('删除成功!');
            // 重新请求数据  展示
            this.getRolesList()
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 根据id删除对应得权限
    removeRightById(roles,rightId){
        // 弹框提示用户是否需要删除
        console.log(roles)
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('roles/'+roles.id+'/rights/'+rightId).then(res => {
            console.log(res)
            if(res.data.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除权限成功')
            // 重新给角色下面得权限赋值
            roles.children = res.data.data
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
      

    },
    // 点击分配权限 打开对话框 
    showSetDialog(role){
      // 请求权限列表数据
      this.$http.get('rights/tree').then(res => {
        console.log(res)
        if(res.data.meta.status !== 200) return this.$message.error("请求权限列表失败")
        // 把请求到得树形数据 保存当前页
        this.rightsList = res.data.data

        // 这里调用递归方法 并且把保存id的数组传进来 role是从作用域插槽穿过来的角色
        this.getLeafKeys(role,this.defKeys)
        // 打开分配权限列表对话框
        this.setRightDialogVisible = true
      })

      // 保存当前被点击分配权限按钮的 角色id 并保存到外部 为修改角色权限的tree控件 发起请求使用
      this.roleId = role.id
     },
    //  通过递归的形式获取 角色下所有三级权限的id 并保存到数组中
    getLeafKeys(node,arr){
      // 判断是不是第三季节点 三级节没有children
      if(!node.children){
        // 说明是三级节点 直接将id添加进去
        return arr.push(node.id)
      }
      // 这里 说明不是三级几点 所以需要循环这个数组node.children
      node.children.forEach(item => {
        // 递归 再次调用此方法判断是不是三级节点
        // 这如果还不是第三层 就还会继续循环这一层节点的children数组
        // item为上一次节点循环出children数中的一个新的节点  if是递归出口
        this.getLeafKeys(item,arr)
      });
    },
    // 监听分配权限对话框的关闭事件 清空数组的id
    setRightDialogClosed(){
      this.defKeys = []
    },
    // 点击分配权限确定 提交权限API 为角色分配权限 保存提交权限数据
    allotRight(){
      // 设置一个保存选中节点和半节点的id
      const keys = [
        ...this.$refs.treeRef.
        getCheckedKeys(),
        ...this.$refs.treeRef.
        getHalfCheckedKeys()]
        // 把这个数组形成一个以逗号拼接的字符串
        const idStr = keys.join(',')
      // 调用API 为角色分配权限 发送请求
      // 根据发送请求的要求  需要传递角色id 就需要再点击分配按钮 从角色列表中
      // 保存当前被点击分配按角色的 id 到外部  这里请求时使用
      this.$http.post('roles/'+ this.roleId +'/rights',{rids:idStr}).then(res => {
        if(res.data.meta.status !== 200) return this.$message.error('分配权限失败')
        this.$message.success(res.data.meta.msg)
        this.getRolesList()
        this.setRightDialogVisible = false
      })
      
    } 
  }
}

</script>
<style scoped>
  .center{
    display: flex;
    align-items: center;
  }
  .el-tag{
    margin:7px;
  }
  .bdtop{
    border-top: 1px solid #eee;
  }
  .bdbottom{
    border-bottom: 1px solid #eee;
  }
</style>