<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe vueShop-api-server max-height="500">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0' ">一级</el-tag>
              <el-tag v-else-if="scope.row.level === '1' " type="success">二级</el-tag>
              <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name:'Rights',
  data(){
    return {
      // 保存请求到的数据 所有的权限列表
      rightsList:[]
    }
  },
  created() {
    this.getRightsList()
  },
  methods:{
    // 请求权限列表数据
    getRightsList(){
      this.$http.get('rights/list').then(res => {
        console.log(res)
        if(res.data.meta.status !== 200 ) return
        // 请求成功保存数据
        this.rightsList = res.data.data
        console.log(this.rightsList)
      })
    }
  }
}
</script>