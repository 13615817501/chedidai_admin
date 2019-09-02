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
        <Modal width="900" v-model="modifyModal" :title="myTitle" :mask-closable="false"> 
            <div class="modify-modal" style="margin:15px 0;"> 
                <div style="text-align:center;margin:10px 0 30px;">合同条目名称：<Input v-model.trim="name" placeholder="输入后自动匹配出合同条目" style="width: 200px"></Input></div>
                <Table @on-selection-change="selectionChange" border ref="selection" :columns="columns4" :data="contractList" height="500"></Table>
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
        <Modal width="350" v-model="modifyModal2" title="修改" :mask-closable="false"> 
            <div class="modify-modal" style="margin:15px 0;"> 
                <div>
                    <span style="display:inline-block;width:120px;padding-left:10px;">是否必须：</span><Select v-model="modify2.isRequired" class="item-input" placeholder="请选择">
                            <Option :value="0">否</Option>
                            <Option :value="1">是</Option>
                        </Select>    
                </div>
                <div style="margin-top:10px;">
                    <span style="display:inline-block;width:120px;padding-left:10px;">是否需要电子签：</span><Select v-model="modify2.isSign" class="item-input" placeholder="请选择">
                            <Option :value="0">否</Option>
                            <Option :value="1">是</Option>
                        </Select>    
                </div>
                <div style="margin-top:10px;">
                    <span style="display:inline-block;width:120px;padding-left:10px;">排序：</span><Input v-model="modify2.sort" clearable placeholder="请输入排序" style="width: 120px"></Input>
                </div>
            </div>  
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn2">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
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
            modifyModal2:false,
            modalTipTitle:'禁用该产品合同条目',
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
            ItemId: '',
            isRequiredArr:[], //保存是否必须的选中的集合
            isSignArr:[], //保存是否需要签名的选中的集合
            selection:[],  //被选中的集合
			search:{
                prodId: this.$route.query.prodId,
			    pageNum: 1,
			    pageSize:15
			},
            modify2:{
                isSign: '', 
                isRequired: '',
                sort:''
            },
            isInterestHeadEnum:[], //是否利息前置
            calInterestWayEnum:[], //计算利息方式
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
                                    type: 'error',
                                    size: 'small',
                                },
                                style: {
                                    'margin-left':'10px',
                                    display: params.row.status=='1'?'inline-block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.modalTipTitle = '禁用该产品合同条目';
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
                                    display: params.row.status=='0'?'inline-block':'none'
                                },
                                on: {
                                    click: () => {
                                        this.modalTipTitle = '启用该产品合同条目';
                                        this.tipModal = true;
                                        this.item = params.row;
                                    }
                                }
                            }, '启用'),
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
                                        this.modifyModal2 = true;
                                        this.id = params.row.id;
                                        this.modify2 = {
                                            isSign:params.row.isSign?1:0,
                                            isRequired:params.row.isRequired?1:0,
                                            sort:params.row.sort
                                        }
                                    }
                                }
                            }, '修改')
                        ]);
                    }
                }, {
					title: '合同条目ID',
					key: 'contractItemId',
					minWidth: 90,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.contractItemId)
						]);
					}
				},{
                    title: '合同条目名称',
                    key: 'contractItemName',
                    minWidth: 150,
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
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.isRequired?'是':'否')
                        ]);
                    }
                },{
                    title: '是否需要电签',
                    key: 'isSign',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.isSign==0?'否':'是')
                        ]);
                    }
                }, {
                    title: '排序',
                    key: 'sort',
                    minWidth: 60,
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
                },{
                    title: '状态',
                    key: 'status',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.status=='0'?'失效':'生效')
                        ]);
                    }
                }
			],
            columns4: [
                {
                    type: 'selection',
                    width: 50,
                    align: 'center'
                },{
                    title: '合同条目ID',
                    key: 'id',
                    minWidth: 100,
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
                    minWidth:90,
                    render: (h, params) => {
                         return h('div', [
                            h('Checkbox', {
                                props: {
                                   value: params.row.isRequired
                                },
                                on: {
                                    'input': (event) => {
                                        params.row.isRequired = event;
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
                },{
                    title: '是否需要电签',
                    key: 'isSign',
                    minWidth: 110,
                    render: (h, params) => {
                         return h('div', [
                            h('Checkbox', {
                                props: {
                                   value: params.row.isSign
                                },
                                on: {
                                    'input': (event) => {
                                        params.row.isSign = event;
                                        if(params.row.isSign){
                                            this.isSignArr.push({id:params.row.id,isSign:params.row.isSign});
                                        }else{
                                            this.isSignArr.forEach( (item, index) => {
                                                if(params.row.id==item.id){
                                                    this.isSignArr.splice(index,1);
                                                }   
                                            });
                                        }
                                    }
                                }
                            })
                        ]);
                    }
                }, {
                    title: '创建时间',
                    key: 'createTime',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.createTime)
                        ]);
                    }
                }, {
                    title: '路径',
                    key: 'resource',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.resource)
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
        this.search.prodId = this.$route.query.prodId;
        this.getInitialList(this.search);
        this.getContractItemList();
	},
    watch:{
        name(newVal,oldVal){
            if (newVal) {
                this.$axios.get('/fx?api=gate.prod.admin.contractItemList', {params:{name: newVal,pageNum:1,pageSize:10000}}).then(res => {
                    this.contractList = res.list.filter(item => item.name.toLowerCase().indexOf(item.name.toLowerCase()) > -1);
                    this.contractList.map( (item, index) => {
                        item.isRequired = false;
                        item.isSign = false;
                    });
                })
            } else {
                this.getContractItemList();
            }
        }
    },
	methods: {
        getContractItemList(){
            this.$axios.get('/fx?api=gate.prod.admin.contractItemList', {params:{pageNum:1,pageSize:10000}}).then(res => {
                this.contractList = res.list;
                this.contractList.map( (item, index) => {
                    item.isRequired = false;
                    item.isSign = false;
                });
            })
        },
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
            this.name = '';
            this.getContractItemList();
            this.contractList.forEach( (ele, index) => {
                ele.isRequired = false;
            });
            this.isRequiredArr = [];//保存是否必须的选中的集合
            this.selection = []; //被选中的集合
        },
        confirmBtn(){
            this.selection.forEach( (item, sub) => {
                this.isRequiredArr.forEach( (ele, index) => {
                   if(item.id == ele.id){
                       item.isRequired = ele.isRequired;
                   }
                });
                this.isSignArr.forEach( (ele, index) => {
                   if(item.id == ele.id){
                       item.isSign = ele.isSign;
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
        confirmBtn2(){
            let formData = {...this.modify2};
            if(!formData.sort){
                return this.$Message.error('排序不能为空');
            }
            formData.isSign = formData.isSign==1?true:false;
            formData.isRequired = formData.isRequired==1?true:false;
            formData.id = this.id;
            this.$axios.post('/fx?api=gate.prod.admin.mdfContProdMapping',formData).then(res => {
                if(res!=500){
                    this.$Message.success('操作成功');
                    this.getInitialList(this.search);
                }
                this.modifyModal2 = false;
            })
        },
        cancel(){
            this.tipModal = false;
            this.modifyModal = false;
            this.modifyModal2 = false;
            this.name = '';
        },
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.getInitialList(this.search);
            }
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