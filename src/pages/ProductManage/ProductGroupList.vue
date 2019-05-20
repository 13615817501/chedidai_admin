<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>产品管理</BreadcrumbItem>
	        <BreadcrumbItem>产品组列表</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                产品组名称: 
                <Input v-model="search.name" clearable placeholder="请输入..." style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;产品组简写: 
                <Input v-model="search.shortName" clearable placeholder="请输入..." style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;公司代码: 
                <Input v-model="search.companyCode" clearable placeholder="请输入..." style="width: 120px"></Input>
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
        <Modal width="500" v-model="modifyModal" :title="myTitle" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">
                    <span class="item-comm required">产品名称：</span><Input class="item-input" v-model="modify.name" placeholder="请输入..." />
                    <span class="item-comm required">产品类型名称：</span><Input class="item-input" v-model="modify.shortName" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required">公司代码：</span><Input class="item-input" v-model="modify.companyCode" placeholder="请输入..." />
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
            modalTipTitle:'删除该产品组',
            tipModal:false,
            myTitle:'新增',
            item:{},
            bigimg:'',
            picUrl:'',
            modalPreview:false,
            modal_loading:false,
            storeNames:[],
            id:'',
			search:{
                name:'',
                shortName:'',
                companyCode:'',
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
                name:'',
                shortName:'',
                companyCode:''
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
                                        this.id = params.row.id;
                                        this.myTitle = '修改';
                                        this.modify = {
                                            name: params.row.name,
                                            shortName: params.row.shortName,
                                            companyCode: params.row.companyCode
                                        };
                                        this.modifyModal = true;
                                    }
                                }
                            }, '修改'),
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
                                        this.id = params.row.id;
                                        this.item = params.row;
                                        this.tipModal = true;
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }, {
					title: '产品组名称',
					key: 'name',
					minWidth: 160,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.name)
						]);
					}
				}, {
                    title: '产品组简写',
                    key: 'shortName',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.shortName)
                        ]);
                    }
                }, {
                    title: '公司代码',
                    key: 'companyCode',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.companyCode)
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
		    this.$axios.get('/fx?api=gate.list.productGroup.admin',{params:formData}).then(res => {
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
                shortName:'',
                companyCode:''
            };
        },
        confirmBtn(){
            if(!this.modify.name || !this.modify.shortName || !this.modify.companyCode){
                return this.$Message.error("带 * 为必填项"); 
            }
            let formData = {...this.modify};
            let  myUrl = '/fx?api=gate.addOrUpdate.productGroup.admin';
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
        padding-left:14px;
    }
</style>