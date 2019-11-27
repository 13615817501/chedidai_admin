<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>订单管理</BreadcrumbItem>
	        <BreadcrumbItem>待门店处理</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                申请时间: 
                <DatePicker type="daterange" v-model='search.timeInterval' placeholder="请选择" style="width: 200px"></DatePicker>
            </span>
            <span>
                &nbsp;&nbsp;订单号: 
                <Input v-model="search.orderNumber" clearable placeholder="请输入订单号" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;产品: 
                <Select v-model="search.prodId" placeholder="输入后选择匹配产品" clearable remote filterable :remote-method='remoteMethod' style="width: 150px">
                    <Option v-for="(option, index) in prodList" :value="option.id" :label="option.name" :key="option.id"></Option>
                </Select>
            </span>
            <span>
                &nbsp;&nbsp;手机号: 
                <Input v-model="search.mobile" clearable placeholder="请输入手机号" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;用户姓名: 
                <Input v-model="search.name" clearable placeholder="请输入用户姓名" style="width: 120px"></Input>
            </span>
            <Button type="primary" icon="ios-search" style="margin-left:10px;margin-top: 10px;vertical-align:baseline;" @click="searchList">搜索</Button>
        </div> 
	    <div class="listadmin">
            <Table border :columns="columns" :data="certifyList" :height="adjustHeight"></Table>
        </div>
        <div style="text-align:center;margin-top:20px;">
            <Page :current = "search.pageNum" :total="totalCount" :page-size="search.pageSize" @on-change="pageChange" show-total></Page>
        </div>
        <CommonTipModal :modal="tipModal" @cancel="cancel" :modalTipTitle="modalTipTitle" @comfirmBtn="tipComfirmBtn" :item="item">
            <div style="text-align:center">
                <p>确定{{modalTipTitle}}吗?</p>
            </div>
        </CommonTipModal>
        <ChooseReason :title="title" :orderId="orderId" :modal="passModal" :ModalContent="ModalContent" @get-status="confirmBtn" @cancel="cancel"></ChooseReason>
        <Modal v-model="modifyModal" title="修改" :mask-closable="false" width="360" :closable="false">
            <div style="text-align:center">
                产品：
                <Select v-model="prodId" placeholder="请选择" style="width: 150px">
                    <Option v-for="(option, index) in storeProduct" :value="option.key" :label="option.value" :key="option.key"></Option>
                </Select>
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn2">确定</Button>
                <Button @click="cancel">取消</Button>
            </div>
        </Modal> 
        <Modal width="350" v-model="backModal" title="退单" :mask-closable="false"> 
            填写退回理由：<Input style="margin-top:10px;" v-model.trim="msg" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入..." />
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn3">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
    </div>
</template>
<script>
import util from '@/util/util'
import CommonTipModal from '@/components/CommonTipModal' //公用的提示组件 
import ChooseReason from '@/components/ChooseReason' //公用的提示组件 
import ImgUpload from '@/components/ImgUpload' //公用的提示组件 
import moment from 'moment'
import { mapState } from 'vuex'
export default {
	name: 'CustomList',
	props:[],
	data () {
		return {
			totalCount: 0,
            modalTipTitle:'禁用该员工',
            tipModal:false,
            modifyModal:false,
            myTitle:'新增产品',
            title:'待门店处理拒绝',
            prodId:'',
            passModal: false,
            backModal:false,
            modal_loading:false,
            storeProduct:[],
            ModalContent:[],
            item:{},
            orderId:'',
            msg:'',  //客服退回理由
            prodList:[], //产品列表集合
			search:{
                timeType:1,
                timeInterval:'',
                orderNumber: '',
                prodId:'',
                mobile: '',
                name: '',
			    pageNum: 1,
			    pageSize:15
			},
			table_loading: false, //默认先显示加载
			certifyList:[],
            columns: [{
                    title: '操作',
                    key: 'action',
                    width: 250,
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
                                        this.tipModal = true;
                                        this.modalTipTitle = '通过该门店处理订单';
                                        this.item = params.row;
                                    }
                                }
                            }, '通过'),
                            // h('Button', {
                            //     props: {
                            //         type: 'error',
                            //         size: 'small',
                            //     },
                            //     style: {
                            //         'margin-left':'10px',
                            //     },
                            //     on: {
                            //         click: () => {
                            //             this.passModal = true;
                            //             this.title = '待门店处理拒绝';
                            //             this.orderId = params.row.orderId;
                            //         }
                            //     }
                            // }, '拒绝'),
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
                                        this.orderId = params.row.orderId;
                                        this.prodId = params.row.prodId;
                                        this.getStoreProduct({storeId:params.row.storeId});
                                        this.modifyModal = true;
                                    }
                                }
                            }, '修改') ,
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
                                        this.msg='';
                                        this.backModal = true;
                                        this.orderId = params.row.orderId;
                                    }
                                }
                            }, '客服退回')
                        ]);
                    }
                }, {
                    title: '订单号',
                    key: 'orderNumber',
                    className:'hoverBlue',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', {
                                on: {
                                    click: () => {
                                        this.$router.push({name:'ProcessDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'WaitStoreList'}});  
                                    }
                                }
                            }, params.row.orderNumber)
                        ]);
                    }
                }, {
					title: '用户姓名',
					key: 'userName',
					minWidth: 90,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.userName)
						]);
					}
				}, {
                    title: '手机号码',
                    key: 'userMobile',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userMobile)
                        ]);
                    }
                }, {
                    title: '门店名',
                    key: 'storeName ',
                    minWidth: 100,
                     render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.storeName)
                        ]);
                    }
                }, {
					title: '产品名称',
					key: 'prodName',
					minWidth: 120,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.prodName)
						]);
					}
				}, {
                    title: '退回原因',
                    key: 'reason',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.reason),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                style: {
                                    'margin-left':'10px',
                                    display:params.row.reasonAttachment?'inline-block':'none'
                                },
                                on: {
                                    click: () => {
                                        window.open(params.row.reasonAttachment);
                                    }
                                }
                            }, '附件'),
                        ]);
                    }
                }, {
					title: '申请时间',
					key: 'createTime',
					minWidth: 150,
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
        ImgUpload,
        ChooseReason
    }, 
	computed:{
        ...mapState(['adjustHeight']) 
    },
	activated(){
        this.getInitialList(util.searchList(this.search,'timeInterval'));
        this.getRefuseReasonList();
	},
    watch:{
       '$route'(to,from){
           if(from.name=='WaitStoreDetail'){
               this.search.pageNum = this.$route.query.pageNum;
               this.getInitialList(util.searchList(this.search,'timeInterval'));
           }
       }
    },
	methods: {
        getStoreProduct(formData){
            this.$axios.get('/fx?api=gate.all.store.product',{params:formData}).then(res => {
                if(res!=500){
                    this.storeProduct = res.list;  
                }
            })
        },
        getRefuseReasonList(){
            this.$axios.get('/fx?api=gate.base.menus',{params:{nerg:5}}).then(res => {
                if(res!=500){
                    this.ModalContent = [];
                    res.hub.forEach( (item, index) => {
                        this.ModalContent.push(item.v);
                    });
                }
            })
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
		getInitialList(formData){ 
            this.table_loading = true;
		    this.$axios.get('/fx?api=gate.order.admin.waitCheckOfflineList',{params:formData}).then(res => {
		    	if(res!=500){
		    		this.certifyList = res.list;
			        this.totalCount = res.page.totalCount;
			        this.search.pageNum = res.page.currentPage;
			        this.$store.commit('change_height');
		    	}
		    	this.table_loading = false;
			})
		},
        pageChange(page){
			this.search.pageNum = page;
            this.getInitialList(util.searchList(this.search,'timeInterval'));
        },
        searchList() {
        	this.search.pageNum = 1;
			this.getInitialList(util.searchList(this.search,'timeInterval'));
		},
        confirmBtn(num){
            if(num!=500){
                this.$Message.success('操作成功');
               this.getInitialList(util.searchList(this.search,'timeInterval'));
            }
            this.passModal = false;
        },
        cancel(){
            this.tipModal = false;
            this.modifyModal = false;
            this.passModal = false;
            this.backModal = false;
        },
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.getInitialList(util.searchList(this.search,'timeInterval'));
            }
        },
        confirmBtn2(){
            this.modal_loading = true;
            let formData = {
                id: this.orderId,
                prodId: this.prodId
            };
            this.$axios.post('/fx?api=gate.order.product.update',formData).then(res => {
                if(res!=500){
                   this.$Message.success('修改成功');
                   this.getInitialList(util.searchList(this.search,'timeInterval'));
                }
                this.modal_loading = false;
                this.modifyModal = false;
            })
        },
         confirmBtn3(){
            if(!this.msg){
               return this.$Message.warning('请填写退回理由');
            }
            this.$axios.post('/fx?api=gate.admin.order.backToStaff',{orderId:this.orderId,msg:this.msg}).then(res => {
                if(res!=500){
                    this.$Message.success('退回成功');
                    this.getInitialList(util.searchList(this.search,'timeInterval'));
                }
            })
            this.backModal = false;
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
    .single-info span{
        display: inline-block;
        width: 33%;
    }
    .replenish-info span{
        display: inline-block;
        width: 50%;
    }
    .name1-box,.name2-box{
        height:400px;
        overflow-y: scroll;
    }
    .contact-info span{
        display: inline-block;
        width: 20%;
    }
    .original-img{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        span{
            display: inline-block;
            width: 25%;
            margin: 0 4% ;
        }
    }
    .original-img img{
        display: inline-block;
        max-width: 100%;
    }
</style>