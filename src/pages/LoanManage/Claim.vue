<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>放款管理</BreadcrumbItem>
	        <BreadcrumbItem>认领</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                复审通过时间: 
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
            <Button type="primary" icon="ios-search" style="margin-left:10px;" @click="searchList">搜索</Button>
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
        <Modal width="320" v-model="modifyModal" title="确认首款金额" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">
                    <span class="item-comm required" style="width:60px;">首款金额：</span><Input class="item-input" v-model.trim="modify.amount" placeholder="请输入..." />
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <Modal width="350" v-model="backModal" title="退单" :mask-closable="false"> 
            <span class="item-comm required">填写退回理由：</span><Input style="margin-top:10px;" v-model.trim="msg" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入..." />
            <div style="margin:10px 0;">上传附件：<ImgUpload style="margin-top:5px;" :type="11" class="imgUpload" :myUploadList="myUploadList" :myUploadList2="myUploadList2" @changePicUrl="changePicUrl"></ImgUpload></div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn2">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
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
            backModal:false,
            msg:'',
            modalTipTitle:'禁用该员工',
            tipModal:false,
            myTitle:'新增产品',
            item:{},
            modal_loading:false,
            storeNames:[],
            myUploadList:[],
            myUploadList2:[],
            attachment:[], //附件大集合
            orderId:'',
            prodList:[], //产品列表
			search: {
                timeType: 5,
                timeInterval: '',
                orderNumber: '',
                prodId: '',
                mobile: '',
                name: '',
                pageNum: 1,
                pageSize: 15
            },
            remoteSetting: {
                remote: true,
                remoteMethod: this.remoteMethod
            },
            modify: {
                amount:''
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
                                        this.msg = '';
                                        this.attachment = [];
                                        this.myUploadList = [];
                                        this.myUploadList2 = [];
                                        this.backModal = true;
                                        this.modalTipTitle = '退单';
                                        this.orderId = params.row.orderId;
                                       
                                    }
                                }
                            }, '退单'),
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
                                        this.modify.amount = '';
                                        this.modifyModal = true;
                                        this.orderId = params.row.orderId;
                                    }
                                }
                            }, '确认首款金额'),
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
                                        this.modalTipTitle = '认领';
                                        this.item = params.row;
                                    }
                                }
                            }, '认领')
                        ]);
                    }
                }, {
                    title: '账单详情',
                    key: 'action',
                    width: 100,
                    align: 'center',
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
                                        this.$router.push({name:'LoanDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'Claim'}});
                                    }
                                }
                            }, '详情'),
                        ]);
                    }
                },{
                    title: '订单号',
                    key: 'orderNumber',
                    className:'hoverBlue',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', {
                                on: {
                                    click: () => {
                                        this.$router.push({name:'ProcessDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'Claim'}});  
                                    }
                                }
                            }, params.row.orderNumber)
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
                },{
                    title: '用户姓名',
                    key: 'userName',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userName)
                        ]);
                    }
                }, {
                    title: '身份证号',
                    key: 'identityCard',
                    minWidth: 160,
                     render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.identityCard)
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
                    title: '银行卡号',
                    key: 'bankCardNum',
                    minWidth: 170,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankCardNum)
                        ]);
                    }
                }, {
                    title: '银行分行号',
                    key: 'bankName',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankName)
                        ]);
                    }
                },{
                    title: '门店名',
                    key: 'storeName',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.storeName)
                        ]);
                    }
                }, {
                    title: '合同金额(元)',
                    key: 'amount',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amount)
                        ]);
                    }
                },{
                    title: '首款金额(元)',
                    key: 'firstLoanAmount',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.firstLoanAmount)
                        ]);
                    }
                },{
                    title: '需要划扣金额(元)',
                    key: 'deductAmount',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.deductAmount)
                        ]);
                    }
                },{
                    title: '划扣状态',
                    key: 'deductStatus',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.deductStatus==0?'无':params.row.deductStatus==1?'成功':params.row.deductStatus==3?'失败':'')
                        ]);
                    }
                },{
                    title: '复审通过人员',
                    key: 'checkAgainStaff',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.checkAgainStaff)
                        ]);
                    }
                },{
                    title: '复审通过时间',
                    key: 'checkAgainTime',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.checkAgainTime)
                        ]);
                    }
                },{
                    title: '订单状态',
                    key: 'status',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.status==11?'待放首款':params.row.status==12?'待放尾款':'')
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
        this.getInitialList(util.searchList(this.search,'timeInterval'));
	},
	methods: {
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
		    this.$axios.get('/fx?api=gate.order.admin.claimList',{params:formData}).then(res => {
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
        confirmBtn(){
            if(!this.modify.amount){
                return this.$Message.error('带 * 为必填项');
            }
            let formData = {...this.modify};
            formData.orderId = this.orderId;
            this.modal_loading = true;
            this.$axios.post('/fx?api=gate.order.admin.confirmFirstLoan',formData).then(res => {
                if(res!=500){
                    this.$Message.success('操作成功');
                    this.modifyModal = false;
                    this.getInitialList(util.searchList(this.search,'timeInterval'));
                }
                this.modal_loading = false;
            })
        },
        cancel(){
            this.tipModal = false;
            this.modifyModal = false;
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
            if(!this.msg){
               return this.$Message.warning('请填写退回理由');
            }
            this.$axios.post('/fx?api=gate.order.admin.loanBackCheck',{orderId:this.orderId,msg:this.msg,attachment:String(this.attachment)}).then(res => {
                if(res!=500){
                    this.$Message.success('退回成功');
                    this.getInitialList(util.searchList(this.search,'timeInterval'));
                }
            })
            this.backModal = false;
        },
        changePicUrl(...arr){
            this.attachment = arr[0];
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