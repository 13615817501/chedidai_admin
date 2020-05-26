<template>
    <div id="my-table" class="common-id">
        <Breadcrumb>
            <BreadcrumbItem>组织管理</BreadcrumbItem>
            <BreadcrumbItem>部门列表</BreadcrumbItem>
        </Breadcrumb>
        <div style="height:30px;"></div>
        <elTable
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            ref="table1"
            border
            :max-height="adjustHeight+100"
            :highlight-current-row="true"
            :header-row-style="{color:'#666'}"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
              prop="name"
              label="门店名"
              minWidth="180">
            </el-table-column>
            <el-table-column
              prop="number"
              label="门店编号"
              minWidth="100" align="center">
            </el-table-column>
            <el-table-column
              prop="province.name"
              label="省"
              minWidth="60" align="center">
            </el-table-column> 
            <el-table-column
              prop="city.name"
              label="市"
              minWidth="60" align="center">
            </el-table-column> 
            <el-table-column
              prop="area.name"
              label="区"
              minWidth="60" align="center">
            </el-table-column> 
            <el-table-column
              prop="address"
              label="详细地址"
              minWidth="60" align="center">
            </el-table-column> 
            <el-table-column align="center">
                <template slot="header" slot-scope="scope">操作</template>
                <template slot-scope="scope">
                    <Button size="small" type="primary"  @click="addBtnFun(scope.row)">新增</Button>
                    <Button size="small" type="primary" @click="modifyBtnFun(scope.row)">修改</Button>
                    <Button size="small" type="error" @click="deleteBtnFun(scope.row)">删除</Button>
                </template>
            </el-table-column>
        </elTable>
        <Modal v-model="modifyModal" :title="myTitle" :mask-closable="false" width="370">
            <Form ref="salesForm" :model="salesForm" :label-width="120">
                <FormItem label="名称：" prop="name" class="ivu-form-item-required">
                    <Input v-model.trim="salesForm.name" class="item-width" placeholder="请输入名称"></Input>
                </FormItem>
                <FormItem label="组织编号：" prop="number" class="ivu-form-item-required">
                    <Input v-model.trim="salesForm.number" class="item-width" placeholder="请输入门店编号"></Input>
                </FormItem> 
                <FormItem label="组织类型：" prop="idNum" class="ivu-form-item-required">
                    <Select v-model="salesForm.type" class="item-width" :disabled="myTitle=='修改'">
                        <Option :value="0">默认</Option>
                        <Option :value="10">小黄豆</Option>
                        <Option :value="11">小黄豆区</Option>
                        <Option :value="12">小黄豆组</Option>
                        <Option :value="13">小黄豆门店</Option>
                        <Option :value="20">代理</Option>
                        <Option :value="21">代理区</Option>
                        <Option :value="22">代理组</Option>
                        <Option :value="23">代理门店</Option>
                        <Option :value="30">渠道</Option>
                        <Option :value="31">渠道区</Option>
                        <Option :value="32">渠道组</Option>
                        <Option :value="33">渠道门店</Option>
                    </Select>
                </FormItem>
                <div v-show="salesForm.type==13 || salesForm.type==23 || salesForm.type==33">
                    <ChinaArea txt="修改" @change="chinaAreaChange" :status="myTitle=='新增' && !modifyModal" :modifyStatus="myTitle=='修改' && modifyModal" 
                    :parProvince="salesForm.province" :parCity="salesForm.city" :parArea="salesForm.area"></ChinaArea>  
                    <FormItem label="详细地址：" prop="address" class="item-width">
                        <Input v-model.trim="salesForm.address"  class="item-width" type="textarea" :rows="4" placeholder="请输入详细地址"></Input>
                    </FormItem>
                </div>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="handleSubmit('salesForm')">确定</Button>
                <Button @click="cancel()">取消</Button>
            </div>
            <CommonTipModal  :modal="modalTip" @cancel="cancel" :modalTipTitle="modalTipTitle" :item="item" @comfirmBtn="tipComfirmBtn" >
                <div style="text-align:center">
                    <p>确定删除该部门组织吗?</p>
                </div>
            </CommonTipModal>
        </Modal>
    </div>    
</template>
<script>
import util from '@/util/util'
import CommonTipModal from '@/components/CommonTipModal' //公用的提示组件 
import ChinaArea from '@/components/ChinaArea' //公用的提示组件 
import ImgUpload from '@/components/ImgUpload' //公用的提示组件 
import moment from 'moment'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            item: {},
            tableData: [],
            pid:'', //父节点ID值
            modalTip:false,
            modalTipTitle:'删除该部门组织',
            modifyModal:false,
            modal_loading:false,
            id:'',
            myTitle:'新增',
            salesForm: {
                name: '',
                number: '',
                type: 0,
                province: null,
                city: null,
                area: null,
                address: '',
            },
        }
    },
    computed:{
        ...mapState(['adjustHeight']) 
    },
    activated(){
        this.getInitialList();
    },
    components:{
        CommonTipModal,
        ChinaArea
    }, 
    methods: {
        getInitialList(){ 
            this.$axios.get('/fx?api=gate.auth.sysUnitList').then(res => {
                if(res!=500){
                    this.tableData = res;
                    this.$store.commit('change_height');
                }
            })
        },
        addBtnFun(row){
            this.myTitle = '新增';
            this.pid = row.id;
            this.item = row;
            this.salesForm = {
                name: '',
                number: '',
                type: 0,
                province: null,
                city: null,
                area: null,
                address: '',
            },
            this.modifyModal = true;
        },
        handleSubmit(){
            let formData = {};
            if(this.salesForm.type!=13 && this.salesForm.type!=23 && this.salesForm.type!=33){ //非门店
                if(!this.salesForm.name || !this.salesForm.number){
                    return this.$Message.error("带 * 为必填项"); 
                }
                formData = {
                    name:this.salesForm.name,
                    number:this.salesForm.number,
                    type:this.salesForm.type,
                };
                
            }else{
                if(!this.salesForm.name || !this.salesForm.number  || !this.salesForm.province || !this.salesForm.city || !this.salesForm.area ){
                    return this.$Message.error("带 * 为必填项"); 
                }
                formData = {...this.salesForm};
            }
            let  myUrl = '/fx?api=gate.auth.sysAddUnit';
            if(this.myTitle == '新增'){
                formData.pid = this.pid;
            }else if(this.myTitle == '修改'){
                 myUrl = '/fx?api=gate.auth.sysModifyUnit';
                 formData.id = this.id;
            }
            this.$axios.post(myUrl,formData).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.modifyModal = false;
                    if(this.myTitle == '新增'){
                        this.item.children.push(res);
                        this.$refs.table1.toggleRowExpansion(this.item,true);    
                    }else if(this.myTitle == '修改'){
                        Object.assign(this.item,{name:res.name,number:res.number,address:res.address,area:res.area,province:res.province,city:res.city})
                    }
                    this.$forceUpdate();
                }

            })
        },
        cancel(){
            this.modalTip = false;
            this.modifyModal = false;
        },
        chinaAreaChange(data){
            this.salesForm.province = data.province;
            this.salesForm.city = data.city;
            this.salesForm.area = data.area;
        },
        tipComfirmBtn(num) {
            this.modalTip = false;
            if (num != 500) {
                this.$Message.success('删除成功');
                this.getInitialList();
            }
        },
        modifyBtnFun(row){
            this.item = row;
            this.id = row.id;
            this.modifyModal = true;
            this.myTitle = '修改';
            this.salesForm = {
                name: row.name,
                number: row.number,
                type: row.type,
                province: row.province?row.province.code:'',
                city: row.city?row.city.code:'',
                area: row.area?row.area.code:'',
                address: row.address,
            };
        }, 
        deleteBtnFun(item){
            this.item = item;
            this.modalTip = true;
        },
        handleSelectionChange(){

        }
    },
  }
</script>
<style lang="less" scoped>
    #my-table /deep/ .el-table__expand-icon.el-table__expand-icon--expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    #my-table /deep/ .el-table__expand-icon .el-icon-arrow-right:before {
        content: "\E723";
        font-size: 14px;
        color: #333;
    } 
    #my-table /deep/ .el-table__expand-icon.el-table__expand-icon--expanded .el-icon-arrow-right:before {
        content: "\E722";
        font-size: 14px;
        color: #333;
    }
    #customList /deep/ .ivu-table-row.ivu-table-row-hover{
        cursor: pointer;
    }
    .item-comm{
        position: relative;
        display: inline-block;
        width: 90px; 
    }
    .item-comm.required:before{
        position: absolute;
        content:'*';
        color:red;
        left:-10px;
        top:3px;
    }
    .item-input,.common-width{
        width: 200px;
    }
    .modify-modal{
        padding: 0 10px;
    }
    .item-div{
        margin: 10px 0;
    }
    .item-width{
        width: 200px;
    }
    .listadmin.zk-table /deep/ .zk-table__header-wrapper{
        position: absolute;
        z-index: 100;
    }
    .listadmin.zk-table /deep/ .zk-table__body-wrapper{
        padding-top: 41px;
    }
</style>
