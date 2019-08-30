<template>
    <div id="home">
        <div :style="{height:adjustHeight+210+'px',overflow:'auto'}">
        	<div class="home-title">
	        	<Row>
			        <Col span="3" offset="1">
			            <div class="common-col common-col1">
			            	<div>{{certifyList.nowUserNum}}</div>
			                <div>今日新增人员</div>
			            </div>
			        </Col>
			        <Col span="3" offset="1">
			            <div class="common-col common-col1">
			            	<div>{{certifyList.nowAuthUserNum}}</div>
			                <div>今日认证通过</div>
			            </div>
			        </Col>
			        <Col span="3" offset="1">
			            <div class="common-col common-col1">
			            	<div>{{certifyList.allUserNum}}</div>
			                <div>人员总数</div>
			            </div>
			        </Col>
			        <Col span="3" offset="1">
			            <div class="common-col common-col1">
			            	<div>{{certifyList.nowOrderNum}}</div>
			                <div>今日新增订单</div>
			            </div>
			        </Col>
			        <Col span="3" offset="1">
			            <div class="common-col common-col1">
			            	<div>{{certifyList.nowEffOrderNum}}</div>
			                <div>今日放款完成订单</div>
			            </div>
			        </Col>
			        <Col span="3" offset="1">
			        <div class="common-col common-col1">
			            	<div>{{certifyList.allOrderNum}}</div>
			                <div>订单总数</div>
			            </div>
			        </Col>
	            </Row>
            </div>
	        <div>
	            <div id="main" :style="{width: '48%', height: '600px',marginTop:'20px'}"></div>
	        	<div id="myChartPie" :style="{width: '48%', height: '600px',marginTop:'20px'}"></div>
	        	<div id="myChartLine1" :style="{width: '98%', height: '400px',marginTop:'20px'}"></div>
	        	<div id="myChartLine2" :style="{width: '98%', height: '400px',marginTop:'20px'}"></div>
	        </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
//引入基本模板
let echarts = require('echarts/lib/echarts')
 
// 引入折线图等组件
require('echarts/lib/chart/pie')
require('echarts/lib/chart/line')
require('echarts/lib/chart/map')

// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll')//图例翻页滚动
export default {
	name: 'Home',
	props:[],
	data () {
		return {
			theme:{
				color: [
				'#1377E8','#19be6b','#ff9900','#ed4014','#2d8cf0',
        '#2b85e4','#2db7f5','#97b552','#95706d','#dc69aa',
        '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
        '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
				]
            },
            certifyList:{}
		}
	},
	computed:{
        ...mapState(['adjustHeight']) 
    },
	activated(){
		this.getInitialList();
		this.getInitialList2();
		this.createMap();
	},
	methods: {
		getInitialList(){ 
		    this.$axios.post('/fx?api=gate.index.nowDataAndStoreData').then(res => {
		    	if(res!=500){
		    		this.certifyList = res;
		    		this.createMapPie(res.storeList);
			        this.$store.commit('change_height');
		    	}
			})
		},
		getInitialList2(){ 
		    this.$axios.post('/fx?api=gate.index.continuityData').then(res => {
		    	if(res!=500){
					this.createMapLine1(res.dayList);
					this.createMapLine2(res.monthList);
			        this.$store.commit('change_height');
		    	}
			})
		},
        createMapPie(formData){
            // 基于准备好的dom，初始化echarts实例
	        let myChartPie = echarts.init(document.getElementById('myChartPie'),this.theme)
	        
	        // 绘制图表
            let [legendData,seriesData] = [[],[]];
            formData.forEach( (item, index) => {
            	legendData.push(item.name);
            });
            seriesData = formData.map( (item, index) => {
            	return {
            		name: item.name,
                    value: item.orderNum
            	}
            });

			let option = {
			    title : {
			        text: '每个门店订单占比',
			        x:'center',
			        top: 25,
			        textStyle:{
			            fontSize:18,
			            fontWeight:'900',
			            color: '#545454',
			            fontFamily:"Microsoft YaHei"
			        }
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        type: 'scroll',
			        orient: 'vertical',
			        right: 50,
			        top: 20,
			        bottom: 20,
			        data: legendData,
			        selected: true,
			    },
			    series : [
			        {
			            name: '订单占比',
			            type: 'pie',
			            radius : '55%',
			            center: ['40%', '50%'],
			            data: seriesData,
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			    ]
			};
			myChartPie.setOption(option);
			window.addEventListener("resize", () => { myChartPie.resize();});
		},
		commonPar(formData){
			let obj = {
				legendData:[],
				seriesData:[],
				xAxisData:[]
			};
            formData.forEach( (item, index) => {
            	if(obj.legendData.indexOf(item.storeName)==-1){
                    obj.legendData.push(item.storeName);
                    obj.seriesData.push({
	            		name:item.storeName,
				        type:'line',
				        data:[item.num],
				        smooth: true,
						lineStyle: {
			              width: 2
			            },
				        areaStyle: {
					        color:{
							    type: 'linear',
							    x: 0,
							    y: 0,
							    x2: 0,
							    y2: 1,
							    colorStops: [{
							        offset: 0, color: this.theme.color[index] || '#1377E8' // 0% 处的颜色
							    }, {
							        offset: 0.1, color: this.theme.color[index] || '#1377E8' // 100% 处的颜色
							    },{
							        offset: 1, color: this.theme.color[index+1] || '#DEEEFE' // 100% 处的颜色
							    }],
							    global: false // 缺省为 false
							}
					    }
            	    });
            	}else{
                    obj.seriesData[obj.seriesData.length-1].data.push(item.num);
            	}
            	if(obj.legendData[0]==item.storeName){
                    obj.xAxisData.push(item.createTimeStr);
            	}
            });
            return obj;
		},
		createMapLine1(formData){
            let myChartLine1 = echarts.init(document.getElementById('myChartLine1'),this.theme);
            
            let objData = this.commonPar(formData);

            let option = {
			    title: {
			        text: '30天门店新增订单数',
			        x:'center',
			        top: 25,
			        textStyle:{
			            fontSize:18,
			            fontWeight:'900',
			            color: '#545454',
			            fontFamily:"Microsoft YaHei"
			        }
			    },
			    tooltip: {
			        trigger: 'axis'
			    },
			    legend: {
			        data:objData.legendData,
			        type: 'scroll',
			        orient: 'vertical',
			        right: 50,
			        top: 20,
			        bottom: 20,
			    },
			    grid: {
			        left: '3%',
			        right: '15%',
			        bottom: '3%',
			        containLabel: true
			    },
			    toolbox: {
			        feature: {
			            saveAsImage: {}
			        }
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: objData.xAxisData,
			        axisLine:{
                        show : false
			        },
			        axisTick: {
					    show: false
					},
					axisLabel: {
			            fontSize : 12,
			            color: "#C7C7C7",
                    }
			    },
			    yAxis: {
			        type: 'value',
					splitLine:{
					    lineStyle:{
					        type:'dashed'
					    }
					},
					axisLine:{
                        show : false,
			        },
					axisTick: {
					    show: false
					},
					axisLabel: {
			            fontSize : 12,
			            color: "#C7C7C7",
                    }
			    },
			    series: objData.seriesData
			};
			myChartLine1.setOption(option);
			window.addEventListener("resize", () => { myChartLine1.resize();});
		},
		createMapLine2(formData){
            let myChartLine2 = echarts.init(document.getElementById('myChartLine2'),this.theme);

            let objData = this.commonPar(formData);

            let option = {
			    title: {
			        text: '12个月门店新增订单数',
			        x:'center',
			        top: 25,
			        textStyle:{
			            fontSize:18,
			            fontWeight:'900',
			            color: '#545454',
			            fontFamily:"Microsoft YaHei"
			        }
			    },
			    tooltip: {
			        trigger: 'axis'
			    },
			    legend: {
			        data:objData.legendData,
			        type: 'scroll',
			        orient: 'vertical',
			        right: 50,
			        top: 20,
			        bottom: 20
			    },
			    grid: {
			        left: '3%',
			        right: '15%',
			        bottom: '3%',
			        containLabel: true
			    },
			    toolbox: {
			        feature: {
			            saveAsImage: {}
			        }
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: objData.xAxisData,
			        axisLine:{
                        show : false
			        },
			        axisTick: {
					    show: false
					},
					axisLabel: {
			            fontSize : 12,
			            color: "#C7C7C7",
                    }
			    },
			    yAxis: {
			        type: 'value',
			        splitLine:{
					    lineStyle:{
					        type:'dashed'
					    }
					},
					axisLine:{
                        show : false
			        },
			        axisTick: {
					    show: false
					},
					axisLabel: {
			            fontSize : 12,
			            color: "#C7C7C7",
                    }
			    },
			    series: objData.seriesData
			};
			myChartLine2.setOption(option);
			window.addEventListener("resize", () => { myChartLine2.resize();});
		},
		createMap(){
			let chart = echarts.init(document.getElementById('main'));  //地图容器
			//34个省、市、自治区的名字拼音映射数组
			let provinces = {
			    //23个省
			    "台湾": "taiwan",
			    "河北": "hebei",
			    "山西": "shanxi",
			    "辽宁": "liaoning",
			    "吉林": "jilin",
			    "黑龙江": "heilongjiang",
			    "江苏": "jiangsu",
			    "浙江": "zhejiang",
			    "安徽": "anhui",
			    "福建": "fujian",
			    "江西": "jiangxi",
			    "山东": "shandong",
			    "河南": "henan",
			    "湖北": "hubei",
			    "湖南": "hunan",
			    "广东": "guangdong",
			    "海南": "hainan",
			    "四川": "sichuan",
			    "贵州": "guizhou",
			    "云南": "yunnan",
			    "陕西": "shanxi1",
			    "甘肃": "gansu",
			    "青海": "qinghai",
			    //5个自治区
			    "新疆": "xinjiang",
			    "广西": "guangxi",
			    "内蒙古": "neimenggu",
			    "宁夏": "ningxia",
			    "西藏": "xizang",
			    //4个直辖市
			    "北京": "beijing",
			    "天津": "tianjin",
			    "上海": "shanghai",
			    "重庆": "chongqing",
			    //2个特别行政区
			    "香港": "xianggang",
			    "澳门": "aomen"
			};

			let cityMap = {
			    "北京市": "110100",
			    "天津市": "120100",
			    "上海市": "310100",
			    "重庆市": "500100",
			    "崇明县": "310200",            
			    "湖北省直辖县市": "429000",       
			    "铜仁市": "522200",            
			    "毕节市": "522400",           
			    "石家庄市": "130100",
			    "唐山市": "130200",
			    "秦皇岛市": "130300",
			    "邯郸市": "130400",
			    "邢台市": "130500",
			    "保定市": "130600",
			    "张家口市": "130700",
			    "承德市": "130800",
			    "沧州市": "130900",
			    "廊坊市": "131000",
			    "衡水市": "131100",
			    "太原市": "140100",
			    "大同市": "140200",
			    "阳泉市": "140300",
			    "长治市": "140400",
			    "晋城市": "140500",
			    "朔州市": "140600",
			    "晋中市": "140700",
			    "运城市": "140800",
			    "忻州市": "140900",
			    "临汾市": "141000",
			    "吕梁市": "141100",
			    "呼和浩特市": "150100",
			    "包头市": "150200",
			    "乌海市": "150300",
			    "赤峰市": "150400",
			    "通辽市": "150500",
			    "鄂尔多斯市": "150600",
			    "呼伦贝尔市": "150700",
			    "巴彦淖尔市": "150800",
			    "乌兰察布市": "150900",
			    "兴安盟": "152200",
			    "锡林郭勒盟": "152500",
			    "阿拉善盟": "152900",
			    "沈阳市": "210100",
			    "大连市": "210200",
			    "鞍山市": "210300",
			    "抚顺市": "210400",
			    "本溪市": "210500",
			    "丹东市": "210600",
			    "锦州市": "210700",
			    "营口市": "210800",
			    "阜新市": "210900",
			    "辽阳市": "211000",
			    "盘锦市": "211100",
			    "铁岭市": "211200",
			    "朝阳市": "211300",
			    "葫芦岛市": "211400",
			    "长春市": "220100",
			    "吉林市": "220200",
			    "四平市": "220300",
			    "辽源市": "220400",
			    "通化市": "220500",
			    "白山市": "220600",
			    "松原市": "220700",
			    "白城市": "220800",
			    "延边朝鲜族自治州": "222400",
			    "哈尔滨市": "230100",
			    "齐齐哈尔市": "230200",
			    "鸡西市": "230300",
			    "鹤岗市": "230400",
			    "双鸭山市": "230500",
			    "大庆市": "230600",
			    "伊春市": "230700",
			    "佳木斯市": "230800",
			    "七台河市": "230900",
			    "牡丹江市": "231000",
			    "黑河市": "231100",
			    "绥化市": "231200",
			    "大兴安岭地区": "232700",
			    "南京市": "320100",
			    "无锡市": "320200",
			    "徐州市": "320300",
			    "常州市": "320400",
			    "苏州市": "320500",
			    "南通市": "320600",
			    "连云港市": "320700",
			    "淮安市": "320800",
			    "盐城市": "320900",
			    "扬州市": "321000",
			    "镇江市": "321100",
			    "泰州市": "321200",
			    "宿迁市": "321300",
			    "杭州市": "330100",
			    "宁波市": "330200",
			    "温州市": "330300",
			    "嘉兴市": "330400",
			    "湖州市": "330500",
			    "绍兴市": "330600",
			    "金华市": "330700",
			    "衢州市": "330800",
			    "舟山市": "330900",
			    "台州市": "331000",
			    "丽水市": "331100",
			    "合肥市": "340100",
			    "芜湖市": "340200",
			    "蚌埠市": "340300",
			    "淮南市": "340400",
			    "马鞍山市": "340500",
			    "淮北市": "340600",
			    "铜陵市": "340700",
			    "安庆市": "340800",
			    "黄山市": "341000",
			    "滁州市": "341100",
			    "阜阳市": "341200",
			    "宿州市": "341300",
			    "六安市": "341500",
			    "亳州市": "341600",
			    "池州市": "341700",
			    "宣城市": "341800",
			    "福州市": "350100",
			    "厦门市": "350200",
			    "莆田市": "350300",
			    "三明市": "350400",
			    "泉州市": "350500",
			    "漳州市": "350600",
			    "南平市": "350700",
			    "龙岩市": "350800",
			    "宁德市": "350900",
			    "南昌市": "360100",
			    "景德镇市": "360200",
			    "萍乡市": "360300",
			    "九江市": "360400",
			    "新余市": "360500",
			    "鹰潭市": "360600",
			    "赣州市": "360700",
			    "吉安市": "360800",
			    "宜春市": "360900",
			    "抚州市": "361000",
			    "上饶市": "361100",
			    "济南市": "370100",
			    "青岛市": "370200",
			    "淄博市": "370300",
			    "枣庄市": "370400",
			    "东营市": "370500",
			    "烟台市": "370600",
			    "潍坊市": "370700",
			    "济宁市": "370800",
			    "泰安市": "370900",
			    "威海市": "371000",
			    "日照市": "371100",
			    "莱芜市": "371200",
			    "临沂市": "371300",
			    "德州市": "371400",
			    "聊城市": "371500",
			    "滨州市": "371600",
			    "菏泽市": "371700",
			    "郑州市": "410100",
			    "开封市": "410200",
			    "洛阳市": "410300",
			    "平顶山市": "410400",
			    "安阳市": "410500",
			    "鹤壁市": "410600",
			    "新乡市": "410700",
			    "焦作市": "410800",
			    "濮阳市": "410900",
			    "许昌市": "411000",
			    "漯河市": "411100",
			    "三门峡市": "411200",
			    "南阳市": "411300",
			    "商丘市": "411400",
			    "信阳市": "411500",
			    "周口市": "411600",
			    "驻马店市": "411700",
			    "省直辖县级行政区划": "469000",
			    "武汉市": "420100",
			    "黄石市": "420200",
			    "十堰市": "420300",
			    "宜昌市": "420500",
			    "襄阳市": "420600",
			    "鄂州市": "420700",
			    "荆门市": "420800",
			    "孝感市": "420900",
			    "荆州市": "421000",
			    "黄冈市": "421100",
			    "咸宁市": "421200",
			    "随州市": "421300",
			    "恩施土家族苗族自治州": "422800",
			    "长沙市": "430100",
			    "株洲市": "430200",
			    "湘潭市": "430300",
			    "衡阳市": "430400",
			    "邵阳市": "430500",
			    "岳阳市": "430600",
			    "常德市": "430700",
			    "张家界市": "430800",
			    "益阳市": "430900",
			    "郴州市": "431000",
			    "永州市": "431100",
			    "怀化市": "431200",
			    "娄底市": "431300",
			    "湘西土家族苗族自治州": "433100",
			    "广州市": "440100",
			    "韶关市": "440200",
			    "深圳市": "440300",
			    "珠海市": "440400",
			    "汕头市": "440500",
			    "佛山市": "440600",
			    "江门市": "440700",
			    "湛江市": "440800",
			    "茂名市": "440900",
			    "肇庆市": "441200",
			    "惠州市": "441300",
			    "梅州市": "441400",
			    "汕尾市": "441500",
			    "河源市": "441600",
			    "阳江市": "441700",
			    "清远市": "441800",
			    "东莞市": "441900",
			    "中山市": "442000",
			    "潮州市": "445100",
			    "揭阳市": "445200",
			    "云浮市": "445300",
			    "南宁市": "450100",
			    "柳州市": "450200",
			    "桂林市": "450300",
			    "梧州市": "450400",
			    "北海市": "450500",
			    "防城港市": "450600",
			    "钦州市": "450700",
			    "贵港市": "450800",
			    "玉林市": "450900",
			    "百色市": "451000",
			    "贺州市": "451100",
			    "河池市": "451200",
			    "来宾市": "451300",
			    "崇左市": "451400",
			    "海口市": "460100",
			    "三亚市": "460200",
			    "三沙市": "460300",
			    "成都市": "510100",
			    "自贡市": "510300",
			    "攀枝花市": "510400",
			    "泸州市": "510500",
			    "德阳市": "510600",
			    "绵阳市": "510700",
			    "广元市": "510800",
			    "遂宁市": "510900",
			    "内江市": "511000",
			    "乐山市": "511100",
			    "南充市": "511300",
			    "眉山市": "511400",
			    "宜宾市": "511500",
			    "广安市": "511600",
			    "达州市": "511700",
			    "雅安市": "511800",
			    "巴中市": "511900",
			    "资阳市": "512000",
			    "阿坝藏族羌族自治州": "513200",
			    "甘孜藏族自治州": "513300",
			    "凉山彝族自治州": "513400",
			    "贵阳市": "520100",
			    "六盘水市": "520200",
			    "遵义市": "520300",
			    "安顺市": "520400",
			    "黔西南布依族苗族自治州": "522300",
			    "黔东南苗族侗族自治州": "522600",
			    "黔南布依族苗族自治州": "522700",
			    "昆明市": "530100",
			    "曲靖市": "530300",
			    "玉溪市": "530400",
			    "保山市": "530500",
			    "昭通市": "530600",
			    "丽江市": "530700",
			    "普洱市": "530800",
			    "临沧市": "530900",
			    "楚雄彝族自治州": "532300",
			    "红河哈尼族彝族自治州": "532500",
			    "文山壮族苗族自治州": "532600",
			    "西双版纳傣族自治州": "532800",
			    "大理白族自治州": "532900",
			    "德宏傣族景颇族自治州": "533100",
			    "怒江傈僳族自治州": "533300",
			    "迪庆藏族自治州": "533400",
			    "拉萨市": "540100",
			    "昌都地区": "542100",
			    "山南地区": "542200",
			    "日喀则地区": "542300",
			    "那曲地区": "542400",
			    "阿里地区": "542500",
			    "林芝地区": "542600",
			    "西安市": "610100",
			    "铜川市": "610200",
			    "宝鸡市": "610300",
			    "咸阳市": "610400",
			    "渭南市": "610500",
			    "延安市": "610600",
			    "汉中市": "610700",
			    "榆林市": "610800",
			    "安康市": "610900",
			    "商洛市": "611000",
			    "兰州市": "620100",
			    "嘉峪关市": "620200",
			    "金昌市": "620300",
			    "白银市": "620400",
			    "天水市": "620500",
			    "武威市": "620600",
			    "张掖市": "620700",
			    "平凉市": "620800",
			    "酒泉市": "620900",
			    "庆阳市": "621000",
			    "定西市": "621100",
			    "陇南市": "621200",
			    "临夏回族自治州": "622900",
			    "甘南藏族自治州": "623000",
			    "西宁市": "630100",
			    "海东地区": "632100",
			    "海北藏族自治州": "632200",
			    "黄南藏族自治州": "632300",
			    "海南藏族自治州": "632500",
			    "果洛藏族自治州": "632600",
			    "玉树藏族自治州": "632700",
			    "海西蒙古族藏族自治州": "632800",
			    "银川市": "640100",
			    "石嘴山市": "640200",
			    "吴忠市": "640300",
			    "固原市": "640400",
			    "中卫市": "640500",
			    "乌鲁木齐市": "650100",
			    "克拉玛依市": "650200",
			    "吐鲁番地区": "652100",
			    "哈密地区": "652200",
			    "昌吉回族自治州": "652300",
			    "博尔塔拉蒙古自治州": "652700",
			    "巴音郭楞蒙古自治州": "652800",
			    "阿克苏地区": "652900",
			    "克孜勒苏柯尔克孜自治州": "653000",
			    "喀什地区": "653100",
			    "和田地区": "653200",
			    "伊犁哈萨克自治州": "654000",
			    "塔城地区": "654200",
			    "阿勒泰地区": "654300",
			    "自治区直辖县级行政区划": "659000",
			    "台湾省": "710000",
			    "香港特别行政区": "810100",
			    "澳门特别行政区": "820000"
			};

			//直辖市和特别行政区-只有二级地图，没有三级地图
			let special = ["北京","天津","上海","重庆","香港","澳门"];
			let mapdata = [];
			//绘制全国地图
			$.getJSON('static/map/china.json', (data) => {
				let regionIds = [];  //所有省的ID集合(包含台湾等)
				data.features.forEach( (item, index) => {
					if(item.properties.name =='台湾' || item.properties.name=='香港' || item.properties.name=='澳门'){
                        regionIds.push({id:item.id.substring(0,item.id.length-4),name:item.properties.name,value:0});
					}else{
						regionIds.push({id:item.id.substring(0,item.id.length-4),name:item.properties.name});
					}
				});
				regionIds.push({id:'-1',name:"南海诸岛",value:0});
				//注册地图
				echarts.registerMap('china', data);
				this.$axios.post('/fx?api=gate.index.mapData',{type:'province',regionId:'0'}).then(res => {
		    	    if(res!=500){
		    		    // let d = [];
						regionIds.forEach( (ele, index) => {
							res.forEach( (i, ide) => {
								if(ele.id == i.id){
                                    regionIds[index].value = i.value;
                                    // regionIds.push({
                                    // 	name:ele.name,
                                    // 	value:ele.value
                                    // });  
								}
							});
						});
						mapdata = regionIds;
						//绘制地图
						renderMap('china',regionIds);
		    	    }
			    })
			})
            
            let that = this;
			//地图点击事件
			chart.on('click', function (params) {
				if( params.name in provinces ){
					//如果点击的是34个省、市、自治区，绘制选中地区的二级地图
					if(params.name=='台湾' || params.name=='香港' || params.name=='澳门'){
						return;
					}
					$.getJSON('static/map/province/'+ provinces[params.name] +'.json', (data)=> {
						let regionIds = [];  //所有省的ID集合
						data.features.forEach( (item, index) => {
							regionIds.push({id:item.id.substring(0,item.id.length-2),name:item.properties.name});
						});
						echarts.registerMap( params.name, data); //注册地图
						that.$axios.post('/fx?api=gate.index.mapData',{type:'city',regionId:params.data.id}).then(res => {
				    	    if(res!=500){
								regionIds.forEach( (ele, index) => {
									res.forEach( (i, ide) => {
										if(ele.id == i.id){
		                                    regionIds[index].value = i.value;
										}
									});
								});
								//绘制地图
								renderMap(params.name,regionIds);
				    	    }
					    })
						// var d = [];
						// for( var i=0;i<data.features.length;i++ ){
						// 	d.push({
						// 		name:data.features[i].properties.name,
						// 		value:145
						// 	})
						// }
						// renderMap(params.name,d);
					});
				}else if( params.seriesName in provinces ){
					//如果是【直辖市/特别行政区】只有二级下钻
					if(  special.indexOf( params.seriesName ) >=0  ){
						renderMap('china',mapdata);
					}else{
						//显示县级地图
						$.getJSON('static/map/city/'+ cityMap[params.name] +'.json', (data) => {
							let regionIds = [];  //所有省的ID集合
							data.features.forEach( (item, index) => {
								regionIds.push({name:item.properties.name});
							});
							echarts.registerMap( params.name, data); //注册地图
							that.$axios.post('/fx?api=gate.index.mapData',{type:'area',regionId:params.data.id}).then(res => {
					    	    if(res!=500){
									regionIds.forEach( (ele, index) => {
										res.forEach( (i, ide) => {
											if(ele.name == i.name){
			                                    regionIds[index].value = i.value;
											}
										});
									});
									//绘制地图
									renderMap(params.name,regionIds);
					    	    }
					    })

						// $.getJSON('static/map/city/'+ cityMap[params.name] +'.json', function(data){
						// 	echarts.registerMap( params.name, data);
						// 	var d = [];
						// 	for( var i=0;i<data.features.length;i++ ){
						// 		d.push({
						// 			name:data.features[i].properties.name,
						// 			value:456
						// 		})
						// 	}
						// 	renderMap(params.name,d);
						});	
					}	
				}else{
					renderMap('china',mapdata);
				}
			});

			//初始化绘制全国地图配置
			var option = {
				// backgroundColor: '#000',
			    title : {
			        text: '省市区各门店数',
			        link: '#',
			        left: 'center',
			        top:'25',
			        textStyle:{
			            fontSize:18,
			            fontWeight:'900',
			            color: '#545454',
			            fontFamily:"Microsoft YaHei"
			        },
			        // subtextStyle:{
			        // 	color: '#ccc',
			        //     fontSize:13,
			        //     fontWeight:'normal',
			        //     fontFamily:"Microsoft YaHei"
			        // }
			        subtextStyle: ''
			    },
			    tooltip: {
			        trigger: 'item',
			        formatter: '{b}：{c}'
			    },
			    toolbox: {
			        show: true,
			        orient: 'vertical',
			        left: 'right',
			        top: 'center',
			        feature: {
			            dataView: {readOnly: false},
			            restore: {},
			            saveAsImage: {}
			        },
			        iconStyle:{
			        	normal:{
			        		color:'#fff'
			        	}
			        }
			    },
			    animationDuration:1000,
				animationEasing:'cubicOut',
				animationDurationUpdate:1000
			     
			};
			function renderMap(map,data){
				option.title.subtext = map;
			    option.series = [ 
					{
			            name: map,
			            type: 'map',
			            mapType: map,
			            roam: false,
			            nameMap:{
						    'china':'中国'
						},
			            label: {
				            normal:{
								show:true,
								textStyle:{
									color:'#999',
									fontSize:13
								}  
				            },
				            emphasis: {
				                show: true,
				                textStyle:{
									color:'#fff',
									fontSize:13
								}
				            }
				        },
				        itemStyle: {
				            normal: {
				                areaColor: '#E4EAEF',
				                // borderColor: 'dodgerblue'
				                borderColor: '#fff',
				                color:'#323232'
				            },
				            emphasis: {
				                // areaColor: 'darkorange'
				                areaColor: '#5cadff'
				            }
				        },
			            data:data
			        }	
			    ];
			    //渲染地图
			    chart.setOption(option);
			    window.addEventListener("resize", () => { chart.resize();});
			}
		}
	},
}
</script>
<style lang="less" scoped>
    #main,#myChartPie,#myChartLine1,#myChartLine2{
    	display: inline-block;
    	background-color: #fff;
	    margin: 10px 6px;
	    padding: 5px 0;
	    border: 1px solid #EFEEF3;
	    border-radius: 6px;
	    -webkit-box-shadow: 0 0 5px 2px #EFEEF3;
	    box-shadow: 0 0 5px 2px #EFEEF3;
	    vertical-align: middle;
    }
    .common-col{
    	font-size: 16px;
    	padding: 10px 0;
    	& > div:first-child{
            color: #343434;
            font-weight: 600;
    	}
    	& > div:last-child{
    		 color: #BBB;
    	}
    }
    .common-col1{
        color: #2d8cf0;
    }
    .common-col2{
        color: #19be6b;
    }
    .common-col3{
        color: #ff9900;
    }
    .common-col4{
        color: #ed4014;
    }
    .common-col5{
        color: #2b85e4;
    }
    .common-col6{
        color: #2db7f5;
    }
    .home-title{
    	width: 97%;
    	background-color: #fff;
	    margin: 10px 6px;
	    padding: 5px 0;
	    border: 1px solid #EFEEF3;
	    border-radius: 6px;
	    box-shadow: 0 0 5px 2px #EFEEF3;
	}
</style>