<template>
    <span id="modalPic">
        <Modal class="preview-img" width="500" v-model="modal" title="图片预览" :mask-closable="false" :closable="false"> 
            <img-zoom v-if="!morePic" :src="bigimg"  width="470" height="500" :bigsrc="bigimg" :configs="configs"></img-zoom>
            <div v-if="morePic" class="imgs-item">
	            <span v-for="(img,index) in imgs" :key="index">
	                <img-zoom :src="img"  width="140" height="140" :bigsrc="img" :configs="configs"></img-zoom>
	            </span>
    		    <span v-for="item in arrSpan" style="display:inline-block;visibility:hidden;width:140px;height:140px"></span>
            </div>
            <div slot="footer">
	            <Button type="primary" @click="confirmBtn">确定</Button>
	        </div> 
        </Modal>
    </span>
</template>
<script>
    import imgZoom from 'vue2.0-zoom' 
	export default {
	    name: 'ModalPic',
	    props:['modal','morePic','imgs','bigimg'],
	    data () {
		    return {
		    	arrSpan: [],
				configs: {
					width: 650,
					height: 500,
					maskWidth: 100,
					maskHeight: 100,
					maskColor: 'red',
					maskOpacity: 0.2
				}
		    }
	    },
	    watch:{
            imgs(newVal,oldVal){
                this.arrSpan.length = this.imgs.length==9?0:3-(this.imgs.length%3); //弹性布局需要加空的占位元素
            } 
	    },
		components: {
			imgZoom
		},
		methods: {
			confirmBtn(){
                this.$emit('cancel');
			}
		}
    }
</script>
<style lang="less" scoped>
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