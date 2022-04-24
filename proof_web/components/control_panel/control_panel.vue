<template>
	<view class="control_display">
		<text class="title_text">
			<!-- #ifdef H5 -->
			系统状态：
			<!-- #endif -->
			<!-- #ifndef H5 -->
			状态：
			<!-- #endif -->			  
		</text>
		<view v-if="is_running" class="on_pan">
			<text class="label_text status_text">{{current_status}}</text>
			<button @click="onSwitchLight" class="action_button button_light">开灯/关灯</button>
			<button @click="onShutDown" class="action_button">关机</button>
		</view>
		<view v-else class="off_pan">
			<radio-group v-if="config" class="mode_select" @change="onSwitchMode">
				<label class="label_text" v-for="v in config['functions']" :key="'label_' + v[0]">
					<radio :value="v[0]" :checked="v[0]===mode"/>{{v[1]}}
				</label>
			</radio-group>
			<button class="action_button" @click="onStartUp">启动</button>
			<image class="button_setup" src="../../static/setup.png" mode="aspectFit" @click="openConfig"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name:"control_panel",
		props:["r","bt","config","mode","onSwitchLight","onShutDown","onStartUp","onSwitchMode"],
		data() {
			return {
				
			};
		},
		methods:{
			from_sec_to_str(s){
			    var h = Math.floor(s/3600);
			    var m = Math.floor((s-h*3600)/60);
			    var sl = s-h*3600-m*60;
			    var ret="";
			    if(h>0){
			        ret=ret+h+"小时" + m + "分";
			    }else{
			        if(m>0){
			            ret = ret + m + "分";
			        }
			    }
			    ret = ret + sl + "秒";
			    return ret;	
			},
			openConfig(){
				uni.switchTab({
					url:'../../pages/config/config'
				})
			}
		},
		computed:{
			is_running(){
				return this.r
			},
			current_status(){
				let m='';
				for(let i=0;i<this.config["functions"].length;i++){
					if(this.config["functions"][i][0]===this.mode){
					  m=this.config["functions"][i][1];
					}
				}
				
				return m +"已工作：" + this.from_sec_to_str(this.bt);
			}
		},
		
	}
</script>

<style>
	.control_display{
	  display:flex;
	  flex-flow:row nowrap;
	  justify-content:space-around;
	  align-items:center;
	  margin-top:2rpx;
	  /* #ifdef H5 */
	  padding-left: 10rpx;
	  padding-right: 10rpx;
	  /* #endif */
	  height:60rpx;
	  background:rgba(197, 212, 182, 0.8)
	}
	.mode_select{
	  margin:auto;
	  line-height:0.5;
	}
	.on_pan{
	  display:flex;
	  flex-flow:row nowrap;
	  align-items:center;
	  flex: 2 0 auto;

	}
	.off_pan{
	  display:flex;
	  flex-flow:row nowrap;
	  justify-content:space-around;
	  align-items:center;
	  flex: 2 0 auto;
	  text-align:center;
	}

	.status_text{
	  flex: 2 0 auto;
	}

	.button_setup{
	  width:60rpx;
	  height:60rpx;
	}
	
	.button_light {
	  padding-left:2rpx;
	  padding-right:2rpx;
	  margin-right: 5rpx;
	}
</style>
