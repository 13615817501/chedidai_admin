<template>
    <div id="waitStoreDetail" class="common-id">
        <Breadcrumb>
            <BreadcrumbItem>订单管理</BreadcrumbItem>
            <BreadcrumbItem>待门店处理</BreadcrumbItem>
            <BreadcrumbItem>详情</BreadcrumbItem>
        </Breadcrumb>
        <div class="modify-modal"> 
            <Tabs v-model="activedName" @on-click="tabClick">
                <TabPane label="客户信息" name="name1">
                    <div class="name1-box" :style="{height:adjustHeight+80+'px','overflow-y': 'scroll'}">
                        <div class="title-info">个人信息</div>
                        <ul class="common-ul">
                            <li><span>姓名：</span><span>{{certifyList.name}}</span></li>
                            <li><span>身份证号：</span><span>{{certifyList.identityCard}}</span></li>
                            <li><span>活体认证：</span><span>{{certifyList.isIdentity==1?'完成':'未完成'}}</span></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span>银行卡号：</span><span>{{certifyList.cardNumber}}</span></li>
                            <li><span>开户行：</span><span>{{certifyList.bankName}}</span></li>
                            <li><span>银行预留手机号：</span><span>{{certifyList.bankMobile}}</span></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span>证件有效期：</span><span>{{certifyList.periodDate}}</span></li>
                            <li><span>户籍地址：</span><span>{{certifyList.houseAddress}}</span></li>
                            <li><span></span><span></span></li>
                        </ul>
                        <div class="title-info">补充信息</div>
                        <ul class="common-ul">
                            <li><span>现住地址：</span><span>{{certifyList.nowAddress}}</span></li>
                            <li><span>客户来源：</span><span>{{certifyList.sourceValue}}</span></li>
                            <li><span>起始居住时间：</span><span>{{certifyList.startLiveDate}}</span></li>
                            <li><span>婚姻状态：</span><span>{{certifyList.marryValue}}</span></li>
                            <li><span>有无子女：</span><span>{{certifyList.hasChild}}</span></li>
                            <li><span>供养亲属：</span><span>{{certifyList.supportRelate}}</span></li>
                            <li><span>本市地址电话：</span><span>{{certifyList.localMobile}}</span></li>
                            <li><span>学历背景：</span><span>{{certifyList.educateValue}}</span></li>
                            <li><span>单位名称：</span><span>{{certifyList.companyName}}</span></li>
                            <li><span>单位地址：</span><span>{{certifyList.companyAddress}}</span></li>
                            <li><span>职位级别：</span><span>{{certifyList.level}}</span></li>
                        </ul>
                        <ul class="common-ul">
                            <li><span>月基本薪资：</span><span>{{certifyList.baseSalary}}</span></li>
                            <li><span>其他收入：</span><span>{{certifyList.otherSalary}}</span></li>
                            <li><span>起始服务时间：</span><span>{{certifyList.startWorkTime}}</span></li>
                            <li><span>企业类型：</span><span>{{certifyList.companyType}}</span></li>
                            <li><span>单位电话：</span><span>{{certifyList.companyMobile}}</span></li>
                            <li><span>住址拥有情况：</span><span>{{certifyList.ownHouse}}</span></li>
                            <li><span>名下其他财产：</span><span>{{certifyList.otherProperty}}</span></li>
                            <li><span>电子邮箱：</span><span>{{certifyList.email}}</span></li>
                            <li><span>房产：</span><span>{{certifyList.houseProperty}}</span></li>
                            <li><span>所属部门：</span><span>{{certifyList.dept}}</span></li>
                            <li><span>公司性质：</span><span>{{certifyList.nature}}</span></li>
                        </ul>
                        <div class="title-info">联系信息</div>
                        <span v-for="(item,index) in contacts" :key="index">
                            <ul class="common-ul">
                                <li><span>姓名：</span><span>{{item.concatName}}</span></li>
                                <li><span>关系：</span><span>{{item.concatRelation}}</span></li>
                                <li><span>工作单位：</span><span>{{item.company}}</span></li>
                                <li><span>单位/家庭住址：</span><span>{{item.pca}}</span></li>
                                <li><span>联系电话：</span><span>{{item.concatMobile}}</span></li>
                            </ul>
                        </span>
                        <div class="title-info">基础材料</div>
                        <div class="original-img">
                           <span style="margin-left:0;"><img :src="certifyList.identityFrontValue" alt="身份证正面" @click="clickFaceImg(certifyList.identityFrontValue)"></span>
                           <span><img :src="certifyList.identityBackValue" alt="身份证反面" @click="clickFaceImg(certifyList.identityBackValue)"></span>
                           <span><img :src="certifyList.bankFrontValue" alt="银行卡正面" @click="clickFaceImg(certifyList.bankFrontValue)"></span>
                           <span><img :src="certifyList.bankBackValue" alt="银行卡反面" @click="clickFaceImg(certifyList.bankBackValue)"></span>
                        </div> 
                    </div>
                </TabPane>
                <TabPane label="车辆信息" name="name2">
                    <div class="name2-box" :style="{height:adjustHeight+80+'px','overflow-y': 'scroll'}">
                        <!-- 行驶证信息 -->
                        <div class="title-info">行驶证信息<Button type="primary" :ghost="!ismodify1" style="margin-left:100px;" size="small" @click="modify1Btn">{{ismodify1?'保存':'修改'}}</Button></div>   
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
                            <span class="item-comm required">注册日期：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.travelerRegisterDate" :placeholder="ismodify1?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">发证日期：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.giveDate" :placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm required">档案编号：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.archivesNumber" :placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm required">核载人数：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.passenger" :placeholder="ismodify1?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">总质量：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.weightTotal":placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm required">整备质量：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.weightWhole" :placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm required">外部尺寸：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.size" :placeholder="ismodify1?'请输入...':''" />
                        </div>  
                        <div class="item-div">
                            <span class="item-comm required">备注：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.remark" :placeholder="ismodify1?'请输入...':''" />
                            <span class="item-comm required">检验记录：</span><Input class="item-input" :class="{txt:!ismodify1}" :readonly='!ismodify1' v-model="modify1.record" :placeholder="ismodify1?'请输入...':''" />
                        </div>
                        <!-- 绿本 -->
                        <div class="title-info">绿本<Button type="primary" :ghost="!ismodify2" style="margin-left:142px;" size="small" @click="modify2Btn">{{ismodify2?'保存':'修改'}}</Button></div>
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
                            <span class="item-comm required">发动机型号：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.enginerModel" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">燃油种类：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.oilType" :placeholder="ismodify2?'请输入...':''" />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">排量/功率：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.work" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">制造工厂：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.madeFactory" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">转向形式：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.turnType" :placeholder="ismodify2?'请输入...':''" />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">轮距：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.wheelDistance" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">轮胎数：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.wheelCount" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">轮胎规格：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.wheelNormal" :placeholder="ismodify3?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">钢板弹簧片数：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.steelCount" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">轴距：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.wheelbase" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">轴数：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.axesCount" :placeholder="ismodify2?'请输入...':''" />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">外廊尺寸：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.verandaSize" :placeholder="ismodify2?'请输入...':''" /> 
                            <span class="item-comm required">货厢内部尺寸：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.innerSize" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">总质量：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.totalWeight" :placeholder="ismodify2?'请输入...':''" />
                        </div>  
                        <div class="item-div">
                            <span class="item-comm required">核定载重量：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.approvedLoad" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">核定载客：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.customer" :placeholder="ismodify2?'请输入...':''"/>
                            <span class="item-comm required">准牵引总质量：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.tractionWeight" :placeholder="ismodify2?'请输入...':''" />
                        </div>  
                        <div class="item-div">
                            <span class="item-comm required">驾驶室载客：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.driverCustomer" :placeholder="ismodify2?'请输入...':''"/>
                            <span class="item-comm required">使用性质：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.useNature" :placeholder="ismodify2?'请输入...':''"/>
                            <span class="item-comm required">车辆获得方式：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.getWay" :placeholder="ismodify2?'请输入...':''"/>
                        </div>  
                        <div class="item-div">
                            <span class="item-comm required">车辆出厂日期：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.outDate" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">签发机关：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.issueGov" :placeholder="ismodify2?'请输入...':''" />
                            <span class="item-comm required">发证日期：</span><Input class="item-input" :class="{txt:!ismodify2}" :readonly='!ismodify2' v-model="modify2.issueDate" :placeholder="ismodify2?'请输入...':''" />
                        </div>  
                        <!-- 绿本变迁记录  -->
                        <div class="title-info" style="position:relative;"><span style="vertical-align:middle;">绿本变迁记录 </span><Icon type="md-add-circle"  v-if="ismodify3" @click="addItem" size="18" style="cursor:pointer;position:absolute;left:85px;top:1px;" title="新增"/><Button type="primary" style="margin-left:82px;" size="small" :ghost="!ismodify3" @click="modify3Btn">{{ismodify3?'保存':'修改'}}</Button></div>
                        <span v-for="(item,index) in carRegisterRecords" :key="index">
                            <div class="item-div">
                                <span class="item-comm required">拥有者：</span><Input class="item-input" :class="{txt:!ismodify3}" :readonly='!ismodify3' v-model="item.owner" :placeholder="ismodify3?'请输入...':''" />
                                <span style="position:relative">
                                    <span class="item-comm required">登记机关：</span><Input class="item-input" :class="{txt:!ismodify3}" :readonly='!ismodify3' v-model="item.registerGov" :placeholder="ismodify3?'请输入...':''" />
                                    <Icon type="ios-close-circle" @click="deleteItem(index)" size="16" v-if="ismodify3" style="position:absolute;right:-25px;top:-8px;cursor:pointer;" title="删除"/>
                                </span>
                            </div>    
                            <div class="item-div">
                                <span class="item-comm required">登记日期：</span><Input class="item-input" :class="{txt:!ismodify3}" :readonly='!ismodify3' v-model="item.registerDate" :placeholder="ismodify3?'请输入...':''"/>   
                                <span class="item-comm required">登记编号：</span><Input class="item-input" :class="{txt:!ismodify3}" :readonly='!ismodify3' v-model="item.registerNumber" :placeholder="ismodify3?'请输入...':''" />
                            </div>  
                        </span>  
                        <!-- 车辆报告  -->
                        <div class="title-info">车辆报告 <Button type="primary" style="margin-left:110px;" :ghost="!ismodify4" size="small" @click="modify4Btn">{{ismodify4?'保存':'修改'}}</Button></div>
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
                            <span class="item-comm required">登记日期：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.registerDate" :placeholder="ismodify4?'请输入...':''"  />
                            <span class="item-comm required">行驶里程：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.mile" :placeholder="ismodify4?'请输入...':''"  />
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
                            <span class="item-comm required">有效期开始时间：</span><DatePicker v-if="ismodify4" v-model="modify4.insStartDate" type="date" placeholder="选择年检开始时间" class="item-input"></DatePicker>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.insStartDate"/>
                            <span class="item-comm required">有效期结束时间：</span><DatePicker v-if="ismodify4" v-model="modify4.insEndDate" type="date" placeholder="选择年检结束时间" class="item-input"></DatePicker>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.insEndDate"/>
                            <span class="item-comm required">有无交强险：</span><Select v-if="ismodify4" v-model="modify4.hasHighInsurance" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.hasHighInsurance=='0'?'无':modify4.hasHighInsurance=='1'?'有':''"/>
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">有效期开始时间：</span><DatePicker v-if="ismodify4" v-model="modify4.highStartDate" type="date" placeholder="选择交强险开始时间" class="item-input"></DatePicker>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.highStartDate"/>
                            <span class="item-comm required">有效期结束时间：</span><DatePicker v-if="ismodify4" v-model="modify4.highEndDate" type="date" placeholder="选择交强险结束时间" class="item-input"></DatePicker>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.highEndDate"/>
                            <span class="item-comm required">有无商业险 ：</span><Select v-if="ismodify4" v-model="modify4.hasBusyInsurance" class="item-input">
                                    <Option value="0">无</Option>
                                    <Option value="1">有</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.hasBusyInsurance=='0'?'无':modify4.hasBusyInsurance=='1'?'有':''"/>
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">有效期开始时间：</span><DatePicker v-if="ismodify4" v-model="modify4.busyStartDate" type="date" placeholder="选择商业险开始时间" class="item-input"></DatePicker>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.busyStartDate"/>
                            <span class="item-comm required">有效期结束时间：</span><DatePicker v-if="ismodify4" v-model="modify4.busyEndDate" type="date" placeholder="选择商业险开始时间" class="item-input"></DatePicker>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.busyEndDate"/>
                            <span class="item-comm required">使用性质：</span><Select v-if="ismodify4" v-model="modify4.useNature" class="item-input">
                                    <Option value="1">营运用车</Option>
                                    <Option value="2">出租车</Option>
                                    <Option value="3">公务用车</Option>
                                    <Option value="4">家庭用车</Option>
                                    <Option value="5">其它</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.useNature=='1'?'营运用车':modify4.useNature=='2'?'出租车':modify4.useNature=='3'?'公务用车':modify4.useNature=='4'?'家庭用车':modify4.useNature=='5'?'其它':''"/>
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">燃料编号：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.fuelNumber" :placeholder="ismodify4?'请输入...':''"/>
                            <span class="item-comm required">排量：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.displace" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">缸数：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.cylinder" :placeholder="ismodify4?'请输入...':''" />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">发动机功率：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.power" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">排放标准：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.emissStand" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">变速器形式：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.transmission" :placeholder="ismodify4?'请输入...':''" />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">驱动方式：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.driveModel" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">是否有abs：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.hasAbs" :placeholder="ismodify4?'请输入...':''"/>
                            <span class="item-comm required">其他重要配置：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.otherImpConfig" :placeholder="ismodify4?'请输入...':''" />
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">是否为事故车：</span><Select v-if="ismodify4" v-model="modify4.isAccident" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.isAccident=='0'?'否':modify4.isAccident=='1'?'是':''"/>
                            <span class="item-comm required">扣分：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.deduction" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">罚款：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.fine" :placeholder="ismodify4?'请输入...':''"/>
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">损伤位置及状况：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.damage":placeholder="ismodify4?'请输入...':''" />
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
                        </div> 
                        <div class="item-div">
                            <span class="item-comm required">是否收押交强险保单：</span><Select v-if="ismodify4" v-model="modify4.hasCustodyHigh" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.hasCustodyHigh=='0'?'否':modify4.hasCustodyHigh=='1'?'是':''"/>
                            <span class="item-comm required">是否收押商业保险单：</span><Select v-if="ismodify4" v-model="modify4.hasCustodyBusy" class="item-input">
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
                            <Input class="item-input txt" v-if="!ismodify4" readonly :value="modify4.hasCustodyBusy=='0'?'否':modify4.hasCustodyBusy=='1'?'是':''"/>
                            <span class="item-comm required">收押其它：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.custodyOther" :placeholder="ismodify4?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">评定估价(元)：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.valuatePrice" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">验车人签字：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.examinerSign" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">验车日期：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.examinerDate" :placeholder="ismodify4?'请输入...':''" />
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">车主签字：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.ownerSign" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">交车日期：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.deliveryDate" :placeholder="ismodify4?'请输入...':''" />
                            <span class="item-comm required">入库日期：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.storageDate" :placeholder="ismodify4?'请输入...':''"/>
                        </div>
                        <div class="item-div">
                            <span class="item-comm required">备注：</span><Input class="item-input" :class="{txt:!ismodify4}" :readonly='!ismodify4' v-model="modify4.reportRemark" :placeholder="ismodify4?'请输入...':''" />
                        </div>
                        <!-- 车辆证件照片 -->
                        <div class="title-info">车辆证件照片</div>
                        <div>
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[0]" :type="5" @changePicUrl="changePicUrl(arguments,'行驶证正面')">行驶证正面：</ImgUpload></span>  
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[1]" :type="5" @changePicUrl="changePicUrl($event,'行驶证反面')">行驶证反面：</ImgUpload></span>    
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[2]" :type="5" @changePicUrl="changePicUrl($event,'绿本第1页')">绿本第1页：</ImgUpload></span>   
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[3]" :type="5" @changePicUrl="changePicUrl($event,'绿本第2页')">绿本第2页：</ImgUpload></span>   
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[4]" :type="5" @changePicUrl="changePicUrl($event,'绿本第3页')">绿本第3页：</ImgUpload></span>   
                            <span class="span-width"><ImgUpload :myPicUrl="modify5Img[5]" :type="5" @changePicUrl="changePicUrl($event,'绿本第4页')">绿本第4页：</ImgUpload></span> 
                            <Button type="primary"  size="small" @click="modify5Btn">保存</Button>    
                        </div>
                        <div class="title-info">车辆照片</div>
                        <div>
                            <span class="span-width1"><ImgUpload :type="5" :myUploadList="carPicsmyUploadList" :myUploadList2="carPicsmyUploadList2" :txt="'多选'" @changePicUrl="changePicUrl2">车辆照片：</ImgUpload></span>  
                            <Button type="primary"  size="small" @click="modify6Btn">保存</Button>  
                        </div>
                        <div class="title-info">车辆保单</div>
                        <div>
                            <span class="span-width1"><ImgUpload :txt="'多选'" :myUploadList="insurancePicsmyUploadList" :myUploadList2="insurancePicsmyUploadList2" :type="5" @changePicUrl="changePicUrl3">车辆保单:</ImgUpload></span>  
                            <Button type="primary" size="small" @click="modify7Btn">保存</Button> 
                        </div>
                        
                    </div>
                </TabPane>
                <TabPane label="认证信息" name="name3">
                    <div :style="{height:adjustHeight+80+'px','overflow-y': 'scroll'}">
                        <div class="title-info">违章照片</div>
                        <div>
                            <span class="span-width1"><ImgUpload class="imgUpload" :type="5" :txt="'多选'" :myUploadList="myimgs8" :myUploadList2="myimgs88" @changePicUrl="changePicUrl8"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('违章照片')">保存</Button></span>   
                        </div>
                        <div class="title-info">驾照验证图片</div>
                        <div>
                            <span class="span-width"><ImgUpload :type="5" class="imgUpload display-before" :myPicUrl="myimgs9" @changePicUrl="changePicUrl9"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('驾照验证图片')">保存</Button></span>   
                        </div>
                        <div class="title-info">车300评估图片</div>
                        <div>
                            <span class="span-width"><ImgUpload :type="5" class="imgUpload display-before" :myPicUrl="myimgs10" @changePicUrl="changePicUrl10"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('车300评估图片')">保存</Button></span>   
                        </div>
                        <div class="title-info">人保预审截图</div>
                        <div>
                            <span class="span-width1"><ImgUpload :type="5" class="imgUpload" :txt="'多选'" :myUploadList="myimgs11" :myUploadList2="myimgs111" @changePicUrl="changePicUrl11"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('人保预审截图')">保存</Button></span>   
                        </div>
                        <div class="title-info">人法、失信截图</div>
                        <div>
                            <span class="span-width"><ImgUpload class="imgUpload" :type="5" :myPicUrl="myimgs121" @changePicUrl="changePicUrl12(arguments,'人法截图')">人法截图：</ImgUpload></span>
                            <Button type="primary" size="small" @click="modifyCommonBtn('人法截图')">保存</Button>     
                            <span class="span-width"><ImgUpload class="imgUpload" :type="5" :myPicUrl="myimgs122"  @changePicUrl="changePicUrl12(arguments,'失信截图')">失信截图：</ImgUpload></span>
                            <Button type="primary" size="small" @click="modifyCommonBtn('失信截图')">保存</Button>   
                        </div>
                        <div class="title-info">银行卡复印件</div>
                        <div>
                            <span class="span-width1"><ImgUpload class="imgUpload" :myUploadList="myimgs13" :myUploadList2="myimgs133" :txt="'多选'" :type="5" @changePicUrl="changePicUrl13"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('银行卡复印件')">保存</Button></span>   
                        </div>
                        <div class="title-info">人保征信授权书</div>
                        <div>
                            <span class="span-width1"><ImgUpload :txt="'多选'" :myUploadList="myimgs14" :myUploadList2="myimgs144" class="imgUpload" :type="5" @changePicUrl="changePicUrl14"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('人保征信授权书')">保存</Button></span>  
                        </div>
                        <div class="title-info" style="margin:18px 0 2;">补充材料</div>
                        <span class="span-width1"><ImgUpload :type="5" class="imgUpload"  :myUploadList="myimgs15" :myUploadList2="myimgs155" :txt="'多选'" @changePicUrl="changePicUrl15"></ImgUpload><Button class="btn-margin" type="primary" size="small" @click="modifyCommonBtn('补充材料')">保存</Button>  </span>
                    </div>
                </TabPane>
            </Tabs>
        </div>
        <ModalPic :modal="modalPreview" :bigimg="bigimg" @cancel="cancel"></ModalPic>  
    </div>
</template>
<script>
import util from '@/util/util'
import ImgUpload from '@/components/ImgUpload' //公用的提示组件 
import ModalPic from '@/components/ModalPic'    
import moment from 'moment'
import { mapState } from 'vuex'
export default {
    name: 'WaitStoreDetail',
    data () {
        return {
            myTitle:'新增产品',
            item:{},
            activedName:'name1',
            bigimg:'',
            id:'',
            ismodify1:false,  //true 为修改模式
            ismodify2:false,  //true 为修改模式
            ismodify3:false,  //true 为修改模式
            ismodify4:false,  //true 为修改模式
            carPicsmyUploadList:[],  //绝对地址
            carPicsmyUploadList2:[], //相对地址
            insurancePicsmyUploadList:[],
            insurancePicsmyUploadList2:[],
            modify1: {  //行驶证信息
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
                issueDate: ''
            },
            modify4: {     //车辆报告
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
                insStartDate: '',
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
                valuatePrice: '',
                examinerSign: '',
                examinerDate: '',
                ownerSign: '',
                deliveryDate: '',
                storageDate: '',
                reportRemark: ''
            },
            modify5: {
                autoRepositoryId:'',
                mainTravel: '', //行驶证正面
                viceTravel: '',  //行驶证反面
                register1: '',  //绿本第1页
                register2: '', //绿本第2页
                register3: '', //绿本第3页
                register4: '' //绿本第4页
            },
            modify5Img:[], //保存对应的绝对地址
            carPics:'',        //车辆图片
            insurancePics:'',  //车辆保险
            certifyList:{},    //客户信息集合
            certifyListCar:{}, //车辆信息集合
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
            myimgs8:[], //绝对地址
            myimgs88:[], //相对地址
            myimgs9:'',  //绝对地址
            myimgs10:'', //绝对地址
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
            carRegisterRecords:[],  //绿本变迁记录集合
        }
    },
    components:{
        ImgUpload,
        ModalPic
    }, 
    computed:{
        ...mapState(['adjustHeight']) 
    },
    activated(){
        this.activedName = 'name1';
        this.getInitialPersonList({userId:this.$route.query.userId});
        this.getInitialCarList({autoRepositoryId:this.$route.query.autoId});
        this.getFile({autoRepositoryId:this.$route.query.autoId});
    },
    methods: {
        getInitialPersonList(formData){ 
            this.$axios.get('/fx?api=gate.order.admin.person.detail',{params:formData}).then(res => {
                if(res!=500){
                    this.certifyList = res;
                    this.contacts = res.contacts;
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
                        issueDate: carRegisterDetailVO.issueDate
                    };
                    this.modify4 = {
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
                        insStartDate:reportVO.insStartDate,
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
                        valuatePrice: reportVO.valuatePrice,
                        examinerSign: reportVO.examinerSign,
                        examinerDate: reportVO.examinerDate,
                        ownerSign: reportVO.ownerSign,
                        deliveryDate: reportVO.deliveryDate,
                        storageDate: reportVO.storageDate,
                        reportRemark: reportVO.reportRemark
                    };
                    this.modify5 = {
                        autoRepositoryId:res.autoRepositoryId,
                        mainTravel:autoRepositoryDetailVO.mainTravel,  //行驶证正面
                        viceTravel:autoRepositoryDetailVO.viceTravel,
                        register1:autoRepositoryDetailVO.register1,
                        register2:autoRepositoryDetailVO.register2,
                        register3:autoRepositoryDetailVO.register3,
                        register4:autoRepositoryDetailVO.register4
                    };
                    this.modify5Img = [autoRepositoryDetailVO.mainTravelValue,autoRepositoryDetailVO.viceTravelValue,autoRepositoryDetailVO.register1Value,autoRepositoryDetailVO.register2Value,autoRepositoryDetailVO.register3Value,autoRepositoryDetailVO.register4Value];
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
                    this.carRegisterRecords = [...carRegisterRecordDetailVOs];
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
                    this.myimgs10 = res.car300EvaluateValue; //绝对地址
                    this.myimgs11 = [];
                    this.myimgs111 = [];
                    res.orderPeoPre.forEach( (item, index) => {
                        this.myimgs11.push(item.value);
                        this.myimgs111.push(item.key);
                    });
                    this.myimgs121 = res.peolawValue; //绝对地址
                    this.myimgs122 = res.lostLetterValue; //绝对地址
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
                    res.orderSupple.forEach( (item, index) => {
                        this.myimgs15.push(item.value);
                        this.myimgs155.push(item.key);
                    });
                }
            })
        },
        modify1Btn(){
            if(this.ismodify1){ //为保存操作
                for (let key in this.modify1) {
                    if(!this.modify1[key]){
                        return this.$Message.error("带 * 为必填项"); 
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
            if(this.ismodify2){ //为保存操作
                for (let key in this.modify2) {
                    if(!this.modify2[key]){
                        return this.$Message.error("带 * 为必填项"); 
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
                this.$axios.post('/fx?api=gate.order.car.register.record.update',{autoRepositoryId:this.modify1.autoRepositoryId,carRegisterRecords:JSON.stringify(this.carRegisterRecords)}).then(res => {
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
                        return this.$Message.error("带 * 为必填项"); 
                    }
                }
                this.modify4.insStartDate = moment(this.modify4.insStartDate).format("YYYY-MM-DD");
                this.modify4.insEndDate = moment(this.modify4.insEndDate).format("YYYY-MM-DD");
                this.modify4.highStartDate = moment(this.modify4.highStartDate).format("YYYY-MM-DD");
                this.modify4.highEndDate = moment(this.modify4.highEndDate).format("YYYY-MM-DD");
                this.modify4.busyStartDate = moment(this.modify4.busyStartDate).format("YYYY-MM-DD");
                this.modify4.busyEndDate = moment(this.modify4.busyEndDate).format("YYYY-MM-DD");
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
                }
            })
        },
        modify6Btn(){
            if(!this.imgs1.length){
                return this.$Message.warning("至少需要一张图片"); 
            }
            let formData = {
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
        modifyCommonBtn(txt){
            let formData = {autoRepositoryId: this.$route.query.autoId};
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
                case '车300评估图片':
                    if(!this.imgs10.length){
                        return this.$Message.warning("请上传图片"); 
                    }
                    myUrl = '/fx?api=gate.order.car.other.file.update';
                    formData.otherFileType = 2;
                    formData.filePath = String(this.imgs10);
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
        changePicUrl(...arr){ //arr为子组件向父组件传递的参数列表
            switch (arr[1]) {
                case '行驶证正面':
                    this.modify5.mainTravel = arr[0][0];
                    break;
                case '行驶证反面':
                    this.modify5.viceTravel = arr[0];
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
        tabClick(name){
            this.activeName = name;
        },
        cancel(){
            this.modalPreview = false;
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
        width: 145px;
        margin-left: 15px; 
    }
    .item-comm.required:before{
        position: absolute;
        content:'*';
        color:red;
        left:-10px;
        top:3px;
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
    .contact-info span{
        display: inline-block;
        width: 20%;
    }
    .btn-margin{
        margin: 0 25px;
    }
    .original-img{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 0 15px;
        span{
            display: inline-block;
            width: 10%;
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
        margin-right:100px;
        list-style: none;
        >li>span:first-child{
            display: inline-block;
            padding-left:15px;
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
        width: 200px;
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
</style>