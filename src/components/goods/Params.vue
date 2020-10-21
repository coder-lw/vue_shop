<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
       <!-- 警告信息 -->
       <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning" :closable="false"
          show-icon>
        </el-alert>
        <!-- 选择商品分类区域 -->
        <el-row class="cat_opt">
          <el-col>
            <span>选择商品分类: </span>
            <!-- 选择商品得级联选择框 -->
            <!-- options用来指定数据源 -->
            <!-- props 用来指定配置对象 -->
            <el-cascader
              v-model="selectedKeys" expand-trigger="hover"
              :options="cateList"
              :props="cascaderProps"
              @change="handleChange">
            </el-cascader>
          </el-col>

        </el-row>
        <!-- tab页签区域 -->
         <el-tabs v-model="activeName" @tab-click="handleClick">
           <!-- 添加动态参数得面板 -->
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="showBtutton" @click="addDialogVisible = true">添加参数</el-button>
          </el-tab-pane>

        <!-- name : many 和 only 对应得是请求数据时所需参数得名称  便于后期通过双向绑定得ativeName 来获取当前选中得name 来取对应得参数获取数据 -->

          <!-- 添加静态属性得面板 -->
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled='showBtutton' @click="addDialogVisible = true">添加属性</el-button>
          </el-tab-pane>
        </el-tabs>
        <!-- 动态参数表格区域 -->
        <el-table
          :data="manyTableData" border stripe v-if="activeName === 'many'"
          style="width: 100%">
          <!-- 展开行 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 循环渲染tag标签 -->
              <el-tag v-for="(item,i) in scope.row.attr_vals" closable @close="tagClosed(i,scope.row)" :key="i">{{item}}</el-tag>
              <!-- 输入得文本框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)">
              </el-input>
              <!-- 添加得按钮 -->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column  label="参数名称"  prop="attr_name">
          </el-table-column>
          <el-table-column  label="操作" >
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-eidt" size="mini" @click="showEidtDialog(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-search" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 静态参数表格区域 -->
        <el-table
          :data="onlyTableData" border stripe v-else
          style="width: 100%">
          <!-- 展开行 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 循环渲染tag标签 -->
              <el-tag v-for="(item,i) in scope.row.attr_vals" closable @close="tagClosed(i,scope.row)" :key="i">{{item}}</el-tag>
              <!-- 输入得文本框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)">
              </el-input>
              <!-- 添加得按钮 -->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column  label="属性名称"  prop="attr_name">
          </el-table-column>
          <el-table-column  label="操作" >
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-eidt" size="mini" @click="showEidtDialog(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-search" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

    </el-card>
    <!-- 添加参数得对话框 -->
    <el-dialog
      @close="addDialogClosed"
      :title="'添加'+ tittleText"
      :visible.sync="addDialogVisible"
      width="50%">
      <el-form :model="addForm" :rules="addFromRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="tittleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数得对话框 -->
    <el-dialog
      @close="eidtDialogClosed"
      :title="'修改'+ tittleText"
      :visible.sync="eidtDialogVisible"
      width="50%"
      >
      <el-form :model="eidtForm" :rules="eidtFromRules" ref="eidtFormRef" label-width="100px">
        <el-form-item :label="tittleText" prop="attr_name">
          <el-input v-model="eidtForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtParamsData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name:'Params',
  data(){
    return {
      // 商品分类列表
      cateList:[],
      // 级联选择框用来指定配置对象
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly:true
      },
      // 选中的父级分类的id数组  级联选择器双向绑定得值
      selectedKeys:[],
      // tabs 标签页 被激活得页签得名字
      activeName:'many',
      // 动态分类参数得保存
      manyTableData:[],
      // 静态分类参数得保存
      onlyTableData:[],
      // 添加对话框显示与隐藏
      addDialogVisible:false,
      // 添加参数得表单数据对象
      addForm:{
        attr_name:''
      },
      // 添加表单得验证规则对象
      addFromRules:{
        attr_name:[
          {required:true, message: '请输入参数名称',trigger:'blur'}
        ]
      },
      // 添加对话框显示与隐藏
      eidtDialogVisible:false,
      // 修改参数得表单数据对象
      eidtForm:{

      },
      // 修改表单得验证规则对象
      eidtFromRules:{
        attr_name:[
          {required:true, message: '请输入参数名称',trigger:'blur'}
        ]
      },
      

    }
  },
  created() {
    // 请求商品数据列表
    this.getCateList()
  },
  methods: {
    // 请求商品数据列表（所有得数据 都请求） 用作级联选择器使用
    getCateList(){
      this.$http.get('categories').then(res => {
        // console.log(res)
        if(res.data.meta.status !== 200) return this.$message.error('请求数据失败')
        this.$message.success('请求数据成功')
        this.cateList = res.data.data
      })
    },
    // 定义请求
    // 级联选择框 选中项变化会触发这个函数
    handleChange(){
      this.getParamsData()
    },
    // 标签tabs 点击切换时 触发得函数
    handleClick(){
      // console.log(this.activeName)
       this.getParamsData()
    },
    // 请求分类参数数据
    getParamsData(){
       // 设置只能选中第三级选项 否则就会清空
      // 证明选中得不是三级分类
      if(this.selectedKeys.length !== 3){
         this.selectedKeys = []
         // 如果级联选择器为空 就需要把表格数据源清空
          this.manyTableData = []
          this.onlyTableData = []
          return 
      }
      

      // 证明选中得是三级分类
      // console.log(this.selectedKeys)
      // 根据所选分类得id 和当前所处得面板 获取对应参数数据
      this.$http.get('categories/'+this.calcId+'/attributes',
      {params:{sel:this.activeName}}).then(res => {
        console.log(res)
        res.data.data.forEach(item => {
          // 控制文本框显示与隐藏得布尔值  为每一行数据得文本框都添加  防止多行数据联动 使个不影响
          item.inputVisible = false
          // 文本框输入得值  也是每一行数据互不影响 有自己得布尔值   value值
          item.inputValue = ""

          // 分割数据中得attr_vals 变为字符串得数组
          if(item.attr_vals !== ""){
            item.attr_vals = item.attr_vals.split(' ')
          }else{
            return item.attr_vals = []
          }
          
        })
        if(res.data.meta.status !== 200) return this.$message.error('获取参数列表失败')
        console.log(res.data.data)
        // 判断是哪种数据 保存到对应得外部数据存储中 便于渲染静态/动态参数 根据activname (activename对应请求数据得sel)
        if(this.activeName === 'many'){
          this.manyTableData = res.data.data
        }else{
          this.onlyTableData = res.data.data
        }
      })
    },
    // 关闭重置输入框
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    // 点击添加参数  提交 调接口
    addParamsData(){
      // 预验证
      this.$refs.addFormRef.validate(valid => {
        if(!valid) return
        this.$http.post('categories/'+this.calcId+'/attributes',{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        }).then(res => {
          console.log(res)
          if(res.data.meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.addDialogVisible = false
          this.getParamsData()

         
        })
      })
    },
    // 显示编辑对话框
    showEidtDialog(attr_id){
      this.$http.get('categories/'+this.calcId+'/attributes/'+attr_id,{
        params:{attr_sel:this.activeName}
      }).then(res => {
        console.log(res)
        if(res.data.meta.status !== 200) return this.$message.error('获取参数信息失败')
        this.eidtForm = res.data.data
        // console.log(this.eidtForm)
      })
      this.eidtDialogVisible = true
    },
    // 重置修改得表单
    eidtDialogClosed(){
      this.$refs.eidtFormRef.resetFields()
    },
    // 点击按钮 修改参数信息
    eidtParamsData(){
      this.$refs.addFormRef.validate(valid => {
        if(!valid) return
        this.$http.put('categories/'+this.calcId+'/attributes/'+this.eidtForm.attr_id,{cat_name:this.eidtForm.attr_name,
        attr_sel:this.activeName}).then(res => {
          console.log(res)
          if(res.data.meta.status !== 200) return this.$message.error('修改失败')
          this.$message.success('修改成功')
          this.eidtDialogVisible = false
          this.getParamsData()
        })
      })
    },
    // 根据id删除 API
    removeParams(attrid){
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('categories/'+this.calcId+'/attributes/'+attrid).then(res => {
            if(res.data.meta.status !== 200) return this.$message.error('删除失败')
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getParamsData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // tag标签关闭事件触发函数 删除对应得参数可选项
    tagClosed(i,row){
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    },
    // 点击tag确定显示输入框
    showInput(row){
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick方法得作用 就是当页面元素被重新渲染 才会执行回调函数中得代码
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 文本框失去焦点护或者按下enter键都会触发
    handleInputConfirm(row){
      // 判断输入框内容是否合法 输入框得值 去掉空格后得长度 等于0是不合法得
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return 则证明输入了正确得内容  需要做后续得处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ""
      row.inputVisible = false

      console.log(row)
      // 发送请求 编辑提交新增得参数名称
     this.saveAttrVals(row)
    },
    // 抽离出来得 修改参数得API 因为需要使用得频率大  所以抽离
    saveAttrVals(row){
       this.$http.put('categories/'+this.calcId+'/attributes/'+row.attr_id,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      }).then(res => {
        console.log(res)
        if(res.data.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
      })
    }
    
  },
  computed: {
    // 如果按钮需要被禁用则返回true 不需要则是false
    showBtutton(){
      if(this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中得三级分类得id 用来请求不同三级分类得数据 值是从数组里面取最后一项
    calcId(){
      if(this.selectedKeys.length === 3){
        return this.selectedKeys[2]
      }
      // 没有选中三级分类
      return null
    },
    // 对话框 添加动态参数/静态属性  动态计算标题得文本
    tittleText(){
      if(this.activeName === 'many'){
        return '动态参数'
      }else{
        return '静态属性'
      }
    }
  },
}
</script>
<style  scoped>
.cat_opt{
  margin: 15px 0;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 150px;
}
</style>