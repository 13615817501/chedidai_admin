<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>订单管理</BreadcrumbItem>
	        <BreadcrumbItem>待初审订单</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                产品名称: 
                <Input v-model="search.name" clearable placeholder="请输入..." style="width: 120px"></Input>
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
        <ChooseReason :title="title" :orderId="orderId" :modal="passModal" :ModalContent="ModalContent" @get-status="confirmBtn" @cancel="cancel"></ChooseReason> 
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
            passModal:false,
            title:'待审核拒绝',
            ModalContent:[],
            modalTipTitle:'禁用该员工',
            tipModal:false,
            myTitle:'新增产品',
            item:{},
            bigimg:'',
            bannerPic:'',
            modalPreview:false,
            modal_loading:false,
            storeNames:[],
            orderId:'',
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
                    width: 190,
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
                                        this.modalTipTitle = '通过该审核订单';
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
                                        this.passModal = true;
                                        this.title = '待审核拒绝';
                                        this.orderId = params.row.orderId;
                                    }
                                }
                            }, '拒绝'),
                            h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small',
                                    
                                },
                                style: {
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '退回该审核订单';
                                        this.item = params.row;
                                    }
                                }
                            }, '退回')
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
        ImgUpload,
        ChooseReason
    }, 
	computed:{
        ...mapState(['adjustHeight']) 
    },
	activated(){
        this.getInitialList(this.search);
        this.getRefuseReasonList();
	},
	methods: {
		getInitialList(formData){ 
            this.table_loading = true;
		    this.$axios.get('/fx?api=gate.order.admin.waitCheckList',{params:formData}).then(res => {
		    	if(res!=500){
		    		this.certifyList = res.list;
			        this.totalCount = res.page.totalCount;
			        this.search.pageNum = res.page.currentPage;
			        this.$store.commit('change_height');
		    	}
		    	this.table_loading = false;
			})
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
        confirmBtn(num){
            if(num!=500){
                this.$Message.success('已处理');
                this.searchList();
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
                this.getInitialList(this.search);
            }
        },
        changeFun(checked, name){
            console.log(checked, name);
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