<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>订单管理</BreadcrumbItem>
            <BreadcrumbItem>{{$route.query.name=='FirstOrder'?'首款订单':'尾款订单'}}</BreadcrumbItem>
	        <BreadcrumbItem>账单详情</BreadcrumbItem>
	    </Breadcrumb>
        <div v-if="spinState" class="progress-box">
            <i-progress  :percent="percent" :stroke-width="10"/>
        </div>
        <div class="search-box">
            <Button type="primary" @click="backBtn"><Icon type="ios-arrow-back"/>返回</Button>
            <Button class="btn-margin" style="margin-left:0" type="primary" @click="orderUpLoad">上传资方还款计划</Button>
            <input style="display:none" type="file" id="file1" ref="file1" @change="changeFile1('资料')"/>
            <Button class="btn-margin" style="margin-left:0" type="primary" @click="template">资方还款计划模板下载</Button>
        </div> 
        <div :style="{paddingLeft:'15px',height:adjustHeight+90+'px',overflow:'auto'}">
            <div class="div-comm-1">订单费用：</div>
            <span class="span-comm-1">
                <div>合同金额(元)：{{certifyData.amount}}</div>
                <div>总金额-众信(元)：{{certifyData.amountZd}}</div>
                <div>总金额-资方(元)：{{certifyData.amountCapital}}</div>
            </span>
            <span class="span-comm-1">
                <div>期数：{{certifyData.periods}}</div>
                <div>未还金额-众信(元)：{{certifyData.needPayAmountZd}}</div>
                <div>未还金额-资方(元)：{{certifyData.needPayAmountCapital}}</div>
            </span>
            <span class="span-comm-1">
                <div>已还期数：{{certifyData.paidPeriodNum}}</div>
                <div>已还金额-众信(元)：{{certifyData.realPayAmountZd}}</div>
                <div>已还金额-资方(元)：{{certifyData.realPayAmountCapital}}</div>
            </span>
            <span class="span-comm-1">
                <div>产品名称：{{certifyData.prodName}}</div>
                <div>逾期金额-众信(元)：{{certifyData.overdueAmount}}</div>
                <div>逾期金额-资方(元)：{{certifyData.overdueAmountCapital}}</div>
            </span>
            <span class="span-comm-1">
                <div>年利率：{{certifyData.interestRate}}</div>
                <div>首期划扣金额：{{certifyData.firstLoanAmount}}</div>
            </span>
            <div class="div-comm-1">费用条目：</div>
            <span class="span-comm-1">
                <div>保费(元)：{{certifyData.insuranceFee}}</div>
                <div>居间服务费(元)：{{certifyData.partiesFee}}</div>
                <div>账户管理费(元)：{{certifyData.accountMgrFee}}</div>
                <div>GPS安装费(元)：{{certifyData.installGpsFee}}</div>
                <div>人生意外险保费(元)：{{certifyData.accidentInsureFee}}</div>
                <div>进件费用(元)：{{certifyData.transFilesFee}}</div>
                <div>年检押金(元)：{{certifyData.annualInspectionDeposit}}</div>
                <div>违章押金(元)：{{certifyData.trafficDeposit}}</div>
            </span>
            <span class="span-comm-1">
                <div>平台服务费(元)：{{certifyData.platformServiceFee}}</div>
                <div>保证金(元)：{{certifyData.margin}}</div>
                <div>家访费用(元)：{{certifyData.homeVisitFee}}</div>
                <div>杂费(元)：{{certifyData.miscellaneousFee}}</div>
                <!-- <div>综合服务费(元)：{{certifyData.comprehenServiceFee}}</div> -->
                <div>上牌抵押费用(元)：{{certifyData.installLicensePlateFee}}</div>
                <div>流量费(元)：{{certifyData.flowFee}}</div>
                <div>综合服务费(元)：{{certifyData.serviceFee}}</div>
            </span>
            <div class="div-comm-1">还款计划：</div>
            <Table border :columns="columns" :data="certifyList"></Table>
        </div>
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
            certifyData:[],
			certifyList:[],
            oss:{},
            spinState:false,
            percent:0,
            columns: [{
					title: '期数',
					key: 'period',
                    align: 'center',
					minWidth: 100,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.period)
						]);
					}
				}, {
                    title: '还款时间',
                    key: 'limitPayTime',
                    align: 'center',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.limitPayTime)
                        ]);
                    }
                }, {
                    title: '总金额（元）',
                    align: 'center',
                    children: [
                        {
                            title: '资方',
                            key: 'amountCapital',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.amountCapital)
                                ]);
                            }
                        }, {
                            title: '众信',
                            key: 'amountZd',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.amountZd)
                                ]);
                            }
                        }
                    ]
                }, {
                    title: '应还金额（元）',
                    align: 'center',
                    children: [
                        {
                            title: '资方',
                            key: 'needPayAmountCapital',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.needPayAmountCapital)
                                ]);
                            }
                        }, {
                            title: '众信',
                            key: 'needPayAmountZd',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.needPayAmountZd)
                                ]);
                            }
                        }
                    ]
                },{
                    title: '已还金额（元）',
                    align: 'center',
                    children: [
                        {
                            title: '资方',
                            key: 'realPayAmountCapital',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.realPayAmountCapital)
                                ]);
                            }
                        }, {
                            title: '众信',
                            key: 'realPayAmountZd',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.realPayAmountZd)
                                ]);
                            }
                        }
                    ]
                },{
                    title: '逾期金额（元）',
                    align: 'center',
                    children: [
                        {
                            title: '资方',
                            key: 'overdueFeeCapital',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.overdueFeeCapital)
                                ]);
                            }
                        }, {
                            title: '众信',
                            key: 'overdueFee',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.overdueFee)
                                ]);
                            }
                        }
                    ]
                }, {
                    title: '逾期天数（天）',
                    align: 'center',
                    children: [
                        {
                            title: '资方',
                            key: 'overdueDaysCapital',
                            align: 'center',
                            minWidth: 80,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.overdueDaysCapital)
                                ]);
                            }
                        }, {
                            title: '众信',
                            key: 'overdueDays',
                            align: 'center',
                            minWidth: 80,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.overdueDays)
                                ]);
                            }
                        }
                    ]
                }, {
                    title: '还款时间',
                    align: 'center',
                    children: [
                        {
                            title: '资方',
                            key: 'age',
                            align: 'center',
                            minWidth: 160,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.realPayTimeCapital)
                                ]);
                            }
                        }, {
                            title: '众信',
                            key: 'realPayTime',
                            align: 'center',
                            minWidth: 160,
                            render: (h, params) => {
                                return h('div', [
                                    h('strong', params.row.realPayTime)
                                ]);
                            }
                        }
                    ]
                }, {
                    title: '状态',
                    align: 'center',
                    key: 'status',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.status==0?'待还款':params.row.status==1?'结清':params.row.status==2?'逾期':params.row.status==3?'还款失败':params.row.status==4?'逾期已还款':params.row.status==5?'资产处置':params.row.status==9?'未生效':'')
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
        this.getInitialList({orderId:this.$route.query.orderId});
        this.getOSSInfo({params:{type:11}});
	},
	methods: {
		getInitialList(formData){ 
		    this.$axios.get('/fx?api=gate.order.admin.billDetail',{params:formData}).then(res => {
		    	if(res!=500){
                    this.certifyData = res;
                    this.certifyList = res.list;
			        this.$store.commit('change_height');
		    	}
			})
		},
        backBtn(){
            this.$router.push({name:this.$route.query.name,query:{pageNum:this.$route.query.pageNum}});
        },
        orderUpLoad(){
            this.$refs.file1.value = null;
            let file = this.$refs.file1;
            file.click();
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
        changeFile1(txt){
            this.spinState = true;
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
            let file = this.$refs.file1.files[0];
            if(file){
                let reg = /\.xls$|\.xlsx$/i;
                if(!reg.test(file.name)){
                    let fileInput = this.$refs.file1;
                    fileInput.value='';
                    let errorTxt = '格式只支持xls,xlsx';
                    return this.$Message.error(errorTxt);
                }
                let random_name = this.random_string(6) + '_' + new Date().getTime() + '.' + file.name.split('.').pop();   // 随机命名
                
                let checkpoint;

                // 定义上传方法
                let that = this;
                async function multipartUpload (){
                    try {
                        let result = await client.multipartUpload(`${that.oss.dirPath}${random_name}`, file, {
                            checkpoint: checkpoint,
                            progress: async function (percent, cpt) {
                                that.percent = Math.round(percent*100);
                                checkpoint = cpt;
                            }
                        })
                        let requestUrls = result.res.requestUrls[0];
                        let index1 = requestUrls.indexOf('uploadId');
                        let myUrl = result.url?result.url:requestUrls.slice(0,index1-1);
                        let myIndex = myUrl.indexOf('/img');
                        let ranUrl = myUrl.slice(myIndex+1);
                        myUrl = client.signatureUrl(ranUrl);    //转化成带加密签名的图片(参数必须为相对地址)
                        that.fileUpload(ranUrl);
                    } catch(e){
                        that.$Message.warning('文件上传出错');
                        that.spinState = false;
                    }
                }
                multipartUpload();
            }     
        },
        fileUpload(resource){
            let myUrl = '/fx?api=gate.order.excle.uploadRepaymentPlanCapital';
            this.$axios.post(myUrl,{url:resource,orderId:this.$route.query.orderId}).then(res => {
                if(res!=500){
                    this.$Message.success('资料上传成功');
                    this.getInitialList({orderId:this.$route.query.orderId});
                }
                this.spinState = false;
            })
        },
        getOSSInfo(){ //获得OSS相关信息
            this.$axios.get('/fx?api=gate.base.ossUpload',{params:{type:11}}).then(res => {
                if(res!=500){
                    this.oss = res;     
                }
            })
        },
        template(){
            window.open('https://ucarmanager.oss-cn-hangzhou.aliyuncs.com/src/%E4%B8%8A%E4%BC%A0%E8%BF%98%E6%AC%BE%E8%AE%A1%E5%88%92%E8%A1%A8%E6%A8%A1%E6%9D%BF.xlsx');
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
    .span-comm-1{
        display: inline-block;
        width: 300px;
        padding-left: 20px;
        vertical-align: top;
    }
    .div-comm-1{
        font-weight: 600;
        font-size: 14px;
        margin: 10px 0;
    }
    .progress-box /deep/ .ivu-progress{
        display: inline-block;
        width: 50%;
        font-size: 12px;
        position: fixed;
        left: 50%;
        top: 50%;
        margin-left: -25%;
    }
    .progress-box{
         position: absolute;
         width: 100%;
         height: 100%;
         background-color: rgba(255,255,255,.9);
         top: 0;
         left: 0;
         z-index: 8;
    }
</style>