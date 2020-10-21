import Vue from 'vue'
import {Form, FormItem,Input,Message,Button,Container,
        Header,Aside,Main,Submenu,MenuItem,MenuItemGroup,
        Menu,Breadcrumb,BreadcrumbItem,Card,Row,Col,TableColumn,
        Table,Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,
        Tree,Select,Option,Cascader,Alert,Tabs,TabPane,Steps,Step,
        CheckboxGroup,Checkbox,Upload,Timeline,TimelineItem
      
      } from 'element-ui'

Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Tabs)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Dialog)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Menu)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tag)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(TableColumn)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Tree)
Vue.use(Upload)
Vue.use(TimelineItem)
Vue.use(Timeline)


// 挂载到了原型上  每一个组件通过this都额可以访问的到
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
