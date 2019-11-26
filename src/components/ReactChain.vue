<template>
    <span id="chinaArea">
    	<span>
            一级地市: 
            <Select v-model="outletId1" style="width:120px" clearable remote filterable :remote-method="remoteMethod" @on-change="change" :loading="loading">
                <Option v-for="item in outletId1s" :value="item.k" :key="item.k">{{ item.v }}</Option>
            </Select>
        </span>
        <span>
            &nbsp;&nbsp;二级地市: 
            <Select v-model="outletId2" style="width:120px" clearable remote filterable :remote-method="remoteMethod" @on-change="change" :loading="loading" >
                <Option v-for="item in outletId2s" :value="item.k" :key="item.k">{{ item.v }}</Option>
            </Select>
        </span>
        <span>
            &nbsp;&nbsp;三级地市: 
            <Select v-model="outletId3" style="width:160px" clearable remote filterable :remote-method="remoteMethod" @on-change="change" :loading="loading">
                <Option v-for="item in outletId3s" :value="item.k" :key="item.k">{{ item.v }}</Option>
            </Select>
        </span>
        <span>
            &nbsp;&nbsp;四级地市: 
            <Select v-model="outletId4" style="width:120px" clearable remote filterable :remote-method="remoteMethod" @on-change="change" :loading="loading">
                <Option v-for="item in outletId4s" :value="item.k" :key="item.k">{{ item.v }}</Option>
            </Select>
        </span>
    </span>
</template>
<script>
export default {
	name: 'ReactChain',
	props:{
		parProvince:[Number,String],
		parCity:[Number,String],
		parArea:[Number,String]
	},
	data () {
		return {
            loading:false,
            outletId:null,
            outletId1:null,
		    outletId2:null,
            outletId3:null,
		    outletId4:null,
            outletId1s:[],
            outletId2s:[],
            outletId3s:[],
            outletId4s:[],
            txt: 1,
            changeState:false   //区别远程输入搜索和选择都会触发remoteMethod  为true是由于选择触发  为false是由于输入搜索触发
		}
	},
	watch: {
        'outletId1'(newVal,oldVal){
           if(newVal){
                this.txt = 1;
                this.$emit('changeOutletId',newVal);
            }else{
                this.outletId2 = '';
                this.$emit('changeOutletId','');
            }
            this.outletId2 = '';
            this.outletId3 = '';
            this.outletId4 = '';
            this.outletId2s = [];
            this.outletId3s = [];
            this.outletId4s = [];
        },
        'outletId2'(newVal,oldVal){
            if(newVal){
                this.txt = 2;
                this.$emit('changeOutletId',newVal);
            }else if(this.outletId1){
                this.txt = 1;
                this.$emit('changeOutletId',this.outletId1);
            }
            this.outletId3 = '';
            this.outletId4 = '';
            this.outletId3s = [];
            this.outletId4s = [];
        },
        'outletId3'(newVal,oldVal){
            if(newVal){
                this.txt = 3;
                this.$emit('changeOutletId',newVal);
            }else if(this.outletId2){
                this.txt = 2;
                this.$emit('changeOutletId',this.outletId2);
            }
            this.outletId4 = '';
            this.outletId4s = [];
        },
        'outletId4'(newVal,oldVal){
            if(newVal){
                this.$emit('changeOutletId',newVal);
            }else if(this.outletId3){
                this.$emit('changeOutletId',this.outletId3);
            }
        },
	},
    mounted(){
        this.getAuthUnitPid({pid:0});
    },
	methods: {
        getAuthUnitPid(formData){ //获得四级联动
            this.$axios.get('/fx?api=gate.auth.unitPid',{params:formData}).then(res => {
                if(res!=500){
                    switch (this.txt) {
                        case 1:
                            this.outletId1s = res.list; 
                            break; 
                        case 2:
                            this.outletId2s = res.list; 
                            break; 
                        case 3:
                            this.outletId3s = res.list; 
                            break;  
                        case 4:
                            this.outletId4s = res.list; 
                            break;
                    }  
                }
            })
        },
        remoteMethod(query) { //远程请求 输入搜索和选择下拉都会触发此方法
            let formData = {};
            if(!this.changeState){
                this.txt--;
                formData.key = query;
            }
            switch (this.txt) {
                case 0:
                    formData.pid = 0; 
                    break; 
                case 1:
                    formData.pid = this.outletId1; 
                    break; 
                case 2:
                    formData.pid = this.outletId2; 
                    break; 
                case 3:
                    formData.pid = this.outletId3; 
                    break;  
                case 4:
                    formData.pid = this.outletId4; 
                    break;
            }
            if (query) {
                this.loading = true;
                this.$axios.get('/fx?api=gate.auth.unitPid', {params:formData}).then(res => {
                    if(res!==500){
                        let prodList = res.list.filter(item => item.v.toLowerCase().indexOf(item.v.toLowerCase()) > -1);
                        switch (this.txt) {
                            case 0:
                                this.outletId1s = prodList; 
                                break; 
                            case 1:
                                this.outletId2s = prodList; 
                                break; 
                            case 2:
                                this.outletId3s = prodList; 
                                break;  
                            case 3:
                                this.outletId4s = prodList; 
                                break;
                        }  
                        if(!this.changeState){
                            this.txt++
                        }else{
                            this.changeState = false;
                        }   
                    }
                    this.loading = false;
                })
            } else {
                switch (this.txt) {
                        case 1:
                            this.outletId1s = []; 
                            break; 
                        case 2:
                            this.outletId2s = []; 
                            break; 
                        case 3:
                            this.outletId3s = []; 
                            break;  
                        case 4:
                            this.outletId4s = []; 
                            break;
                    }  
            }
        },
        change(value){ //只有option选择改变才会触发
            if(value){
                this.changeState = true;
            }else{
                this.changeState = false;
            }
            
        }
	}
}
</script>
<style lang="less" scoped>
   .item-width{
    	width: 200px;
    }
</style>