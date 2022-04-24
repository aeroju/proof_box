<template>
	<view class="setup_pan">
		<view class="setup_view">
			<text class="label_text">温度：</text>
			<text class="value_text">{{ts}}</text>
			<uni-number-box :min="is_cooling ? -18:25" :max="is_cooling ? 10:40" :step="1" v-model="target_temp" ></uni-number-box>
			<button class="action_button" @click="onTempSetup(target_temp)">设置</button>
		</view>
		<view class="setup_view">
			<text class="label_text">湿度：</text>
			<text class="value_text">{{hs}}</text>
			<uni-number-box :min="60" :max="100" :step="1" v-model="target_humi" :disabled="is_cooling"></uni-number-box>
			<button class="action_button" @click="onHumiSetup(target_humi)"  :disabled="is_cooling">设置</button>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		name:"setup_panel",
		props:["tt","th","measure","r","mode","onTempSetup","onHumiSetup"],
		data() {
			return {
				local_tt:this.tt,
				local_th:this.th,
				target_temp:this.tt,
				target_humi:this.th,
			};
		},
		beforeUpdate(){
			if(this.local_th!=this.th){
				this.local_th=this.th
				this.target_temp=this.th
			}
			if(this.local_tt!=this.tt){
				this.local_tt=this.tt
				this.target_temp=this.tt
			}
		},
		computed:{
			is_running(){
				return this.r
			},
			is_cooling(){
				return this.mode==='COOLER'
			},
			ts(){
				let r="";
				if(this.measure){					
					this.measure.forEach((v)=>{
						r=r+v[1] + '/'
					})
					r=r.substring(0,r.length-1)
				}
				return r
			},
			hs(){
				let r="";
				if(this.measure){					
					this.measure.forEach((v)=>{
						r=r+v[2] + '/'
					})
					r=r.substring(0,r.length-1)
				}
				return r
			}
		}
	}
</script>

<style>
	.setup_pan{
	  display:flex;
	  flex-flow:column;

	  margin-top:2rpx;
	  background:rgba(197, 212, 182, 0.6)
	}
	.setup_view{
	  display:flex;
	  flex-flow:row nowrap;
	  justify-content:space-around;
	  align-items:center;

	}

</style>
