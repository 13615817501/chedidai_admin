<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>订单管理</BreadcrumbItem>
	        <BreadcrumbItem>待门店处理</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                产品名称: 
                <Input v-model="search.name" clearable placeholder="请输入姓名" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;订单号: 
                <Input v-model="search.orderNumber" clearable placeholder="请输入姓名" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;手机号: 
                <Input v-model="search.mobile" clearable placeholder="请输入姓名" style="width: 120px"></Input>
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
            modalTipTitle:'禁用该员工',
            tipModal:false,
            myTitle:'新增产品',
            item:{},
            id:'',
			search:{
                mobile:'',
                name:'',
                orderNumber: '',
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
                                        this.modalTipTitle = '通过该门店处理订单';
                                        this.item = params.row;
                                    }
                                }
                            }, '通过'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                },
                                style: {
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '拒绝该门店处理订单';
                                        this.item = params.row;
                                    }
                                }
                            }, '拒绝'),
                        ]);
                    }
                }, {
					title: '门店',
					key: 'storeName',
					minWidth: 160,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.storeName)
						]);
					}
				}, {
                    title: '预约日期',
                    key: 'createTime',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.createTime)
                        ]);
                    }
                }, {
                    title: '客户名称',
                    key: 'userName',
                    minWidth: 90,
                     render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.userName)
                        ]);
                    }
                }, {
					title: '客户手机',
					key: 'userMobile',
					minWidth: 120,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.userMobile)
						]);
					}
				}, {
					title: '产品',
					key: 'prodName',
					minWidth: 90,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.prodName)
						]);
					}
				}, {
                    title: '订单详情',
                    key: 'action',
                    width: 150,
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
                                        this.$router.push({name:'WaitStoreDetail',query:{userId:params.row.userId,autoId:params.row.autoId}});
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
	},
	methods: {
		getInitialList(formData){ 
            this.table_loading = true;
		    this.$axios.get('/fx?api=gate.order.admin.waitCheckOfflineList',{params:formData}).then(res => {
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