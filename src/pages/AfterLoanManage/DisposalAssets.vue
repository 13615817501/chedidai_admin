<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
            <BreadcrumbItem>贷后管理</BreadcrumbItem>
            <BreadcrumbItem>资产处置</BreadcrumbItem>
        </Breadcrumb>
        <div class="search-box">
             <span>
                时间类型: 
                <Select v-model="search.timeType" style="width:120px">
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
                &nbsp;&nbsp;手机号: 
                <Input v-model="search.mobile" clearable placeholder="请输入手机号" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;期数: 
                <Input v-model="search.period" clearable placeholder="请输入期数" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;用户姓名: 
                <Input v-model="search.name" clearable placeholder="请输入用户姓名" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;逾期天数: 
                <Input v-model="search.overdueDaysZd" clearable placeholder="请输入逾期天数" style="width: 120px"></Input>
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
            填写退回理由：<Input style="margin-top:10px;" v-model.trim="msg" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入..." />
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
            orderId:'',
            prodList:[], //产品列表
            search: {
                timeType: 16,
                timeInterval: '',
                orderNumber: '',
                mobile: '',
                name: '',
                period:'',
                overdueDaysZd:'',
                pageNum: 1,
                pageSize: 15
            },
            modify: {
                amount:''
            },
            table_loading: false, //默认先显示加载
            certifyList:[],
            columns: [ {
                    title: '订单号',
                    key: 'orderNumber',
                    className:'hoverBlue',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', {
                                on: {
                                    click: () => {
                                        this.$router.push({name:'ProcessDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'DisposalAssets'}});  
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
                    minWidth: 120,
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
                    title: '合同金额(元)',
                    key: 'amount',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amount)
                        ]);
                    }
                },{
                    title: '划扣总金额(元)',
                    key: 'amountMonthly',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amountMonthly)
                        ]);
                    }
                },{
                    title: '划扣金额资方(元)',
                    key: 'amountMonthlyCapital',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amountMonthlyCapital)
                        ]);
                    }
                },{
                    title: '划扣金额众信(元)',
                    key: 'amountMonthlyZd',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amountMonthlyZd)
                        ]);
                    }
                },{
                    title: '银行卡号',
                    key: 'bankCardNum',
                    minWidth: 180,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankCardNum)
                        ]);
                    }
                },{
                    title: '银行分行号',
                    key: 'bankName',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankName)
                        ]);
                    }
                },{
                    title: '订单状态',
                    key: 'statusValue',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.statusValue)
                        ]);
                    }
                },{
                    title: '期数',
                    key: 'period',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.period)
                        ]);
                    }
                },{
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
                                        this.$router.push({name:'LoanDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'DisposalAssets'}});
                                    }
                                }
                            }, '详情'),
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
        getInitialList(formData){ 
            this.table_loading = true;
            this.$axios.get('/fx?api=gate.order.admin.assetDisposalList',{params:formData}).then(res => {
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
            this.$axios.post('/fx?api=gate.order.admin.loanBackCheck',{orderId:this.orderId,msg:this.msg}).then(res => {
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
</style>