<template>
    <div id="imgUpload">
        <span v-if="txt!='多选' && type!=11">
            <span class="item-comm required"><slot></slot></span>
	        <div class="demo-upload-list" v-show="picUrl" @click="toChange" title="单击更改">
	            <template>
	                <img :src="picUrl" v-if="myUploadTxt =='图片'">
	                <video :src="picUrl" v-if="myUploadTxt =='视频'" width="58" height="58">您的浏览器不支持 video 标签</video>
	                <div class="demo-upload-list-cover">
	                    <Icon type="ios-camera-outline" v-if="myUploadTxt=='图片'"/>
	                    <Icon type="logo-youtube" v-if="myUploadTxt=='视频'"/>
	                </div>
	            </template> 
	        </div>
	        <span v-show="!picUrl" class="my-default" title="单击上传" @click="toChange"><Icon type="ios-camera-outline" size="24"/></span>
	        <input style="display:none" type="file" id="file" ref="file" @change="changeFile"/>
	    </span>
	    <span v-if="type==11">
	        <span class="my-default" title="单击上传" @click="toChange"><Icon type="ios-cloud-upload-outline" size="24"/></span>
	        <input style="display:none" type="file" id="file" ref="file" @change="changeFile"/>
	        <div style="margin-top:2px;" v-for="(item,index) in uploadList2" :key="index">{{item}}<Icon type="ios-trash" style="margin-left:10px;cursor:pointer;" title="删除" @click="deleteBtn(index)"/></div>
	    </span>
	    <div v-if="txt=='多选' && type!=11">
	    	<div class="demo-upload-list" v-for="(item,index) in uploadList" :key="Math.random()">
                <template>
                    <img :src="formatItem(item)">
                    <div class="demo-upload-list-cover">
                        <Icon v-if="formatShow(item)" type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                        <Icon v-if="!formatShow(item)" type="md-download" @click.native="handleDown(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                </template>
            </div>
            <span class="span-progress" v-if="showProgress"><i-progress class="my-progress" :percent="percentage" hide-info></i-progress></span>
	        <span class="my-default" title="点击上传" @click="toChange"><Icon type="md-add" size="24"/></span>
	        <input style="display:none" type="file" id="file" multiple ref="file" @change="changeFile"/>
            <Modal title="图片预览" v-model="visible" draggable>
                <img :src="imgName" v-if="visible" style="width: 100%">
            </Modal>
	    </div>
	</div>
</template>
<script>
export default {
	name: 'ImgUpload',
	props:{
        myPicUrl:String,
        myUploadList:{ //绝对地址
        	type:Array,
        	default: ()=> {
		        return []
		    }
        },
        myUploadList2:{ //相对地址
        	type:Array,
        	default: ()=> {
		        return []
		    }
        },
        txt:{   //决定用哪种模式
        	type:String,
        	default:'单选'
        },
        type:Number,
        uploadTxt:{  //用于判断是只是图片上传还是图片或视频上传
        	type:String,
        	default: '图片'
        },
        uploadTxt2:{ //用于判断点击修改时候当前的是图片还是视频
        	type:String,
        	default: '图片'
        },
	},
	data () {
		return {
			oss: {}, //oss相关信息集合
            picUrl: this.myPicUrl,       
            myUploadTxt: this.uploadTxt2, //变成组件本地数据
            visible:false, //图片预览
            uploadList:this.myUploadList,
            uploadList2:this.myUploadList2,
            showProgress:false,
            percentage:0,
            imgName:'' //预览图片的地址
		}
	},
	watch: {
		uploadTxt2(newVal,oldVal){
            this.myUploadTxt = this.uploadTxt2;
		},
		myPicUrl(newVal,oldVal){
	        this.picUrl = this.myPicUrl;
	        let file = this.$refs.file;
	        file.value='';
		},
		myUploadList(newVal,oldVal){
           this.uploadList = this.myUploadList;
           this.uploadList2 = this.myUploadList2;
		},
        uploadList(newVal,oldVal){
            this.$emit('changePicUrl', this.uploadList2);
        }
	},
	created(){
        this.getOSSInfo();
	},
	methods: {
		getOSSInfo(){ //获得OSS相关信息
            this.$axios.get('/fx?api=gate.base.ossUpload',{params:{type:this.type}}).then(res => {
		    	if(res!=500){
		    	    this.oss = res;    	
		    	}
			})
		},
        toChange(){
        	this.$refs.file.value = null;
        	let file = this.$refs.file;
            file.click();
		},
		random_string(len) {　　
			len = len || 32;　　
			var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';　　
			var maxPos = chars.length;　　
			var pwd = '';　　
			for (let i = 0; i < len; i++) {　　
				pwd += chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return pwd;
		},
		changeFile(e){
			let { endpoint } = this.oss;
			let index1 = endpoint.indexOf('oss');
			let index2 = endpoint.indexOf('aliyuncs');
            let myEndpoint = endpoint.slice(index1,index2-1);
			let client = new OSS.Wrapper({
				region: myEndpoint,
				accessKeyId: this.oss.aki,
				accessKeySecret: this.oss.aks,
				stsToken: this.oss.sk,
				bucket: this.oss.bucketName,
				secure:true
			});
			let file = Array.from(this.$refs.file.files);
            // let file = this.$refs.file.files[0];
            if(file){
            	let bol = false;
            	if(this.type==11){
                    let reg = /\.jpg$|\.jpeg$|\.gif$|\.png$|\.bmp$|\.doc$|\.docx$|\.xls$|\.xlsx$/i;
	            	bol = file.some( (ele, index) => {
	            		if(!reg.test(ele.name)){
		            		let fileInput = this.$refs.file;
			                fileInput.value='';
		                    this.$Message.error('格式只支持doc，docx，xls，xlsx，gif，jpeg，png，jpg，bmp');
		                    return true;
	            	    }
	            	});
	            	
            	}else{
            		let reg = /\.jpg$|\.jpeg$|\.gif$|\.png$|\.bmp$|\.doc$|\.docx$|\.xls$|\.xlsx$|\.wav$|\.mp3$|\.cda$|\.m4a/i;
	            	if(this.uploadTxt=='图片或视频'){
	            		reg = /\.jpg$|\.jpeg$|\.gif$|\.png$|\.bmp$|\.doc$|\.docx$|\.xls$|\.xlsx|\.mp4$/i;
	            	}
	            	bol = file.some( (ele, index) => {
	            		if(!reg.test(ele.name)){
		            		let fileInput = this.$refs.file;
			                fileInput.value='';
			                let errorTxt = '格式只支持doc，docx，xls，xlsx，gif，jpeg，png，jpg，bmp，wav，mp3，cda，m4a';
			                if(this.uploadTxt=='图片或视频'){
			                	errorTxt = '格式只支持doc，docx，xls，xlsx，gif，jpeg，png，jpg，bmp,视频格式只支持mp4';
			                }
		                    this.$Message.error(errorTxt);
		                    return true;
	            	    }
	            	})
            	}
            	if(bol) return;
				file.forEach( (item, index) => {
					let random_name = this.random_string(6) + '_' + new Date().getTime() + '.' + item.name.split('.').pop();   // 随机命名
					if(this.txt=='多选'){
						this.showProgress = true;
						while(this.percentage<100){
	                        this.percentage += 20;
						}
					}
				    client.multipartUpload(`${this.oss.dirPath}${random_name}`, item).then(result => {
						this.showProgress = false;
						this.percentage = 0;
						let requestUrls = result.res.requestUrls[0];
						let index1 = requestUrls.indexOf('uploadId');
						let myUrl = result.url?result.url:requestUrls.slice(0,index1-1);
						let myIndex = myUrl.indexOf('/img');
						let ranUrl = myUrl.slice(myIndex+1);
						if(myUrl.indexOf('mp4')!=-1){
	                        this.myUploadTxt = '视频';
						}else{
							this.myUploadTxt = '图片';
						}
						myUrl = client.signatureUrl(ranUrl);    //转化成带加密签名的图片(参数必须为相对地址)
						if(this.txt=='多选' || this.type==11){
							if(this.txt!='多选' && this.type==11 && this.uploadList.length>=1){
								return this.$Message.error('附件只能上传一个');
							}
	                        this.uploadList.push(myUrl);   //绝对地址
	                        this.uploadList2.push(ranUrl); //相对地址
						}else{
							this.picUrl = myUrl;
						    this.$emit('changePicUrl', ranUrl,myUrl);
						}
					}).catch(err => {
						this.$Message.warning('文件上传出错');
					});	
				});
				
            }
		},
		handleView(name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove(file) {
            this.uploadList.splice(this.uploadList.indexOf(file), 1);
            let myIndex = file.indexOf('/img');
			let ranUrl = file.slice(myIndex+1);
            this.uploadList2.splice(this.uploadList2.indexOf(ranUrl), 1);
        },
        deleteBtn(index){
            this.uploadList.splice(index,1); //绝对地址
            this.uploadList2.splice(index,1); //相对地址
        },
        formatItem(item){
            if(item.includes('.docx') || item.includes('.doc') || item.includes('.xls') || item.includes('.xlsx')){
            	return 'https://carloan-gw.oss-cn-beijing.aliyuncs.com/imgs/docx.png';
            }else if(item.includes('.wav') || item.includes('.cda') || item.includes('.mp3')|| item.includes('.m4a')){
                return 'https://carloan-bm.oss-cn-hangzhou.aliyuncs.com/imgs/radio_icon.png';
            }
            return item;
        },
        formatShow(item){
        	if(item.includes('.docx') || item.includes('.doc') || item.includes('.xls') || item.includes('.xlsx')){
            	return false;
            }else if(item.includes('.wav') || item.includes('.cda') || item.includes('.mp3')|| item.includes('.m4a')){
                return false;
            }
            return true;
        },
        handleDown(item){
        	window.open(item);
        }
	}
}
</script>
<style lang="less" scoped>
    .item-comm{
    	position: relative;
        display: inline-block;
        width: 85px; 
    }
    .item-comm.required:before{
    	position: absolute;
        content:'*';
        color:red;
        left:-10px;
        top:3px;
    }
    .my-default{
        display: inline-block;
	    width: 58px;
	    height: 58px;
	    line-height: 58px;
	    text-align: center;
	    vertical-align: middle;
	    border: 1px dashed #ccc;
	    cursor: pointer;
	    &:hover{
           border-color: #2d8cf0;
	    }
    }
    .watchBox .item-comm.required:before{
        content:'';
    }
    .watchBox .item-comm{
        width: auto;
    }
    .span-progress{
    	display:inline-block;
    	width:50px;
    	height:50px;
    }
</style>