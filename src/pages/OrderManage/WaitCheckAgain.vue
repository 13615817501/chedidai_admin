<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>订单管理</BreadcrumbItem>
	        <BreadcrumbItem>待复审订单</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                GPS校验时间: 
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
        <ChooseReason :title="title" :orderId="orderId" :modal="passModal" :ModalContent="ModalContent" @get-status="confirmBtn5" @cancel="cancel"></ChooseReason> 
        <Modal width="400" v-model="backModal" :title="backModalTitle" :mask-closable="false"> 
            <span class="item-comm required">填写理由：</span><Input style="margin-top:10px;" v-model.trim="msg" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入..." />
            <div style="margin:10px 0;">上传附件：<ImgUpload style="margin-top:5px;" :type="11" class="imgUpload" :myUploadList="myUploadList" :myUploadList2="myUploadList2" @changePicUrl="changePicUrl"></ImgUpload></div>
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
import ChooseReason from '@/components/ChooseReason'  
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
            backModalTitle:'退回门店',
            myTitle:'新增产品',
            myTitle2:'退回该复审到合同',
            myUploadList:[],
            myUploadList2:[],
            attachment:[], //附件大集合
            item:{},
            bigimg:'',
            bannerPic:'',
            backModal:false,
            msg:'',
            modalPreview:false,
            modal_loading:false,
            storeNames:[],
            id:'',
            title:'',
            orderId:'',
            ModalContent:'',
            passModal: false,
			prodList:[], //产品列表
            search: {
                timeType: 7,
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
                    width: 180,
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
                                    'margin':'10px 10px 0 0',
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '通过该复审订单';
                                        this.item = params.row;
                                    }
                                }
                            }, '通过'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    
                                },
                                style: {
                                    'margin':'10px 10px 0 0',
                                },
                                on: {
                                    click: () => {
                                        this.msg = '';
                                        this.attachment = [];
                                        this.myUploadList = [];
                                        this.myUploadList2 = [];
                                        this.backModal = true;
                                        this.myTitle2 = '退回该复审订单到退回门店';
                                        this.backModalTitle = '退回门店';
                                        this.orderId = params.row.orderId;
                                    }
                                }
                            }, '退回门店'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    
                                },
                                style: {
                                    'margin':'10px 10px 10px 0',
                                },
                                on: {
                                    click: () => {
                                        this.passModal = true;
                                        this.title = '待复审拒绝';
                                        this.orderId = params.row.orderId;
                                    }
                                }
                            }, '拒绝'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    
                                },
                                style: {
                                    'margin':'10px 10px 10px 0',
                                },
                                on: {
                                    click: () => {
                                        this.msg = '';
                                        this.attachment = [];
                                        this.myUploadList = [];
                                        this.myUploadList2 = [];
                                        this.backModal = true;
                                        this.myTitle2 = '退回该复审到合同';
                                        this.backModalTitle = '退回合同';
                                        this.orderId = params.row.orderId;
                                    }
                                }
                            }, '退回合同')
                            
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
                                        this.$router.push({name:'ProcessDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'WaitCheckAgain'}});  
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
                    title: '申请时间',
                    key: 'createTime',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.createTime)
                        ]);
                    }
                }, {
                    title: 'GPS确定人员',
                    key: 'gpsSettingStaff',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.gpsSettingStaff)
                        ]);
                    }
                },{
                    title: 'GPS确定时间',
                    key: 'gpsSettingTime',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.gpsSettingTime)
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
                }
			]
		}
	},
    components:{
        CommonTipModal,
        ImgUpload,
        ChooseReason
    }, 
	computed:{
        ...mapState(['adjustHeight']) 
    },
	activated(){
        this.getRefuseReasonList();
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
        confirmBtn2(){
            if(!this.msg){
               return this.$Message.warning('请填写退回理由');
            }
            let formData = {};
            formData.orderId = this.orderId;
            let myUrl = '';
            if(this.myTitle2 == '退回该复审到合同'){
                myUrl = '/fx?api=gate.order.admin.checkAgainBackContract';
                formData.msg = this.msg;
                formData.attachment = String(this.attachment);
            }else if(this.myTitle2 == '拒绝该复审订单'){
                myUrl = '/fx?api=gate.order.admin.checkAgainRefuse';
                formData.content = this.msg;
            }else{
                myUrl = '/fx?api=gate.order.admin.checkAgainBack';
                formData.msg = this.msg;
                formData.attachment = String(this.attachment);
            }
            this.$axios.post(myUrl,formData).then(res => {
                if(res!=500){
                    this.$Message.success('操作成功');
                    this.getInitialList(util.searchList(this.search,'timeInterval'));
                }
            })
            this.backModal = false;
        },
		getInitialList(formData){ 
            this.table_loading = true;
		    this.$axios.get('/fx?api=gate.order.admin.waitCheckAgainList',{params:formData}).then(res => {
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
        confirmBtn5(num){
            if(num!=500){
                this.$Message.success('操作成功');
                this.getInitialList(util.searchList(this.search,'timeInterval'));
            }
            this.passModal = false;
        },
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
        cancel(){
            this.tipModal = false;
            this.modifyModal = false;
            this.backModal = false;
            this.passModal = false;
        },
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.getInitialList(util.searchList(this.search,'timeInterval'));
            }
        },
        changePicUrl(...arr){
            this.attachment = arr[0];
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