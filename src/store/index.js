import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    adjustHeight: ''  
}

const mutations = {
    change_height (state) { 
    	let height = document.body.clientHeight-350; //窗口高度
    	state.adjustHeight = height;
    }
}

// const actions = {
//   changeState ({commit, state}, params) {
//   	debugger;
//     let name = params.name;
//     let height = document.body.clientHeight-320; //窗口高度
//     commit('change_' + name, height);
//   }
// }

export default new Vuex.Store({
    state,
    mutations,
    // actions
})
