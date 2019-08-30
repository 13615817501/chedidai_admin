<template>
    <div id="waitStoreDetail" class="common-id">
        <Breadcrumb>
            <BreadcrumbItem>订单管理</BreadcrumbItem>
            <BreadcrumbItem>详情</BreadcrumbItem>
        </Breadcrumb>
        <div class="modify-modal"> 
            <Button type="primary" @click="backBtn"><Icon type="ios-arrow-back" />返回</Button>
            <div class="tab-top-title">
                <span>姓名：<span class="span11">{{certifyList.name}}</span></span>
                <span>身份证：<span class="span11">{{certifyList.identityCard}}</span></span>
                <span>车牌号：<span class="span11">{{modify1.plateNumber}}</span></span>
                <span>车架号：<span class="span11">{{modify1.vin}}</span></span>
                <span>发动机号：<span class="span11">{{modify1.enginner}}</span></span>
                <span><span class="span11"><Button type="primary" :loading="carImgloading1"  @click="downLoadCarInfo"><Icon type="md-download" />下载车辆文件</Button><Button style="margin-left:8px;" type="primary" :loading="carImgloading4"  @click="downLoadAllInfo"><Icon type="md-download" />下载所有资料照片</Button></span></span>
            </div>
            <div class="tab-top-title">
                <span>
                    <!-- 身份证正面：<img class="my-img" :src="certifyList.identityFrontValue" alt="身份证正面：" @click="clickFaceImg(certifyList.identityFrontValue)"> -->
                    身份证正面： <viewer :images="certifyList.identityFrontValue?certifyList.identityFrontValue.split(' '):[]"><img class="my-img" :src="certifyList.identityFrontValue" alt="身份证正面">
                                </viewer>
                </span> 
                <span>
                    <!-- <img class="my-img" :src="certifyList.identityBackValue" alt="身份证反面" @click="clickFaceImg(certifyList.identityBackValue)"> -->
                   身份证反面： <viewer :images="certifyList.identityBackValue?certifyList.identityBackValue.split(' '):[]"><img class="my-img" :src="certifyList.identityBackValue" alt="身份证反面">
                                </viewer>
                </span> 
                <span>
                    <!-- <img class="my-img" :src="modify5Img[0]" alt="行驶证正面" @click="clickFaceImg(modify5Img[0])"> -->
                    行驶证正面：<viewer :images="modify5Img[0]?modify5Img[0].split(' '):[]"><img class="my-img" :src="modify5Img[0]" alt="行驶证正面">
                                </viewer>
                </span> 
                <span>
                    <!-- <img class="my-img" :src="modify5Img[1]" alt="行驶证反面" @click="clickFaceImg(modify5Img[1])"> -->
                    行驶证反面：<viewer :images="modify5Img[1]?modify5Img[1].split(' '):[]"><img class="my-img" :src="modify5Img[1]" alt="行驶证反面">
                                </viewer>
                </span> 
                <span>
                    <!-- <img class="my-img" :src="modify5Img[0]" alt="行驶证正面" @click="clickFaceImg(modify5Img[0])"> -->
                    驾驶证正面：<viewer :images="modify5Img[2]?modify5Img[2].split(' '):[]"><img class="my-img" :src="modify5Img[2]" alt="驾驶证正面">
                                </viewer>
                </span> 
                <span>
                    <!-- <img class="my-img" :src="modify5Img[1]" alt="行驶证反面" @click="clickFaceImg(modify5Img[1])"> -->
                    驾驶证反面：<viewer :images="modify5Img[3]?modify5Img[3].split(' '):[]"><img class="my-img" :src="modify5Img[3]" alt="驾驶证反面">
                                </viewer>
                </span> 
                <span>
                    <!-- <img class="my-img" :src="modify5Img[2]" alt="绿本第1页" @click="clickFaceImg(modify5Img[2])"> -->
                    绿本第1页：<viewer :images="modify5Img[4]?modify5Img[4].split(' '):[]"><img class="my-img" :src="modify5Img[4]" alt="绿本第1页">
                                </viewer>
                </span> 
                <span>
                    <!-- <img class="my-img" :src="modify5Img[3]" alt="绿本第2页" @click="clickFaceImg(modify5Img[3])"> -->
                    绿本第2页：<viewer :images="modify5Img[5]?modify5Img[5].split(' '):[]"><img class="my-img" :src="modify5Img[5]" alt="绿本第2页">
                                </viewer>
                </span> 
                <span>
                    <!-- <img class="my-img" :src="modify5Img[4]" alt="绿本第3页" @click="clickFaceImg(modify5Img[4])"> -->
                   绿本第3页：<viewer :images="modify5Img[6]?modify5Img[6].split(' '):[]"><img class="my-img" :src="modify5Img[6]" alt="绿本第3页">
                                </viewer>
                </span> 
                <span>
                    <!-- <img class="my-img" :src="modify5Img[5]" alt="绿本第4页" @click="clickFaceImg(modify5Img[5])"> -->
                    绿本第4页：<viewer :images="modify5Img[7]?modify5Img[7].split(' '):[]"><img class="my-img" :src="modify5Img[7]" alt="绿本第4页">
                                </viewer>
                </span> 
            </div>
            <Tabs v-model="activedName" @on-click="tabClick" style="font-size:14px;">
                <TabPane label="客户信息" name="name1">
                    <div class="name1-box" :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}">
                        <div class="title-info">个人信息<Button type="primary" v-if="isUpdate" size="small" style="margin-left:10px;" @click="modifyInfoBtn1">{{!ismodifyInfo?'修改':'保存'}}</Button></div>
                        <ul class="common-ul">
                            <li><span class="item-comm required">姓名：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.name" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">身份证号：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.identityCard" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">活体认证：</span><Input class="item-input txt" readonly :value="'完成'"/></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required">银行卡号：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.cardNumber" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">开户行：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.bankName" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">银行预留手机：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.bankMobile" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required">证件开始时间：</span><DatePicker v-if="ismodifyInfo" v-model="modifyInfo.signDate" type="date" placeholder="证件有效期" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.signDate"/></li>
                            <li><span class="item-comm required">证件有效期至：</span><DatePicker v-if="ismodifyInfo" v-model="periodDateTemporary" type="date" placeholder="证件有效期" class="item-input"></DatePicker><Tag style="margin-left:5px;" v-if="ismodifyInfo" checkable color="primary" :checked="checkedState" @on-change="longBtn">长期</Tag>
                                <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.periodDate"/></li>
                            <li><span class="item-comm required">户籍地址：</span><Input class="item-input" style="width:300px;" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.houseAddress" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                        </ul>
                        <div class="title-info">补充信息</div>
                        <ul class="common-ul">
                            <li><span class="item-comm required">现住地址：</span><ChinaArea2 v-if="ismodifyInfo" @change="chinaAreaChange1" :parProvince="modifyInfo.nowProvice" :parCity="modifyInfo.nowCity" :parArea="modifyInfo.nowArea"></ChinaArea2><Input style="margin-left:8px;" class="item-input" v-if="ismodifyInfo" v-model="modifyInfo.nowUpdateAddress" placeholder="请输入..." /><Input class="item-input txt" style="width:400px;" v-if="!ismodifyInfo" readonly :value="modifyInfo.nowAddress"/></li>
                            <li><span class="item-comm required">客户来源：</span><Select v-if="ismodifyInfo" v-model="modifyInfo.source" class="item-input">
                                    <Option value="1">中介</Option>
                                    <Option value="2">客户推荐</Option>
                                    <Option value="3">陌生拜访</Option>
                                    <Option value="4">小区推广</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.source=='1'?'中介':modifyInfo.source=='2'?'客户推荐':modifyInfo.source=='3'?'陌生拜访':modifyInfo.source=='4'?'小区推广':''"/></li>
                            <li><span class="item-comm required">起始居住时间：</span><DatePicker v-if="ismodifyInfo" v-model="modifyInfo.startLiveDate" type="date" placeholder="起始居住时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.startLiveDate"/></li>
                            <li><span class="item-comm required">婚姻状态：</span><Select v-if="ismodifyInfo" v-model="modifyInfo.marry" class="item-input">
                                    <Option value="1">已婚</Option>
                                    <Option value="2">未婚</Option>
                                    <Option value="3">离异</Option>
                                    <Option value="4">再婚</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.marry=='1'?'已婚':modifyInfo.marry=='2'?'未婚':modifyInfo.marry=='3'?'离异':modifyInfo.marry=='4'?'再婚':''"/></li>
                            <li><span class="item-comm required">有无子女：</span><Select v-if="ismodifyInfo" v-model="modifyInfo.hasChild" class="item-input">
                                    <Option value="1">有</Option>
                                    <Option value="2">无</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.hasChild=='1'?'有':modifyInfo.hasChild=='2'?'无':''"/></li>
                            <li><span class="item-comm required">供养亲属：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.supportRelate" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">本市地址电话：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.localMobile" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">学历背景：</span><Select v-if="ismodifyInfo" v-model="modifyInfo.educate" class="item-input">
                                    <Option value="1">硕土以上</Option>
                                    <Option value="2">本科</Option>
                                    <Option value="3">专科</Option>
                                    <Option value="4">高中以下</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.educate=='1'?'硕土以上':modifyInfo.educate=='2'?'本科':modifyInfo.educate=='3'?'专科':modifyInfo.educate=='4'?'高中以下':''"/></li>
                            <li><span class="item-comm required">单位名称：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.companyName" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">单位地址：</span><ChinaArea2 v-if="ismodifyInfo" @change="chinaAreaChange2" :parProvince="modifyInfo.companyProvice" :parCity="modifyInfo.companyCity" :parArea="modifyInfo.companyArea"></ChinaArea2><Input style="margin-left:8px;" class="item-input" v-if="ismodifyInfo" v-model="modifyInfo.companyUpdateAddress" placeholder="'请输入...'" /><Input class="item-input txt" style="width:400px;" v-if="!ismodifyInfo" readonly :value="modifyInfo.companyAddress"/></li>
                            <li><span class="item-comm required">职位级别：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.level" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">信用卡额度(万元)：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.creditQuota" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">暂住证：</span><Select v-if="ismodifyInfo" v-model="modifyInfo.isTempcer" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.isTempcer=='0'?'无':modifyInfo.isTempcer=='1'?'有':''"/></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required">月基本薪资：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.baseSalary" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">其他收入：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.otherSalary" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">起始服务时间：</span><DatePicker v-if="ismodifyInfo" v-model="modifyInfo.startWorkTime" type="date" placeholder="起始服务时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.startWorkTime"/></li>
                            <li><span class="item-comm required">企业类型：</span><Select v-if="ismodifyInfo" v-model="modifyInfo.companyType" class="item-input">
                                    <Option value="1">非私营业主</Option>
                                    <Option value="2">个体</Option>
                                    <Option value="3">私营独资</Option>
                                    <Option value="4">私营有限责任</Option>
                                    <Option value="5">私营股份有限</Option>
                                    <Option value="6">港资/外资</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.companyType=='1'?'非私营业主':modifyInfo.companyType=='2'?'个体':modifyInfo.companyType=='3'?'私营独资':modifyInfo.companyType=='4'?'私营有限责任':modifyInfo.companyType=='5'?'私营股份有限':modifyInfo.companyType=='6'?'港资/外资':''"/></li>
                            <li><span class="item-comm required">单位电话：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.companyMobile" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">住址拥有情况：</span><Select v-if="ismodifyInfo" v-model="modifyInfo.ownHouse" class="item-input">
                                    <Option value="1">自有</Option>
                                    <Option value="2">直系亲属房屋</Option>
                                    <Option value="3">租住</Option>
                                    <Option value="4">单位分配</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.ownHouse=='1'?'自有':modifyInfo.ownHouse=='2'?'直系亲属房屋':modifyInfo.ownHouse=='3'?'租住':modifyInfo.ownHouse=='4'?'单位分配':''"/></li>
                            <li><span class="item-comm required">名下其他财产：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.otherProperty" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">电子邮箱：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.email" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">房产：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.houseProperty" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">所属部门：</span><Input class="item-input" :class="{txt:!ismodifyInfo}" :readonly='!ismodifyInfo' v-model="modifyInfo.dept" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">公司性质：</span><Select v-if="ismodifyInfo" v-model="modifyInfo.nature" class="item-input">
                                    <Option value="1">机关及事业单位</Option>
                                    <Option value="2">国有股份</Option>
                                    <Option value="3">外资</Option>
                                    <Option value="4">合资</Option>
                                    <Option value="5">民营</Option>
                                    <Option value="6">私营</Option>
                                    <Option value="7">个体</Option>
                                    <Option value="8">社会团体</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.nature=='1'?'机关及事业单位':modifyInfo.nature=='2'?'国有股份':modifyInfo.nature=='3'?'外资':modifyInfo.nature=='4'?'合资':modifyInfo.nature=='5'?'民营':modifyInfo.nature=='6'?'私营':modifyInfo.nature=='7'?'个体':modifyInfo.nature=='8'?'社会团体':''"/></li>
                            <li><span class="item-comm required">来本市时间：</span><DatePicker v-if="ismodifyInfo" v-model="modifyInfo.firstCome" type="year" placeholder="来本市时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodifyInfo" readonly :value="modifyInfo.firstCome"/></li>
                        </ul>
                        <div v-for="(item,index) in contacts" :key="index">
                            <div class="title-info">第{{index+1}}联系人</div>
                            <Button type="primary" style="display:block;margin-left:25px;" size="small" v-if="isUpdate"  @click="modifyContact(item,index)">{{!ismodifyContact[index]?'修改':'保存'}}</Button>
                            <ul class="common-ul">
                                <li><span  class="item-comm required"  style="width:120px;">姓名：</span><Input class="item-input" :class="{txt:!ismodifyContact[index]}" :readonly='!ismodifyContact[index]' v-model="item.concatName" :placeholder="ismodifyContact[index]?'请输入...':''" /></li>
                                <li><span class="item-comm required"  style="width:120px;">关系：</span><Select v-if="ismodifyContact[index]" v-model="item.concatRelation" class="item-input">
                                    <Option value="1">配偶</Option>
                                    <Option value="2">父母</Option>
                                    <Option value="3">子女</Option>
                                    <Option value="4">朋友</Option>
                                    <Option value="5">兄弟姐妹</Option>
                                    <Option value="9">其他</Option>
                                </Select>
                                    <Input class="item-input txt" v-if="!ismodifyContact[index]" readonly :value="item.concatRelationValue"/></li>
                                <li><span class="item-comm required"  style="width:120px;">工作单位：</span><Input class="item-input" :class="{txt:!ismodifyContact[index]}" :readonly='!ismodifyContact[index]' v-model="item.company" :placeholder="ismodifyContact[index]?'请输入...':''" /></li>
                                <li><span class="item-comm required" style="width:120px;">单位/家庭住址：</span><ChinaArea2 v-if="ismodifyContact[index]" @change="chinaAreaChange3($event)" :parProvince="item.province" :parCity="item.city" :parArea="item.area"></ChinaArea2><Input style="margin-left:8px;" class="item-input" v-if="ismodifyContact[index]" v-model="item.address" placeholder="请输入..." /><Input class="item-input txt" style="width:400px;" v-if="!ismodifyContact[index]" readonly :value="item.pca"/></li>
                                <li><span class="item-comm required" style="width:120px;">联系电话：</span><Input class="item-input" :class="{txt:!ismodifyContact[index]}" :readonly='!ismodifyContact[index]' v-model="item.concatMobile" :placeholder="ismodifyContact[index]?'请输入...':''" /></li>
                            </ul>
                        </div>
                        <div class="title-info">基础材料</div>
                        <div class="original-img">
                            <span style="margin-left:0;">
                                <!-- <img :src="certifyList.identityFrontValue" alt="身份证正面" @click="clickFaceImg(certifyList.identityFrontValue)"> -->
                                <viewer :images="identityInfo"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in identityInfo" :src="src" :key="index" alt="基础材料">
                                </viewer>
                            </span>
                         <!--   <span><img :src="certifyList.identityBackValue" alt="身份证反面" @click="clickFaceImg(certifyList.identityBackValue)"></span>
                           <span><img :src="certifyList.bankFrontValue" alt="银行卡正面" @click="clickFaceImg(certifyList.bankFrontValue)"></span>
                           <span><img :src="certifyList.bankBackValue" alt="银行卡反面" @click="clickFaceImg(certifyList.bankBackValue)"></span> -->
                        </div> 
                    </div>
                </TabPane>
                <TabPane label="车辆信息" name="name2">
                    <div class="name2-box" :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}">
                        <!-- 行驶证信息 -->
                        <div class="title-info">行驶证信息<Button type="primary" v-if="name=='WaitStoreList'" :ghost="!ismodify1" style="margin-left:100px;" size="small" @click="modify1Btn">{{ismodify1?'保存':'修改'}}</Button></div>   
                        <div class="item-div">
                            <span class="item-comm required">车牌号：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.plateNumber" :placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm required">车辆类型：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.carType" :placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm required">所有人：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.travelerOwner" :placeholder="ismodify1?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">住址：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.address" :placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm required">使用性质：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.nature" :placeholder="ismodify1?'请输入...':''"/>
                            <span class="item-comm required">品牌型号：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.travelerModel" :placeholder="ismodify1?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">车辆识别代码：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.vin" :placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm required">发动机号码：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.enginner" :placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm">注册日期：</span><DatePicker v-if="ismodify1" v-model="modify1.travelerRegisterDate" type="date" placeholder="选择注册日期" class="item-input"></DatePicker>
                            <Input class="item-input txt" v-if="!ismodify1" readonly :value="modify1.travelerRegisterDate"/>
                        </div>
                        <div class="item-div">
                            <span class="item-comm">发证日期：</span><DatePicker v-if="ismodify1" v-model="modify1.giveDate" type="date" placeholder="选择发证日期" class="item-input"></DatePicker>
                            <Input class="item-input txt" v-if="!ismodify1" readonly :value="modify1.giveDate"/>
                            <span class="item-comm">档案编号：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.archivesNumber" :placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm required">核载人数(人)：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.passenger" :placeholder="ismodify1?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm">总质量(kg)：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.weightTotal":placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm">整备质量(kg)：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.weightWhole" :placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm">外部尺寸(mm)：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.size" :placeholder="ismodify1?'请输入...':''" />
                        </div>  
                        <div class="item-div">
                            <span class="item-comm">备注：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.remark" :placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm">检验记录：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.record" :placeholder="ismodify1?'请输入...':''" />
                        </div>
                        <!-- 绿本 -->
                        <div class="title-info">绿本<Button type="primary" v-if="name=='WaitStoreList'" :ghost="!ismodify2" style="margin-left:142px;" size="small" @click="modify2Btn">{{ismodify2?'保存':'修改'}}</Button></div>
                        <div class="item-div">
                            <span class="item-comm required">车辆类型：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.type" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">车辆品牌：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.brand" :placeholder="ismodify2?'请输入...':''"/>
                            <span class="item-comm required">车辆型号：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.model" :placeholder="ismodify2?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">车身颜色：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.color" :placeholder="ismodify2?'请输入...':''"/>
                            <span class="item-comm required">车架号：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.frame" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">国产或进口：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.source" :placeholder="ismodify2?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">发动机号：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.enginerNumber" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm">发动机型号：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.enginerModel" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm">燃油种类：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.oilType" :placeholder="ismodify2?'请输入...':''" />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">排量/功率(ml/kw)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.work" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm">制造工厂：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.madeFactory" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm">转向形式：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.turnType" :placeholder="ismodify2?'请输入...':''" />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm">轮距(mm)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.wheelDistance" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm">轮胎数(胎)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.wheelCount" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm">轮胎规格(mm)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.wheelNormal" :placeholder="ismodify3?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm">钢板弹簧片数(片)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.steelCount" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm">轴距(mm)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.wheelbase" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm">轴数(轴)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.axesCount" :placeholder="ismodify2?'请输入...':''" />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm">外廊尺寸(mm)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.verandaSize" :placeholder="ismodify2?'请输入...':''" /> 
                            <span class="item-comm">货厢内部尺寸(mm)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.innerSize" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm">总质量(kg)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.totalWeight" :placeholder="ismodify2?'请输入...':''" />
                        </div>  
                        <div class="item-div">
                            <span class="item-comm">核定载重量(kg)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.approvedLoad" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm">核定载客(人)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.customer" :placeholder="ismodify2?'请输入...':''"/>
                            <span class="item-comm">准牵引总质量(kg)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.tractionWeight" :placeholder="ismodify2?'请输入...':''" />
                        </div>  
                        <div class="item-div">
                            <span class="item-comm">驾驶室载客(人)：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.driverCustomer" :placeholder="ismodify2?'请输入...':''"/>
                            <span class="item-comm">使用性质：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.useNature" :placeholder="ismodify2?'请输入...':''"/>
                            <span class="item-comm">车辆获得方式：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.getWay" :placeholder="ismodify2?'请输入...':''"/>
                        </div>  
                        <div class="item-div">
                            <span class="item-comm">车辆出厂日期：</span><DatePicker v-if="ismodify2" v-model="modify2.outDate" type="date" placeholder="选择出厂日期" class="item-input"></DatePicker>
                            <Input class="item-input txt" v-if="!ismodify2" readonly :value="modify2.outDate"/>
                            <span class="item-comm">签发机关：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.issueGov" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm">发证日期：</span><DatePicker v-if="ismodify2" v-model="modify2.issueDate" type="date" placeholder="选择发证日期" class="item-input"></DatePicker>
                            <Input class="item-input txt" v-if="!ismodify2" readonly :value="modify2.issueDate"/>
                        </div> 
                        <div class="item-div">
                             <span class="item-comm required">证书编号：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.certificateNumber" :placeholder="ismodify2?'请输入...':''"/>
                        </div>  
                        <!-- 登记摘要信息栏  -->
                        <div class="title-info" style="position:relative;"><span style="vertical-align:middle;">登记摘要信息栏(必填) </span><Icon type="md-add-circle"  v-if="ismodify3" @click="addItem" size="18" style="cursor:pointer;position:absolute;left:140px;top:3px;" title="新增"/><Button type="primary" v-if="name=='WaitStoreList'" style="margin-left:31px;" size="small" :ghost="!ismodify3" @click="modify3Btn">{{ismodify3?'保存':'修改'}}</Button></div>
                        <span v-for="(item,index) in carRegisterRecords" :key="index">
                            <div class="item-div">
                                <span class="item-comm required">拥有者：</span><Input class="item-input" :class="{txt:!ismodify3}" :readonly='!ismodify3' v-model="item.owner" :placeholder="ismodify3?'请输入...':''" />
                                <span style="position:relative">
                                    <span class="item-comm required">登记机关：</span><Input class="item-input" :class="{txt:!ismodify3}" :readonly='!ismodify3' v-model="item.registerGov" :placeholder="ismodify3?'请输入...':''" />
                                    <Icon type="ios-close-circle" @click="deleteItem(index)" size="16" v-if="ismodify3" style="position:absolute;right:-25px;top:-8px;cursor:pointer;" title="删除"/>
                                </span>
                            </div>    
                            <div class="item-div">
                                <span class="item-comm required">登记日期：</span><DatePicker v-if="ismodify3" v-model="item.registerDate" type="date" placeholder="选择登记日期" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify3" readonly :value="item.registerDate"/>
                                <span class="item-comm required">登记编号：</span><Input class="item-input" :class="{txt:!ismodify3}" :readonly='!ismodify3' v-model="item.registerNumber" :placeholder="ismodify3?'请输入...':''" />
                            </div>  
                        </span>  
                        <!-- 车辆报告  -->
                        <div class="title-info">车辆报告 <Button type="primary" style="margin-left:110px;" v-if="name=='WaitStoreList' || name=='WaitConfirmList'" :ghost="!ismodify4" size="small" @click="modify4Btn">{{ismodify4?'保存':'修改'}}</Button></div>
                        <div class="item-div">
                            <span class="item-comm required">车牌号：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.plateNumber" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">登记证编号：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.registerNumber" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">车主姓名：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.name" :placeholder="ismodify4?'请输入...':''"  />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">身份证号：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.identityCard" :placeholder="ismodify4?'请输入...':''"  />
                            <span class="item-comm required">发动机号：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.enginner" :placeholder="ismodify4?'请输入...':''"  />
                            <span class="item-comm required">车架号：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.frame" :placeholder="ismodify4?'请输入...':''"  />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">车辆型号：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.model" :placeholder="ismodify4?'请输入...':''"  />
                            <span class="item-comm required">登记日期：</span><DatePicker v-if="ismodify4" v-model="modify4.registerDate" type="date" placeholder="选择登记日期" class="item-input"></DatePicker>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.registerDate"/>
                            <span class="item-comm required">行驶里程(万)：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.mile" :placeholder="ismodify4?'请输入...':''"  />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">车身颜色：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.color" :placeholder="ismodify4?'请输入...':''"  />
                            <span class="item-comm required">来源：</span><Select v-if="ismodify4" v-model="modify4.source" class="item-input">
                                    <Option value="1">国产</Option>
                                    <Option value="2">进口</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.source=='1'?'国产':modify4.source=='2'?'进口':''"/>
                            <span class="item-comm required">有无年检：</span><Select v-if="ismodify4" v-model="modify4.hasInspect" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.hasInspect=='0'?'无':modify4.hasInspect=='1'?'有':''"/>
                        </div> 
                        <div class="item-div">
                            <span v-show="modify4.hasInspect=='1'">
                                <span class="item-comm required">有效期结束时间：</span><DatePicker v-if="ismodify4" v-model="modify4.insEndDate" type="date" placeholder="选择年检结束时间" class="item-input"></DatePicker>
                                <Input v-show="modify4.hasInspect=='1'" class="item-input txt" v-if="!ismodify4" readonly :value="modify4.insEndDate"/>
                            </span>
                            <span class="item-comm required">有无交强险：</span><Select v-if="ismodify4" v-model="modify4.hasHighInsurance" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.hasHighInsurance=='0'?'无':modify4.hasHighInsurance=='1'?'有':''"/>
                            <span v-show="modify4.hasHighInsurance=='1'">
                                <span class="item-comm required">有效期开始时间：</span><DatePicker v-if="ismodify4" v-model="modify4.highStartDate" type="date" placeholder="选择交强险开始时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.highStartDate"/>
                            </span>
                        </div> 
                        <div class="item-div">
                            <span v-show="modify4.hasHighInsurance=='1'">
                                <span class="item-comm required">有效期结束时间：</span><DatePicker v-if="ismodify4" v-model="modify4.highEndDate" type="date" placeholder="选择交强险结束时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.highEndDate"/>
                            </span>    
                            <span class="item-comm required">有无商业险：</span><Select v-if="ismodify4" v-model="modify4.hasBusyInsurance" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select>
                            <span v-show="modify4.hasBusyInsurance=='1'">    
                                <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.hasBusyInsurance=='0'?'无':modify4.hasBusyInsurance=='1'?'有':''"/>
                                <span class="item-comm required">有效期开始时间：</span><DatePicker v-if="ismodify4" v-model="modify4.busyStartDate" type="date" placeholder="选择商业险开始时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.busyStartDate"/>
                            </span> 
                        </div> 
                        <div class="item-div">
                            <span v-show="modify4.hasBusyInsurance=='1'">   
                                <span class="item-comm required">有效期结束时间：</span><DatePicker v-if="ismodify4" v-model="modify4.busyEndDate" type="date" placeholder="选择商业险结束时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.busyEndDate"/>
                            </span> 
                            <span class="item-comm required">使用性质：</span><Select v-if="ismodify4" v-model="modify4.useNature" class="item-input">
                                    <Option value="1">营运用车</Option>
                                    <Option value="2">出租车</Option>
                                    <Option value="3">公务用车</Option>
                                    <Option value="4">家庭用车</Option>
                                    <Option value="5">其它</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.useNature=='1'?'营运用车':modify4.useNature=='2'?'出租车':modify4.useNature=='3'?'公务用车':modify4.useNature=='4'?'家庭用车':modify4.useNature=='5'?'其它':''"/>
                            <span class="item-comm required">燃料编号：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.fuelNumber" :placeholder="ismodify4?'请输入...':''"/>
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">排量(ml)：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.displace" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">缸数(缸)：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.cylinder" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">发动机功率(kw)：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.power" :placeholder="ismodify4?'请输入...':''" />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">排放标准：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.emissStand" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">变速器形式：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.transmission" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">驱动方式：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.driveModel" :placeholder="ismodify4?'请输入...':''" />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">是否有abs：</span><Select v-if="ismodify4" v-model="modify4.hasAbs" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.hasAbs=='0'?'否':modify4.hasAbs=='1'?'是':''"/>
                            <span class="item-comm required">其他重要配置：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.otherImpConfig" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">是否为事故车：</span><Select v-if="ismodify4" v-model="modify4.isAccident" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.isAccident=='0'?'否':modify4.isAccident=='1'?'是':''"/>
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">扣分：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.deduction" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">罚款：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.fine" :placeholder="ismodify4?'请输入...':''"/>
                            <span class="item-comm required">损伤位置及状况：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.damage":placeholder="ismodify4?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">是否收押行驶证：</span><Select v-if="ismodify4" v-model="modify4.hasCustodyTraveler" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.hasCustodyTraveler=='0'?'否':modify4.hasCustodyTraveler=='1'?'是':''"/>
                            <span class="item-comm required">是否收押机动车登记证书：</span><Select v-if="ismodify4" v-model="modify4.hasCustodyRegister" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.hasCustodyRegister=='0'?'否':modify4.hasCustodyRegister=='1'?'是':''"/>
                            <span class="item-comm required">是否收押交强险保单：</span><Select v-if="ismodify4" v-model="modify4.hasCustodyHigh" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.hasCustodyHigh=='0'?'否':modify4.hasCustodyHigh=='1'?'是':''"/>
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">是否收押商业保险单：</span><Select v-if="ismodify4" v-model="modify4.hasCustodyBusy" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.hasCustodyBusy=='0'?'否':modify4.hasCustodyBusy=='1'?'是':''"/>
                            <span class="item-comm required">收押其它：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.custodyOther" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">验车人签字：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.examinerSign" :placeholder="ismodify4?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">验车日期：</span><DatePicker v-if="ismodify4" v-model="modify4.examinerDate" type="date" placeholder="选择验车日期" class="item-input"></DatePicker>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.examinerDate"/>
                            <span class="item-comm required">车主签字：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.ownerSign" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm">备注：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.remark" :placeholder="ismodify4?'请输入...':''" />
                        </div>
                        <!-- 车辆证件照片 -->
                        <div class="title-info">车辆证件照片</div>
                        <div v-if="name=='WaitStoreList'">
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[0]" :type="5" @changePicUrl="changePicUrl(arguments,'行驶证正面')">行驶证正面：</ImgUpload></span>  
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[1]" :type="5" @changePicUrl="changePicUrl($event,'行驶证反面')">行驶证反面：</ImgUpload></span>  
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[2]" :type="5" @changePicUrl="changePicUrl(arguments,'驾驶证正面')">驾驶证正面：</ImgUpload></span>  
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[3]" :type="5" @changePicUrl="changePicUrl($event,'驾驶证反面')">驾驶证反面：</ImgUpload></span>      
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[4]" :type="5" @changePicUrl="changePicUrl($event,'绿本第1页')">绿本第1页：</ImgUpload></span>   
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[5]" :type="5" @changePicUrl="changePicUrl($event,'绿本第2页')">绿本第2页：</ImgUpload></span>   
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[6]" :type="5" @changePicUrl="changePicUrl($event,'绿本第3页')">绿本第3页：</ImgUpload></span>   
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[7]" :type="5" @changePicUrl="changePicUrl($event,'绿本第4页')">绿本第4页：</ImgUpload></span> 
                            <Button type="primary"  size="small" @click="modify5Btn">保存</Button>    
                        </div>
                        <div v-if="name!='WaitStoreList'">
                            <span class="span-width">
                                <span class="my-title-comm">行驶证正面：</span>
                                <!-- <img class="my-img" :src="modify5Img[0]" alt="行驶证正面" @click="clickFaceImg(modify5Img[0])"> -->
                                <viewer :images="modify5Img[0]?modify5Img[0].split(' '):[]"><img class="my-img" :src="modify5Img[0]" alt="行驶证正面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">行驶证反面：</span>
                                    <!-- <img class="my-img" :src="modify5Img[1]" alt="行驶证反面" @click="clickFaceImg(modify5Img[1])"> -->
                                <viewer :images="modify5Img[1]?modify5Img[1].split(' '):[]"><img class="my-img" :src="modify5Img[1]" alt="行驶证反面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">驾驶证正面：</span>
                                <!-- <img class="my-img" :src="modify5Img[0]" alt="行驶证正面" @click="clickFaceImg(modify5Img[0])"> -->
                                <viewer :images="modify5Img[2]?modify5Img[2].split(' '):[]"><img class="my-img" :src="modify5Img[2]" alt="驾驶证正面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">驾驶证反面：</span>
                                    <!-- <img class="my-img" :src="modify5Img[1]" alt="行驶证反面" @click="clickFaceImg(modify5Img[1])"> -->
                                <viewer :images="modify5Img[3]?modify5Img[3].split(' '):[]"><img class="my-img" :src="modify5Img[3]" alt="驾驶证反面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第1页：</span>
                                <!-- <img class="my-img" :src="modify5Img[2]" alt="绿本第1页" @click="clickFaceImg(modify5Img[2])"> -->
                                <viewer :images="modify5Img[4]?modify5Img[4].split(' '):[]"><img class="my-img" :src="modify5Img[4]" alt="绿本第1页">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第2页：</span>
                                    <!-- <img class="my-img" :src="modify5Img[3]" alt="绿本第2页" @click="clickFaceImg(modify5Img[3])"> -->
                                    <viewer :images="modify5Img[5]?modify5Img[5].split(' '):[]"><img class="my-img" :src="modify5Img[5]" alt="绿本第2页">
                                </viewer>
                                </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第3页：</span>
                                <!-- <img class="my-img" :src="modify5Img[4]" alt="绿本第3页" @click="clickFaceImg(modify5Img[4])"> -->
                                <viewer :images="modify5Img[6]?modify5Img[6].split(' '):[]"><img class="my-img" :src="modify5Img[6]" alt="绿本第3页">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第4页：</span>
                                <!-- <img class="my-img" :src="modify5Img[5]" alt="绿本第4页" @click="clickFaceImg(modify5Img[5])"> -->
                                <viewer :images="modify5Img[7]?modify5Img[7].split(' '):[]"><img class="my-img" :src="modify5Img[7]" alt="绿本第4页">
                                </viewer>
                            </span> 
                        </div>     
                        <div class="title-info">车辆照片</div>
                        <div v-if="name=='WaitStoreList'">
                            <span class="span-width1"><ImgUpload :type="5" :myUploadList="carPicsmyUploadList" :myUploadList2="carPicsmyUploadList2" :txt="'多选'" @changePicUrl="changePicUrl2">车辆照片：</ImgUpload></span>  
                            <Button type="primary"  size="small" @click="modify6Btn">保存</Button>  
                        </div>
                        <div v-if="name!='WaitStoreList'">
                            <!--  <img :src="img" alt="车辆照片" class="my-img" style="margin:0 15px;" v-for="img in carPicsmyUploadList" :key="Math.random()" @click="clickFaceImg(img)"> -->
                            <viewer :images="carPicsmyUploadList"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in carPicsmyUploadList" :src="src" :key="index" alt="车辆照片">
                                </viewer>
                        </div>
                        <div class="title-info">车辆保单</div>
                        <div v-if="name=='WaitStoreList'">
                            <span class="span-width1"><ImgUpload :txt="'多选'" :myUploadList="insurancePicsmyUploadList" :myUploadList2="insurancePicsmyUploadList2" :type="5" @changePicUrl="changePicUrl3">车辆保单:</ImgUpload></span>  
                            <Button type="primary" size="small" @click="modify7Btn">保存</Button> 
                        </div>
                        <div v-if="name!='WaitStoreList'">
                            <!-- <img :src="img" alt="车辆保单" class="my-img" style="margin:0 15px;" v-for="img in insurancePicsmyUploadList" :key="Math.random()" @click="clickFaceImg(img)"> -->
                             <viewer :images="insurancePicsmyUploadList"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in insurancePicsmyUploadList" :src="src" :key="index" alt="车辆保单">
                                </viewer>
                        </div>
                    </div>
                </TabPane>
                <TabPane label="认证信息" name="name3">
                    <div :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}">
                        <div class="title-info">违章照片</div>
                        <div v-if="name=='WaitStoreList'">
                            <span class="span-width1"><ImgUpload class="imgUpload" :type="5" :txt="'多选'" :myUploadList="myimgs8" :myUploadList2="myimgs88" @changePicUrl="changePicUrl8"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('违章照片')">保存</Button></span>   
                        </div>
                        <div v-if="name!='WaitStoreList'">
                            <viewer :images="myimgs8"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in myimgs8" :src="src" :key="index" alt="违章照片"></viewer>
                            <!-- <img :src="img" alt="违章照片" class="my-img" style="margin:0 15px;" v-for="img in myimgs8" :key="Math.random()" @click="clickFaceImg(img)">   -->
                        </div>
                        <div class="title-info">驾照验证图片</div>
                        <div v-if="name=='WaitStoreList'">
                            <span class="span-width"><ImgUpload :type="5" class="imgUpload display-before" :myPicUrl="myimgs9" @changePicUrl="changePicUrl9"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('驾照验证图片')">保存</Button></span>   
                        </div>
                        <div v-if="name!='WaitStoreList'">
                            <viewer :images="myimgs9?myimgs9.split(' '):[]"><img class="my-img" style="margin:0 15px;" :src="myimgs9" alt="驾照验证图片"></viewer>
                            <!-- <img :src="myimgs9" alt="驾照验证图片" class="my-img" style="margin:0 15px;" @click="clickFaceImg(myimgs9)">   -->
                        </div>
                        <div class="title-info">快易估评估照片</div>
                        <div v-if="name=='WaitStoreList'">
                            <span class="span-width1"><ImgUpload :type="5" class="imgUpload" :txt="'多选'" :myUploadList="myimgs10" :myUploadList2="myimgs110" @changePicUrl="changePicUrl10" ></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('快易估评估照片')">保存</Button></span>   
                        </div>
                        <div v-if="name!='WaitStoreList'">
                            <viewer :images="myimgs10"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in myimgs10" :src="src" :key="index" alt="快易估评估照片"></viewer>
                            <!-- <img :src="img" alt="快易估评估照片" class="my-img" style="margin:0 15px;" v-for="img in myimgs10" :key="Math.random()" @click="clickFaceImg(img)">    -->
                        </div>
                        <div class="title-info">车型评估反馈照片</div>
                        <div v-if="name=='WaitStoreList'">
                            <span class="span-width"><ImgUpload :type="5" class="imgUpload display-before" :myPicUrl="myimgs16" @changePicUrl="changePicUrl16"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('车型评估反馈照片')">保存</Button></span>   
                        </div>
                        <div v-if="name!='WaitStoreList'">
                            <!-- <img :src="myimgs16" alt="车型评估反馈照片" class="my-img" style="margin:0 15px;" @click="clickFaceImg(myimgs16)"> -->
                            <viewer :images="myimgs16?myimgs16.split(' '):[]"><img class="my-img" style="margin:0 15px;" :src="myimgs16" alt="车型评估反馈照片"></viewer>  
                        </div>
                        <div class="title-info">人保预审截图</div>
                        <div v-if="name=='WaitStoreList'">
                            <span class="span-width1"><ImgUpload :type="5" class="imgUpload" :txt="'多选'" :myUploadList="myimgs11" :myUploadList2="myimgs111" @changePicUrl="changePicUrl11"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('人保预审截图')">保存</Button></span>   
                        </div>
                        <div v-if="name!='WaitStoreList'">
                            <viewer :images="myimgs11"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in myimgs11" :src="src" :key="index" alt="人保预审截图"></viewer>
                            <!-- <img :src="img" alt="人保预审截图" class="my-img" style="margin:0 15px;" v-for="img in myimgs11" :key="Math.random()" @click="clickFaceImg(img)">    -->
                        </div>
                        <div class="title-info">人法、失信截图</div>
                        <div v-if="name=='WaitStoreList'">
                            <span class="span-width"><ImgUpload class="imgUpload" :type="5" :myPicUrl="myimgs121" @changePicUrl="changePicUrl12(arguments,'人法截图')">人法截图：</ImgUpload></span>
                            <Button type="primary" size="small" @click="modifyCommonBtn('人法截图')">保存</Button>     
                            <span class="span-width"><ImgUpload class="imgUpload" :type="5" :myPicUrl="myimgs122"  @changePicUrl="changePicUrl12(arguments,'失信截图')">失信截图：</ImgUpload></span>
                            <Button type="primary" size="small" @click="modifyCommonBtn('失信截图')">保存</Button>   
                        </div>
                        <div v-if="name!='WaitStoreList'">
                            <!-- <img :src="myimgs121" alt="人法截图" class="my-img" style="margin:0 15px;" @click="clickFaceImg(myimgs121)">  
                            <img :src="myimgs122" alt="失信截图" class="my-img" style="margin:0 15px;" @click="clickFaceImg(myimgs122)">  --> 
                            <viewer :images="imgsbox"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in imgsbox" :src="src" :key="index" alt="人法截图"></viewer>
                        </div>
                        <div class="title-info">银行卡复印件</div>
                        <div v-if="name=='WaitStoreList'">
                            <span class="span-width1"><ImgUpload class="imgUpload" :myUploadList="myimgs13" :myUploadList2="myimgs133" :txt="'多选'" :type="5" @changePicUrl="changePicUrl13"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('银行卡复印件')">保存</Button></span>   
                        </div>
                        <div v-if="name!='WaitStoreList'">
                            <!-- <img :src="img" alt="银行卡复印件" class="my-img" style="margin:0 15px;" v-for="img in myimgs13" :key="Math.random()" @click="clickFaceImg(img)">  -->
                            <viewer :images="myimgs13"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in myimgs13" :src="src" :key="index" alt="银行卡复印件"></viewer>
                        </div>
                        <div class="title-info">人保征信授权书</div>
                        <div v-if="name=='WaitStoreList'">
                            <span class="span-width1"><ImgUpload :txt="'多选'" :myUploadList="myimgs14" :myUploadList2="myimgs144" class="imgUpload" :type="5" @changePicUrl="changePicUrl14"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('人保征信授权书')">保存</Button></span>
                        </div>
                        <div v-if="name!='WaitStoreList'">
                            <!-- <img :src="img" alt="人保征信授权书" class="my-img" style="margin:0 15px;" v-for="img in myimgs14" :key="Math.random()" @click="clickFaceImg(img)">  -->
                            <viewer :images="myimgs14"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in myimgs14" :src="src" :key="index" alt="人保征信授权书"></viewer>
                        </div>
                        <div class="title-info" style="margin:18px 0 2;">补充材料</div>
                        <span class="span-width1" v-if="name=='WaitStoreList'"><ImgUpload :type="5" class="imgUpload"  :myUploadList="myimgs15" :myUploadList2="myimgs155" :txt="'多选'" @changePicUrl="changePicUrl15"></ImgUpload><Button class="btn-margin"  style="margin-top:12px;margin-bottom:12px;" type="primary" size="small" @click="modifyCommonBtn('补充材料')">保存</Button>  </span>
                        <span v-if="name!='WaitStoreList'">
                            <!-- <img :src="img" alt="补充材料" class="my-img" style="margin:0 15px;" v-for="img in myimgs15" :key="Math.random()" @click="clickFaceImg(img)"> -->
                            <viewer :images="myimgs15"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in myimgs15" :src="src" :key="index" alt="补充材料"></viewer>
                        </span>
                    </div>
                </TabPane>
                <TabPane label="合同信息" name="name4">
                    <div :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}" v-if="$route.query.name2=='SignContract'">
                        <Button v-if="contractList.length?true:false" class="btn-margin" style="margin-left:0" type="primary" size="small" :loading="carImgloading2" @click="downLoadContract">批量合同下载</Button><Button class="btn-margin" :loading="carImgloading3" type="primary" size="small" v-if="contractList.length?true:false" @click="previewContract">查看电签合同</Button><Button class="btn-margin" :loading="carImgloading5" type="primary" size="small" v-if="$route.query.name2=='SignContract'" @click="downContract">合同生成</Button>
                        <template v-for="item in contractList">
                        <div class="title-info" :class="item.isRequired?'required':''">{{item.contractItemName}}<Button class="btn-margin" type="dashed" size="small" @click="preview(item.pdfUrl)">预览合同</Button><Button class="btn-margin" type="dashed" size="small" @click="previewDown(item.contractId)">打印合同</Button></div>
                        <div>
                            <span class="span-width1"><ImgUpload class="imgUpload" :type="6" :txt="'多选'" :myUploadList="formatImg(item.imgs,'绝对')" :myUploadList2="formatImg(item.imgs,'相对')" @changePicUrl="changePicUrl300"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyContractBtn(item.contractId)">保存</Button></span>   
                        </div>
                        </template>
                    </div>
                    <div :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}" v-if="$route.query.name2!='SignContract'">
                        <Button v-if="contractList.length?true:false" class="btn-margin" type="primary" size="small" style="margin-left:0" :loading="carImgloading2" @click="downLoadContract">批量合同下载</Button><Button class="btn-margin" :loading="carImgloading3" type="primary" size="small" v-if="contractList.length?true:false" @click="previewContract">查看电签合同</Button><Button v-if="!contractFlowId && $route.query.name2=='WaitCheckAgain'" class="btn-margin" type="primary" size="small" @click="applySeal">申请电签</Button><Button v-if="contractFlowId && $route.query.name2=='WaitCheckAgain'" class="btn-margin" type="primary" size="small" @click="sealDetail">电签详情</Button>   
                        <template v-for="item in contractList">
                        <div class="title-info" :class="item.isRequired?'required':''">{{item.contractItemName}}<Button class="btn-margin" type="dashed" size="small" @click="preview(item.pdfUrl)">预览合同</Button></div>
                        <div>
                            <span>
                                <!-- <img :src="img.aurl" alt="合同信息" class="my-img" style="margin:0 15px;" v-for="img in item.imgs" :key="Math.random()" @click="clickFaceImg(img.aurl)"> -->
                                <viewer :images="item.imgsArr"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in item.imgsArr" :src="src" :key="index" alt="合同信息"></viewer>
                            </span>
                        </div>
                        </template>
                    </div>
                </TabPane>
                <TabPane label="设备管理" name="name5">
                    <div :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}">
                        <Button type="primary" size="small" @click="addDevice" v-if="$route.query.name2=='GPSInstall'">新增订单设备</Button>
                        <template v-for="item in deviceList">
                        <div class="deviceInfo">
                            <span style="min-width:150px;">设备编号：{{item.deviceNum}}</span>
                            <span style="min-width:80px;">位置：{{item.position}}</span>
                            <span style="min-width:80px;">设备类型：{{item.type==1?'有线GPS':'无线GPS'}}</span>
                            <span class="imgs-imgsArr">
                                <!-- 图片：<img style="width:50px;height:50px;vertical-align:middle;margin:0 5px;cursor:pointer;" v-for="(ele,index) in item.imgs" :src="ele.aurl" :key="Math.random()" alt="图片" @click="clickFaceImg(ele.aurl)"> -->
                                图片：<viewer :images="item.imgsArr"><img class="my-img" style="margin:0 15px;" v-for="(ele,index) in item.imgsArr" :src="ele" :key="index" alt="图片"></viewer>
                            </span>
                            <!-- 安装员:{{item.installStaff}}
                            检查员:{{item.checkStaff}}
                            状态:{{item.status==1?'有效':'无效'}}
                            创建时间:{{item.createTime}}
                            修改时间:{{item.modifyTime}} -->
                            <Button class="btn-margin" type="dashed" size="small" v-if="$route.query.name2=='WaitStoreList'" @click="modifyDevice(item.id,item.deviceNum)">修改</Button>
                            <Button class="btn-margin" type="dashed" size="small" v-if="$route.query.name2=='GPSInstall'" @click="modifyPosition(item.id,item.imgs,item.position)">添加/修改位置</Button>
                        </div>   
                        </template>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <Modal width="400" v-model="modifyModal" :title="myTitle" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">
                    <span class="item-comm required">设备编号：</span><Input class="item-input" v-model="modify6.deviceNum" placeholder="请输入..." />
                    
                </div>
                <div class="item-div">
                    <span class="item-comm required">设备类型：</span><Select v-model="modify6.type" class="item-input">
                        <Option :value="1">有线GPS</Option>
                        <Option :value="2">无线GPS</Option>
                    </Select>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="deviceConfirmBtn">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <Modal width="350" v-model="modifyModal2" :title="myTitle2" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">
                    <span class="item-comm required" style="width:60px;">位置：</span><Input class="item-input" v-model="modify8.position" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required" style="width:60px;">图片：</span><ImgUpload class="position-img" :type="5" :myUploadList="modify8myUploadList" :myUploadList2="modify8myUploadList2" :txt="'多选'" @changePicUrl="modify8ChangePicUrl"></ImgUpload>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="modify8ConfirmBtn">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <Modal width="350" v-model="applySealModal" title="申请电签" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">
                    <span class="item-comm required" style="width:80px;">使用场景：</span><Input class="item-input" v-model="applySealModify.scene" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required" style="width:80px;">公司签名：</span><Input class="item-input" v-model="applySealModify.firstPartKey" placeholder="请输入..." />
                </div>
                <div class="item-div">
                    <span class="item-comm required" style="width:80px;">客户签名：</span><Input class="item-input" v-model="applySealModify.secondPartKey" placeholder="请输入..." />
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="applySealConfirm">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <Modal width="440" v-model="applySealDetModal" title="电签详情" :mask-closable="false"> 
            <div class="modify-modal"> 
                <div class="item-div">状态：{{sealDetailObj.status}}</div>
                <div class="item-div">电签时间：{{sealDetailObj.startTime}}</div>
                <div class="item-div">合同名称：{{sealDetailObj.docName}}</div> 
                <div class="item-div"><Button type="primary" @click="toUrl(sealDetailObj.signUrl)" style="margin-right:8px;">跳转到电签地址</Button><Button type="primary" @click="archive(sealDetailObj.flowId)" style="margin-right:8px;" v-if="$route.query.name2=='WaitCheckAgain'">电签归档</Button><Button type="primary" style="margin-right:8px;" @click="revoke(sealDetailObj.flowId)">电签撤回</Button><Button type="primary" @click="downloadSeal(sealDetailObj.flowId)">下载电签</Button></div>
                <div class="listadmin">
                    <Table border :columns="columns" :data="signDetail"></Table>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" :loading="modal_loading" @click="applySealDetConfirm">确定</Button>
                <Button @click="cancel">取消</Button>
            </div> 
        </Modal>
        <CommonTipModal :modal="tipModal" @cancel="cancel1" :modalTipTitle="modalTipTitle" @comfirmBtn="tipComfirmBtn" :item="item">
            <div style="text-align:center">
                <p>确定{{modalTipTitle}}吗?</p>
            </div>
        </CommonTipModal>
        <ModalPic :modal="modalPreview" :bigimg="bigimg" @cancel="cancel"></ModalPic>  
    </div>
</template>
<script>
import util from '@/util/util'
import ImgUpload from '@/components/ImgUpload' //公用的提示组件 
import CommonTipModal from '@/components/CommonTipModal'    
import ModalPic from '@/components/ModalPic'    
import ChinaArea2 from '@/components/ChinaArea2' //公用的提示组件 
import moment from 'moment'
import { mapState } from 'vuex'
export default {
    name: 'WaitStoreDetail',
    data () {
        return {
            myUrl:process.env.NODE_ENV=='production'?'https://aps.zdautoservice.com':'http://192.168.31.14:8093',
            mat:'',
            myTitle:'新增订单设备',
            myTitle2:'添加/修改订单设备',
            item:{},
            periodDateTemporary:'',
            contractFlowId:'',
            carImgloading1:false,
            carImgloading2:false,
            carImgloading3:false,
            carImgloading4:false,
            carImgloading5:false,
            modalTipTitle:'电签归档',
            tipModal:false,
            applySealModal:false,
            applySealDetModal:false,
            sealDetailObj:{},
            signDetail:[],
            modifyModal:false,
            modifyModal2:false,
            modal_loading:false,
            activedName:'',
            name: '',   //保存从哪个页面跳转进来的路由name值
            bigimg:'',
            id:'',
            checkedState:false,
            deviceId:'', //设备ID
            ismodify1:false,  //true 为修改模式
            ismodify2:false,  //true 为修改模式
            ismodify3:false,  //true 为修改模式
            ismodify4:false,  //true 为修改模式
            carPicsmyUploadList:[],  //绝对地址
            carPicsmyUploadList2:[], //相对地址
            insurancePicsmyUploadList:[],
            insurancePicsmyUploadList2:[],
            modify8myUploadList:[],  
            modify8myUploadList2:[],  
            contractList:[],
            deviceList:[],
            identityInfo:[],  //基础信息集合
            columns: [{
                    title: '电签姓名',
                    key: 'accountName',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.accountName)
                        ]);
                    }
                },  {
                    title: '电签时间',
                    key: 'signTime',
                    minWidth: 160,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.signTime)
                        ]);
                    }
                }, {
                    title: '电签状态',
                    key: 'signStatus',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.signStatus)
                        ]);
                    }
                }
            ],
            applySealModify:{
                scene:'',
                firstPartKey:'',
                secondPartKey:''
            },
            modify1: {  //行驶证信息
                orderId:this.$route.query.orderId,
                autoRepositoryId: '',
                plateNumber: '',
                carType: '',
                travelerOwner: '',
                address: '',
                nature: '',
                travelerModel: '',
                vin: '',
                enginner: '',
                travelerRegisterDate: '',
                giveDate: '',
                archivesNumber: '',
                passenger: '',
                weightTotal: '',
                weightWhole: '',
                size: '',
                remark: '',
                record: ''
            },
            modify2: {   //绿本
                orderId:this.$route.query.orderId,
                autoRepositoryId:'',
                type: '',
                brand: '',
                model: '',
                color: '',
                frame: '',
                source: '',
                enginerNumber: '',
                enginerModel: '',
                oilType: '',
                work: '',
                madeFactory: '',
                turnType: '',
                wheelDistance: '',
                wheelCount: '',
                wheelNormal: '',
                steelCount: '',
                wheelbase: '',
                axesCount: '',
                verandaSize: '',
                innerSize: '',
                totalWeight: '',
                approvedLoad: '',
                customer: '',
                tractionWeight: '',
                driverCustomer: '',
                useNature: '',
                getWay: '',
                outDate: '',
                issueGov: '',
                issueDate: '',
                certificateNumber:''
            },
            modify4: {     //车辆报告
                orderId:this.$route.query.orderId,
                autoRepositoryId:'',
                plateNumber: '',
                registerNumber: '',
                name: '',
                identityCard: '',
                enginner: '',
                frame: '',
                model: '',
                registerDate: '',
                mile: '',
                color: '',
                source: '',
                hasInspect: '',
                insEndDate: '',
                hasHighInsurance: '',
                highStartDate: '',
                highEndDate: '',
                hasBusyInsurance: '',
                busyStartDate: '',
                busyEndDate: '',
                useNature: '',
                fuelNumber: '',
                displace: '',
                cylinder: '',
                power: '',
                emissStand: '',
                transmission: '',
                driveModel: '',
                hasAbs: '',
                otherImpConfig:'',
                isAccident: '',
                deduction:'',
                fine: '',
                damage: '',
                hasCustodyTraveler: '',
                hasCustodyRegister: '',
                hasCustodyHigh: '',
                hasCustodyBusy: '',
                custodyOther: '',
                examinerSign: '',
                examinerDate: '',
                ownerSign: '',
                remark: ''
            },
            modify5: {
                orderId:this.$route.query.orderId,
                autoRepositoryId:'',
                mainTravel: '', //行驶证正面
                viceTravel: '',  //行驶证反面
                register1: '',  //绿本第1页
                register2: '', //绿本第2页
                register3: '', //绿本第3页
                register4: '', //绿本第4页
                travelerFront: '', //驾驶证主页
                travelerBack: '' //驾驶证副页
            },
            modify6: {
                deviceNum:'',
                type: 1
            },
            modify8:{
               position:'',
               imgs :''
            },
            modify5Img:[], //保存对应的绝对地址
            carPics:'',        //车辆图片
            insurancePics:'',  //车辆保险
            certifyList:{},    //客户信息集合
            certifyListCar:{}, //车辆信息集合
            ismodifyInfo:false, //true 为修改模式
            isUpdate: null,
            modifyInfo: {
                bankMobile: '',
                bankName: '',
                cardNumber: '',
                baseSalary: '',
                houseProperty: '',
                otherProperty: '',
                otherSalary: '',
                ownHouse: '',
                companyMobile: '',
                companyProvice: '',
                companyCity: '',
                companyArea: '',
                companyUpdateAddress: '',
                companyAddress: '',
                companyName: '',
                companyType: '',
                dept: '',
                level: '',
                nature: '',
                startWorkTime: '',
                educate: '',
                hasChild: '',
                localMobile: '',
                startLiveDate: '',
                supportRelate: '',
                nowProvice: '',
                nowCity: '',
                nowArea: '',
                nowUpdateAddress: '',
                nowAddress: '',
                email: '',
                name: '',
                source: '',
                houseAddress: '',
                identityCard: '',
                periodDate: '',
                marry: '',
                creditQuota: '',
                isTempcer: '',
                firstCome: '',
                signDate: '',
            },
            infoContent: {
                province: '',
                city: '',
                area: ''
            },
            ismodifyContact:[false,false,false], //true 为修改模式
            contacts:[],       //客户信息联系信息集合
            modalPreview:false,
            activeName:'',
            imgs1:[], //车辆照片
            imgs2:[], //车辆保单
            imgs8:[],
            imgs9:[],
            imgs10:[],
            imgs11:[],
            imgs121:[],
            imgs122:[],
            imgs13:[],
            imgs14:[],
            imgs15:[],
            imgs16:[],
            myimgs8:[], //绝对地址
            myimgs88:[], //相对地址
            myimgs9:'',  //绝对地址
            myimgs10:[], //绝对地址
            myimgs110:[], //相对地址
            myimgs11:[], //绝对地址
            myimgs111:[], //相对地址
            myimgs121:'', //绝对地址
            myimgs122:'', //绝对地址
            myimgs13:[],  //相对地址
            myimgs133:[], //绝对地址
            myimgs14:[],
            myimgs144:[],
            myimgs15:[],
            myimgs155:[],
            myimgs16:'',
            myimgs300:[], //相对地址
            myimgs3000:[], //绝对地址
            carRegisterRecords:[],  //登记摘要信息栏集合
            imgsbox:[],  //人法、失信截图集合
        }
    },
    components:{
        ImgUpload,
        ModalPic,
        CommonTipModal,
        ChinaArea2
    }, 
    computed:{
        ...mapState(['adjustHeight']) 
    },
    activated(){
        this.mat = localStorage.getItem('mat');
        this.name = this.$route.query.name2;
        this.ismodify1 = false;  
        this.ismodify2 = false;  
        this.ismodify3 = false;  
        this.ismodify4 = false; 
        this.activedName = this.$route.query.activedName;
        this.getInitialPersonList({userId:this.$route.query.userId,orderId:this.$route.query.orderId});
        this.getInitialCarList({autoRepositoryId:this.$route.query.autoId});
        this.getFile({autoRepositoryId:this.$route.query.autoId});
        this.getDeviceList({orderId:this.$route.query.orderId});
        if(this.$route.query.name2!='WaitStoreList' && this.$route.query.name2!='WaitAuditingList' && this.$route.query.name2!='WaitConfirmList'){
            this.contractList = [];
            this.getContractList({orderId:this.$route.query.orderId});
        }
    },
    methods: {
        getInitialPersonList(formData){ 
            this.$axios.get('/fx?api=gate.order.admin.person.detail',{params:formData}).then(res => {
                if(res!=500){
                    this.certifyList = res;
                    let info = res;
                    this.isUpdate = info.isUpdate;
                    this.modifyInfo = {
                        bankMobile: info.bankMobile,
                        bankName: info.bankName,
                        cardNumber: info.cardNumber,
                        baseSalary: info.baseSalary,
                        houseProperty: info.houseProperty,
                        otherProperty: info.otherProperty,
                        otherSalary: info.otherSalary,
                        ownHouse: info.ownHouse,
                        companyMobile: info.companyMobile,
                        companyProvice: info.companyProvice,
                        companyCity: info.companyCity,
                        companyArea: info.companyArea,
                        companyUpdateAddress: info.companyUpdateAddress,
                        companyAddress: info.companyAddress,
                        companyName: info.companyName,
                        companyType: info.companyType,
                        dept: info.dept,
                        level: info.level,
                        nature: info.nature,
                        startWorkTime: info.startWorkTime,
                        educate: info.educate,
                        hasChild: info.hasChild,
                        localMobile: info.localMobile,
                        startLiveDate: info.startLiveDate,
                        supportRelate: info.supportRelate,
                        nowProvice: info.nowProvice,
                        nowCity: info.nowCity,
                        nowArea: info.nowArea,
                        nowUpdateAddress: info.nowUpdateAddress,
                        nowAddress: info.nowAddress,
                        email: info.email,
                        name: info.name,
                        source: info.source,
                        houseAddress: info.houseAddress,
                        identityCard: info.identityCard,
                        periodDate: info.periodDate,
                        marry: info.marry,
                        creditQuota: info.creditQuota,
                        isTempcer: info.isTempcer,
                        firstCome: info.firstCome,
                        signDate: info.signDate
                    };
                    if(this.modifyInfo.periodDate=='长期'){
                        this.periodDateTemporary = '';
                        this.checkedState = true;
                    }else{
                        this.periodDateTemporary = this.modifyInfo.periodDate;
                        this.checkedState = false;
                    }
                    this.contacts = res.contacts;
                    this.identityInfo = [res.identityFrontValue,res.identityBackValue,res.bankFrontValue,res.bankBackValue];  //基础材料集合
                    this.$store.commit('change_height');
                }
            })
        },
        getContractList(formData ){
            this.$axios.get('/fx?api=gate.order.admin.contractQuery',{params:formData}).then(res => {
                if(res!=500){
                    this.contractList = res.list;
                    this.contractFlowId = res.flowId;
                    this.contractList.forEach( (item,index)=>{
                        let imgsArr = [];
                        item.imgs.map( (ele, index) => {
                            imgsArr.push(ele.aurl);
                        });
                        item.imgsArr = imgsArr;
                        return item;
                    })
                    this.$store.commit('change_height');
                }
            })
        },
        getDeviceList(formData ){
            this.$axios.get('/fx?api=gate.order.device.query',{params:formData}).then(res => {
                if(res!=500){
                    this.deviceList = res;
                    this.deviceList.forEach( (item,index)=>{
                        let imgsArr = [];
                        item.imgs.map( (ele, index) => {
                            imgsArr.push(ele.aurl);
                        });
                        item.imgsArr = imgsArr;
                        return item;
                    })
                    this.$store.commit('change_height');
                }
            })
        }, 
        getInitialCarList(formData){
            this.$axios.get('/fx?api=gate.order.admin.car.detail',{params:formData}).then(res => {
                if(res!=500){
                    this.certifyListCar = res;
                    let {carTravelerDetailVO,autoRepositoryDetailVO,carRegisterDetailVO,carRegisterRecordDetailVOs,reportVO} = this.certifyListCar;
                    this.modify1 = {
                        orderId:this.$route.query.orderId,
                        autoRepositoryId: res.autoRepositoryId,
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
                    };
                    this.modify2 = {
                        orderId:this.$route.query.orderId,
                        autoRepositoryId:res.autoRepositoryId,
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
                        wheelbase: carRegisterDetailVO.wheelbase,
                        axesCount: carRegisterDetailVO.axesCount,
                        verandaSize: carRegisterDetailVO.verandaSize,
                        innerSize: carRegisterDetailVO.innerSize,
                        totalWeight: carRegisterDetailVO.totalWeight,
                        approvedLoad: carRegisterDetailVO.approvedLoad,
                        customer: carRegisterDetailVO.customer,
                        tractionWeight: carRegisterDetailVO.tractionWeight,
                        driverCustomer: carRegisterDetailVO.driverCustomer,
                        useNature: carRegisterDetailVO.useNature,
                        getWay: carRegisterDetailVO.getWay,
                        outDate: carRegisterDetailVO.outDate,
                        issueGov: carRegisterDetailVO.issueGov,
                        issueDate: carRegisterDetailVO.issueDate,
                        certificateNumber: carRegisterDetailVO.certificateNumber
                    };
                    this.modify4 = {
                        orderId:this.$route.query.orderId,
                        autoRepositoryId:res.autoRepositoryId,
                        plateNumber:reportVO.plateNumber,
                        registerNumber:reportVO.registerNumber,
                        name:reportVO.name,
                        identityCard:reportVO.identityCard,
                        enginner:reportVO.enginner,
                        frame:reportVO.frame,
                        model:reportVO.model,
                        registerDate:reportVO.registerDate,
                        mile:reportVO.mile,
                        color:reportVO.color,
                        source:reportVO.source,
                        hasInspect:reportVO.hasInspect,
                        insEndDate:reportVO.insEndDate,
                        hasHighInsurance:reportVO.hasHighInsurance,
                        highStartDate:reportVO.highStartDate,
                        highEndDate:reportVO.highEndDate,
                        hasBusyInsurance:reportVO.hasBusyInsurance,
                        busyStartDate:reportVO.busyStartDate,
                        busyEndDate:reportVO.busyEndDate,
                        useNature:reportVO.useNature,
                        fuelNumber:reportVO.fuelNumber,
                        displace:reportVO.displace,
                        cylinder:reportVO.cylinder,
                        power:reportVO.power,
                        emissStand:reportVO.emissStand,
                        transmission:reportVO.transmission,
                        driveModel:reportVO.driveModel,
                        hasAbs:reportVO.hasAbs,
                        otherImpConfig:reportVO.otherImpConfig,
                        isAccident:reportVO.isAccident,
                        deduction:reportVO.deduction,
                        fine: reportVO.fine,
                        damage: reportVO.damage,
                        hasCustodyTraveler: reportVO.hasCustodyTraveler,
                        hasCustodyRegister: reportVO.hasCustodyRegister,
                        hasCustodyHigh: reportVO.hasCustodyHigh,
                        hasCustodyBusy: reportVO.hasCustodyBusy,
                        custodyOther: reportVO.custodyOther,
                        examinerSign: reportVO.examinerSign,
                        examinerDate: reportVO.examinerDate,
                        ownerSign: reportVO.ownerSign,
                        remark: reportVO.remark
                    };
                    this.modify5 = {
                        orderId:this.$route.query.orderId,
                        autoRepositoryId:res.autoRepositoryId,
                        mainTravel:autoRepositoryDetailVO.mainTravel,  //行驶证正面
                        viceTravel:autoRepositoryDetailVO.viceTravel,
                        register1:autoRepositoryDetailVO.register1,
                        register2:autoRepositoryDetailVO.register2,
                        register3:autoRepositoryDetailVO.register3,
                        register4:autoRepositoryDetailVO.register4,
                        travelerFront:autoRepositoryDetailVO.travelerFront,
                        travelerBack:autoRepositoryDetailVO.travelerBack
                    };
                    this.modify5Img = [autoRepositoryDetailVO.mainTravelValue,autoRepositoryDetailVO.viceTravelValue,autoRepositoryDetailVO.travelerFrontValue,autoRepositoryDetailVO.travelerBackValue,autoRepositoryDetailVO.register1Value,autoRepositoryDetailVO.register2Value,autoRepositoryDetailVO.register3Value,autoRepositoryDetailVO.register4Value];
                    this.carPicsmyUploadList = [];
                    this.carPicsmyUploadList2 =[];
                    this.insurancePicsmyUploadList = [];
                    this.insurancePicsmyUploadList2 = [];
                    res.carPics.forEach( (item, index) => {
                        this.carPicsmyUploadList.push(item.value);
                        this.carPicsmyUploadList2.push(item.key);
                    });
                    res.insurancePics.forEach( (item, index) => {
                        this.insurancePicsmyUploadList.push(item.value);
                        this.insurancePicsmyUploadList2.push(item.key);
                    });
                    this.carRegisterRecords = carRegisterRecordDetailVOs.length ?
                        [...carRegisterRecordDetailVOs] : [{
                            owner: "", //拥有者
                            registerGov: "", //登记机关
                            registerDate: "", //登记日期
                            registerNumber: "" //登记编号
                        }], //登记摘要信息栏集合;
                    this.$store.commit('change_height');
                }
            })
        },
        getFile(formData){
            this.$axios.get('/fx?api=gate.order.car.other.detail',{params:formData}).then(res => {
                if(res!=500){
                    this.myimgs8 = [];
                    this.myimgs88 = [];
                    res.orderViolate.forEach( (item, index) => {
                        this.myimgs8.push(item.value);
                        this.myimgs88.push(item.key);
                    });
                    this.myimgs9 = res.travelerValidValue; //绝对地址
                    this.myimgs10 = [];
                    this.myimgs110 = [];
                    res.car300Evaluate.forEach( (item, index) => {
                        this.myimgs10.push(item.value);
                        this.myimgs110.push(item.key);
                    });
                    this.myimgs11 = [];
                    this.myimgs111 = [];
                    res.orderPeoPre.forEach( (item, index) => {
                        this.myimgs11.push(item.value);
                        this.myimgs111.push(item.key);
                    });
                    this.myimgs121 = res.peolawValue; //绝对地址
                    this.myimgs122 = res.lostLetterValue; //绝对地址
                    this.imgsbox = [res.peolawValue,res.lostLetterValue];
                    this.myimgs13 = [];
                    this.myimgs133 = [];
                    res.orderBank.forEach( (item, index) => {
                        this.myimgs13.push(item.value);
                        this.myimgs133.push(item.key);
                    });
                    this.myimgs14 = [];
                    this.myimgs144 = [];
                    res.orderCredit.forEach( (item, index) => {
                        this.myimgs14.push(item.value);
                        this.myimgs144.push(item.key);
                    });
                    this.myimgs15 = [];
                    this.myimgs155 = [];
                    this.myimgs16 = res.modelBackValue; //绝对地址
                    res.orderSupple.forEach( (item, index) => {
                        this.myimgs15.push(item.value);
                        this.myimgs155.push(item.key);
                    });
                }
            })
        },
        longBtn(checked, name){
            this.checkedState = checked;
        },
        previewDown(contractId){  //单个打印合同
            this.$axios.post('/fx?api=gate.contract.print',{orderId:this.$route.query.orderId,id:contractId}).then(res => {
                if(res!=500){
                    this.$Message.success("打印成功"); 
                    this.getContractList({orderId:this.$route.query.orderId});
                }
            })  
        },
        modifyInfoBtn1(){
            if(this.ismodifyInfo){
                this.modifyInfo.periodDate = this.periodDateTemporary?moment(this.periodDateTemporary).format("YYYY-MM-DD"):'';
                // this.modifyInfo.periodDate = this.modifyInfo.periodDate?moment(this.modifyInfo.periodDate).format("YYYY-MM-DD"):'';
                if(this.checkedState){
                    this.modifyInfo.periodDate = '长期';
                }
                this.modifyInfo.startLiveDate = this.modifyInfo.startLiveDate?moment(this.modifyInfo.startLiveDate).format("YYYY-MM-DD"):'';
                this.modifyInfo.startWorkTime = this.modifyInfo.startWorkTime?moment(this.modifyInfo.startWorkTime).format("YYYY-MM-DD"):'';
                this.modifyInfo.firstCome = this.modifyInfo.firstCome?moment(this.modifyInfo.firstCome).format("YYYY"):'';
                this.modifyInfo.signDate = this.modifyInfo.signDate?moment(this.modifyInfo.signDate).format("YYYY-MM-DD"):'';
                let formData = {...this.modifyInfo};
                formData.uid = this.$route.query.userId;
                formData.orderId = this.$route.query.orderId;
                let bol = false;
                for (let key in formData) {
                    if(!formData[key]){
                        bol = true;
                    }
                }
                if(bol) return this.$Message.error("带 * 为必填项");  
                this.$axios.post('/fx?api=gate.order.admin.person.updatePersonDetail',formData).then(res => {
                    if(res!=500){
                        this.$Message.success("保存成功"); 
                        this.getInitialPersonList({userId:this.$route.query.userId,orderId:this.$route.query.orderId});
                    }
                })     
            }
            this.ismodifyInfo = !this.ismodifyInfo;
        },
        modifyContact(item,index){
            if(this.ismodifyContact[index]){
                let formData = {...this.infoContent};
                formData.id = item.id;
                formData.userId = this.$route.query.userId;
                formData.orderId = this.$route.query.orderId;
                formData.concatName = item.concatName;
                formData.concatRelation = item.concatRelation;
                formData.company = item.company;
                formData.address = item.address;
                formData.concatMobile = item.concatMobile;
                let bol = false;
                for (let key in formData) {
                    if(!formData[key]){
                        bol = true;
                    }
                }
                if(bol) return this.$Message.error("带 * 为必填项");  
                this.$axios.post('/fx?api=gate.order.admin.person.updateContacts',formData).then(res => {
                    if(res!=500){
                        this.$Message.success("保存成功"); 
                        this.getInitialPersonList({userId:this.$route.query.userId,orderId:this.$route.query.orderId});
                    }
                })
            }else{
                this.infoContent = {
                    province: item.province,
                    city: item.city,
                    area: item.area
                }
            }
            this.ismodifyContact[index] = !this.ismodifyContact[index];
            this.$forceUpdate();
        },
        modifyContractBtn(contractId){
            this.$axios.post('/fx?api=gate.order.admin.uploadContract',{orderId:this.$route.query.orderId,contractId:contractId,imgs:String(this.myimgs300)}).then(res => {
                if(res!=500){
                    this.$Message.success("保存成功"); 
                    this.getContractList({orderId:this.$route.query.orderId}); 
                }
            })
        },
        chinaAreaChange1(data){
            this.modifyInfo.nowProvice = data.province;
            this.modifyInfo.nowCity = data.city;
            this.modifyInfo.nowArea = data.area;
        }, 
        chinaAreaChange2(data){
            this.modifyInfo.companyProvice  = data.province;
            this.modifyInfo.companyCity  = data.city;
            this.modifyInfo.companyArea = data.area;
        },
        chinaAreaChange3(arr){
            this.infoContent.province = arr.province;
            this.infoContent.city = arr.city;
            this.infoContent.area = arr.area;
        },
        modify1Btn(){
            this.modify1.travelerRegisterDate = this.modify1.travelerRegisterDate?moment(this.modify1.travelerRegisterDate).format("YYYY-MM-DD"):'';
            this.modify1.giveDate = this.modify1.giveDate?moment(this.modify1.giveDate).format("YYYY-MM-DD"):'';
            this.modify1.outDate = this.modify1.outDate?moment(this.modify1.outDate).format("YYYY-MM-DD"):'';
            if(this.ismodify1){ //为保存操作
                for (let key in this.modify1) {
                    if(!this.modify1[key]){
                        if(key!='remark' && key!='record' && key!='travelerRegisterDate' && key!='giveDate' && key!='archivesNumber' && key!='weightTotal' && key!='weightWhole' && key!='size' && key!='outDate'){
                            debugger;
                            return this.$Message.error("带 * 为必填项"); 
                        }
                    }
                }
                this.$axios.post('/fx?api=gate.order.car.traveler.update',this.modify1).then(res => {
                    if(res!=500){
                        this.$Message.success("保存成功"); 
                        this.ismodify1 = !this.ismodify1;
                    }
                })
            }else{
                this.ismodify1 = !this.ismodify1;
            }
        },
        modify2Btn(){
            this.modify2.issueDate = this.modify2.issueDate?moment(this.modify2.issueDate).format("YYYY-MM-DD"):'';
            this.modify2.outDate = this.modify2.outDate?moment(this.modify2.outDate).format("YYYY-MM-DD"):'';
            if(this.ismodify2){ //为保存操作
                for (let key in this.modify2) {
                    if(!this.modify2[key]){
                        if(key!='wheelDistance' && key!='wheelCount' && key!='wheelNormal' && key!='steelCount' && key!='wheelbase' && key!='axesCount' && key!='verandaSize' && key!='innerSize' && key!='totalWeight' && key!='approvedLoad' && key!='customer' && key!='tractionWeight' && key!='driverCustomer' && key!='useNature' && key!='getWay' && key!='issueGov' && key!='enginerModel' && key!='oilType' && key!='madeFactory' && key!='turnType' && key!='outDate' && key!='issueDate'){
                            return this.$Message.error("带 * 为必填项"); 
                        }
                    }
                }
                this.$axios.post('/fx?api=gate.order.car.register.update',this.modify2).then(res => {
                    if(res!=500){
                        this.$Message.success("保存成功"); 
                        this.ismodify2 = !this.ismodify2;
                    }
                })
            }else{
                this.ismodify2 = !this.ismodify2;
            }
        },
        modify3Btn(){
            if(this.ismodify3){ //为保存操作
                let bol = this.carRegisterRecords.some( (item, index) => {
                   return item.owner=='' || item.registerGov=='' || item.registerDate=='' ||item.registerNumber==''; //行驶证正面
                });
                if(bol){
                    return this.$Message.error("带 * 为必填项"); 
                }
                this.carRegisterRecords.forEach( (ele, index) => {
                   ele.registerDate = moment(ele.registerDate).format("YYYY-MM-DD");
                });
                this.$axios.post('/fx?api=gate.order.car.register.record.update',{orderId:this.$route.query.orderId,autoRepositoryId:this.modify1.autoRepositoryId,carRegisterRecords:JSON.stringify(this.carRegisterRecords)}).then(res => {
                    if(res!=500){
                        this.$Message.success("保存成功"); 
                        this.ismodify3 = !this.ismodify3;
                    }
                })
            }else{
                this.ismodify3 = !this.ismodify3;
            }
            
        },
        modify4Btn(){
            if(this.ismodify4){ //为保存操作
                for (let key in this.modify4) {
                    if(!this.modify4[key]){
                        if(key=='hasInspect'){
                            if(this.modify4[key]=='1' && !this.modify4.insEndDate){
                                return this.$Message.error("带 * 为必填项");
                            }
                        }else if(key=='hasHighInsurance'){
                            debugger;
                            if(this.modify4[key]=='1' && (!this.modify4.highStartDate || !this.modify4.highEndDate)){
                                return this.$Message.error("带 * 为必填项");
                            }
                        }else if(key=='hasBusyInsurance'){
                            if(this.modify4[key]=='1' ||(!this.modify4.busyStartDate || !this.modify4.busyEndDate)){
                                return this.$Message.error("带 * 为必填项");
                            }
                        }else if(key!='insEndDate' && key!='highStartDate' && key!='highEndDate' && key!='busyStartDate' && key!='busyEndDate' && key!='remark'){
                            return this.$Message.error("带 * 为必填项");
                        }
                    }
                }
                this.modify4.insEndDate = moment(this.modify4.insEndDate).format("YYYY-MM-DD");
                this.modify4.highStartDate = moment(this.modify4.highStartDate).format("YYYY-MM-DD");
                this.modify4.highEndDate = moment(this.modify4.highEndDate).format("YYYY-MM-DD");
                this.modify4.busyStartDate = moment(this.modify4.busyStartDate).format("YYYY-MM-DD");
                this.modify4.busyEndDate = moment(this.modify4.busyEndDate).format("YYYY-MM-DD");
                this.modify4.registerDate = moment(this.modify4.registerDate).format("YYYY-MM-DD"); 
                this.modify4.examinerDate = moment(this.modify4.examinerDate).format("YYYY-MM-DD");
                this.$axios.post('/fx?api=gate.order.car.register.report.update',this.modify4).then(res => {
                    if(res!=500){
                        this.$Message.success("保存成功"); 
                        this.ismodify4 = !this.ismodify4;
                    }
                })
            }else{
                this.ismodify4 = !this.ismodify4;
            }
        },
        modify5Btn(){
            this.$axios.post('/fx?api=gate.order.car.register.auto.file.update',this.modify5).then(res => {
                if(res!=500){
                    this.$Message.success("保存成功"); 
                    this.getInitialCarList({autoRepositoryId:this.$route.query.autoId});
                }
            })
        },
        modify6Btn(){
            if(!this.imgs1.length){
                return this.$Message.warning("至少需要一张图片"); 
            }
            let formData = {
                orderId:this.$route.query.orderId,
                autoRepositoryId: this.$route.query.autoId,
                entityType:'orderCar',
                filePath: String(this.imgs1)
            };
            this.$axios.post('/fx?api=gate.order.car.file.update',formData).then(res => {
                if(res!=500){
                    this.$Message.success("保存成功"); 
                }
            }) 
        },
        modify7Btn(){
            if(!this.imgs2.length){
                return this.$Message.warning("至少需要一张图片"); 
            }
            let formData = {
                orderId:this.$route.query.orderId,
                autoRepositoryId: this.$route.query.autoId,
                entityType:'orderInsurance',
                filePath: String(this.imgs2)
            };
            this.$axios.post('/fx?api=gate.order.car.file.update',formData).then(res => {
                if(res!=500){
                    this.$Message.success("保存成功"); 
                }
            })
        },
        downContract(){ //打印合同
            this.carImgloading5 = true;
            this.$axios.post('/fx?api=gate.contract.print',{orderId:this.$route.query.orderId}).then(res => {
                if(res!=500){
                    this.$Message.success("打印成功"); 
                    this.getContractList({orderId:this.$route.query.orderId});
                }
                this.carImgloading5 = false;
            })
        },
        downLoadContract(){
            this.carImgloading2 = true;
            this.$axios.get('/fx?api=gate.contract.download',{params:{orderId:this.$route.query.orderId}}).then(res => {
                if(res!=500){
                    window.open(res.filePath);
                }
                this.carImgloading2 = false;
            })
        },
        modifyCommonBtn(txt){
            let formData = {orderId:this.$route.query.orderId,autoRepositoryId: this.$route.query.autoId};
            let myUrl = '/fx?api=gate.order.car.file.update';
            switch (txt) {
                case '违章照片':
                    if(!this.imgs8.length){
                        return this.$Message.warning("至少需要一张图片"); 
                    }
                    formData.entityType = 'orderViolate';
                    formData.filePath = String(this.imgs8);
                    break;
                case '驾照验证图片':
                    if(!this.imgs9.length){
                        return this.$Message.warning("请上传图片"); 
                    }
                    myUrl = '/fx?api=gate.order.car.other.file.update';
                    formData.otherFileType = 1;
                    formData.filePath = String(this.imgs9);
                    break;
                case '快易估评估照片':
                    if(!this.imgs10.length){
                        return this.$Message.warning("请上传图片"); 
                    }
                    myUrl = '/fx?api=gate.order.car.other.file.update';
                    formData.otherFileType = 2;
                    formData.filePath = String(this.imgs10);
                    break;
                case '车型评估反馈照片':
                    if(!this.imgs16.length){
                        return this.$Message.warning("请上传图片"); 
                    }
                    myUrl = '/fx?api=gate.order.car.other.file.update';
                    formData.otherFileType = 5;
                    formData.filePath = String(this.imgs16);
                    break;     
                case '人保预审截图':
                    if(!this.imgs11.length){
                        return this.$Message.warning("至少需要一张图片"); 
                    }
                    myUrl = '/fx?api=gate.order.car.file.update';
                    formData.entityType = 'orderPeoPre';
                    formData.filePath = String(this.imgs11);
                    break; 
                case '人法截图':
                    if(!this.imgs121.length){
                        return this.$Message.warning("请上传图片"); 
                    }
                    myUrl = '/fx?api=gate.order.car.other.file.update';
                    formData.otherFileType = 3;
                    formData.filePath = String(this.imgs121);
                    break;
                case '失信截图':
                    if(!this.imgs122.length){
                        return this.$Message.warning("请上传图片"); 
                    }
                    myUrl = '/fx?api=gate.order.car.other.file.update';
                    formData.otherFileType = 4;
                    formData.filePath = String(this.imgs122);
                    break;    
                case '银行卡复印件':
                    if(!this.imgs13.length){
                        return this.$Message.warning("至少需要一张图片"); 
                    }
                    myUrl = '/fx?api=gate.order.car.file.update';
                    formData.entityType = 'orderBank';
                    formData.filePath = String(this.imgs13);
                    break;
                case '人保征信授权书':
                    if(!this.imgs14.length){
                        return this.$Message.warning("至少需要一张图片"); 
                    }
                    myUrl = '/fx?api=gate.order.car.file.update';
                    formData.entityType = 'orderCredit';
                    formData.filePath = String(this.imgs14);
                    break;  
                case '补充材料':
                    if(!this.imgs15.length){
                        return this.$Message.warning("至少需要一张图片"); 
                    }
                    myUrl = '/fx?api=gate.order.car.file.update';
                    formData.entityType = 'orderSupple';
                    formData.filePath = String(this.imgs15);
                    break;   
            }
            this.$axios.post(myUrl,formData).then(res => {
                if(res!=500){
                    this.$Message.success("保存成功"); 
                }
            })
        },
        clickFaceImg(img){
            this.bigimg = img;
            this.modalPreview = true;
        },
        modifyDevice(id,deviceNum){
            this.modify6 = {
                deviceNum: deviceNum,
                type: 1
            };
            this.myTitle = '修改订单设备';
            this.modifyModal = true;
            this.deviceId = id;
        },
        modifyPosition(id,imgs,position){
            this.modify8myUploadList = [];
            this.modify8myUploadList2 = [];
            let arr = [];
            imgs.forEach( (ele, index) => {
                this.modify8myUploadList.push(ele.aurl);
                this.modify8myUploadList2.push(ele.rurl);
            });
            this.modifyModal2 = true; 
            this.modify8.position = position; 
            this.deviceId = id;
        },
        modify8ChangePicUrl(...arr){
            this.modify8.imgs = String(arr[0]);
        },
        downLoadCarInfo(){
            this.carImgloading1 = true;
            this.$axios.get('/fx?api=gate.order.auto.download',{params:{autoId:this.$route.query.autoId}}).then(res => {
                if(res!=500){
                    window.open(res.filePath);
                }
                this.carImgloading1 = false;
            })
        },
        downLoadAllInfo(){
            // this.carImgloading4 = true;
            // this.$axios.get('/fx?api=gate.download.order.file',{params:{orderId:this.$route.query.orderId}}).then(res => {
            //     if(res!=500){
            //         window.open(res.filePath);
            //     }
            //     this.carImgloading4 = false;
            // })
            let formDataString = encodeURIComponent(JSON.stringify({orderId:this.$route.query.orderId}));
            window.open(`${this.myUrl}/file/download?api=gate.download.order.file&v=1.0&ttid=1002&did=1&ts=1480929340486&lng=39.98871&lat=116.43234&mat=${this.mat}&sign=inm&data=${formDataString}`);
        },
        confirmBtn(){
            let formData = {};
            let  myUrl = '/fx?api=gate.order.admin.person.update';
            formData = {
                userId: this.$route.query.userId
            }
            if(this.activeName == 'name2'){
                myUrl = '/fx?api=gate.order.admin.person.update';
            }else{
                formData.filePaths = String(this.imgs1);
            }
            this.$axios.post(myUrl,formData).then(res => {
                if(res!=500){
                    this.$Message.success("保存成功"); 
                }
            })
        },
        deviceConfirmBtn(){ //设备信息保存
            this.modal_loading = true;
            let formData =  {...this.modify6};
            formData.orderId = this.$route.query.orderId;
            if(this.myTitle == '修改订单设备'){
                formData.id = this.deviceId;
            }
            this.$axios.post('/fx?api=gate.order.addOrUpdate.device',formData).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.getDeviceList({orderId:this.$route.query.orderId});
                }
                 this.modal_loading = false;
                 this.modifyModal = false;
            })
        },
        toUrl(url){
            window.open(url);
        },
        changePicUrl(...arr){ //arr为子组件向父组件传递的参数列表
            switch (arr[1]) {
                case '行驶证正面':
                    this.modify5.mainTravel = arr[0][0];
                    break;
                case '行驶证反面':
                    this.modify5.viceTravel = arr[0];
                    break;
                case '驾驶证正面':
                    this.modify5.travelerFront = arr[0][0];
                    break;
                case '驾驶证反面':
                    this.modify5.travelerBack = arr[0];
                    break;
                case '绿本第1页':
                    this.modify5.register1 = arr[0];
                    break;
                case '绿本第2页':
                    this.modify5.register2 = arr[0];
                    break;
                case '绿本第3页':
                    this.modify5.register3 = arr[0];
                    break;  
                case '绿本第4页':
                    this.modify5.register4 = arr[0];
                    break;              
            }
        },
        changePicUrl2(...arr){
            this.imgs1 = arr;
        },
        changePicUrl3(...arr){
            this.imgs2 = arr;
        },
        changePicUrl8(...arr){
            this.imgs8 = arr;
        },
        changePicUrl9(...arr){
            this.imgs9 = arr[0];
        },
        changePicUrl10(...arr){
            this.imgs10 = arr[0];
        },
        changePicUrl11(...arr){
            this.imgs11 = arr;
        },
        changePicUrl12(...arr){
            if(arr[1]=='人法截图'){ //人法截图
                this.imgs121 = arr[0][0];
            }else{
                this.imgs122 = arr[0][0];  //失信截图
            }
        },
        changePicUrl13(...arr){
            this.imgs13 = arr;
        },
        changePicUrl14(...arr){
            this.imgs14 = arr;
        },
        changePicUrl15(...arr){
            this.imgs15 = arr;
        },
        changePicUrl16(...arr){
            this.imgs16 = arr[0];
        },
        changePicUrl300(...arr){
            this.myimgs300 = arr;
        },
        tabClick(name){
            this.activeName = name;
            if(name=='name4'){
                this.getContractList({orderId:this.$route.query.orderId}); 
            }
        },
        cancel(){
            this.modalPreview = false;
            this.modifyModal = false;
            this.modifyModal2 = false;
            this.applySealModal = false;
            this.applySealDetModal = false;
        },
        cancel1(){
             this.tipModal = false;
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
            if(this.carRegisterRecords.length<=1){
                return this.$Message.info("至少需要一项"); 
            }
            this.carRegisterRecords.splice(index,1);
        },
        backBtn(){
            this.$router.push({name:this.$route.query.name,query:{pageNum:this.$route.query.pageNum,name:this.$route.query.name2,orderId:this.$route.query.orderId}});
        },
        formatImg(item,txt){
            let arr = [];
            item.forEach( (ele, index) => {
                if(txt=='绝对'){
                    arr.push(ele.aurl);
                }else{
                    arr.push(ele.rurl);
                }
            });
            return arr;
        },
        preview(pdfUrl){
            window.open(pdfUrl);
        },
        addDevice(){
            this.modify6 = {
                deviceNum: '',
                type: 1
            };
            this.myTitle = '新增订单设备';
            this.modifyModal = true;
        },
        modify8ConfirmBtn(){
            if(!this.modify8.position || !this.modify8.imgs.length){
                return this.$Message.error("带 * 为必填项"); 
            }
            let formData = {...this.modify8};
            formData.id = this.deviceId;
            this.modal_loading = true;
            this.$axios.post('/fx?api=gate.order.device.addOrUpdate.use',formData).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.getDeviceList({orderId:this.$route.query.orderId});
                }
                 this.modal_loading = false;
                 this.modifyModal2 = false;
            })
        },
        applySeal(){  //申请电签
            // this.applySealModal = true;
            // this.applySealModify = {
            //     scene:'',
            //     firstPartKey:'',
            //     secondPartKey:''
            // }
            this.applySealConfirm();
        },
        sealDetail(){  //电签详情
            this.$axios.get('/fx?api=gate.contract.seal.query',{params:{flowId:this.contractFlowId}}).then(res => {
                if(res!=500){
                    this.sealDetailObj = res; 
                    this.signDetail = res.signDetail; 
                }
            })
            this.applySealDetModal = true;
        },
        applySealConfirm(){   
            // if(!this.applySealModify.scene || !this.applySealModify.firstPartKey || !this.applySealModify.secondPartKey){
            //     return this.$Message.error("带 * 为必填项"); 
            // }
            // let formData = {...this.applySealModify};
            // formData.orderId = this.$route.query.orderId;
            // this.modal_loading = true;
            this.$axios.post('/fx?api=gate.contract.seal.apply',{orderId:this.$route.query.orderId}).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.getContractList({orderId:this.$route.query.orderId});
                }
                // this.modal_loading = false;
                // this.applySealModal = false;
            })
        },
        previewContract(){
            this.carImgloading3 = true;
            this.$axios.get('/fx?api=gate.electron.contract.query',{params:{orderId:this.$route.query.orderId}}).then(res => {
                if(res!=500){
                    window.open(res.url);
                }
                this.carImgloading3 = false;
            }) 
        },
        applySealDetConfirm(){
             this.applySealDetModal = false;
        },
        archive(flowId){
            this.tipModal = true;
            this.modalTipTitle = '电签归档';
            this.item = {
                flowId:flowId
            }
        },  
        revoke(flowId){
            this.tipModal = true;
            this.modalTipTitle = '电签撤回';
            this.item = {
                flowId:flowId
            }
        },
        tipComfirmBtn(num) {
            this.tipModal = false;
            if (num != 500) {
                this.$Message.success('操作成功');
                this.applySealDetModal = false;
                this.getContractList({orderId:this.$route.query.orderId});
            }
        },
        downloadSeal(flowId){
            this.$axios.get('/fx?api=gate.contract.seal.download',{params:{flowId:flowId}}).then(res => {
                if(res!=500){
                    window.open(res.docUrl);
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
    #customList /deep/ .ivu-table-row.ivu-table-row-hover{
        cursor: pointer;
    }
    .display-before /deep/ .item-comm.required{
        display: none;
    }
    .item-comm{
        position: relative;
        display: inline-block;
        width: 125px;
        margin-left: 15px; 
    }
     .my-title-comm{
        position: relative;
     }
    .my-title-comm:before,.item-comm.required:before{
        position: absolute;
        content:'*';
        color:red;
        left:-10px;
        top:3px;
    }
    .position-img{
        display: inline-block;
    }
    .tab-top-title{
        & > span{
            margin-right:10px;
        }
        margin: 8px;
        .span11{
            color: red;
        }
    }
    #chinaArea{
        display: inline-block;
    }
    ul.common-ul li{
       margin-top: 10px; 
    }
    .imgs-imgsArr>div{
        display: inline-block;
    }
    .deviceInfo>span{
        display: inline-block;
        margin-top: 25px;
        margin-right: 10px;
    }
    .my-title-comm:before{
        top:1px;
    }
    .imgUpload{
        display: inline-block;
    }
    .item-input,.common-width{
        width: 200px;
    }
    .item-input.txt{
        display: inline-block;
    }
    .modify-modal{
        padding-top: 15px;
    }
    .item-div{
        margin: 10px 0;
    }
    .single-info span{
        display: inline-block;
        width: 33%;
    }
    .replenish-info span{
        display: inline-block;
        width: 50%;
    }
    .tab-top-title>span{
        vertical-align: top;
    }
    .my-img{
        width: 60px;
        height: 60px;
        cursor: pointer;
        vertical-align: middle;
    }
    .contact-info span{
        display: inline-block;
        width: 20%;
    }
    .btn-margin{
        margin-left: 25px;
    }
    .original-img{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 0 15px;
        span{
            display: inline-block;
            // width: 10%;
            margin: 0 4% ;
        }
    }
    .original-img img{
        display: inline-block;
        max-width: 100%;
        cursor: pointer;
    }
    ul.common-ul{
        display: inline-block;
        margin-left:20px;
        margin-right:100px;
        list-style: none;
        >li>span:first-child{
            display: inline-block;
            text-align: right;
        }
    }
    .title-info{
        font-size:14px;
        font-weight: 600;
        margin:18px 0 5px;
    }
    .item-div{
        margin-left: 10px;
    }
    .span-width{
        display: inline-block;
        width: 160px;
        margin-top: 10px;
        margin-left: 25px;
    }
    .span-width1{
        display: inline-block;
        margin: 1px 25px;
    }
    .item-input.txt /deep/ input{
        outline: none;
        border-color:transparent;
        box-shadow: none;
    }
    .title-info{
        position: relative;
        margin-left: 10px;
    }
    .title-info.required:before{
        position: absolute;
        content:'*';
        color:red;
        left:-10px;
        top:3px;
    }
    .tab-top-title span{
        display: inline-block;
        margin-top: 8px;
    }
    .item-input /deep/ input{
        font-size: 14px;
    }
    .tab-top-title{
        font-size:14px;
    }
</style>