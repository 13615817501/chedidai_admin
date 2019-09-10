<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>产品管理</BreadcrumbItem>
	        <BreadcrumbItem>门店产品</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                门店名称: 
                <Input v-model="search.storeName" clearable placeholder="请输入门店名称" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;产品名称: 
                <Input v-model="search.prodName" clearable placeholder="请输入产品名称" style="width: 120px"></Input>
            </span>
            <Button type="primary" icon="ios-search" style="margin-left:10px;" @click="searchList">搜索</Button>
           <Button type="primary" icon="md-add" style="margin-left:10px;" @click="addBtn">新增</Button>
        </div> 
	    <div class="listadmin">
            <Table border :columns="columns" :data="certifyList" :height="adjustHeight"></Table>
        </div>
        <div style="text-align:center;margin-top:20px;">
            <Page :current="search.pageNum" :total="totalCount" :page-size="search.pageSize" @on-change="pageChange" show-total></Page>
        </div>
        <Modal width="350" v-model="modifyModal" :title="myTitle" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">
                    <span class="item-comm required">门店名称：</span><Select ref="selectStore" v-model="modify.storeId" label-in-value filterable v-bind="remoteSetting2" placeholder="请搜索匹配.." class="common-width" @on-change="changeFun2" clearable>
                        <Option v-for="(option, index) in storeList" :value="option.id" :label="option.name" :key="option.id"></Option>
                    </Select>
                </div>
                <div class="item-div">
                    <span class="item-comm required">产品名称：</span><Select ref="selectProd" v-model="modify.prodId" label-in-value filterable v-bind="remoteSetting" placeholder="请搜索匹配.." class="common-width" @on-change="changeFun" clearable>
                        <Option v-for="(option, index) in prodList" :value="option.id" :label="option.name" :key="option.id"></Option>
                    </Select>
                </div>
                <!-- <div class="item-div">
                    <span class="item-comm">服务费类型：</span><Select clearable v-model="modify.serviceType" class="item-input" placeholder="请选择">
                    <Option :value="1">按单收取</Option>
                    <Option :value="2">百分比收取</Option>
                    </Select>
                </div>
                <div class="item-div">
                    <span class="item-comm">服务费：</span><Input class="item-input" clearable v-model="modify.serviceValue" placeholder="请输入..." />
                </div> -->
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <CommonTipModal :modal="tipModal" @cancel="cancel" :modalTipTitle="modalTipTitle" @comfirmBtn="tipComfirmBtn" :item="item">
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
            modalTipTitle:'下架该门店产品',
            tipModal:false,
            myTitle:'新增产品',
            item:{},
            bigimg:'',
            bannerPic:'',
            modalPreview:false,
            modal_loading:false,
            prodList:[],
            storeList:[],
            id:'',
			search:{
                storeName:'',
                prodName:'',
			    pageNum: 1,
			    pageSize:15
			},
            labelEnum:[], //产品标签 
            isInterestHeadEnum:[], //是否利息前置
            calInterestWayEnum:[], //计算利息方式
            remoteSetting: {
                remote: true,
                remoteMethod: this.remoteMethod
            },
            remoteSetting2: {
                remote: true,
                remoteMethod: this.remoteMethod2
            },
            modify: {
                storeId:'',
                prodId:'',
            },
			table_loading: false, //默认先显示加载
			certifyList:[],
            columns: [{
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
                            // h('Button', {
                            //     props: {
                            //         type: 'primary',
                            //         size: 'small',
                                    
                            //     },
                            //     style: {
                            //         'margin-left':'10px',
                            //     },
                            //     on: {
                            //         click: () => {
                            //             this.modifyModal = true;
                            //             this.myTitle = '修改';
                            //             this.id = params.row.id;
                            //             this.modify = {
                            //                 storeId: params.row.storeId,
                            //                 prodId: params.row.productId,
                            //             };
                            //             this.remoteSetting.remote = false;  //变成不是远程搜索
                            //             this.remoteSetting.remoteMethod = null; //关闭远程方法
                            //             this.remoteSetting2.remote = false;  
                            //             this.remoteSetting2.remoteMethod2 = null;
                            //             this.prodList = [{id:params.row.productId,name:params.row.productName}]; //赋默认值
                            //             this.storeList = [{id:params.row.storeId,name:params.row.storeName}]; //赋默认值
                            //             this.$nextTick(() => {
                            //                 this.remoteSetting.remote = true; //重新变成远程搜索
                            //                 this.remoteSetting.remoteMethod = this.remoteMethod; //重启远程方法 
                            //                 this.remoteSetting2.remote = true; //重新变成远程搜索
                            //                 this.remoteSetting2.remoteMethod2 = this.remoteMethod2; //重启远程方法
                            //             })
                            //         }
                            //     }
                            // }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    
                                },
                                style: {
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '删除该门店产品';
                                        this.item = params.row;
                                    }
                                }
                            }, '删除'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                style: {
                                    'margin-left':'10px',
                                    display: params.row.status==0?'inline-block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '上架该门店产品';
                                        this.item = params.row;
                                    }
                                }
                            }, '上架'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                },
                                style: {
                                    'margin-left':'10px',
                                     display: params.row.status==1?'inline-block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '下架该门店产品';
                                        this.item = params.row;
                                    }
                                }
                            }, '下架')
                        ]);
                    }
                }, {
                    title: '门店名称',
                    key: 'storeName',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.storeName)
                        ]);
                    }
                }, {
					title: '产品名称',
					key: 'productName',
					minWidth: 160,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.productName)
						]);
					}
				}, {
                    title: '地址',
                    key: 'address',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.address)
                        ]);
                    }
                }, {
                    title: '状态',
                    key: 'status',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.status==1?'生效':'失效')
                        ]);
                    }
                }, {
                    title: '创建时间',
                    key: 'createTime',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.createTime)
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
	},
	methods: {
		getInitialList(formData){ 
            this.table_loading = true;
		    this.$axios.get('/fx?api=gate.admin.store.prodMappingList',{params:formData}).then(res => {
		    	if(res!=500){
		    		this.certifyList = res.list;
			        this.totalCount = res.page.totalCount;
			        this.search.pageNum = res.page.currentPage;
			        this.$store.commit('change_height');
		    	}
		    	this.table_loading = false;
			})
		},
        changePicUrl(picUrl,myUrl){
            this.modify.bannerPic = picUrl;
            this.picUrl = myUrl;
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
                storeId:'',
                prodId:'',
            };
        },
        clickFaceImg(img){
            this.bigimg = img;
            this.modalPreview = true;
        },
        remoteMethod(query) { //远程请求
            if (query != '') {
                this.$axios.post('/fx?api=gate.all.product.admin', {name: query}).then(res => {
                    this.prodList = res.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
                })
            } else {
                this.prodList = [];
            }
        },
        remoteMethod2(query) { //远程请求
            if (query != '') {
                this.$axios.post('/fx?api=gate.admin.store.list', {key: query}).then(res => {
                    this.storeList = res.list.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
                })
            } else {
                this.storeList = [];
            }
        },
        confirmBtn(){
            if(!this.modify.prodId || !this.modify.storeId ){
                return this.$Message.error("带 * 为必填项"); 
            }
            let formData = {...this.modify};
            let  myUrl = '/fx?api=gate.admin.store.addProdMapping';
            if(this.myTitle == '修改'){
                myUrl = '/fx?api=gate.admin.store.mdfProdMapping';
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
        },
        changeFun(obj){
            if(!obj){
                return;
            }
            this.modify.prodId = obj.value;
        },
        changeFun2(obj){
            if(!obj){
                return;
            }
            this.modify.storeId = obj.value;
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