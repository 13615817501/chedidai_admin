<template>
    <div id="paymentIn" class="common-id">
        <Breadcrumb>
            <BreadcrumbItem>财务管理</BreadcrumbItem>
            <BreadcrumbItem>推荐激励</BreadcrumbItem>
        </Breadcrumb>
        <div class="search-box">
            <span>
                &nbsp;&nbsp;奖励时间: 
                <DatePicker type="daterange" v-model='search.timeInterval' placeholder="请选择" style="width: 200px"></DatePicker>
            </span>
            <span>
                &nbsp;&nbsp;用户姓名: 
                <Input v-model="search.userName" clearable placeholder="用户姓名" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;推荐人姓名: 
                <Input v-model="search.referrerName" clearable placeholder="推荐人姓名" style="width: 120px"></Input>
            </span> 
            <span>
                &nbsp;&nbsp;用户手机号: 
                <Input v-model.trim="search.userMobile" clearable placeholder="用户手机号" style="width: 120px"></Input>
            </span> 
            <span>
                &nbsp;&nbsp;推荐人手机号: 
                <Input v-model.trim="search.referrerMobile" clearable placeholder="推荐人手机号" style="width: 120px"></Input>
            </span>
            <Button type="primary" icon="ios-search" style="margin-left:10px;" @click="searchList">搜索</Button>
        </div> 
        <div class="listadmin">
            <Table border :columns="columns" :data="certifyList" :height="adjustHeight"></Table>
        </div>
        <div style="text-align:center;margin-top:20px;">
            <Page :current = "pageNum" :total="totalCount" :page-size="pageSize" @on-change="pageChange" show-total></Page>
        </div>
    </div>
</template>
<script>
import util from '@/util/util'
import { mapState } from 'vuex'
export default {
    name: 'PaymentIn',
    props:[],
    data () {
        return {
            pageSize: 15,
            pageNum: 1,
            totalCount: 0,
            search: {
                timeInterval:'',
                userName:'',
                referrerName:'',
                userMobile:'',
                referrerMobile:''
            },
            table_loading: false, //默认先显示加载
            certifyList:[],
            columns: [{
                    title: '订单号',
                    key: 'orderId',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.orderId)
                        ]);
                    }
                }, {
                    title: '用户姓名',
                    key: 'userName',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userName)
                        ]);
                    }
                },{
                    title: '用户手机号',
                    key: 'userMobile',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userMobile)
                        ]);
                    }
                },{
                    title: '推荐人姓名',
                    key: 'referrerName',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.referrerName)
                        ]);
                    }
                },{
                    title: '推荐人手机号',
                    key: 'referrerMobile',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.referrerMobile)
                        ]);
                    }
                },{
                    title: '推荐人级别',
                    key: 'referrerLevel',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.referrerLevel)
                        ]);
                    }
                },{
                    title: '推荐奖金',
                    key: 'amount',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amount)
                        ]);
                    }
                },{
                    title: '实际到账金额',
                    key: 'actualAmount',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.actualAmount)
                        ]);
                    }
                },{
                    title: '奖励时间',
                    key: 'createTime',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.createTime)
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
        this.getInitialList(util.searchList(this.search,'timeInterval'));
    },
    methods: {
        getInitialList(formData){ 
            this.table_loading = true;
            this.$axios.get('/fx?api=gate.order.refenrrerAmountListService',{params:formData}).then(res => {
                if(res!=500){
                    this.certifyList = res.list;
                    this.totalCount = res.page.totalCount;
                    this.pageNum = res.page.currentPage;
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
        }
    }
}
</script>
<style lang="less" scoped>
    #paymentIn /deep/ .ivu-table-row.ivu-table-row-hover{
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