<template>
    <span id="roleSelect">
        <Select v-model="roleId" style="width:164px"  :loading="loading" :key="Math.random()">
            <Option v-for="item in roleList" :value="item.k" :key="item.k">{{ item.v }}</Option>
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
            // myorgId(newval,oldval){
            //     if(newval){
            //         if(!this.onceTime){
            //             this.roleId = '';
            //         }
            //         this.onceTime = false;
            //         this.getRoleList({orgId:newval});
            //     }
            // }
      },
    mounted(){
        this.getRoleList();
    },
    methods: {
            getRoleList(formData){ //获取角色列表
                this.$axios.get('/fx?api=gate.auth.queryRoleList',{params:formData}).then(res => {
                if(res){
                  this.roleList = res;
                }
              })
        }
    }
    }
</script>
<style lang="less" scoped>

</style>