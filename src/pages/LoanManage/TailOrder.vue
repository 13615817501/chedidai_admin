<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>订单管理</BreadcrumbItem>
	        <BreadcrumbItem>尾款订单</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
             <span>
                时间类型: 
                <Select v-model="search.timeType" style="width:120px">
                    <Option :value="1">申请时间</Option>
                    <Option :value="2">门店审核通过</Option>
                    <Option :value="3">初审通过时间</Option>
                    <Option :value="4">用户确认时间</Option>
                    <Option :value="5">复审通过时间</Option>
                    <Option :value="6">合同签署时</Option>
                    <Option :value="7">GPS安装时间</Option>
                    <Option :value="8">抵押完成时间</Option>
                    <Option :value="9">首款完成时间</Option>
                </Select>
            </span>
            <span>
                &nbsp;&nbsp;时间区间: 
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
        <Modal width="280" v-model="isPassModal" title="划扣状态" :mask-closable="false"> 
            <span class="item-comm required" style="margin-top:15px;">划扣状态：</span><Select v-model="isPass.flag" placeholder="请选择" style="width: 150px;">
                        <Option :value="1">成功</Option>
                        <Option :value="3">失败</Option>
                    </Select>
            <div style="margin:15px 0;" v-if="isPass.flag==3"><span class="item-comm">失败原因：</span><Input v-model="isPass.msg" clearable type="textarea" placeholder="请输入失败原因" style="width: 150px"></Input></div>
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
            isPassModal:false,
            item:{},
            bigimg:'',
            bannerPic:'',
            isPass:{
                flag: 1, //划扣状态
                msg: null,  //失败原因
            },
            modalPreview:false,
            modal_loading:false,
            storeNames:[],
            id:'',
			prodList:[], //产品列表
            search: {
                timeType: 1,
                timeInterval: '',
                orderNumber: '',
                prodId: '',
                mobile: '',
                name: '',
                pageNum: 1,
                pageSize: 15
            },
            labelEnum:[], //产品标签 
            isInterestHeadEnum:[], //是否利息前置
            calInterestWayEnum:[], //计算利息方式
            remoteSetting: {
                remote: true,
                remoteMethod: this.remoteMethod
            },
            modify: {
                name: '',
                label: '',
                bannerPic: '',
                monthRate: '',
                term: '',
                jrongRate: '',
                incidental: '',
                accident: '',
                flowAmount: '',
                defaultAmount: '',
                defaultYear: '',
                isInterestHead: '',
                calInterestWay: ''
            },
			table_loading: false, //默认先显示加载
			certifyList:[],
            columns: [{
                    title: '操作',
                    key: 'action',
                    width: 120,
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
                                        this.modalTipTitle = '通过尾款完成';
                                        this.item = params.row;
                                    }
                                }
                            }, '尾款完成')
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
                                        this.$router.push({name:'ProcessDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'TailOrder'}});  
                                    }
                                }
                            }, params.row.orderNumber)
                        ]);
                    }
                }, {
                    title: '用户姓名',
                    key: 'userName',
                    minWidth: 100,
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
					key: 'storeName',
					minWidth: 140,
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
                    title: '合同金额（元）',
                    key: 'amount',
                    minWidth: 140,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amount)
                        ]);
                    }
                }, {
                    title: '复审通过时间',
                    key: 'loanFirstTime',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.loanFirstTime)
                        ]);
                    }
                },{
                    title: '复审操作员',
                    key: 'loanFirstStaff',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.loanFirstStaff)
                        ]);
                    }
                },{
                    title: '划扣状态',
                    key: 'deductStatus',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('strong', {
                                style: {
                                    'margin-left':'10px',
                                    'display': params.row.deductStatus==1?'inline-block':'none'
                                },
                            },params.row.deductStatus==1?'成功':''),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    'margin-left':'10px',
                                    'display': params.row.deductStatus!=1?'inline-block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.orderId = params.row.orderId;
                                        this.isPassModal = true;
                                    }
                                }
                            }, params.row.deductStatus==0?'无':params.row.deductStatus==3?'失败':'成功')
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
		    this.$axios.get('/fx?api=gate.order.admin.waitLoanList',{params:formData}).then(res => {
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
        addBtn(){
            this.myTitle = '新增';
            this.modifyModal = true;
            this.modify = {
                name:'',
                storeId:'',
                mobile:'',
                idNum:'',
                type: '1'
            };
        },
        clickFaceImg(img){
            this.bigimg = img;
            this.modalPreview = true;
        },
        confirmBtn(){
            debugger;
            if(!this.modify.name || !this.modify.bannerPic || !this.modify.monthRate || !this.modify.term || !this.modify.jrongRate || !this.modify.incidental || !this.modify.accident || !this.modify.flowAmount || !this.modify.defaultAmount || !this.modify.defaultYear || !this.modify.isInterestHead || !this.modify.calInterestWay){
                return this.$Message.error("带 * 为必填项"); 
            }
            let formData = {...this.modify};
            let  myUrl = '/fx?api=gate.addOrUpdate.product';
            if(this.myTitle == '修改'){
                formData.id = this.id;
            }
            this.$axios.post(myUrl,formData).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.modifyModal = false;
                    this.getInitialList(util.searchList(this.search,'timeInterval'));
                }
            })
        },
        cancel(){
            this.tipModal = false;
            this.modifyModal = false;
            this.isPassModal = false;
        },
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.getInitialList(util.searchList(this.search,'timeInterval'));
            }
        },
        confirmBtn3(){
            let formData = {...this.isPass};
            formData.orderId = this.orderId;
            this.$axios.post('/fx?api=gate.order.admin.deducted',formData).then(res => {
                if(res!=500){
                    this.$Message.success('操作成功');
                    this.getInitialList(util.searchList(this.search,'timeInterval'));   
                }
                this.isPassModal = false;
            })
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
        width: 80px; 
        margin-left:10px;
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