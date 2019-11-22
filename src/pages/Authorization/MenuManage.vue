<template>
    <div id="menuManage" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>组织管理</BreadcrumbItem>
	        <BreadcrumbItem>菜单管理</BreadcrumbItem>
	    </Breadcrumb>
	    <div style="height:30px;"></div>
	    <elTable
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="unique"
            border
            ref="table1"
            :max-height="adjustHeight+150"
            :highlight-current-row="true"
            :header-row-style="{color:'#666'}"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
              prop="name"
              label="菜单名称"
              minWidth="180">
            </el-table-column>
            <el-table-column align="center">
                <template slot="header" slot-scope="scope">操作</template>
                <template slot-scope="scope">
                    <Button size="small" type="primary"  :disabled="scope.row.type===2" @click="addBtnFun(scope.row)">新增</Button>
                    <Button size="small" type="primary" @click="modifyBtnFun(scope.row)">修改</Button>
                    <Button size="small" type="error" @click="deleteBtnFun(scope.row)">删除</Button>
                </template>
            </el-table-column>
        </elTable>
        <Modal v-model="modifyModal" :title="myTitle" :mask-closable="false" width="350">
            <Form ref="salesForm" :model="salesForm" :label-width="90">
                <FormItem label="菜单名称：" prop="name" class="ivu-form-item-required">
                    <Input v-model.trim="salesForm.name" class="item-width" placeholder="请输入名称"></Input>
                </FormItem>
                <FormItem label="唯一值：" prop="unique" class="ivu-form-item-required">
                    <Input v-model.trim="salesForm.unique" class="item-width" placeholder="请输入唯一值"></Input>
                </FormItem> 
                <FormItem label="排序：" prop="sort" class="ivu-form-item-required">
                    <Input v-model.trim="salesForm.sort" class="item-width" placeholder="请输入排序"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="handleSubmit('salesForm')">确定</Button>
                <Button @click="cancel()">取消</Button>
            </div>
            <CommonTipModal  :modal="modalTip" @cancel="cancel" :modalTipTitle="modalTipTitle" :item="item" @comfirmBtn="tipComfirmBtn" >
                <div style="text-align:center">
                    <p>确定删除该部门组织吗?</p>
                </div>
            </CommonTipModal>
        </Modal>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import CommonTipModal from '@/components/CommonTipModal' //公用的提示组件 
export default {
	    name: 'component_name',
	    props:[],
		data() {
			return {
		        item: {},
	            tableData: [],
	            pid:'', //父节点ID值
	            modalTip:false,
	            modalTipTitle:'删除该菜单',
	            modifyModal:false,
	            modal_loading:false,
	            id:'',
	            myTitle:'新增',
	            salesForm: {
	                name: '',
	                unique: '',
	                sort:''
	            }
			}
		},
	    computed:{
            ...mapState(['adjustHeight']) 
        },
	    activated(){
            this.getInitialList();
	    },
	    components:{
            CommonTipModal,
        },
		methods: {
			getInitialList() { 
				this.$axios.get('/fx?api=gate.auth.sysMenus').then(res => {
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
	            console.log(this.item);
	            this.salesForm = {
	                name: '',
	                unique: '',
	                sort:''
	            },
                this.modifyModal = true;
			},
			modifyBtnFun(row){
	            this.item = row;
	            this.id = row.id;
	            this.modifyModal = true;
	            this.myTitle = '修改';
	            this.salesForm = {
	                name: row.name,
	                unique: row.unique,
	                sort: row.sort
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
                if(!this.salesForm.unique || !this.salesForm.name || !this.salesForm.sort){
                    return this.$Message.error("带 * 为必填项"); 
                }
                if(!Number.isInteger(Number(this.salesForm.sort))){
                    return this.$Message.error("排序为整数");
                }
                let formData = {...this.salesForm};
	            let  myUrl = '/fx?api=gate.auth.sysAddMenu';
	            if(this.myTitle == '新增'){
	                formData.pid = this.pid;
	                formData.type = this.item.type+1;
	            }else if(this.myTitle == '修改'){
	                myUrl = '/fx?api=gate.auth.sysModifyMenu';
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
	                        Object.assign(this.item,{name:res.name,unique:res.unique,sort:res.sort})
	                    }
	                    this.$forceUpdate();
	                }
	            })
            },
            deleteBtnFun(row){
	            this.item = row;
	            this.modalTip = true;
            },
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
    #menuManage /deep/ .el-table__expand-icon.el-table__expand-icon--expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    #menuManage /deep/ .el-table__expand-icon .el-icon-arrow-right:before {
        content: "\E723";
        font-size: 14px;
        color: #333;
    } 
    #menuManage /deep/ .el-table__expand-icon.el-table__expand-icon--expanded .el-icon-arrow-right:before {
        content: "\E722";
        font-size: 14px;
        color: #333;
    }
</style>