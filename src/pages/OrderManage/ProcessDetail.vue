<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>产品管理</BreadcrumbItem>
            <BreadcrumbItem>{{$route.query.name=='WaitStoreList'?'待门店处理':$route.query.name=='待初审订单'?'WaitAuditingList':$route.query.name=='待确认订单'?'WaitConfirmList':''}}</BreadcrumbItem>
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
                <div style="margin-top:15px;" v-if="$route.query.name=='WaitStoreList'">
                    <div style="margin-top:15px;">
                        <p>
                            <span class="yajin">年检押金(元)：</span>
                            <Input class="item-input" :class="{txt:!isModify1}" :readonly='!isModify1' v-model="modify.annualInspectionDeposit" style="width: 100px" :placeholder="isModify1?'请输入...':''" />
                            <Button type="primary" size="small"  style="margin:0 10px;" @click="savaYajinBtn('年检押金')">{{isModify1?'保存':'修改'}}</Button>
                        </p>    
                        <p>
                        <span class="yajin">违章押金(元)：</span>
                            <Input class="item-input" :class="{txt:!isModify2}" :readonly='!isModify2' v-model="modify.trafficDeposit" style="width: 100px" :placeholder="isModify2?'请输入...':''" />
                            <Button type="primary" size="small"  style="margin:0 10px;" @click="savaYajinBtn('违章押金')">{{isModify2?'保存':'修改'}}</Button>
                        </p>   
                        <p>
                            <span class="yajin">服务费(元)：</span>
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
                    <p>核保状态：{{certifyList.underwritedStatus==0?'未核保':certifyList.underwritedStatus==1?'成功':'失败'}}</p>
                    <p v-if="certifyList.underwritedStatus">核保时间：{{certifyList.underwritedTime}}</p>    
                    <p v-if="certifyList.underwritedStatus">核保操作员：{{certifyList.underwritedStaff}}</p>    
                </div>
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
                        <p class="time" :style="{color:certifyList.confirmBlock?'#2d8cf0':'#515a6e'}">客户确认</p>
                        <template v-if="certifyList.confirmBlock">
                        <p class="content">确认时间：{{certifyList.confirmBlock.time}}</p>
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
                        <p class="content">GPS完成时间：{{certifyList.gpsBlock.time}}</p>
                        <p class="content">GPS操作员：{{certifyList.gpsBlock.staff}}</p>
                        <p class="content">抵押完成时间：{{certifyList.gpsBlock.mortgagedTime}}</p>
                        <p class="content">抵押操作员：{{certifyList.gpsBlock.mortgagedStaff}}</p>
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
            orderId: '',
			certifyList:{},
            carList:{}, //车辆信息对象
            modifyModal2:false,
            modifyMoneyModal:false,
            modal_loading:false,
            prodId:'',
            autoId:'',
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
        ...mapState(['adjustHeight']) 
    },
	activated(){
        this.getInitialList({orderId:this.$route.query.orderId});
	},
	methods: {
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
                    this.prodId = res.prodId;
                    this.autoRepositoryId = res.autoId;
                    this.getCarDetail(res.autoId);
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
    .content{
        padding-left: 15px;
    }
    .yajin{
        display: inline-block;
        width: 80px;
        margin-top: 20px;
    }
    .item-input.txt /deep/ input{
        outline: none;
        border-color:transparent;
        box-shadow: none;
    }
</style>