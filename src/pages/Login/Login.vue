<template>
    <div id="login">
        <div style="font-size:36px;color:#346FD0;font-weight:bold;line-height:100px;padding-left:60px;">车抵贷后台管理系统</div>
        <div class="login-content">
			<div class="login-bg"><img src="https://jinchan-ctt.oss-cn-hangzhou.aliyuncs.com/images/login_bg_img.png" alt=""></div>
			<div class="logo-box">
		        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
		            <div style="font-size:28px;text-align:center;line-height:60px;padding-bottom:40px;">登录</div>
		            <FormItem prop="mobile">
		                <Input v-model="formValidate.mobile" placeholder="请输入手机号" :maxlength="11" style="width:350px;height:35px">
		                    <Icon type="ios-person-outline" color="#aaa" slot="prepend"/>
		                </Input>
		            </FormItem>
		            <FormItem prop="passwd">
		                <Input type="password" v-model="formValidate.passwd" placeholder="请输入密码" style="width:350px;height:35px" @keyup.enter.native="login('formValidate')">
		                    <Icon type="ios-unlock-outline" color="#aaa" slot="prepend"/>
		                </Input>
		            </FormItem>
		            <FormItem>
				        <div class="log-btn" @click="login('formValidate')">
				            登录
				        </div>
		            </FormItem>
		        </Form>
	        </div>
	    </div>
    </div>
</template>
<script>
    import util from '@/util/util'
	export default {
	    name: 'Login',
	    props:[],
	    data () {
		    return {
		        formValidate: {
		            mobile: '',
		            passwd:'',
		        },
		        ruleValidate: {
		            mobile: [
		                { required: true, message: '用户名不能为空', trigger: 'blur' }
		            ],
		            passwd: [
		                { required: true, message: '密码不能为空', trigger: 'blur' },
		            ]
		        }
			}
	    },
	    watch: {
	    },
	    created(){
            localStorage.clear();
	    },
		methods: {
			login(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
						this.$axios.post('/fx?api=gate.auth.login', {
							mobile: this.formValidate.mobile,
							passwd: this.formValidate.passwd,
						}).then((res) => {
							if(res!=500){
                                localStorage.setItem('nickName', res.name);
                                localStorage.setItem('uesrIcon', res.icon);
							    this.$router.replace({name: 'Welcome'});
							}
						})
                    }
                })
            }
		},
    }
</script>
<style lang="less" scoped>
	#login{
		width: 100%;
		min-width: 1200px;
        height: 100%;
        background: url('https://jinchan-ctt.oss-cn-hangzhou.aliyuncs.com/images/login_bg.png') no-repeat center center/cover;
	}
	.login-content{
		position: absolute;
        width: 1200px;
        margin-left: -600px;
        left: 50%;
        margin-top: -288px;
        top: 50%;
	}
	.login-bg img{
		width: 700px;
	}
	.logo-box{
		position: absolute;
	    right: 0;
	    top: 0;
        width: 400px;
        background-color: #fff;
        border-radius:10px;
        box-shadow: 0 0 15px 2px #f1f1f1;
        /deep/ .ivu-input-group-prepend{
        	border-top: 0;
	        border-right: 0;
	        border-left: 0;
	        background-color: #fff;
	        border-radius: 0;
	        i{
	            font-size: 32px;
	        }
        }
        /deep/ form{
        	padding: 25px;
        }
        & /deep/ .ivu-input:hover{
            border-color: #dcdee2;
        } 
        & /deep/ .ivu-form-item-error .ivu-input:hover{
            border-color: #ed4014;
        }
        & /deep/ .ivu-input{
	        height: 45px;
	        border-top: 0;
	        border-right: 0;
	        border-left: 0;
	        border-radius: 0;
	        font-size: 16px;
	    }
	    & /deep/ .ivu-input:focus{
	    	border-color: #dcdee2;
            box-shadow:none;
	    }
	    & /deep/ .ivu-form-item-error .ivu-input:focus{
            border-color: #ed4014;
            box-shadow:none;
	    }
        .log-btn{
            display: block;
            text-align: center;
            color: #fff;
            background-color: #2d8cf0;
            width: 350px;
            height: 50px;
            line-height: 50px;
            font-size: 18px;
            border-radius:25px;
            margin: 60px 0 20px;
            cursor: pointer;
            box-shadow: 0px 4px 8px 0px rgba(87,83,245,0.4);
        }
    }
</style>

