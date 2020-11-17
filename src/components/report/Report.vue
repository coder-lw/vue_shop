<template>
  <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 2、为echarts准备一个具备大小得DOM -->
      <div id="main" style="width:750px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
// 1、导入echarts
import echarts from 'echarts'
// 导入 lodash 使用上面得合并方法
import _ from 'lodash'
export default {

  name:'Report',
  data(){
    return {
      // 需要合并得数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
    
  },
  mounted() {
    // 此时页面上得dom元素已经被渲染完毕了 echarts只能在dom选完毕之后 进行实例化
    //3、 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

    // 发起请求获取图表数据
        this.$http.get('reports/type/1').then(res => {
          if(res.data.meta.status !== 200){
            return this.$message.error('获取折现图标数据失败')
          }
          console.log(res)
        //4、准备数据和配置项 指定图表的配置项和数据

        // 理由lodash得merge方法合并两个对象 并返回一个新得对象
        const result = _.merge(res.data.data,this.option)
        // 5、展示数据  调用myChart得 setOption 使用刚指定的配置项和数据显示图表
        myChart.setOption(result);
        })  
  },
  methods: {
    
    
  },
}
</script>