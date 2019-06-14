<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>放款管理</BreadcrumbItem>
	        <BreadcrumbItem>催收反馈</BreadcrumbItem>
	    </Breadcrumb>
        <div class="search-box">
            <span>
                &nbsp;&nbsp;期数: 
                <Input v-model="search.period" clearable placeholder="请输入期数" style="width: 120px"></Input>
            </span>
            <span>
                &nbsp;&nbsp;状态: 
                <Select v-model="search.status" style="width:120px" clearable>
                    <Option :value="1">待财务审核</Option>
                    <Option :value="2">通过财务审核</Option>
                </Select>
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
        <ModalPic :modal="modalPreview" :bigimg="bigimg" @cancel="cancel"></ModalPic>
    </div>
</template>
<script>
import util from '@/util/util'
import CommonTipModal from '@/components/CommonTipModal' //公用的提示组件 
import ImgUpload from '@/components/ImgUpload' //公用的提示组件 
import ModalPic from '@/components/ModalPic' //公用的提示组件 
import moment from 'moment'
import { mapState } from 'vuex'
export default {
	name: 'CustomList',
	props:[],
	data () {
		return {
			totalCount: 0,
            backModal:false,
            modalPreview:false,
            bigimg:'',
            modalTipTitle:'审核催收订单',
            tipModal:false,
            item:{},
            modal_loading:false,
            orderId:'',
			search: {
                period: '',
                status:''
            },
            remoteSetting: {
                remote: true,
                remoteMethod: this.remoteMethod
            },
            modify: {
                amount:''
            },
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
                                    disabled: params.row.status!=1
                                },
                                style: {
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                        this.tipModal = true;
                                        this.modalTipTitle = '审核催收订单';
                                        this.item = params.row;
                                    }
                                }
                            }, '审核')
                        ]);
                    }
                }, {
                    title: '订单号',
                    key: 'orderNumber',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.orderNumber)
                        ]);
                    }
                }, {
                    title: '期数',
                    key: 'period',
                    minWidth: 60,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.period)
                        ]);
                    }
                }, {
                    title: '图片',
                    key: 'pics',
                    minWidth: 250,
                    render: (h, params) => {
                        let arr = []
                        params.row.pics.forEach( (item, index) => {
                            arr.push(h('img', {
                                domProps: {
                                    src: item.value,
                                },
                                slot: "content",
                                style: {
                                    width: "50px",
                                    height: '50px',
                                    'vertical-align': 'middle',
                                    margin: '5px',
                                    cursor:"pointer"
                                },
                                on: {
                                    click: () => {
                                        if(item.value){
                                            this.clickFaceImg(item.value);
                                        }
                                    }
                                }
                            }, ''));
                        });
                        return h('div', arr);
                    }
                }, {
                    title: '备注',
                    key: 'remark',
                    minWidth: 120,
                     render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.remark)
                        ]);
                    }
                }, {
                    title: '状态',
                    key: 'status',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.status==1?'待财务审核':params.row.status==2?'通过财务审核':'')
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
                },{
                    title: '修改时间',
                    key: 'modifyTime',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.modifyTime)
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
                                        this.$router.push({name:'ProcessDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'CollectFeedback'}});
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
                                        this.$router.push({name:'LoanDetail',query:{orderId:params.row.orderId,pageNum:this.search.pageNum,name:'CollectFeedback'}});
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
        ModalPic
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
		    this.$axios.get('/fx?api=gate.order.collect.query',{params:formData}).then(res => {
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
            this.modifyModal = false;
            this.modalPreview = false;
        },
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('审核成功');
                this.getInitialList(this.search);
            }
        },
        clickFaceImg(img){
            this.bigimg = img;
            this.modalPreview = true;
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