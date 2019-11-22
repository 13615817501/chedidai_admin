// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './axiosConfig/axiosConfig'
import 'normalize.css'
import 'iview/dist/styles/iview.css'
import '@/assets/css/common.less'
import xss from 'xss'
import 'element-ui/lib/theme-chalk/index.css'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import { Tree, Table as elTable,TableColumn,Radio} from 'element-ui'
import TreeTable from 'tree-table-vue'
Vue.use(Tree)
Vue.use(TableColumn)
Vue.use(Radio)
Vue.use(elTable)
Vue.use(TreeTable)
Vue.use(Viewer)

import { Cascader,Timeline,TimelineItem,Input, Upload,Message,Tabs,Tag,Col,Select,Button,Option,Tooltip,DatePicker, Avatar,Table,TabPane, 
	Row, Menu, MenuItem, Icon, Submenu, Modal , Form, FormItem,Page, Dropdown, DropdownMenu,DropdownItem,Breadcrumb,BreadcrumbItem,Transfer,Spin,Switch ,Progress} from 'iview';
Vue.component('Timeline', Timeline);
Vue.component('TimelineItem', TimelineItem);
Vue.component('Cascader', Cascader);
Vue.component('Button', Button);
Vue.component('i-switch', Switch);
Vue.component('i-progress', Progress);
Vue.component('Table', Table);
Vue.component('Tooltip', Tooltip);
Vue.component('Row', Row);
Vue.component('Col', Col);
Vue.component('Menu', Menu);
Vue.component('MenuItem', MenuItem);
Vue.component('Submenu', Submenu);
Vue.component('Spin', Spin);
Vue.component('Icon', Icon);
Vue.component('Upload', Upload);
Vue.component('Modal', Modal);
Vue.component('Transfer', Transfer);
Vue.component('Form', Form);
Vue.component('Option', Option);
Vue.component('Tag', Tag);
Vue.component('Breadcrumb', Breadcrumb);
Vue.component('BreadcrumbItem', BreadcrumbItem);
Vue.component('Select', Select);
Vue.component('Page', Page);
Vue.component('FormItem', FormItem);
Vue.component('Input', Input);
Vue.component('Tabs', Tabs);
Vue.component('DatePicker', DatePicker);
Vue.component('TabPane', TabPane);
Vue.component('Avatar', Avatar);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('DropdownItem', DropdownItem);


Vue.prototype.$Message = Message;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
