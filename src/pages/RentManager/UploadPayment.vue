<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>租金管理</BreadcrumbItem>
	        <BreadcrumbItem>上传资方还款计划表</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                &nbsp;&nbsp;订单号: 
                <Input v-model="search.orderNumber" clearable placeholder="请输入订单号" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;手机号: 
                <Input v-model="search.mobile" clearable placeholder="请输入手机号" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;用户姓名: 
                <Input v-model="search.name" clearable placeholder="请输入用户姓名" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;上传资方状态: 
                <Select v-model="search.uploadCapitalStatus" style="width:120px" clearable>
                    <Option :value="0">未上传</Option>
                    <Option :value="1">已上传</Option>
                </Select>
            </span>
            <Button type="primary" icon="ios-search" style="margin-left:10px;" @click="searchList">搜索</Button>
            <Button class="btn-margin" style="margin-left:0" type="primary" @click="template">资方还款计划模板下载</Button>
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
        <input style="display:none" type="file" id="file1" ref="file1" @change="changeFile1('资料')"/>
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
            oss:{},
            spinState:false,
            percent:0,
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
            prodList:[], //产品列表
			search: {
                orderNumber:'',
                mobile:'',
                name:'',
                uploadCapitalStatus:'',
                pageNum: 1,
                pageSize: 15
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
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                       this.orderUpLoad(params.row.orderId);
                                    }
                                }
                            }, '上传资方还款计划表')
                        ]);
                    }
                },{
                    title: '订单号',
                    key: 'orderNumber',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.orderNumber)
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
                    title: '身份证号',
                    key: 'useridentityCard',
                    minWidth: 160,
                     render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.useridentityCard)
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
                },{
                    title: '门店名',
                    key: 'storeName',
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
                },{
                    title: '合同金额(元)',
                    key: 'amount',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.amount)
                        ]);
                    }
                },{
                    title: '上传资方状态 ',
                    key: 'uploadCapitalStatus',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.uploadCapitalStatus==0?'未上传':params.row.uploadCapitalStatus==1?'已上传':'')
                        ]);
                    }
                },{
                    title: '订单状态 ',
                    key: 'statusValue',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.statusValue)
                        ]);
                    }
                },{
                    title: '订单详情',
                    key: 'action',
                    width: 100,
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
                                        this.$router.push({name:'ProcessDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'UploadPayment'}});
                                    }
                                }
                            }, '详情'),
                        ]);
                    }
                },{
                    title: '账单详情',
                    key: 'action',
                    width: 100,
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
                                        this.$router.push({name:'LoanDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'UploadPayment'}});
                                    }
                                }
                            }, '详情'),
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
        this.getOSSInfo({params:{type:11}});
	},
	methods: {
        getOSSInfo(){ //获得OSS相关信息
            this.$axios.get('/fx?api=gate.base.ossUpload',{params:{type:11}}).then(res => {
                if(res!=500){
                    this.oss = res;     
                }
            })
        },
		getInitialList(formData){ 
            this.table_loading = true;
		    this.$axios.get('/fx?api=gate.order.admin.uploadCapitalRepaymentPlanList',{params:formData}).then(res => {
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
        },
        orderUpLoad(orderId){
            this.orderId = orderId;
            this.$refs.file1.value = null;
            let file = this.$refs.file1;
            file.click();
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
            this.$axios.post(myUrl,{url:resource,orderId:this.orderId}).then(res => {
                if(res!=500){
                    this.$Message.success('资料上传成功');
                    this.getInitialList(this.search);
                }
                this.spinState = false;
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
</style>