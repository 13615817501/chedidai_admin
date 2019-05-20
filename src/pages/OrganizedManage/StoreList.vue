<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>组织管理</BreadcrumbItem>
	        <BreadcrumbItem>门店列表</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                &nbsp;&nbsp;省: 
                <Select v-model="search.province" style="width:120px" clearable>
                    <Option v-for="item in provinces" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
            </span>
            <span>
                &nbsp;&nbsp;市: 
                <Select v-model="search.city" style="width:120px" clearable>
                    <Option v-for="item in citys" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
            </span>
            <span>
                &nbsp;&nbsp;区: 
                <Select v-model="search.area" style="width:120px" clearable>
                    <Option v-for="item in areas" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
            </span>
            <span>
                &nbsp;负责人: 
                <Input v-model="search.name" clearable placeholder="请输入姓名" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;负责人电话: 
                <Input v-model="search.name" clearable placeholder="请输入姓名" style="width: 120px"></Input>
            </span>
            <Button type="primary" icon="ios-search" style="margin-left:10px;" @click="searchList">搜索</Button>
           <Button type="primary" icon="md-add" style="margin-left:10px;" @click="addBtn">新增</Button>
        </div> 
	    <div class="listadmin">
            <Table border :columns="columns" :data="certifyList" :height="adjustHeight"></Table>
        </div>
        <div style="text-align:center;margin-top:20px;">
            <Page :current = "search.pageNum" :total="totalCount" :page-size="search.pageSize" @on-change="pageChange" show-total></Page>
        </div>
        <Modal width="350" v-model="modifyModal" :title="myTitle" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">
                    <span class="item-comm required">门店名称：</span><Input class="item-input" v-model="modify.name" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required">门店编号：</span><Input class="item-input" v-model="modify.number" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required">负责人：</span><Input class="item-input" v-model="modify.chargeName" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required">负责人手机号：</span><Input class="item-input" v-model="modify.chargeMobile" placeholder="请输入..." />
                </div>  
                <div class="item-div">
                    <span class="item-comm required">类型：</span><Select v-model="modify.type" style="width:200px">
                            <Option value="1">直营</Option>
                            <Option value="2">渠道</Option>
                        </Select>
                </div>
                <div class="item-div">
                    <span class="item-comm required">手续费：</span><Input class="item-input" v-model="modify.serviceCharge" placeholder="请输入..." />
                </div>  
                <div class="item-div">
                    <span class="item-comm required">内返费率：</span><Input class="item-input" v-model="modify.internalReturn" placeholder="请输入..." />
                </div> 
               <div class="item-div">
                    <span class="item-comm required">省:</span><Select v-model="modify.province" :key="Math.random()" style="width:200px" clearable>
                        <Option v-for="item in provinces2" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </div>
                <div class="item-div">
                    <span class="item-comm required">市:</span><Select v-model="modify.city" :key="Math.random()" style="width:200px" clearable>
                        <Option v-for="item in citys2" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </div>
                <div class="item-div">
                    <span class="item-comm required">区:</span><Select v-model="modify.area" :key="Math.random()" style="width:200px" clearable>
                        <Option v-for="item in areas2" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </div>
                <div class="item-div">
                    <span class="item-comm required">详细地址：</span><Input class="item-input" v-model="modify.address" placeholder="请输入..." />
                </div>  
                <div class="item-div">
                    <span class="item-comm required">销售产品：</span><Select ref="selectStore" label-in-value filterable v-bind="remoteSetting" placeholder="请搜索匹配.." class="common-width" @on-change="changeFun" clearable>
                        <Option v-for="(option, index) in storeNames" :value="option.id" :label="option.name" :key="option.id"></Option>
                    </Select>
                </div>  
                <div class="item-div">
                    <span class="item-comm"></span><Tag v-for="(product,key,index) in productsArr" :key="key" closable @on-close="handleCloseProduct(product)">{{product.value}}</Tag>
                </div>  
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <CommonTipModal :modal="tipModal" @cance l="cancel" :modalTipTitle="modalTipTitle" @comfirmBtn="tipComfirmBtn" :item="item">
            <div style="text-align:center">
                <p>确定{{modalTipTitle}}吗?</p>
            </div>
        </CommonTipModal>
    </div>
</template>
<script>
import util from '@/util/util'
import CommonTipModal from '@/components/CommonTipModal' //公用的提示组件 
import ImgUpload from '@/components/ImgUpload' //公用的提示组件 
import moment from 'moment'
import { mapState } from 'vuex'
export default {
	name: 'CustomList',
	props:[],
	data () {
		return {
			totalCount: 0,
            modifyModal:false,
            modalTipTitle:'禁用该员工',
            tipModal:false,
            myTitle:'新增产品',
            item:{},
            bigimg:'',
            bannerPic:'',
            modalPreview:false,
            modal_loading:false,
            storeNames:[],
            productsArr:[], //保存被选中产品的数组
            id:'',
            remoteSetting: {
                remote: true,
                remoteMethod: this.remoteMethod
            },
			search:{
                province:'',
                city:'',
                area:'',
			    pageNum: 1,
			    pageSize:15
			},
            provinces:[],
            provinces2:[],
            citys2:[],
            citys:[],
            areas2:[],
            areas:[],
            myOnce1:false,  //是否是第一次修改赋值省市区
            myOnce2:false,  //是否是第一次修改赋值省市区
            labelEnum:[], //产品标签 
            isInterestHeadEnum:[], //是否利息前置
            calInterestWayEnum:[], //计算利息方式
            remoteSetting: {
                remote: true,
                remoteMethod: this.remoteMethod
            },
            modify: {
                name: '',
                number: '',
                province: '',
                city: '',
                area: '',
                address: '',
                type: '',
                chargeName: '',
                chargeMobile: '',
                serviceCharge: '',
                internalReturn: '',
                productIds: '',
                productNames: ''
            },
			table_loading: false, //默认先显示加载
			certifyList:[],
            columns: [{
                    title: '操作',
                    key: 'action',
                    width: 90,
                    align: 'center',
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                style: {
                                    'margin-left':'10px',

                                },
                                on: {
                                    click: () => {
                                        
                                    }
                                }
                            }, '修改')
                        ])
                    }
                }, {
					title: '门店名称',
					key: 'name',
					minWidth: 160,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.name)
						]);
					}
				}, {
                    title: '门店编号',
                    key: 'number',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.number)
                        ]);
                    }
                }, {
					title: '负责人',
					key: 'chargeName',
					minWidth: 120,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.chargeName)
						]);
					}
				}, {
					title: '负责人手机号',
					key: 'chargeMobile',
					minWidth: 90,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.chargeMobile)
						]);
					}
				}, {
                    title: '类型',
                    key: 'typeValue',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.typeValue)
                        ]);
                    }
                }, {
                    title: '手续费',
                    key: 'serviceCharge',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.serviceCharge)
                        ]);
                    }
                }, {
                    title: '内返费率',
                    key: 'internalReturn',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.internalReturn)
                        ]);
                    }
                }, {
                    title: '地址',
                    key: 'addr',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.addr)
                        ]);
                    }
                }, {
                    title: '销售产品',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    size: 'small',
                                    
                                },
                                style: {
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                        
                                    }
                                }
                            }, '详情')
                        ]);
                    }
                }
			]
		}
	},
    components:{
        CommonTipModal,
        ImgUpload
    }, 
	computed:{
        ...mapState(['adjustHeight'])
    },
	activated(){
        this.getInitialList(this.search);
		this.getDetailProduct();
        this.getAdministrative({type:1});
	},
    watch:{
        'search.province'(newVal,oldVal){
            this.getAdministrative({type:2,code:newVal});
            this.search.city = '';
            this.search.area = '';
        },
        'search.city'(newVal,oldVal){
            this.getAdministrative({type:3,code:newVal});
            this.search.area = '';
        },
        'modify.province'(newVal,oldVal){
            this.getAdministrative({type:2,code:newVal},true);
            if(!this.myOnce1){
                this.modify.city = '';
                this.modify.area = '';
            }
            this.myOnce1 = false;
        },
        'modify.city'(newVal,oldVal){
            this.getAdministrative({type:3,code:newVal},true);
            if(!this.myOnce2){
                this.modify.area = '';
            }
            this.myOnce2 = false;
        },
    },
	methods: {
		getInitialList(formData){ 
            this.table_loading = true;
		    this.$axios.get('/fx?api=gate.admin.store.list',{params:formData}).then(res => {
		    	if(res!=500){
		    		this.certifyList = res.list;
			        this.totalCount = res.page.totalCount;
			        this.search.pageNum = res.page.currentPage;
			        this.$store.commit('change_height');
		    	}
		    	this.table_loading = false;
			})
		},
        getAdministrative(formData,bool){ //获得省市区
            this.$axios.get('/fx?api=gate.base.administrative',{params:formData}).then(res => {
                if(res!=500){
                    switch (formData.type) {
                        case 1:
                            if(bool){
                                this.provinces2 = res.list;
                            }else{
                                this.provinces = res.list; 
                            }
                            break; 
                        case 2:
                            if(bool){
                                this.citys2 = res.list;
                            }else{
                                this.citys = res.list; 
                            }
                            break; 
                        case 3:
                            if(bool){
                                this.areas2 = res.list;
                            }else{
                                this.areas = res.list; 
                            }
                            break;
                    }  
                }
            })
        },
        getDetailProduct(){ 
            this.table_loading = true;
            this.$axios.get('/fx?api=gate.detail.product.admin').then(res => {
                if(res!=500){
                    this.labelEnum = res.labelEnum;
                    this.isInterestHeadEnum = res.isInterestHeadEnum;
                    this.calInterestWayEnum = res.calInterestWayEnum;
                }
            })
        },
        changePicUrl(picUrl,myUrl){
            this.modify.picUrl = picUrl;
            this.picUrl = myUrl;
        },
        changeFun(product){
            let bol = this.productsArr.some( (item, index, array) => {
               return item.id == product.value
            });
            if(!bol){
                this.productsArr.push({id:product.value,value:product.label});
            }
        },
        handleCloseProduct(product){
            this.productsArr.forEach( (item, index) => {
                if(item.id == product.id){
                   this.productsArr.splice(index,1);
                }
            });
        },
        pageChange(page){
			this.search.pageNum = page;
            this.getInitialList(this.search);
        },
        searchList() {
        	this.search.pageNum = 1;
			this.getInitialList(this.search);
		},
        addBtn(){
            this.myTitle = '新增';
            this.modifyModal = true;
            this.modify = {
                name: '',
                number: '',
                province: '',
                city: '',
                area: '',
                address: '',
                type: '',
                chargeName: '',
                chargeMobile: '',
                serviceCharge: '',
                internalReturn: '',
                productIds: '',
                productNames: ''
            };
            this.getAdministrative({type:1},true);
        },
        clickFaceImg(img){
            this.bigimg = img;
            this.modalPreview = true;
        },
        remoteMethod(query) { //远程请求
            if (query != '') {
                this.$axios.post('/fx?api=gate.all.product.admin', {name: query}).then(res => {
                    this.storeNames = res.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
                })
            } else {
                this.storeNames = [];
            }
        },
        confirmBtn(){ 
            let [ids,names] = [[],[]];
            this.productsArr.forEach( (item, index) => {
               debugger;
               ids.push(item.id);
               this.modify.productIds = ids.toString();
               names.push(item.value);
               this.modify.productNames = names.toString();
            });
            console.log(this.modify.productIds,this.modify.productNames);
            if(!this.modify.name || !this.modify.number || !this.modify.chargeName || !this.modify.chargeMobile  || !this.modify.type  || !this.modify.serviceCharge  || !this.modify.internalReturn  || !this.modify.province  || !this.modify.city  || !this.modify.area  || !this.modify.address || !this.modify.productIds || !this.modify.productNames){
                return this.$Message.error("带 * 为必填项"); 
            }
            if(!util.testPhone(this.modify.chargeMobile)){
                return this.$Message.error("手机号格式错误"); 
            } 
            let formData = {...this.modify};
            let  myUrl = '/fx?api=gate.admin.store.addOrUpdate';
            if(this.myTitle == '修改'){
                formData.id = this.id;
            }
            this.$axios.post(myUrl,formData).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.modifyModal = false;
                    this.getInitialList(this.search);    
                }
            })
        },
        cancel(){
            this.tipModal = false;
            this.modifyModal = false;
        },
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.getInitialList(this.search);
            }
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
</style>