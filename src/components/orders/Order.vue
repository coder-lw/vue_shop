<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框 栅格 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="queryInfoDate" ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是都发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="">
          <template v-slot="scope">
           {{scope.row.create_time*1000 | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 编辑按钮 修改地址 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
            <!-- 查看物流信息按钮 -->
            <el-button type="success" icon="el-icon-location-outline" size="mini" @click="showProcessDialog(scope.row.user_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog
      title="修改地址" @close="editDialogClosed"
      :visible.sync="editDialogVisible"
      width="50%">
      <!-- form表单 带验证规则 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
           <el-cascader
            v-model="editForm.address1"
            :options="cityDate"
            @change="handleChange"></el-cascader>
        </el-form-item>
        <!-- 级联选则器 -->
        <el-form-item label="活动名称" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框@close="processDialogClosed" -->
      <el-dialog
      title="物流进度" 
      :visible.sync="processDialogVisible"
      width="50%">
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in processData"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityDate from './cityDate'
export default {
  name:'Order',
  data(){
    return {
      // 查询信息
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5
      },
      //分页 总数据条数
      total:0,
      // 订单列表数组
      orderList:[],
      // 编辑对话显示隐藏
      editDialogVisible:false,
      // 编辑表单对象
      editForm:{
        // 三级联动数据
        address1:[],
        address2:''
      },
      cityDate:cityDate,
      // 验证规则对象
      editFormRules:{
        address1:[
          {required:true, message: '请选择省市区县',trigger:'blur'}
        ],
        address2:[
          {required:true, message: '请填写详细地址',trigger:'blur'}
        ]
      },
      // 物流进度对话框
      processDialogVisible:false,
      // 物流信息数据
      processData:[],
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单页面数据
    getOrdersList(){
      this.$http.get('orders',{params:this.queryInfo})
      .then(res => {
        console.log(res)
        if(res.data.meta.status !== 200){
          return this.$message.error('获取订单列表失败')
        }
        this.$message.success('获取订单列表成功')
        // 保存请求得到得订单列表到外部数据中 给table表格使用
        this.orderList = res.data.data.goods
        //分页 总数据条数
        this.total = res.data.data.total
        console.log(this.orderList)
      })
    },
    // 输入框点击所搜查询信息点击按钮
    queryInfoDate(){
      // 依据输入框信息 重新发起请求数据 来到底查询数据得目的
      // this.getOrdersList()
    },
    // 当前分页每页显示条数改变时触发  并且返回最新得当前每页展示数据条数
    handleSizeChange(newPagesize){
      // 赋值给用来查询得外部保存当前显示数据条数的变量
      this.queryInfo.pagesize = newPagesize
      // 拿到新的显示条数重新请求数据
      this.getOrdersList()
    },
    // 当前得页得页数改变时触发 并且返回最新得当前选中页数
    handleCurrentChange(newPagenum){
      this.queryInfo.pagenum = newPagenum
      this.getOrdersList()
    },
    // 显示编辑对话框 并作后续处理
    showEditDialog(){
      // 显示编辑对话框
      this.editDialogVisible = true

    },
    // 级联选择器发生变化 触发得函数
    handleChange(){

    },
    // 对绘框关闭重置表单
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    // 显示物流进度对话框
    showProcessDialog(){
      this.processDialogVisible = true
      // 获取物流信息
      this.$http.get('/kuaidi/1106975712662').then(res => {
        
        if(res.data.meta.status !== 200) return this.$message.error('获取物流信息失败')
        console.log(res)
        this.processData = res.data.data
      })
    }
  },
}
</script>
<style scoped>
  
</style>