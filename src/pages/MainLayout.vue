<template>
    <div class="content">
        <div class="top-box">
            <span class="logo" style="">
                <img src="https://mogu-admin-devp.oss-cn-hangzhou.aliyuncs.com/img/home.png" height="45" width="45" alt="一千贷logo"/>
                <span>车抵贷后台管理系统</span>
            </span>
            <span style="float:right;margin:20px 0;">
                <Avatar :src="uesrIcon"/>
                <Dropdown @on-click="handleSelect">
                    <Button type="primary" size="large">
                        {{nickName}}
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="修改密码">修改密码</DropdownItem>
                        <DropdownItem name="注销">注销</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </span>
        </div>
        <div class="left-box">
            <div class="left-sub-box">
                <Menu ref="leftMenu" :theme="theme2" width="185px" @on-select="toNextPath" accordion :open-names="openName" :active-name="activeName">
                    <template v-for="item in certifyList">
                        <template v-if="item.name=='Index'">
                            <MenuItem name="Index/主页">
                                <Icon type="md-home"/>
                                主页
                             </MenuItem>
                        </template>
                        <template v-if="item.name!='Index'">
                            <Submenu :name="item.name">
                                <template slot="title">
                                    <Icon :type="formatIconType(item.alias)"/>
                                    {{item.alias}}
                                </template>
                                <template v-for="value in item.children">
                                    <MenuItem :name="value.name+'/'+value.alias">{{value.alias}}</MenuItem>
                                </template>
                            </Submenu>
                        </template>
                    </template>
                </Menu>
            </div>
        </div>
        <div class="content-box">
            <div>
                <template v-for="(item,index) in navTabLists">
                    <Tag closable :color="myTabColorPath==item.pathName?'#2d8cf0':'#bbb'" @on-close="handleClose(index)" >
                        <router-link :to="{name:item.pathName}" style="color:#fff">{{item.nameTxt}}</router-link>
                    </Tag>
                </template>
            </div>
            <keep-alive>  
                <router-view></router-view>
            </keep-alive> 
        </div>
        <Modal v-model="ModalPassword" class="modal-password" title="修改密码" :mask-closable="false" @on-cancel="cancel('formInline')">
            <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80">
                <FormItem label="旧密码" prop="old">
                    <Input v-model="formInline.old" placeholder="请输入旧密码" type="password"></Input>
                </FormItem>
                <FormItem label="新密码" prop="new">
                    <Input v-model="formInline.new" placeholder="请输入新密码" type="password"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="confirm">
                    <Input v-model="formInline.confirm" placeholder="请再次输入新密码" type="password"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="handleSubmit('formInline')">确定</Button>
                <Button @click="cancel('formInline')">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import util from '@/util/util'
export default {
    name: 'MainLayout',
    data(){
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formInline.new) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        }
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请填写新密码'));
            } else if (value.length<6 || value.length>15) {
                callback(new Error('密码必须为6~15个字符'));
            } else {
                callback();
            }
        }
        return {
            nickName: '',
            myTabColorPath:'',
            theme1: 'primary',
            theme2: 'light',
            certifyList: [],
            modal_loading: false,
            ModalPassword: false, //修改密码弹窗
            navTabLists: [], //标签页导航列表
            ruleInline: {
                old: [{
                    required: true,
                    message: '请填写旧密码',
                    trigger: 'blur'
                }],
                new: [{
                    required: true,
                    validator: validatePass,
                    trigger: 'blur'
                }],
                confirm: [{
                    required: true,
                    validator: validatePassCheck,
                    trigger: 'blur'
                }]
            },
            formInline: {
                old: "",
                new: "",
                confirm: "",
            },
            activeName: '',
            openName: []
        }
    },
    created(){
        this.nickName = localStorage.getItem('nickName');
        this.uesrIcon = localStorage.getItem('uesrIcon');
        this.getInitialList();
        window.onresize = ()=>{ // 定义窗口大小变更通知事件
            this.$store.commit('change_height');
        };
    },
    watch: {
        '$route'(to, from) {
            if(from.name == "CustomDetail" || to.name == "CustomDetail" || to.name == "OrderDetail" || from.name == "OrderDetail" || from.name == "ProcessDetail" || to.name == "ProcessDetail" || from.name == "ContractManage" || to.name == "ContractManage" || from.name == "LoanDetail" || to.name == "LoanDetail"){ //返回的时候不设置tab
                return;
            }
            this.myTabColorPath = to.name;
            this.openName = [];
            let str = util.formatName(this.myTabColorPath); 
            this.openName.push(str);
            let name = this.navTabLists.find((item)=>{
                return item.pathName == this.myTabColorPath;
            });
            this.activeName = name.pathName+'/'+name.nameTxt;
            this.$nextTick(()=>{
                this.$refs.leftMenu.updateOpened();
                this.$refs.leftMenu.updateActiveName();
            })
        },
    },
    methods: {
        getInitialList(formData){ //获取菜单列表
            this.$axios.get('/fx?api=gate.auth.menuTree').then(res => {
                if(res!=500){
                    this.certifyList = res.children;
                }
            })
        },
        handleClose(index){ //删除对应的标签
            this.navTabLists.splice(index,1);
        },
        toNextPath(name){
            let arr = name.split('/');
            let pathName = arr[0];
            let nameTxt = arr[1];
            let flag = false;
            this.navTabLists.forEach((item)=>{
                if(item.pathName==pathName && item.nameTxt==nameTxt){
                    flag = true;
                }
            });
            if(!flag){
                this.navTabLists.push({pathName:pathName,nameTxt:nameTxt}); 
            }
            this.$router.push({name:pathName}); 
        },
        handleSelect(name){
            if(name=="注销"){
                this.$axios.get('/fx?api=gate.auth.logout').then(res => { 
                    if(res!=500) { 
                        localStorage.clear();
                        this.$router.replace({name:'Login'});
                        
                    }
                }) 
            }else if(name=="修改密码"){
                this.ModalPassword = true;
            }
        },
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if(valid){
                    let formData = {
                        passwdOld: this.formInline.old,
                        passwd1: this.formInline.new,
                        passwd2: this.formInline.confirm,
                    }
                    this.modal_loading = true;
                    this.$axios.post('/fx?api=gate.auth.passwdModify',formData).then(res => { 
                        this.modal_loading = false;
                        if(res!=500) { 
                            this.ModalPassword = false;
                            this.$Message.success('修改成功请重新登录');
                            setTimeout(()=>{
                                localStorage.clear();
                                this.$router.replace({name:'Login'});
                            },200);
                        }
                        this.$refs[name].resetFields();
                    }) 
                }
            })
        },
        cancel(name){
            this.ModalPassword = false;
            this.$refs[name].resetFields();
        },
        formatIconType(type){
            switch (type) {
                case '组织管理':
                    return 'md-people';
                    break;
                case '客户管理':
                    return 'ios-call';
                    break;
                case '产品管理':
                    return 'md-map';
                    break;     
                case '订单管理':
                    return 'md-calendar';
                    break;
                case '放款管理':
                    return 'ios-barcode';
                    break; 
                case '贷后管理':
                    return 'logo-dropbox';
                    break;
                case '财务管理':
                    return 'md-build';
                    break;  
                case '业务大盘':
                    return 'ios-color-palette';
                    break;
                case '权限设置':  
                    return 'md-cog';
                    break;          
            }
        }
    }
}
</script>

<style lang="less">
    .content{
        position: relative;
        height: 100%;
    }
    .logo{
        display: inline-block;
        height: 100%;
        line-height: 70px;
        float: left;
    }
    .logo span,.logo img{
        vertical-align: middle;
    }
    .top-box{
        position: absolute;
        height: 70px;
        width: 100%;
        top: 0;
        left: 0;
        padding: 0 60px;
        font-size: 18px;
        color: #fff;
        background-color: #2d8cf0;
        z-index: 2;
    }  
    .content .left-box{
        position: absolute;
        left: 0;
        top: 0;
        padding-top: 70px;
        width: 185px;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 1;
    }
    .content .left-sub-box{
        width: 185px;
        height: 100%;
        background-color: #fff;
        border-right: 1px solid #e4e5e7;
    }
    .content .content-box{
        width: 100%;
        height: 100%;
        padding: 90px 20px 20px 220px;
    }
    .content /deep/ .ivu-btn-primary:not('disabled'):hover{
        background-color:#57a3f3;
        border-color: #57a3f3;
    }
    .content .top-box /deep/ .ivu-btn-primary:hover{
        background-color:transparent;
        border-color: transparent;
    }
    .content .top-box /deep/ .ivu-btn-large{
        padding: 0;
    }
    .modal-password .ivu-modal{
        width: 400px !important;
    }
    </style>
</style>
