<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示信息 -->
       <el-alert
        title="添加商品信息"
        type="info"
        center :closable="false"
        show-icon>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs标签页 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
      label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'"  v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked" >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop='goods_name'>
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop='goods_price' >
            <el-input v-model="addForm.goods_price" type='number'></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop='goods_weight' >
            <el-input v-model="addForm.goods_weight" type='number'></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop='goods_number' >
            <el-input v-model="addForm.goods_number" type='number'></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop='goods_cat'>
            <!-- 级联选择器 -->
           <el-cascader
            v-model="addForm.goods_cat"
            :options="cateList"
            :props="cascaderProps" 
            @change="handleChange">
           </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1" max-height="600px">
          <!-- 渲染表单得item项 -->
          <el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id" >
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="item1" v-for="(item1,i) in item.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item v-for="item in onlyTableDate" :label="item.attr_name" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <!-- action:上传图片是请求得接口 on-preview:点击图片 list-type：值不同 组件效果不同
          指定预览事件得 on-remove:单机叉号得时候处理得函数 file-list：文件列表-->
          <el-upload
            :action="uploadURL" :headers="headerObj"
            :on-preview="handlePreview"
            :on-remove="handleRemove" :on-success="handleSuccess"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器组件 -->
          <!-- 内容双向绑定再需要提交得表单中 -->
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <!-- 添加商品得按钮 -->
          <el-button type="primary" @click="addGoods" class="btnAdd">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
      
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览" @close="dialogVisible = false"
      :visible.sync="dialogVisible"
      width="50%">
      <img :src="imagePath" alt="" class="image">
    </el-dialog>
  </div>
</template>
<script>
// 此包里面有深拷贝方法
import _ from 'lodash'
export default {
  name:'Add',
  data(){
    return {
      // 进度条激活索引
      activeIndex: '0',
      addForm:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        // 商品所属分类得数组
        goods_cat:[],
        // 商品得详情描述
        goods_introduce:'',
        // 图片得数组
        pics:[],
        attrs:[]
      },
      addFormRules:{
        goods_name:[
          {required:true, message: '请输入商品名称',trigger:'blur'}
        ],
        goods_price:[
          {required:true, message: '请输入商品价格',trigger:'blur'}
        ],
        goods_weight:[
          {required:true, message: '请输入商品重量',trigger:'blur'}
        ],
        goods_number:[
          {required:true, message: '请输入商品数量',trigger:'blur'}
        ],
        goods_cat:[
          {required:true, message: '请选择商品分类',trigger:'blur'}
        ]
      },
      // 分类列表数据
      cateList:[],
      // 级联选择器配置
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover'
      },
      // 分类 动态参数列表数据
      manyTableDate:[],
      // 静态属性列表数据
      onlyTableDate:[],
      // 图片上传得URL地址
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件得headers请求头对象
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      // 图片预览布尔
      dialogVisible:false,
      // 当前图片得地址
      imagePath:'',
    }
  },
  created() {
    this.getCateList()
  },
  methods:{
    // 获取分类列表数据
    getCateList(){
      
      this.$http.get('categories').then(res => {
        // console.log(res)
        if(res.data.meta.status !== 200) return this.$message.error('获取失败')
        this.cateList = res.data.data
      })
    },
    // 级联选择器内容改变时出来函数
    handleChange(){
      if(this.addForm.goods_cat.length !== 3){
        this.addForm.goods_cat= []
      }
      // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      console.log(this.addForm.goods_cat)
    },
    // 点击tabs切换之前得处理函数 拿到两个参数 来时得面板名字 和将要去得名字
    beforeTabLeave(activName,oldActiveName){
      // 如果原标签得名字等于0，并且级联选择器得长度值为3 则放行 return true  否则返回false
      if(oldActiveName === '0' && 
        this.addForm.goods_cat.length !== 3){
        // 需要保证离开时得位置是第一页 只有此位置有级联选择器 剩下得都是被保存得
        console.log(this.addForm.goods_cat.length)
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 点击tab事件 请求参数数据 因为是参数 所以指定sel是many
    tabClicked(){
     if(this.activeIndex === '1'){
        this.$http.get('categories/'+this.cateId+'/attributes',{params:{sel:'many'}})
        .then(res => {
          if(res.data.meta.status !== 200) return this.$message.error('获取商品参数失败')
          // 对数据中得数组 里面 每一个数组里attr_vals用空格分割成一个数组 便于渲染
          res.data.data.forEach(item => {
            if(item.attr_vals.length !== 0){
              item.attr_vals = item.attr_vals.split(' ')
            }
            return []
          })
          // 保存到外部为渲染表格使用
          this.manyTableDate = res.data.data
          console.log(this.manyTableDate)
        })
     }else if(this.activeIndex === '2'){
       this.$http.get('categories/'+this.cateId+'/attributes',{params:{sel:'only'}})
        .then(res => {
          if(res.data.meta.status !== 200) return this.$message.error('获取静态属性失败')
          // 对数据中得数组 里面 每一个数组里attr_vals用空格分割成一个数组 便于渲染
          // res.data.data.forEach(item => {
          //   if(item.attr_vals.length !== 0){
          //     item.attr_vals = item.attr_vals.split(' ')
          //   }
          //   return []
          // })
          // 保存到外部为渲染表格使用
          this.onlyTableDate = res.data.data
        })
     }
    },
    //处理图片预览效果
    handlePreview(file){
      // 显示对话框
      this.dialogVisible = true
      console.log(file)
      this.imagePath = file.response.data.url
    },
    // 处理移除图片得操作 file是钩子函数触发时返回得图片文件对象 里面存放图片得临时地址
    handleRemove(file){
      console.log(file)
      // 1、获取将要删除得图片得临时路径
      const filePath = file.response.data.tmp_path
      // 2、从pics数组中，找到在这个图片对应得索引值
      const index =  this.addForm.pics.findIndex(x => {
        x.pic === filePath
      })
      // 调用数组得splice方法 把图片信息对象 从pic数组中移除
      this.addForm.pics.splice(index,1)
      console.log(this.addForm)
    },
    // 监听图片上传成功时触发得钩子函数 内部返回一个服务器响应得数据response对象
    handleSuccess(response){
      // 1、先拼接得到一个图片信息对象
      const picInfo = {pic:response.data.tmp_path}
      // 2、将图片push到数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加商品 完成进度条 调用API提交添加得商品 跳转商品页 重新加载页面数据
    addGoods(){
      // 预验证表单
      this.$refs.addFormRef.validate(valid => {
        if(!valid) {
          return this.$message.error('请填写必要得表单项目')
        }
        // 执行添加得业务逻辑
        // 处理添加商品API之前得 数据
        // 1、goods_cat  以逗号 分割得字符串 级联选择器要求得是数组 提交需要字符串  需要做深拷贝
        // 深拷贝
        const form =  _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        console.log(form)

        // 2、处理数组 循环动态参数数组 和静态属性数组
        // 处理动态参数
        this.manyTableDate.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals !== '' ? item.attr_vals.join(' ') : ''
          }
          // 添加到数组中
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableDate.forEach((item) => {
          // console.log(item)
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          // 添加到数组中
          this.addForm.attrs.push(newInfo)
          console.log(newInfo)
        })

        // 赋值给拷贝得对象上
        form.attrs = this.addForm.attrs
        console.log(form)
        console.log(this.addForm.attrs)

        // 发起请求添加商品
        // 商品得名称必须是唯一得
        this.$http.post('goods',form).then(res => {
          console.log(res)
          if(res.data.meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加商品成功')
          // 跳转到商品列表页
          this.$router.push('/goods')
        })
      })
    }
  },
  computed: {
    // 当前选中得三级分类id
    cateId(){
      // 如果这个数组长度为3说明有三级分类id 返回数组中得第三项
      if(this.addForm.goods_cat.length === 3){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
}
</script>
<style scoped>
.el-cascader{
  width:200px !important;
}
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
.image{
  width: 100%;
  height: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>