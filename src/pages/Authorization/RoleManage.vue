<template>
    <div id="roleManage" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>组织管理</BreadcrumbItem>
	        <BreadcrumbItem>角色管理</BreadcrumbItem>
	    </Breadcrumb>
	    <div style="height:30px;"></div>
	    <elTable
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            ref="table1"
            border
            :max-height="adjustHeight+100"
            :highlight-current-row="true"
            :header-row-style="{color:'#666'}"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
              prop="name"
              label="角色名"
              minWidth="180">
            </el-table-column>
            <el-table-column align="center">
                <template slot="header" slot-scope="scope">操作</template>
                <template slot-scope="scope">
                    <Button size="small" type="primary"  @click="addBtnFun(scope.row)">新增</Button>
                    <Button size="small" type="primary" @click="modifyBtnFun(scope.row)">修改</Button>
                    <Button size="small" type="error" @click="deleteBtnFun(scope.row)">删除</Button>
                </template>
            </el-table-column>
        </elTable>
        <CommonTipModal :modal="modalTip" @cancel="cancel" :modalTipTitle="modalTipTitle" @comfirmBtn="tipComfirmBtn" :item="item">
        	<div style="text-align:center">
	            <p>确定删除该角色吗?</p>
	        </div>
        </CommonTipModal>
        <Modal v-model="modifyModal" :title="myTitle" width="360" :mask-closable="false">
	        <div style="margin:15px 0;">
	        	<span class="role-comm">角色标识(唯一)：</span>
	            <Input v-model="salesForm.unique" style="width:50%;" placeholder="推荐英文如:java_developer"/>
	        </div>
	        <div style="margin:15px 0;">
	        	<span class="role-comm">角色别名：</span>
	            <Input v-model="salesForm.name" style="width:50%;" placeholder="请输入角色别名(用于展示)"/>
	        </div>
	        <div slot="footer">
	            <Button type="primary" :loading="modal_loading" @click="handleSubmit">确定</Button>
	            <Button @click="cancel">取消</Button>
	        </div>
        </Modal>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import CommonTipModal from '@/components/CommonTipModal'
export default {
	    name: 'component_name',
	    props:[],
		data() {
			return {
				modifyModal: false, //默认不显示添加框
				item: {},
	            tableData: [],
	            pid:'', //父节点ID值
	            modalTip:false,
	            modalTipTitle:'删除该角色',
	            modifyModal:false,
	            modal_loading:false,
	            id:'',
	            myTitle:'新增',
	            salesForm: {
	                unique:'',
					name:''
	            },
			}
		},
		computed:{
            ...mapState(['adjustHeight']) 
        },
		components:{
		    CommonTipModal
	    },
	    activated(){ //组件激活时候触发
            this.getInitialList();
	    },
		methods: {
			getInitialList() { 
				this.$axios.get('/fx?api=gate.auth.sysRoleList').then(res => {
					if (res != 500) {
						this.tableData = res;
                        this.$store.commit('change_height');
					}
				})
			},
			addBtnFun(row) {
				this.myTitle = '新增';
	            this.pid = row.id;
	            this.item = row;
	            this.salesForm = {
	                unique:'',
					name:''
	            },
                this.modifyModal = true;
			},
			modifyBtnFun(row){
				this.myTitle = '修改';
	            this.item = row;
	            this.id = row.id;
	            this.modifyModal = true;
	            this.myTitle = '修改';
	            this.salesForm = {
	                unique:row.unique,
					name:row.name
	            };
            }, 
			deleteBtnFun(item){
	            this.item = item;
	            this.modalTip = true;
            },
			cancel(){
	            this.modalTip = false;
	            this.modifyModal = false;
	        },
            tipComfirmBtn(num) {
	            this.modalTip = false;
	            if (num != 500) {
	                this.$Message.success('删除成功');
	                this.getInitialList();
	            }
	        },
            handleSubmit(){
                if(!this.salesForm.unique || !this.salesForm.name){
                    return this.$Message.error("带 * 为必填项"); 
                }
                let formData = {...this.salesForm};
	            let  myUrl = '/fx?api=gate.auth.sysAddRole';
	            if(this.myTitle == '新增'){
	                formData.pid = this.pid;
	            }else if(this.myTitle == '修改'){
	                 myUrl = '/fx?api=gate.auth.sysModifyRole';
	                 formData.id = this.id;
	            }
	            this.$axios.post(myUrl,formData).then(res => {
	                if(res!=500){
	                    this.$Message.success("操作成功"); 
	                    this.modifyModal = false;
	                    if(this.myTitle == '新增'){
	                        this.item.children.push(res);
	                        this.$refs.table1.toggleRowExpansion(this.item,true);   
	                    }else if(this.myTitle == '修改'){
	                        Object.assign(this.item,{unique:res.unique,name:res.name})
	                    }
	                    this.$forceUpdate();
	                    
	                }
	            })
            },
            deleteBtnFun(row){
	            this.item = row;
	            this.modalTip = true;
            },
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
    #roleManage /deep/ .el-table__expand-icon.el-table__expand-icon--expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    #roleManage /deep/ .el-table__expand-icon .el-icon-arrow-right:before {
        content: "\E723";
        font-size: 14px;
        color: #333;
    } 
     #roleManage /deep/ .el-table__expand-icon.el-table__expand-icon--expanded .el-icon-arrow-right:before {
        content: "\E722";
        font-size: 14px;
        color: #333;
    }
</style>
