<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>订单管理</BreadcrumbItem>
            <BreadcrumbItem>{{$route.query.name=='FirstOrder'?'首款订单':'尾款订单'}}</BreadcrumbItem>
	        <BreadcrumbItem>订单详情</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <Button type="primary" @click="backBtn"><Icon type="ios-arrow-back"/>返回</Button>
        </div> 
        <div :style="{paddingLeft:'15px',height:adjustHeight+120+'px',overflow:'auto'}">
            <div class="div-comm-1">订单费用：</div>
            <span class="span-comm-1">
                <div>合同金额(元)：{{certifyData.amount}}</div>
                <div>总金额-众信(元)：{{certifyData.amountZd}}</div>
                <div>总金额-资方(元)：{{certifyData.amountCapital}}</div>
            </span>
            <span class="span-comm-1">
                <div>期数：{{certifyData.periods}}</div>
                <div>未还金额-众信(元)：{{certifyData.needPayAmountZd}}</div>
                <div>未还金额-资方(元)：{{certifyData.needPayAmountCapital}}</div>
            </span>
            <span class="span-comm-1">
                <div>已还期数：{{certifyData.paidPeriodNum}}</div>
                <div>已还金额-众信(元)：{{certifyData.realPayAmountZd}}</div>
                <div>已还金额-资方(元)：{{certifyData.realPayAmountCapital}}</div>
            </span>
            <span class="span-comm-1">
                <div>产品名称：{{certifyData.prodName}}</div>
                <div>逾期金额-众信(元)：{{certifyData.overdueAmount}}</div>
                <div>逾期金额-资方(元)：{{certifyData.overdueAmountCapital}}</div>
            </span>
            <span class="span-comm-1">
                <div>年利率：{{certifyData.interestRate}}</div>
                <div>首期划扣金额：{{certifyData.firstLoanAmount}}</div>
            </span>
            <div class="div-comm-1">费用条目：</div>
            <span class="span-comm-1">
                <div>保费(元)：{{certifyData.insuranceFee}}</div>
                <div>居间服务费(元)：{{certifyData.partiesFee}}</div>
                <div>账户管理费(元)：{{certifyData.accountMgrFee}}</div>
                <div>GPS安装费(元)：{{certifyData.installGpsFee}}</div>
                <div>人生意外险保费(元)：{{certifyData.accidentInsureFee}}</div>
                <div>进件费用(元)：{{certifyData.transFilesFee}}</div>
                <div>年检押金(元)：{{certifyData.annualInspectionDeposit}}</div>
                <div>违章押金(元)：{{certifyData.trafficDeposit}}</div>
            </span>
            <span class="span-comm-1">
                <div>平台服务费(元)：{{certifyData.platformServiceFee}}</div>
                <div>保证金(元)：{{certifyData.margin}}</div>
                <div>家访费用(元)：{{certifyData.homeVisitFee}}</div>
                <div>杂费(元)：{{certifyData.miscellaneousFee}}</div>
                <!-- <div>综合服务费(元)：{{certifyData.comprehenServiceFee}}</div> -->
                <div>上牌抵押费用(元)：{{certifyData.installLicensePlateFee}}</div>
                <div>流量费(元)：{{certifyData.flowFee}}</div>
                <div>综合服务费(元)：{{certifyData.serviceFee}}</div>
            </span>
            <div class="div-comm-1">还款计划：</div>
            <Table border :columns="columns" :data="certifyList"></Table>
        </div>
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
            certifyData:[],
			certifyList:[],
            columns: [{
					title: '期数',
					key: 'period',
                    align: 'center',
					minWidth: 100,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.period)
						]);
					}
				}, {
                    title: '还款时间',
                    key: 'limitPayTime',
                    align: 'center',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.limitPayTime)
                        ]);
                    }
                }, {
                    title: '总金额（元）',
                    align: 'center',
                    children: [
                        {
                            title: '资方',
                            key: 'amountCapital',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.amountCapital)
                                ]);
                            }
                        }, {
                            title: '众信',
                            key: 'amountZd',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.amountZd)
                                ]);
                            }
                        }
                    ]
                }, {
                    title: '应还金额（元）',
                    align: 'center',
                    children: [
                        {
                            title: '资方',
                            key: 'needPayAmountCapital',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.needPayAmountCapital)
                                ]);
                            }
                        }, {
                            title: '众信',
                            key: 'needPayAmountZd',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.needPayAmountZd)
                                ]);
                            }
                        }
                    ]
                },{
                    title: '已还金额（元）',
                    align: 'center',
                    children: [
                        {
                            title: '资方',
                            key: 'realPayAmountCapital',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.realPayAmountCapital)
                                ]);
                            }
                        }, {
                            title: '众信',
                            key: 'realPayAmountZd',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.realPayAmountZd)
                                ]);
                            }
                        }
                    ]
                },{
                    title: '逾期金额（元）',
                    align: 'center',
                    children: [
                        {
                            title: '资方',
                            key: 'overdueFeeCapital',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.overdueFeeCapital)
                                ]);
                            }
                        }, {
                            title: '众信',
                            key: 'overdueFee',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.overdueFee)
                                ]);
                            }
                        }
                    ]
                }, {
                    title: '逾期天数（天）',
                    align: 'center',
                    children: [
                        {
                            title: '资方',
                            key: 'overdueDaysCapital',
                            align: 'center',
                            minWidth: 80,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.overdueDaysCapital)
                                ]);
                            }
                        }, {
                            title: '众信',
                            key: 'overdueDays',
                            align: 'center',
                            minWidth: 80,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.overdueDays)
                                ]);
                            }
                        }
                    ]
                }, {
                    title: '还款时间',
                    align: 'center',
                    children: [
                        {
                            title: '资方',
                            key: 'age',
                            align: 'center',
                            minWidth: 160,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.realPayTimeCapital)
                                ]);
                            }
                        }, {
                            title: '众信',
                            key: 'realPayTime',
                            align: 'center',
                            minWidth: 160,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.realPayTime)
                                ]);
                            }
                        }
                    ]
                }, {
                    title: '状态',
                    align: 'center',
                    key: 'status',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.status==0?'待还款':params.row.status==1?'结清':params.row.status==2?'逾期':params.row.status==3?'还款失败':params.row.status==4?'逾期已还款':params.row.status==5?'资产处置':params.row.status==9?'未生效':'')
                        ]);
                    }
                }
			]
		}
	},
	computed:{
        ...mapState(['adjustHeight']) 
    },
	activated(){
        this.getInitialList({orderId:this.$route.query.orderId});
	},
	methods: {
		getInitialList(formData){ 
		    this.$axios.get('/fx?api=gate.order.admin.billDetail',{params:formData}).then(res => {
		    	if(res!=500){
                    this.certifyData = res;
                    this.certifyList = res.list;
			        this.$store.commit('change_height');
		    	}
			})
		},
        backBtn(){
            this.$router.push({name:this.$route.query.name,query:{pageNum:this.$route.query.pageNum}});
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
    .span-comm-1{
        display: inline-block;
        width: 300px;
        padding-left: 20px;
        vertical-align: top;
    }
    .div-comm-1{
        font-weight: 600;
        font-size: 14px;
        margin: 10px 0;
    }
</style>