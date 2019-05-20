<template>
    <div id="welcome">
        <img src="https://jinchan-ctt.oss-cn-hangzhou.aliyuncs.com/images/welcome1.png" alt="欢迎">
    </div>
</template>
<script>
import util from '@/util/util'
export default {
	name: 'Welcome',
	props:[],
	data () {
		return {
           
		}
	},
	watch: {
       
	},
	methods: {
        
	},
}
</script>
<style lang="less" scoped>
    #welcome{
    	text-align: center;
        height: 100%;
        img{
        	width: 400px;
            position: absolute;
            margin-top: -200px;
            top: 50%;
            margin-left: -200px;
            left: 50%;
        }
    }
</style>