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
	            }, {
	                path: '/CustomManage/CustomList',
	                name: 'CustomList',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/CustomManage/CustomList`),
	            }, {
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
	                path: '/LoanManage/DeductOrder',
	                name: 'DeductOrder',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/LoanManage/DeductOrder`),
	            }, {
	                path: '/LoanManage/FirstOrder',
	                name: 'FirstOrder',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/LoanManage/FirstOrder`),
	            }, {
	                path: '/LoanManage/TailOrder',
	                name: 'TailOrder',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/LoanManage/TailOrder`),
	            }, {
	                path: '/OrderManage/GPSInstall',
	                name: 'GPSInstall',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/GPSInstall`),
	            }, {
	                path: '/OrderManage/WaitCheckAgain',
	                name: 'WaitCheckAgain',
	                meta: { auth: true }, // 为true需要登录才能查看
	                component: () => import(`@/pages/OrderManage/WaitCheckAgain`),
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



