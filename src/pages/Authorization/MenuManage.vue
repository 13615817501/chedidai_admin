<template>
    <div id="menuManage">
        <Breadcrumb>
	        <BreadcrumbItem>权限设置</BreadcrumbItem>
	        <BreadcrumbItem>菜单管理</BreadcrumbItem>
	    </Breadcrumb>
        <div class="my-tree" :style="{'height':adjustHeight+'px'}">
		    <el-tree ref="tree" :data="certifyList" node-key="name" default-expand-all :props="defaultProps" :expand-on-click-node="false" :highlight-current="true">
		      <span class="custom-tree-node" slot-scope="{ node, data }"><span>{{ node.label }}</span></span>
		    </el-tree>
        </div>
    </div>
</template>
<script>
	export default {
	    name: 'component_name',
	    props:[],
		data() {
			return {
				certifyList:[],
				showCheck: false, //默认不显示复选框
				// checkedKeys:['Index','Authorizatio','MenuManage','RoleManage','ApiList','AdminList','Custom','AllCustomList','Cusback','Loan','RefuseOrder','WaitingAuditing','WaitingLoan','WaitingRepayment','CountQuery','OrderQuery','LoanList','RepaymentList','LoanCount','RepaymentCount','ChannelCount','Collection','WaitingCollection','CollectionBack','CollectionSettle','CollectionList','Channel','AddChannelList','ChannelQuery','TodayChannelCount','ConfigManage','RateParams','Business','HomeBanner'],
				adjustHeight: document.body.clientHeight-250,
				defaultProps:{
					label(data,node){
					    return data.alias;
					}
				}
			}
		},
	    watch: {
	    },
	    created(){ 
            this.getInitialList();
	    },
	    activated(){
            this.getInitialList();
            var _this = this;
            window.onresize = function(){ // 定义窗口大小变更通知事件
                _this.adjustHeight = document.body.clientHeight-280; //窗口高度
            };
	    },
		methods: {
			getInitialList() { //获取拒绝订单列表
				this.$axios.get('/fx?api=gate.auth.menuTree').then(res => {
					if (res != 500) {
						let children =  res.children;
						this.certifyList = children;
						this.$nextTick(() => {
						    this.adjustHeight = document.body.clientHeight-280; //窗口高度
					    });
					}
				})
			},
			// handleDrop(draggingNode, dropNode, dropType, ev) {
			// 	console.log('拖拽完成: ', draggingNode.data.id,dropNode.parent.key,dropNode.label, dropType);
			// }
		},
    }
</script>
<style lang="less" scoped>
    #menuManage{
    	padding-top: 20px;
    }
    .my-tree{
        margin: 30px;
        overflow-y: auto;
    }
</style>