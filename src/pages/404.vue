<template>
    <div id="not-find">
        <img style="max-width:100%" src="https://jinchan-ctt.oss-cn-hangzhou.aliyuncs.com/images/404.png" alt="404">
    </div>
</template>
<script>
	export default {
	    name: 'NotFind',
	    props:[],
	    data () {
		    return {
               
		    }
	    },
	    watch: {},
		methods: {
           
		},
    }
</script>
<style lang="less" scoped>
    #not-find{
    	width: 500px;
        position: fixed;
        margin-top: -225px;
        top: 50%;
        margin-left: -250px;
        left: 50%;
    }
</style>