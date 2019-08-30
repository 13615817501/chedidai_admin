<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>订单管理</BreadcrumbItem>
            <BreadcrumbItem>{{myName2}}</BreadcrumbItem>
	        <BreadcrumbItem>详情</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <Button type="primary" @click="backBtn"><Icon type="ios-arrow-back"/>返回</Button>
        </div> 
	    <div class="listadmin" :style="{height:adjustHeight+120+'px',overflow:'auto'}">
            <div style="display:inline-block;vertical-align:top;">
                <table border="1" style="border-color:#ddd;text-align:center;line-height:38px;" cellspacing="1">
                    <tbody>
                        <tr><td>客户姓名：{{certifyList.userName}}</td><td>客户电话：{{certifyList.userMobile}}</td><td>合同金额：{{certifyList.amount}}</td><td> <Button type="primary" size="small" style="margin:0 10px;" @click="custominfoBtn">客户认证信息</Button></td></tr>
                        <tr><td colspan="2">贷款车辆：{{certifyList.autoModelName}}</td><td><Button type="primary" size="small"  style="margin:0 10px;" @click="modifyCarInfoBtn" v-if="$route.query.name=='WaitAuditingList'">修改车型</Button></td><td><Button type="primary" size="small"  style="margin:0 10px;" @click="carinfoBtn">车辆认证信息</Button></td></tr>
                        <tr><td>产品：{{certifyList.prodName}}</td><td>贷款期数：{{certifyList.periods}}</td><td>还款方式：{{certifyList.type=='1'?'先息后本':certifyList.type=='2'?'等额本息':'等本等息'}}</td><td> <Button type="primary" size="small"  style="margin:0 10px;" @click="commoninfoBtn">认证信息</Button></td></tr>
                        <tr><td>门店编码：{{certifyList.storeNum}}</td><td>门店客服：{{certifyList.storeCt}}</td><td>门店电话：{{certifyList.storeCtm}}</td><td><Button type="primary" size="small"  style="margin:0 10px;" @click="deviceinfoBtn">设备管理</Button></td></tr>
                        <tr><td colspan="3">门店地址：{{certifyList.storeAd}}</td><td><Button type="primary" size="small"  style="margin:0 10px;" v-if="certifyList.contractButton" @click="contractinfoBtn">合同信息</Button></td></tr>
                    </tbody>
                </table>  
                <div style="margin-top:15px;" v-if="$route.query.name=='WaitStoreList'|| $route.query.name=='WaitConfirmList'">
                    <div style="margin-top:15px;">
                        <p v-if="$route.query.name=='WaitStoreList'">
                            <span class="yajin">年检押金(元)：</span>
                            <Input class="item-input" :class="{txt:!isModify1}" :readonly='!isModify1' v-model="modify.annualInspectionDeposit" style="width: 100px" :placeholder="isModify1?'请输入...':''" />
                            <Button type="primary" size="small"  style="margin:0 10px;" @click="savaYajinBtn('年检押金')">{{isModify1?'保存':'修改'}}</Button>
                        </p>    
                        <p v-if="$route.query.name=='WaitStoreList'">
                        <span class="yajin">违章押金(元)：</span>
                            <Input class="item-input" :class="{txt:!isModify2}" :readonly='!isModify2' v-model="modify.trafficDeposit" style="width: 100px" :placeholder="isModify2?'请输入...':''" />
                            <Button type="primary" size="small"  style="margin:0 10px;" @click="savaYajinBtn('违章押金')">{{isModify2?'保存':'修改'}}</Button>
                        </p>   
                        <p>
                            <span class="yajin">综合服务费(元)：</span>
                            <Input class="item-input" :class="{txt:!isModify3}" :readonly='!isModify3' v-model="modify.serviceFee" style="width: 100px" :placeholder="isModify3?'请输入...':''" />
                            <Button type="primary" size="small"  style="margin:0 10px;" @click="savaYajinBtn('服务费')">{{isModify3?'保存':'修改'}}</Button>
                        </p>  
                    </div>
                </div> 
                <div style="margin-top:15px;" v-if="$route.query.name=='WaitAuditingList'">
                    <Button type="primary" size="small" @click="openMoneyModal">修改合同金额</Button>
                </div>
                <div style="margin-top:15px;">
                    <p>Actual Amount：{{certifyList.actualAmount}}</p>   
                </div> 
                <div style="margin-top:15px;">
                    <p>核保状态：{{certifyList.underwritedStatus==0?'未核保':certifyList.underwritedStatus==1?'成功':certifyList.underwritedStatus==2?'已发起核保':'失败'}}<Button style="margin-left:10px;" v-if="certifyList.isUnderwrited" type="primary" size="small" @click="passStatus">操作</Button></p>
                    <p v-if="certifyList.underwritedStatus">核保时间：{{certifyList.underwritedTime}}</p>    
                    <p v-if="certifyList.underwritedStatus">核保操作员：{{certifyList.underwritedStaff}}</p>    
                </div>
                <div style="margin-top:15px;">
                    <p>订单资料状态：{{certifyList.fileCollectStatus==0?'待寄回':certifyList.fileCollectStatus==1?'已寄回':''}}</p>
                </div>
                <span class="span-width" v-if="$route.query.name=='WaitConfirmList'"><span style="display:inline-block;">车辆评估报告：</span><ImgUpload :type="5" class="imgUpload display-before" :myPicUrl="myimgs1" @changePicUrl="changePicUrl"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="saveCarReportBtn">保存</Button><Button style="margin-left:8px;" type="primary" size="small" :loading="carImgloading" @click="downLoadimgCar">生成车辆评估报告</Button><Button style="margin-left:8px;" type="primary" size="small" @click="previewImgCar">预览车辆评估报告</Button></span>
                <span class="span-width" v-if="$route.query.name!='WaitConfirmList' && myimgs1">车辆评估报告：<viewer class="viewer-span" :images="myimgs1?myimgs1.split(' '):[]"><img class="my-img" style="margin:0 15px;" :src="myimgs1" alt="车辆评估报告"></viewer></span>
            </div>
            <span style="display:inline-block;margin-left:100px;">
                <Timeline>
                    <TimelineItem :color="certifyList.applyBlock?'blue':'#ccc'">
                        <p class="time" :style="{color:certifyList.applyBlock?'#2d8cf0':'#515a6e'}">申请订单</p>
                        <template v-if="certifyList.applyBlock">
                        <p class="content">申请时间：{{certifyList.applyBlock.time}}</p>
                        </template>
                    </TimelineItem> 
                    <TimelineItem :color="certifyList.storeBlock?'blue':'#ccc'">
                        <p class="time" :style="{color:certifyList.storeBlock?'#2d8cf0':'#515a6e'}">门店审核通过</p>
                        <template v-if="certifyList.storeBlock">
                        <p class="content">通过时间：{{certifyList.storeBlock.time}}</p>
                        <p class="content">操作员：{{certifyList.storeBlock.staff}}</p>
                        </template>
                    </TimelineItem> 
                    <TimelineItem :color="certifyList.checkBlock?'blue':'#ccc'">
                        <p class="time" :style="{color:certifyList.checkBlock?'#2d8cf0':'#515a6e'}">初审通过</p>
                        <template v-if="certifyList.checkBlock">
                        <p class="content">初审通过时间：{{certifyList.checkBlock.time}}</p>
                        <p class="content">操作员：{{certifyList.checkBlock.staff}}</p>
                        </template>
                    </TimelineItem> 
                    <TimelineItem :color="certifyList.confirmBlock?'blue':'#ccc'">
                        <p class="time" :style="{color:certifyList.confirmBlock?'#2d8cf0':'#515a6e'}">确认金额</p>
                        <template v-if="certifyList.confirmBlock">
                        <p class="content">确认时间：{{certifyList.confirmBlock.time}}</p>
                        </template>
                    </TimelineItem> 
                    <TimelineItem :color="certifyList.underwritingBlock?'blue':'#ccc'">
                        <p class="time" :style="{color:certifyList.underwritingBlock?'#2d8cf0':'#515a6e'}">发起核保</p>
                        <template v-if="certifyList.underwritingBlock">
                        <p class="content">发起核保时间：{{certifyList.underwritingBlock.time}}</p>
                        <p class="content">操作员：{{certifyList.underwritingBlock.staff}}</p>
                        </template>
                    </TimelineItem> 
                    <TimelineItem :color="certifyList.contractBlock?'blue':'#ccc'">
                        <p class="time" :style="{color:certifyList.contractBlock?'#2d8cf0':'#515a6e'}">合同签署</p>
                        <template v-if="certifyList.contractBlock">
                        <p class="content">签署时间：{{certifyList.contractBlock.time}}</p>
                        <p class="content">操作员：{{certifyList.contractBlock.staff}}</p>
                        </template>
                    </TimelineItem> 
                    <TimelineItem :color="certifyList.gpsBlock?'blue':'#ccc'">
                        <p class="time" :style="{color:certifyList.gpsBlock?'#2d8cf0':'#515a6e'}">GPS抵押</p>
                        <template v-if="certifyList.gpsBlock">
                        <p class="content">GPS校验时间：{{certifyList.gpsBlock.time}}</p>
                        <p class="content">GPS校验员：{{certifyList.gpsBlock.staff}}</p>
                        <p class="content">GPS安装时间：{{certifyList.gpsBlock.mortgagedTime}}</p>
                        <p class="content">GPS安装操作员：{{certifyList.gpsBlock.mortgagedStaff}}</p>
                        </template>
                    </TimelineItem> 
                    <TimelineItem :color="certifyList.checkAgainBlock?'blue':'#ccc'">
                        <p class="time" :style="{color:certifyList.checkAgainBlock?'#2d8cf0':'#515a6e'}">复审通过</p>
                        <template v-if="certifyList.checkAgainBlock">
                        <p class="content">复审通过时间：{{certifyList.checkAgainBlock.time}}</p>
                        <p class="content">操作员：{{certifyList.checkAgainBlock.staff}}</p>
                        </template>
                    </TimelineItem>
                </Timeline>
            </span>
            <div style="margin-bottom:15px;">
                <Button v-if="$route.query.name!='OrderList' && $route.query.name!='StoreOrderList'" type="primary" icon="md-add" style="margin:15px 0;" @click="addBtn">新增订单备注</Button>
                <Table border :columns="columns2" :data="certifyList2"></Table>
            </div>
        </div>
        <Modal width="380" v-model="modifyModal2" title="修改车型" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">
                    <span class="item-comm required" style="width:100px;">车型：</span><Select style="width:200px;" v-model="modifyCar.modelId">
                        <Option v-for="item in carList" :value="item.model_id" :key="item.model_id">{{item.model_name}}</Option>
                    </Select>
                </div>
                <div class="item-div">
                    <span class="item-comm required" style="width:100px;">首次上牌时间：</span><DatePicker style="width:200px;" type="month" v-model.trim="modifyCar.regDate" placeholder="请选择"></DatePicker>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <Modal width="380" v-model="modifyMoneyModal" title="修改合同金额" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">
                    <span class="item-comm required" style="width:120px;">调整后的金额(元)：</span><Input v-model.trim="modifyMoney.amount" clearable placeholder="请输入划扣金额" style="width: 150px"></Input>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="modifyMoneyBtn">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <Modal width="380" v-model="addModal" title="新增订单备注" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">
                    <span class="item-comm required" style="width:120px;">备注：</span><Input style="margin-top:10px;" v-model.trim="remark" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入..." />
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="addConfirmBtn">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <CommonTipModal :modal="tipModal" @cancel="cancel" :modalTipTitle="modalTipTitle" @comfirmBtn="tipComfirmBtn" :item="item">
            <div style="text-align:center">
                <p>确定{{modalTipTitle}}吗?</p>
            </div>
        </CommonTipModal>
        <Modal width="280" v-model="isPassModal" title="核保状态" :mask-closable="false"> 
            核保状态：</span><Select v-model="isPass" placeholder="请选择" style="width: 150px">
                        <Option :value="1">通过</Option>
                        <Option :value="3">失败</Option>
                    </Select>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn3">确定</Button>
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
            isPassModal:false,
            isPass:1,
            orderId: this.$route.query.orderId,
			certifyList:{},
            carList:{}, //车辆信息对象
            modalTipTitle:'',
            modifyModal2:false,
            tipModal:false,
            item:{},
            carImgloading:false,
            addModal:false,
            modifyMoneyModal:false,
            modal_loading:false,
            remark:'',
            prodId:'',
            autoId:'',
            myimgs1:'', //绝对地址
            myimgs11:'', //相对地址
            modelIdArr:[],
            dataObject:[],
            modifyMoney:{
                amount:''
            },
            modify:{
                annualInspectionDeposit:'',
                trafficDeposit:'',
                serviceFee:''
            },
            modifyCar:{
                modelId:'',
                regDate:''
            },
            certifyList2:[],
            columns2: [{
                    title: '操作',
                    key: 'action',
                    width: 90,
                    align: 'center',
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '删除该订单备注';
                                        this.item = params.row;
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                },{
                    title: '操作员',
                    key: 'staff',
                    minWidth: 50,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.staff)
                        ]);
                    }
                },{
                    title: '订单状态',
                    key: 'orderStatus',
                    minWidth: 50,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.orderStatus)
                        ]);
                    }
                },{
                    title: '备注信息',
                    key: 'remark',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.remark)
                        ]);
                    }
                },{
                    title: '创建时间',
                    key: 'createTime',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.createTime)
                        ]);
                    }
                }
            ],
            isModify1:false,
            isModify2:false,
            isModify3:false
		}
	},
    components:{
        CommonTipModal,
        ImgUpload
    }, 
	computed:{
        ...mapState(['adjustHeight']),
        myName2(){
            switch (this.$route.query.name) {
                case 'OrderList':
                    return '订单列表';
                    break;
                case 'StoreOrderList':
                    return '门店订单列表';
                    break;
                case 'WaitClaimStore':
                    return '门店认领';
                    break;
                case 'WaitStoreList':
                    return '待门店处理';
                    break;
                case 'WaitClaimCheck':
                    return '初审认领';
                    break;
                case 'WaitAuditingList':
                    return '待初审订单';
                    break;
                case 'WaitConfirmList':
                    return '待确认订单';
                    break;
                case 'SignContract':
                    return '签署合同';
                    break;
                case 'GPSInstall':
                    return '待GPS安装';
                    break;
                case 'WaitClaimCollect':
                    return '贷后认领';
                    break;
                case 'GPSCheck':
                    return '待GPS校验';
                    break;
                case 'WaitClaimCheckAgain':
                    return '待复审认领';
                    break;
                case 'WaitCheckAgain':
                    return '待复审订单';
                    break;  
                case 'WaitUnderwriting':
                    return '待发起核保';
                    break;          
             } 
        }
    },
	activated(){
        this.getInitialList({orderId:this.$route.query.orderId});
        this.getRemarkList({orderId:this.$route.query.orderId});
	},
	methods: {
        getRemarkList(formData){
            this.$axios.get('/fx?api=gate.order.admin.remarkList',{params:formData}).then(res => {
                if(res!=500){
                    this.certifyList2 = res.list;
                }
            })
        },
        getCarDetail(autoRepositoryId){
            this.$axios.get('/fx?api=gate.order.auto.model.query',{params:{autoRepositoryId:autoRepositoryId}}).then(res => {
                if(res!=500){
                    this.modifyCar.modelId = res.modelId;
                    this.modifyCar.regDate = res.regDate;
                    this.carList = res.models;
                }
            })
        },
		getInitialList(formData){ 
		    this.$axios.get('/fx?api=gate.order.admin.detail',{params:formData}).then(res => {
		    	if(res!=500){
                    this.certifyList = res;
                    this.modify = {
                        annualInspectionDeposit: res.annualInspectionDeposit,
                        trafficDeposit:res.trafficDeposit,
                        serviceFee:res.serviceFee
                    }
                    this.myimgs1 = res.autoReportImgValue;
                    this.myimgs11 = res.autoReportImg;
                    this.prodId = res.prodId;
                    this.autoRepositoryId = res.autoId;
                    if(this.$route.query.name=='WaitAuditingList'){
                        this.getCarDetail(res.autoId);
                    }
			        this.$store.commit('change_height');
		    	}
			})
		},
        backBtn(){
            this.$router.push({name:this.$route.query.name,query:{pageNum:this.$route.query.pageNum}});
        },
        custominfoBtn(){  //客户认证信息
            this.$router.push({name:'WaitStoreDetail',query:{pageNum:this.$route.query.pageNum,name:'ProcessDetail',userId:this.certifyList.userId,autoId:this.certifyList.autoId,activedName:'name1',orderId:this.$route.query.orderId,name2:this.$route.query.name}});
        }, 
        carinfoBtn(){  //车辆认证信息
            this.$router.push({name:'WaitStoreDetail',query:{pageNum:this.$route.query.pageNum,name:'ProcessDetail',userId:this.certifyList.userId,autoId:this.certifyList.autoId,activedName:'name2',orderId:this.$route.query.orderId,name2:this.$route.query.name}});
        }, 
        commoninfoBtn(){  //认证信息
            this.$router.push({name:'WaitStoreDetail',query:{pageNum:this.$route.query.pageNum,name:'ProcessDetail',userId:this.certifyList.userId,autoId:this.certifyList.autoId,activedName:'name3',orderId:this.$route.query.orderId,name2:this.$route.query.name}});
        }, 
        deviceinfoBtn(){  //设备信息
            this.$router.push({name:'WaitStoreDetail',query:{pageNum:this.$route.query.pageNum,name:'ProcessDetail',userId:this.certifyList.userId,autoId:this.certifyList.autoId,activedName:'name5',orderId:this.$route.query.orderId,name2:this.$route.query.name}});
        },
        contractinfoBtn(){  //合同信息
            this.$router.push({name:'WaitStoreDetail',query:{pageNum:this.$route.query.pageNum,name:'ProcessDetail',userId:this.certifyList.userId,autoId:this.certifyList.autoId,activedName:'name4',orderId:this.$route.query.orderId,name2:this.$route.query.name}});
        },
        commonSavaYajin(url,amount){
            this.$axios.post(url,{orderId:this.$route.query.orderId,amount:amount}).then(res => {
                if(res!=500){
                    this.$Message.success("保存成功"); 
                    this.getInitialList({orderId:this.$route.query.orderId});   
                }
            })
        },
        savaYajinBtn(txt){
            switch (txt) {
                case '年检押金':
                    this.isModify1 = !this.isModify1;
                    !this.isModify1 && this.commonSavaYajin('/fx?api=gate.order.admin.mdfAnnualInspectionDeposit',this.modify.annualInspectionDeposit);
                    break;
                case '违章押金':
                    this.isModify2 = !this.isModify2;
                    !this.isModify2 && this.commonSavaYajin('/fx?api=gate.order.admin.mdfTrafficDeposit',this.modify.trafficDeposit);
                    break;
                case '服务费':
                    this.isModify3 = !this.isModify3;
                    !this.isModify3 && this.commonSavaYajin('/fx?api=gate.order.admin.mdfServiceFee',this.modify.serviceFee);
                    break;        
            }
        },
        modifyCarInfoBtn(){
            this.modifyModal2 = true;
        },
        confirmBtn(){
            this.modifyCar.regDate = moment(this.modifyCar.regDate).format("YYYY-MM");
            if(!this.modifyCar.modelId || !this.modifyCar.regDate){
                return this.$Message.error("带 * 为必填项"); 
            }
            let formData = {...this.modifyCar};
            formData.orderId = this.$route.query.orderId;
            formData.autoRepositoryId = this.autoRepositoryId;
            formData.productId = this.prodId;
            this.modal_loading = true;
            this.$axios.post('/fx?api=gate.order.auto.model.update',formData).then(res => {
                if(res!=500){
                    this.$Message.success("保存成功"); 
                    this.getInitialList({orderId:this.$route.query.orderId});
                }
                this.modal_loading = false;
                this.modifyModal2 = false;
            })
        },
        cancel(){
           this.modifyModal2 = false;
           this.modifyMoneyModal = false;
           this.tipModal = false;
           this.addModal = false;
           this.isPassModal = false;
        },
        openMoneyModal(){
             this.modifyMoneyModal = true;
             this.modifyMoney.amount = this.certifyList.amount;
        },
        modifyMoneyBtn(){
            let formData = {...this.modifyMoney};
            formData.orderId = this.$route.query.orderId;
            this.modal_loading = true;
            this.$axios.post('/fx?api=gate.order.admin.adjustAmount',formData).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.getInitialList({orderId:this.$route.query.orderId});
                }
                this.modal_loading = false;
                this.modifyMoneyModal = false;
            })
        },
        addBtn(){
            this.remark = '';
            this.addModal = true;
        },
        addConfirmBtn(){
            if(!this.remark){
                return this.$Message.error('备注不能为空');
            }
            this.modal_loading = true;
            this.$axios.post('/fx?api=gate.order.admin.remark',{orderId:this.$route.query.orderId,remark:this.remark}).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.getRemarkList({orderId:this.$route.query.orderId});
                }
                this.modal_loading = false;
                this.addModal = false;
            })
        },
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.getRemarkList({orderId:this.$route.query.orderId});
            }
        },
        passStatus(){
            this.orderId = this.$route.query.orderId;
            this.isPassModal = true;
        },
        confirmBtn3(){
            this.modal_loading = true;
            this.$axios.post('/fx?api=gate.order.admin.underwrited',{orderId:this.orderId,isPass:this.isPass}).then(res => {
                if(res!=500){
                    this.$Message.success('操作成功');
                    this.getInitialList({orderId:this.$route.query.orderId});
                }
                this.modal_loading = false;
            })
            this.isPassModal = false;
        },
        changePicUrl(...arr){ //arr为子组件向父组件传递的参数列表
            this.myimgs11 = arr[0];
        },
        saveCarReportBtn(){
            this.$axios.post('/fx?api=gate.upload.auto.report',{orderId:this.$route.query.orderId,resource:this.myimgs11}).then(res => {
                if(res!=500){
                    this.$Message.success('保存成功');
                }
            })
        }, 
        downLoadimgCar(){
            this.carImgloading = true;
            this.$axios.get('/fx?api=gate.download.order.printfVehicleAssessmentReport',{params:{orderId:this.$route.query.orderId}}).then(res => {
                if(res!=500){
                    this.$Message.success('打印成功');
                    this.getInitialList({orderId:this.$route.query.orderId});
                }
                this.carImgloading = false;
            })
        },
        previewImgCar(){
            window.open(this.certifyList.autoReportUrl)
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
        width: 80px; 
        margin-left: 12px;
    }
    .item-comm.required:before{
        position: absolute;
        content:'*';
        color:red;
        left:-10px;
        top:3px;
    }
    .my-img{
        width: 60px;
        height: 60px;
        cursor: pointer;
        vertical-align: middle;
    }
    .item-input,.common-width{
        width: 120px;
    }
    .modify-modal{
        margin: 0 10px;
    }
    .item-div{
        margin: 10px 0;
    }
    .span-upload{
        display: inline-block;
        padding-left:10px;
    } 
    .span-upload /deep/ .item-comm.required{
        margin-right:35px;
    }
    td{
        padding: 0 10px;
    }
    .listadmin{
        overflow: auto;
    }
    .time{
        font-size: 14px;
        font-weight: bold;
    }
    .viewer-span{
        display: inline-block;
    }
    .content{
        padding-left: 15px;
    }
    #imgUpload{
        display: inline-block;
        width: 80px;
    }
    .span-width /deep/ .item-comm.required:before{
        content: '' !important;;
    }
    .yajin{
        display: inline-block;
        width: 100px;
        margin-top: 20px;
    }
    .item-input.txt /deep/ input{
        outline: none;
        border-color:transparent;
        box-shadow: none;
    }
</style>