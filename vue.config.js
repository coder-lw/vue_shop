module.exports={
  // 使用chaninWebpack 链式 修改打包入口文件的配置修改  指向的是一个函数（es6语法的箭头函数）
  chainWebpack:config => {
    // 做判断 当前处于开发模式  还是发布模式 

    // 发布模式
    config.when(process.env.NODE_ENV === 'production',config => {
      // 如果等于production则处于发布的模式 则继续执行下面的函数
      // config.entry('app')得到默认得打包入口（默认的时是main.js）此时在调用clear方法清空
      // 再通过add方法新增所需修改得 处于发布模式得打包入口文件
      config.entry('app').clear().add('./src/main-prod.js')

      // 通过externals节点加载外部CDN资源
      config.set('externals',{
        vue:'Vue',
        // 'vue-router':'VueRouter',
        axios:'axios',
        lodash:'_',
        echarts:'echarts',
        nprogress:'NProgress',
        // 'vue-quill-editor':'VueQuillEditor',
      })

      // 设置html插件 依据模式来定义isPord为真还是假
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })


    //开发模式
    config.when(process.env.NODE_ENV === 'development',config => {
      config.entry('app').clear().add('./src/main-dev.js')

      // 设置html插件 依据模式来定义isPord为真还是假
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })

  }
}




