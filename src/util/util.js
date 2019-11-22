
import '@/axiosConfig/axiosConfig'
import moment from 'moment'
let util = {
    searchList(searchData,time,type){ //搜索通用功能   type为是否是时间区间到时分秒
        time = time || 'beginTime';
        let formData = {...searchData};
        let bool = formData[time].every(item => {
            return item == '';
        });
        if(!bool){
            if(!type){
                formData[time] = moment(formData[time][0]).format("YYYY-MM-DD") + '~' + moment(formData[time][1]).format("YYYY-MM-DD");
            }else{
                formData[time] = moment(formData[time][0]).format("YYYY-MM-DD HH:mm:ss") + '~' + moment(formData[time][1]).format("YYYY-MM-DD HH:mm:ss");
            }
        }else{
            formData[time] = '';
        }
        return formData;
    },
    getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        var r = window.location.search.substr(1).match(reg)
        if (r != null) {
            return unescape(r[2])
        }
        return null
    },
    getApiString(url){
        return url.slice(url.indexOf('=')+1);
    },
    formatInsType(type){ //格式化用户类型
        switch (type) {
            case '1':
                return '身份证';  
                break;
            case '2':
                return '军官证';
                break;
            case '3':
                return '户口本';
                break;
            default:
                return ''
                break;  
        }      
    },
    formatUserType(type){ //格式化用户类型
        switch (type) {
            case 1:
                return '萌新用户';  
                break;
            case 2:
                return '审核黑名单用户';
                break;
            case 3:
                return '逾期黑名单用户';
                break;  
            case 4:
                return '优质用户';
                break;  
            case 5:
                return '逾期用户';
                break;  
            case 6:
                return '暂拒用户';
                break;                    
        }      
    },
    formatUserSatus(status){
        switch (status) {
            case 1:
                return '正常';  
                break;
            case 2:
                return '黑名单';
                break;
            case 3:
                return '禁用';
                break;  
            case 4:
                return '被拒绝';
                break;  
        }      
    },
    formatOverdueType(type){ //格式化逾期状态
        switch (type) {
            case 1:
                return '未逾期'
                break;
            case 2:
                return '逾期'
                break;
        }      
    },
    formatIdentify(type){ //格式化认证状态
        switch (type) {
            case 1:
                return '未认证'
                break;
            case 2:
                return '认证中'
                break;
            case 3:
                return '已认证'
                break;
            default:
                return ' '
                break;       
        }   
    },
    formatStatus(status){ //格式化认证状态
        switch (status) {
            case 0:
                return '未处理'
                break;
            case 1:
                return '已处理'
                break;
            case 2:
                return '已处理'
                break;   
        }      
    },
    formatDistribute(type){  //格式化分配状态
        switch (type) {
            case 1:
                return '待分配';
                break;
            case 2:
                return '已分配' 
                break;    
            default:
               return ''
                break;
        }
    },
    timesToName(times,name){  //格式化通讯录姓名
        if(name){
            return name;
        }
        if( times == 0 ){ 
            return '/';
        }else if( times == 1 ){
            return name;
        }else if( times > 1 && times < 10){
            return '重复';
        }else{
            return '重复10次以上';
        }
    },
    rejectState(type){
        switch (type) {
            case 1:
                return '机审拒绝';
                break;
            case 2:
                return '人工拒绝' 
                break;    
            default:
               return '默认'
                break;
        }
    },
    formatLoanType(type){ //打款类型
        switch (type) {
            case 1:
                return '支付宝';
                break;
            case 2:
                return '手工打款' 
                break;
            case 3:
                return '合利宝' 
                break;          
            default:
               return ''
                break;
        }
    },
    formatRepayment(type){ //还款类型
        switch (type) {
            case 1:
                return '结清';
                break;
            case 2:
                return '续期' 
                break;
            default:
               return ''
                break;
        }
    },
    bannerStatus(status){ //格式化banner有效状态
        switch (status) {
            case 0:
                return '未生效';
                break;
            case 1:
                return '已生效' 
                break;
            default:
               return ''
                break;
        }         
    },
    channelStatus(status){ //格式化渠道状态
        switch (status) {
            case 0:
                return '禁用';
                break;
            case 1:
                return '正常' 
                break;
            default:
               return ''
                break;
        }         
    },
    formatPayStatus(){  //打款支付状态
        switch (status) {
            case 0:
                return '待打款';
                break;
            case 1:
                return '打款中' 
                break;
            case 2:
                return '完成' 
                break;
            case 3:
                return '失败' 
                break;         
            default:
               return ''
                break;
        }      
    },
    checkUrl(url){ //验证URL格式
        var reg=/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        return reg.test(url);
    },
    formatAge(name,content){
        if (Number.isFinite(Number(name))) {
            if (name >= 100) {
                return content;
            }
            return '';
        } else {
            return content;
        }
    },
    formatFloat(num){
        let index = num.indexOf('.');
        let neg = num.indexOf('-');
        if(neg!=-1){
           return false;
        }
        if(index!=-1){
            let len = num.slice(index + 1).length;
            if (len > 2) {
                return false;
            }else{
                return true;
            }
        }else{
            return true;
        }
    },
    formatFloat2(num){
        if(!num){
            return true;
        }
        if(num && !Number.isFinite(Number(num))){
            return false;
        }
        let index = num.indexOf('.');
        let neg = num.indexOf('-');
        if(neg!=-1){
           return false;
        }
        if(index!=-1){
            let len = num.slice(index + 1).length;
            if (len > 2) {
                return false;
            }else{
                return true;
            }
        }else{
            return true;
        }
    },
    formatOrderNum(num) { //格式化分配订单数
        let index = num.indexOf('.');
        let neg = num.indexOf('-');
        if( index!=-1 || neg!=-1 ){
            return false;
        }else{
            return true;
        }
    },
    formatRoleType(type){
        switch (type) {
            case 1:
                return '保险顾问';
                break;
            case 2:
                return '主管';
                break;
            case 3:
                return '事业部经理';
                break;
            case 4:
                return '市场总监';
                break;            
        }
    },
    formatName(name) {
        switch (name) {
            case 'StoreList':
                return 'OrganizedManage';
                break;
            case 'PersonList':
                return 'OrganizedManage';
                break;    
            case 'CustomList':
                return 'CustomManage';
                break; 
            case 'CarList':
                return 'CustomManage'; 
                break;   
            case 'RecmdList':
                return 'CustomManage'; 
                break;         
            case 'ProductList':
                return 'ProductManage';
                break;  
            case 'StoreProduct':
                return 'ProductManage';
                break;  
            case 'ContractList':
                return 'ProductManage';
                break;
            case 'ContractItemList':
                return 'ProductManage';
                break;
            case 'ProductGroupList':
                return 'ProductManage';
                break;       
            case 'RejectList':
                return 'OrderManage';
                break; 
            case 'WaitStoreList':
                return 'OrderManage';
                break;
            case 'WaitCheckAgain':
                return 'OrderManage';
                break;    
            case 'WaitAuditingList':
                return 'OrderManage';
                break;  
            case 'WaitConfirmList':
                return 'OrderManage';
                break;
            case 'WaitUnderwritingList':
                return 'OrderManage';
                break; 
            case 'SignContract':
                return 'OrderManage';
                break; 
            case 'GPSInstall':
                return 'OrderManage';
                break;
            case 'UploadPayment':
                return 'RentManager';
                break;
            case 'GPSCheck':
                return 'OrderManage';
                break;      
            case 'HandlingMortgage':
                return 'OrderManage';
                break;  
            case 'StoreOrderList':
                return 'OrderManage';
                break;
            case 'OrderList':
                return 'OrderManage';
                break;
            case 'WaitClaimCheckAgain':
                return 'OrderManage';
                break;
            case 'WaitClaimCheck':
                return 'OrderManage';
                break;
            case 'WaitClaimStore':
                return 'OrderManage';
                break;  
            case 'WaitUnderwriting':
                return 'OrderManage';
                break;  
            case 'WaitClaimCollect':
                return 'OrderManage';
                break;        
            case 'Claim':
                return 'LoanManage';
                break;  
            case 'PendingLoan':
                return 'LoanManage';
                break;  
            case 'FirstStageDeduction':
                return 'LoanManage';
                break; 
            case 'CollectFeedback':
                return 'RentManager';
                break;     
            case 'RepaymentDeduction':
                return 'RentManager';
                break;  
            case 'DeductFailList':
                return 'LoanManage';
                break; 
            case 'DeductUpload':
                return 'RentManager';
                break;  
            case 'DeductFailFeedbackList':
                return 'LoanManage';
                break;          
            case 'PendingRepayment':
                return 'AfterLoanManage';
                break; 
            case 'DocReturnList':
                return 'AfterLoanManage';
                break;     
            case 'CollectList':
                return 'AfterLoanManage';
                break;
            case 'OverdueOrder':
                return 'AfterLoanManage';
                break;    
            case 'DisposalAssets':
                return 'AfterLoanManage';
                break;
            case 'RecordPayment':
                return 'FinanceManage';
                break;
            case 'PaymentHistory':
                return 'FinanceManage';
                break;  
            case 'AdminList':
                return 'Authorization';
                break;
            case 'MenuManage':
                return 'Authorization';
                break;   
            case 'RoleManage':
                return 'Authorization';
                break;
            case 'ApiList':
                return 'Authorization';
                break;
            case 'OrgList':
                return 'Authorization';
                break; 
            case 'PaymentOut':
                return 'Finance';
                break;  
            case 'PaymentIn':
                return 'Finance';
                break; 
            case 'Distribution':
                return 'Finance';
                break; 
            case 'OrderCollectList':
                return 'Finance';
                break;                         
        }
    },
    accountFomart(name){
        switch (name) {
            case 'OrderList':
                return '订单列表'
                break;
            case 'StoreOrderList':
                return '门店订单列表'
                break;   
            case 'WaitClaimStore':
                return '门店认领'
                break;   
            case 'WaitStoreList':
                return '待门店处理'
                break;  
            case 'WaitClaimCheck':
                return '待初审认领'
                break; 
            case 'WaitAuditingList':
                return '待初审订单'
                break;   
            case 'WaitConfirmList':
                return '待确认订单'
                break;   
            case 'WaitUnderwriting':
                return '待发起核保'
                break;   
             case 'SignContract':
                return '签署合同'
                break;   
            case 'PrintInsurance':
                return '打印合同'
                break;   
            case 'GPSInstall':
                return '待GPS安装'
                break;   
            case 'WaitClaimCollect':
                return '贷后认领'
                break;   
            case 'GPSCheck':
                return '待GPS校验'
                break;   
            case 'WaitClaimCheckAgain':
                return '复审认领'
                break;    
            case 'WaitCheckAgain':
                return '待复审订单'
                break; 
            case 'ServiceClaim':
                return '客服认领'
                break; 
            case 'WaitService':
                return '待客服处理'
                break;       
            case 'Claim':
                return '认领'
                break;
            case 'PendingLoan':
                return '待放款'
                break;
            case 'FirstStageDeduction':
                return '首期划扣'
                break;
            case 'DeductFailList':
                return '划扣失败列表'
                break;  
            case 'DeductFailFeedbackList':
                return '划扣失败反馈'
                break;    
            case 'RepaymentDeduction':
                return '还款划扣'
                break;       
            case 'CollectFeedback':
                return '催收反馈'
                break;  
             case 'DocReturnList':
                return '资料回寄'
                break;  
            case 'PendingRepayment':
                return '待还款订单'
                break;  
            case 'OverdueOrder':
                return '逾期订单'
                break;  
            case 'CollectList':
                return '催收记录'
                break; 
            case 'UploadPayment':
                return '上传资方还款计划表'
                break;            
            case 'DisposalAssets':
                return '资产处置'
                break;        
        }
    },
    accountFomart2(name){
        switch (name) {
            case 'Claim':
                return '放款管理'
                break; 
            case 'PendingLoan':
                return '放款管理'
                break; 
            case 'FirstStageDeduction':
                return '放款管理'
                break; 
            case 'DeductFailList':
                return '放款管理'
                break; 
            case 'DeductFailFeedbackList':
                return '放款管理'
                break; 
            case 'RepaymentDeduction':
                return '租金管理'
                break; 
            case 'UploadPayment':
                return '租金管理'
                break;
            case 'CollectFeedback':
                return '租金管理'
                break;
            case 'DocReturnList':
                return '贷后管理'
                break;
            case 'PendingRepayment':
                return '贷后管理'
                break;case 'OverdueOrder':
                return '贷后管理'
                break;
            case 'CollectList':
                return '贷后管理'
                break;
            case 'DisposalAssets':
                return '贷后管理'
                break;    
            default:
                return '订单管理'
                break;  
        }
    },
    testPhone(num) {
        let regPhone = /^1\d{10}$/;
        return regPhone.test(num);
    },
    testIdNum(num) {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return reg.test(num);
    }

}

export default util;