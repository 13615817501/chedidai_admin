<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
            <BreadcrumbItem>订单管理</BreadcrumbItem>
            <BreadcrumbItem>贷后认领</BreadcrumbItem>
        </Breadcrumb>
        <div class="search-box">
            <span>
                gps安装时间: 
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
            modalTipTitle:'认领该贷后',
            tipModal:false,
            myTitle:'新增产品',
            title:'待门店处理拒绝',
            passModal: false,
            ModalContent:[],
            item:{},
            orderId:'',
            prodList:[], //产品列表集合
            search:{
                timeType:8,
                timeInterval:'',
                orderNumber: '',
                prodId:'',
                mobile: '',
                name: '',
                pageNum: 1,
                pageSize:15
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
                                    
                                },
                                style: {
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '认领该贷后';
                                        this.item = params.row;
                                    }
                                }
                            }, '认领')
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
                                        this.$router.push({name:'ProcessDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'WaitClaimCollect'}});  
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
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userMobile)
                        ]);
                    }
                }, {
                    title: '门店名',
                    key: 'storeName ',
                    minWidth: 100,
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
                    title: '申请时间',
                    key: 'createTime',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.createTime)
                        ]);
                    }
                }, {
                    title: 'gps安装人员',
                    key: 'mortgagedStaff',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.mortgagedStaff)
                        ]);
                    }
                },  {
                    title: 'gps安装时间',
                    key: 'mortgagedTime',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.mortgagedTime)
                        ]);
                    }
                }
            ]
        }
    },
    components:{
        CommonTipModal,
        ImgUpload,
    }, 
    computed:{
        ...mapState(['adjustHeight']) 
    },
    activated(){
        this.getInitialList(util.searchList(this.search,'timeInterval'));
        this.getRefuseReasonList();
    },
    watch:{
       '$route'(to,from){
           if(from.name=='WaitStoreDetail'){
               this.search.pageNum = this.$route.query.pageNum;
               this.getInitialList(util.searchList(this.search,'timeInterval'));
           }
       }
    },
    methods: {
        getRefuseReasonList(){
            this.$axios.get('/fx?api=gate.base.menus',{params:{nerg:5}}).then(res => {
                if(res!=500){
                    this.ModalContent = [];
                    res.hub.forEach( (item, index) => {
                        this.ModalContent.push(item.v);
                    });
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
        getInitialList(formData){ 
            this.table_loading = true;
            this.$axios.get('/fx?api=gate.order.admin.claimGpsCheckList',{params:formData}).then(res => {
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
        confirmBtn(num){
            if(num!=500){
                this.$Message.success('操作成功');
               this.getInitialList(util.searchList(this.search,'timeInterval'));
            }
            this.passModal = false;
        },
        cancel(){
            this.tipModal = false;
            this.modifyModal = false;
            this.passModal = false;
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
    .single-info span{
        display: inline-block;
        width: 33%;
    }
    .replenish-info span{
        display: inline-block;
        width: 50%;
    }
    .name1-box,.name2-box{
        height:400px;
        overflow-y: scroll;
    }
    .contact-info span{
        display: inline-block;
        width: 20%;
    }
    .original-img{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        span{
            display: inline-block;
            width: 25%;
            margin: 0 4% ;
        }
    }
    .original-img img{
        display: inline-block;
        max-width: 100%;
    }
</style>