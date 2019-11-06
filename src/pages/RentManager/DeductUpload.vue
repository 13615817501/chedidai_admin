<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
            <BreadcrumbItem>租金管理</BreadcrumbItem>
            <BreadcrumbItem>划扣上传列表</BreadcrumbItem>
        </Breadcrumb>
        <div class="search-box">
            <span>
                &nbsp;&nbsp;划扣时间: 
                <DatePicker type="daterange" v-model='search.timeInterval' placeholder="请选择" style="width: 200px"></DatePicker>
            </span>
            <span>
                &nbsp;&nbsp;外部订单号: 
                <Input v-model="search.orderNumExternal" clearable placeholder="请输入" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;银行名: 
                <Input v-model="search.bankName" clearable placeholder="请输入" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;银行账户: 
                <Input v-model="search.bankAccount" clearable placeholder="请输入" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;身份证号: 
                <Input v-model="search.identityCard" clearable placeholder="请输入" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;银行预留手机号: 
                <Input v-model="search.bankMobile" clearable placeholder="请输入" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;状态: 
                <Select v-model="search.status" style="width:120px" clearable>
                    <Option :value="0">上传失败</Option>
                    <Option :value="1"> 待合账</Option>
                    <Option :value="2">核算完成</Option>
                </Select>
            </span>
            <Button type="primary" icon="ios-search" style="margin-left:10px;" @click="searchList">搜索</Button>
            <Button type="primary" icon="ios-cloud-upload" style="margin-left:10px;margin-top:10px;vertical-align:baseline;" @click="downLoadExcel">上传</Button>
            <Button type="primary" style="margin-left:10px;margin-top:10px;vertical-align:baseline;" @click="consolidate">划扣合账</Button>
            <input style="display:none" type="file" id="file" ref="file" @change="changeFile"/>
        </div> 
        <div class="listadmin">
            <Table border :loading="table_loading" ref="selection" :columns="columns" :data="certifyList2" :height="adjustHeight"></Table>
        </div>
        <div style="text-align:center;margin-top:20px;">
            <Page :current="search.pageNum" :total="totalCount" :page-size="search.pageSize" @on-change="pageChange" show-total></Page>
        </div>
        <Modal v-model="modal" title="失败提示" :mask-closable="false" width="650" :closable="false">
            <div v-if="!certifyList.isSuccess">
                <div class="table-title" v-show="certifyList.notHaveUserList.length" >上传失败：不存在以下相关用户</div>
                <Table border :loading="table_loading" :columns="columns2" :data="certifyList.notHaveUserList" v-show="certifyList.notHaveUserList.length"></Table>
                <div class="table-title" v-show="certifyList.notHaveOrderList.length">上传失败：下列用户暂无相应订单信息</div>
                <Table border :loading="table_loading" :columns="columns2" :data="certifyList.notHaveOrderList" v-show="certifyList.notHaveOrderList.length"></Table>
            </div>
            <div slot="footer">
                <Button type="primary" @click="comfirmBtn">确定</Button>
            </div>
        </Modal>
        <Modal v-model="modal2" title="提示" :mask-closable="false" width="360" :closable="false">
            <div style="text-align:center">
                确定要划扣合资么？ 
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="comfirmBtn2">确定</Button>
                <Button @click="cancel">取消</Button>
            </div>
        </Modal>
        <CommonTipModal :modal="tipModal" @cancel="cancel" :modalTipTitle="modalTipTitle" @comfirmBtn="tipComfirmBtn" :item="item">
            <div style="text-align:center">
                <p>确定{{modalTipTitle}}吗?</p>
            </div>
        </CommonTipModal>
        <Modal class="modify-madal" v-model="modifyModal" title="修改" width="360" :mask-closable="false" @on-cancel="cancel">
            <div class="add-comm">
                <span class="item-comm required">外部订单ID：</span>
                <Input style="width:60%;" v-model="modify.orderNumExternal" placeholder="请输入..."/>
            </div>
            <div class="add-comm">
                <span class="item-comm required">银行卡号：</span>
                <Input  style="width:60%;" v-model="modify.bankCardNum" placeholder="请输入..."/>
            </div>
            <div class="add-comm">
                <span class="item-comm required">银行账户：</span>
                <Input  style="width:60%;" v-model="modify.bankAccount" placeholder="请输入..."/>
            </div>
            <div class="add-comm">
                <span class="item-comm required">身份证号：</span>
                <Input  style="width:60%;" v-model="modify.identityCard" placeholder="请输入..."/>
            </div>
            <div class="add-comm">
                <span class="item-comm required">银行预留手机号：</span>
                <Input  style="width:60%;" v-model="modify.bankMobile" type="textarea" placeholder="请输入..."/>
            </div>
            <div class="add-comm">
                <span class="item-comm required">金额：</span>
                <Input  style="width:60%;" v-model="modify.amount" type="textarea" placeholder="请输入..."/>
            </div> 
            <div class="add-comm">
                <span class="item-comm required">银行名：</span>
                <Input  style="width:60%;" v-model="modify.bankName" placeholder="请输入..."/>
            </div> 
            <div class="add-comm">
                <span class="item-comm">备注1：</span>
                <Input  style="width:60%;" v-model="modify.desp1" type="textarea" placeholder="请输入..."/>
            </div> 
            <div class="add-comm">
                <span class="item-comm">备注2：</span>
                <Input  style="width:60%;" v-model="modify.desp2" type="textarea" placeholder="请输入..."/>
            </div> 
            <div class="add-comm">
                <span class="item-comm">说明：</span>
                <Input  style="width:60%;" v-model="modify.description" type="textarea" placeholder="请输入..."/>
            </div> 
            <div class="add-comm">
                <span class="item-comm required">划扣状态：</span>
                <Select v-model="modify.deductStatus" style="width:60%;">
                    <Option :value="0">划扣失败</Option>
                    <Option :value="1"> 划扣成功</Option>
                </Select>
            </div>  
            <div class="add-comm">
                <span class="item-comm required">划扣时间：</span>
                <DatePicker v-model="modify.deductTime" type="date" placeholder="请选择" style="width:60%;" class="item-input"></DatePicker>
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading"  @click="modifyConfirmBtn">确定</Button>
                <Button @click="cancel">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import util from '@/util/util'
import moment from 'moment'
import ImgUpload from '@/components/ImgUpload' //公用的提示组件 
import CommonTipModal from '@/components/CommonTipModal' //公用的提示组件 
import { mapState } from 'vuex'
export default {
    name: 'CustomList',
    props:[],
    data () {
        return {
            totalCount: 0,
            table_loading: false, //默认先显示加载
            modal_loading:false,
            modal:false,
            modal2:false,
            modifyModal:false,
            tipModal:false,
            item:{},
            modalTipTitle:'删除该划扣记录',
            search:{
                timeInterval:'',
                orderNumExternal:'',
                bankName:'',
                bankAccount:'',
                identityCard:'',
                bankMobile:'',
                status:'',
                pageNum:1,
                pageSize:15
            },
             modify: {
                id:'',
                orderNumExternal: '',
                bankCardNum: '',
                bankAccount: '',
                identityCard: '',
                bankMobile: '',
                amount: '',
                bankName: '',
                desp1: '',
                desp2: '',
                description: '',
                deductStatus: '',
                deductTime: '',
                status:''
            },
            certifyList:{
                isSuccess: false,
                notHaveUserList:[],
                notHaveOrderList:[]
            },
            ids:[],
            certifyList2:[],
            oss: {}, //oss相关信息集合
            columns: [{
                    title: '操作',
                    key: 'action',
                    width: 140,
                    align: 'center',
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: params.row.status!=1
                                },
                                style: {
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                        this.modifyModal = true;
                                        this.modify = {...params.row};
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: params.row.status!=1
                                },
                                style: {
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '删除该划扣记录';
                                        this.item = params.row;
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }, {
                    title: '请选择',
                    key: 'status',
                    align: 'center',
                    minWidth:90,
                    render: (h, params) => {
                         return h('div', [
                            h('Checkbox', {
                                props: {
                                   value: false,
                                },
                                style:{
                                    display: params.row.status==1?'inline-block':'none'
                                },
                                on: {
                                    'input': (event) => {
                                        if(event){
                                            this.ids.push(params.row.id);
                                        }else{
                                            let myIndex = this.ids.indexOf(params.row.id);
                                            this.ids.splice(myIndex,1);
                                        }
                                    }
                                }
                            })
                        ]);
                    }
                },{
                    title: '外部订单号',
                    key: 'orderNumExternal',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.orderNumExternal)
                        ]);
                    }
                }, {
                    title: '划扣时间',
                    key: 'deductTime',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.deductTime)
                        ]);
                    }
                }, {
                    title: '银行名称',
                    key: 'bankName',
                    minWidth: 120,
                     render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankName)
                        ]);
                    }
                }, {
                    title: '银行卡号',
                    key: 'bankCardNum',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankCardNum)
                        ]);
                    }
                }, {
                    title: '银行账户',
                    key: 'bankAccount',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankAccount)
                        ]);
                    }
                }, {
                    title: '身份证',
                    key: 'identityCard',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.identityCard)
                        ]);
                    }
                }, {
                    title: '预留手机号码',
                    key: 'bankMobile',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankMobile)
                        ]);
                    }
                }, {
                    title: '划扣金额',
                    key: 'amount',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amount)
                        ]);
                    }
                }, {
                    title: '备注1',
                    key: 'desp1',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.desp1)
                        ]);
                    }
                }, {
                    title: '备注2',
                    key: 'desp2',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.desp2)
                        ]);
                    }
                }, {
                    title: '划扣状态',
                    key: 'deductStatus',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.deductStatus==0?'划扣失败':'划扣成功')
                        ]);
                    }
                }, {
                    title: '说明',
                    key: 'description',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.description)
                        ]);
                    }
                }, {
                    title: '状态',
                    key: 'status',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.status=='0'?'上传失败':params.row.status=='1'?'待合账':'核算完成')
                        ]);
                    }
                }
            ],
            columns2: [{
                    title: '外部订单号',
                    key: 'orderNumExternal',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.orderNumExternal)
                        ]);
                    }
                }, {
                    title: '划扣时间',
                    key: 'deductTime',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.deductTime)
                        ]);
                    }
                }, {
                    title: '银行名称',
                    key: 'bankName',
                    minWidth: 120,
                     render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankName)
                        ]);
                    }
                }, {
                    title: '银行卡号',
                    key: 'bankCardNum',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankCardNum)
                        ]);
                    }
                }, {
                    title: '银行账户',
                    key: 'bankAccount',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankAccount)
                        ]);
                    }
                }, {
                    title: '身份证',
                    key: 'identityCard',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.identityCard)
                        ]);
                    }
                }, {
                    title: '预留手机号码',
                    key: 'bankMobile',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.bankMobile)
                        ]);
                    }
                }, {
                    title: '划扣金额',
                    key: 'amount',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amount)
                        ]);
                    }
                }, {
                    title: '备注1',
                    key: 'desp1',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.desp1)
                        ]);
                    }
                }, {
                    title: '备注2',
                    key: 'desp2',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.desp2)
                        ]);
                    }
                }, {
                    title: '划扣状态',
                    key: 'deductStatus',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.deductStatus=='0'?'划扣失败':'划扣成功')
                        ]);
                    }
                }, {
                    title: '说明',
                    key: 'description',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.description)
                        ]);
                    }
                }, {
                    title: '状态',
                    key: 'status',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.status=='0'?'上传失败':params.row.status=='1'?'待合账':'核算完成')
                        ]);
                    }
                }
            ]
        }
    },
    components:{
        CommonTipModal
    }, 
    computed:{
        ...mapState(['adjustHeight']) 
    },
    activated(){
        this.getOSSInfo();
        this.getInitialList(util.searchList(this.search,'timeInterval'));
    },
    methods: {
        getOSSInfo(){ //获得OSS相关信息
            this.$axios.get('/fx?api=gate.base.ossUpload',{params:{type:11}}).then(res => {
                if(res!=500){
                    this.oss = res;     
                }
            })
        },
        random_string(len) {　　
            len = len || 32;　　
            var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';　　
            var maxPos = chars.length;　　
            var pwd = '';　　
            for (let i = 0; i < len; i++) {　　
                pwd += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        downLoadExcel(){
            this.$refs.file.value = null;
            let file = this.$refs.file;
            file.click();
        },
        cancel(){
            this.modal2 = false;
            this.modifyModal = false;
            this.tipModal = false;
        },
        changeFile(e){
            let { endpoint } = this.oss;
            let index1 = endpoint.indexOf('oss');
            let index2 = endpoint.indexOf('aliyuncs');
            let myEndpoint = endpoint.slice(index1,index2-1);
            let client = new OSS.Wrapper({
                region: myEndpoint,
                accessKeyId: this.oss.aki,
                accessKeySecret: this.oss.aks,
                stsToken: this.oss.sk,
                bucket: this.oss.bucketName,
                secure:true
            });
            let file = this.$refs.file.files[0];
            if(file){
                let reg = /\.xls$|\.xlsx$/i;
                if(!reg.test(file.name)){
                    let fileInput = this.$refs.file;
                    fileInput.value='';
                    return this.$Message.error('格式只支持xls，xlsx');
                }
                let random_name = this.random_string(6) + '_' + new Date().getTime() + '.' + file.name.split('.').pop();   // 随机命名
                client.multipartUpload(`${this.oss.dirPath}${random_name}`, file).then(result => {
                    let requestUrls = result.res.requestUrls[0];
                    let index1 = requestUrls.indexOf('uploadId');
                    let myUrl = result.url?result.url:requestUrls.slice(0,index1-1); //绝对地址
                    let myIndex = myUrl.indexOf('/img');
                    let ranUrl = myUrl.slice(myIndex+1);    //相对地址
                    this.uploadDeduction({url:ranUrl});
                }).catch(err => {
                    this.$Message.warning('文件上传出错');
                }); 
                
            }
        },
        searchList() {
            this.search.pageNum = 1;
            this.getInitialList(util.searchList(this.search,'timeInterval'));
        },
        pageChange(page){
            this.search.pageNum = page;
            this.getInitialList(util.searchList(this.search,'timeInterval'));
        },
        comfirmBtn(){
            this.modal = false;
        },
        uploadDeduction(formData){ 
            this.table_loading = true;
            this.$axios.post('/fx?api=gate.order.excle.uploadDeductionRecordService',formData).then(res => {
                if(res!=500){
                    this.certifyList = res;
                    if(!res.isSuccess){
                        this.modal = true;
                    }
                    this.getInitialList(util.searchList(this.search,'timeInterval'));
                }
                this.table_loading = false;
            })
        },
        getInitialList(formData){ 
            this.table_loading = true;
            this.$axios.get('/fx?api=gate.order.excle.deductUploadList',{params:formData}).then(res => {
                if(res!=500){
                    this.certifyList2 = res.list;
                    this.totalCount = res.page.totalCount;
                    this.search.pageNum = res.page.currentPage;
                    this.$store.commit('change_height');
                }
                this.table_loading = false;
            })
        },
        consolidate(){
            this.modal2 = true;
        },
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.getInitialList(util.searchList(this.search,'timeInterval'));
            }
        },
        comfirmBtn2(){
            if(!this.ids.length){
                return this.$Message.error('请选择至少一条数据');
            }
            this.modal_loading = true;
            this.$axios.post('/fx?api=gate.consolidation',{ids:String(this.ids)}).then(res => {
                if(res!=500){
                    this.$Message.success('合账成功');
                    this.ids = [];
                    this.getInitialList(util.searchList(this.search,'timeInterval'));
                }
                this.modal_loading = false;
                this.modal2 = false;
            })
        },
        modifyConfirmBtn(){
            for (let key in this.modify) {
                if(!this.modify[key] && (key!='desp1' && key!='desp2'&& key!='description')){
                    if(key!='deductStatus'){
                        return this.$Message.error('带 * 为必填项');
                    }
                }
            }
            let formData = {...this.modify};
            formData.deductTime = formData.deductTime?moment(formData.deductTime).format("YYYY-MM-DD HH:mm:ss"):'';
            this.modal_loading = true;
            this.$axios.post('/fx?api=gate.order.excle.updateDeductUpload',formData).then(res => {
                if(res!=500){
                    this.$Message.success('修改成功');
                    this.getInitialList(util.searchList(this.search,'timeInterval'));
                }
                this.modal_loading = false;
                this.modifyModal = false;
            })
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
        width: 100px; 
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
    .table-title{
        margin-bottom: 10px;
        color: red;
        font-size: 14px;
    }
    .modify-madal /deep/ .ivu-modal-body{
        padding-left: 30px;
    }
    .add-comm{
        margin-bottom: 10px;
    }
</style>