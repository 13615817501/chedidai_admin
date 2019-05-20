<template>
    <span id="roleSelect">
        <Select v-model="roleId" style="width:164px"  :loading="loading" :key="Math.random()">
            <Option v-for="item in roleList" :value="item.code" :key="item.code">{{ item.value }}</Option>
        </Select>
    </span>
</template>
<script>
	export default {
	    name: 'RoleSelect',
	    props:['myroleid','myorgId','myStatus'],
	    data () {
		    return {
		    	loading: false,
		    	roleId: this.myroleid,
                roleList: [],
                onceTime:false
		    }
	    },
	    watch: {
            roleId(newval,oldval){
               if(newval){
                   	this.$emit('get-roleId',newval);
               }else{
               	    this.$emit('get-roleId',''); //清空渠道传空
               }
            },
            myStatus(newval,oldval){
                if(newval){
                    this.roleId = this.myroleid; 
                    this.onceTime = true;
                }
            },
            myorgId(newval,oldval){
                if(newval){
                    if(!this.onceTime){
                        this.roleId = '';
                    }
                    this.onceTime = false;
                    this.getRoleList({orgId:newval});
                }
            }
	    },
	    created(){
		    this.getRoleList();
	    },
		methods: {
            getRoleList(formData){ //获取渠道列表
                this.$axios.get('/fx?api=gate.auth.roleList',{params:formData}).then(res => {
          			if(res){
          				this.roleList = res.list;
          			}
          		})
    		}
		}
    }
</script>
<style lang="less" scoped>

</style>