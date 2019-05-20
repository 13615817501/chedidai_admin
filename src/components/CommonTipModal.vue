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
                }else if(this.modalTipTitle=='禁用该客户' || this.modalTipTitle=='启用该客户'){
                    formUrl = '/fx?api=gate.user.admin.disOrEnable';  //这里还需要修改
                    formData.id = this.item.id;
                    if(this.modalTipTitle=='启用该客户'){
                        formData.status = 1;
                    }else{
                        formData.status = 0;
                    }
                }else if(this.modalTipTitle=='通过该门店处理订单'){
                    formUrl = '/fx?api=gate.order.admin.checkOfflinePass';  //这里还需要修改
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='通过该审核订单'){
                    formUrl = '/fx?api=gate.order.admin.checkPass';  //这里还需要修改
                    formData.orderId = this.item.orderId;
                }else if(this.modalTipTitle=='退回该审核订单'){
                    formUrl = '/fx?api=gate.order.admin.checkBack';  //这里还需要修改
                    formData.orderId = this.item.orderId;
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