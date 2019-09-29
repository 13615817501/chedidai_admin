<template>
    <span id="chooseReason">
        <Modal width="450" v-model="modal" :title="title" :mask-closable="false" class="passModal" :closable="false"> 
            <span v-for="item in ModalContent" @click="addblur(item)" :class="{active:activeState==item}">{{item}}</span>
            <Input v-show="showInput" v-model.trim="otherInput" :maxlength="12" style="width:150px;margin-left:10px;" placeholder="请输入..." />
            <div slot="footer">
	            <Button type="primary" :loading="modal_loading" @click="confirmBtn">确定</Button>
	            <Button @click="cancel">取消</Button>
	        </div> 
        </Modal>
    </span>
</template>
<script>
	export default {
	    name: 'ChooseReason',
	    props:['orderId','modal','title','ModalContent'],
	    data () {
		    return {
                modal_loading:false,
                activeState:this.ModalContent[0],
                otherInput:'',
                showInput:false,
		    }
	    },
	    watch:{
            modal(newVal,oldVal){
                this.activeState = this.ModalContent[0];
                this.showInput = false;
            }
	    },
		methods: {
			addblur(name) {
				if(name == '其他'){
					this.showInput = true;
				}else{
					this.showInput = false;
				}
				this.activeState = name;
			},
			confirmBtn(){
				let formData = {
                    orderId: this.orderId,
	            };
	            let myUrl = '/fx?api=gate.order.admin.refuse';
	            if(this.title=='待发起核保拒绝'||this.title=='待复审拒绝'||this.title=='待确认拒绝'){
                    formData.content = this.activeState!='其他'?this.activeState:this.otherInput;
	            }
	            switch (this.title) {
	            	case '待审核拒绝':
	            		myUrl = '/fx?api=gate.order.admin.refuse';
	            		formData.content = this.activeState!='其他'?this.activeState:this.otherInput;
	            		break;	
	            	case '待门店处理拒绝':
	            		myUrl = '/fx?api=gate.order.admin.checkOfflineRefuse';
	            		formData.msg = this.activeState!='其他'?this.activeState:this.otherInput;
	            		break;		
	            }
	            
	            this.$axios.post(myUrl,formData).then(res => {
			    	if(res!=500){
			    	    this.$emit('get-status','');
			    	}else{
			    		this.$emit('get-status',500);
			    	}
			    	this.otherInput = '';
			    	this.table_loading = false;
			    }) 
            },
	        cancel(){
	        	this.$emit('cancel');
	        }
		}
    }
</script>
<style lang="less" scoped>
    .passModal span{
      	display: inline-block;
	    text-align: center;
	    border: 1px solid #ddd;
	    cursor: pointer;
	    vertical-align: middle;
	    margin: 10px 0;
	    padding: 6px 15px;
	    margin-left: 10px;
	    &.active{
	    	color: #2d8cf0;
            border-color: #2d8cf0;
	    }
    }
    .imgs-item{
    	display: flex;
    	justify-content: space-between;
    	align-items: center;
    	flex-wrap: wrap;
    	span{
    		margin: 5px;
    	}
    }
</style>