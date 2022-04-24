<template>
	<view>
		<view class="container">
			<view class='h5control_header'>
			  <text class='title_text'>当前设备：{{current_server.name}}</text>
			  <control_panel
				:onSwitchLight='onSwitchLight' 
				:onStartUp='onStartUp'
				:onShutDown='onShutDown'
				:onSwitchMode='onSwitchMode'
				:config="config"
				v-bind="msg" 
			  />
			  <setup_panel 
				:config="config"
				:onTempSetup="onTempSetup"
				:onHumiSetup="onHumiSetup"
				v-bind="msg"
			  />
			  <status_panel 
				:config="config"
				v-bind="msg"
			  />
			</view>
			<charts_panel v-if="msg['r']"
							:config="config" 
							v-bind="msg"
			/>
		</view>
		
	</view>
</template>

<script>
	import store from '@/store/index.js'
	export default {
		data() {
			return {
				config:{
					functions:[],
				},
				msg:{
					mode:'HEATER',
					r:false,
					measure:[],
					status:[],
					tt:28,
					th:85,
				},
				href: 'https://uniapp.dcloud.io/component/README?id=uniui'
			}
		},
		onLoad(){
			this.getConfig();
			this.checkStatus();
			this.timerID = setInterval(
			  () => this.checkStatus(),
			  33000
			);
		},

		computed:{
			current_server(){
				return store.state.server
			}
		},
		methods: {
			onSwitchLight(){
				uni.request({
					type: "GET",
					url:this.current_server.addr + "/operate?op=switch_light",
					dataType: "text",
					mode:'cors',
					success:(res)=>{
					},
					fail:(res)=>{
					  console.log('fail startup');
					},
				})
			},
			onStartUp(){
				uni.request({
					type: "GET",
					url:this.current_server.addr + "/operate?op=startup",
					dataType: "text",
					mode:'cors',
					success:(res)=>{
						this.checkStatus()
					},
					fail:(res)=>{
					  console.log('fail startup');
					},
				})
			},
			onShutDown(){
				uni.request({
					type: "GET",
					url:this.current_server.addr + "/operate?op=shutdown",
					dataType: "text",
					mode:'cors',
					success:(res)=>{
						this.msg.r=false
					},
					fail:(res)=>{
					  console.log('fail startup');
					},
				})
			},
			onSwitchMode(e){
				let mode=e.detail.value
				console.log('switch mode:',mode)
				uni.request({
				  url:this.current_server.addr  + '/operate?op=switch_mode&value=' + mode,
				  method:'GET',
				  dataType: "text",
				  mode:'cors',
				}).then(response=>{
					this.msg.mode=mode;
					this.checkStatus()
				}).catch((e)=>{});
				
			},
			onTempSetup(t){
				uni.request({
					type: "GET",
					url:this.current_server.addr + "/operate?op=temp_val&value=" +t,
					dataType: "text",
					mode:'cors',
					success:(res)=>{
						this.msg.tt=t;
					},
					fail:(res)=>{
					  console.log('fail startup');
					},
				})
			},
			onHumiSetup(t){
				uni.request({
					type: "GET",
					url:this.current_server.addr + "/operate?op=humi_val&value=" +t,
					dataType: "text",
					mode:'cors',
					success:(res)=>{
						this.msg.th=t;
					},
					fail:(res)=>{
					  console.log('fail startup');
					},
				})
			},
			getConfig(){
				uni.request({
				  url:this.current_server.addr  + '/box_config',
				  dataType: "json",
				  mode:'cors',
				  success:(res)=>{
					  this.config=res.data;
				  },
				  fail:(res)=>{
					console.log('fail get status',res);
				  },
				})
			},
			checkStatus(){
				uni.request({
				  url:this.current_server.addr  + '/status',
				  dataType: "json",
				  mode:'cors',
				  success:(res)=>{
					  this.msg=res.data;
				  },
				  fail:(res)=>{
					console.log('fail get status');
				  },
				})
			}
			
		}
	}
</script>

<style>
	.container {
		font-size: 14px;
		line-height: 24px;
	}

	.h5control_header{
	  display:flex;
	  flex-direction:column;
	  justify-content: space-around;
	  align-items:stretch;
	  // #ifdef H5
	  width:1000rpx;
	  // #endif
	  // #ifndef H5
	  width:100%;
	  // #endif
	  margin-left:auto;
	  margin-right:auto;
	  margin-top:1rpx;
	  background:#ddd;
	}
	
</style>
