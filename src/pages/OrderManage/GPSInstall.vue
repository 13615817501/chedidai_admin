<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>订单管理</BreadcrumbItem>
	        <BreadcrumbItem>待GPS安装</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                合同签署时间: 
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
            id:'',
			prodList:[], //产品列表
            search: {
                timeType: 6,
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
                    width: 150,
                    align: 'center',
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: (params.row.gpsMortgagrdStatus==1||params.row.gpsMortgagrdStatus==3)?true:false
                                },
                                style: {
                                    'margin-left':'10px'
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = 'GPS安装确认';
                                        this.item = params.row;
                                    }
                                }
                            }, 'GPS安装确认'),
                            // h('Button', {
                            //     props: {
                            //         type: 'primary',
                            //         size: 'small',
                            //         disabled: (params.row.gpsMortgagrdStatus==2||params.row.gpsMortgagrdStatus==3)?true:false
                            //     },
                            //     style: {
                            //         'margin-left':'10px',
                            //     },
                            //     on: {
                            //         click: () => {
                            //             this.tipModal = true;
                            //             this.modalTipTitle = '抵押完成确认';
                            //             this.item = params.row;
                            //         }
                            //     }
                            // }, '抵押完成确认'),
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
                                        this.$router.push({name:'ProcessDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'GPSInstall'}});  
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
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userMobile)
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
					minWidth: 160,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.prodName)
						]);
					}
				},{
					title: '申请时间',
					key: 'createTime',
					minWidth: 150,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.createTime)
						]);
					}
				}, {
                    title: '合同确定人员',
                    key: 'contractStaff',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.contractStaff)
                        ]);
                    }
                },{
                    title: '合同确定时间',
                    key: 'contractTime',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.contractTime)
                        ]);
                    }
                }, {
                    title: '退回原因',
                    key: 'reason',
                    minWidth: 200,
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
                    title: '核保状态',
                    key: 'action',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('strong', {
                                style: {
                                    'margin-left':'10px',
                                },
                            },params.row.underwritedStatus==1?'通过':params.row.underwritedStatus==0?'未核保':params.row.underwritedStatus==3?'失败':'已发起核保'),
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
		    this.$axios.get('/fx?api=gate.order.admin.waitInstallGPSAndMortgage',{params:formData}).then(res => {
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
            this.$axios.post('/fx?api=gate.order.admin.underwrited',{orderId:this.orderId,isPass:this.isPass}).then(res => {
                if(res!=500){
                    this.$Message.success('操作成功');
                    this.getInitialList(util.searchList(this.search,'timeInterval'));
                }
            })
            this.isPassModal = false;
        },
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