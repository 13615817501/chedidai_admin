<template>
    <div id="paymentOut" class="common-id">
        <Breadcrumb>
            <BreadcrumbItem>财务管理</BreadcrumbItem>
            <BreadcrumbItem>出账列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="search-box">
            <span>
                &nbsp;&nbsp;出账时间: 
                <DatePicker type="daterange" v-model='search.timeInterval' placeholder="请选择" style="width: 200px"></DatePicker>
            </span>
            <Button type="primary" icon="ios-search" style="margin-left:10px;" @click="searchList">搜索</Button>
        </div> 
        <div class="listadmin">
            <Table border :columns="columns" :data="certifyList" :height="adjustHeight"></Table>
        </div>
        <div style="text-align:center;margin-top:20px;">
            <Page :current = "pageNum" :total="totalCount" :page-size="search.pageSize" @on-change="pageChange" show-total></Page>
        </div>
    </div>
</template>
<script>
import util from '@/util/util'
import { mapState } from 'vuex'
export default {
    name: 'PaymentOut',
    props:[],
    data () {
        return {
            pageNum: 1,
            totalCount: 0,
            table_loading: false, //默认先显示加载
            certifyList:[],
            search: {
                pageSize: 15,
                timeInterval:''
            },
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
                    title: '用户手机号',
                    key: 'userMobile',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userMobile)
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
                },{
                    title: '金额',
                    key: 'amount',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amount)
                        ]);
                    }
                },{
                    title: '类型',
                    key: 'typeCh',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.typeCh)
                        ]);
                    }
                },{
                    title: '方式',
                    key: 'payMethodCh',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.payMethodCh)
                        ]);
                    }
                },{
                    title: '状态',
                    key: 'statusCh',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.statusCh)
                        ]);
                    }
                },{
                    title: '操作员',
                    key: 'staffCh',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.staffCh)
                        ]);
                    }
                },{
                    title: '出账时间',
                    key: 'createTime',
                    minWidth: 160,
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
            this.$axios.get('/fx?api=gate.order.payMentOutList',{params:formData}).then(res => {
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
    #paymentOut /deep/ .ivu-table-row.ivu-table-row-hover{
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