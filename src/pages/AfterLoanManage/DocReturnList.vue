<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
            <BreadcrumbItem>贷后管理</BreadcrumbItem>
            <BreadcrumbItem>资料回寄</BreadcrumbItem>
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
            modalTipTitle:'资料回寄完成',
            tipModal:false,
            item:{},
            modal_loading:false,
            orderId:'',
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
            table_loading: false, //默认先显示加载
            certifyList:[],
            columns: [{
                    title: '操作',
                    key: 'action',
                    width: 100,
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
                                        this.modalTipTitle = '资料回寄完成';
                                        this.item = params.row;
                                    }
                                }
                            }, '完成'),
                        ]);
                    }
                }, {
                    title: '订单号',
                    key: 'orderNumber',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.orderNumber)
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
                    minWidth: 120,
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
                    title: '订单详情',
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
                                        this.$router.push({name:'ProcessDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'Claim'}});
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
            this.$axios.get('/fx?api=gate.order.admin.docsRebackList',{params:formData}).then(res => {
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
        cancel(){
            this.tipModal = false;
        },
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.getInitialList(util.searchList(this.search,'timeInterval'));
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