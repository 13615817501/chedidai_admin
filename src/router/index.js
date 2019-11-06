import Vue from 'vue'
import Router from 'vue-router'
import util from '@/util/util.js'
const Mainlayout = () => import('@/pages/Mainlayout')
const Login = () => import('@/pages/Login/Login')

Vue.use(Router)

var router = new Router({
	routes: [
	    {
	        path: '/',
	        redirect: {name: 'Welcome'}
	    },
	    {
	        path: '/Login',
	        name: 'Login',
	        component: Login
	    },
	    {
	        path: '/Main',
	        component: Mainlayout,
	        children: [
	            {
	                path: '/Index',
	                name: 'Index',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/Index/Index`),
	            }, {
	                path: '/Welcome',
	                name: 'Welcome',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/Welcome/Welcome`),
	            }, {
	                path: '/AfterLoanManage/DisposalAssets',
	                name: 'DisposalAssets',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/AfterLoanManage/DisposalAssets`),
	            }, {
	                path: '/AfterLoanManage/CollectList',
	                name: 'CollectList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/AfterLoanManage/CollectList`),
	            }, {
	                path: '/AfterLoanManage/OverdueOrder',
	                name: 'OverdueOrder',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/AfterLoanManage/OverdueOrder`),
	            }, {
	                path: '/AfterLoanManage/PendingRepayment',
	                name: 'PendingRepayment',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/AfterLoanManage/PendingRepayment`),
	            }, {
	                path: '/AfterLoanManage/DocReturnList',
	                name: 'DocReturnList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/AfterLoanManage/DocReturnList`),
	            }, {
	                path: '/Authorization/AdminList',
	                name: 'AdminList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/Authorization/AdminList`),
	            }, {
	                path: '/Authorization/ApiList',
	                name: 'ApiList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/Authorization/ApiList`),
	            }, {
	                path: '/Authorization/MenuManage',
	                name: 'MenuManage',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/Authorization/MenuManage`),
	            }, {
	                path: '/Authorization/RoleManage',
	                name: 'RoleManage',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/Authorization/RoleManage`),
	            }, {
	                path: '/Authorization/OrgList',
	                name: 'OrgList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/Authorization/OrgList`),
	            },{
	                path: '/RentManager/UploadPayment',
	                name: 'UploadPayment',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/RentManager/UploadPayment`),
	            }, {
	                path: '/RentManager/DeductUpload',
	                name: 'DeductUpload',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/RentManager/DeductUpload`),
	            },{
	                path: '/RentManager/CollectFeedback',
	                name: 'CollectFeedback',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/RentManager/CollectFeedback`),
	            }, {
	                path: '/RentManager/RepaymentDeduction',
	                name: 'RepaymentDeduction',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/RentManager/RepaymentDeduction`),
	            },{
	                path: '/CustomManage/CustomList',
	                name: 'CustomList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/CustomManage/CustomList`),
	            },{
	                path: '/CustomManage/RecmdList',
	                name: 'RecmdList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/CustomManage/RecmdList`),
	            },{
	                path: '/CustomManage/CarList',
	                name: 'CarList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/CustomManage/CarList`),
	            }, {
	                path: '/FinanceManage/PaymentHistory',
	                name: 'PaymentHistory',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/FinanceManage/PaymentHistory`),
	            }, {
	                path: '/FinanceManage/RecordPayment',
	                name: 'RecordPayment',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/FinanceManage/RecordPayment`),
	            }, {
	                path: '/LoanManage/Claim',
	                name: 'Claim',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/LoanManage/Claim`),
	            },{
	                path: '/LoanManage/DeductFailList',
	                name: 'DeductFailList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/LoanManage/DeductFailList`),
	            },{
	                path: '/LoanManage/DeductFailFeedbackList',
	                name: 'DeductFailFeedbackList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/LoanManage/DeductFailFeedbackList`),
	            },{
	                path: '/LoanManage/PendingLoan',
	                name: 'PendingLoan',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/LoanManage/PendingLoan`),
	            }, {
	                path: '/LoanManage/FirstStageDeduction',
	                name: 'FirstStageDeduction',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/LoanManage/FirstStageDeduction`),
	            }, {
	                path: '/LoanManage/LoanDetail',
	                name: 'LoanDetail',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/LoanManage/LoanDetail`),
	            }, {
	                path: '/OrderManage/GPSInstall',
	                name: 'GPSInstall',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/GPSInstall`),
	            },{
	                path: '/OrderManage/WaitUnderwriting',
	                name: 'WaitUnderwriting',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/WaitUnderwriting`),
	            },{
	                path: '/OrderManage/OrderList',
	                name: 'OrderList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/OrderList`),
	            },{
	                path: '/OrderManage/WaitClaimCheckAgain',
	                name: 'WaitClaimCheckAgain',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/WaitClaimCheckAgain`),
	            },{
	                path: '/OrderManage/WaitClaimCheck',
	                name: 'WaitClaimCheck',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/WaitClaimCheck`),
	            },{
	                path: '/OrderManage/WaitClaimStore',
	                name: 'WaitClaimStore',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/WaitClaimStore`),
	            },{
	                path: '/OrderManage/StoreOrderList',
	                name: 'StoreOrderList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/StoreOrderList`),
	            },{
	                path: '/OrderManage/GPSCheck',
	                name: 'GPSCheck',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/GPSCheck`),
	            }, {
	                path: '/OrderManage/WaitCheckAgain',
	                name: 'WaitCheckAgain',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/WaitCheckAgain`),
	            },{
	                path: '/OrderManage/WaitClaimCollect',
	                name: 'WaitClaimCollect',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/WaitClaimCollect`),
	            }, {
	                path: '/OrderManage/RejectList',
	                name: 'RejectList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/RejectList`),
	            }, {
	                path: '/OrderManage/SignContract',
	                name: 'SignContract',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/SignContract`),
	            }, {
	                path: '/OrderManage/WaitAuditingList',
	                name: 'WaitAuditingList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/WaitAuditingList`),
	            }, {
	                path: '/OrderManage/WaitConfirmList',
	                name: 'WaitConfirmList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/WaitConfirmList`),
	            },  {
	                path: '/OrderManage/ProcessDetail',
	                name: 'ProcessDetail',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/ProcessDetail`),
	            },{
	                path: '/OrderManage/WaitStoreDetail',
	                name: 'WaitStoreDetail',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/WaitStoreDetail`),
	            }, {
	                path: '/OrderManage/WaitStoreList',
	                name: 'WaitStoreList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/WaitStoreList`),
	            }, {
	                path: '/OrderManage/WaitUnderwritingList',
	                name: 'WaitUnderwritingList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/WaitUnderwritingList`),
	            }, {
	                path: '/OrganizedManage/PersonList',
	                name: 'PersonList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrganizedManage/PersonList`),
	            }, {
	                path: '/OrganizedManage/StoreList',
	                name: 'StoreList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrganizedManage/StoreList`),
	            }, {
	                path: '/ProductManage/ContractItemList',
	                name: 'ContractItemList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/ProductManage/ContractItemList`),
	            },{
	                path: '/ProductManage/ContractManage',
	                name: 'ContractManage',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/ProductManage/ContractManage`),
	            }, {
	                path: '/ProductManage/ContractList',
	                name: 'ContractList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/ProductManage/ContractList`),
	            },   {
	                path: '/ProductManage/ProductGroupList',
	                name: 'ProductGroupList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/ProductManage/ProductGroupList`),
	            }, {
	                path: '/ProductManage/ProductList',
	                name: 'ProductList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/ProductManage/ProductList`),
	            }, {
	                path: '/ProductManage/StoreProduct',
	                name: 'StoreProduct',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/ProductManage/StoreProduct`),
	            }, {
	                path: '/OrderDetail',
	                name: 'OrderDetail',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/components/OrderDetail`),
	            }, {
	                path: '/Finance/PaymentOut',
	                name: 'PaymentOut',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/Finance/PaymentOut`),
	            },{
	                path: '/Finance/PaymentIn',
	                name: 'PaymentIn',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/Finance/PaymentIn`),
	            },{
	                path: '/Finance/Distribution',
	                name: 'Distribution',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/Finance/Distribution`),
	            },{
	                path: '/Finance/OrderCollectList',
	                name: 'OrderCollectList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/Finance/OrderCollectList`),
	            }
	        ]
	    },{
		    path: '*',  //404页面
		    component: () => import(`@/pages/404`),
        }
	]
})

router.beforeEach((to, from, next) => {
	let mat = localStorage.getItem('mat');
	let nickName = localStorage.getItem('nickName');
	if (to.matched.some(record => record.meta.auth)) {
		if (!mat || !nickName) {
			next({
				name: 'Login'
			})
		} else {
			next()
		}
	} else {
		if(to.name == 'Login' && mat && nickName){
            next(false)  
		}else{
			next() // 确保一定要调用 next() 
		}
	}
})

export default router;



