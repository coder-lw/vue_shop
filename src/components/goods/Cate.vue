<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加分类按钮 -->
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
       <tree-table :data="cateList"
                    class="tree-table"
                   :selection-type="false" border :show-row-hover="false"
                   :expand-type="false" show-index index-text="#"
                   :columns="columns">
        <!-- 自定义是否有效模板列 -->
        <template slot="isOk" slot-scope="scope">
                 <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
                 <i class="el-icon-error" v-else></i>     
        </template>
        <!-- 自定义排序模板列 -->
        <template slot="order" slot-scope="scope">
                 <el-tag v-if="scope.row.cat_level === 0">一级</el-tag> 
                 <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
                 <el-tag v-else type="warning">三级</el-tag> 
        </template>
        <!-- 自定义操作模板列 -->
        <template slot="control" slot-scope="scope">
                 <!-- 编辑 -->
                 <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEidtDialogVisible(scope.row.cat_name,scope.row.cat_id)">编辑</el-button>
                 <!-- 删除 -->
                 <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
        </template>


       </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagesize"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="querInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分分类的对话框 -->
    <el-dialog
      @close="addCateDialogClosed"
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%">
      <el-form  :model="addCateForm" ref="addFormRef" :rules="addFormRules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
           <el-cascader
              v-model="selectedKeys" clearable
              :props="cascaderProps "
              :options="parentCateList"
              @change="parentCateChanged"
              expand-trigger = 'hover' 
              >
           </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="eidtDialogVisible"
      width="50%">
      <el-form ref="form" :model="eidtForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="eidtForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Cate',
  data(){
    return {
      querInfo:{
        // 获取到几级分类
        type:3,
        // 获取第几页数据 不选默认全选
        pagenum:1,
        // 每页显示几条数据
        pagesize:5,
      },
      // 当前的数据列表
      cateList:[],
      // 总数居条数
      total:0,
      // 为table指定列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        // 是否有效
        {
          label:'是否有效',
          // 表示将当前列定义为模板列
          type:'template',
          // 表示 当前这一列的使用模板的名称
          template:'isOk'
        },
        // 排序
        {
          label:'排序',
          // 表示将当前列定义为模板列
          type:'template',
          // 表示 当前这一列的使用模板的名称
          template:'order'
        },
        // 操作
        {
          label:'排序',
          // 表示将当前列定义为模板列
          type:'template',
          // 表示 当前这一列的使用模板的名称
          template:'control'
        },

      ],
      // 显示对话框保存的布尔 变量
      eidtDialogVisible:false,
      // 表单双向绑定对象
      eidtForm:{
        cat_name:'',
        id:''
      },
      // 田间分类对话框显示
      addDialogVisible:false,
      // 添加分类 绑定数据对象
      addCateForm:{
        // 将要添加的分类名称
        cat_name:'',
        // 父级分类的id 0是代表1级
        cat_pid:0,
        // 当前分类的等级 默认添加了一级分类
        cat_level:0
      },
      // 添加分类 验证规则对象
      addFormRules:{
        cat_name:[
          { required: true, message: '肉肉：请输入分类名称', trigger: 'blur' },
          // 长度在3-10个字符之间
          { min: 1, max: 10, message: '肉肉：需要的长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类名称列表
      parentCateList:[],
      // 指定级联选择器的配置对象
      // value:具体选中的属性 label:你所看到的属性  children:父子嵌套的节点
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly:true
      },
      // 选中的父级分类的id数组
      selectedKeys:[],
    }
  },
  created() {
    this.getGoodsList()
  },
  methods:{
    // 请求商品数据
    getGoodsList(){
      this.$http.get('categories',{params:this.querInfo}).then(res => {
        console.log(res.data.data)
        if(res.data.meta.status !== 200) return this.$message.error('请求数据失败')
        this.$message.success('请求分类列表数据成功')
        // 把请求到的数据  保存到外部变量 以便使用
        this.cateList = res.data.data.result
        // 为总数据条数赋值
        this.total = res.data.data.total
        console.log(this.cateList)
      })
    },
    // 监听pagesize改变的事件 可以拿到最新的pagesize值 new是来接受最新的值
    handleSizeChange(newSize){
      // 赋值给外部用来查询请求数据的 pagesize
      this.querInfo.pagesize = newSize
      // 用用户操作的新的参数值 去请求数据列表
      this.getGoodsList()
    },
    // 监听pagenum的改变  可以拿到最新的页码值
    handleCurrentChange(newPage){
     // 赋值给外部用来查询请求数据的 pagenum
     this.querInfo.pagenum = newPage
     // 用用户操作的新的参数值 去请求数据列表
     this.getGoodsList() 
    },
    // 点击编辑显示对话框
    showEidtDialogVisible(cat_name,id){
      this.eidtDialogVisible = true
      // 把当前点击分类名称保存到外部数据中存储 共表单使用
      this.eidtForm.cat_name = cat_name
      this.eidtForm.id = id
    },
    // 提交编辑数据 API请求
    eidtCate(){
      this.$http.put('categories/'+this.eidtForm.id,this.eidtForm).then(res => {
        console.log(res)
        if(res.data.meta.status !== 200) return this.$message.error('编辑提交失败')
        this.$message.success('提交成功')
        this.eidtDialogVisible = false
        this.getGoodsList()
      })
    },
    // 展示添加分类对话框
    showAddDialog(){
      // 先获取父级分类的数据列表
      this.getParentCateList()

      this.addDialogVisible = true
    },
    // 获取父级分类的数据列表
    getParentCateList(){
      // 获取前两级的分类
      this.$http.get('categories',{ params : {type : 2} }).then(res => {
        console.log(res)
        if(res.data.meta.status !== 200) return this.$message.error('获取父级分类列表失败')
        this.parentCateList = res.data.data
      })
    },
    // 选择项发生变化触发函数  将添加分类得表单数据处理完毕 用作实时得参数保存到 方便后续得请求时所需要得参数
    parentCateChanged(){
      console.log(this.selectedKeys)
      // 如果selectedKeys数组中的 length大于0，选中的父级分类
      // 反之就说明没有选中任何父级分类 为1级
      // 永远选中最后一项当做父分类的id
      if(this.selectedKeys.length > 0){
        // 父级分类的id 
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 因为level值和数组的length保持一致
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{
        // 说明是1级 就需要将cat_pid 父id重置成0
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 提交添加分类
    addCate(){
      console.log(this.addCateForm)
      // 设置与验证 通过之后 请求
      this.$refs.addFormRef.validate(valid => {
        if(!valid) return
        // 发起请求 添加新的分类  验证通过
        this.$http.post('categories',this.addCateForm).then(res => {
          console.log(res)
          if(res.data.meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加分类成功')
          this.getParentCateList()
          this.addDialogVisible = false
        })
      })
      

    },
    // 监听对话框得关闭事件  重置表单
    addCateDialogClosed(){
      this.$refs.addFormRef.resetFields()
      // 清空和级联选中器双向绑定得数组
      this.selectedKeys = []
      // 将表单中得cart_lever 和 cate_id设置为0 目的便于之后得做判断
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 删除商品分类 根据id
    removeCateById(id){
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('categories/'+id).then(res => {
            console.log(res)
            if(res.data.meta.status !== 200) return this.$message.error('删除失败')
              this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getGoodsList()
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
}
</script>
<style scope>
.tree-table{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
  
</style>