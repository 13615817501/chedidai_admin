<template>
    <div id="roleManage">
        <Breadcrumb>
	        <BreadcrumbItem>权限设置</BreadcrumbItem>
	        <BreadcrumbItem>角色管理</BreadcrumbItem>
	    </Breadcrumb>
        <div class="my-tree" :style="{'height':adjustHeight+'px'}">
		    <el-tree ref="tree" :data="certifyList" node-key="name" :props="defaultProps" default-expand-all :expand-on-click-node="false" :highlight-current="true" :default-checked-keys="checkedKeys">
		        <span class="custom-tree-node" slot-scope="{ node, data }">
		            <span>{{ node.label }}</span>
		           <!--  <span style="display:inline-block;margin-left:25px;">
	                    <Button type="text" style="font-size: 12px;" icon="md-add"  title="添加" @click="addTbn(data,node)"></Button>
	                    <Button type="text" style="font-size: 12px;" icon="ios-trash-outline"  title="删除" @click="deleteTbn(node,data)"></Button>
                    </span> -->
		        </span>
		    </el-tree>
        </div>
        <CommonTipModal :modal="modalTip" @cancel="cancel" :modalTipTitle="modalTipTitle" @comfirmBtn="tipComfirmBtn" :adminId="id">
        	<div style="text-align:center">
	            <p>确定删除该角色吗?</p>
	        </div>
        </CommonTipModal>
        <Modal v-model="modalAddRole" title="添加角色" width="360" :mask-closable="false">
	        <div style="margin:15px 0;">
	        	<span class="role-comm">角色标识(唯一)：</span>
	            <Input v-model="addRole.name" style="width:50%;" placeholder="推荐英文如:java_developer"/>
	        </div>
	        <div style="margin:15px 0;">
	        	<span class="role-comm">角色别名：</span>
	            <Input v-model="addRole.alias" style="width:50%;" placeholder="请输入角色别名(用于展示)"/>
	        </div>
	        <div slot="footer">
	            <Button type="primary" :loading="modal_loading" @click="addRoleBtn">确定</Button>
	            <Button @click="cancel">取消</Button>
	        </div>
        </Modal>
    </div>
</template>
<script>
    import CommonTipModal from '@/components/CommonTipModal'
	export default {
	    name: 'component_name',
	    props:[],
		data() {
			return {
				id:'', //当前的ID值
				modal_loading: false,
				modalTipTitle:'删除该角色',
				modalTip:false,
				modalAddRole: false, //默认不显示添加框
				triggerCurrenNodeData:'',
				triggerCurrenNode:'',
				showCheck: false, //默认不显示复选框
				certifyList: [],
				checkedKeys:[], //默认勾选所有的角色
				children: [],
				adjustHeight: document.body.clientHeight-250,
				addRole:{
					name:'',
					alias:''
				},
				defaultProps:{
					label(data,node){
					    return data.alias;
					}
				}
			}
		},
		components:{
		    CommonTipModal
	    }, 
	    watch: {
	    },
	    created(){ 
            this.getInitialList();
	    },
	    activated(){ //组件激活时候触发
            this.getInitialList();
            var _this = this;
            window.onresize = function(){ // 定义窗口大小变更通知事件
                _this.adjustHeight = document.body.clientHeight-250; //窗口高度
            };
	    },
		methods: {
			getInitialList() { 
				this.$axios.get('/fx?api=gate.auth.roleTree').then(res => {
					if (res != 500) {
						let children =  res.children;
						this.certifyList = children;
						let fun = (children)=>{
							children.forEach((item) => {
								if(item.visible == 1){
									this.checkedKeys.push(item.id);
								}
								if(item.children && item.children.length){
                                    fun(item.children);
								}
							});
						}
						fun(children);
						this.$refs.tree.setCheckedKeys(this.checkedKeys,true);
						this.$nextTick(() => {
						    this.adjustHeight = document.body.clientHeight-280; //窗口高度
					    });
					}
				})
			},
			// handleDrop(draggingNode, dropNode, dropType, ev) {
			// 	console.log('拖拽完成: ', draggingNode.data.id,dropNode.parent.key,dropNode.label, dropType);
			// },
			addTbn(d,n) {
				this.id = d.id;
				this.modalAddRole = true;
			},
			deleteTbn(d,n) {
				this.id = d.id;
				this.modalTip = true;
			},
			cancel(){
	        	this.modalTip = false;
	        	this.modalAddRole = false;
				this.addRole = {
					name: '',
					alias: ''
				};
            },
            tipComfirmBtn(){
            	this.modalTip = false;
            	if(res!=500){
                    this.$Message.success('删除成功');
                    this.getInitialList();
            	}

            },
            addRoleBtn(){
            	if(!this.addRole.name || !this.addRole.alias){
                    return this.$Message.warning('请填写完整信息');
				}
				let formData = {
					...this.addRole,
					type: 2,
					parentNodeId: this.id,
                    upSortId: -1
				}
				this.$axios.post('/fx?api=gate.auth.addTreeNode',formData).then(res => { 
					if(res!=500){
						this.addRole = {
                            name:'',
					        alias:''
						};
                        this.$Message.success('添加成功');
                        this.getInitialList();
                    }
					this.modal_loading = false;
					this.modalAddRole = true;
				})
            }
		}
    }
</script>
<style lang="less" scoped>
    #roleManage{
    	padding-top: 20px;
    }
    .my-tree{
        margin: 30px;
        overflow-y: auto;
    }
    .ivu-btn-text{
    	outline: none;
    	box-shadow: none;
        padding-left:5px;
        padding-right:5px;
    }
    .ivu-btn-text:hover{
    	background-color: transparent;
        
    }
    .role-comm{
        display: inline-block;	
        width: 100px;
        margin-left: 10px;
    }
</style>
