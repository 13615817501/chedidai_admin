<template>
    <div id="adminList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>组织管理</BreadcrumbItem>
	        <BreadcrumbItem>员工列表</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                手机号: 
                <Input v-model="search.mobile" autocomplete="off" placeholder="按登录手机号搜..." clearable style="width:150px"/>
            </span>
            <span>
                &nbsp;&nbsp;昵称: 
                <Input v-model="search.name" autocomplete="off" placeholder="按昵称搜..." clearable style="width:150px"/>
            </span>
            <Button type="primary" icon="ios-search" style="margin-left:15px;" @click="searchList(1)">搜索</Button>
            <Button type="primary" icon="md-add" style="margin-left:15px;" @click="addBtn">新增</Button>
	    </div>  
	    <div class="listadmin">
            <Table border :columns="columns" :height="adjustHeight" :data="certifyList" :loading="table_loading"></Table>
        </div>
        <div style="text-align:center;margin-top:20px;">
            <Page :current="search.pageNum" :total="totalCount" :page-size="pagesize" @on-change="pageChange" show-total></Page>
        </div>
        <CommonTipModal :modal="modalTip" @cancel="cancel" :modalTipTitle="modalTipTitle" @comfirmBtn="tipComfirmBtn" :adminId="adminId">
        	<div style="text-align:center">
	            <p v-if="modalTipTitle=='删除该管理员'">确定删除该员工吗?</p>
	        </div>
        </CommonTipModal>
        <Modal v-model="addModal" :title="addModalTitle" width="360" :mask-closable="false" @on-cancel="cancel">
            <div class="add-comm">
            	<span class="item-comm required">登录手机号：</span>
            	<!-- <strong v-if="addModalTitle=='修改'">{{add.mobile}}</strong> -->
	            <Input style="width:50%;" v-model="add.mobile" :maxlength="11" placeholder="请输入手机号"/>
            </div>
	        <div class="add-comm">
            	<span class="item-comm required">昵称：</span>
	            <Input  style="width:50%;" v-model="add.name" placeholder="请输入昵称"/>
            </div>
            <div class="add-comm">
            	<span class="item-comm required">工号：</span>
            	<strong v-if="addModalTitle=='修改'">{{add.workNumber}}</strong>
	            <Input v-if="addModalTitle=='新增'"  style="width:50%;" v-model="add.workNumber" placeholder="请输入工号"/>
            </div>
            <div class="add-comm">
            	<span class="item-comm required">身份证号：</span>
            	<!-- <strong v-if="addModalTitle=='修改'">{{add.idCard}}</strong> -->
	            <Input style="width:50%;" v-model="add.idCard" placeholder="请输入身份证号"/>
            </div>
            <div class="add-comm no-required" style="margin-left:10px;">
                <ImgUpload @changePicUrl="changePicUrl" :myPicUrl="picUrl" :type="2">头像：</ImgUpload>
            </div>
            <div class="add-comm" v-if="addModalTitle=='新增'">
            	<span class="item-comm required">设置登录密码：</span>
            	<Input  style="width:10px;opacity:0;position:absolute;" v-model.trim="passwd"  type="password" placeholder="请输入密码..."/>
	            <Input  style="width:50%;" v-model.trim="passwd"  type="password" placeholder="请输入密码..."/>
            </div>
            <div class="add-comm">
            	<span class="item-comm required">组织门店：</span>
	            <Select v-model="unitIds" style="width:50%;" multiple>
				    <Option v-for="item in orgsList" :value="item.k" :key="item.k">{{item.v}}</Option>
			    </Select>
            </div>
            <div class="add-comm">
            	<span class="item-comm required">角色：</span>
	            <RoleSelect @get-roleId="getroleId" :myroleid="add.roleId" :myorgId="add.unitIds" :myStatus="addModal && (addModalTitle=='修改')" :key="add.roleId"></RoleSelect>
            </div>
            <div class="add-comm">
            	<span class="item-comm">备注：</span>
	            <Input  style="width:50%;" v-model="add.content" type="textarea" placeholder="请输入..."/>
            </div>
	        <div slot="footer">
	            <Button type="primary" :loading="modal_loading"  @click="addConfirmBtn">确定</Button>
	            <Button @click="cancel">取消</Button>
	        </div>
        </Modal>
        <Modal v-model="resetModal" title="重置密码" width="300" :mask-closable="false">
            <div>
            	<span class="item-comm required">重置密码：</span>
	            <Input  v-model.trim="passwd" type="password" style="width:50%;" placeholder="请输入密码..."/>
            </div>
	        <div slot="footer">
	            <Button type="primary" :loading="modal_loading"  @click="resetConfirmBtn">确定</Button>
	            <Button @click="cancel">取消</Button>
	        </div>
        </Modal>
    </div>
</template>
<script>
    import RoleSelect from '@/components/RoleSelect'  //拒绝理由列表模块
    import util from '@/util/util.js'  //拒绝理由列表模块
    import CommonTipModal from '@/components/CommonTipModal'
    import ImgUpload from '@/components/ImgUpload' //图片上传组件
    import { mapState } from 'vuex'
	export default {
	    name: 'component_name',
	    props:[],
	    data () {
		    return {
		    	totalCount: 0,
                pagesize: 10,
                passwd:'',//重置密码
		    	modal_loading: false,
		    	table_loading: false,
		    	addModal: false,
		    	modalTipTitle: '启用管理员',
		    	modalTip: false,
		    	addModalTitle:'新增',
		    	resetModal: false,
		    	adminId: '', //当前用户的ID
                search: {
                	mobile: '',
                	name: '',
                    pageNum: 1
                },
                picUrl:'',
                unitIds: [],
                add:{  //新增管理员数据集合
                    name:'',
                    mobile:'',
                    icon:'',
                    workNumber:'',
                    idCard:'',
                    unitIds:'',
                    roleId:'',
                    content:''
                },
                orgsList:[],
                certifyList: [],
                columns: [{
					title: '操作',
					key: 'action',
					width: 220,
					align: 'center',
					fixed: "left",
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									'margin-top':'10px',
									// 'display':params.row.status==1?'inline-block':'none'
								},
								on: {
									click: () => {
										this.modalTipTitle="删除该管理员";
										this.adminId = params.row.id;
										this.modalTip = true;
									}
								}
							}, '删除'),
							// h('Button', {
       //                          props: {
       //                              type: 'dashed',
       //                              size: 'small'
       //                          },
       //                          style: {
       //                        	    'margin-top':'10px',
       //                              'display':params.row.status?'none':'inline-block'
       //                          },
       //                          on: {  
       //                              click: () => {
       //                                  this.modalTipTitle="启用管理员";
       //                                  this.adminId = params.row.id;
							// 			this.modalTip = true;
       //                              }
       //                          }
       //                      }, '启用'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: params.row.status==0
                                },
                                style: {
                              	    'margin-top':'10px',
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                  	    this.addModalTitle = '修改';
                                  	    // this.clearAdminId = true;
                                  	    this.adminId = params.row.id;
                                        this.addModal = true;
                                        let unitIds = [];
										params.row.units.forEach( (ele, index) => {
											unitIds.push(ele.k);
										});
                                        this.unitIds = unitIds;
                                        this.add = {
                                        	name: params.row.name,
						                    mobile: params.row.mobile,
						                    icon: params.row.icon,
						                    workNumber:params.row.workNumber,
						                    idCard:params.row.idCard,
						                    unitIds:String(this.unitIds),
						                    roleId:params.row.roleId,
						                    content:params.row.content,
                                        };
                                        this.passwd = params.row.passwd,
                                        this.picUrl = params.row.icon;
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: params.row.status==0
                                },
                                style: {
                              	    'margin-top':'10px',
                                    'margin-left':'10px',

                                },
                                on: {
                                    click: () => {
                                    	this.passwd = '';
                                    	this.adminId = params.row.id;
                                        this.resetModal = true;
                                    }
                                }
                            }, '重置密码')
						]);
					}
				}, {
					title: '手机号',
					key: 'mobile',
					minWidth: 115,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.mobile)
						]);
					}
				}, {
					title: '工号',
					key: 'workNumber',
					minWidth: 120,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.workNumber)
						]);
					}
				}, {
					title: '身份证',
					key: 'idCard',
					minWidth: 160,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.idCard)
						]);
					}
				}, {
					title: '头像',
					key: 'icon',
					minWidth: 90,
					render: (h, params) => {
						return h('div', [
							h('img', {
                                domProps: {
                                    src: params.row.icon
                                },
                                slot: "content",
                                style: {
                                    width: "50px",
                                    height: '50px',
                                    'border-radius':'50%',
                                    'vertical-align': 'middle',
                                    margin: '5px auto',
                                    cursor:"pointer"
                                },
                            }, '')
						]);
					}
				}, {
					title: '姓名',
					key: 'name',
					minWidth: 120,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.name)
						]);
					}
				}, {
					title: '组织名称',
					key: 'units',
					minWidth: 120,
					render: (h, params) => {
						let unitsName = [];
						params.row.units.forEach( (ele, index) => {
							unitsName.push(ele.v);
						});
						return h('div', [
							h('strong', String(unitsName))
						]);
					}
				}, {
					title: '角色名称',
					key: 'roleName',
					minWidth: 120,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.roleName)
						]);
					}
				}, {
					title: '最近登录时间',
					key: 'lastLoginTime',
					minWidth: 150,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.lastLoginTime)
						]);
					}
				}, {
					title: '创建时间',
					key: 'createTime',
					minWidth: 150,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.createTime)
						]);
					}
				}, {
					title: '创建人',
					key: 'creator',
					minWidth: 80,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.creator)
						]);
					}
				}, {
					title: '状态',
					key: 'status',
					minWidth: 80,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.status==1?'生效':'失效')
						]);
					}
				}, {
					title: '备注',
					key: 'content',
					minWidth: 80,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.content)
						]);
					}
				}]
	        }
	    }, 
	    components: {
			RoleSelect,
            CommonTipModal,
            ImgUpload
		},
		computed:{
            ...mapState(['adjustHeight']) 
        },
	    created(){ 
            this.getOrgsTab();
            this.getInitialList();
	    },
	    activated(){ //组件激活时候触发
            this.getOrgsTab();
            this.getInitialList();
	    },
		methods: {
			getOrgsTab(){ //获得所有组织列表
                this.$axios.get('/fx?api=gate.auth.unitListSet').then(res => {
					if (res != 500) {
						this.orgsList = res;
					}
				})
			},
			getInitialList(formData) { 
				this.table_loading = true;
				this.$axios.get('/fx?api=gate.auth.sysAdminList', {
					params: formData
				}).then(res => {
					if (res != 500) {
						this.certifyList = res.list;
	                    this.totalCount = res.page.totalCount;
	                    this.search.pageNum = res.page.currentPage;
						this.$store.commit('change_height');
					}
					this.table_loading = false;
				})
			},
			searchList(pageNum) {
				if(pageNum){
					this.search.pageNum = pageNum;
				}
				let formData = {...this.search};
				this.getInitialList(formData);
		    },
			addBtn(){
				this.addModalTitle = '新增';
				this.clearAdminId = true;
                this.addModal = true;
                this.unitIds = [];
                this.add = {  
                    name:'',
                    mobile:'',
                    icon:'',
                    workNumber:'',
                    idCard:'',
                    unitIds:'',
                    roleId:'',
                    content:''
                }
                this.picUrl = '';
			},
			pageChange(page) {
				this.search.pageNum = page;
				this.searchList();
			},
			getroleId(roleId){
                this.add.roleId = roleId;
			},
			cancel(){
				this.addModal = false;
				this.modalTip = false;
				this.resetModal = false;
				this.add = {  
                    name:'',
                    mobile:'',
                    icon:'',
                    workNumber:'',
                    idCard:'',
                    unitIds:'',
                    roleId:'',
                    content:''
                }
                this.clearAdminId = false;
                this.passwd = '';
                this.unitIds = [];
			},
            addConfirmBtn(){
            	if(!this.add.name || !this.add.idCard ||!this.add.mobile||!this.add.workNumber||!this.unitIds.length||!this.add.roleId){
                   return this.$Message.error('带 * 项不能为空');
            	} 
            	if(this.addModalTitle=="新增" && !this.passwd){
            		 return this.$Message.error('带 * 项不能为空');
            	}
            	if(!util.testPhone(this.add.mobile)){
                    return this.$Message.error('手机格式有误');
            	};
            	if(this.add.idCard && !util.testIdNum(this.add.idCard)){
                    return this.$Message.error('身份证格式有误');
            	};
            	let formUrl = '';
                let formData = {};
            	if(this.addModalTitle=="新增"){
                    formUrl = '/fx?api=gate.auth.sysAddAdmin'; //新增接口
                    formData = {...this.add};
                    formData.unitIds = String(this.unitIds);
                    formData.passwd = this.passwd;
            	}else{
            		formUrl = '/fx?api=gate.auth.sysModifyAdmin'; //修改接口
            		formData = {
            			name: this.add.name,
            			mobile: this.add.mobile,
            			workNumber: this.add.workNumber,
	                    unitIds: String(this.unitIds),
	                    roleId: this.add.roleId,
	                    content: this.add.content,
	                    adminId: this.adminId,
	                    icon:this.add.icon
            		}
            	}
            	this.modal_loading = true;
                this.$axios.post(formUrl,formData).then(res => {
					if (res != 500) {
						this.addModal = false;
						this.$Message.success(this.addModalTitle=="新增"?'新增成功':'修改成功');
						this.search.mobile = '';
						this.search.name = '';
						this.getInitialList();
						this.add = {
							name:'',
		                    mobile:'',
		                    icon:'',
		                    workNumber:'',
		                    idCard:'',
		                    unitIds:'',
		                    roleId:'',
		                    content:''
						}
						this.unitIds = [];
						this.passwd = '';
					}
					this.modal_loading = false;
				})
            },
            tipComfirmBtn(num){
            	if( num!=500 ){
                    this.$Message.success('删除成功');
                    this.pageChange(1);
            	}
                this.modalTip = false;
            },
            resetConfirmBtn(){
            	if(!this.passwd){
                    return this.$Message.error('带 * 为必填项');
            	}
            	this.$axios.post('/fx?api=gate.auth.sysModifyAdmin',{passwd:this.passwd,adminId:this.adminId}).then(res => {
					if (res != 500) {
						this.$Message.success('重置成功');
					}
					this.table_loading = false;
					this.resetModal = false;
				})
            },
			changePicUrl(picUrl, myUrl) {
				this.add.icon = picUrl;
				this.picUrl = myUrl;
			}
		}
    }
</script>
<style lang="less" scoped>
    #adminList{
    	padding-top: 20px;
    }
    .add-comm{
        margin-bottom: 10px;
        strong{
        	font-weight: normal;
        	color: #999;
        }
    }
    .item-comm{
    	position: relative;
        display: inline-block;
        width: 85px; 
        margin-left: 10px;
    }
    .item-comm.required:before{
    	position: absolute;
        content:'*';
        color:red;
        left:-10px;
        top:3px;
    }
    .no-required /deep/ .item-comm.required:before{
        content:'';
    }
</style>