<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>权限管理</BreadcrumbItem>
	        <BreadcrumbItem>部门组织列表</BreadcrumbItem>
	    </Breadcrumb>
        <tree-table 
            class="listadmin"
	        ref="table"
	        sum-text="sum"
	        index-text="#" 
	        :data="myData"
	        :columns="columns"
	        :stripe="props.stripe"
	        :border="props.border"
	        :show-header="props.showHeader"
	        :show-summary="props.showSummary"
	        :show-row-hover="props.showRowHover"
	        :show-index="props.showIndex"
	        :tree-type="props.treeType"
	        :is-fold="props.isFold"
	        :expand-type="props.expandType"
	        select-type="radio"
	        :style="{height:adjustHeight+150+'px',overflow:'auto'}"
	        expand-key="name">
	            <template slot="roles" slot-scope="scope">
		            <Tag v-for="role in scope.row.roles" :key="role.k" color="blue">{{role.v}}</Tag>
		        </template>
	            <template slot="province" slot-scope="scope">
		            <span>{{scope.row.province?scope.row.province.name:''}}</span>
		        </template> 
		        <template slot="city" slot-scope="scope">
		            <span>{{scope.row.city?scope.row.city.name:''}}</span>
		        </template> 
		        <template slot="area" slot-scope="scope">
		            <span>{{scope.row.area?scope.row.area.name:''}}</span>
		        </template>
     			<template slot="operate" slot-scope="scope">
			        <Button type="primary" size="small" @click="addBtnFun(scope.row.id)">新增</Button>
			        <Button type="primary" size="small" @click="modifyBtnFun(scope.row)" v-if="scope.row.pid!=0">修改</Button>
			        <Button type="primary" size="small" @click="deleteBtnFun(scope.row)" v-if="scope.row.pid!=0">删除</Button>
			    </template>
        </tree-table>
        <Modal v-model="modifyModal" :title="myTitle" :mask-closable="false" width="350">
            <Form ref="salesForm" :model="salesForm" :label-width="90">
                <FormItem label="名称：" prop="name" class="ivu-form-item-required">
                    <Input v-model.trim="salesForm.name" class="item-width" placeholder="请输入名称"></Input>
                </FormItem>
                <FormItem label="角色：" prop="roleId" class="ivu-form-item-required">
                    <Select class="item-width" v-model="myroleId" label-in-value @on-change="roleIdChange">
			            <Option v-for="item in roleList" :value="item.code" :key="item.code">{{item.value}}</Option>
			        </Select>
			        <Tag v-for="(role,index) in roleIdsArr" :key="role.value" closable @on-close="handleClose(role,index)">{{role.label}}</Tag>
                </FormItem>
                <FormItem label="类型：" prop="idNum" class="ivu-form-item-required">
                    <Select v-model="salesForm.isStore" class="item-width">
		                <Option :value="1">门店</Option>
		                <Option :value="2">非门店</Option>
		            </Select>
                </FormItem>
                <div v-show="salesForm.isStore==1">
	                <FormItem label="门店编号：" prop="number" class="ivu-form-item-required">
	                    <Input v-model.trim="salesForm.number" class="item-width" placeholder="请输入门店编号"></Input>
	                </FormItem> 
	                <ChinaArea txt="修改" @change="chinaAreaChange" :status="myTitle=='新增' && !modifyModal" :modifyStatus="myTitle=='修改' && modifyModal" 
	                :parProvince="salesForm.province" :parCity="salesForm.city" :parArea="salesForm.area"></ChinaArea>	
	                <FormItem label="详细地址：" prop="address" class="ivu-form-item-required item-width">
	                    <Input v-model.trim="salesForm.address"  class="item-width" type="textarea" :rows="4" placeholder="请输入详细地址"></Input>
	                </FormItem>
	                <FormItem label="门店模式：" prop="idNum" class="ivu-form-item-required item-width">
	                    <Select v-model="salesForm.type"  class="item-width">
			                <Option :value="1">直营</Option>
			                <Option :value="2">渠道</Option>
			            </Select>
                    </FormItem>
                    <FormItem label="手续费：" prop="serviceCharge" class="ivu-form-item-required item-width">
	                    <Input v-model.trim="salesForm.serviceCharge" class="item-width"placeholder="请输入手续费"></Input>
	                </FormItem>
	                <FormItem label="内返费：" prop="internalReturn" class="ivu-form-item-required item-width">
	                    <Input v-model.trim="salesForm.internalReturn"  class="item-width"placeholder="请输入内返费"></Input>
	                </FormItem>
                </div>
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
import util from '@/util/util'
import CommonTipModal from '@/components/CommonTipModal' //公用的提示组件 
import ChinaArea from '@/components/ChinaArea' //公用的提示组件 
import ImgUpload from '@/components/ImgUpload' //公用的提示组件 
import moment from 'moment'
import { mapState } from 'vuex'
export default {
	name: 'CustomList',
	props:[],
	data () {
		return {
			props: {
	          stripe: false,
	          border: false,
	          showHeader: true,
	          showSummary: false,
	          showRowHover: true,
	          showIndex: false,
	          treeType: true,
	          isFold: false,
	          expandType: false
            },
            modalTip:false,
            modalTipTitle:'删除该部门组织',
			myData:[],
			columns: [{
				title: '门店名',
				key: 'name',
				width: '350px',
			},{
				title: '角色',
				key: 'roles',
				minWidth: '150px',
				type: 'template',
				template: 'roles',
			},{
				title: '门店编号',
				minWidth: '100px',
				key: 'number',
			},{
				title: '省',
				key: 'province',
				minWidth: '80px',
				type: 'template',
				template: 'province',
			},{
				title: '市',
				key: 'city',
				minWidth: '80px',
				type: 'template',
				template: 'city',
			},{
				title: '区',
				key: 'area',
				minWidth: '80px',
				type: 'template',
				template: 'area',
			},{
				title: '操作',
				key: 'operate',
				minWidth: '200px',
				type: 'template',
				template: 'operate',
			}],
			myroleId:'',
			roleList:[],
            modifyModal:false,
            myTitle:'新增',
            item:{},
            modal_loading:false,
            pid:'',
            id:'',
            roleIdsArr:[], //存放所有角色的数组
            roleIdsValueArr:[], //存放所有角色的数组
			salesForm: {
				name: '',
				roleIds: '',
				number: '',
				isStore:'2', //默认为2非门店 1为门店
				province: null,
				city: null,
				area: null,
				address: '',
				type: '1',
				serviceCharge: '',
				internalReturn: ''
			},
		}
	},
    components:{
    	CommonTipModal,
        ChinaArea
    }, 
	computed:{
        ...mapState(['adjustHeight']) 
    },
	activated(){
		this.getRoleList();
        this.getInitialList();
	},
	watch:{
        'modifyModal'(newVal,oldVal){
        	if(!newVal){
                this.roleIdsArr = [];
                this.roleIdsValueArr = [];
                this.myroleId = '';
        	}
        }
	},
	methods: {
		getRoleList(){
            this.$axios.get('/fx?api=gate.auth.roleList').then(res => {
		    	if(res!=500){
		    		this.roleList = res.list;
		    	}
			})
		},
		getInitialList(){ 
		    this.$axios.get('/fx?api=gate.iam.orgList').then(res => {
		    	if(res!=500){
		    		this.myData = res;
			        this.$store.commit('change_height');
		    	}
			})
		},
		handleCheckClick(option) {
            // console.log(option); 
        },
        addBtnFun(id){
            this.pid = id;
            this.salesForm = {
				name: '',
				roleIds: '',
				isStore: 2,
				number: '',
				province: null,
				city: null,
				area: null,
				address: '',
				type: 1,
				serviceCharge: '',
				internalReturn: ''
			},
            this.modifyModal = true;
        }, 
        modifyBtnFun(row){
        	this.id = row.id;
            this.modifyModal = true;
            this.myTitle = '修改';
            row.roles.forEach( (item, index) => {
            	this.roleIdsArr.push({label:item.v,value:item.k});
            	this.roleIdsValueArr.push(item.k);
            });
            let str = this.roleIdsValueArr.join(',');
            this.salesForm = {
				name: row.name,
				roleIds: str,
				isStore: row.isStore,
				number: row.number,
				province: row.province?row.province.code:'',
				city: row.city?row.city.code:'',
				area: row.area?row.area.code:'',
				address: row.address,
				type: row.type,
				serviceCharge: row.serviceCharge,
				internalReturn: row.internalReturn
			};
        }, 
        deleteBtnFun(item){
            this.item = item;
            this.modalTip = true;
        },
        handleSubmit(){
        	let formData = {};
        	if(this.salesForm.isStore==2){ //非门店
                if(!this.salesForm.name || !this.salesForm.roleIds){
                    return this.$Message.error("带 * 为必填项"); 
                }
                formData = {
                	pid:this.pid,
                	name:this.salesForm.name,
                	roleIds:this.salesForm.roleIds,
                	isStore:this.salesForm.isStore
                };
        	}else{
                if(!this.salesForm.name || !this.salesForm.roleIds || !this.salesForm.number  || !this.salesForm.province || !this.salesForm.city || !this.salesForm.area  || !this.salesForm.address  || !this.salesForm.type  || !this.salesForm.serviceCharge || !this.salesForm.internalReturn){
                    return this.$Message.error("带 * 为必填项"); 
                }
                formData = {...this.salesForm};
        	}
            let  myUrl = '/fx?api=gate.iam.addOrg';
            if(this.myTitle == '新增'){
                formData.pid = this.pid;
            }else if(this.myTitle == '修改'){
            	 myUrl = '/fx?api=gate.iam.mdfOrg';
            	 formData.id = this.id;
            }
            this.$axios.post(myUrl,formData).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.modifyModal = false;
                    this.getInitialList();    
                }
            })
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
        handleContextmenu(){
            // console.log(111);
        },
        chinaAreaChange(data){
            this.salesForm.province = data.province;
            this.salesForm.city = data.city;
            this.salesForm.area = data.area;
        },
        roleIdChange(Option){
        	if(!Option){  //v-model置为空后option会变为undefined,所以先判断
        		return;
        	} 
        	let bol = this.roleIdsArr.some(item =>{
                return item.label == Option.label;
        	});
            if(!bol){
                this.roleIdsArr.push(Option);
                this.roleIdsValueArr.push(Option.value);
            } 
            this.salesForm.roleIds = this.roleIdsValueArr.join(',');
        },
        handleClose(role,index){
            this.roleIdsArr.splice(index,1);
            this.roleIdsValueArr.splice(this.roleIdsValueArr.indexOf(role.value),1);
            this.salesForm.roleIds = this.roleIdsValueArr.join(',');
        }
	}
}
</script>
<style lang="less" scoped>
    #customList /deep/ .ivu-table-row.ivu-table-row-hover{
        cursor: pointer;
    }
    .item-comm{
        position: relative;
        display: inline-block;
        width: 90px; 
    }
    .item-comm.required:before{
        position: absolute;
        content:'*';
        color:red;
        left:-10px;
        top:3px;
    }
    .item-input,.common-width{
        width: 200px;
    }
    .modify-modal{
        padding: 0 10px;
    }
    .item-div{
        margin: 10px 0;
    }
    .item-width{
    	width: 200px;
    }
</style>