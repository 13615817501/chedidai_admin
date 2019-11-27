<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>产品管理</BreadcrumbItem>
	        <BreadcrumbItem>合同条目</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                条目名称: 
                <Input v-model="search.name" clearable placeholder="请输入条目名称" style="width: 120px"></Input>
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
        <Modal width="350" v-model="modifyModal" :title="myTitle" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div style="margin: 10px 0"><span class="item-comm required">合同条目名称：</span><Input class="item-input" v-model="modify.name" placeholder="请输入..." /></div>
                <div style="margin: 10px 0"><span class="item-comm required">网络资源：</span><Input class="item-input" v-model="modify.resource" placeholder="请输入..." /></div>
                <div style="margin: 10px 0"><span class="item-comm">备注：</span><Input class="item-input" v-model="modify.content" placeholder="请输入..." /></div>
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
                name:'',
			    pageNum: 1,
			    pageSize:15
			},
            labelEnum:[], //产品标签 
            isInterestHeadEnum:[], //是否利息前置
            calInterestWayEnum:[], //计算利息方式
            modify: {
                name:'',
                resource:'',
                content:''
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
                                        this.modalTipTitle = '下架该合同类目';
                                        this.item = params.row;
                                    }
                                }
                            }, '下架'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                },
                                style: {
                                    'margin-left':'10px',
                                    display: params.row.status=='0'?  'inline-block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '上架该合同类目';
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
                                        this.modify = {
                                            name:  params.row.name,
                                            resource:  params.row.resource,
                                            content:  params.row.content
                                        }
                                        this.modifyModal = true;
                                    }
                                }
                            }, '修改')
                        ]);
                    }
                }, {
					title: '合同条目名称',
					key: 'name',
					minWidth: 100,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.name)
						]);
					}
				},{
                    title: '网络资源',
                    key: 'resource',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.resource)
                        ]);
                    }
                }, {
                    title: '状态',
                    key: 'status',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.status=='0'?'失效':params.row.status=='1'?'生效':'')
                        ]);
                    }
                }, {
                    title: '备注',
                    key: 'content',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.content)
                        ]);
                    }
                }, {
                    title: '创建时间',
                    key: 'createTime',
                    minWidth: 160,
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
		    this.$axios.get('/fx?api=gate.prod.admin.contractItemList',{params:formData}).then(res => {
		    	if(res!=500){
		    		this.certifyList = res.list;
			        this.totalCount = res.page.totalCount;
			        this.search.pageNum = res.page.currentPage;
			        this.$store.commit('change_height');
		    	}
		    	this.table_loading = false;
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
                name:'',
                resource:'',
                content:''
            }
        },
        clickFaceImg(img){
            this.bigimg = img;
            this.modalPreview = true;
        },
        confirmBtn(){
            if(!this.modify.name || !this.modify.resource){
                return this.$Message.error('带 * 为必填项');
            }
            this.modal_loading = true;
            let formDate = {...this.modify};
            let myUrl = '/fx?api=gate.prod.admin.addContractItem';
            if( this.myTitle == '修改'){
                formDate.id = this.id;
                myUrl = '/fx?api=gate.prod.admin.mdfContractItem';
            }
            this.$axios.post(myUrl,formDate).then(res => {
                if(res!=500){
                    this.$Message.success('操作成功');
                    this.getInitialList(this.search);
                }
                this.modal_loading = false;
                this.modifyModal = false;
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