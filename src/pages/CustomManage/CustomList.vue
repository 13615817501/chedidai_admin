<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>客户管理</BreadcrumbItem>
	        <BreadcrumbItem>客户列表</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                &nbsp;&nbsp;手机号: 
                <Input v-model="search.mobile" clearable placeholder="请输入手机号" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;姓名: 
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
            modal_loading:false,
            bigimg:'', //点击呈现大图
            modalTipTitle:'禁用该客户',
            tipModal:false,
            item:{},
            id:'',
            activeState: null,
            search:{
                mobile:'',
                name:'',
                pageNum:1,
                pageSize:15
            },
            spinShow:false,
            carRegisterRecords:[],
			table_loading: false, //默认先显示加载
			myContent:'',
			certifyList:[],
            columns: [{
                    title: '操作',
                    key: 'action',
                    width: 90,
                    align: 'center',
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                },
                                style: {
                                    'margin-left':'10px',
                                     display: params.row.status==1?'inline-block':'none' 
                                },
                                on: {
                                    click: () => {
                                        this.modalTipTitle = '禁用该客户';
                                        this.tipModal = true;
                                        this.item = params.row;
                                    }
                                }
                            }, '禁用'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                style: {
                                    'margin-left':'10px',
                                    display: params.row.status==0?'inline-block':'none' 
                                },
                                on: {
                                    click: () => {
                                        this.modalTipTitle = '启用该客户';
                                        this.tipModal = true;
                                        this.item = params.row;
                                    }
                                }
                            }, '启用')
                        ]);
                    }
                }, {
					title: '手机号码',
					key: 'mobile',
					minWidth: 120,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.mobile)
						]);
					}
				}, {
                    title: '姓名',
                    key: 'name',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.name)
                        ]);
                    }
                },{
					title: '头像',
					key: 'icon',
					minWidth: 80,
					render: (h, params) => {
						return h('div', [
							h('img', {
                                domProps: {
                                    src: params.row.icon
                                },
                                slot: "content",
                                style: {
                                    width: "50px",
                                    height: '50px',
                                    'border-radius':'50%',
                                    'vertical-align': 'middle',
                                    margin: '5px auto',
                                    cursor:"pointer"
                                },
                            }, '')
						]);
					}
				},{
                    title: '身份证号',
                    key: 'idNum',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.idNum)
                        ]);
                    }
                },{
                    title: '推荐人',
                    key: 'referrerName',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.referrerName)
                        ]);
                    }
                },{
                    title: '状态',
                    key: 'status',
                    minWidth: 70,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.status==0?'失效':'生效')
                        ]);
                    }
                },{
                    title: '创建时间',
                    key: 'createTime',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.createTime)
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
		    this.$axios.get('/fx?api=gate.user.admin.userList',{params:formData}).then(res => {
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
        cancel(){
            this.tipModal = false;
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
        margin-left: 16px;
    }
    .item-comm.required:before{
        position: absolute;
        content:'*';
        color:red;
        left:-10px;
        top:3px;
    }
    .item-input,.common-width{
        width: 90px;
    }
    .modify-modal{
    	height: 600px;
        padding: 0 10px;
    }
    .item-div{
        margin: 10px 0;
    }
    .span-upload{
        display: inline-block;
        padding-left:14px;
    }
    .modal-left,.modal-right{
    	display: inline-block;
    	height: 100%;
    	width: 49%;
    }
    .modal-right{
    	overflow: auto;
    }
    .modal-left{
    	vertical-align: top;
    }
    .modal-left>div{
        border:1px solid #ddd;
    }
    .modal-left>div:first-child{
     	border-bottom: none;
    }
    .modal-left>div:last-child{
    	height: 520px;
    	overflow: auto;
    }
    .modal-left img{
    	width: 12.6%;
    	margin: 2%;
    	border:1px solid transparent;
    	cursor: pointer;
    	&.active{
    		border:1px solid #2d8cf0;
    	}
    }
    #img-box{
    	position: relative;
    }
    .item-title{
    	padding-left: 10px;
    	font-size: 14px;
    	font-weight: 600;
    }
</style>