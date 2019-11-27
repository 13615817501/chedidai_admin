<template>
    <div id="chinaArea">
    	<span>
            &nbsp;&nbsp;省: 
            <Select v-model="modify.province" style="width:120px" :key="Math.random()">
                <Option v-for="item in provinces" :value="item.code" :key="item.code">{{ item.name }}</Option>
            </Select>
        </span>
        <span>
            &nbsp;&nbsp;市: 
            <Select v-model="modify.city" style="width:120px" :key="Math.random()">
                <Option v-for="item in citys" :value="item.code" :key="item.code">{{ item.name }}</Option>
            </Select>
        </span>
        <span>
            &nbsp;&nbsp;区: 
            <Select v-model="modify.area" style="width:120px" :key="Math.random()">
                <Option v-for="item in areas" :value="item.code" :key="item.code">{{ item.name }}</Option>
            </Select>
        </span>
    </div>
</template>
<script>
export default {
	name: 'ChinaArea',
	props:{
		parProvince:[Number,String],
		parCity:[Number,String],
		parArea:[Number,String]
	},
	data () {
		return {
			modify:{
                province:null,
			    city:null,
			    area:null
			},
            provinces:[],
            citys:[],
            areas:[],
            myOnce1:true,  //省第一次修改
            myOnce2:true,  //市第一次修改
		}
	},
	watch: {
        'parProvince'(newVal,oldVal){
            this.modify.province = this.parProvince;
        },
        'parCity'(newVal,oldVal){
            this.modify.city = this.parCity;
        },
        'parArea'(newVal,oldVal){
            this.modify.area = this.parArea;
        },
        'modify.province'(newVal,oldVal){
            this.getAdministrative({type:2,code:newVal},true);
            if(!this.myOnce1){
                this.modify.city = null;
                this.modify.area = null;
            }
            this.$emit('change',this.modify);
            this.myOnce1 = false;
        },
        'modify.city'(newVal,oldVal){
            this.getAdministrative({type:3,code:newVal},true);
            if(!this.myOnce2){
                this.modify.area = null;
            }
            this.$emit('change',this.modify);
            this.myOnce2 = false;
        },
        'modify.area'(newVal,oldVal){
            this.$emit('change',this.modify);
        },
	},
	activated(){
        this.getAdministrative({type:1});
        this.modify.province = this.parProvince;
        this.modify.city = this.parCity;
        this.modify.area = this.parArea;
    },
    mounted(){
        this.getAdministrative({type:1});
        this.modify.province = this.parProvince;
        this.modify.city = this.parCity;
        this.modify.area = this.parArea;
	},
	methods: {
        getAdministrative(formData){ //获得省市区
            this.$axios.get('/fx?api=gate.base.administrative',{params:formData}).then(res => {
                if(res!=500){
                    switch (formData.type) {
                        case 1:
                            this.provinces = res.list; 
                            break; 
                        case 2:
                            this.citys = res.list; 
                            break; 
                        case 3:
                            this.areas = res.list; 
                            break;
                    }  
                }
            })
        }
	}
}
</script>
<style lang="less" scoped>
   .item-width{
    	width: 200px;
    }
</style>