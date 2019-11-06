<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>报表管理</BreadcrumbItem>
	        <BreadcrumbItem>客户信息统计表</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
             <span>
                时间类型: 
                <Select v-model="search.timeType" style="width:100px">
                    <Option :value="1">申请时间</Option>
                    <Option :value="2">门店审核通过</Option>
                    <Option :value="3">初审通过时间</Option>
                    <Option :value="4">用户确认时间</Option>
                    <Option :value="5">复审通过时间</Option>
                    <Option :value="6">合同签署时间</Option>
                    <Option :value="7">GPS安装时间</Option>
                    <Option :value="8">抵押完成时间</Option>
                    <Option :value="9">首款完成时间</Option>
                    <Option :value="11">尾款完成时间</Option>
                    <Option :value="12">订单开始时间</Option>
                    <Option :value="13">订单失效时间</Option>
                    <Option :value="14">结清时间</Option>
                    <Option :value="15">取消订单时间</Option>
                    <Option :value="16">还款时间</Option>
                </Select>
            </span>
            <span>
                &nbsp;&nbsp;时间区间: 
                <DatePicker type="daterange" v-model='search.timeInterval' placeholder="请选择" style="width: 200px"></DatePicker>
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
            <Button type="primary" icon="md-download" style="margin-left:10px;margin-top: 10px;vertical-align:baseline;" @click="downLoad">导出</Button>
        </div> 
	    <div class="listadmin">
            <Table border :columns="columns" :data="certifyList" :height="adjustHeight"></Table>
        </div>
        <div style="text-align:center;margin-top:20px;">
            <Page :current = "search.pageNum" :total="totalCount" :page-size="search.pageSize" @on-change="pageChange" show-total></Page>
        </div>
    </div>
</template>
<script>
import util from '@/util/util'
import moment from 'moment'
import { mapState } from 'vuex'
export default {
	name: 'CustomList',
	props:[],
	data () {
		return {
            mat:'',
			totalCount: 0,
            modifyModal:false,
            modalTipTitle:'禁用该员工',
            tipModal:false,
            myTitle2:'退回门店',
            myTitle:'新增产品',
            item:{},
            isPassModal:false,
            isPass:1,
            bigimg:'',
            bannerPic:'',
            modalPreview:false,
            modal_loading:false,
            storeNames:[],
            id:'',
            orderId:'',
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
                    title: '资金方',
                    key: 'capitalSide',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.capitalSide)
                        ]);
                    }
                }, {
					title: '承保方',
					key: 'insurer',
					minWidth: 160,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.insurer)
						]);
					}
				}, {
                    title: '审核客服',
                    key: 'customerService',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.customerService)
                        ]);
                    }
                }, {
					title: '门店简称',
					key: 'stores',
					minWidth: 120,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.stores)
						]);
					}
				}, {
                    title: '产品政策',
                    key: 'product',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.product)
                        ]);
                    }
                },{
                    title: '用户姓名',
                    key: 'userName',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userName)
                        ]);
                    }
                },{
                    title: '身份证号',
                    key: 'userIdentityCard',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userIdentityCard)
                        ]);
                    }
                },{
                    title: '客户电话',
                    key: 'usermMobile',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.usermMobile)
                        ]);
                    }
                },{
                    title: '期限(月)',
                    key: 'periods',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.periods)
                        ]);
                    }
                },{
                    title: '还款方式',
                    key: 'repaymentMethod',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.repaymentMethod)
                        ]);
                    }
                },{
                    title: '银行卡号',
                    key: 'userBankNumber',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userBankNumber)
                        ]);
                    }
                },{
                    title: '开户行',
                    key: 'bankName',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankName)
                        ]);
                    }
                },{
                    title: '合同金额（元）',
                    key: 'contractAmount',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.contractAmount)
                        ]);
                    }
                },{
                    title: '实际放款金额（元）',
                    key: 'actualAmount',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.actualAmount)
                        ]);
                    }
                },{
                    title: '首期划扣金额',
                    key: 'firstDeductionAmount',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.firstDeductionAmount)
                        ]);
                    }
                },{
                    title: '放款时间',
                    key: 'loanDate',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.loanDate)
                        ]);
                    }
                },{
                    title: '综合服务费',
                    key: 'serviceFee',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.serviceFee)
                        ]);
                    }
                },{
                    title: '保证金',
                    key: 'margin',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.margin)
                        ]);
                    }
                },{
                    title: '违章押金',
                    key: 'trafficDeposit',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.trafficDeposit)
                        ]);
                    }
                },{
                    title: '保费',
                    key: 'insuranceFee',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.insuranceFee)
                        ]);
                    }
                },{
                    title: '居间服务费',
                    key: 'partiesFee',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.partiesFee)
                        ]);
                    }
                },{
                    title: '账户管理费',
                    key: 'accountMgrFee',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.accountMgrFee)
                        ]);
                    }
                },{
                    title: '平台服务费',
                    key: 'platformServiceFee',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.platformServiceFee)
                        ]);
                    }
                },{
                    title: 'GPS及安装费用',
                    key: 'installGpsFee',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.installGpsFee)
                        ]);
                    }
                },{
                    title: '人身意外险',
                    key: 'accidentInsureFee',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.accidentInsureFee)
                        ]);
                    }
                },{
                    title: '年检押金',
                    key: 'annualInspectionDeposit',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.annualInspectionDeposit)
                        ]);
                    }
                },{
                    title: '上牌费用',
                    key: 'installLicensePlateFee',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.installLicensePlateFee)
                        ]);
                    }
                },{
                    title: '家访费用',
                    key: 'homeVisitFee',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.homeVisitFee)
                        ]);
                    }
                },{
                    title: '流量费',
                    key: 'flowFee',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.flowFee)
                        ]);
                    }
                },{
                    title: '杂费',
                    key: 'miscellaneousFee',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.miscellaneousFee)
                        ]);
                    }
                },{
                    title: '进件费用',
                    key: 'transFilesFee',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.transFilesFee)
                        ]);
                    }
                },{
                    title: '首期费用收取日期',
                    key: 'firstDeductionAmountDate',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.firstDeductionAmountDate)
                        ]);
                    }
                },{
                    title: '月还款额',
                    key: 'amountMonth',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amountMonth)
                        ]);
                    }
                },{
                    title: '众信收取',
                    key: 'amountMonthZd',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amountMonthZd)
                        ]);
                    }
                },{
                    title: '车型',
                    key: 'autoModel',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.autoModel)
                        ]);
                    }
                },{
                    title: '车牌号',
                    key: 'autoPlateNumber',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.autoPlateNumber)
                        ]);
                    }
                },{
                    title: '车架号',
                    key: 'autoVin',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.autoVin)
                        ]);
                    }
                },{
                    title: '发动机号',
                    key: 'autoEngineNumber',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.autoEngineNumber)
                        ]);
                    }
                },{
                    title: '车辆评估价格',
                    key: 'valuationAmount',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.valuationAmount)
                        ]);
                    }
                },{
                    title: '到期日期',
                    key: 'endDate',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.endDate)
                        ]);
                    }
                }
			]
		}
	},
	computed:{
        ...mapState(['adjustHeight','host']) 
    },
	activated(){
        this.mat = localStorage.getItem('mat');
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
		    this.$axios.get('/fx?api=gate.order.admin.userInfoStatisticsList',{params:formData}).then(res => {
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
        downLoad(){
            window.open(`${this.host}/file/download?api=gate.order.excle.exportUserInfoStatisticsExcleService&v=1.0&ttid=1002&did=1&ts=1480929340486&lng=39.98871&lat=116.43234&mat=${this.mat}&sign=inm&data=${encodeURIComponent(JSON.stringify(util.searchList(this.search,'timeInterval')))}`);
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