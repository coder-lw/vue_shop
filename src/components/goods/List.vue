<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getGoodsList()" clearable>
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGood">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价值" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="" width="140px">
          <template slot-scope="scope">
            {{scope.row.upd_time*1000 | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name:'List',
  data(){
    return {
      // 查询参数对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      // 商品列表
      goodsList:[],
      // 总条数
      total:0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页 获取商品列表数据
    getGoodsList(){
      this.$http.get('goods',{params:this.queryInfo}).then(res => {
        console.log(res)
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
        
      })
    },
    // 
    handleSizeChange(pageSize){
      this.queryInfo.pagesize = pageSize
      this.getGoodsList()
    },
    // 
    handleCurrentChange(paGenum){
      this.queryInfo.pagenum = (paGenum)
      this.getGoodsList()
    },
    // 根绝id删除数据
    removeById(id){
        this.$confirm('此操作将永久删除该商品数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('goods/'+id).then(res => {
            console.log(res)
            if(res.data.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getGoodsList()
            
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 点击添加按钮 跳转至添加商品页面
      goAddGood(){
        this.$router.push('goods/add')
    }
   
    },
    
}
</script>
<style  scoped>

</style>