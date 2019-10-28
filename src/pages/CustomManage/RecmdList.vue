<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>客户管理</BreadcrumbItem>
	        <BreadcrumbItem>推荐列表</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span><span style="color:#2d8cf0;">{{user.name}}</span>一级推荐人：<span v-if="!first.name">无</span><span class="tag" @click="handleTagClick(first.mobile)" v-if="first.name">{{first.name}}</span></span>
            <span>&nbsp;|&nbsp;&nbsp;<span style="color:#2d8cf0;">{{user.name}}</span>二级推荐人：<span v-if="!first.name">无</span><span class="tag" @click="handleTagClick(second.mobile)" v-if="second.name">{{second.name}}</span></span>
            <span>
                &nbsp;&nbsp;&nbsp;<Input v-model="search.mobile" clearable placeholder="请输入手机号" style="width: 120px"></Input>
            </span>
            <Button type="primary" icon="ios-search" style="margin-left:10px;" @click="searchList">搜索</Button>
        </div> 
	    <div class="listadmin">
            <Table border :columns="columns" :data="certifyList" :height="adjustHeight" @on-row-click="rowClick"></Table>
        </div>
        <div style="text-align:center;margin-top:20px;">
            <Page :current = "search.pageNum" :total="totalCount" :page-size="search.pageSize" @on-change="pageChange" show-total></Page>
        </div>
    </div>
</template>
<script>
import util from '@/util/util'
import moment from 'moment'
import { mapState } from 'vuex'
export default {
	name: 'CustomList',
	props:[],
	data () {
		return {
			totalCount: 0,
            isTag:false, //判断是不是点击的是标签
            search:{
                mobile:'',
                pageNum:1,
                pageSize:15
            },
            search2:{
                mobile:'',
                pageNum:1,
                pageSize:15
            },
            first:{},
            second:{},
            user:{},
			table_loading: false, //默认先显示加载
			certifyList:[],
            columns: [{
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
                    title: '直推人数',
                    key: 'firstTotal',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.firstTotal)
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
                    title: '身份证',
                    key: 'identityCard',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.identityCard)
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
        this.getInitialList(this.search);
	},
	methods: {
		getInitialList(formData){ 
            this.table_loading = true;
		    this.$axios.get('/fx?api=gate.user.refenrrerTree',{params:formData}).then(res => {
		    	if(res!=500){
                    this.certifyList = res.page.list;
                    this.first = res.first;
                    this.second = res.second;
                    this.user = res.user;
			        this.totalCount = res.page.page.totalCount;
			        this.search.pageNum = res.page.page.currentPage;
			        this.$store.commit('change_height');
		    	}
		    	this.table_loading = false;
			})
		},
        pageChange(page){
            if(this.isTag){
                this.search2.pageNum = page;
                this.getInitialList(this.search2); 
            }else{
                this.search.pageNum = page;
                this.getInitialList(this.search); 
            }
        },
        searchList() {
            this.isTag = false;
        	this.search.pageNum = 1;
			this.getInitialList(this.search);
		},
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.getInitialList(this.search);
            }
        },
        handleTagClick(mobile){
            this.isTag = true;
            this.search = {
                mobile: '',
                pageNum: 1,
                pageSize: 15
            };
            this.search2 = {
                mobile: mobile,
                pageNum: 1,
                pageSize: 15
            };
            this.getInitialList(this.search2); 
        },
        rowClick(data,index){
            this.handleTagClick(data.mobile);
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
    .tag{
        display: inline-block;
        border:1px solid #91d5ff;
        color: #1890ff;
        line-height: 20px;
        background: #e6f7ff;
        margin: 2px 4px 2px 0;
        padding: 0 8px;
        border-radius: 3px;
        cursor: pointer;
    }
</style>