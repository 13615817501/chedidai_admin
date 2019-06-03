<template>
    <div id="customList" class="common-id">
        <Breadcrumb>
	        <BreadcrumbItem>客户管理</BreadcrumbItem>
	        <BreadcrumbItem>车辆列表</BreadcrumbItem>
	    </Breadcrumb>
	    <div class="listadmin">
            <Table border :columns="columns" :data="certifyList" :height="adjustHeight"></Table>
        </div>
        <div style="text-align:center;margin-top:20px;">
            <Page :current = "search.pageNum" :total="totalCount" :page-size="search.pageSize" @on-change="pageChange" show-total></Page>
        </div>
        <ModalPic :modal="modalPreview" :bigimg="bigimg" @cancel="cancel"></ModalPic>
        <Modal width="950" v-model="modifyModal" :title="myTitle" :mask-closable="false"> 
            <div class="modify-modal">
                <span class="modal-left">
                	<div>
	                	<img v-for="(img,index) in imgs" :src="img" @click="clickImgGetTxt(index,img)" :class="{active:activeState==index}">
                	</div>
                	<div>
                	    <div id="img-box" class="img-box"></div>
	                    <Spin size="large" fix v-if="spinShow"></Spin>	
                	</div>
                </span>
                <span class="modal-right">
                    <div class="item-div item-title">行驶证信息</div>
	                <div class="item-div">
	                    <span class="item-comm required">车牌号：</span><Input class="item-input" v-model="modify.plateNumber" placeholder="请输入..." />
	                    <span class="item-comm required">车辆类型：</span><Input class="item-input" v-model="modify.carType" placeholder="请输入..." />
	                </div>
	                <div class="item-div">
	                    <span class="item-comm required">所有人：</span><Input class="item-input" v-model="modify.travelerOwner" placeholder="请输入..." />
	                    <span class="item-comm required">住址：</span><Input class="item-input" type="textarea" v-model="modify.address" placeholder="请输入..." />
	                </div>
	                <div class="add-comm">
	                    <span class="item-comm required">使用性质：</span><Input class="item-input" v-model="modify.nature" placeholder="请输入..." />
	                    <span class="item-comm required">品牌型号：</span><Input class="item-input" v-model="modify.travelerModel" placeholder="请输入..." />
	                </div>
	                <div class="item-div">
	                    <span class="item-comm required">车辆识别代码：</span><Input class="item-input" v-model="modify.vin" placeholder="请输入..." />
	                    <span class="item-comm required">发动机号码：</span><Input class="item-input" v-model="modify.enginner" placeholder="请输入..." />
	                </div>
	                <div class="item-div">
	                    <span class="item-comm required">注册日期：</span><Input class="item-input" v-model="modify.travelerRegisterDate" placeholder="请输入..." />
	                    <span class="item-comm required">发证日期：</span><Input class="item-input" v-model="modify.giveDate" placeholder="请输入..." />
	                </div>
	                <div class="item-div">
	                    <span class="item-comm required">档案编号：</span><Input class="item-input" v-model="modify.archivesNumber" placeholder="请输入..." />
	                    <span class="item-comm required">核载人数(人)：</span><Input class="item-input" v-model="modify.passenger" placeholder="请输入..." />
	                </div>
	                <div class="item-div">
	                    <span class="item-comm required">总质量(kg)：</span><Input class="item-input" v-model="modify.weightTotal" placeholder="请输入..." />
	                    <span class="item-comm required">整备质量(kg)：</span><Input class="item-input" v-model="modify.weightWhole" placeholder="请输入..." />
	                </div>  
	                <div class="item-div">
	                    <span class="item-comm required">外部尺寸(mm)：</span><Input class="item-input" v-model="modify.size" placeholder="请输入..." />
	                    <span class="item-comm required">备注：</span><Input class="item-input" v-model="modify.remark" placeholder="请输入..." />
	                </div>
	                <div class="item-div">
	                    <span class="item-comm required">检验记录：</span><Input class="item-input" v-model="modify.record" placeholder="请输入..." />
	                </div>
	                <div class="item-div item-title">绿本</div>
	                <div class="item-div">
	                     <span class="item-comm required">车辆类型：</span><Input class="item-input" v-model="modify.type" placeholder="请输入..." />
	                    <span class="item-comm required">车辆品牌：</span><Input class="item-input" v-model="modify.brand" placeholder="请输入..." />
	                </div>
	                <div class="item-div">
	                    <span class="item-comm required">车辆型号：</span><Input class="item-input" v-model="modify.model" placeholder="请输入..." />
	                    <span class="item-comm required">车身颜色：</span><Input class="item-input" v-model="modify.color" placeholder="请输入..." />
	                </div>
	                <div class="item-div">
	                    <span class="item-comm required">车架号：</span><Input class="item-input" v-model="modify.frame" placeholder="请输入..." />
	                    <span class="item-comm required">国产或进口：</span><Input class="item-input" v-model="modify.source" placeholder="请输入..." />
	                </div>
	                <div class="item-div">
	                    <span class="item-comm required">发动机号：</span><Input class="item-input" v-model="modify.enginerNumber" placeholder="请输入..." />
	                    <span class="item-comm required">发动机型号：</span><Input class="item-input" v-model="modify.enginerModel" placeholder="请输入..." />
	                </div> 
	                <div class="item-div">
	                    <span class="item-comm required">燃油种类：</span><Input class="item-input" v-model="modify.oilType" placeholder="请输入..." />
	                    <span class="item-comm required">排量/功率(kw)：</span><Input class="item-input" v-model="modify.work" placeholder="请输入..." />
	                </div> 
	                <div class="item-div">
	                    <span class="item-comm required">制造工厂：</span><Input class="item-input" v-model="modify.madeFactory" placeholder="请输入..." />
	                    <span class="item-comm required">转向形式：</span><Input class="item-input" v-model="modify.turnType" placeholder="请输入..." />
	                </div> 
	                <div class="item-div">
	                    <span class="item-comm required">轮距(mm)：</span><Input class="item-input" v-model="modify.wheelDistance" placeholder="请输入..." />
	                    <span class="item-comm required">轮胎数(个)：</span><Input class="item-input" v-model="modify.wheelCount" placeholder="请输入..." />
	                </div>
	                <div class="item-div">
	                    <span class="item-comm required">轮胎规格：</span><Input class="item-input" v-model="modify.wheelNormal" placeholder="请输入..." />
	                    <span class="item-comm required">钢板弹簧数(片)：</span><Input class="item-input" v-model="modify.steelCount" placeholder="请输入..." />
	                </div> 
	                  <div class="item-div">
	                    <span class="item-comm required">轴距(mm)：</span><Input class="item-input" v-model="modify.wheelbase" placeholder="请输入..." />
	                    <span class="item-comm required">轴数：</span><Input class="item-input" v-model="modify.axesCount" placeholder="请输入..." />
	                </div>  
	                <div class="item-div">
	                    <span class="item-comm required">外廊尺寸(mm)：</span><Input class="item-input" v-model="modify.verandaSize" placeholder="请输入..." />
	                    <span class="item-comm required">货厢内部尺寸(mm)：</span><Input class="item-input" v-model="modify.innerSize" placeholder="请输入..." />
	                </div>  
	                <div class="item-div">
	                    <span class="item-comm required">总质量(kg)：</span><Input class="item-input" v-model="modify.totalWeight" placeholder="请输入..." />
	                    <span class="item-comm required">核定载重量(kg)：</span><Input class="item-input" v-model="modify.approvedLoad" placeholder="请输入..." />
	                </div>  
	                <div class="item-div">
	                    <span class="item-comm required">核定载客(人)：</span><Input class="item-input" v-model="modify.customer" placeholder="请输入..." />
	                    <span class="item-comm required">准牵引总质量(kg)：</span><Input class="item-input" v-model="modify.tractionWeight" placeholder="请输入..." />
	                </div>  
	                <div class="item-div">
	                    <span class="item-comm required">驾驶室载客(人)：</span><Input class="item-input" v-model="modify.driverCustomer" placeholder="请输入..." />
	                    <span class="item-comm required">使用性质：</span><Input class="item-input" v-model="modify.useNature" placeholder="请输入..." />
	                </div>  
	                <div class="item-div">
	                    <span class="item-comm required">车辆获得方式：</span><Input class="item-input" v-model="modify.getWay" placeholder="请输入..." />
	                    <span class="item-comm required">车辆出厂日期：</span><Input class="item-input" v-model="modify.outDate" placeholder="请输入..." />
	                </div>  
	                <div class="item-div">
	                    <span class="item-comm required">签发机关：</span><Input class="item-input" v-model="modify.issueGov" placeholder="请输入..." />
	                    <span class="item-comm required">发证日期：</span><Input class="item-input" v-model="modify.issueDate" placeholder="请输入..." />
	                </div>
	                <div class="item-div item-title"><span style="vertical-align:middle;">绿本变迁记录 </span><Icon type="md-add-circle" @click="addItem" size="18" style="cursor:pointer;" title="新增"/></div>
	                <span v-for="(item,index) in carRegisterRecords" :key="index">
		                <div class="item-div" style="position:relative">
		                    <span class="item-comm required">拥有者：</span><Input class="item-input" v-model="item.owner" placeholder="请输入..." />
		                    <span class="item-comm required">登记机关：</span><Input class="item-input" v-model="item.registerGov" placeholder="请输入..." />
		                    <Icon type="ios-close-circle" @click="deleteItem(index)" size="16" style="position:absolute;right:5px;top:0;cursor:pointer;" title="删除"/>
		                </div>    
		                <div class="item-div">
		                    <span class="item-comm required">登记日期：</span><Input class="item-input" v-model="item.registerDate" placeholder="请输入..." />   
		                    <span class="item-comm required">登记编号：</span><Input class="item-input" v-model="item.registerNumber" placeholder="请输入..." />
		                </div>  
	                </span>   
	            </span> 
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <Modal width="460" class-name="tesu" v-model="modifyModal2" :title="myTitle2" :mask-closable="false"> 
            <div class="item-div">
                <span class="item-comm required">车牌号：</span><Input class="item-input" v-model="modify2.plateNumber" placeholder="请输入..." />
                <span class="item-comm required">登记证编号：</span><Input class="item-input" v-model="modify2.registerNumber" placeholder="请输入..." />
            </div>
            <div class="item-div">
                <span class="item-comm required">车主姓名：</span><Input class="item-input" v-model="modify2.name" placeholder="请输入..." />
                <span class="item-comm required">身份证号码：</span><Input class="item-input" v-model="modify2.identityCard" placeholder="请输入..." />
            </div>
            <div class="item-div">
                <span class="item-comm required">发动机号：</span><Input class="item-input" v-model="modify2.enginner" placeholder="请输入..." />
                <span class="item-comm required">车架号：</span><Input class="item-input" v-model="modify2.frame" placeholder="请输入..." />
            </div> 
            <div class="item-div">
                <span class="item-comm required">车辆型号：</span><Input class="item-input" v-model="modify2.model" placeholder="请输入..." />
                <span class="item-comm required">登记日期：</span><DatePicker v-model="modify2.registerDate" type="date" placeholder="年检相关" class="item-input"></DatePicker>
            </div> 
            <div class="item-div">
                <span class="item-comm required">行驶里程(万)：</span><Input class="item-input" v-model="modify2.mile" placeholder="公里数" />
                <span class="item-comm required">车身颜色：</span><Input class="item-input" v-model="modify2.color" placeholder="请输入..." />
            </div> 
            <div class="item-div">
                <span class="item-comm required">来源：</span><Select v-model="modify2.source" class="item-input">
				        <Option value="1">国产</Option>
				        <Option value="2">进口</Option>
				    </Select>
				<span class="item-comm required">使用性质：</span><Select v-model="modify2.useNature" class="item-input">
	                    <Option value="1">营运用车</Option>
	                    <Option value="2">出租车</Option>
	                    <Option value="3">公务用车</Option>
	                    <Option value="4">家庭用车</Option>
	                    <Option value="5">其它</Option>
	                </Select>    
            </div> 
            <div class="item-div">
                <span class="item-comm required">有无年检：</span><Select v-model="modify2.hasInspect" class="item-input">
	                    <Option value="0">无</Option>
	                    <Option value="1">有</Option>
	                </Select>
                <span class="item-comm required">结束时间：</span><DatePicker v-model="modify2.insEndDate" type="date" placeholder="年检相关" class="item-input"></DatePicker>
            </div> 
            <div class="item-div">
                <span class="item-comm required">有无交强险：</span><Select v-model="modify2.hasHighInsurance" class="item-input">
	                    <Option value="0">无</Option>
	                    <Option value="1">有</Option>
	                </Select>
                <span class="item-comm required">开始时间：</span><DatePicker v-model="modify2.highStartDate" type="date" placeholder="交强险相关" class="item-input"></DatePicker>
            </div> 
            <div class="item-div">
                <span class="item-comm required">结束时间：</span><DatePicker v-model="modify2.highEndDate" type="date" placeholder="交强险相关" class="item-input"></DatePicker>
                <span class="item-comm required">有无商业险 ：</span><Select v-model="modify2.hasBusyInsurance" class="item-input">
                        <Option value="0">无</Option>
                        <Option value="1">有</Option>
                    </Select>
            </div>
            <div class="item-div" v-show="modify2.hasBusyInsurance=='1'">
                <span class="item-comm required">开始时间：</span><DatePicker v-model="modify2.busyStartDate" type="date" placeholder="商业险相关" class="item-input"></DatePicker>
                <span class="item-comm required">结束时间 ：</span><DatePicker v-model="modify2.busyEndDate" type="date" placeholder="商业险相关" class="item-input"></DatePicker>
            </div>
            <div class="item-div">
                <span class="item-comm required">燃料编号：</span><Input class="item-input" v-model="modify2.fuelNumber" placeholder="请输入..." />
                <span class="item-comm required">排量(ml)：</span><Input class="item-input" v-model="modify2.displace" placeholder="请输入..." />
            </div>
            <div class="item-div">
                <span class="item-comm required">缸数(缸)：</span><Input class="item-input" v-model="modify2.cylinder" placeholder="请输入..." />
                <span class="item-comm required">发动机功率(kw)：</span><Input class="item-input" v-model="modify2.power" placeholder="请输入..." />
            </div>
            <div class="item-div">
                <span class="item-comm required">排放标准：</span><Input class="item-input" v-model="modify2.emissStand" placeholder="请输入..." />
                <span class="item-comm required">变速哭器形式：</span><Input class="item-input" v-model="modify2.transmission" placeholder="请输入..." />
            </div>
            <div class="item-div">
                <span class="item-comm required">驱动方式：</span><Input class="item-input" v-model="modify2.driveModel" placeholder="请输入..." />
                <span class="item-comm required">是否有abs ：</span><Select v-model="modify2.hasAbs" class="item-input">
	                    <Option value="0">否</Option>
	                    <Option value="1">是</Option>
	                </Select>
            </div>
            <div class="item-div">
                <span class="item-comm required">其它重要配置：</span><Input class="item-input" v-model="modify2.otherImpConfig" placeholder="请输入..." />
                <span class="item-comm required">是否为事故车：</span><Select v-model="modify2.isAccident" class="item-input">
	                    <Option value="0">否</Option>
	                    <Option value="1">是</Option>
	                </Select>
            </div>
            <div class="item-div">
                <span class="item-comm required">扣分：</span><Input class="item-input" v-model="modify2.deduction" placeholder="请输入..." />
                <span class="item-comm required">罚款(元)：</span><Input class="item-input" v-model="modify2.fine" placeholder="请输入..." />
            </div>
            <div class="item-div">
                <span class="item-comm required">损伤位置及状况：</span><Input class="item-input" v-model="modify2.damage" placeholder="请输入..." />
                <span class="item-comm required">是否收押行驶证：</span><Select v-model="modify2.hasCustodyTraveler" class="item-input">
	                    <Option value="0">否</Option>
	                    <Option value="1">是</Option>
	                </Select>
            </div>
            <div class="item-div">
                <span class="item-comm required">是否收押机动车登记证书：</span><Select v-model="modify2.hasCustodyRegister" class="item-input">
	                    <Option value="0">否</Option>
	                    <Option value="1">是</Option>
	                </Select>
	            <span class="item-comm required">是否收押交强险保单：</span><Select v-model="modify2.hasCustodyHigh" class="item-input">
	                    <Option value="0">否</Option>
	                    <Option value="1">是</Option>
	                </Select>    
            </div>
            <div class="item-div">
                <span class="item-comm required">是否收押商业保险单：</span><Select v-model="modify2.hasCustodyBusy" class="item-input">
	                    <Option value="0">否</Option>
	                    <Option value="1">是</Option>
	                </Select>
	            <span class="item-comm required">收押其它：</span><Input class="item-input" v-model="modify2.custodyOther" placeholder="请输入..." />    
            </div>
            <div class="item-div">
                <span class="item-comm required">评定估价(元)：</span><Input class="item-input" v-model="modify2.valuatePrice" placeholder="请输入..." />
                <span class="item-comm required">验车人签字：</span><Input class="item-input" v-model="modify2.examinerSign" placeholder="请输入..." />
            </div>
            <div class="item-div">
                <span class="item-comm required">验车日期：</span><DatePicker v-model="modify2.examinerDate" type="date" placeholder="请选择" class="item-input"></DatePicker>
                <span class="item-comm required">车主签字：</span><Input class="item-input" v-model="modify2.ownerSign" placeholder="请输入..." />
            </div>
            <div class="item-div">
                <span class="item-comm required">备注：</span><Input class="item-input" v-model="modify2.remark" placeholder="请输入..." />
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn2">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <Modal width="360" v-model="modifyModal3" :title="myTitle3" :mask-closable="false"> 
            <Form ref="salesForm" :model="modify3"  :label-width="100">
                <ChinaArea txt="修改" @change="chinaAreaChange" :status="myTitle3=='新增' && !modifyModal3" :modifyStatus="myTitle3=='修改' && modifyModal3" 
	                :parProvince="modify3.province" :parCity="modify3.city" :parArea="modify3.area"></ChinaArea>
	            <FormItem label="里程数(万)：" prop="name" class="item-width ivu-form-item-required">
	                <Input style="width:200px;" v-model="modify3.mile" placeholder="请输入..." />	
	            </FormItem>
	            <FormItem label="首次上牌：" prop="name" class="item-width ivu-form-item-required">
	                <DatePicker v-model="modify3.regDate" type="month" placeholder="选择首次上牌时间" style="width:200px;"></DatePicker>
	            </FormItem>
	            <FormItem label="行驶证正面：" prop="name" class="item-width ivu-form-item-required">
	                <span class="display-before"><ImgUpload :myPicUrl="modify3Img[0]" :type="5" @changePicUrl="changePicUrl2(arguments,'行驶证正面')"></ImgUpload></span>
	            </FormItem>    
	            <FormItem label="行驶证反面：" prop="name" class="item-width ivu-form-item-required">
	                <span class="display-before"><ImgUpload :myPicUrl="modify3Img[1]" :type="5" @changePicUrl="changePicUrl2(arguments,'行驶证反面')"></ImgUpload></span>
	             </FormItem> 
	            <FormItem label="绿本第1页：" prop="name" class="item-width ivu-form-item-required">
	                <span class="display-before"><ImgUpload :myPicUrl="modify3Img[2]" :type="5" @changePicUrl="changePicUrl2(arguments,'绿本第1页')"></ImgUpload></span>
	             </FormItem> 
	            <FormItem label="绿本第2页：" prop="name" class="item-width ivu-form-item-required">
	                <span class="display-before"><ImgUpload :myPicUrl="modify3Img[3]" :type="5" @changePicUrl="changePicUrl2(arguments,'绿本第2页')"></ImgUpload></span>
	             </FormItem> 
	            <FormItem label="绿本第3页：" prop="name" class="item-width ivu-form-item-required">
	               <span class="display-before"><ImgUpload :myPicUrl="modify3Img[4]" :type="5" @changePicUrl="changePicUrl2(arguments,'绿本第3页')"></ImgUpload></span>
	             </FormItem> 
	            <FormItem label="绿本第4页：" prop="name" class="item-width ivu-form-item-required">
	               <span class="display-before"><ImgUpload :myPicUrl="modify3Img[5]" :type="5" @changePicUrl="changePicUrl2(arguments,'绿本第4页')"></ImgUpload></span>
                </FormItem> 
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="confirmBtn3">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
    </div>
</template>
<script>
import util from '@/util/util'
import CommonTipModal from '@/components/CommonTipModal' //公用的提示组件 
import ImgUpload from '@/components/ImgUpload' //公用的提示组件 
import ModalPic from '@/components/ModalPic'  
import ChinaArea from '@/components/ChinaArea' //公用的提示组件 
import moment from 'moment'
import { mapState } from 'vuex'
export default {
	name: 'CustomList',
	props:[],
	data () {
		return {
			totalCount: 0,
            modifyModal:false,
            modifyModal2:false,
            modifyModal3:false,
            modal_loading:false,
            bigimg:'', //点击呈现大图
            modalTipTitle:'禁用该员工',
            tipModal:false,
            myTitle:'录入/修改',
            myTitle2:'录入车辆报告/修改',
            myTitle3:'修改',
            item:{},
            picUrl:'',
            imgs:['http://mogu-devp.oss-cn-hangzhou.aliyuncs.com/img/auto/2019/5/8/1AA206B5-18B5-40C7-AE1B-82C9253E94FF.jpg?Expires=1557472015&OSSAccessKeyId=LTAIkqGHiKOXBXte&Signature=YBJPAEn3BlB6kdu5jI3pbToyvXE%3D','http://mogu-devp.oss-cn-hangzhou.aliyuncs.com/img/auto/2019/5/8/1AA206B5-18B5-40C7-AE1B-82C9253E94FF.jpg?Expires=1557472015&OSSAccessKeyId=LTAIkqGHiKOXBXte&Signature=YBJPAEn3BlB6kdu5jI3pbToyvXE%3D','http://mogu-devp.oss-cn-hangzhou.aliyuncs.com/img/auto/2019/5/8/1AA206B5-18B5-40C7-AE1B-82C9253E94FF.jpg?Expires=1557472015&OSSAccessKeyId=LTAIkqGHiKOXBXte&Signature=YBJPAEn3BlB6kdu5jI3pbToyvXE%3D','http://mogu-devp.oss-cn-hangzhou.aliyuncs.com/img/auto/2019/5/8/1AA206B5-18B5-40C7-AE1B-82C9253E94FF.jpg?Expires=1557472015&OSSAccessKeyId=LTAIkqGHiKOXBXte&Signature=YBJPAEn3BlB6kdu5jI3pbToyvXE%3D','http://mogu-devp.oss-cn-hangzhou.aliyuncs.com/img/auto/2019/5/8/1AA206B5-18B5-40C7-AE1B-82C9253E94FF.jpg?Expires=1557472015&OSSAccessKeyId=LTAIkqGHiKOXBXte&Signature=YBJPAEn3BlB6kdu5jI3pbToyvXE%3D'],
            modalPreview: false, //图片预览弹窗显示
            id:'',
            activeState: null,
            search:{
                pageNum:1,
                pageSize:15
            },
            spinShow:false,
            carRegisterRecords:[],
			modify: {  //车辆录入
				autoRepositoryId: '',
				plateNumber:  '',
				carType:  '',
				travelerOwner:  '',
				address:  '',
				nature:  '',
				travelerModel:  '',
				vin:  '',
				enginner:  '',
				travelerRegisterDate:  '',
				giveDate:  '',
				archivesNumber:  '',
				passenger:  '',
				weightTotal:  '',
				weightWhole:  '',
				size:  '',
				remark:  '',
				record:  '',
				type:  '',
				brand:  '',
				model:  '',
				color:  '',
				frame:  '',
				source:  '',
				enginerNumber:  '',
				enginerModel:  '',
				oilType:  '',
				work:  '',
				madeFactory:  '',
				turnType:  '',
				wheelDistance:  '',
				wheelCount:  '', 
				wheelNormal:  '',
				steelCount:  '',
				wheelbase:  '',
				axesCount:  '',
				verandaSize:  '',
				innerSize:  '',
				totalWeight:  '',
				approvedLoad:  '',
				customer:  '',
				tractionWeight:  '',
				driverCustomer:  '',
				useNature:  '',
				getWay:  '',
				outDate:  '',
				issueGov:  '',
				issueDate:  '',
			},
			modify2:{  //车辆报告
				autoRepositoryId:'',
				plateNumber:'',
				registerNumber:'',
				name:'',
				identityCard:'',
				enginner:'',
				frame:'',
				model:'',
				registerDate:'',
				mile:'',
				color:'',
				source:'',
				hasInspect:'',
				insEndDate:'',
				hasHighInsurance:'',
				highStartDate:'',
                highEndDate:'',
                hasBusyInsurance:'',
                busyStartDate:'',
                busyEndDate:'',
                useNature:'',
                fuelNumber:'',
                displace:'',
                cylinder:'',
                power:'',
                emissStand:'',
                transmission:'',
                driveModel:'',
                hasAbs:'',
                otherImpConfig:'',
                isAccident:'',
                deduction:'',
                fine:'',
                damage:'',
                hasCustodyTraveler:'',
                hasCustodyRegister:'',
                hasCustodyHigh:'',
                hasCustodyBusy:'',
                custodyOther:'',
                valuatePrice:'',
                examinerSign:'',
                examinerDate:'',
                ownerSign:'',
                storageDate:'',
                remark:''
			},
			modify3: {
				autoRepositoryId:'',
				province: '',
				city: '',
				area: '',
				mile: '',
				regDate: '',
				mainTravel: '',
				viceTravel: '',
				register1: '',
				register2: '',
				register3: '',
				register4: ''
			},
            modify3Img:[],
			table_loading: false, //默认先显示加载
			myContent:'',
			certifyList:[],
            columns: [{
                    title: '操作',
                    key: 'action',
                    width: 290,
                    align: 'center',
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: params.row.status==2 
                                },
                                style: {
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                        this.id = params.row.id;
                                        this.imgs = [];
                                        let arr = [params.row.mainTravelValue,params.row.viceTravelValue,params.row.register1Value,params.row.register2Value,params.row.register3Value,params.row.register4Value];
                                        this.imgs = arr;
                                        this.myTitle = '录入/修改';
                                        this.modifyModal = true;
                                        this.activeState = 0;
                                        this.getBaseOcr(this.imgs[0]);
                                        (async () => {
                                            try {
                                                let detailProduct = await this.$axios.get('/fx?api=gate.detail.car.admin',{params:{autoRepositoryId:params.row.id}});
                                                let {carTravelerDetailVO,carRegisterDetailVO,carRegisterRecordDetailVOs} = detailProduct;
												this.modify = {
													autoRepositoryId: params.row.id,
													plateNumber: carTravelerDetailVO.plateNumber,
													carType: carTravelerDetailVO.carType,
													travelerOwner: carTravelerDetailVO.travelerOwner,
													address: carTravelerDetailVO.address,
													nature: carTravelerDetailVO.nature,
													travelerModel: carTravelerDetailVO.travelerModel,
													vin: carTravelerDetailVO.vin,
													enginner: carTravelerDetailVO.enginner,
													travelerRegisterDate: carTravelerDetailVO.travelerRegisterDate,
													giveDate: carTravelerDetailVO.giveDate,
													archivesNumber: carTravelerDetailVO.archivesNumber,
													passenger: carTravelerDetailVO.passenger,
													weightTotal: carTravelerDetailVO.weightTotal,
													weightWhole: carTravelerDetailVO.weightWhole,
													size: carTravelerDetailVO.size,
													remark: carTravelerDetailVO.remark,
													record: carTravelerDetailVO.record,
													type: carRegisterDetailVO.type,
													brand: carRegisterDetailVO.brand,
													model: carRegisterDetailVO.model,
													color: carRegisterDetailVO.color,
													frame: carRegisterDetailVO.frame,
													source: carRegisterDetailVO.source,
													enginerNumber: carRegisterDetailVO.enginerNumber,
													enginerModel: carRegisterDetailVO.enginerModel,
													oilType: carRegisterDetailVO.oilType,
													work: carRegisterDetailVO.work,
													madeFactory: carRegisterDetailVO.madeFactory,
													turnType: carRegisterDetailVO.turnType,
													wheelDistance: carRegisterDetailVO.wheelDistance,
													wheelCount: carRegisterDetailVO.wheelCount,
													wheelNormal: carRegisterDetailVO.wheelNormal,
													steelCount: carRegisterDetailVO.steelCount,
													wheelbase:carRegisterDetailVO.wheelbase,
													axesCount: carRegisterDetailVO.axesCount,
													verandaSize: carRegisterDetailVO.verandaSize,
													innerSize:carRegisterDetailVO.innerSize,
													totalWeight: carRegisterDetailVO.totalWeight,
													approvedLoad: carRegisterDetailVO.approvedLoad,
													customer: carRegisterDetailVO.customer,
													tractionWeight: carRegisterDetailVO.tractionWeight,
													driverCustomer: carRegisterDetailVO.driverCustomer,
													useNature:carRegisterDetailVO.useNature,
													getWay: carRegisterDetailVO.getWay,
													outDate: carRegisterDetailVO.outDate,
													issueGov: carRegisterDetailVO.issueGov,
													issueDate: carRegisterDetailVO.issueDate
												};
												this.carRegisterRecords = [...carRegisterRecordDetailVOs];
                                                this.modifyModal = true;
                                            } catch (err) {
                                                this.$Message.error("请求出错！"); 
                                            }
                                        })()
                                    }
                                }
                            }, '录入/修改'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                style: {
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                        (async () => {
                                            try {
                                                let detailProduct = await this.$axios.get('/fx?api=gate.order.admin.car.detail',{params:{autoRepositoryId:params.row.id}});
                                                let { reportVO } = detailProduct;
												this.modify2 = {
													autoRepositoryId: params.row.id,
													plateNumber: reportVO.plateNumber,
													registerNumber: reportVO.registerNumber,
													name: reportVO.name,
													identityCard: reportVO.identityCard,
													enginner: reportVO.enginner,
													frame: reportVO.frame,
													model: reportVO.model,
													registerDate: reportVO.registerDate,
													mile: reportVO.mile,
													color: reportVO.color,
													source: reportVO.source,
													hasInspect: reportVO.hasInspect,
													insEndDate: reportVO.insEndDate,
													hasHighInsurance: reportVO.hasHighInsurance,
													highStartDate: reportVO.highStartDate,
													highEndDate: reportVO.highEndDate,
													hasBusyInsurance: reportVO.hasBusyInsurance,
													busyStartDate: reportVO.busyStartDate,
													busyEndDate: reportVO.busyEndDate,
													useNature: reportVO.useNature,
													fuelNumber: reportVO.fuelNumber,
													displace: reportVO.displace,
													cylinder:reportVO.cylinder,
													power: reportVO.power,
													emissStand: reportVO.emissStand,
													transmission: reportVO.transmission,
													driveModel: reportVO.driveModel,
													hasAbs: reportVO.hasAbs,
													otherImpConfig: reportVO.otherImpConfig,
													isAccident: reportVO.isAccident,
													deduction: reportVO.deduction,
													fine: reportVO.fine,
													damage: reportVO.damage,
													hasCustodyTraveler: reportVO.hasCustodyTraveler,
													hasCustodyRegister:reportVO.hasCustodyRegister, 
													hasCustodyHigh: reportVO.hasCustodyHigh,
													hasCustodyBusy: reportVO.hasCustodyBusy,
													custodyOther: reportVO.custodyOther,
													valuatePrice: reportVO.valuatePrice,
													examinerSign: reportVO.examinerSign,
													examinerDate: reportVO.examinerDate,
													ownerSign: reportVO.ownerSign,
													storageDate: reportVO.storageDate,
													remark: reportVO.remark
												};
                                                this.modifyModal2 = true;
                                            } catch (err) {
                                                this.$Message.error("请求出错！"); 
                                            }
                                        })()
                                    }
                                }
                            }, '录入车辆报告/修改'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                },
                                style: {
                                    'margin-left':'10px',
                                },
                                on: {
                                    click: () => {
                                        (async () => {
                                            try {
                                                let detailProduct = await this.$axios.get('/fx?api=gate.order.admin.car.detail',{params:{autoRepositoryId:params.row.id}});
                                                let { autoRepositoryDetailVO } = detailProduct;
												this.modify3 = {
													autoRepositoryId: params.row.id,
													province: autoRepositoryDetailVO.province,
													city: autoRepositoryDetailVO.city,
													area: autoRepositoryDetailVO.area,
													mile: autoRepositoryDetailVO.mile,
													regDate: autoRepositoryDetailVO.regDate,
													mainTravel: autoRepositoryDetailVO.mainTravel,
													viceTravel: autoRepositoryDetailVO.viceTravel,
													register1: autoRepositoryDetailVO.register1,
													register2: autoRepositoryDetailVO.register2,
													register3: autoRepositoryDetailVO.register3,
													register4: autoRepositoryDetailVO.register4
												};
												this.modify3Img = [autoRepositoryDetailVO.mainTravelValue,autoRepositoryDetailVO.viceTravelValue,autoRepositoryDetailVO.register1Value,autoRepositoryDetailVO.register2Value,autoRepositoryDetailVO.register3Value,autoRepositoryDetailVO.register4Value];
                                                this.modifyModal3 = true;
                                                console.log(this.modify3);
                                            } catch (err) {
                                                this.$Message.error("请求出错！"); 
                                            }
                                        })()
                                    }
                                }
                            }, '修改')
                        ]);
                    }
                }, {
					title: '城市',
					key: 'pc',
					minWidth: 160,
					render: (h, params) => {
						return h('div', [
							h('strong', params.row.pc)
						]);
					}
				}, {
                    title: '车型',
                    key: 'modelName',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.modelName)
                        ]);
                    }
                },{
                    title: '行驶证主页',
                    key: 'mainTravelValue',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('img', {
                                domProps: {
                                    src: params.row.mainTravelValue,
                                },
                                slot: "content",
                                style: {
                                    width: "50px",
                                    height: '50px',
                                    'vertical-align': 'middle',
                                    margin: '5px auto',
                                    cursor:"pointer"
                                },
                                on: {
                                    click: () => {
                                        if(params.row.mainTravelValue){
                                            this.clickFaceImg(params.row.mainTravelValue);
                                        }
                                    }
                                }
                            }, ''),
                        ]);
                    }
                },{
                    title: '行驶证副页',
                    key: 'viceTravelValue',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('img', {
                                domProps: {
                                    src: params.row.viceTravelValue,
                                },
                                slot: "content",
                                style: {
                                    width: "50px",
                                    height: '50px',
                                    'vertical-align': 'middle',
                                    margin: '5px auto',
                                    cursor:"pointer"
                                },
                                on: {
                                    click: () => {
                                        if(params.row.viceTravelValue){
                                            this.clickFaceImg(params.row.viceTravelValue);
                                        }
                                    }
                                }
                            }, ''),
                        ]);
                    }
                },{
                    title: '绿本第1页',
                    key: 'register1Value',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('img', {
                                domProps: {
                                    src: params.row.register1Value,
                                },
                                slot: "content",
                                style: {
                                    width: "50px",
                                    height: '50px',
                                    'vertical-align': 'middle',
                                    margin: '5px auto',
                                    cursor:"pointer"
                                },
                                on: {
                                    click: () => {
                                        if(params.row.register1Value){
                                            this.clickFaceImg(params.row.register1Value);
                                        }
                                    }
                                }
                            }, ''),
                        ]);
                    }
                },{
                    title: '绿本第2页',
                    key: 'register2Value',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('img', {
                                domProps: {
                                    src: params.row.register2Value,
                                },
                                slot: "content",
                                style: {
                                    width: "50px",
                                    height: '50px',
                                    'vertical-align': 'middle',
                                    margin: '5px auto',
                                    cursor:"pointer"
                                },
                                on: {
                                    click: () => {
                                        if(params.row.register2Value){
                                            this.clickFaceImg(params.row.register2Value);
                                        }
                                    }
                                }
                            }, ''),
                        ]);
                    }
                }, {
                    title: '绿本第3页',
                    key: 'register3Value',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('img', {
                                domProps: {
                                    src: params.row.register3Value,
                                },
                                slot: "content",
                                style: {
                                    width: "50px",
                                    height: '50px',
                                    'vertical-align': 'middle',
                                    margin: '5px auto',
                                    cursor:"pointer"
                                },
                                on: {
                                    click: () => {
                                        if(params.row.register3Value){
                                            this.clickFaceImg(params.row.register3Value);
                                        }
                                    }
                                }
                            }, ''),
                        ]);
                    }
                }, {
                    title: '绿本第4页',
                    key: 'register4Value',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('img', {
                                domProps: {
                                    src: params.row.register4Value,
                                },
                                slot: "content",
                                style: {
                                    width: "50px",
                                    height: '50px',
                                    'vertical-align': 'middle',
                                    margin: '5px auto',
                                    cursor:"pointer"
                                },
                                on: {
                                    click: () => {
                                        if(params.row.register4Value){
                                            this.clickFaceImg(params.row.register4Value);
                                        }
                                    }
                                }
                            }, ''),
                        ]);
                    }
                }, 
			]
		}
	},
    components:{
        CommonTipModal,
        ImgUpload,
        ModalPic,
        ChinaArea
    }, 
	computed:{
        ...mapState(['adjustHeight']) 
    },
	activated(){
        this.getInitialList(this.search);
	},
	methods: {
		getInitialList(formData){ 
            this.table_loading = true;
		    this.$axios.get('/fx?api=gate.list.car.admin',{params:formData}).then(res => {
		    	if(res!=500){
		    		this.certifyList = res.list;
			        this.totalCount = res.page.totalCount;
			        this.search.pageNum = res.page.currentPage;
			        this.$store.commit('change_height');
		    	}
		    	this.table_loading = false;
			})
		},
		getBaseOcr(url){
			let imgbox = document.getElementById('img-box');
            imgbox.innerHTML = '';
            this.spinShow = true;
            this.$axios.get('/fx?api=gate.base.ocr',{params:{url:url}}).then(res => {
		    	if(res!=500){
                    if(res && res.words_result.length){
                        res.words_result.forEach((item) => {
                            this.createSpan(item.location.top/2, item.location.left/2, item.words);
                        })
                    }else{
                        this.$Message.info('暂无提取到相关信息');
                    }
                    this.spinShow = false;
                }
			})
		},
		createSpan(t,l,txt) { //l是距左的距离,t是距上的距离,t是要显示的文本内容
            let imgbox = document.getElementById('img-box');
            let dd = document.createElement("span");
            dd.style.position = "absolute";
            dd.style.top = t + "px"
            dd.style.left = l + "px";
            dd.innerText = txt;
            imgbox.appendChild(dd);
        },
        changePicUrl(picUrl,myUrl){
            this.modify.bannerPic = picUrl;
            this.picUrl = myUrl;
        },
        changePicUrl2(...arr){ //arr为子组件向父组件传递的参数列表
            switch (arr[1]) {
                case '行驶证正面':
                    this.modify3.mainTravel = arr[0][0];
                    break;
                case '行驶证反面':
                    this.modify3.viceTravel = arr[0][0];
                    break;
                case '绿本第1页':
                    this.modify3.register1 = arr[0][0];
                    break;
                case '绿本第2页':
                    this.modify3.register2 = arr[0][0];
                    break;
                case '绿本第3页':
                    this.modify3.register3 = arr[0][0];
                    break;  
                case '绿本第4页':
                    this.modify3.register4 = arr[0][0];
                    break;              
            }
        },
        pageChange(page){
			this.search.pageNum = page;
            this.getInitialList(this.search);
        },
        searchList() {
        	this.search.pageNum = 1;
			this.getInitialList(this.search);
		},
        addBtn(){
            this.myTitle = '新增';
            this.modifyModal = true;
            this.modify = {
            }
            this.picUrl = '';
        },
        confirmBtn(){
            if(!this.modify.plateNumber || !this.modify.carType || !this.modify.travelerOwner || !this.modify.address || !this.modify.nature || !this.modify.travelerModel || !this.modify.vin || !this.modify.enginner || !this.modify.travelerRegisterDate || !this.modify.giveDate || !this.modify.archivesNumber || !this.modify.passenger || !this.modify.weightTotal || !this.modify.weightWhole || !this.modify.size || !this.modify.remark || !this.modify.record || !this.modify.type || !this.modify.brand || !this.modify.model || !this.modify.color || !this.modify.frame || !this.modify.source || !this.modify.enginerNumber || !this.modify.enginerModel || !this.modify.oilType || !this.modify.work || !this.modify.madeFactory || !this.modify.turnType || !this.modify.wheelDistance || !this.modify.wheelCount || !this.modify.wheelNormal || !this.modify.steelCount || !this.modify.wheelbase || !this.modify.axesCount || !this.modify.verandaSize || !this.modify.innerSize || !this.modify.totalWeight || !this.modify.approvedLoad || !this.modify.customer || !this.modify.tractionWeight || !this.modify.driverCustomer || !this.modify.useNature || !this.modify.getWay || !this.modify.outDate || !this.modify.issueGov || !this.modify.issueDate){
                return this.$Message.error("带 * 为必填项"); 
            }
            if(this.carRegisterRecords.length){
                let bol = this.carRegisterRecords.some((item)=>{
                    return item.registerGov=='' || item.registerDate=='' || item.registerNumber=='';
                })
                if(bol){
                	return this.$Message.error("绿本变迁记录相关信息不能为空"); 
                }
            }
            let formData = {...this.modify};
            formData.carRegisterRecords = JSON.stringify(this.carRegisterRecords);
            let  myUrl = '/fx?api=gate.update.car.admin';
            this.$axios.post(myUrl,formData).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.modifyModal = false;
                    this.getInitialList(this.search);    
                }
            })
        },
        confirmBtn2(){
			for (let key in this.modify2) {
				if (!this.modify2[key]) {
					return this.$Message.error("带 * 为必填项");
				}
			}
			this.modify2.registerDate = moment(this.modify2.registerDate).format("YYYY-MM-DD");
            this.modify2.insEndDate = moment(this.modify2.insEndDate).format("YYYY-MM-DD");
            this.modify2.highStartDate = moment(this.modify2.highStartDate).format("YYYY-MM-DD");
            this.modify2.highEndDate = moment(this.modify2.highEndDate).format("YYYY-MM-DD");
            this.modify2.busyStartDate = moment(this.modify2.busyStartDate).format("YYYY-MM-DD");
            this.modify2.busyEndDate = moment(this.modify2.busyEndDate).format("YYYY-MM-DD");
            this.modify2.examinerDate = moment(this.modify2.examinerDate).format("YYYY-MM-DD");
            this.modify2.storageDate = moment(this.modify2.storageDate).format("YYYY-MM-DD");
            this.$axios.post('/fx?api=gate.addOrUpdate.auto.report',this.modify2).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.modifyModal2 = false;
                    this.getInitialList(this.search);    
                }
            })
        },
        cancel(){
            this.tipModal = false;
            this.modifyModal = false;
            this.modalPreview = false;
            this.modifyModal2 = false;
            this.modifyModal3 = false;
			this.modify3.province = null;
			this.modify3.city = null;
			this.modify3.area = null;
		},
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.getInitialList(this.search);
            }
        },
        clickFaceImg(img){
        	this.bigimg = img;
			this.modalPreview = true;
		},
		clickImgGetTxt(index,url){
            this.activeState = index; 
            this.getBaseOcr(url);
		},
		addItem(){
			this.carRegisterRecords.push({
				owner: '', 
                registerGov: '', 
                registerDate: '', 
                registerNumber: '' 
            });
		},
		deleteItem(index){
            this.carRegisterRecords.splice(index,1);
		},
		chinaAreaChange(data){
            this.modify3.province = data.province;
            this.modify3.city = data.city;
            this.modify3.area = data.area;
        },
		confirmBtn3(){
            for (let key in this.modify3) {
				if (!this.modify3[key]) {
					return this.$Message.error("带 * 为必填项");
				}
			}
			this.modify3.regDate = moment(this.modify3.regDate).format("YYYY-MM");
			this.$axios.post('/fx?api=gate.auto.repository.update',this.modify3).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.modifyModal3 = false;
                    this.getInitialList(this.search);    
                }
                this.modify3.province = null;
	            this.modify3.city = null;
	            this.modify3.area = null;
            })
		}
	}
}
</script>
<style lang="less" scoped>
    #customList /deep/ .ivu-table-row.ivu-table-row-hover{
        cursor: pointer;
    }
    .item-comm{
        position: relative;
        display: inline-block;
        width: 90px; 
        margin-left: 16px;
    }
    .item-comm.required:before{
        position: absolute;
        content:'*';
        color:red;
        left:-10px;
        top:3px;
    }
    .display-before /deep/ .item-comm.required{
        display: none;
    }
    .item-input,.common-width{
        width: 90px;
    }
    .tesu  .item-input{
        width: 102px;
    }
    .modify-modal{
    	height: 600px;
        padding: 0 10px;
    }
    .item-div{
        margin: 10px 0;
    }
    .my-span-2{
        margin: 10px 0;
	    display: inline-block;
	    margin-left: 18px;
    }
    .span-upload{
        display: inline-block;
        padding-left:14px;
    }
    .modal-left,.modal-right{
    	display: inline-block;
    	height: 100%;
    	width: 49%;
    }
    .modal-right{
    	overflow: auto;
    }
    .modal-left{
    	vertical-align: top;
    }
    .modal-left>div{
        border:1px solid #ddd;
    }
    .modal-left>div:first-child{
     	border-bottom: none;
    }
    .modal-left>div:last-child{
    	height: 520px;
    	overflow: auto;
    }
    .modal-left img{
    	width: 12.6%;
    	margin: 2%;
    	border:1px solid transparent;
    	cursor: pointer;
    	&.active{
    		border:1px solid #2d8cf0;
    	}
    }
    #img-box{
    	position: relative;
    }
    .item-title{
    	padding-left: 10px;
    	font-size: 14px;
    	font-weight: 600;
    }
</style>