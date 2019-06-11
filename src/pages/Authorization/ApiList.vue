<template>
    <div id="apiList">
        <Breadcrumb>
	        <BreadcrumbItem>组织管理</BreadcrumbItem>
	        <BreadcrumbItem>权限管理</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                选择角色: 
                <RoleSelect @get-roleId="getroleId"></RoleSelect>
            </span>
            <Button type="primary" icon="ios-document-outline" style="margin-left:15px;" @click="saveBtn">保存</Button>
		    <Button type="primary" icon="ios-repeat" style="margin-left:15px;" @click="resetBtn">重置</Button>
	    </div>  
	    <div>
	        <span class="bottom-comm bottom-left">
		    	<h3>接口管理</h3>
		    	<div style="margin-left: 50px;">
		    	    <Transfer :list-style="{'min-height':'400px','max-height':adjustHeight+'px','min-width':'220px'}" :data="apiData" :target-keys="targetApiKeys" filterable :filter-method="filterMethod" @on-change="handleChange"></Transfer>
		    	</div>
	    	</span>
	    	<span class="bottom-comm">
		    	<h3>权限树</h3>
		    	<!-- <div v-if="!certifyList.length">暂无数据</div> -->
		    	<div :style="{'margin-left':'50px','padding-right':'50px','max-height':adjustHeight+'px','overflow-y':certifyList.length?'auto':'visible'}">
				    <el-tree ref="tree" :data="certifyList" empty-text="无" show-checkbox :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false" :highlight-current="true">
				        <span class="custom-tree-node" slot-scope="{ node, data }">
				            <span>{{ node.label }}</span>
				        </span>
				    </el-tree>
                </div>
	    	</span>
	    </div>
    </div>
</template>
<script>
    import RoleSelect from '@/components/RoleSelect'  //拒绝理由列表模块
	export default {
	    name: 'ApiList',
	    props:[],
	    data () {
		    return {
		    	roleId:'',
                certifyList:[],
                apiData: [],
                targetApiKeys: [], //选中的接口选项即可
                targetMenuKeys:[], //选中的菜单选项即可
                adjustHeight: '',
                defaultProps:{
					label(data,node){
					    return data.alias;
					}
				}
		    }
	    },
		components: {
			RoleSelect
		},
	    watch: {},
	    activated(){
            var _this = this;
            window.onresize = function(){ // 定义窗口大小变更通知事件
                _this.adjustHeight = document.body.clientHeight-340; //窗口高度
            };
        },
		methods: {
		    handleChange (newTargetKeys, direction, moveKeys) {
		    	console.log(newTargetKeys);
                this.targetApiKeys = newTargetKeys;
            },
            saveBtn(){
                let menus = this.$refs.tree.getCheckedKeys();
                let formData = {
                	roleId: this.roleId,
                	menus: menus?menus.join(','):'',
                	itfs: this.targetApiKeys?this.targetApiKeys.join(','):''
                }
                this.$axios.post('/fx?api=gate.auth.authModify',formData).then(res => {
			    	if(res!=500){
						this.$Message.success('保存成功');
			    	}
				})    
            },
            resetBtn(){
                this.targetApiKeys = [];
                this.$refs.tree.setCheckedKeys([],true);
            },
            filterMethod (data, query) {
                return data.alias.indexOf(query) > -1;
            },
            getroleId(roleId){
                this.$axios.get('/fx?api=gate.auth.authQuery',{params:{roleId:roleId}}).then(res => {
			    	if(res!=500){
			    		this.roleId = roleId;
						this.apiData = res.intf;
						let menu = res.menu;
						this.targetApiKeys = [];
						this.targetMenuKeys = [];
						
						//处理api相关
						if(this.apiData.length){
                            this.apiData.forEach((item)=>{
								item.key = item.id;   //组件只能识别 key label
								item.label = item.alias;
								if (item.mark == 1) {
									this.targetApiKeys.push(item.id);
								}
							});
						}

						//处理菜单相关
						if(menu){
                            this.certifyList = menu.children;
							let fun = (children) => {
								children.forEach((item) => {
									if (item.visual == 1) {
									    this.targetMenuKeys.push(item.id);
									}
								    if (item.children && item.children.length) {
									    fun(item.children);
									}
								});
							}
                            fun(this.certifyList);
							if(this.targetMenuKeys.length){
                                this.$refs.tree.setCheckedKeys(this.targetMenuKeys, true);
							}else{
								this.$refs.tree.setCheckedKeys([], true);
							}
						}
						this.$nextTick(() => {
						    this.adjustHeight = document.body.clientHeight-340; //窗口高度
					    });
			    	}
				})     
            }
		}
    }
</script>
<style lang="less" scoped>
    #apiList{
    	padding-top: 20px;
    }
    h3{
        margin: 30px 0;
    }
    .bottom-comm{
    	display: inline-block;
    	vertical-align: top;
    }
    .bottom-left{
    	margin-right: 150px;
    }
</style>