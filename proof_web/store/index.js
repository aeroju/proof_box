import { createStore } from 'vuex'
const store = createStore({
	state(){
		return {
			"servers":[
			  {'name':'测试','addr':'http://192.168.31.183'},
			  {'name':'冷藏/发酵柜','addr':'http://192.168.31.244'},
			  {'name':'小发酵箱','addr':'http://192.168.31.74'},
			],
			"server":{'name':'冷藏/发酵柜','addr':'http://192.168.31.244'},
		}
	},
	mutations:{
		update_server(state,server){
			state.server=server
		},
	},
})

export default store