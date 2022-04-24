<template>
	<view class="status_pan">
		<view class="status_view">
			<text class="label_text">加热：</text>
			<text class="value_text">{{heater}}</text>
		</view>
		<view class="status_view">
			<text class="label_text">加湿：</text>
			<text class="value_text">{{humi}}</text>
		</view>
		<view class="status_view">
			<text class="label_text">制冷：</text>
			<text class="value_text">{{frig}}</text>
		</view>
		<view class="status_view">
			<text class="label_text">风扇：</text>
			<text class="value_text">{{fan}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"status_panel",
		props:["status","r","config"],
		data() {
			return {
				
			};
		},
		computed:{
			is_running(){
				return this.r
			},
			heater(){
				let r=0
				if(this.status){
					this.status.forEach((c)=>{
						if(c[0].indexOf("heater")>=0){
							r=r+c[1]
						}
					})
					if(this.config['heaters']){
						r=r/this.config['heaters'].length
					}
				}
				return r
			},
			humi(){
				let r=0
				if(this.status){
					this.status.forEach((c)=>{
						if(c[0].indexOf("humi")>=0){
							r=c[1]
						}
					})
				}
				return r
			},
			frig(){
				let r=0
				if(this.status){
					this.status.forEach((c)=>{
						if(c[0].indexOf("frig")>=0){
							r=c[1]
						}
					})
				}
				return r
			},
			fan(){
				let r=0
				if(this.status){
					this.status.forEach((c)=>{
						if(c[0].indexOf("fan")>=0){
							r=r+c[1]
						}
					})
					if(this.config['fans']){
						r=r/this.config['fans'].length
					}					
				}
				return r
			},
		}
	}
</script>

<style>
	.status_pan{
	  display:flex;
	  flex-flow:row nowrap;
	  justify-content:space-around;
	  align-items:center;
	  padding:10rpx 10rpx 10rpx 10rpx;
	  margin-top:2rpx;
	  background:rgba(197, 212, 182, 0.4)
	}
	.status_view{
	  display:flex;
	  flex-flow:row nowrap;
	  justify-content:space-around;
	  align-items:center;

	}

</style>
