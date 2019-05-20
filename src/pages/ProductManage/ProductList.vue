<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>产品管理</BreadcrumbItem>
	        <BreadcrumbItem>产品列表</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                产品名称: 
                <Input v-model="search.name" clearable placeholder="请输入姓名" style="width: 120px"></Input>
            </span>
            <Button type="primary" icon="ios-search" style="margin-left:10px;" @click="searchList">搜索</Button>
            <Button type="primary" icon="md-add" style="margin-left:10px;" @click="addBtn">新增</Button>
        </div> 
	    <div class="listadmin">
            <Table border :columns="columns" :data="certifyList" :height="adjustHeight"></Table>
        </div>
        <div style="text-align:center;margin-top:20px;">
            <Page :current = "search.pageNum" :total="totalCount" :page-size="search.pageSize" @on-change="pageChange" show-total></Page>
        </div>
        <Modal width="580" v-model="modifyModal" :title="myTitle" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">
                    <span class="item-comm required">产品名称：</span><Input class="item-input" v-model="modify.fullName" placeholder="请输入..." />
                    <span class="item-comm required">产品类型简写：</span><Input class="item-input" v-model="modify.shortName" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm">标签：</span><Select clearable v-model="modify.label" class="item-input" placeholder="请选择">
                        <Option v-for="item in labelEnum" :value="item.key" :key="item.key">{{item.value}}</Option>
                        </Select>
                    <span class="item-comm required">还款方式：</span><Select v-model="modify.repayment" class="item-input" placeholder="请选择">
                            <Option value="1">先息后本</Option>
                            <Option value="2">等额本息</Option>
                            <Option value="3">等本等息</Option>
                        </Select>    
                </div>
                <div class="add-comm">
                    <span class="item-comm required">合同期数：</span><Select v-model="modify.periods" class="item-input" placeholder="请选择">
                            <Option :value="1">3期</Option>
                            <Option :value="2">6期</Option>
                            <Option :value="3">12期</Option>
                            <Option :value="4">24期</Option>
                        </Select>  
                    <span class="item-comm required">债权类型：</span><Select v-model="modify.debtType" class="item-input" placeholder="请选择">
                            <Option value="1">质押</Option>
                            <Option value="2">抵押</Option>
                            <Option value="3">非抵押开走</Option>
                        </Select>     
                </div>
                <div class="item-div">
                    <span class="item-comm required">年利率：</span><Input class="item-input" v-model="modify.annualRate" placeholder="如0.16%写16" />
                    <span class="item-comm required">计算公式：</span><Input class="item-input" v-model="modify.calculate" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required">合同模版：</span><Input class="item-input" v-model="modify.contractTemplate" placeholder="请输入..." />
                    <span class="item-comm required">还款渠道：</span><Select v-model="modify.repaymentChannel" class="item-input" placeholder="请选择">
                            <Option value="1">资方</Option>
                            <Option value="2">资方和中都</Option>
                        </Select>
                </div>
                <div class="item-div">
                    <span class="item-comm required">保费费率：</span><Input class="item-input" v-model="modify.insurePersent" placeholder="请输入..." />
                    <span class="item-comm required">居间服务费费率：</span><Input class="item-input" v-model="modify.intermediateServicePersent" placeholder="请输入..." />
                </div>  
                <div class="item-div">
                    <span class="item-comm required">账户管理费费率：</span><Input class="item-input" v-model="modify.accountServicePersent" placeholder="请输入..." />
                    <span class="item-comm required">平台管理费费率：</span><Input class="item-input" v-model="modify.platformServicePersent" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required">综合服务费费率：</span><Input class="item-input" v-model="modify.compositeServicePersent" placeholder="请输入..." />
                    <span class="item-comm required">保证金费率：</span><Input class="item-input" v-model="modify.cashDepositPersent" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required">GPS及安装费用：</span><Input class="item-input" v-model="modify.gpsInstallExpenses" placeholder="请输入..." />
                    <span class="item-comm required">流量费：</span><Input class="item-input" v-model="modify.flowExpenses" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required">上牌及抵押等费用：</span><Input class="item-input" v-model="modify.plateMortgageExpenses" placeholder="请输入..." />
                    <span class="item-comm required">家访费用：</span><Input class="item-input" v-model="modify.homeVisitExpenses" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required">杂费：</span><Input class="item-input" v-model="modify.incidentalExpenses" placeholder="请输入..." />
                    <span class="item-comm required">年检押金：</span><Input class="item-input" v-model="modify.annualInspectionExpenses" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required">违章押金：</span><Input class="item-input" v-model="modify.breakRuleExpenses" placeholder="请输入..." />
                    <span class="item-comm required">进件费：</span><Input class="item-input" v-model="modify.transExpenses" placeholder="请输入..." />
                </div> 
                <div class="item-div">
                    <span class="item-comm required">内返最低值：</span><Input class="item-input" v-model="modify.storeCommissionPersent" placeholder="请输入..." />
                    <span class="item-comm required">最高可贷额度：</span><Input class="item-input" v-model="modify.hiestAmount" placeholder="请输入..." />
                </div> 
                <div class="item-div">
                    <span class="item-comm required">最低可贷额度：</span><Input class="item-input" v-model="modify.loestAmount" placeholder="请输入..." />
                    <ImgUpload @changePicUrl="changePicUrl" :myPicUrl="picUrl" :type="4" class="span-upload">产品图片：</ImgUpload>
                </div> 
                <div class="item-div">
                    <span class="item-comm required">贷款还款日期方式：</span><Select v-model="modify.repayDateType" class="item-input" placeholder="请选择">
                            <Option value="1">固定时间</Option>
                            <Option value="2">合同生效日起算</Option>
                        </Select>
                    <span v-show="modify.repayDateType=='2'">
                        <span class="item-comm required">贷款还款日：</span><Input class="item-input" v-model="modify.repayDate" placeholder="请输入..." />
                    </span>
                </div> 
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
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
            modifyModal:false,
            modalTipTitle:'禁用该员工',
            tipModal:false,
            myTitle:'新增产品',
            item:{},
            bigimg:'',
            picUrl:'',
            modalPreview:false,
            modal_loading:false,
            storeNames:[],
            id:'',
			search:{
                mobile:'',
                name:'',
                type: '',
			    pageNum: 1,
			    pageSize:15
			},
            labelEnum:[], //产品标签 
            isInterestHeadEnum:[], //是否利息前置
            calInterestWayEnum:[], //计算利息方式
            modify: {
                label: '',
                bannerPic: '',
                fullName: '',
                shortName: '',
                repayment: '',
                periods: '',
                debtType: '',
                annualRate: '',
                calculate: '',
                contractTemplate: '',
                repaymentChannel: '',
                insurePersent: '',
                intermediateServicePersent: '',
                accountServicePersent: '',
                platformServicePersent: '',
                compositeServicePersent: '',
                cashDepositPersent: '',
                gpsInstallExpenses: '',
                flowExpenses: '',
                plateMortgageExpenses: '',
                homeVisitExpenses: '',
                incidentalExpenses: '',
                annualInspectionExpenses: '',
                breakRuleExpenses: '',
                transExpenses: '',
                storeCommissionPersent: '',
                hiestAmount: '',
                loestAmount: ''
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
                                    display: params.row.status=='1'?  'inline-block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '下架该产品';
                                        this.item = params.row;
                                    }
                                }
                            }, '下架'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                style: {
                                    'margin-left':'10px',
                                    display: params.row.status=='2'?  'inline-block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '上架该产品';
                                        this.item = params.row;
                                    }
                                }
                            }, '上架'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: params.row.status==2 
                                },
                                style: {
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                        this.id = params.row.id;
                                        this.myTitle = '修改';
                                        (async () => {
                                            try {
                                                let detailProduct = await this.$axios.get('/fx?api=gate.detail.product.admin',{params:{id:params.row.id}});
                                                let {label,bannerPic,fullName,shortName,repayment,periods,debtType,annualRate,calculate,contractTemplate,repaymentChannel,insurePersent,intermediateServicePersent,accountServicePersent,platformServicePersent,compositeServicePersent,cashDepositPersent,gpsInstallExpenses,flowExpenses,plateMortgageExpenses,homeVisitExpenses,incidentalExpenses,annualInspectionExpenses,breakRuleExpenses,transExpenses,storeCommissionPersent,hiestAmount,loestAmount,repayDateType,repayDate} = detailProduct;
                                                this.modify = {label,bannerPic,fullName,shortName,repayment,periods,debtType,annualRate,calculate,contractTemplate,repaymentChannel,insurePersent,intermediateServicePersent,accountServicePersent,platformServicePersent,compositeServicePersent,cashDepositPersent,gpsInstallExpenses,flowExpenses,plateMortgageExpenses,homeVisitExpenses,incidentalExpenses,annualInspectionExpenses,breakRuleExpenses,transExpenses,storeCommissionPersent,hiestAmount,loestAmount,repayDateType,repayDate}
                                                this.picUrl = params.row.bannerPicValue;
                                                if(this.modify.repayDateType=='1'){
                                                   this.modify.repayDate = '';
                                                }
                                                this.modifyModal = true;
                                            } catch (err) {
                                                this.$Message.error("请求出错！"); 
                                            }
                                        })()
                                    }
                                }
                            }, '修改')
                        ]);
                    }
                }, {
					title: '产品名称',
					key: 'fullName',
					minWidth: 160,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.fullName)
						]);
					}
				},{
                    title: '简称',
                    key: 'shortName',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.shortName)
                        ]);
                    }
                }, {
                    title: '标签',
                    key: 'labelValue',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.labelValue)
                        ]);
                    }
                }, {
                    title: '图片',
                    key: 'bannerPicValue',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('img', {
                                domProps: {
                                    src: params.row.bannerPicValue,
                                },
                                slot: "content",
                                style: {
                                    width: "50px",
                                    height: '50px',
                                    'vertical-align': 'middle',
                                    margin: '5px auto',
                                    cursor:"pointer"
                                },
                                on: {
                                    click: () => {
                                        if(params.row.bannerPicValue){
                                            this.clickFaceImg(params.row.bannerPicValue);
                                        }
                                    }
                                }
                            }, ''),
                        ]);
                    }
                }, {
					title: '月费率',
					key: 'statusValue',
					minWidth: 120,
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
        ImgUpload
    }, 
	computed:{
        ...mapState(['adjustHeight']) 
    },
	activated(){
        this.getInitialList(this.search);
        this.getDetailProduct();
	},
	methods: {
		getInitialList(formData){ 
            this.table_loading = true;
		    this.$axios.get('/fx?api=gate.list.product.admin',{params:formData}).then(res => {
		    	if(res!=500){
		    		this.certifyList = res.list;
			        this.totalCount = res.page.totalCount;
			        this.search.pageNum = res.page.currentPage;
			        this.$store.commit('change_height');
		    	}
		    	this.table_loading = false;
			})
		},
        getDetailProduct(id){ 
            return this.$axios.get('/fx?api=gate.detail.product.admin',{params:{id:id}}).then(res => {
                if(res!=500){
                    this.labelEnum = res.labelEnum;
                    
                }
            })
        },
        changePicUrl(picUrl,myUrl){
            this.modify.bannerPic = picUrl;
            this.picUrl = myUrl;
        },
        pageChange(page){
			this.search.pageNum = page;
            this.getInitialList(this.search);
        },
        searchList() {
        	this.search.pageNum = 1;
			this.getInitialList(this.search);
		},
        addBtn(){
            this.myTitle = '新增';
            this.modifyModal = true;
            this.modify = {
                label: '',
                bannerPic: '',
                fullName: '',
                shortName: '',
                repayment: '',
                periods: '',
                debtType: '',
                annualRate: '',
                calculate: '',
                contractTemplate: '',
                repaymentChannel: '',
                insurePersent: '',
                intermediateServicePersent: '',
                accountServicePersent: '',
                platformServicePersent: '',
                compositeServicePersent: '',
                cashDepositPersent: '',
                gpsInstallExpenses: '',
                flowExpenses: '',
                plateMortgageExpenses: '',
                homeVisitExpenses: '',
                incidentalExpenses: '',
                annualInspectionExpenses: '',
                breakRuleExpenses: '',
                transExpenses: '',
                storeCommissionPersent: '',
                hiestAmount: '',
                loestAmount: ''
            }
            this.picUrl = '';
        },
        clickFaceImg(img){
            this.bigimg = img;
            this.modalPreview = true;
        },
        confirmBtn(){
            if(!this.modify.label || !this.modify.bannerPic || !this.modify.fullName|| !this.modify.shortName || !this.modify.repayment || !this.modify.periods || !this.modify.debtType || !this.modify.annualRate || !this.modify.calculate || !this.modify.contractTemplate || !this.modify.repaymentChannel || !this.modify.insurePersent || !this.modify.intermediateServicePersent || !this.modify.accountServicePersent || !this.modify.platformServicePersent || !this.modify.compositeServicePersent || !this.modify.cashDepositPersent || !this.modify.gpsInstallExpenses || !this.modify.flowExpenses || !this.modify.plateMortgageExpenses || !this.modify.homeVisitExpenses || !this.modify.incidentalExpenses || !this.modify.annualInspectionExpenses || !this.modify.breakRuleExpenses || !this.modify.transExpenses || !this.modify.storeCommissionPersent || !this.modify.hiestAmount || !this.modify.loestAmount){
                return this.$Message.error("带 * 为必填项"); 
            }
            if(this.modify.repayDateType=='2' && !this.modify.repayDate){
                return this.$Message.error("贷款还款日期不能为空"); 
            }
            let formData = {...this.modify};
            let  myUrl = '/fx?api=gate.addOrUpdate.product';
            if(this.myTitle == '修改'){
                formData.id = this.id;
            }
            formData.label = formData.label?formData.label:'';
            this.$axios.post(myUrl,formData).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.modifyModal = false;
                    this.getInitialList(this.search);    
                }
            })
        },
        cancel(){
            this.tipModal = false;
            this.modifyModal = false;
        },
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.getInitialList(this.search);
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
        width: 120px; 
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
        padding: 0 10px;
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
</style>