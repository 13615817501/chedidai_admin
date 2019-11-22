<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
            <BreadcrumbItem>放款管理</BreadcrumbItem>
            <BreadcrumbItem>划扣失败反馈</BreadcrumbItem>
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
        <Modal width="280" v-model="modifyModal" title="划扣" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">
                    <span class="item-comm required" style="width:60px;">首款金额：</span><Select v-model="modify.flag" placeholder="请选择" style="width: 150px">
                            <Option :value="1">成功</Option>
                            <Option :value="3">失败</Option>
                        </Select>
                </div>
                <div class="item-div" v-show="modify.flag==1">
                    <span class="item-comm required" style="width:60px;">划扣金额：</span><Input v-model.trim="modify.amount" clearable placeholder="请输入划扣金额" style="width: 150px"></Input>
                </div>
                <div class="item-div">
                    <span class="item-comm" style="width:60px;">失败原因：</span><Input v-model="modify.msg" clearable placeholder="请输入失败原因" style="width: 150px"></Input>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <ModalPic :modal="modalPreview" :bigimg="bigimg" @cancel="cancel"></ModalPic>
    </div>
</template>
<script>
import util from '@/util/util'
import CommonTipModal from '@/components/CommonTipModal' //公用的提示组件 
import ImgUpload from '@/components/ImgUpload' //公用的提示组件 
import ModalPic from '@/components/ModalPic' //公用的提示组件 
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
                flag: 1,
                amount: '',
                msg: ''
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
                                        this.modifyModal = true;
                                        this.orderId = params.row.orderId;
                                        this.modify = {
                                            flag: 1,
                                            amount: '',
                                            msg: ''
                                        }
                                    }
                                }
                            }, '划扣'),
                        ]);
                    }
                },{
                    title: '账单详情',
                    key: 'action',
                    minWidth: 100,
                    fixed: "left",
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
                                        this.$router.push({name:'LoanDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'DeductFailFeedbackList'}});
                                    }
                                }
                            }, '详情'),
                        ]);
                    }
                }, {
                    title: '订单号',
                    key: 'orderNumber',
                    className:'hoverBlue',
                    minWidth: 160,
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
                            h('strong', {
                                on: {
                                    click: () => {
                                        this.$router.push({name:'ProcessDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'DeductFailFeedbackList'}});  
                                    }
                                }
                            }, params.row.orderNumber)
                        ]);
                    }
                }, {
                    title: '产品名称',
                    key: 'prodName',
                    minWidth: 160,
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.prodName)
                        ]);
                    }
                },{
                    title: '用户姓名',
                    key: 'userName',
                    minWidth: 100,
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userName)
                        ]);
                    }
                }, {
                    title: '身份证号',
                    key: 'identityCard',
                    minWidth: 160,
                     render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.identityCard)
                        ]);
                    }
                },{
                    title: '手机号码',
                    key: 'userMobile',
                    minWidth: 120,
                     render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userMobile)
                        ]);
                    }
                },{
                    title: '银行分行号',
                    key: 'bankName',
                    minWidth: 170,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankName)
                        ]);
                    }
                }, {
                    title: '银行卡号',
                    key: 'bankCardNum',
                    minWidth: 170,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankCardNum)
                        ]);
                    }
                }, {
                    title: '门店名',
                    key: 'storeName',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.storeName)
                        ]);
                    }
                }, {
                    title: '贷款金额',
                    key: 'amount',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amount)
                        ]);
                    }
                }, {
                    title: '首款金额(元)',
                    key: 'firstLoanAmount',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.firstLoanAmount)
                        ]);
                    }
                }, {
                    title: '需要划扣金额(元)',
                    key: 'deductAmount',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.deductAmount)
                        ]);
                    }
                },{
                    title: '划扣状态',
                    key: 'deductStatus',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.deductStatus==0?'待划扣':params.row.deductStatus==1?'成功':params.row.deductStatus==2?`门店处理失败反馈 (${params.row.deductFailReason})`:params.row.deductStatus==3?`失败反馈门店 (${params.row.deductFailReason})`:'')
                        ]);
                    }
                },{
                    title: '反馈时间',
                    key: 'feedbackTime',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.feedbackTime)
                        ]);
                    }
                },{
                    title: '反馈说明',
                    key: 'content',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.content)
                        ]);
                    }
                },{
                    title: '图片',
                    key: 'imgs',
                    minWidth: 250,
                    render: (h, params) => {
                        let arr = []
                        params.row.imgs.forEach( (item, index) => {
                            arr.push(h('img', {
                                domProps: {
                                    src: item.v,
                                },
                                slot: "content",
                                style: {
                                    width: "50px",
                                    height: '50px',
                                    'vertical-align': 'middle',
                                    margin: '5px',
                                    cursor:"pointer"
                                },
                                on: {
                                    click: () => {
                                        if(item.v){
                                            this.clickFaceImg(item.v);
                                        }
                                    }
                                }
                            }, ''));
                        });
                        return h('div', arr);
                    }
                },{
                    title: '订单状态',
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
    components:{
        CommonTipModal,
        ImgUpload,
        ModalPic
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
            this.$axios.get('/fx?api=gate.order.admin.deductFeedbackList',{params:formData}).then(res => {
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
            if(this.modify.flag == 1 && !this.modify.amount){
                return this.$Message.error('带 * 为必填项');
            }
            let formData = {...this.modify};
            formData.orderId = this.orderId;
            this.modal_loading = true;
            this.$axios.get('/fx?api=gate.order.admin.deducted',{params:formData}).then(res => {
                if(res!=500){
                    this.$Message.success('操作成功');
                    this.getInitialList(util.searchList(this.search,'timeInterval'));
                }
                this.modal_loading = false;
                this.modifyModal = false;
            })
        },
        cancel(){
            this.tipModal = false;
            this.modifyModal = false;
            this.modalPreview = false;
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