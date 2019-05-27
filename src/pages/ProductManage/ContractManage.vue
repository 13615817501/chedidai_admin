<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>产品管理</BreadcrumbItem>
            <BreadcrumbItem>产品列表</BreadcrumbItem>
	        <BreadcrumbItem>产品合同</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <Button type="primary" @click="backBtn"><Icon type="ios-arrow-back" />返回</Button>
            <Button type="primary" icon="md-add" style="margin-left:10px;" @click="addBtn">新增</Button>
        </div> 
	    <div class="listadmin">
            <Table border :columns="columns" :data="certifyList" :height="adjustHeight"></Table>
        </div>
        <div style="text-align:center;margin-top:20px;">
            <Page :current = "search.pageNum" :total="totalCount" :page-size="search.pageSize" @on-change="pageChange" show-total></Page>
        </div>
        <Modal width="650" v-model="modifyModal" :title="myTitle" :mask-closable="false"> 
            <div class="modify-modal" style="margin:15px 0;"> 
                <div style="text-align:center;margin:10px 0 30px;">合同条目名称：<Input v-model.trim="name" placeholder="输入后自动匹配出合同条目" style="width: 200px"></Input></div>
                <Table @on-selection-change="selectionChange" border ref="selection" :columns="columns4" :data="contractList"></Table>
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
            name:'',
            bigimg:'',
            picUrl:'',
            modalPreview:false,
            modal_loading:false,
            storeNames:[],
            id:'',
            contractList:[], //合同列表集合
            contractItemIdsArrObj:[],  //选中合同条目集合 每项都是对象
            contractItemIdsArr:[],  //选中合同条目集合    每项都是文本
            ItemId: '',
            isRequiredArr:[], //保存是否必须的选中的集合
            selection:[],  //被选中的集合
			search:{
                prodId: this.$route.query.prodId,
			    pageNum: 1,
			    pageSize:15
			},
            isInterestHeadEnum:[], //是否利息前置
            calInterestWayEnum:[], //计算利息方式
			table_loading: false, //默认先显示加载
			certifyList:[],
            columns: [{
                    title: '操作',
                    key: 'action',
                    width: 100,
                    align: 'center',
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
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
                                        this.modalTipTitle = '删除该产品合同条目';
                                        this.tipModal = true;
                                        this.item = params.row;
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }, {
					title: '合同条目ID',
					key: 'contractItemId',
					minWidth: 160,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.contractItemId)
						]);
					}
				},{
                    title: '合同条目名称',
                    key: 'contractItemName',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.contractItemName)
                        ]);
                    }
                },{
                    title: '产品ID',
                    key: 'prodId',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.prodId)
                        ]);
                    }
                }, {
                    title: '产品名称',
                    key: 'prodName',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.prodName)
                        ]);
                    }
                },{
                    title: '是否必须',
                    key: 'isRequired',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.isRequired?'是':'否')
                        ]);
                    }
                }, {
                    title: '排序',
                    key: 'sort',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.sort)
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
			],
            columns4: [
                {
                    type: 'selection',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
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
                                        this.modalTipTitle = '删除该产品合同条目';
                                        this.tipModal = true;
                                        this.item = params.row;
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }, {
                    title: '合同条目ID',
                    key: 'id',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.id)
                        ]);
                    }
                },{
                    title: '合同条目名称',
                    key: 'name',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.name)
                        ]);
                    }
                },{
                    title: '是否必须',
                    key: 'isRequired',
                    minWidth: 40,
                    render: (h, params) => {
                         return h('div', [
                            h('Checkbox', {
                                props: {
                                   value: params.row.isRequired
                                },
                                on: {
                                    'on-change': () => {
                                        params.row.isRequired = !params.row.isRequired
                                        if(params.row.isRequired){
                                            this.isRequiredArr.push({id:params.row.id,isRequired:params.row.isRequired});
                                        }else{
                                            this.isRequiredArr.forEach( (item, index) => {
                                                if(params.row.id==item.id){
                                                    this.isRequiredArr.splice(index,1);
                                                }   
                                            });
                                        }
                                    }
                                }
                            })
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
    watch:{
        name(newVal,oldVal){
            if (newVal) {
                this.$axios.get('/fx?api=gate.prod.admin.contractItemList', {params:{name: newVal,pageNum:1,pageSize:10000}}).then(res => {
                    this.contractList = res.list.filter(item => item.name.toLowerCase().indexOf(item.name.toLowerCase()) > -1);
                    this.contractList.map( (item, index) => {
                        item.isRequired = false;
                    });
                })
            } else {
                this.contractList = [];
            }
        }
    },
	methods: {
		getInitialList(formData){ 
            this.table_loading = true;
		    this.$axios.get('/fx?api=gate.prod.admin.prodContractList',{params:formData}).then(res => {
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
        },
        confirmBtn(){
            this.selection.forEach( (item, sub) => {
               this.isRequiredArr.forEach( (ele, index) => {
                   if(item.id == ele.id){
                       item.isRequired = ele.isRequired;
                   }
               });
            });
            if(!this.selection.length){
                return this.$Message.error('暂无数据,请重新匹配后再操作 或 未选择合同条目,请选择后再操作');
            }
            this.$axios.post('/fx?api=gate.prod.admin.addContProdMapping',{prodId:this.$route.query.prodId,list:this.selection}).then(res => {
                if(res!=500){
                    this.$Message.success('操作成功');
                    this.name = '';
                    this.getInitialList(this.search);
                }
                this.modifyModal = false;
            })
        },
        cancel(){
            this.tipModal = false;
            this.modifyModal = false;
            this.name = '';
        },
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.getInitialList(this.search);
            }
        },
        saveItemId(option){
            if(!option){
                return;
            }
            let bol = this.contractItemIdsArr.some( (item, index) => {
                return item.id == option.value;
            });
            if(!bol){
                this.contractItemIdsArrObj.push(option);
                this.contractItemIdsArr.push(option.value);
            }
        },
        handleCloseProduct(product){
            this.contractItemIdsArrObj.forEach( (item, index) => {
                if(item.id == product.id){
                   this.contractItemIdsArrObj.splice(index,1);
                   
                }
            });
            this.contractItemIdsArr.splice(this.contractItemIdsArr.indexOf(product.value),1);
        },
        backBtn(){
            this.$router.push({name:this.$route.query.name,query:{pageNum:this.$route.query.pageNum}});
        },
        selectionChange(selection){
            this.selection = selection;
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