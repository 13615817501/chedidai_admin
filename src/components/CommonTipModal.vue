<template>
    <div id="commonTipModal">
        <Modal v-model="modal" title="提示" :mask-closable="false" width="360" :closable="false">
            <div style="text-align:center">
	            <slot></slot>	
	        </div>
	        <div slot="footer">
	            <Button type="primary" :loading="modal_loading" @click="comfirmBtn">确定</Button>
	            <Button @click="cancel">取消</Button>
	        </div>
        </Modal>
    </div>
</template>
<script>
	export default {
	    name: 'CommonTipModal',
	    props:{
            modal:Boolean,
            item: Object,
            modalTipTitle: String,
            adminId:String
	    },
	    data () {
		    return {
                modal_loading: false,
                orderIds: '', //订单ID，多个 , 分割
		    }
	    },
	    watch: {
            
	    },
		methods: {
            comfirmBtn(){ 
            	let formData = { };
            	let formUrl = '';
                if(this.modalTipTitle=='删除该部门组织'){
                    formData.id = this.item.id;
                    formUrl = '/fx?api=gate.iam.delOrg';
                }else if(this.modalTipTitle=='删除该管理员'){
                    formUrl = '/fx?api=gate.auth.adminInfoModify';  //这里还需要修改
                    formData.adminId = this.adminId;
                    formData.status = '0';
                }else if(this.modalTipTitle=='删除该门店产品'){
                    formUrl = '/fx?api=gate.admin.store.delProdMapping';  //这里还需要修改
                    formData.id = this.item.id;
                }else if(this.modalTipTitle=='删除该产品组'){
                    formUrl = '/fx?api=gate.delete.productGroup.admin';  //这里还需要修改
                    formData.id = this.item.id;
                }else if(this.modalTipTitle=='下架该产品' || this.modalTipTitle=='上架该产品'){
                    formUrl = '/fx?api=gate.status.product.admin';  //这里还需要修改
                    formData.id = this.item.id;
                    if(this.modalTipTitle=='下架该产品'){
                        formData.status = 2;
                    }else{
                        formData.status = 1;
                    }
                }else if(this.modalTipTitle=='上架该合同类目' || this.modalTipTitle=='下架该合同类目'){
                    formUrl = '/fx?api=gate.prod.admin.mdfContractItem';  //这里还需要修改
                    formData.id = this.item.id;
                    if(this.modalTipTitle=='下架该合同类目'){
                        formData.status = 0;
                    }else{
                        formData.status = 1;
                    }
                }else if(this.modalTipTitle=='禁用该客户' || this.modalTipTitle=='启用该客户'){
                    formUrl = '/fx?api=gate.user.admin.disOrEnable';  //这里还需要修改
                    formData.id = this.item.id;
                    if(this.modalTipTitle=='启用该客户'){
                        formData.status = 1;
                    }else{
                        formData.status = 0;
                    }
                }else if(this.modalTipTitle=='通过该门店处理订单'){
                    formUrl = '/fx?api=gate.order.admin.checkOfflinePass';  
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='通过该审核订单'){
                    formUrl = '/fx?api=gate.order.admin.checkPass';
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='通过该复审订单'){
                    formUrl = '/fx?api=gate.order.admin.checkAgain';  
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='禁用该产品合同条目'){
                    formUrl = '/fx?api=gate.prod.admin.delContProdMapping'; 
                    formData.id = this.item.id;
                    formData.status = '0';
                }else if(this.modalTipTitle=='启用该产品合同条目'){
                    formUrl = '/fx?api=gate.prod.admin.delContProdMapping'; 
                    formData.id = this.item.id;
                    formData.status = '1';
                }else if(this.modalTipTitle=='通过该签署合同'){
                    formUrl = '/fx?api=gate.order.admin.signContract';  
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='GPS安装确认'){
                    formUrl = '/fx?api=gate.order.admin.installedGps';  
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='抵押完成确认'){
                    formUrl = '/fx?api=gate.order.admin.mortgaged'; 
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='通过该待复审订单'){
                    formUrl = '/fx?api=gate.order.admin.checkAgain';  
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='首款放款确认'){
                    formUrl = '/fx?api=gate.order.admin.loanFirst'; 
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='尾款放款确认'){
                    formUrl = '/fx?api=gate.order.admin.loan';  
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='GPS信息确认'){
                    formUrl = '/fx?api=gate.order.admin.checkPassGps';  
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='认领'){
                    formUrl = '/fx?api=gate.order.admin.claiming'; 
                    formData.orderId = this.item.orderId;
                    formData.type = 4;
                }else if(this.modalTipTitle=='还款划扣'){
                    formUrl = '/fx?api=gate.order.admin.deductedMonthly';  
                    formData.orderId = this.item.orderId;
                    formData.repaymentPlanId = this.item.repaymentPlanId;
                }else if(this.modalTipTitle=='资料回寄完成'){
                    formUrl = '/fx?api=gate.order.admin.fileCollectFinish';  
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='审核催收订单'){
                    formUrl = '/fx?api=gate.order.collect.audit';  
                    formData.id = this.item.id;
                }else if(this.modalTipTitle=='认领该门店处理'){
                    formUrl = '/fx?api=gate.order.admin.claiming';  
                    formData.orderId = this.item.orderId;
                    formData.type = 1;
                }else if(this.modalTipTitle=='认领该初审订单'){
                    formUrl = '/fx?api=gate.order.admin.claiming';  
                    formData.orderId = this.item.orderId;
                    formData.type = 2;
                }else if(this.modalTipTitle=='认领该复审订单'){
                    formUrl = '/fx?api=gate.order.admin.claiming';  
                    formData.orderId = this.item.orderId;
                    formData.type = 3;
                }else if(this.modalTipTitle=='认领该贷后'){
                    formUrl = '/fx?api=gate.order.admin.claiming';  
                    formData.orderId = this.item.orderId;
                    formData.type = 5;
                }else if(this.modalTipTitle=='删除该订单备注'){
                    formUrl = '/fx?api=gate.order.admin.remarkDel';  
                    formData.id = this.item.id;
                }else if(this.modalTipTitle=='资产处置'){
                    formUrl = '/fx?api=gate.order.admin.toAssetDisposa';  
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='电签归档'){
                    formUrl = '/fx?api=gate.contract.seal.archive';  
                    formData.flowId = this.item.flowId;
                }else if(this.modalTipTitle=='电签撤回'){
                    formUrl = '/fx?api=gate.contract.seal.revoke';  
                    formData.flowId = this.item.flowId;
                }else if(this.modalTipTitle=='已发起核保'){
                    formUrl = '/fx?api=gate.order.launchUnderwriting';  
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle.includes('确认金额')){
                    formUrl = '/fx?api=gate.order.confirm';  
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='上架该门店产品'){
                    formUrl = '/fx?api=gate.admin.store.pubProdMapping';  
                    formData.id = this.item.id;
                    formData.status = 1;
                }else if(this.modalTipTitle=='下架该门店产品'){
                    formUrl = '/fx?api=gate.admin.store.pubProdMapping';  
                    formData.id = this.item.id;
                    formData.status = 0;
                }else if(this.modalTipTitle=='删除该划扣记录'){
                    formUrl = '/fx?api=gate.order.excle.deleteDeductUpload';  
                    formData.id = this.item.id;
                }
                this.modal_loading = true;
                this.$axios.post(formUrl,formData).then(res => { 
					if(res!=500){
                        this.$emit('comfirmBtn');
					}else{
                        this.$emit('comfirmBtn',500);
                    }
					this.modal_loading = false;
				})
            },
            cancel(){
	            this.$emit('cancel');
            }
		},
    }
</script>
<style lang="less" scoped>

</style>