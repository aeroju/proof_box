<template>
	<view class="value_panel">
		<view class="title_pan">
			<text class="title_text">{{title}}</text>
			<text class="desc_text" v-if="desc">{{desc}}</text>
		</view>
		<view class="values_pan">
			<text class="label_text">满载温差</text>
			<uni-number-box :min="full[1]" :max="full[2]" :step="full[3]" :value="full[0]" @change="full[4]"></uni-number-box>
			<text class="label_text">停止温差</text>
			<uni-number-box :min="stop[1]" :max="stop[2]" :step="stop[3]" :value="stop[0]" @change="stop[4]"></uni-number-box>
		</view>
	</view>
</template>

<script>
	export default {
		name:"config_item",
		props:["full","stop","title","desc"],
		data() {
			return {
				
			};
		}
	}
</script>

<style>
	.value_panel{
	  display:flex;
	  flex-direction:column;
	  justify-content: space-around;
	  align-items:center;
	  align-content:stretch;
	  width:100%;
	}
	.title_pan{
	  display:flex;
	  flex-direction:column;
	  margin-top:2px;
	  text-align: center;
	  width:100%;
	}
	.values_pan{
	  display:flex;
	  flex-direction:row;
	  justify-content: space-around;
	  align-items:center;
	  background:rgba(197, 212, 182, 0.8);
	  width:100%;
	}
</style>
