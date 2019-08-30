<template>
    <div id="chinaArea">
        <div v-if="txt=='搜索'">
        	<span>
                &nbsp;&nbsp;省: 
                <Select v-model="search.province" style="width:120px" clearable>
                    <Option v-for="item in provinces" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
            </span>
            <span>
                &nbsp;&nbsp;市: 
                <Select v-model="search.city" style="width:120px" clearable>
                    <Option v-for="item in citys" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
            </span>
            <span>
                &nbsp;&nbsp;区: 
                <Select v-model="search.area" style="width:120px" clearable>
                    <Option v-for="item in areas" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
            </span>
        </div>
        <div v-if="txt!='搜索'">
	        <FormItem label="省：" prop="province" class="ivu-form-item-required">
		        <Select v-model="modify.province" class="item-width" :key="Math.random()">
				    <Option v-for="item in provinces2" :value="item.code" :key="item.code">{{item.name}}</Option>
				</Select>
		    </FormItem>
		    <FormItem label="市：" prop="city" class="ivu-form-item-required item-width">
		        <Select v-model="modify.city" class="item-width" :key="Math.random()">
				    <Option v-for="item in citys2" :value="item.code" :key="item.code">{{item.name}}</Option>
			    </Select>
		    </FormItem>
		    <FormItem label="区：" prop="area" class="ivu-form-item-required item-width">
		        <Select v-model="modify.area" class="item-width" :key="Math.random()">
				    <Option v-for="item in areas2" :value="item.code" :key="item.code">{{item.name}}</Option>
			    </Select>
		    </FormItem>
	    </div>
    </div>
</template>
<script>
export default {
	name: 'ChinaArea',
	props:{
		txt:{
			type:String,
			default:'搜索'
		},
		status:Boolean,
		modifyStatus:Boolean,
		parProvince:[Number,String],
		parCity:[Number,String],
		parArea:[Number,String]
	},
	data () {
		return {
			search:{
                province:null,
			    city:null,
			    area:null
			},
			modify:{
                province:null,
			    city:null,
			    area:null
			},
			provinces:[],
			provinces2:[],
			citys:[],
			citys2:[],
			areas:[],
			areas2:[],
			myOnce1:false,  //省第一次修改
            myOnce2:false,  //市第一次修改
		}
	},
	watch: {
		'modifyStatus'(newVal,oldVal){   //是修改的弹窗
            this.myOnce1 = true;  //点击修改时第一次myOnce1,myOnce2都需要为true,跳过对应的监听
            this.myOnce2 = true; 
        	this.modify.province = this.parProvince;
        	this.modify.city = this.parCity;
        	this.modify.area = this.parArea;
		},
		'status'(newVal,oldVal){  //是新增的弹窗
            if(newVal){
            	this.modify.province = null;
            	this.modify.city = null;
            	this.modify.citys2 = [];
                this.modify.area = null;
                this.modify.areas2 = [];
            }
		},
		'search.province'(newVal,oldVal){
            this.getAdministrative({type:2,code:newVal});
            this.search.city = null;
            this.search.area = null;
        },
        'search.city'(newVal,oldVal){
            this.getAdministrative({type:3,code:newVal});
            this.search.area = null;
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
		if(this.txt=='搜索'){
            this.getAdministrative({type:1});
		}else{
            this.getAdministrative({type:1},true);
		}
	},
	methods: {
        getAdministrative(formData,bool){ //获得省市区
            this.$axios.get('/fx?api=gate.base.administrative',{params:formData}).then(res => {
                if(res!=500){
                    switch (formData.type) {
                        case 1:
                            if(bool){
                                this.provinces2 = res.list;
                            }else{
                                this.provinces = res.list; 
                            }
                            break; 
                        case 2:
                            if(bool){
                                this.citys2 = res.list;
                            }else{
                                this.citys = res.list; 
                            }
                            break; 
                        case 3:
                            if(bool){
                                this.areas2 = res.list;
                            }else{
                                this.areas = res.list; 
                            }
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