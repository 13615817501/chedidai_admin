<template>
    <div id="waitStoreDetail" class="common-id">
        <Breadcrumb>
            <BreadcrumbItem>订单管理</BreadcrumbItem>
            <BreadcrumbItem>详情</BreadcrumbItem>
        </Breadcrumb>
        <div v-if="spinState" class="progress-box">
            <i-progress  :percent="percent" :stroke-width="10"/>
        </div>
        <div class="modify-modal"> 
            <Button type="primary" @click="backBtn"><Icon type="ios-arrow-back" />返回</Button>
            <div class="tab-top-title">
                <span>姓名：<span class="span11">{{topInfo.name}}</span></span>
                <span>身份证：<span class="span11">{{topInfo.identityCard}}</span></span>
                <span>车牌号：<span class="span11">{{topInfo.plateNumber}}</span></span>
                <span>车架号：<span class="span11">{{topInfo.vin}}</span></span>
                <span>发动机号：<span class="span11">{{topInfo.enginerNumber}}</span></span>
                <span><span class="span11"><Button type="primary" :loading="carImgloading1"  @click="downLoadCarInfo"><Icon type="md-download" />下载车辆文件</Button><Button style="margin-left:8px;" type="primary" :loading="carImgloading4"  @click="downLoadAllInfo"><Icon type="md-download" />下载所有资料照片</Button></span></span>
            </div>
            <div class="tab-top-title">
                <span>
                    身份证正面： <viewer :images="identityInfo1[0]?identityInfo1[0].split(' '):[]"><img class="my-img" :src="identityInfo1[0]" alt="身份证正面">
                                </viewer>
                </span> 
                <span>
                   身份证反面： <viewer :images="identityInfo1[1]?identityInfo1[1].split(' '):[]"><img class="my-img" :src="identityInfo1[1]" alt="身份证反面">
                                </viewer>
                </span> 
                <span>
                    行驶证正面：<viewer :images="modify5Img[0]?modify5Img[0].split(' '):[]"><img class="my-img" :src="modify5Img[0]" alt="行驶证正面">
                                </viewer>
                </span> 
                <span>
                    行驶证反面：<viewer :images="modify5Img[1]?modify5Img[1].split(' '):[]"><img class="my-img" :src="modify5Img[1]" alt="行驶证反面">
                                </viewer>
                </span> 
                <span>
                    驾驶证正面：<viewer :images="modify5Img[2]?modify5Img[2].split(' '):[]"><img class="my-img" :src="modify5Img[2]" alt="驾驶证正面">
                                </viewer>
                </span> 
                <span>
                    驾驶证反面：<viewer :images="modify5Img[3]?modify5Img[3].split(' '):[]"><img class="my-img" :src="modify5Img[3]" alt="驾驶证反面">
                                </viewer>
                </span> 
                <span>
                    绿本第1页：<viewer :images="modify5Img[4]?modify5Img[4].split(' '):[]"><img class="my-img" :src="modify5Img[4]" alt="绿本第1页">
                                </viewer>
                </span> 
                <span>
                    绿本第2页：<viewer :images="modify5Img[5]?modify5Img[5].split(' '):[]"><img class="my-img" :src="modify5Img[5]" alt="绿本第2页">
                                </viewer>
                </span> 
                <span>
                   绿本第3页：<viewer :images="modify5Img[6]?modify5Img[6].split(' '):[]"><img class="my-img" :src="modify5Img[6]" alt="绿本第3页">
                                </viewer>
                </span> 
                <span>
                    绿本第4页：<viewer :images="modify5Img[7]?modify5Img[7].split(' '):[]"><img class="my-img" :src="modify5Img[7]" alt="绿本第4页">
                                </viewer>
                </span> 
            </div>
            <Tabs v-model="activedName" @on-click="tabClick" style="font-size:14px;">
                <TabPane label="客户信息" name="name1">
                    <div class="person-name1-box" :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}" v-if="$route.query.name2=='WaitStoreList'&& isReturn">
                        <div class="title-info">个人信息<Button type="primary" size="small" v-if="isUpdate" style="margin-left:10px;" @click="modifyInfo1Btn1">{{!ismodifyInfo1?'修改':'保存'}}</Button></div>
                        <ul class="common-ul">
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('name')}">姓名：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('name')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('name')" v-model="modifyInfo1.name" :placeholder="(ismodifyInfo1 && formatMarkInfo('name'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('identityCard')}">身份证号：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('identityCard')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('identityCard')" v-model="modifyInfo1.identityCard" :placeholder="(ismodifyInfo1 && formatMarkInfo('identityCard'))?'请输入...':''" /></li>
                            <li><span class="item-comm required">活体认证：</span><Input class="item-input txt" readonly :value="'完成'"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('national')}">民族：</span><Input class="item-input" style="width:300px;" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('national')}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.national" :placeholder="(ismodifyInfo1 && formatMarkInfo('national'))?'请输入...':''" /></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('cardNumber')}">银行卡号：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('cardNumber')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('cardNumber')" v-model="modifyInfo1.cardNumber" :placeholder="(ismodifyInfo1 && formatMarkInfo('cardNumber'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('bankName')}">开户行：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('bankName')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('bankName')" v-model="modifyInfo1.bankName" :placeholder="(ismodifyInfo1 && formatMarkInfo('bankName'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('bankMobile')}">银行预留手机：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('bankMobile')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('bankMobile')" v-model="modifyInfo1.bankMobile" :placeholder="(ismodifyInfo1 && formatMarkInfo('bankMobile'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('gov')}">签发机关：</span><Input class="item-input" style="width:300px;" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('gov')}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.gov" :placeholder="(ismodifyInfo1 && formatMarkInfo('gov'))?'请输入...':''" /></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('signDate')}">证件开始时间：</span><DatePicker v-if="ismodifyInfo1 && formatMarkInfo('signDate')" v-model="modifyInfo1.signDate" type="date" placeholder="证件有效期" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodifyInfo1 || !formatMarkInfo('signDate')" readonly :value="modifyInfo1.signDate"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('periodDate')}">证件有效期至：</span><DatePicker v-if="ismodifyInfo1 && formatMarkInfo('periodDate')" v-model="periodDateTemporary" type="date" placeholder="证件有效期" class="item-input"></DatePicker><Tag style="margin-left:5px;" v-if="ismodifyInfo1 && formatMarkInfo('periodDate')" checkable color="primary" :checked="checkedState" @on-change="longBtn">长期</Tag>
                                <Input class="item-input txt" v-if="!ismodifyInfo1 || !formatMarkInfo('periodDate')" readonly :value="modifyInfo1.periodDate"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('houseAddress')}">户籍地址：</span><Input class="item-input" style="width:300px;" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('houseAddress')}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.houseAddress" :placeholder="(ismodifyInfo1 && formatMarkInfo('houseAddress'))?'请输入...':''" /></li>
                        </ul>
                        <div class="title-info">补充信息</div>
                        <ul class="common-ul">
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('nowAddress')}">现住地址：</span><ChinaArea2 v-if="ismodifyInfo1 && formatMarkInfo('nowAddress')" @change="chinaAreaChange1" :parProvince="modifyInfo1.nowProvice" :parCity="modifyInfo1.nowCity" :parArea="modifyInfo1.nowArea"></ChinaArea2><Input style="margin-left:8px;" class="item-input" v-if="ismodifyInfo1 && formatMarkInfo('nowAddress')" v-model="modifyInfo1.nowUpdateAddress" placeholder="请输入..." /><Input class="item-input txt" style="width:400px;" v-if="!ismodifyInfo1 || !formatMarkInfo('nowAddress')" readonly :value="modifyInfo1.nowAddress"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('source')}">客户来源：</span><Select v-if="ismodifyInfo1 && formatMarkInfo('source')" v-model="modifyInfo1.source" class="item-input">
                                    <Option value="1">中介</Option>
                                    <Option value="2">客户推荐</Option>
                                    <Option value="3">陌生拜访</Option>
                                    <Option value="4">小区推广</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1 || !formatMarkInfo('source')" readonly :value="modifyInfo1.source=='1'?'中介':modifyInfo1.source=='2'?'客户推荐':modifyInfo1.source=='3'?'陌生拜访':modifyInfo1.source=='4'?'小区推广':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('startLiveDate')}">起始居住时间：</span><DatePicker v-if="ismodifyInfo1 && formatMarkInfo('startLiveDate')" v-model="modifyInfo1.startLiveDate" type="date" placeholder="起始居住时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodifyInfo1 || !formatMarkInfo('startLiveDate')" readonly :value="modifyInfo1.startLiveDate"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('marry')}">婚姻状态：</span><Select v-if="ismodifyInfo1 && formatMarkInfo('marry')" v-model="modifyInfo1.marry" class="item-input">
                                    <Option value="1">已婚</Option>
                                    <Option value="2">未婚</Option>
                                    <Option value="3">离异</Option>
                                    <Option value="4">再婚</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1  || !formatMarkInfo('marry')" readonly :value="modifyInfo1.marry=='1'?'已婚':modifyInfo1.marry=='2'?'未婚':modifyInfo1.marry=='3'?'离异':modifyInfo1.marry=='4'?'再婚':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('hasChild')}">有无子女：</span><Select v-if="ismodifyInfo1 && formatMarkInfo('hasChild')" v-model="modifyInfo1.hasChild" class="item-input">
                                    <Option value="1">有</Option>
                                    <Option value="2">无</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1 || !formatMarkInfo('hasChild')" readonly :value="modifyInfo1.hasChild=='1'?'有':modifyInfo1.hasChild=='2'?'无':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('supportRelate')}">供养亲属：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('supportRelate')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('supportRelate')" v-model="modifyInfo1.supportRelate" :placeholder="(ismodifyInfo1 && formatMarkInfo('supportRelate'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('localMobile')}">本市地址电话：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('localMobile')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('localMobile')" v-model="modifyInfo1.localMobile" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('educate')}">学历背景：</span><Select v-if="ismodifyInfo1 && formatMarkInfo('educate')" v-model="modifyInfo1.educate" class="item-input">
                                    <Option value="1">硕土以上</Option>
                                    <Option value="2">本科</Option>
                                    <Option value="3">专科</Option>
                                    <Option value="4">高中以下</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1 || !formatMarkInfo('educate')" readonly :value="modifyInfo1.educate=='1'?'硕土以上':modifyInfo1.educate=='2'?'本科':modifyInfo1.educate=='3'?'专科':modifyInfo1.educate=='4'?'高中以下':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('companyName')}">单位名称：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('companyName')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('companyName')" v-model="modifyInfo1.companyName" :placeholder="(ismodifyInfo1 && formatMarkInfo('companyName'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('companyAddress')}">单位地址：</span><ChinaArea2 v-if="ismodifyInfo1 && formatMarkInfo('companyAddress')" @change="chinaAreaChange2" :parProvince="modifyInfo1.companyProvice" :parCity="modifyInfo1.companyCity" :parArea="modifyInfo1.companyArea"></ChinaArea2><Input style="margin-left:8px;" class="item-input" v-if="ismodifyInfo1 && formatMarkInfo('companyAddress')" v-model="modifyInfo1.companyUpdateAddress" placeholder="'请输入...'" /><Input class="item-input txt" style="width:400px;" v-if="!ismodifyInfo1 || !formatMarkInfo('companyAddress')" readonly :value="modifyInfo1.companyAddress"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('level')}">职位级别：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('level')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('level')" v-model="modifyInfo1.level" :placeholder="(ismodifyInfo1 && formatMarkInfo('level'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('creditQuota')}">信用卡额度(万元)：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('creditQuota')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('creditQuota')" v-model="modifyInfo1.creditQuota" :placeholder="(ismodifyInfo1 && formatMarkInfo('creditQuota'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('isTempcer')}">暂住证：</span><Select v-if="ismodifyInfo1 && formatMarkInfo('isTempcer')" v-model="modifyInfo1.isTempcer" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1 || !formatMarkInfo('isTempcer')" readonly :value="modifyInfo1.isTempcer=='0'?'无':modifyInfo1.isTempcer=='1'?'有':''"/></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('baseSalary')}">月基本薪资：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('baseSalary')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('baseSalary')" v-model="modifyInfo1.baseSalary" :placeholder="(ismodifyInfo1 && formatMarkInfo('baseSalary'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('otherSalary')}">其他收入：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('otherSalary')}" :readonly="!ismodifyInfo1  || !formatMarkInfo('otherSalary')" v-model="modifyInfo1.otherSalary" :placeholder="(ismodifyInfo1 && formatMarkInfo('otherSalary'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('startWorkTime')}">起始服务时间：</span><DatePicker v-if="ismodifyInfo1 && formatMarkInfo('startWorkTime')" v-model="modifyInfo1.startWorkTime" type="date" placeholder="起始服务时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodifyInfo1 || !formatMarkInfo('startWorkTime')" readonly :value="modifyInfo1.startWorkTime"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('companyType')}">企业类型：</span><Select v-if="ismodifyInfo1 && formatMarkInfo('companyType')" v-model="modifyInfo1.companyType" class="item-input">
                                    <Option value="1">非私营业主</Option>
                                    <Option value="2">个体</Option>
                                    <Option value="3">私营独资</Option>
                                    <Option value="4">私营有限责任</Option>
                                    <Option value="5">私营股份有限</Option>
                                    <Option value="6">港资/外资</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1 || !formatMarkInfo('companyType')" readonly :value="modifyInfo1.companyType=='1'?'非私营业主':modifyInfo1.companyType=='2'?'个体':modifyInfo1.companyType=='3'?'私营独资':modifyInfo1.companyType=='4'?'私营有限责任':modifyInfo1.companyType=='5'?'私营股份有限':modifyInfo1.companyType=='6'?'港资/外资':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('companyMobile')}">单位电话：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('companyMobile')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('companyMobile')" v-model="modifyInfo1.companyMobile" :placeholder="(ismodifyInfo1 && formatMarkInfo('companyMobile'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('ownHouse')}">住址拥有情况：</span><Select v-if="ismodifyInfo1 && formatMarkInfo('ownHouse')" v-model="modifyInfo1.ownHouse" class="item-input">
                                    <Option value="1">自有</Option>
                                    <Option value="2">直系亲属房屋</Option>
                                    <Option value="3">租住</Option>
                                    <Option value="4">单位分配</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1 || !formatMarkInfo('ownHouse')" readonly :value="modifyInfo1.ownHouse=='1'?'自有':modifyInfo1.ownHouse=='2'?'直系亲属房屋':modifyInfo1.ownHouse=='3'?'租住':modifyInfo1.ownHouse=='4'?'单位分配':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('otherProperty')}">名下其他财产：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('otherProperty')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('otherProperty')" v-model="modifyInfo1.otherProperty" :placeholder="(ismodifyInfo1 && formatMarkInfo('otherProperty'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('email')}">电子邮箱：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('email')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('email')" v-model="modifyInfo1.email" :placeholder="(ismodifyInfo1 && formatMarkInfo('email'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('houseProperty')}">房产：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('houseProperty')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('houseProperty')" v-model="modifyInfo1.houseProperty" :placeholder="(ismodifyInfo1 && formatMarkInfo('houseProperty'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('dept')}">所属部门：</span><Input class="item-input" :class="{txt:!ismodifyInfo1 || !formatMarkInfo('dept')}" :readonly="!ismodifyInfo1 || !formatMarkInfo('dept')" v-model="modifyInfo1.dept" :placeholder="(ismodifyInfo1 && formatMarkInfo('dept'))?'请输入...':''" /></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('nature')}">公司性质：</span><Select v-if="ismodifyInfo1 && formatMarkInfo('nature')" v-model="modifyInfo1.nature" class="item-input">
                                    <Option value="1">机关及事业单位</Option>
                                    <Option value="2">国有股份</Option>
                                    <Option value="3">外资</Option>
                                    <Option value="4">合资</Option>
                                    <Option value="5">民营</Option>
                                    <Option value="6">私营</Option>
                                    <Option value="7">个体</Option>
                                    <Option value="8">社会团体</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1 || !formatMarkInfo('nature')" readonly :value="modifyInfo1.nature=='1'?'机关及事业单位':modifyInfo1.nature=='2'?'国有股份':modifyInfo1.nature=='3'?'外资':modifyInfo1.nature=='4'?'合资':modifyInfo1.nature=='5'?'民营':modifyInfo1.nature=='6'?'私营':modifyInfo1.nature=='7'?'个体':modifyInfo1.nature=='8'?'社会团体':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('firstCome')}">来本市时间：</span><DatePicker v-if="ismodifyInfo1 && formatMarkInfo('firstCome')" v-model="modifyInfo1.firstCome" type="year" placeholder="来本市时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodifyInfo1 || !formatMarkInfo('firstCome')" readonly :value="modifyInfo1.firstCome"/></li>
                        </ul>
                        <div v-for="(item,index) in contacts1" :key="index">
                            <div class="title-info">第{{index+1}}联系人</div>
                            <Button type="primary" style="display:block;margin-left:25px;" size="small" v-if="isUpdate" @click="modifyContact1(item,index)">{{!ismodifyContact1[index]?'修改':'保存'}}</Button>
                            <ul class="common-ul">
                                <li><span  class="item-comm required"  style="width:120px;" :class="{mark:formatMarkInfo2('concatName',index)}">姓名：</span><Input class="item-input" :class="{txt:!ismodifyContact1[index] || !formatMarkInfo2('concatName',index)}" :readonly="!ismodifyContact1[index] || !formatMarkInfo2('concatName',index)" v-model="item.concatName" :placeholder="(ismodifyContact1[index] && formatMarkInfo2('concatName',index))?'请输入...':''" /></li>
                                <li><span class="item-comm required"  style="width:120px;" :class="{mark:formatMarkInfo2('concatRelation',index)}">关系：</span><Select v-if="ismodifyContact1[index] && formatMarkInfo2('concatRelation',index)" v-model="item.concatRelation" class="item-input">
                                    <Option value="1">配偶</Option>
                                    <Option value="2">父母</Option>
                                    <Option value="3">子女</Option>
                                    <Option value="4">朋友</Option>
                                    <Option value="5">兄弟姐妹</Option>
                                    <Option value="9">其他</Option>
                                </Select>
                                    <Input class="item-input txt" v-if="!ismodifyContact1[index] || !formatMarkInfo2('concatRelation',index)" readonly :value="item.concatRelation=='1'?'配偶':item.concatRelation=='2'?'父母':item.concatRelation=='3'?'子女':item.concatRelation=='4'?'朋友':item.concatRelation=='5'?'兄弟姐妹':item.concatRelation=='9'?'其他':''"/></li>
                                <li><span class="item-comm required"  style="width:120px;" :class="{mark:formatMarkInfo2('company',index)}">工作单位：</span><Input class="item-input" :class="{txt:!ismodifyContact1[index] || !formatMarkInfo2('company',index)}" :readonly="!ismodifyContact1[index] && formatMarkInfo2('company',index)" v-model="item.company" :placeholder="(ismodifyContact1[index] && formatMarkInfo2('company',index))?'请输入...':''" /></li>
                                <li><span class="item-comm required" style="width:120px;" :class="{mark:formatMarkInfo2('pca',index)}">单位/家庭住址：</span><ChinaArea2 v-if="ismodifyContact1[index] && formatMarkInfo2('pca',index)" @change="chinaAreaChange3($event)" :parProvince="item.province" :parCity="item.city" :parArea="item.area"></ChinaArea2><Input style="margin-left:8px;" class="item-input" v-if="ismodifyContact1[index] && formatMarkInfo2('pca',index)" v-model="item.address" placeholder="请输入..." /><Input class="item-input txt" style="width:400px;" v-if="!ismodifyContact1[index] || !formatMarkInfo2('pca',index)" readonly :value="item.pca"/></li>
                                <li><span class="item-comm required" style="width:120px;" :class="{mark:formatMarkInfo2('concatMobile',index)}">联系电话：</span><Input class="item-input" :class="{txt:!ismodifyContact1[index]  || !formatMarkInfo2('concatMobile',index)}" :readonly="!ismodifyContact1[index] || !formatMarkInfo2('concatMobile',index)" v-model="item.concatMobile" :placeholder="(ismodifyContact1[index] && formatMarkInfo2('concatMobile',index))?'请输入...':''" /></li>
                            </ul>
                        </div>
                        <div class="title-info">基础材料</div>
                        <div class="original-img">
                            <span style="margin-left:0;">
                                <viewer :images="identityInfo1"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in identityInfo1" :src="src" :key="index" alt="基础材料">
                                </viewer>
                            </span>
                        </div> 
                    </div>
                    <div class="person-name2-box" :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}" v-if="$route.query.name2=='WaitStoreList'&& !isReturn">
                        <div class="title-info">个人信息<Button type="primary" v-if="isUpdate" size="small" style="margin-left:10px;" @click="modifyInfo1Btn1">{{!ismodifyInfo1?'修改':'保存'}}</Button></div>
                        <ul class="common-ul">
                            <li><span class="item-comm required">姓名：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.name" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">身份证号：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.identityCard" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">活体认证：</span><Input class="item-input txt" readonly :value="'完成'"/></li>
                            <li><span class="item-comm required">民族：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.national" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required">银行卡号：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.cardNumber" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">开户行：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.bankName" :placeholder="ismodifyInfo?'请输入...':''" /></li>
                            <li><span class="item-comm required">银行预留手机：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.bankMobile" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">签发机关：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.gov" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required">证件开始时间：</span><DatePicker v-if="ismodifyInfo1" v-model="modifyInfo1.signDate" type="date" placeholder="证件有效期" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.signDate"/></li>
                            <li><span class="item-comm required">证件有效期至：</span><DatePicker v-if="ismodifyInfo1" v-model="periodDateTemporary" type="date" placeholder="证件有效期" class="item-input"></DatePicker><Tag style="margin-left:5px;" v-if="ismodifyInfo1" checkable color="primary" :checked="checkedState" @on-change="longBtn">长期</Tag>
                                <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.periodDate"/></li>
                            <li><span class="item-comm required">户籍地址：</span><Input class="item-input" style="width:300px;" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.houseAddress" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                        </ul>
                        <div class="title-info">补充信息</div>
                        <ul class="common-ul">
                            <li><span class="item-comm required">现住地址：</span><ChinaArea2 v-if="ismodifyInfo1" @change="chinaAreaChange1" :parProvince="modifyInfo1.nowProvice" :parCity="modifyInfo1.nowCity" :parArea="modifyInfo1.nowArea"></ChinaArea2><Input style="margin-left:8px;" class="item-input" v-if="ismodifyInfo1" v-model="modifyInfo1.nowUpdateAddress" placeholder="请输入..." /><Input class="item-input txt" style="width:400px;" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.nowAddress"/></li>
                            <li><span class="item-comm required">客户来源：</span><Select v-if="ismodifyInfo1" v-model="modifyInfo1.source" class="item-input">
                                    <Option value="1">中介</Option>
                                    <Option value="2">客户推荐</Option>
                                    <Option value="3">陌生拜访</Option>
                                    <Option value="4">小区推广</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.source=='1'?'中介':modifyInfo1.source=='2'?'客户推荐':modifyInfo1.source=='3'?'陌生拜访':modifyInfo1.source=='4'?'小区推广':''"/></li>
                            <li><span class="item-comm required">起始居住时间：</span><DatePicker v-if="ismodifyInfo1" v-model="modifyInfo1.startLiveDate" type="date" placeholder="起始居住时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.startLiveDate"/></li>
                            <li><span class="item-comm required">婚姻状态：</span><Select v-if="ismodifyInfo1" v-model="modifyInfo1.marry" class="item-input">
                                    <Option value="1">已婚</Option>
                                    <Option value="2">未婚</Option>
                                    <Option value="3">离异</Option>
                                    <Option value="4">再婚</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.marry=='1'?'已婚':modifyInfo1.marry=='2'?'未婚':modifyInfo1.marry=='3'?'离异':modifyInfo1.marry=='4'?'再婚':''"/></li>
                            <li><span class="item-comm required">有无子女：</span><Select v-if="ismodifyInfo1" v-model="modifyInfo1.hasChild" class="item-input">
                                    <Option value="1">有</Option>
                                    <Option value="2">无</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.hasChild=='1'?'有':modifyInfo1.hasChild=='2'?'无':''"/></li>
                            <li><span class="item-comm required">供养亲属：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.supportRelate" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">本市地址电话：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.localMobile" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">学历背景：</span><Select v-if="ismodifyInfo1" v-model="modifyInfo1.educate" class="item-input">
                                    <Option value="1">硕土以上</Option>
                                    <Option value="2">本科</Option>
                                    <Option value="3">专科</Option>
                                    <Option value="4">高中以下</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.educate=='1'?'硕土以上':modifyInfo1.educate=='2'?'本科':modifyInfo1.educate=='3'?'专科':modifyInfo1.educate=='4'?'高中以下':''"/></li>
                            <li><span class="item-comm required">单位名称：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.companyName" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">单位地址：</span><ChinaArea2 v-if="ismodifyInfo1" @change="chinaAreaChange2" :parProvince="modifyInfo1.companyProvice" :parCity="modifyInfo1.companyCity" :parArea="modifyInfo1.companyArea"></ChinaArea2><Input style="margin-left:8px;" class="item-input" v-if="ismodifyInfo1" v-model="modifyInfo1.companyUpdateAddress" placeholder="'请输入...'" /><Input class="item-input txt" style="width:400px;" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.companyAddress"/></li>
                            <li><span class="item-comm required">职位级别：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.level" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">信用卡额度(万元)：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.creditQuota" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">暂住证：</span><Select v-if="ismodifyInfo1" v-model="modifyInfo1.isTempcer" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.isTempcer=='0'?'无':modifyInfo1.isTempcer=='1'?'有':''"/></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required">月基本薪资：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.baseSalary" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">其他收入：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.otherSalary" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">起始服务时间：</span><DatePicker v-if="ismodifyInfo1" v-model="modifyInfo1.startWorkTime" type="date" placeholder="起始服务时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.startWorkTime"/></li>
                            <li><span class="item-comm required">企业类型：</span><Select v-if="ismodifyInfo1" v-model="modifyInfo1.companyType" class="item-input">
                                    <Option value="1">非私营业主</Option>
                                    <Option value="2">个体</Option>
                                    <Option value="3">私营独资</Option>
                                    <Option value="4">私营有限责任</Option>
                                    <Option value="5">私营股份有限</Option>
                                    <Option value="6">港资/外资</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.companyType=='1'?'非私营业主':modifyInfo1.companyType=='2'?'个体':modifyInfo1.companyType=='3'?'私营独资':modifyInfo1.companyType=='4'?'私营有限责任':modifyInfo1.companyType=='5'?'私营股份有限':modifyInfo1.companyType=='6'?'港资/外资':''"/></li>
                            <li><span class="item-comm required">单位电话：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.companyMobile" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">住址拥有情况：</span><Select v-if="ismodifyInfo1" v-model="modifyInfo1.ownHouse" class="item-input">
                                    <Option value="1">自有</Option>
                                    <Option value="2">直系亲属房屋</Option>
                                    <Option value="3">租住</Option>
                                    <Option value="4">单位分配</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.ownHouse=='1'?'自有':modifyInfo1.ownHouse=='2'?'直系亲属房屋':modifyInfo1.ownHouse=='3'?'租住':modifyInfo1.ownHouse=='4'?'单位分配':''"/></li>
                            <li><span class="item-comm required">名下其他财产：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.otherProperty" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">电子邮箱：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.email" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">房产：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.houseProperty" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">所属部门：</span><Input class="item-input" :class="{txt:!ismodifyInfo1}" :readonly='!ismodifyInfo1' v-model="modifyInfo1.dept" :placeholder="ismodifyInfo1?'请输入...':''" /></li>
                            <li><span class="item-comm required">公司性质：</span><Select v-if="ismodifyInfo1" v-model="modifyInfo1.nature" class="item-input">
                                    <Option value="1">机关及事业单位</Option>
                                    <Option value="2">国有股份</Option>
                                    <Option value="3">外资</Option>
                                    <Option value="4">合资</Option>
                                    <Option value="5">民营</Option>
                                    <Option value="6">私营</Option>
                                    <Option value="7">个体</Option>
                                    <Option value="8">社会团体</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.nature=='1'?'机关及事业单位':modifyInfo1.nature=='2'?'国有股份':modifyInfo1.nature=='3'?'外资':modifyInfo1.nature=='4'?'合资':modifyInfo1.nature=='5'?'民营':modifyInfo1.nature=='6'?'私营':modifyInfo1.nature=='7'?'个体':modifyInfo1.nature=='8'?'社会团体':''"/></li>
                            <li><span class="item-comm required">来本市时间：</span><DatePicker v-if="ismodifyInfo1" v-model="modifyInfo1.firstCome" type="year" placeholder="来本市时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodifyInfo1" readonly :value="modifyInfo1.firstCome"/></li>
                        </ul>
                        <div v-for="(item,index) in contacts1" :key="index">
                            <div class="title-info">第{{index+1}}联系人</div>
                            <Button type="primary" style="display:block;margin-left:25px;" size="small" v-if="isUpdate"  @click="modifyContact1(item,index)">{{!ismodifyContact1[index]?'修改':'保存'}}</Button>
                            <ul class="common-ul">
                                <li><span  class="item-comm required"  style="width:120px;">姓名：</span><Input class="item-input" :class="{txt:!ismodifyContact1[index]}" :readonly='!ismodifyContact1[index]' v-model="item.concatName" :placeholder="ismodifyContact1[index]?'请输入...':''" /></li>
                                <li><span class="item-comm required"  style="width:120px;">关系：</span><Select v-if="ismodifyContact1[index]" v-model="item.concatRelation" class="item-input">
                                    <Option value="1">配偶</Option>
                                    <Option value="2">父母</Option>
                                    <Option value="3">子女</Option>
                                    <Option value="4">朋友</Option>
                                    <Option value="5">兄弟姐妹</Option>
                                    <Option value="9">其他</Option>
                                </Select>
                                    <Input class="item-input txt" v-if="!ismodifyContact1[index]" readonly :value="item.concatRelation=='1'?'配偶':item.concatRelation=='2'?'父母':item.concatRelation=='3'?'子女':item.concatRelation=='4'?'朋友':item.concatRelation=='5'?'兄弟姐妹':item.concatRelation=='9'?'其他':''"/></li>
                                <li><span class="item-comm required"  style="width:120px;">工作单位：</span><Input class="item-input" :class="{txt:!ismodifyContact1[index]}" :readonly='!ismodifyContact1[index]' v-model="item.company" :placeholder="ismodifyContact1[index]?'请输入...':''" /></li>
                                <li><span class="item-comm required" style="width:120px;">单位/家庭住址：</span><ChinaArea2 v-if="ismodifyContact1[index]" @change="chinaAreaChange3($event)" :parProvince="item.province" :parCity="item.city" :parArea="item.area"></ChinaArea2><Input style="margin-left:8px;" class="item-input" v-if="ismodifyContact1[index]" v-model="item.address" placeholder="请输入..." /><Input class="item-input txt" style="width:400px;" v-if="!ismodifyContact1[index]" readonly :value="item.pca"/></li>
                                <li><span class="item-comm required" style="width:120px;">联系电话：</span><Input class="item-input" :class="{txt:!ismodifyContact1[index]}" :readonly='!ismodifyContact1[index]' v-model="item.concatMobile" :placeholder="ismodifyContact1[index]?'请输入...':''" /></li>
                            </ul>
                        </div>
                        <div class="title-info">基础材料</div>
                        <div class="original-img">
                            <span style="margin-left:0;">
                                <viewer :images="identityInfo1"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in identityInfo1" :src="src" :key="index" alt="基础材料">
                                </viewer>
                            </span>
                        </div> 
                    </div>
                    <div class="person-name3-box" :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}" v-if="$route.query.name2=='WaitAuditingList'|| $route.query.name2=='WaitCheckAgain'|| $route.query.name2=='SignContract'">
                        <div class="title-info">个人信息</div>
                        <ul class="common-ul">
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('name')}" :data-sn="formatSnInfo('name')">姓名：</span><Input class="item-input txt" readonly v-model="modifyInfo1.name"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('identityCard')}" :data-sn="formatSnInfo('identityCard')">身份证号：</span><Input class="item-input txt" readonly v-model="modifyInfo1.identityCard"/></li>
                            <li><span class="item-comm required">活体认证：</span><Input class="item-input txt" readonly :value="'完成'"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('national')}" :data-sn="formatSnInfo('national')">民族：</span><Input class="item-input txt" readonly v-model="modifyInfo1.national"/></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('cardNumber')}" :data-sn="formatSnInfo('cardNumber')">银行卡号：</span><Input class="item-input txt" readonly v-model="modifyInfo1.cardNumber"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('bankName')}" :data-sn="formatSnInfo('bankName')">开户行：</span><Input class="item-input txt" readonly v-model="modifyInfo1.bankName"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('bankMobile')}" :data-sn="formatSnInfo('bankMobile')">银行预留手机：</span><Input class="item-input txt" readonly v-model="modifyInfo1.bankMobile"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('gov')}" :data-sn="formatSnInfo('gov')">签发机关：</span><Input class="item-input txt" readonly v-model="modifyInfo1.gov"/></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('signDate')}" :data-sn="formatSnInfo('signDate')">证件开始时间：</span><Input class="item-input txt" readonly :value="modifyInfo1.signDate"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('periodDate')}" :data-sn="formatSnInfo('periodDate')">证件有效期至：</span><Input class="item-input txt" readonly :value="modifyInfo1.periodDate"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('houseAddress')}" :data-sn="formatSnInfo('houseAddress')">户籍地址：</span><Input class="item-input txt" style="width:300px;" readonly v-model="modifyInfo1.houseAddress"/></li>
                        </ul>
                        <div class="title-info">补充信息</div>
                        <ul class="common-ul">
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('nowAddress')}" :data-sn="formatSnInfo('nowAddress')">现住地址：</span><Input class="item-input txt" style="width:400px;" readonly :value="modifyInfo1.nowAddress"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('source')}" :data-sn="formatSnInfo('source')">客户来源：</span><Input class="item-input txt" readonly :value="modifyInfo1.source=='1'?'中介':modifyInfo1.source=='2'?'客户推荐':modifyInfo1.source=='3'?'陌生拜访':modifyInfo1.source=='4'?'小区推广':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('startLiveDate')}" :data-sn="formatSnInfo('startLiveDate')">起始居住时间：</span><Input class="item-input txt"  readonly :value="modifyInfo1.startLiveDate"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('marry')}" :data-sn="formatSnInfo('marry')">婚姻状态：</span><Input class="item-input txt" readonly :value="modifyInfo1.marry=='1'?'已婚':modifyInfo1.marry=='2'?'未婚':modifyInfo1.marry=='3'?'离异':modifyInfo1.marry=='4'?'再婚':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('hasChild')}" :data-sn="formatSnInfo('hasChild')">有无子女：</span><Input class="item-input txt" readonly :value="modifyInfo1.hasChild=='1'?'有':modifyInfo1.hasChild=='2'?'无':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('supportRelate')}" :data-sn="formatSnInfo('supportRelate')">供养亲属：</span><Input class="item-input txt" readonly v-model="modifyInfo1.supportRelate"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('localMobile')}" :data-sn="formatSnInfo('localMobile')">本市地址电话：</span><Input class="item-input txt" readonly v-model="modifyInfo1.localMobile"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('educate')}" :data-sn="formatSnInfo('educate')">学历背景：</span><Input class="item-input txt" readonly :value="modifyInfo1.educate=='1'?'硕土以上':modifyInfo1.educate=='2'?'本科':modifyInfo1.educate=='3'?'专科':modifyInfo1.educate=='4'?'高中以下':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('companyName')}" :data-sn="formatSnInfo('companyName')">单位名称：</span><Input class="item-input txt" readonly v-model="modifyInfo1.companyName"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('companyAddress')}" :data-sn="formatSnInfo('companyAddress')">单位地址：</span><Input class="item-input txt" style="width:400px;" readonly :value="modifyInfo1.companyAddress"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('level')}" :data-sn="formatSnInfo('level')">职位级别：</span><Input class="item-input txt" readonly v-model="modifyInfo1.level"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('creditQuota')}" :data-sn="formatSnInfo('creditQuota')">信用卡额度(万元)：</span><Input class="item-input txt" readonly v-model="modifyInfo1.creditQuota"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('isTempcer')}" :data-sn="formatSnInfo('isTempcer')">暂住证：</span><Input class="item-input txt" readonly :value="modifyInfo1.isTempcer=='0'?'无':modifyInfo1.isTempcer=='1'?'有':''"/></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('baseSalary')}" :data-sn="formatSnInfo('baseSalary')">月基本薪资：</span><Input class="item-input txt" readonly v-model="modifyInfo1.baseSalary"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('otherSalary')}" :data-sn="formatSnInfo('otherSalary')">其他收入：</span><Input class="item-input txt" readonly v-model="modifyInfo1.otherSalary"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('startWorkTime')}" :data-sn="formatSnInfo('startWorkTime')">起始服务时间：</span><Input class="item-input txt" readonly :value="modifyInfo1.startWorkTime"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('companyType')}" :data-sn="formatSnInfo('companyType')">企业类型：</span><Input class="item-input txt"readonly :value="modifyInfo1.companyType=='1'?'非私营业主':modifyInfo1.companyType=='2'?'个体':modifyInfo1.companyType=='3'?'私营独资':modifyInfo1.companyType=='4'?'私营有限责任':modifyInfo1.companyType=='5'?'私营股份有限':modifyInfo1.companyType=='6'?'港资/外资':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('companyMobile')}" :data-sn="formatSnInfo('companyMobile')">单位电话：</span><Input class="item-input txt" readonly v-model="modifyInfo1.companyMobile"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('ownHouse')}" :data-sn="formatSnInfo('ownHouse')">住址拥有情况：</span><Input class="item-input txt" readonly :value="modifyInfo1.ownHouse=='1'?'自有':modifyInfo1.ownHouse=='2'?'直系亲属房屋':modifyInfo1.ownHouse=='3'?'租住':modifyInfo1.ownHouse=='4'?'单位分配':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('otherProperty')}" :data-sn="formatSnInfo('otherProperty')">名下其他财产：</span><Input class="item-input txt" readonly v-model="modifyInfo1.otherProperty"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('email')}" :data-sn="formatSnInfo('email')">电子邮箱：</span><Input class="item-input txt" readonly v-model="modifyInfo1.email"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('houseProperty')}" :data-sn="formatSnInfo('houseProperty')">房产：</span><Input class="item-input txt" readonly v-model="modifyInfo1.houseProperty"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('dept')}" :data-sn="formatSnInfo('dept')">所属部门：</span><Input class="item-input txt" readonly v-model="modifyInfo1.dept"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('nature')}" :data-sn="formatSnInfo('nature')">公司性质：</span><Input class="item-input txt"  readonly :value="modifyInfo1.nature=='1'?'机关及事业单位':modifyInfo1.nature=='2'?'国有股份':modifyInfo1.nature=='3'?'外资':modifyInfo1.nature=='4'?'合资':modifyInfo1.nature=='5'?'民营':modifyInfo1.nature=='6'?'私营':modifyInfo1.nature=='7'?'个体':modifyInfo1.nature=='8'?'社会团体':''"/></li>
                            <li><span class="item-comm required" :class="{mark:formatMarkInfo('firstCome')}" :data-sn="formatSnInfo('firstCome')">来本市时间：</span><Input class="item-input txt" readonly :value="modifyInfo1.firstCome"/></li>
                        </ul>
                        <div v-for="(item,index) in contacts1" :key="index">
                            <div class="title-info">第{{index+1}}联系人</div>
                            <ul class="common-ul">
                                <li><span  class="item-comm required"  style="width:120px;" :class="{mark:formatMarkInfo2('concatName',index)}" :data-sn="formatSnInfo2('concatName',index)">姓名：</span><Input class="item-input txt" readonly v-model="item.concatName"/></li>
                                <li><span class="item-comm required"  style="width:120px;" :class="{mark:formatMarkInfo2('concatRelation',index)}" :data-sn="formatSnInfo2('concatRelation',index)">关系：</span><Input class="item-input txt"  readonly :value="item.concatRelation=='1'?'配偶':item.concatRelation=='2'?'父母':item.concatRelation=='3'?'子女':item.concatRelation=='4'?'朋友':item.concatRelation=='5'?'兄弟姐妹':item.concatRelation=='9'?'其他':''"/></li>
                                <li><span class="item-comm required"  style="width:120px;" :class="{mark:formatMarkInfo2('company',index)}" :data-sn="formatSnInfo2('company',index)">工作单位：</span><Input class="item-input txt" readonly v-model="item.company"/></li>
                                <li><span class="item-comm required" style="width:120px;" :class="{mark:formatMarkInfo2('pca',index)}" :data-sn="formatSnInfo2('pca',index)">单位/家庭住址：</span><Input class="item-input txt" style="width:400px;" readonly :value="item.pca"/></li>
                                <li><span class="item-comm required" style="width:120px;" :class="{mark:formatMarkInfo2('concatMobile',index)}" :data-sn="formatSnInfo2('concatMobile',index)">联系电话：</span><Input class="item-input txt" readonly v-model="item.concatMobile"/></li>
                            </ul>
                        </div>
                        <div class="title-info">基础材料</div>
                        <div class="original-img">
                            <span style="margin-left:0;">
                                <viewer :images="identityInfo1"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in identityInfo1" :src="src" :key="index" alt="基础材料">
                                </viewer>
                            </span>
                        </div> 
                    </div>
                    <div class="person-name4-box" :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}" v-if="$route.query.name2!='WaitAuditingList' && $route.query.name2!='WaitCheckAgain'&& $route.query.name2!='SignContract' && $route.query.name2!='WaitStoreList'">
                        <div class="title-info">个人信息</div>
                        <ul class="common-ul">
                            <li><span class="item-comm required">姓名：</span><Input class="item-input txt" readonly v-model="modifyInfo1.name"/></li>
                            <li><span class="item-comm required">身份证号：</span><Input class="item-input txt" readonly v-model="modifyInfo1.identityCard"/></li>
                            <li><span class="item-comm required">活体认证：</span><Input class="item-input txt" readonly :value="'完成'"/></li>
                            <li><span class="item-comm required">民族：</span><Input class="item-input txt" readonly v-model="modifyInfo1.national"/></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required">银行卡号：</span><Input class="item-input txt" readonly v-model="modifyInfo1.cardNumber"/></li>
                            <li><span class="item-comm required">开户行：</span><Input class="item-input txt" readonly v-model="modifyInfo1.bankName"/></li>
                            <li><span class="item-comm required">银行预留手机：</span><Input class="item-input txt" readonly v-model="modifyInfo1.bankMobile"/></li>
                            <li><span class="item-comm required">签发机关：</span><Input class="item-input txt" readonly v-model="modifyInfo1.gov"/></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required">证件开始时间：</span><Input class="item-input txt" readonly :value="modifyInfo1.signDate"/></li>
                            <li><span class="item-comm required">证件有效期至：</span><Input class="item-input txt" readonly :value="modifyInfo1.periodDate"/></li>
                            <li><span class="item-comm required">户籍地址：</span><Input class="item-input txt" style="width:300px;" readonly v-model="modifyInfo1.houseAddress"/></li>
                        </ul>
                        <div class="title-info">补充信息</div>
                        <ul class="common-ul">
                            <li><span class="item-comm required">现住地址：</span><Input class="item-input txt" style="width:400px;" readonly :value="modifyInfo1.nowAddress"/></li>
                            <li><span class="item-comm required">客户来源：</span><Input class="item-input txt" readonly :value="modifyInfo1.source=='1'?'中介':modifyInfo1.source=='2'?'客户推荐':modifyInfo1.source=='3'?'陌生拜访':modifyInfo1.source=='4'?'小区推广':''"/></li>
                            <li><span class="item-comm required">起始居住时间：</span><Input class="item-input txt"  readonly :value="modifyInfo1.startLiveDate"/></li>
                            <li><span class="item-comm required">婚姻状态：</span><Input class="item-input txt" readonly :value="modifyInfo1.marry=='1'?'已婚':modifyInfo1.marry=='2'?'未婚':modifyInfo1.marry=='3'?'离异':modifyInfo1.marry=='4'?'再婚':''"/></li>
                            <li><span class="item-comm required">有无子女：</span><Input class="item-input txt" readonly :value="modifyInfo1.hasChild=='1'?'有':modifyInfo1.hasChild=='2'?'无':''"/></li>
                            <li><span class="item-comm required">供养亲属：</span><Input class="item-input txt" readonly v-model="modifyInfo1.supportRelate"/></li>
                            <li><span class="item-comm required">本市地址电话：</span><Input class="item-input txt" readonly v-model="modifyInfo1.localMobile"/></li>
                            <li><span class="item-comm required">学历背景：</span><Input class="item-input txt" readonly :value="modifyInfo1.educate=='1'?'硕土以上':modifyInfo1.educate=='2'?'本科':modifyInfo1.educate=='3'?'专科':modifyInfo1.educate=='4'?'高中以下':''"/></li>
                            <li><span class="item-comm required">单位名称：</span><Input class="item-input txt" readonly v-model="modifyInfo1.companyName"/></li>
                            <li><span class="item-comm required">单位地址：</span><Input class="item-input txt" style="width:400px;" readonly :value="modifyInfo1.companyAddress"/></li>
                            <li><span class="item-comm required">职位级别：</span><Input class="item-input txt" readonly v-model="modifyInfo1.level"/></li>
                            <li><span class="item-comm required">信用卡额度(万元)：</span><Input class="item-input txt" readonly v-model="modifyInfo1.creditQuota"/></li>
                            <li><span class="item-comm required">暂住证：</span><Input class="item-input txt" readonly :value="modifyInfo1.isTempcer=='0'?'无':modifyInfo1.isTempcer=='1'?'有':''"/></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span class="item-comm required">月基本薪资：</span><Input class="item-input txt" readonly v-model="modifyInfo1.baseSalary"/></li>
                            <li><span class="item-comm required">其他收入：</span><Input class="item-input txt" readonly v-model="modifyInfo1.otherSalary"/></li>
                            <li><span class="item-comm required">起始服务时间：</span><Input class="item-input txt" readonly :value="modifyInfo1.startWorkTime"/></li>
                            <li><span class="item-comm required">企业类型：</span><Input class="item-input txt"readonly :value="modifyInfo1.companyType=='1'?'非私营业主':modifyInfo1.companyType=='2'?'个体':modifyInfo1.companyType=='3'?'私营独资':modifyInfo1.companyType=='4'?'私营有限责任':modifyInfo1.companyType=='5'?'私营股份有限':modifyInfo1.companyType=='6'?'港资/外资':''"/></li>
                            <li><span class="item-comm required">单位电话：</span><Input class="item-input txt" readonly v-model="modifyInfo1.companyMobile"/></li>
                            <li><span class="item-comm required">住址拥有情况：</span><Input class="item-input txt" readonly :value="modifyInfo1.ownHouse=='1'?'自有':modifyInfo1.ownHouse=='2'?'直系亲属房屋':modifyInfo1.ownHouse=='3'?'租住':modifyInfo1.ownHouse=='4'?'单位分配':''"/></li>
                            <li><span class="item-comm required">名下其他财产：</span><Input class="item-input txt" readonly v-model="modifyInfo1.otherProperty"/></li>
                            <li><span class="item-comm required">电子邮箱：</span><Input class="item-input txt" readonly v-model="modifyInfo1.email"/></li>
                            <li><span class="item-comm required">房产：</span><Input class="item-input txt" readonly v-model="modifyInfo1.houseProperty"/></li>
                            <li><span class="item-comm required">所属部门：</span><Input class="item-input txt" readonly v-model="modifyInfo1.dept"/></li>
                            <li><span class="item-comm required">公司性质：</span><Input class="item-input txt"  readonly :value="modifyInfo1.nature=='1'?'机关及事业单位':modifyInfo1.nature=='2'?'国有股份':modifyInfo1.nature=='3'?'外资':modifyInfo1.nature=='4'?'合资':modifyInfo1.nature=='5'?'民营':modifyInfo1.nature=='6'?'私营':modifyInfo1.nature=='7'?'个体':modifyInfo1.nature=='8'?'社会团体':''"/></li>
                            <li><span class="item-comm required">来本市时间：</span><Input class="item-input txt" readonly :value="modifyInfo1.firstCome"/></li>
                        </ul>
                        <div v-for="(item,index) in contacts1" :key="index">
                            <div class="title-info">第{{index+1}}联系人</div>
                            <ul class="common-ul">
                                <li><span  class="item-comm required"  style="width:120px;">姓名：</span><Input class="item-input txt" readonly v-model="item.concatName"/></li>
                                <li><span class="item-comm required"  style="width:120px;">关系：</span><Input class="item-input txt"  readonly :value="item.concatRelation=='1'?'配偶':item.concatRelation=='2'?'父母':item.concatRelation=='3'?'子女':item.concatRelation=='4'?'朋友':item.concatRelation=='5'?'兄弟姐妹':item.concatRelation=='9'?'其他':''"/></li>
                                <li><span class="item-comm required"  style="width:120px;">工作单位：</span><Input class="item-input txt" readonly v-model="item.company"/></li>
                                <li><span class="item-comm required" style="width:120px;">单位/家庭住址：</span><Input class="item-input txt" style="width:400px;" readonly :value="item.pca"/></li>
                                <li><span class="item-comm required" style="width:120px;">联系电话：</span><Input class="item-input txt" readonly v-model="item.concatMobile"/></li>
                            </ul>
                        </div>
                        <div class="title-info">基础材料</div>
                        <div class="original-img">
                            <span style="margin-left:0;">
                                <viewer :images="identityInfo1"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in identityInfo1" :src="src" :key="index" alt="基础材料">
                                </viewer>
                            </span>
                        </div> 
                    </div>    
                </TabPane>
                <TabPane label="车辆信息" name="name2">
                    <div class="name2-box" :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}" v-if="$route.query.name2=='WaitStoreList'&& isReturn">
                        <!-- 基础信息 -->
                        <div class="title-info">行驶证<Button type="primary" :ghost="!ismodify100" v-if="isCarUpdate" style="margin-left:100px;" size="small" @click="modify100Btn">{{ismodify100?'保存':'修改'}}</Button></div>   
                        <div class="item-div">
                            <span class="item-comm required" :class="{mark:formatMark('plateNumber')}">车牌号：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('plateNumber')}" :readonly="!ismodify100 || !formatMark('plateNumber')" v-model="modify100.plateNumber" :placeholder="(ismodify100 && formatMark('plateNumber'))?'请输入...':''" />
                            <span class="item-comm required" :class="{mark:formatMark('type')}">车辆类型：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('type')}" :readonly="!ismodify100 || !formatMark('type')" v-model="modify100.type" :placeholder="(ismodify100 && formatMark('type'))?'请输入...':''" />
                            <span class="item-comm required" :class="{mark:formatMark('owner')}">所有人：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('owner')}" :readonly="!ismodify100 || !formatMark('owner')" v-model="modify100.owner" :placeholder="(ismodify100 && formatMark('owner'))?'请输入...':''" />
                        </div>    
                        <div class="item-div">
                            <span class="item-comm required">使用性质：</span><Input class="item-input txt" readonly :value="modify100.useNature=='1'?'营运用车':modify100.useNature=='2'?'出租车':modify100.useNature=='3'?'公务用车':modify100.useNature=='4'?'家庭用车':modify100.useNature=='5'?'其它':''"/>
                            <span class="item-comm required">品牌型号：</span><Input class="item-input txt" readonly v-model="modify100.brandModel"/>
                            <span class="item-comm required" :class="{mark:formatMark('vin')}">车辆识别代码：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('vin')}" :readonly="!ismodify100 || !formatMark('vin')" v-model="modify100.vin" :placeholder="(ismodify100 && formatMark('vin'))?'请输入...':''" />
                        </div>    
                        <div class="item-div">    
                            <span class="item-comm required" :class="{mark:formatMark('passenger')}">核载人数(人)：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('passenger')}" :readonly="!ismodify100 || !formatMark('passenger')" v-model="modify100.passenger" :placeholder="(ismodify100 && formatMark('passenger'))?'请输入...':''" />
                        </div>
                        <div class="title-info">绿本</div>
                        <div class="item-div">
                            <span class="item-comm required" :class="{mark:formatMark('certificateNumber')}">证书编号：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('certificateNumber')}" :readonly="!ismodify100 || !formatMark('certificateNumber')" v-model="modify100.certificateNumber" :placeholder="(ismodify100 && formatMark('certificateNumber'))?'请输入...':''"/>
                            <span class="item-comm required" :class="{mark:formatMark('source')}">来源：</span><Select v-if="ismodify100 && formatMark('source')" v-model="modify100.source" class="item-input">
                                    <Option value="1">国产</Option>
                                    <Option value="2">进口</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify100 || !formatMark('source')" readonly :value="modify100.source=='1'?'国产':modify100.source=='2'?'进口':''"/>
                            <span class="item-comm required" :class="{mark:formatMark('power')}">发动机功率(kw)：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('power')}" :readonly="!ismodify100 || !formatMark('power')" v-model="modify100.power" :placeholder="(ismodify100 && formatMark('power'))?'请输入...':''" />
                        </div>    
                        <div class="item-div">    
                            <span class="item-comm required" :class="{mark:formatMark('brand')}">车辆品牌：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('brand')}" :readonly="!ismodify100 || !formatMark('brand')" v-model="modify100.brand" :placeholder="(ismodify100 && formatMark('brand'))?'请输入...':''"/>
                            <span class="item-comm required" :class="{mark:formatMark('model')}">车辆型号：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('model')}" :readonly="!ismodify100 || !formatMark('model')" v-model="modify100.model" :placeholder="(ismodify100 && formatMark('model'))?'请输入...':''" />
                            <span class="item-comm required" :class="{mark:formatMark('color')}">车身颜色：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('color')}" :readonly="!ismodify100 || !formatMark('color')" v-model="modify100.color" :placeholder="(ismodify100 && formatMark('color'))?'请输入...':''"/>
                        </div>   
                        <div class="item-div">      
                            <span class="item-comm required" :class="{mark:formatMark('displace')}">排量(ml)：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('displace')}" :readonly="!ismodify100 || !formatMark('displace')" v-model="modify100.displace" :placeholder="(ismodify100 && formatMark('displace'))?'请输入...':''" />
                        </div>
                        <div class="title-info">报告</div> 
                        <div class="item-div">
                            <span class="item-comm required" :class="{mark:formatMark('enginerNumber')}">发动机号码：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('enginerNumber')}" :readonly="!ismodify100 || !formatMark('enginerNumber')" v-model="modify100.enginerNumber" :placeholder="(ismodify100 && formatMark('enginerNumber'))?'请输入...':''" />
                            <span class="item-comm required" :class="{mark:formatMark('cylinder')}">缸数(缸)：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('cylinder')}" :readonly="!ismodify100 || !formatMark('cylinder')" v-model="modify100.cylinder" :placeholder="(ismodify100 && formatMark('cylinder'))?'请输入...':''" />
                        </div>    
                        <div class="item-div">   
                            <span class="item-comm required" :class="{mark:formatMark('mile')}">行驶里程(万)：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('mile')}" :readonly="!ismodify100 || !formatMark('mile')" v-model="modify100.mile" :placeholder="(ismodify100 && formatMark('mile'))?'请输入...':''"  />
                            <span class="item-comm required" :class="{mark:formatMark('fuelNumber')}">燃料编号：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('fuelNumber')}" :readonly="!ismodify100 || !formatMark('fuelNumber')" v-model="modify100.fuelNumber" :placeholder="(ismodify100 && formatMark('fuelNumber'))?'请输入...':''"/>
                        </div> 
                        <div class="item-div">      
                            <span class="item-comm required" :class="{mark:formatMark('hasInspect')}">有无年检：</span><Select v-if="ismodify100 &&formatMark('hasInspect')" v-model="modify100.hasInspect" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select><Input class="item-input txt" v-if="!ismodify100 || !formatMark('hasInspect')" readonly :value="modify100.hasInspect=='0'?'无':modify100.hasInspect=='1'?'有':''"/>
                            <span v-show="modify100.hasInspect=='1'">
                                <span class="item-comm required" :class="{mark:formatMark('insEndDate') || formatMark('hasInspect')}">有效期结束时间：</span><DatePicker v-if="ismodify100 && formatMark('insEndDate')" v-model="modify100.insEndDate" type="month" placeholder="选择年检结束时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify100 || !formatMark('insEndDate')" readonly :value="modify100.insEndDate"/>
                            </span> 
                        </div>    
                        <div class="item-div">    
                            <span class="item-comm required" :class="{mark:formatMark('hasHighInsurance')}">有无交强险：</span><Select v-if="ismodify100 && formatMark('hasHighInsurance')" v-model="modify100.hasHighInsurance" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select><Input class="item-input txt" v-if="!ismodify100 || !formatMark('hasHighInsurance')" readonly :value="modify100.hasHighInsurance=='0'?'无':modify100.hasHighInsurance=='1'?'有':''"/>
                            <span v-show="modify100.hasHighInsurance=='1'">
                                <span class="item-comm required" :class="{mark:formatMark('highStartDate') || formatMark('hasHighInsurance')}">有效期开始时间：</span><DatePicker v-if="ismodify100 && formatMark('highStartDate')" v-model="modify100.highStartDate" type="date" placeholder="选择交强险开始时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify100 || !formatMark('highStartDate')" readonly :value="modify100.highStartDate"/>
                                <span class="item-comm required" :class="{mark:formatMark('highEndDate') || formatMark('hasHighInsurance')}">有效期结束时间：</span><DatePicker v-if="ismodify100 && formatMark('highEndDate')" v-model="modify100.highEndDate" type="date" placeholder="选择交强险结束时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify100 || !formatMark('highEndDate')" readonly :value="modify100.highEndDate"/>
                            </span>
                        </div>  
                        <div class="item-div">       
                            <span class="item-comm required" :class="{mark:formatMark('hasBusyInsurance')}">有无商业险：</span><Select v-if="ismodify100 && formatMark('hasBusyInsurance')" v-model="modify100.hasBusyInsurance" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select><Input class="item-input txt" v-if="!ismodify100 || !formatMark('hasBusyInsurance')" readonly :value="modify100.hasBusyInsurance=='0'?'无':modify100.hasBusyInsurance=='1'?'有':''"/>
                            <span v-show="modify100.hasBusyInsurance=='1'">    
                                <span class="item-comm required" :class="{mark:formatMark('busyStartDate') || formatMark('hasBusyInsurance')}">有效期开始时间：</span><DatePicker v-if="ismodify100 && formatMark('busyStartDate')" v-model="modify100.busyStartDate" type="date" placeholder="选择商业险开始时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify100 || !formatMark('busyStartDate')" readonly :value="modify100.busyStartDate"/>
                                <span class="item-comm required" :class="{mark:formatMark('busyEndDate') || formatMark('hasBusyInsurance')}">有效期结束时间：</span><DatePicker v-if="ismodify100 && formatMark('busyEndDate')" v-model="modify100.busyEndDate" type="date" placeholder="选择商业险结束时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify100 || !formatMark('busyEndDate')" readonly :value="modify100.busyEndDate"/>
                            </span>  
                        </div>
                        <div class="item-div">     
                            <span class="item-comm required" :class="{mark:formatMark('emissStand')}">排放标准：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('emissStand')}" :readonly="!ismodify100 || !formatMark('emissStand')" v-model="modify100.emissStand" :placeholder="(ismodify100 && formatMark('emissStand'))?'请输入...':''" />
                            <span class="item-comm required" :class="{mark:formatMark('transmission')}">变速器形式：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('transmission')}" :readonly="!ismodify100 || !formatMark('transmission')" v-model="modify100.transmission" :placeholder="(ismodify100 && formatMark('transmission'))?'请输入...':''" />
                            <span class="item-comm required" :class="{mark:formatMark('driveModel')}">驱动方式：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('driveModel')}" :readonly="!ismodify100 || !formatMark('driveModel')" v-model="modify100.driveModel" :placeholder="(ismodify100 && formatMark('driveModel'))?'请输入...':''" />
                            <span class="item-comm required" :class="{mark:formatMark('hasAbs')}">是否有abs：</span><Select v-if="ismodify100 && formatMark('hasAbs')" v-model="modify100.hasAbs" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify100 || !formatMark('hasAbs')" readonly :value="modify100.hasAbs=='0'?'否':modify100.hasAbs=='1'?'是':''"/>
                        </div>  
                        <div class="item-div">     
                            <span class="item-comm required" :class="{mark:formatMark('otherImpConfig')}">其他重要配置：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('otherImpConfig')}" :readonly="!ismodify100 || !formatMark('otherImpConfig')" v-model="modify100.otherImpConfig" :placeholder="(ismodify100 && formatMark('otherImpConfig'))?'请输入...':''" />
                            <span class="item-comm required">是否为事故车：</span>
                            <Input class="item-input txt" readonly :value="modify100.isAccident=='0'?'否':modify100.isAccident=='1'?'是':''"/>
                            <span class="item-comm required" :class="{mark:formatMark('deduction')}">扣分(分)：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('deduction')}" :readonly="!ismodify100 || !formatMark('deduction')" v-model="modify100.deduction" :placeholder="(ismodify100 && formatMark('deduction'))?'请输入...':''" />
                        </div>  
                        <div class="item-div">      
                            <span class="item-comm required" :class="{mark:formatMark('fine')}">罚款(元)：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('fine')}" :readonly="!ismodify100 || !formatMark('fine')" v-model="modify100.fine" :placeholder="(ismodify100 && formatMark('fine'))?'请输入...':''"/> 
                            <span class="item-comm required">损伤位置及状况：</span><Input class="item-input txt" readonly :value="modify100.damage"/>
                            <span class="item-comm required">是否收押行驶证：</span><Input class="item-input txt" readonly :value="modify100.hasCustodyTraveler=='0'?'否':modify100.hasCustodyTraveler=='1'?'是':''"/>
                        </div>  
                        <div class="item-div">       
                            <span class="item-comm required">是否收押机动车登记证书：</span>
                            <Input class="item-input txt" readonly :value="modify100.hasCustodyRegister=='0'?'否':modify100.hasCustodyRegister=='1'?'是':''"/>
                            <span class="item-comm required">是否收押交强险保单：</span>
                            <Input class="item-input txt" readonly :value="modify100.hasCustodyHigh=='0'?'否':modify100.hasCustodyHigh=='1'?'是':''"/>
                            <span class="item-comm required" :class="{mark:formatMark('hasCustodyBusy')}">是否收押商业保险单：</span><Select v-if="ismodify100 && formatMark('hasCustodyBusy')" v-model="modify100.hasCustodyBusy" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify100 || !formatMark('hasCustodyBusy')" readonly :value="modify100.hasCustodyBusy=='0'?'否':modify100.hasCustodyBusy=='1'?'是':''"/>
                        </div>  
                        <div class="item-div">      
                            <span class="item-comm required">收押其它：</span><Input class="item-input txt" readonly :value="modify100.custodyOther"/>
                            <span class="item-comm required" :class="{mark:formatMark('examinerSign')}">验车人签字：</span><Input class="item-input" :class="{txt:!ismodify100 || !formatMark('examinerSign')}" :readonly="!ismodify100 || !formatMark('examinerSign')" v-model="modify100.examinerSign" :placeholder="(ismodify100 && formatMark('examinerSign'))?'请输入...':''" />
                            <span class="item-comm required" :class="{mark:formatMark('examinerDate')}">验车日期：</span><DatePicker v-if="ismodify100 && formatMark('examinerDate')" v-model="modify100.examinerDate" type="date" placeholder="选择验车日期" class="item-input"></DatePicker><Input class="item-input txt" v-if="!ismodify100 || !formatMark('examinerDate')" readonly :value="modify100.examinerDate"/>
                        </div>  
                        <!-- 登记摘要信息栏  -->
                        <div class="title-info" style="position:relative;"><span style="vertical-align:middle;">登记摘要信息栏(必填) </span><Icon type="md-add-circle"  v-if="ismodify3" @click="addItem" size="18" style="cursor:pointer;position:absolute;left:140px;top:3px;" title="新增"/><Button type="primary" v-if="isCarUpdate" style="margin-left:31px;" size="small" :ghost="!ismodify3" @click="modify3Btn">{{ismodify3?'保存':'修改'}}</Button></div>
                        <span v-for="(item,index) in recordVO" :key="index">
                            <div class="item-div">
                                <span class="item-comm required" :class="{mark:formatMark2('owner',index)}">拥有者：</span><Input class="item-input" :class="{txt:!ismodify3 || !formatMark2('owner',index)}" :readonly="!ismodify3 || !formatMark2('owner',index)" v-model="item.owner" :placeholder="(ismodify3 && formatMark2('owner',index))?'请输入...':''"/>
                                <span style="position:relative">
                                    <span class="item-comm required" :class="{mark:formatMark2('registerDate',index)}">登记日期：</span><DatePicker v-if="ismodify3 && formatMark2('registerDate',index)" v-model="item.registerDate" type="date" placeholder="选择登记日期" class="item-input"></DatePicker><Input class="item-input txt" v-if="!ismodify3 || !formatMark2('registerDate',index)" readonly :value="item.registerDate"/>
                                    <Icon type="ios-close-circle" @click="deleteItem(index)" size="16" v-if="ismodify3" style="position:absolute;right:-25px;top:-8px;cursor:pointer;" title="删除"/>
                                </span>
                            </div>    
                            <hr style="background-color:#ddd;height:1px;border:none;" v-show="index!==recordVO.length-1"/> 
                        </span>  
                        <!-- 车辆证件照片 -->
                        <div class="title-info">车辆证件照片</div>
                        <div v-if="isCarUpdate">
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
                        <div v-if="!isCarUpdate">
                            <span class="span-width">
                                <span class="my-title-comm">行驶证正面：</span>
                                <viewer :images="modify5Img[0]?modify5Img[0].split(' '):[]"><img class="my-img" :src="modify5Img[0]" alt="行驶证正面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">行驶证反面：</span>
                                <viewer :images="modify5Img[1]?modify5Img[1].split(' '):[]"><img class="my-img" :src="modify5Img[1]" alt="行驶证反面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">驾驶证正面：</span>
                                <viewer :images="modify5Img[2]?modify5Img[2].split(' '):[]"><img class="my-img" :src="modify5Img[2]" alt="驾驶证正面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">驾驶证反面：</span>
                                <viewer :images="modify5Img[3]?modify5Img[3].split(' '):[]"><img class="my-img" :src="modify5Img[3]" alt="驾驶证反面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第1页：</span>
                                <viewer :images="modify5Img[4]?modify5Img[4].split(' '):[]"><img class="my-img" :src="modify5Img[4]" alt="绿本第1页">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第2页：</span>
                                    <viewer :images="modify5Img[5]?modify5Img[5].split(' '):[]"><img class="my-img" :src="modify5Img[5]" alt="绿本第2页">
                                </viewer>
                                </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第3页：</span>
                                <viewer :images="modify5Img[6]?modify5Img[6].split(' '):[]"><img class="my-img" :src="modify5Img[6]" alt="绿本第3页">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第4页：</span>
                                <viewer :images="modify5Img[7]?modify5Img[7].split(' '):[]"><img class="my-img" :src="modify5Img[7]" alt="绿本第4页">
                                </viewer>
                            </span> 
                        </div>
                        <div class="title-info">车300照片</div>
                        <div>
                            <viewer :images="auditPicsmyUploadList"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in auditPicsmyUploadList" :src="src" :key="index" alt="车300照片"></viewer>
                        </div>  
                        <div class="title-info">车辆补充资料</div>
                        <div style="padding-left:20px;">
                            <div>
                                <viewer :images="autoOtherFiles1"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in autoOtherFiles1" :src="src" :key="index" alt="车辆补充资料"></viewer>
                            </div>
                        </div>    
                    </div>
                    <div class="name3-box" :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}" v-if="($route.query.name2=='WaitStoreList'&& !isReturn) || $route.query.name2=='WaitConfirmList'">
                        <!-- 基础信息 -->
                        <div class="title-info">行驶证<Button type="primary" :ghost="!ismodify100" style="margin-left:100px;" size="small" @click="modify100Btn">{{ismodify100?'保存':'修改'}}</Button></div> 
                        <div class="item-div">
                            <span class="item-comm required">车牌号：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.plateNumber" :placeholder="ismodify100?'请输入...':''" />
                            <span class="item-comm required">车辆类型：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.type" :placeholder="ismodify100?'请输入...':''" />
                            <span class="item-comm required">所有人：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.owner" :placeholder="ismodify100?'请输入...':''" />
                        </div>     
                        <div class="item-div">     
                            <span class="item-comm required">使用性质：</span><Input class="item-input txt" readonly :value="modify100.useNature=='1'?'营运用车':modify100.useNature=='2'?'出租车':modify100.useNature=='3'?'公务用车':modify100.useNature=='4'?'家庭用车':modify100.useNature=='5'?'其它':''"/>
                            <span class="item-comm required">品牌型号：</span><Input class="item-input txt" readonly v-model="modify100.brandModel"/>
                            <span class="item-comm required">车辆识别代码：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.vin" :placeholder="ismodify100?'请输入...':''" />
                        </div>     
                        <div class="item-div">        
                            <span class="item-comm required">发动机号码：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.enginerNumber" :placeholder="ismodify100?'请输入...':''" />
                            <span class="item-comm required">核载人数(人)：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.passenger" :placeholder="ismodify100?'请输入...':''" />
                        </div>
                        <div class="title-info">绿本</div>
                        <div class="item-div">
                            <span class="item-comm required">证书编号：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.certificateNumber" :placeholder="ismodify100?'请输入...':''"/>
                            <span class="item-comm required">来源：</span><Select v-if="ismodify100" v-model="modify100.source" class="item-input">
                                    <Option value="1">国产</Option>
                                    <Option value="2">进口</Option>
                                </Select><Input class="item-input txt" v-if="!ismodify100" readonly :value="modify100.source=='1'?'国产':modify100.source=='2'?'进口':''"/>
                            <span class="item-comm required">发动机功率(kw)：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.power" :placeholder="ismodify100?'请输入...':''" />     
                        </div>     
                        <div class="item-div">  
                            <span class="item-comm required">车辆品牌：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.brand" :placeholder="ismodify100?'请输入...':''"/>     
                            <span class="item-comm required">车辆型号：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.model" :placeholder="ismodify100?'请输入...':''" />
                            <span class="item-comm required">车身颜色：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.color" :placeholder="ismodify100?'请输入...':''"/>
                        </div>     
                        <div class="item-div">           
                            <span class="item-comm required">排量(ml)：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.displace" :placeholder="ismodify100?'请输入...':''" />    
                        </div>
                        <div class="title-info">报告</div>
                        <div class="item-div">
                            <span class="item-comm required">缸数(缸)：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.cylinder" :placeholder="ismodify100?'请输入...':''" />    
                            <span class="item-comm required">行驶里程(万)：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.mile" :placeholder="ismodify100?'请输入...':''"  />
                            <span class="item-comm required">燃料编号：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.fuelNumber" :placeholder="ismodify100?'请输入...':''"/>
                        </div>
                        <div class="item-div">    
                            <span class="item-comm required">有无年检：</span><Select v-if="ismodify100" v-model="modify100.hasInspect" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select><Input class="item-input txt" v-if="!ismodify100" readonly :value="modify100.hasInspect=='0'?'无':modify100.hasInspect=='1'?'有':''"/>
                            <span v-show="modify100.hasInspect=='1'">
                                <span class="item-comm required">有效期结束时间：</span><DatePicker v-if="ismodify100" v-model="modify100.insEndDate" type="month" placeholder="选择年检结束时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify100" readonly :value="modify100.insEndDate"/>
                            </span>
                        </div>
                        <div class="item-div">     
                            <span class="item-comm required">有无交强险：</span><Select v-if="ismodify100" v-model="modify100.hasHighInsurance" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select><Input class="item-input txt" v-if="!ismodify100" readonly :value="modify100.hasHighInsurance=='0'?'无':modify100.hasHighInsurance=='1'?'有':''"/>
                            <span v-show="modify100.hasHighInsurance=='1'">
                                <span class="item-comm required">有效期开始时间：</span><DatePicker v-if="ismodify100" v-model="modify100.highStartDate" type="date" placeholder="选择交强险开始时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify100" readonly :value="modify100.highStartDate"/>
                                <span class="item-comm required">有效期结束时间：</span><DatePicker v-if="ismodify100" v-model="modify100.highEndDate" type="date" placeholder="选择交强险结束时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify100" readonly :value="modify100.highEndDate"/>
                            </span>
                        </div>
                        <div class="item-div">     
                            <span class="item-comm required">有无商业险：</span><Select v-if="ismodify100" v-model="modify100.hasBusyInsurance" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select><Input class="item-input txt" v-if="!ismodify100" readonly :value="modify100.hasBusyInsurance=='0'?'无':modify100.hasBusyInsurance=='1'?'有':''"/>
                            <span v-show="modify100.hasBusyInsurance=='1'">    
                                <span class="item-comm required">有效期开始时间：</span><DatePicker v-if="ismodify100" v-model="modify100.busyStartDate" type="date" placeholder="选择商业险开始时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify100" readonly :value="modify100.busyStartDate"/>
                                <span class="item-comm required">有效期结束时间：</span><DatePicker v-if="ismodify100" v-model="modify100.busyEndDate" type="date" placeholder="选择商业险结束时间" class="item-input"></DatePicker>
                                <Input class="item-input txt" v-if="!ismodify100" readonly :value="modify100.busyEndDate"/>
                            </span> 
                        </div>
                        <div class="item-div">     
                            <span class="item-comm required">排放标准：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.emissStand" :placeholder="ismodify100?'请输入...':''" />
                            <span class="item-comm required">变速器形式：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.transmission" :placeholder="ismodify100?'请输入...':''" />
                            <span class="item-comm required">驱动方式：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.driveModel" :placeholder="ismodify100?'请输入...':''" />
                        </div>
                        <div class="item-div">         
                            <span class="item-comm required">是否有abs：</span><Select v-if="ismodify100" v-model="modify100.hasAbs" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify100" readonly :value="modify100.hasAbs=='0'?'否':modify100.hasAbs=='1'?'是':''"/>
                            <span class="item-comm required">其他重要配置：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.otherImpConfig" :placeholder="ismodify100?'请输入...':''" />
                            <span class="item-comm required">是否为事故车：</span><Input class="item-input txt" readonly :value="modify100.isAccident=='0'?'否':modify100.isAccident=='1'?'是':''"/>
                        </div>
                        <div class="item-div">         
                            <span class="item-comm required">扣分(分)：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.deduction" :placeholder="ismodify100?'请输入...':''" />
                            <span class="item-comm required">罚款(元)：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.fine" :placeholder="ismodify100?'请输入...':''"/> 
                            <span class="item-comm required">损伤位置及状况：</span><Input class="item-input txt" readonly :value="modify100.damage"/>
                        </div>
                        <div class="item-div">         
                            <span class="item-comm required">是否收押行驶证：</span><Input class="item-input txt" readonly :value="modify100.hasCustodyTraveler=='0'?'否':modify100.hasCustodyTraveler=='1'?'是':''"/>
                            <span class="item-comm required">是否收押机动车登记证书：</span><Input class="item-input txt" readonly :value="modify100.hasCustodyRegister=='0'?'否':modify100.hasCustodyRegister=='1'?'是':''"/>
                            <span class="item-comm required">是否收押交强险保单：</span><Input class="item-input txt" readonly :value="modify100.hasCustodyHigh=='0'?'否':modify100.hasCustodyHigh=='1'?'是':''"/>
                        </div>
                        <div class="item-div">         
                            <span class="item-comm required">是否收押商业保险单：</span><Select v-if="ismodify100" v-model="modify100.hasCustodyBusy" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify100" readonly :value="modify100.hasCustodyBusy=='0'?'否':modify100.hasCustodyBusy=='1'?'是':''"/>
                            <span class="item-comm required">收押其它：</span><Input class="item-input txt" readonly :value="modify100.custodyOther"/>
                            <span class="item-comm required">验车人签字：</span><Input class="item-input" :class="{txt:!ismodify100}" :readonly="!ismodify100" v-model="modify100.examinerSign" :placeholder="ismodify100?'请输入...':''" />
                        </div>
                        <div class="item-div">     
                            <span class="item-comm required">验车日期：</span><DatePicker v-if="ismodify100" v-model="modify100.examinerDate" type="date" placeholder="选择验车日期" class="item-input"></DatePicker><Input class="item-input txt" v-if="!ismodify100" readonly :value="modify100.examinerDate"/>
                        </div>
                        <!-- 登记摘要信息栏  -->
                        <div class="title-info" style="position:relative;"><span style="vertical-align:middle;">登记摘要信息栏(必填) </span><Icon type="md-add-circle"  v-if="ismodify3" @click="addItem" size="18" style="cursor:pointer;position:absolute;left:140px;top:3px;" title="新增"/><Button type="primary" v-if="name=='WaitStoreList'" style="margin-left:31px;" size="small" :ghost="!ismodify3" @click="modify3Btn">{{ismodify3?'保存':'修改'}}</Button></div>
                        <span v-for="(item,index) in recordVO" :key="index">
                            <div class="item-div">
                                <span class="item-comm required">拥有者：</span><Input class="item-input" :class="{txt:!ismodify3}" :readonly='!ismodify3' v-model="item.owner" :placeholder="ismodify3?'请输入...':''" />
                                <span style="position:relative">
                                    <span class="item-comm required">登记日期：</span><DatePicker v-if="ismodify3" v-model="item.registerDate" type="date" placeholder="选择登记日期" class="item-input"></DatePicker><Input class="item-input txt" v-if="!ismodify3" readonly :value="item.registerDate"/>
                                    <Icon type="ios-close-circle" @click="deleteItem(index)" size="16" v-if="ismodify3" style="position:absolute;right:-25px;top:-8px;cursor:pointer;" title="删除"/>
                                </span>
                            </div>   
                            <hr style="background-color:#ddd;height:1px;border:none;" v-show="index!==recordVO.length-1"/>  
                        </span>  
                        <!-- 车辆证件照片 -->
                        <div class="title-info">车辆证件照片</div>
                        <div>
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
                        <div class="title-info">车300照片</div>
                        <div>
                            <viewer :images="auditPicsmyUploadList"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in auditPicsmyUploadList" :src="src" :key="index" alt="车300照片"></viewer>
                        </div>
                        <div class="title-info">车辆补充资料</div>
                        <div style="padding-left:20px;">
                            <div>
                                <viewer :images="autoOtherFiles1"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in autoOtherFiles1" :src="src" :key="index" alt="车辆补充资料"></viewer>
                            </div>
                        </div>    
                    </div>
                    <div class="name4-box" :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}" v-if="$route.query.name2=='WaitAuditingList'">
                        <!-- 基础信息 -->
                        <div class="title-info">行驶证</div>   
                        <div class="item-div">
                            <span class="item-comm required" :class="{mark:formatMark('plateNumber')}" :data-sn="formatSn('plateNumber')">车牌号：</span><Input class="item-input txt" readonly v-model="modify100.plateNumber"/>
                            <span class="item-comm required" :class="{mark:formatMark('type')}" :data-sn="formatSn('type')">车辆类型：</span><Input class="item-input txt" readonly v-model="modify100.type" />
                            <span class="item-comm required" :class="{mark:formatMark('owner')}" :data-sn="formatSn('owner')">所有人：</span><Input class="item-input txt" readonly v-model="modify100.owner"/>
                        </div> 
                        <div class="item-div">    
                            <span class="item-comm required">使用性质：</span><Input class="item-input txt" readonly :value="modify100.useNature=='1'?'营运用车':modify100.useNature=='2'?'出租车':modify100.useNature=='3'?'公务用车':modify100.useNature=='4'?'家庭用车':modify100.useNature=='5'?'其它':''"/>
                            <span class="item-comm required">品牌型号：</span><Input class="item-input txt" readonly v-model="modify100.brandModel"/>
                            <span class="item-comm required" :class="{mark:formatMark('vin')}" :data-sn="formatSn('vin')">车辆识别代码：</span><Input class="item-input txt" readonly v-model="modify100.vin"/>
                        </div> 
                        <div class="item-div">       
                            <span class="item-comm required" :class="{mark:formatMark('enginerNumber')}" :data-sn="formatSn('enginerNumber')">发动机号码：</span><Input class="item-input txt" readonly v-model="modify100.enginerNumber"/>
                            <span class="item-comm required" :class="{mark:formatMark('passenger')}" :data-sn="formatSn('passenger')">核载人数(人)：</span><Input class="item-input txt" readonly v-model="modify100.passenger"/> 
                        </div>
                        <div class="title-info">绿本</div>   
                        <div class="item-div">
                            <span class="item-comm required" :class="{mark:formatMark('identityCard')}" :data-sn="formatSn('certificateNumber')">证书编号：</span><Input class="item-input txt" readonly v-model="modify100.certificateNumber"/>
                            <span class="item-comm required" :class="{mark:formatMark('source')}" :data-sn="formatSn('source')">来源：</span><Input class="item-input txt" v-if="!ismodify100 || !formatMark('source')" readonly :value="modify100.source=='1'?'国产':modify100.source=='2'?'进口':''"/>
                            <span class="item-comm required" :class="{mark:formatMark('power')}" :data-sn="formatSn('power')">发动机功率(kw)：</span><Input class="item-input txt" readonly v-model="modify100.power"/>
                        </div> 
                        <div class="item-div">    
                            <span class="item-comm required" :class="{mark:formatMark('brand')}" :data-sn="formatSn('brand')">车辆品牌：</span><Input class="item-input txt" readonly v-model="modify100.brand"/>   
                            <span class="item-comm required" :class="{mark:formatMark('model')}" :data-sn="formatSn('model')">车辆型号：</span><Input class="item-input txt" readonly v-model="modify100.model"/>
                            <span class="item-comm required" :class="{mark:formatMark('color')}" :data-sn="formatSn('color')">车身颜色：</span><Input class="item-input txt" readonly v-model="modify100.color"/>
                        </div> 
                        <div class="item-div">       
                            <span class="item-comm required" :class="{mark:formatMark('displace')}" :data-sn="formatSn('displace')">排量(ml)：</span><Input class="item-input txt" readonly v-model="modify100.displace"/>
                        </div>   
                        <div class="title-info">报告</div>   
                        <div class="item-div">    
                            <span class="item-comm required" :class="{mark:formatMark('cylinder')}" :data-sn="formatSn('cylinder')">缸数(缸)：</span><Input class="item-input txt" readonly v-model="modify100.cylinder"/>
                            <span class="item-comm required" :class="{mark:formatMark('mile')}" :data-sn="formatSn('mile')">行驶里程(万)：</span><Input class="item-input txt" readonly v-model="modify100.mile"/>
                            <span class="item-comm required" :class="{mark:formatMark('fuelNumber')}" :data-sn="formatSn('fuelNumber')">燃料编号：</span><Input class="item-input txt" readonly v-model="modify100.fuelNumber"/>
                        </div> 
                        <div class="item-div">       
                            <span class="item-comm required" :class="{mark:formatMark('hasInspect')}" :data-sn="formatSn('hasInspect')">有无年检：</span><Input class="item-input txt" readonly :value="modify100.hasInspect=='0'?'无':modify100.hasInspect=='1'?'有':''"/>
                            <span v-show="modify100.hasInspect=='1'">
                                <span class="item-comm required" :class="{mark:formatMark('insEndDate')}" :data-sn="formatSn('insEndDate')">有效期结束时间：</span><Input class="item-input txt" readonly :value="modify100.insEndDate"/>
                            </span>
                        </div> 
                        <div class="item-div">       
                            <span class="item-comm required" :class="{mark:formatMark('hasHighInsurance')}" :data-sn="formatSn('hasHighInsurance')">有无交强险：</span><Input class="item-input txt" readonly :value="modify100.hasHighInsurance=='0'?'无':modify100.hasHighInsurance=='1'?'有':''"/>
                            <span v-show="modify100.hasHighInsurance=='1'">
                                <span class="item-comm required" :class="{mark:formatMark('highStartDate')}" :data-sn="formatSn('highStartDate')">有效期开始时间：</span><Input class="item-input txt" readonly :value="modify100.highStartDate"/>
                                <span class="item-comm required" :class="{mark:formatMark('highEndDate')}" :data-sn="formatSn('highEndDate')">有效期结束时间：</span><Input class="item-input txt" readonly :value="modify100.highEndDate"/>
                            </span>
                        </div> 
                        <div class="item-div">       
                            <span class="item-comm required" :class="{mark:formatMark('hasBusyInsurance')}" :data-sn="formatSn('hasBusyInsurance')">有无商业险：</span><Input class="item-input txt" readonly :value="modify100.hasBusyInsurance=='0'?'无':modify100.hasBusyInsurance=='1'?'有':''"/>
                            <span v-show="modify100.hasBusyInsurance=='1'">    
                                <span class="item-comm required" :class="{mark:formatMark('busyStartDate')}" :data-sn="formatSn('busyStartDate')">有效期开始时间：</span><Input class="item-input txt" readonly :value="modify100.busyStartDate"/>
                                <span class="item-comm required" :class="{mark:formatMark('busyEndDate')}" :data-sn="formatSn('busyEndDate')">有效期结束时间：</span><Input class="item-input txt" readonly :value="modify100.busyEndDate"/>
                            </span>
                        </div> 
                        <div class="item-div">       
                            <span class="item-comm required" :class="{mark:formatMark('emissStand')}" :data-sn="formatSn('emissStand')">排放标准：</span><Input class="item-input txt" readonly v-model="modify100.emissStand"/>
                            <span class="item-comm required" :class="{mark:formatMark('transmission')}" :data-sn="formatSn('transmission')">变速器形式：</span><Input class="item-input txt" readonly v-model="modify100.transmission"/>
                            <span class="item-comm required" :class="{mark:formatMark('driveModel')}" :data-sn="formatSn('driveModel')">驱动方式：</span><Input class="item-input txt" readonly v-model="modify100.driveModel"/>
                        </div> 
                        <div class="item-div">       
                            <span class="item-comm required" :class="{mark:formatMark('hasAbs')}" :data-sn="formatSn('hasAbs')">是否有abs：</span><Input class="item-input txt" readonly :value="modify100.hasAbs=='0'?'否':modify100.hasAbs=='1'?'是':''"/>
                            <span class="item-comm required" :class="{mark:formatMark('otherImpConfig')}" :data-sn="formatSn('otherImpConfig')">其他重要配置：</span><Input class="item-input txt" readonly v-model="modify100.otherImpConfig"/>
                            <span class="item-comm required">是否为事故车：</span><Input class="item-input txt" readonly :value="modify100.isAccident=='0'?'否':modify100.isAccident=='1'?'是':''"/>
                        </div> 
                        <div class="item-div">      
                            <span class="item-comm required" :class="{mark:formatMark('deduction')}" :data-sn="formatSn('deduction')">扣分(分)：</span><Input class="item-input txt" readonly v-model="modify100.deduction"/>
                            <span class="item-comm required" :class="{mark:formatMark('fine')}" :data-sn="formatSn('fine')">罚款(元)：</span><Input class="item-input txt" readonly v-model="modify100.fine"/> 
                            <span class="item-comm required">损伤位置及状况：</span><Input class="item-input txt" readonly :value="modify100.damage"/>
                        </div> 
                        <div class="item-div">      
                            <span class="item-comm required">是否收押行驶证：</span><Input class="item-input txt" readonly :value="modify100.hasCustodyTraveler=='0'?'否':modify100.hasCustodyTraveler=='1'?'是':''"/>
                            <span class="item-comm required">是否收押机动车登记证书：</span><Input class="item-input txt" readonly :value="modify100.hasCustodyRegister=='0'?'否':modify100.hasCustodyRegister=='1'?'是':''"/>
                            <span class="item-comm required">是否收押交强险保单：</span><Input class="item-input txt" readonly :value="modify100.hasCustodyHigh=='0'?'否':modify100.hasCustodyHigh=='1'?'是':''"/>
                        </div> 
                        <div class="item-div">         
                            <span class="item-comm required" :class="{mark:formatMark('hasCustodyBusy')}" :data-sn="formatSn('hasCustodyBusy')">是否收押商业保险单：</span><Input class="item-input txt" readonly :value="modify100.hasCustodyBusy=='0'?'否':modify100.hasCustodyBusy=='1'?'是':''"/>
                            <span class="item-comm required">收押其它：</span><Input class="item-input txt" readonly :value="modify100.custodyOther"/>
                            <span class="item-comm required" :class="{mark:formatMark('examinerSign')}" :data-sn="formatSn('examinerSign')">验车人签字：</span><Input class="item-input txt" readonly v-model="modify100.examinerSign"/>
                        </div> 
                        <div class="item-div">         
                            <span class="item-comm required" :class="{mark:formatMark('examinerDate')}" :data-sn="formatSn('examinerDate')">验车日期：</span><Input class="item-input txt" readonly :value="modify100.examinerDate"/>
                        </div> 
                        <!-- 登记摘要信息栏  -->
                        <div class="title-info" style="position:relative;"><span style="vertical-align:middle;">登记摘要信息栏(必填) </span></div>
                        <span v-for="(item,index) in recordVO" :key="index">
                            <div class="item-div">
                                <span class="item-comm required" :class="{mark:formatMark2('owner',index)}" :data-sn="formatSn2('owner',index)">拥有者：</span><Input class="item-input txt" readonly v-model="item.owner"/>
                                <span class="item-comm required" :class="{mark:formatMark2('registerDate',index)}" :data-sn="formatSn2('registerDate',index)">登记日期：</span><Input class="item-input txt" readonly :value="item.registerDate"/>
                            </div>    
                            <hr style="background-color:#ddd;height:1px;border:none;" v-show="index!==recordVO.length-1"/> 
                        </span>    
                        <!-- 车辆证件照片 -->
                        <div class="title-info">车辆证件照片</div>
                        <div>
                            <span class="span-width">
                                <span class="my-title-comm">行驶证正面：</span>
                                <viewer :images="modify5Img[0]?modify5Img[0].split(' '):[]"><img class="my-img" :src="modify5Img[0]" alt="行驶证正面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">行驶证反面：</span>
                                <viewer :images="modify5Img[1]?modify5Img[1].split(' '):[]"><img class="my-img" :src="modify5Img[1]" alt="行驶证反面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">驾驶证正面：</span>
                                <viewer :images="modify5Img[2]?modify5Img[2].split(' '):[]"><img class="my-img" :src="modify5Img[2]" alt="驾驶证正面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">驾驶证反面：</span>
                                <viewer :images="modify5Img[3]?modify5Img[3].split(' '):[]"><img class="my-img" :src="modify5Img[3]" alt="驾驶证反面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第1页：</span>
                                <viewer :images="modify5Img[4]?modify5Img[4].split(' '):[]"><img class="my-img" :src="modify5Img[4]" alt="绿本第1页">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第2页：</span>
                                    <viewer :images="modify5Img[5]?modify5Img[5].split(' '):[]"><img class="my-img" :src="modify5Img[5]" alt="绿本第2页">
                                </viewer>
                                </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第3页：</span>
                                <viewer :images="modify5Img[6]?modify5Img[6].split(' '):[]"><img class="my-img" :src="modify5Img[6]" alt="绿本第3页">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第4页：</span>
                                <viewer :images="modify5Img[7]?modify5Img[7].split(' '):[]"><img class="my-img" :src="modify5Img[7]" alt="绿本第4页">
                                </viewer>
                            </span> 
                        </div> 
                        <div class="title-info">车300照片</div>
                        <div v-if="name=='WaitAuditingList'">
                            <span class="span-width1"><ImgUpload :type="5" class="imgUpload" :txt="'多选'" :myUploadList="auditPicsmyUploadList" :myUploadList2="auditPicsmyUploadList2" @changePicUrl="changePicUrl10" ></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="commonModifyBtn(auditPicsmyUploadList2)">保存</Button></span>   
                        </div>
                        <div v-if="name!='WaitAuditingList'">
                            <viewer :images="auditPicsmyUploadList"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in auditPicsmyUploadList" :src="src" :key="index" alt="车300照片"></viewer>
                        </div> 
                        <div class="title-info">车辆补充资料</div>
                        <div style="padding-left:20px;">
                            <div v-if="name!='WaitAuditingList'">
                                <viewer :images="autoOtherFiles1"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in autoOtherFiles1" :src="src" :key="index" alt="车辆补充资料"></viewer>
                            </div>
                        </div>      
                    </div>
                    <div class="name5-box" :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}" v-if="$route.query.name2!='WaitAuditingList' && $route.query.name2!='WaitStoreList' && $route.query.name2!='WaitConfirmList'">
                        <!-- 基础信息 -->
                        <div class="title-info">行驶证</div>   
                        <div class="item-div">
                            <span class="item-comm required">车牌号：</span><Input class="item-input txt" readonly v-model="modify100.plateNumber"/>
                            <span class="item-comm required">车辆类型：</span><Input class="item-input txt" readonly v-model="modify100.type" />
                            <span class="item-comm required">所有人：</span><Input class="item-input txt" readonly v-model="modify100.owner"/>
                        </div>  
                        <div class="item-div">    
                            <span class="item-comm required">使用性质：</span><Input class="item-input txt" readonly :value="modify100.useNature=='1'?'营运用车':modify100.useNature=='2'?'出租车':modify100.useNature=='3'?'公务用车':modify100.useNature=='4'?'家庭用车':modify100.useNature=='5'?'其它':''"/>
                            <span class="item-comm required">品牌型号：</span><Input class="item-input txt" readonly v-model="modify100.brandModel"/>
                            <span class="item-comm required">车辆识别代码：</span><Input class="item-input txt" readonly v-model="modify100.vin"/>
                        </div>  
                        <div class="item-div">        
                            <span class="item-comm required">发动机号码：</span><Input class="item-input txt" readonly v-model="modify100.enginerNumber"/>
                            <span class="item-comm required">核载人数(人)：</span><Input class="item-input txt" readonly v-model="modify100.passenger"/>
                        </div>
                        <div class="title-info">绿本</div>   
                        <div class="item-div">    
                            <span class="item-comm required">证书编号：</span><Input class="item-input txt" readonly v-model="modify100.certificateNumber"/>
                            <span class="item-comm required">来源：</span> <Input class="item-input txt" v-if="!ismodify100 || !formatMark('source')" readonly :value="modify100.source=='1'?'国产':modify100.source=='2'?'进口':''"/>
                            <span class="item-comm required">发动机功率(kw)：</span><Input class="item-input txt" readonly v-model="modify100.power"/>
                        </div>  
                        <div class="item-div">   
                            <span class="item-comm required">车辆品牌：</span><Input class="item-input txt" readonly v-model="modify100.brand"/>     
                            <span class="item-comm required">车辆型号：</span><Input class="item-input txt" readonly v-model="modify100.model"/>
                            <span class="item-comm required">车身颜色：</span><Input class="item-input txt" readonly v-model="modify100.color"/>
                        </div>  
                        <div class="item-div">        
                            <span class="item-comm required">排量(ml)：</span><Input class="item-input txt" readonly v-model="modify100.displace"/>
                        </div>       
                        <div class="title-info">报告</div>   
                        <div class="item-div">        
                            <span class="item-comm required">有无年检：</span><Input class="item-input txt" readonly :value="modify100.hasInspect=='0'?'无':modify100.hasInspect=='1'?'有':''"/>
                            <span v-show="modify100.hasInspect=='1'">
                                <span class="item-comm required">有效期结束时间：</span><Input class="item-input txt" readonly :value="modify100.insEndDate"/>
                            </span>
                        </div>  
                        <div class="item-div">       
                            <span class="item-comm required">有无交强险：</span><Input class="item-input txt" readonly :value="modify100.hasHighInsurance=='0'?'无':modify100.hasHighInsurance=='1'?'有':''"/>
                            <span v-show="modify100.hasHighInsurance=='1'">
                                <span class="item-comm required">有效期开始时间：</span><Input class="item-input txt" readonly :value="modify100.highStartDate"/>
                                <span class="item-comm required">有效期结束时间：</span><Input class="item-input txt" readonly :value="modify100.highEndDate"/>
                            </span>
                        </div>  
                        <div class="item-div">       
                            <span class="item-comm required">有无商业险：</span><Input class="item-input txt" readonly :value="modify100.hasBusyInsurance=='0'?'无':modify100.hasBusyInsurance=='1'?'有':''"/>
                            <span v-show="modify100.hasBusyInsurance=='1'">    
                                <span class="item-comm required">有效期开始时间：</span><Input class="item-input txt" readonly :value="modify100.busyStartDate"/>
                                <span class="item-comm required" :class="{mark:formatMark('busyEndDate')}" :data-sn="formatSn('busyEndDate')">有效期结束时间：</span><Input class="item-input txt" readonly :value="modify100.busyEndDate"/>
                            </span>  
                        </div>  
                        <div class="item-div">       
                            <span class="item-comm required">燃料编号：</span><Input class="item-input txt" readonly v-model="modify100.fuelNumber"/>
                            <span class="item-comm required">排放标准：</span><Input class="item-input txt" readonly v-model="modify100.emissStand"/>
                            <span class="item-comm required">变速器形式：</span><Input class="item-input txt" readonly v-model="modify100.transmission"/>
                        </div>  
                        <div class="item-div">       
                            <span class="item-comm required">驱动方式：</span><Input class="item-input txt" readonly v-model="modify100.driveModel"/>
                            <span class="item-comm required" :class="{mark:formatMark('hasAbs')}" :data-sn="formatSn('hasAbs')">是否有abs：</span><Input class="item-input txt" readonly :value="modify100.hasAbs=='0'?'否':modify100.hasAbs=='1'?'是':''"/>
                            <span class="item-comm required" :class="{mark:formatMark('otherImpConfig')}" :data-sn="formatSn('otherImpConfig')">其他重要配置：</span><Input class="item-input txt" readonly v-model="modify100.otherImpConfig"/>
                        </div>  
                        <div class="item-div">        
                            <span class="item-comm required">是否为事故车：</span><Input class="item-input txt" readonly :value="modify100.isAccident=='0'?'否':modify100.isAccident=='1'?'是':''"/>
                            <span class="item-comm required" :class="{mark:formatMark('deduction')}" :data-sn="formatSn('deduction')">扣分(分)：</span><Input class="item-input txt" readonly v-model="modify100.deduction"/>
                            <span class="item-comm required" :class="{mark:formatMark('fine')}" :data-sn="formatSn('fine')">罚款(元)：</span><Input class="item-input txt" readonly v-model="modify100.fine"/> 
                        </div>  
                        <div class="item-div">       
                            <span class="item-comm required">损伤位置及状况：</span><Input class="item-input txt" readonly :value="modify100.damage"/>
                            <span class="item-comm required">是否收押行驶证：</span><Input class="item-input txt" readonly :value="modify100.hasCustodyTraveler=='0'?'否':modify100.hasCustodyTraveler=='1'?'是':''"/>
                            <span class="item-comm required">是否收押机动车登记证书：</span><Input class="item-input txt" readonly :value="modify100.hasCustodyRegister=='0'?'否':modify100.hasCustodyRegister=='1'?'是':''"/>
                        </div>  
                        <div class="item-div">       
                            <span class="item-comm required">是否收押交强险保单：</span>
                            <Input class="item-input txt" readonly :value="modify100.hasCustodyHigh=='0'?'否':modify100.hasCustodyHigh=='1'?'是':''"/>
                            <span class="item-comm required">是否收押商业保险单：</span><Input class="item-input txt" readonly :value="modify100.hasCustodyBusy=='0'?'否':modify100.hasCustodyBusy=='1'?'是':''"/>
                            <span class="item-comm required">收押其它：</span><Input class="item-input txt" readonly :value="modify100.custodyOther"/>
                        </div>  
                        <div class="item-div">        
                            <span class="item-comm required">验车人签字：</span><Input class="item-input txt" readonly v-model="modify100.examinerSign"/>
                            <span class="item-comm required">验车日期：</span><Input class="item-input txt" readonly :value="modify100.examinerDate"/>
                        </div>  
                        <div class="item-div">  
                            <span class="item-comm required">缸数(缸)：</span><Input class="item-input txt" readonly v-model="modify100.cylinder"/>
                            <span class="item-comm required">行驶里程(万)：</span><Input class="item-input txt" readonly v-model="modify100.mile"/>
                        </div>  
                        <!-- 登记摘要信息栏  -->
                        <div class="title-info" style="position:relative;"><span style="vertical-align:middle;">登记摘要信息栏(必填) </span></div>
                        <span v-for="(item,index) in recordVO" :key="index">
                            <div class="item-div">
                                <span class="item-comm required">拥有者：</span><Input class="item-input txt" readonly v-model="item.owner"/>
                                <span class="item-comm required">登记日期：</span><Input class="item-input txt" readonly :value="item.registerDate"/>
                            </div> 
                            <hr style="background-color:#ddd;height:1px;border:none;" v-show="index!==recordVO.length-1"/>    
                        </span>  
                        <!-- 车辆证件照片 -->
                        <div class="title-info">车辆证件照片</div>
                        <div>
                            <span class="span-width">
                                <span class="my-title-comm">行驶证正面：</span>
                                <viewer :images="modify5Img[0]?modify5Img[0].split(' '):[]"><img class="my-img" :src="modify5Img[0]" alt="行驶证正面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">行驶证反面：</span>
                                <viewer :images="modify5Img[1]?modify5Img[1].split(' '):[]"><img class="my-img" :src="modify5Img[1]" alt="行驶证反面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">驾驶证正面：</span>
                                <viewer :images="modify5Img[2]?modify5Img[2].split(' '):[]"><img class="my-img" :src="modify5Img[2]" alt="驾驶证正面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">驾驶证反面：</span>
                                <viewer :images="modify5Img[3]?modify5Img[3].split(' '):[]"><img class="my-img" :src="modify5Img[3]" alt="驾驶证反面">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第1页：</span>
                                <viewer :images="modify5Img[4]?modify5Img[4].split(' '):[]"><img class="my-img" :src="modify5Img[4]" alt="绿本第1页">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第2页：</span>
                                    <viewer :images="modify5Img[5]?modify5Img[5].split(' '):[]"><img class="my-img" :src="modify5Img[5]" alt="绿本第2页">
                                </viewer>
                                </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第3页：</span>
                                <viewer :images="modify5Img[6]?modify5Img[6].split(' '):[]"><img class="my-img" :src="modify5Img[6]" alt="绿本第3页">
                                </viewer>
                            </span>  
                            <span class="span-width">
                                <span class="my-title-comm">绿本第4页：</span>
                                <viewer :images="modify5Img[7]?modify5Img[7].split(' '):[]"><img class="my-img" :src="modify5Img[7]" alt="绿本第4页">
                                </viewer>
                            </span> 
                        </div>
                        <div class="title-info">车300照片</div>
                        <div v-if="name=='WaitAuditingList'">
                            <span class="span-width1"><ImgUpload :type="5" class="imgUpload" :txt="'多选'" :myUploadList="auditPicsmyUploadList" :myUploadList2="auditPicsmyUploadList2" @changePicUrl="changePicUrl10" ></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="commonModifyBtn(auditPicsmyUploadList2)">保存</Button></span>   
                        </div>
                        <div v-if="name!='WaitAuditingList'">
                            <viewer :images="auditPicsmyUploadList"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in auditPicsmyUploadList" :src="src" :key="index" alt="车300照片"></viewer>
                        </div>  
                        <div class="title-info">车辆补充资料</div>
                        <div style="padding-left:20px;">
                            <div v-if="name!='WaitAuditingList'">
                                <viewer :images="autoOtherFiles1"><img class="my-img" style="margin:0 15px;"  v-for="(src,index) in autoOtherFiles1" :src="src" :key="index" alt="车辆补充资料"></viewer>
                            </div>
                        </div>  
                    </div>
                </TabPane>
                <TabPane label="订单资料" name="name3">
                     <div :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}">
                        <Button class="btn-margin" style="margin-left:0" type="primary" size="small" v-if="$route.query.name2=='WaitStoreList'" @click="orderUpLoad">上传资料</Button>
                        <input style="display:none" type="file" id="file1" ref="file1" @change="changeFile1('资料')"/>
                        <div class="listadmin">
                            <Table border :columns="columnsInfo" :height="adjustHeight" :data="orderInfo" :loading="table_loading"></Table>
                        </div>
                        <div style="text-align:center;margin-top:20px;">
                            <Page :current="searchInfo.pageNum" :total="totalCount" :page-size="pagesize" @on-change="pageChange" show-total></Page>
                        </div>
                    </div>
                </TabPane>
                <TabPane label="合同信息" name="name4">
                    <div :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}" v-if="$route.query.name2=='SignContract'">
                        <Button v-if="contractList.length?true:false" class="btn-margin" style="margin-left:0" type="primary" size="small" :loading="carImgloading2" @click="downLoadContract">批量合同下载</Button><Button class="btn-margin" :loading="carImgloading3" type="primary" size="small" v-if="contractList.length?true:false" @click="previewContract">查看电签合同</Button><Button class="btn-margin" :loading="carImgloading5" type="primary" size="small" v-if="$route.query.name2=='SignContract'" @click="downContract">合同生成</Button>
                        <Button class="btn-margin" type="primary" size="small" @click="orderUpLoad2">上传复审资料包</Button>
                        <input style="display:none" type="file" id="file2" ref="file2" @change="changeFile1('合同')"/>
                        <div class="listadmin">
                            <Table border :columns="columnsContract" :height="adjustHeight" :data="contractInfo" :loading="table_loading"></Table>
                        </div>
                        <div style="text-align:center;margin-top:20px;">
                            <Page :current="search2Info.pageNum" :total="totalCount" :page-size="pagesize" @on-change="pageChange" show-total></Page>
                        </div>    
                    </div>
                    <div :style="{height:adjustHeight-95+'px','overflow-y': 'scroll'}" v-if="$route.query.name2!='SignContract'">
                        <Button v-if="contractList.length?true:false" class="btn-margin" type="primary" size="small" style="margin-left:0" :loading="carImgloading2" @click="downLoadContract">批量合同下载</Button><Button class="btn-margin" :loading="carImgloading3" type="primary" size="small" v-if="contractList.length?true:false" @click="previewContract">查看电签合同</Button><Button v-if="!contractFlowId && $route.query.name2=='WaitCheckAgain'" class="btn-margin" type="primary" size="small" @click="applySeal" :loading="carImgloading6">申请电签</Button><Button v-if="contractFlowId && $route.query.name2=='WaitCheckAgain'" class="btn-margin" type="primary" size="small" @click="sealDetail">电签详情</Button>
                        <span v-for="(audio,index) in audiosArr" class="span-imgs-title" :key="Math.random()">
                            <img class="my-img" style="margin:0 15px;" src="https://carloan-bm.oss-cn-hangzhou.aliyuncs.com/imgs/radio_icon.png" alt="音频">
                            <div @click="toDownBtn(audio)"><Icon type="md-download" color="#fff"></Icon></div>
                        </span>   
                        <div class="listadmin">
                            <Table border :columns="columnsContract" :height="adjustHeight" :data="contractInfo" :loading="table_loading"></Table>
                        </div>
                        <div style="text-align:center;margin-top:20px;">
                            <Page :current="search2Info.pageNum" :total="totalCount" :page-size="pagesize" @on-change="pageChange" show-total></Page>
                        </div>   
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
                                图片：<viewer :images="item.imgsArr"><img class="my-img" style="margin:0 15px;" v-for="(ele,index) in item.imgsArr" :src="ele" :key="index" alt="图片"></viewer>
                            </span>
                            <Button class="btn-margin" type="dashed" size="small" v-if="$route.query.name2=='WaitStoreList' && orderStatus!=10" @click="modifyDevice(item.id,item.deviceNum)">修改</Button>
                            <Button class="btn-margin" type="dashed" size="small" v-if="$route.query.name2=='GPSInstall'" @click="modifyPosition(item.id,item.imgs,item.position)">添加/修改位置</Button>
                            <Button class="btn-margin" type="dashed" size="small" v-if="$route.query.name2=='GPSInstall'" @click="deleteDevice(item.id)">删除</Button>
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
                <div class="item-div"><Button type="primary" @click="toUrl(sealDetailObj.signUrl)" style="margin-right:8px;">跳转到电签地址</Button><Button type="primary" @click="archive(sealDetailObj.flowId)" style="margin-right:8px;" v-if="$route.query.name2=='WaitCheckAgain'">电签归档</Button><Button type="primary" style="margin-right:8px;" @click="revoke(sealDetailObj.flowId)" :loading="carImgloading7">电签撤回</Button><Button type="primary" @click="downloadSeal(sealDetailObj.flowId)">下载电签</Button></div>
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
            totalCount: null,
            pagesize: 15,
            table_loading: false,
            searchInfo:{
                pageNum: 1
            }, 
            search2Info:{
                pageNum: 1
            },
            percent: 0,
            orderInfo:[],
            contractInfo:[],
            spinState: false,
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
            carImgloading6:false,
            carImgloading7:false,
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
            orderStatus: '', //为10表示复审退回
            audiosArr:[],
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
            // storePicsmyUploadList:[],
            // storePicsmyUploadList2:[],
            auditPicsmyUploadList:[],
            auditPicsmyUploadList2:[],
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
            oss: {}, //oss相关信息集合
            columnsInfo: [{
                    title: '操作',
                    key: 'action',
                    width: 100,
                    align: 'center',
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: this.$route.query.name2=='WaitStoreList'?false:true
                                },
                                style: {
                                    'margin-top':'10px',
                                },
                                on: {
                                    click: () => {
                                        this.modalTipTitle="删除该资料";
                                        this.item = params.row;
                                        this.tipModal = true;
                                    }
                                }
                            }, '删除'),
                        ]);
                    }
                }, {
                    title: '资料链接',
                    key: 'resource',
                    minWidth: 115,
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    'display':'inline-block',
                                    'minWidth':'100px'
                                },
                                on: {
                                    click: () => {
                                       window.location.href = params.row.resource;
                                    }
                                }
                            }, '资料'),
                        ]);
                    }
                }, {
                    title: '上传时间',
                    key: 'createTime',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.createTime)
                        ]);
                    }
            }],
            columnsContract: [{
                    title: '操作',
                    key: 'action',
                    width: 100,
                    align: 'center',
                    fixed: "left",
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    disabled: this.$route.query.name2=='SignContract'?false:true
                                },
                                style: {
                                    'margin-top':'10px',
                                },
                                on: {
                                    click: () => {
                                        this.modalTipTitle="删除该资料";
                                        this.item = params.row;
                                        this.tipModal = true;
                                    }
                                }
                            }, '删除'),
                        ]);
                    }
                }, {
                    title: '资料链接',
                    key: 'resource',
                    minWidth: 115,
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    'display':'inline-block',
                                    'minWidth':'100px'
                                },
                                on: {
                                    click: () => {
                                       window.location.href = params.row.resource;
                                    }
                                }
                            }, '资料'),
                        ]);
                    }
                }, {
                    title: '上传时间',
                    key: 'createTime',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('div', [
                            h('strong', params.row.createTime)
                        ]);
                    }
            }],
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
                orderId:'',
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
            modify5Img: [], //保存对应的绝对地址
            carPics: '', //车辆图片
            insurancePics: '', //车辆保险
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
            // imgs3:[], //门店车300
            imgs4:[], //初审车300
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
            imgs99:[],
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
            myimgs99:[],  //绝对地址 
            myimgs991:[], //相对地址
            carRegisterRecords:[],  //登记摘要信息栏集合
            imgsbox:[],  //人法、失信截图集合
            myimgs15Files:[], 
            myimgs15Imgs:[],
            
            
            topInfo:{  //最顶上的基本信息
                name: '',
                identityCard: '',
                plateNumber: '',
                vin: '',
                enginerNumber: ''
            },
            isReturn:false, //默认不是退回到门店的订单
            isCarUpdate:false, //合同退回为true
            ismodify100:false,  //true 为修改模式
            modify100: {
                orderId: '',
            },
            modify100Clone: {
                isResponse: false
            }, //存储为一个副本 带sn,needUpdate字段
            recordVO: [],
            recordVOClone: [],  //存储为一个副本 带sn,needUpdate字段
            ismodifyInfo1:false,
            modifyInfo1: {},
            modifyInfo1Clone: {
                isResponse: false //存储为一个副本 带sn,needUpdate字段
            },
            ismodifyContact1:[false,false,false], //true 为修改模式
            contacts1:[],
            contacts1Clone:[],
            identityInfo1:[],
            underwrite:{},
            underwriteClone:{
                isResponse: false //存储为一个副本 带sn,needUpdate字段
            },
            isunderwrite: false,
            isunderwriteReturn: false,
            isunderwriteUpdate: false,
            autoOtherFiles1:[],   //车辆补充资料绝对路径

        }
    },
    components:{
        ImgUpload,
        ModalPic,
        CommonTipModal,
        ChinaArea2
    }, 
    computed:{
        ...mapState(['adjustHeight','host']) 
    },
    activated(){
        this.mat = localStorage.getItem('mat');
        this.name = this.$route.query.name2;
        this.ismodify1 = false;  
        this.ismodify2 = false;  
        this.ismodify3 = false;  
        this.ismodify4 = false; 
        this.ismodify100= false; 
        this.activedName = this.$route.query.activedName;
        // this.getInitialPersonList({userId:this.$route.query.userId,orderId:this.$route.query.orderId});
        this.getInitialPersonList2({userId:this.$route.query.userId,orderId:this.$route.query.orderId});
        // this.getInitialCarList({autoRepositoryId:this.$route.query.autoId});
        this.getInitialCarList2({autoRepositoryId:this.$route.query.autoId,orderId:this.$route.query.orderId});
        this.getFile({autoRepositoryId:this.$route.query.autoId});
        this.getDeviceList({orderId:this.$route.query.orderId});
        this.getOrderList({orderId:this.$route.query.orderId});
        // if(this.$route.query.name2!='WaitStoreList' && this.$route.query.name2!='WaitAuditingList' && this.$route.query.name2!='WaitConfirmList'){
        this.contractList = [];
        this.getOSSInfo({params:{type:11}});
        this.getContractList({orderId:this.$route.query.orderId});
        this.getContractList2({orderId:this.$route.query.orderId});
        // this.getInsurerDetail();
        // }
        let that = this;
        $('.name4-box').off('click').on('click','.item-div .item-comm', function(){
            if(that.$route.query.name2=='WaitAuditingList'){
                let formData = {
                    orderId: that.$route.query.orderId,
                    sn: this.dataset.sn
                };
                if(!this.dataset.sn){
                    return that.$Message.error("该字段不允许标记");
                }
                if($(this).hasClass('mark')){
                    $(this).removeClass('mark');
                    formData.handType = 0
                }else{
                    $(this).addClass('mark');
                    formData.handType = 1
                }
                that.$axios.post('/fx?api=gate.hand.change.record',formData).then(res => {
                    if(res!=500){
                        console.log('标记成功');
                    }
                }) 
            }
        })
        $('.person-name3-box').off('click').on('click','.common-ul .item-comm', function(){
            if(that.$route.query.name2=='WaitAuditingList'|| that.$route.query.name2=='SignContract'|| that.$route.query.name2=='WaitCheckAgain'){
                let formData = {
                    orderId: that.$route.query.orderId,
                    sn: this.dataset.sn
                };
                if(!this.dataset.sn){
                    return that.$Message.error("该字段不允许标记");
                }
                if($(this).hasClass('mark')){
                    $(this).removeClass('mark');
                    formData.handType = 0
                }else{
                    $(this).addClass('mark');
                    formData.handType = 1
                }
                that.$axios.post('/fx?api=gate.hand.change.record',formData).then(res => {
                    if(res!=500){
                        console.log('标记成功');
                    }
                })  
            }
        })
        $('.name-underwrite').off('click').on('click','.item-comm', function(){
            if(that.$route.query.name2=='WaitAuditingList'|| that.$route.query.name2=='SignContract'){
                let formData = {
                    orderId: that.$route.query.orderId,
                    sn: this.dataset.sn
                };
                if(!this.dataset.sn){
                    return that.$Message.error("该字段不允许标记");
                }
                if($(this).hasClass('mark')){
                    $(this).removeClass('mark');
                    formData.handType = 0
                }else{
                    $(this).addClass('mark');
                    formData.handType = 1
                }
                that.$axios.post('/fx?api=gate.hand.change.record',formData).then(res => {
                    if(res!=500){
                        console.log('标记成功');
                    }
                })  
            }
        })
    },
    methods: {
        getInsurerDetail(){
            this.$axios.get('/fx?api=gate.order.insurer.detail',{params:{id:this.$route.query.orderId}}).then(res => {
                if(res!=500){
                    this.underwriteClone.isResponse = true;
                    this.isunderwriteUpdate = res.isUpdate;
                    this.isunderwriteReturn = res.isReturn;
                    res.infoList.forEach( (item, index) => {
                        this.$set(this.underwrite, item.key, item.value) //添加响应式的属性
                        this.$set(this.underwriteClone, item.key, item)
                    });
                    console.log(this.underwrite,this.underwriteClone);
                }
            })
        },
        orderUpLoad(){
            this.$refs.file1.value = null;
            let file = this.$refs.file1;
            file.click();
        }, 
        orderUpLoad2(){
            this.$refs.file2.value = null;
            let file = this.$refs.file2;
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
        changeFile1(txt){
            this.spinState = true
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
            let file = null;
            switch (txt) {
                case '资料':
                    file = this.$refs.file1.files[0];
                    break;
                case '合同':
                    file = this.$refs.file2.files[0];
                    break;    
            }
            if(file){
                let reg = /\.rar$|\.zip$/i;
                if(!reg.test(file.name)){
                    let fileInput = null;
                    switch (txt) {
                        case '资料':
                            fileInput = this.$refs.file1;
                            break;
                        case '合同':
                            fileInput = this.$refs.file2;
                            break;    
                    }
                    fileInput.value='';
                    let errorTxt = '格式只支持rar,zip';
                    this.spinState = false;
                    return this.$Message.error(errorTxt);
                }
                let random_name = this.random_string(6) + '_' + new Date().getTime() + '.' + file.name.split('.').pop();   // 随机命名
                
                let checkpoint;

                // 定义上传方法
                let that = this;
                async function multipartUpload (){
                    try {
                        let result = await client.multipartUpload(`${that.oss.dirPath}${random_name}`, file, {
                            checkpoint: checkpoint,
                            progress: async function (percent, cpt) {
                                that.percent = Math.round(percent*100);
                                checkpoint = cpt;
                            }
                        })
                        let requestUrls = result.res.requestUrls[0];
                        let index1 = requestUrls.indexOf('uploadId');
                        let myUrl = result.url?result.url:requestUrls.slice(0,index1-1);
                        let myIndex = myUrl.indexOf('/img');
                        let ranUrl = myUrl.slice(myIndex+1);
                        myUrl = client.signatureUrl(ranUrl);    //转化成带加密签名的图片(参数必须为相对地址)
                        that.fileUpload(ranUrl,txt);
                    } catch(e){
                        that.$Message.warning('文件上传出错');
                        that.spinState = false;
                    }
                }
                multipartUpload();
            }     
        },
        fileUpload(resource,txt){
            let myUrl = '';
            switch (txt) {
                case '资料':
                    myUrl = '/fx?api=gate.file.upload';
                    break;
                case '合同':
                    myUrl = '/fx?api=gate.file.upload.contract';
                    break;    
            }
            this.$axios.post(myUrl,{orderId:this.$route.query.orderId,resource:resource}).then(res => {
                if(res!=500){
                    this.$Message.success('资料上传成功');
                    switch (txt) {
                        case '资料':
                            this.getOrderList({orderId:this.$route.query.orderId});
                            break;
                        case '合同':
                            this.getContractList2({orderId:this.$route.query.orderId});
                            break;    
                    }
                   
                }
                this.spinState = false;
            })
        },
        getOSSInfo(){ //获得OSS相关信息
            this.$axios.get('/fx?api=gate.base.ossUpload',{params:{type:11}}).then(res => {
                if(res!=500){
                    this.oss = res;     
                }
            })
        },
        getInitialPersonList2(formData){ 
            this.$axios.get('/fx?api=gate.order.admin.person.detail',{params:formData}).then(res => {
                if(res!=500){
                    this.isReturn = res.isReturn;
                    this.isUpdate = res.isUpdate;
                    this.identityInfo1 = [res.identityFrontValue,res.identityBackValue,res.bankFrontValue,res.bankBackValue];  //基础材料集合
                    res.personInfo.forEach( (item, index) => {
                        this.$set(this.modifyInfo1, item.key, item.value) //添加响应式的属性
                        this.$set(this.modifyInfo1Clone, item.key, item)
                    });
                    this.topInfo.name = this.modifyInfo1.name;
                    this.topInfo.identityCard = this.modifyInfo1.identityCard;
                    this.contacts1 = [];
                    this.contacts1Clone = [];
                    res.contactList.forEach((item, index) => {
                        let obj = {
                            id: '',
                            concatName: '',
                            concatRelation: '',
                            company: '',
                            concatMobile: '',
                            province:'', 
                            city:'',
                            area:'',
                            address:'',
                            pca:''
                        };
                        let obj2= {
                            id: {},
                            concatName: {},
                            concatRelation: {},
                            company: {},
                            concatMobile: {},
                            province: {}, 
                            city: {},
                            area: {},
                            address: {},
                            pca: {}
                        };
                        item.forEach((ele, index) => {
                            switch (ele.key) {
                                case 'id':
                                    obj.id = ele.value;
                                    obj2.id = ele;
                                    break;    
                                case 'concatName':
                                    obj.concatName = ele.value;
                                    obj2.concatName = ele;
                                    break;
                                case 'concatRelation':
                                    obj.concatRelation = ele.value;
                                    obj2.concatRelation = ele;
                                    break;
                                case 'company':
                                    obj.company = ele.value;
                                    obj2.company = ele;
                                    break;
                                case 'concatMobile':
                                    obj.concatMobile = ele.value;
                                    obj2.concatMobile = ele;
                                    break; 
                                case 'province':
                                    obj.province = ele.value;
                                    obj2.province = ele;
                                    break; 
                                case 'city':
                                    obj.city = ele.value;
                                    obj2.city = ele;
                                    break; 
                                case 'area':
                                    obj.area = ele.value;
                                    obj2.area = ele;
                                    break; 
                                case 'address':
                                    obj.address = ele.value;
                                    obj2.address = ele;
                                    break; 
                                case 'pca':
                                    obj.pca = ele.value;
                                    obj2.pca = ele;
                                    break; 
                            }
                        });
                        this.contacts1.push(obj);
                        this.contacts1Clone.push(obj2);
                    });
                    this.modifyInfo1Clone.isResponse = true;
                    if(this.modifyInfo1.periodDate=='长期'){
                        this.periodDateTemporary = '';
                        this.checkedState = true;
                    }else{
                        this.periodDateTemporary = this.modifyInfo1.periodDate;
                        this.checkedState = false;
                    }
                    this.$store.commit('change_height');
                }
            })
        },
        getOrderList(formData){
            this.$axios.get('/fx?api=gate.file.list',{params:formData}).then(res => {
                if(res!=500){
                    this.orderInfo = res.list;
                    this.totalCount = res.page.totalCount;
                    this.searchInfo.pageNum = res.page.currentPage;
                    this.$store.commit('change_height');
                }
            })
        },
        getContractList(formData ){
            this.$axios.get('/fx?api=gate.order.admin.contractQuery',{params:formData}).then(res => {
                if(res!=500){
                    this.contractList = res.list;
                    this.contractFlowId = res.flowId;
                    this.audiosArr = [];
                    res.audios && res.audios.forEach((item,index)=>{
                        this.audiosArr.push(item.value);
                    })
                    this.contractList.forEach( (item,index)=>{
                        let [imgsArr,imgsArr2,files2] = [[],[],[]];
                        item.imgs.map( (ele, index) => {
                            imgsArr.push(ele.aurl);
                        });
                        item.imgs2.map( (ele, index) => {
                            imgsArr2.push(ele.aurl);
                        });
                        item.files.map( (ele, index) => {
                            files2.push(ele.aurl);
                        });
                        item.imgsArr = imgsArr;
                        item.imgsArr2 = imgsArr2;
                        item.files2 = files2;
                        return item;
                    })
                    this.myimgs99 = [];
                    this.myimgs991 = [];
                     res.audios && res.audios.forEach((item,index)=>{
                        this.myimgs99.push(item.value);
                        this.myimgs991.push(item.key);
                    })
                    this.$store.commit('change_height');
                }
            })
        },
        getContractList2(formData){
            this.$axios.get('/fx?api=gate.contract.file.list',{params:formData}).then(res => {
                if(res!=500){
                    this.contractInfo = res.list;
                    this.totalCount = res.page.totalCount;
                    this.search2Info.pageNum = res.page.currentPage;
                    this.$store.commit('change_height');
                }
            })
        },
        getDeviceList(formData ){
            this.$axios.get('/fx?api=gate.order.device.query',{params:formData}).then(res => {
                if(res!=500){
                    this.deviceList = res.list;
                    this.orderStatus = res.orderStatus;  
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
        pageChange(){

        },
        modifyUnderwrite(){
            if(this.isunderwrite){
                if(!this.underwrite.insurer){
                    return this.$Message.error("带 * 为必填项"); 
                }
                this.$axios.post('/fx?api=gate.order.insurer.update',{id:this.$route.query.orderId,...this.underwrite}).then(res => {
                    if(res!=500){
                        this.$Message.success("保存成功"); 
                        this.isunderwrite = !this.isunderwrite;7
                        this.getInsurerDetail();
                    }
                })
            }else{
                this.isunderwrite = !this.isunderwrite;
            }
        },
        getInitialCarList2(formData){
            this.$axios.get('/fx?api=gate.order.admin.car.detail',{params:formData}).then(res => {
                if(res!=500){
                    this.isReturn = res.isReturn;
                    this.isCarUpdate = res.isCarUpdate;
                    res.autoInfoList.forEach( (item, index) => {
                        this.$set(this.modify100, item.key, item.value) //添加响应式的属性
                        this.$set(this.modify100Clone, item.key, item)
                    });
                    this.topInfo.plateNumber = this.modify100.plateNumber;
                    this.topInfo.vin = this.modify100.vin;
                    this.topInfo.enginerNumber = this.modify100.enginerNumber;
                    this.recordVO = [];
                    this.recordVOClone = [];
                    res.recordVO.forEach((item, index) => {
                        let obj= {
                            owner: '',
                            registerGov: '',
                            registerDate: '',
                            registerNumber: ''
                        };
                        let obj2= {
                            owner: {},
                            registerGov: {},
                            registerDate: {},
                            registerNumber: {}
                        };
                        item.forEach((ele, index) => {
                            switch (ele.key) {
                                case 'owner':
                                    obj.owner = ele.value;
                                    obj2.owner = ele;
                                    break;
                                case 'registerGov':
                                    obj.registerGov = ele.value;
                                    obj2.registerGov = ele;
                                    break;
                                case 'registerDate':
                                    obj.registerDate = ele.value;
                                    obj2.registerDate = ele;
                                    break;
                                case 'registerNumber':
                                    obj.registerNumber = ele.value;
                                    obj2.registerNumber = ele;
                                    break; 
                            }
                        });
                        this.recordVO.push(obj);
                        this.recordVOClone.push(obj2);
                    });
                    this.modify100Clone.isResponse = true;
                    let { autoRepositoryDetailVO } = res;
                    this.modify5 = {
                        orderId:this.$route.query.orderId,
                        autoRepositoryId:this.$route.query.autoId,
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
                    this.auditPicsmyUploadList = [];
                    this.auditPicsmyUploadList2 = [];
                    this.autoOtherFiles1 = [];
                    this.$store.commit('change_height');
                    res.car300AuditPics.forEach( (item, index) => {
                        this.auditPicsmyUploadList.push(item.value);
                        this.auditPicsmyUploadList2.push(item.key);
                    }); 
                    res.autoOtherFiles.forEach( (item, index) => {
                        this.autoOtherFiles1.push(item.value);
                    });
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
                    this.myimgs15Files = [];
                    this.myimgs15Imgs = [];
                    this.myimgs16 = res.modelBackValue; //绝对地址
                    res.orderSupple.forEach( (item, index) => {
                        this.myimgs15.push(item.value);  //绝对地址
                        this.myimgs155.push(item.key);   //相对地址
                    });
                    res.orderSuppleFiles.forEach( (item, index) => {
                        this.myimgs15Files.push(item.value);
                    });
                    res.orderSuppleImgs.forEach( (item, index) => {
                        this.myimgs15Imgs.push(item.value);
                    });
                }
            })
        },
        deleteDevice(id){
            this.item = {id:id};
            this.modalTipTitle = '删除该设备';
            this.tipModal = true;
        },
        formatMark(key){
          return this.modify100Clone.isResponse && this.modify100Clone[key].needUpdate;
        },
        formatMark3(key){
          return this.underwriteClone.isResponse && this.underwriteClone[key].needUpdate;
        },
        formatMark2(key,index){
            if(this.modify100Clone.isResponse && !this.recordVOClone[index]){
                return true;
            }
            return this.modify100Clone.isResponse && this.recordVOClone[index][key].needUpdate;
        },
        formatSn(key){
          return this.modify100Clone.isResponse? this.modify100Clone[key].sn:'';
        },
        formatSn2(key,index){
            return this.modify100Clone.isResponse? this.recordVOClone[index][key].sn:'';
        },
        formatSn3(key){
          return this.underwriteClone.isResponse? this.underwriteClone[key].sn:'';
        },
        formatMarkInfo(key){
            return this.modifyInfo1Clone.isResponse && this.modifyInfo1Clone[key].needUpdate;
        },
        formatSnInfo(key){
          return this.modifyInfo1Clone.isResponse? this.modifyInfo1Clone[key].sn:'';
        },
        formatMarkInfo2(key,index){
            return this.modifyInfo1Clone.isResponse && this.contacts1Clone[index][key].needUpdate;
        },
        formatSnInfo2(key,index){
          return this.modifyInfo1Clone.isResponse? this.contacts1Clone[index][key].sn:'';
        },
        modify100Btn(){
            this.modify100.orderId = this.$route.query.orderId;
            // this.modify100.issueDate = this.modify100.issueDate?moment(this.modify100.issueDate).format("YYYY-MM-DD"):'';
            this.modify100.giveDate = this.modify100.giveDate?moment(this.modify100.giveDate).format("YYYY-MM-DD"):'';
            this.modify100.outDate = this.modify100.outDate?moment(this.modify100.outDate).format("YYYY-MM-DD"):'';
            this.modify100.registerDate = this.modify100.registerDate?moment(this.modify100.registerDate).format("YYYY-MM-DD"):'';
            this.modify100.examinerDate = this.modify100.examinerDate?moment(this.modify100.examinerDate).format("YYYY-MM-DD"):'';
            this.modify100.deliveryDate = this.modify100.deliveryDate?moment(this.modify100.deliveryDate).format("YYYY-MM-DD"):'';
            this.modify100.storageDate = this.modify100.storageDate?moment(this.modify100.storageDate).format("YYYY-MM-DD"):'';
            // this.modify100.travelerRegisterDate = this.modify100.travelerRegisterDate?moment(this.modify100.travelerRegisterDate).format("YYYY-MM-DD"):'';
            this.modify100.insEndDate = this.modify100.insEndDate?moment(this.modify100.insEndDate).format("YYYY-MM"):'';
            this.modify100.highStartDate = this.modify100.highStartDate?moment(this.modify100.highStartDate).format("YYYY-MM-DD"):'';
            this.modify100.highEndDate = this.modify100.highEndDate?moment(this.modify100.highEndDate).format("YYYY-MM-DD"):'';
            this.modify100.busyStartDate = this.modify100.busyStartDate?moment(this.modify100.busyStartDate).format("YYYY-MM-DD"):'';
            this.modify100.busyEndDate = this.modify100.busyEndDate?moment(this.modify100.busyEndDate).format("YYYY-MM-DD"):'';
            if(this.ismodify100){ //为保存操作
                for (let key in this.modify100) {
                    if(!this.modify100[key]){
                        if(key=='plateNumber' || key=='owner' || key=='address'|| key=='model' || key=='vin' || key=='enginner' || key=='passenger' || key=='useNature' || key=='type' || key=='brand' || key=='color' || key=='source' || key=='enginerNumber'|| key=='identityCard' || key=='registerDate' || key=='mile' || key=='hasInspect' || key=='hasHighInsurance' || key=='hasBusyInsurance' || key=='fuelNumber' || key=='displace' || key=='cylinder' || key=='power' || key=='emissStand'|| key=='transmission'|| key=='driveModel' || key=='isAccident' || key=='deduction' || key=='fine' || key=='damage' || key=='hasCustodyTraveler' || key=='hasCustodyRegister'|| key=='hasCustodyHigh'|| key=='hasCustodyBusy'|| key=='custodyOther' || key=='ownerSign'|| key=='examinerDate '|| key=='source'|| key=='certificateNumber'|| key=='examinerSign'){
                            debugger;
                            return this.$Message.error("带 * 为必填项"); 
                        }
                    }
                    if(key=='hasInspect'){
                            if(this.modify100[key]=='1' && !this.modify100.insEndDate){
                                return this.$Message.error("带 * 为必填项");
                            }
                    }else if(key=='hasHighInsurance'){
                        if(this.modify100[key]=='1' && (!this.modify100.highStartDate || !this.modify100.highEndDate)){
                            return this.$Message.error("带 * 为必填项");
                        }
                    }else if(key=='hasBusyInsurance'){
                        if(this.modify100[key]=='1' && (!this.modify100.busyStartDate || !this.modify100.busyEndDate)){
                            return this.$Message.error("带 * 为必填项");
                        }
                    }
                }
                this.$axios.post('/fx?api=gate.order.car.update.info',this.modify100).then(res => {
                    if(res!=500){
                        this.$Message.success("保存成功"); 
                        this.ismodify100 = !this.ismodify100;
                        this.getInitialCarList2({autoRepositoryId:this.$route.query.autoId,orderId:this.$route.query.orderId});

                    }
                })
            }else{
                this.ismodify100 = !this.ismodify100;
            }
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
        changePicUrl99(...arr){
            this.imgs99 = arr;
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
        modifyInfo1Btn1(){
            if(this.ismodifyInfo1){
                this.modifyInfo1.periodDate = this.periodDateTemporary?moment(this.periodDateTemporary).format("YYYY-MM-DD"):'';
                if(this.checkedState){
                    this.modifyInfo1.periodDate = '长期';
                }
                this.modifyInfo1.startLiveDate = this.modifyInfo1.startLiveDate?moment(this.modifyInfo1.startLiveDate).format("YYYY-MM-DD"):'';
                this.modifyInfo1.startWorkTime = this.modifyInfo1.startWorkTime?moment(this.modifyInfo1.startWorkTime).format("YYYY-MM-DD"):'';
                this.modifyInfo1.firstCome = this.modifyInfo1.firstCome?moment(this.modifyInfo1.firstCome).format("YYYY"):'';
                this.modifyInfo1.signDate = this.modifyInfo1.signDate?moment(this.modifyInfo1.signDate).format("YYYY-MM-DD"):'';
                let formData = {...this.modifyInfo1};
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
                        this.getInitialPersonList2({userId:this.$route.query.userId,orderId:this.$route.query.orderId});
                    }
                })     
            }
            this.ismodifyInfo1 = !this.ismodifyInfo1;
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
        modifyContact1(item,index){
            if(this.ismodifyContact1[index]){
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
                        this.getInitialPersonList2({userId:this.$route.query.userId,orderId:this.$route.query.orderId});
                    }
                })
            }else{
                this.infoContent = {
                    province: item.province,
                    city: item.city,
                    area: item.area
                }
            }
            this.ismodifyContact1[index] = !this.ismodifyContact1[index];
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
            this.modifyInfo1.nowProvice = data.province;
            this.modifyInfo1.nowCity = data.city;
            this.modifyInfo1.nowArea = data.area;
        }, 
        chinaAreaChange2(data){
            this.modifyInfo1.companyProvice  = data.province;
            this.modifyInfo1.companyCity  = data.city;
            this.modifyInfo1.companyArea = data.area;
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
                let bol = this.recordVO.some( (item, index) => {
                   return item.owner=='' || item.registerDate=='' ; 
                });
                if(bol){
                    return this.$Message.error("带 * 为必填项"); 
                }
                this.recordVO.forEach( (ele, index) => {
                   ele.registerDate = moment(ele.registerDate).format("YYYY-MM-DD");
                });
                this.$axios.post('/fx?api=gate.order.car.register.record.update',{orderId:this.$route.query.orderId,autoRepositoryId:this.$route.query.autoId,carRegisterRecords:JSON.stringify(this.recordVO)}).then(res => {
                    if(res!=500){
                        this.$Message.success("保存成功"); 
                        this.ismodify3 = !this.ismodify3;
                        this.getInitialCarList2({autoRepositoryId:this.$route.query.autoId,orderId:this.$route.query.orderId});
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
                    this.getInitialCarList2({autoRepositoryId:this.$route.query.autoId,orderId:this.$route.query.orderId});
                }
            })
        },
        commonModifyBtn(imgs){
            if(!imgs.length){
                return this.$Message.warning("至少需要一张图片"); 
            }
            let formData = {
                orderId:this.$route.query.orderId,
                autoRepositoryId: this.$route.query.autoId,
                entityType:'car300Audit',
                filePath: String(imgs)
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
                case '音频':
                    if(!this.imgs99.length){
                        return this.$Message.warning("请选上传音频"); 
                    }
                    myUrl = '/fx?api=gate.order.car.file.update';
                    formData.entityType = 'audio';
                    formData.filePath = String(this.imgs99);
                    break;       
            }
            this.$axios.post(myUrl,formData).then(res => {
                if(res!=500){
                    this.$Message.success("保存成功"); 
                }
            })
        },
        toDownBtn(file){
            window.open(file);
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
            let formDataString = encodeURIComponent(JSON.stringify({orderId:this.$route.query.orderId}));
            window.open(`${this.host}/file/download?api=gate.download.order.file&v=1.0&ttid=1002&did=1&ts=1480929340486&lng=39.98871&lat=116.43234&mat=${this.mat}&sign=inm&data=${formDataString}`);
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
        changePicUrl5(...arr){
            this.imgs4 = arr;
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
        changePicUrlOther(...arr){
            this.myimgsOther = arr[0];
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
            this.carImgloading7 = false;
        },
        addItem(){
            this.recordVO.push({
                owner: '', 
                registerGov: '', 
                registerDate: '', 
                registerNumber: '' 
            });
        },
        deleteItem(index){
            if(this.recordVO.length<=1){
                return this.$Message.info("至少需要一项"); 
            }
            this.recordVO.splice(index,1);
            this.recordVOClone.splice(index,1);
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
            this.carImgloading6 = true;
            this.$axios.post('/fx?api=gate.contract.seal.apply',{orderId:this.$route.query.orderId}).then(res => {
                if(res!=500){
                    this.$Message.success("操作成功"); 
                    this.getContractList({orderId:this.$route.query.orderId});
                }
                this.carImgloading6 = false;
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
                if(this.activedName=='name3'){
                    this.getOrderList({orderId:this.$route.query.orderId});
                }else if(this.activedName=='name4'){
                    this.getContractList({orderId:this.$route.query.orderId});
                    this.getContractList2({orderId:this.$route.query.orderId});
                }else if(this.activedName=='name5'){
                    this.getDeviceList({orderId:this.$route.query.orderId});
                }
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
       vertical-align: top;
    }
    .span-imgs-title{
        display: inline-block;
        position: relative;
        >div{
            position: absolute;
            width: 60px;
            height: 60px;
            top:0;
            left:15px;
            line-height: 60px;
            text-align: center;
            background:rgba(0, 0, 0, 0.6);
            cursor: pointer;
            display: none;
        } 
        &:hover>div{
            display: inline-block;
        } 
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
    .progress-box /deep/ .ivu-progress{
        display: inline-block;
        width: 50%;
        font-size: 12px;
        position: fixed;
        left: 50%;
        top: 50%;
        margin-left: -25%;
    }
    .progress-box{
         position: absolute;
         width: 100%;
         height: 100%;
         background-color: rgba(255,255,255,.9);
         top: 0;
         left: 0;
         z-index: 8;
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
    .item-comm.mark{
        color:red;
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