<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>订单管理</BreadcrumbItem>
	        <BreadcrumbItem>订单列表</BreadcrumbItem>
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
            <span>
                &nbsp;&nbsp;状态: 
                <Select v-model="search.status" style="width:100px" clearable>
                    <Option :value="1">待门店审核</Option>
                    <Option :value="2">待初审</Option>
                    <Option :value="3">待确认</Option>
                    <Option :value="4">待发起核保</Option>
                    <Option :value="5">拒绝</Option>
                    <Option :value="6">取消</Option>
                    <Option :value="7">等待合同签署</Option>
                    <Option :value="8">等待GPS安装校验</Option>
                    <Option :value="9">待复审</Option>
                    <Option :value="10">复审退回</Option>
                    <Option :value="11">待放首款</Option>
                    <Option :value="12">待放款</Option>
                    <Option :value="13">待还款</Option>
                    <Option :value="14">逾期</Option>
                    <Option :value="15">资产处置</Option>
                    <Option :value="16">结清</Option>
                    <Option :value="20">合同退回</Option>
                </Select>
            </span>
            <ReactChain @changeOutletId="changeOutletId"></ReactChain>    
            <Button type="primary" icon="ios-search" style="margin-left:10px;margin-top: 10px;vertical-align:baseline;" @click="searchList">搜索</Button>
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
import ReactChain from '@/components/ReactChain' //公用的提示组件 
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
                status: '',
                outletId:'',
                pageNum: 1,
                pageSize: 15
            },
            labelEnum:[], //产品标签 
            isInterestHeadEnum:[], //是否利息前置
            calInterestWayEnum:[], //计算利息方式
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
            columns: [ {
                    title: '账单详情',
                    key: 'action',
                    width: 100,
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
                                        this.$router.push({name:'LoanDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'OrderList'}});  
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
                                        this.$router.push({name:'ProcessDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'OrderList'}});  
                                    }
                                }
                            }, params.row.orderNumber)
                        ]);
                    }
                }, {
					title: '用户姓名',
					key: 'userName',
					minWidth: 160,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.userName)
						]);
					}
				}, {
                    title: '手机号码',
                    key: 'userMobile',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userMobile)
                        ]);
                    }
                },{
                    title: '合同金额',
                    key: 'amount',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amount)
                        ]);
                    }
                }, {
                    title: '门店名',
                    key: 'storeName',
                    minWidth: 150,
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
					title: '状态',
					key: 'statusValue',
					minWidth: 100,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.statusValue)
						]);
					}
				}
			]
		}
	},
	computed:{
        ...mapState(['adjustHeight']) 
    },
    components:{
        ReactChain
    }, 
	activated(){
        this.getInitialList(util.searchList(this.search,'timeInterval'));
	},
	methods: {
       
		getInitialList(formData){ 
            this.table_loading = true;
		    this.$axios.get('/fx?api=gate.order.admin.orderList',{params:formData}).then(res => {
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
        remoteMethod(query) { //远程请求
            if (query != '') {
                this.$axios.post('/fx?api=gate.all.product.admin', {name: query}).then(res => {
                    this.prodList = res.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
                })
            } else {
                this.prodList = [];
            }
        },
        changeOutletId(outletId){
            this.search.outletId = outletId;
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