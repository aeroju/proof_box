<template>
	<view class="setup_header">
		<view class='server_select_panel'>
			<text class="title_text">
				<!-- #ifdef H5 -->
				选择设备：
				<!-- #endif -->
				<!-- #ifndef H5 -->
				设备：
				<!-- #endif -->
				
			</text>
			<radio-group @change="switchServer">
				<label class="label_text" v-for="item in proof_box_servers" :key="item.name">
					<radio :value='item.name' :checked="current_server.name===item.name">{{item.name}}</radio>
				</label>
			</radio-group>
			<button class="action_button" @click="onReturn">切换</button>
		</view>
		<config_item v-for="(item,index) in config['heaters']" 
			:title='"加热器件" + item' :key='item' 
			:full='[settings[item]? settings[item][1] : 5,5,8,0.5,(v)=>{settings[item][1]=v}]'
			:stop='[settings[item]? settings[item][2] :-1,-2,1,0.5,(v)=>{settings[item][2]=v}]'
		/>
		<config_item v-for="(item,index) in config['humis']"
			:title='"加湿器件" + item' :key='item' 
			:full='[settings[item]? settings[item][1] : 10 ,10,30,2,(v)=>{settings[item][1]=v}]'
			:stop='[settings[item]? settings[item][2] : -1 ,-5,5,2,(v)=>{settings[item][2]=v}]'
		/>
		<config_item v-for="(item,index) in config['fans']"
			:title='"风扇器件" + item' :key='item'
			:desc="'设置-1,-1时风扇全速运转,-2,-2时风扇最低速运转'"
			:full='[settings[item]? settings[item][1] : -1, -2 ,6,0.5,(v)=>{settings[item][1]=v}]'
			:stop='[settings[item]? settings[item][2] : -1, -2 ,1,0.5,(v)=>{settings[item][2]=v}]'
		/>
		<config_item v-for="(item,index) in config['frigs']"
			:title='"制冷器件" + item' :key='item' 
			:full='[settings[item]? settings[item][1] : 3, -6,6,0.5,(v)=>{settings[item][1]=v}]'
			:stop='[settings[item]? settings[item][2] :-1, -6,6,0.5,(v)=>{settings[item][2]=v}]'
		/>
		<view class='action_pan'>
			<button class="action_button" @click="onReturn">返回</button>
			<button class="action_button" @click="getSettings">恢复</button>
			<button class="action_button" @click="onSubmit">设置</button>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	export default {
		data() {
			return {
				config:{},
				settings:[]
			}
		},
		onLoad(){
			this.getConfig()
		},
		computed:{
			current_server(){
				return store.state.server
			},
			proof_box_servers(){
				return store.state.servers
			}
		},
		methods: {
			switchServer(e){
				this.proof_box_servers.forEach(server=>{
					if(server.name===e.detail.value){
						console.log('update server to:',server)
						store.commit('update_server',server)
					}
				});
			},
			getConfig(){
				uni.request({
				  url:this.current_server.addr  + '/box_config',
				  dataType: "json",
				  mode:'cors',
				  success:(res)=>{
					  this.config=res.data;
					  this.getSettings()
				  },
				  fail:(res)=>{
					console.log('fail get status',res);
				  },
				})
			},
			getSettings(){
				uni.request({
				  url:this.current_server.addr + '/get_settings',
				  method:'GET',
				  mode:'cors',
				  dataType:'json',
				  success:(res)=>{
					  this.settings=res.data;
				  },
				})
			},
			onSubmit(){
				let form_data = JSON.stringify(this.settings);
				uni.request({
				  url:this.current_server.addr + '/change_settings',
				  dataType:'text',
				  method:'POST',
				  mode:'cors',
				  data:form_data,
				  timeout:9000,
				  success:(res)=>{
					onReturn();
				  },
				});
			},
			onReturn(){
				uni.switchTab({
					url:'../index/index'
				})
			}

		}
	}
</script>

<style>
	.setup_header{
	  display:flex;
	  flex-direction:column;
	  justify-content: space-around;
	  align-items:stretch;
	  align-content:center;
	  // #ifdef H5
	  width:1000rpx;
	  // #endif
	  // #ifndef H5
	  width:100%;
	  // #endif
	  margin-left:auto;
	  margin-right:auto;
	  margin-top:1rpx;
	  background:rgba(197, 212, 182, 0.8);

	}
	.server_select_panel{
	  display:flex;
	  flex-direction:row;
	  justify-content: space-around;
	  align-items:stretch;
	  align-content:center;
	  background:rgba(197, 212, 182, 1);
	  padding: 10rpx;
	}
	.server_items{
	  display:flex;
	  flex-direction:row;
	  justify-content: space-around;
	  align-items:center;
	  align-content:stretch;
	}
	.value_panel{
	  display:flex;
	  flex-direction:column;
	  justify-content: space-around;
	  align-items:center;
	  align-content:stretch;
	}
	.title_pan{
	  display:flex;
	  flex-direction:column;
	  margin-top:2rpx;
	  padding:10rpx 10rpx 10rpx 10rpx;
	  text-align: center;
	}
	.values_pan{
	  display:flex;
	  flex-direction:row;
	  justify-content: space-around;
	  align-items:center;
	  padding:10rpx 20rpx 10rpx 0rpx;
	  background:rgba(197, 212, 182, 0.8);
	}
	.action_pan{
	  display:flex;
	  flex-direction:row;
	  justify-content: space-around;
	  align-items:center;
	  margin-top:2rpx;
	  padding:10rpx;
	}
	.desc_text{
	  font-size: 24rpx;
	  text-align: center;
	  margin: auto;
	}

	.setup_input  {
	  font-size: 30rpx;
	}
</style>
