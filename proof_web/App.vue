<script>
	export default {
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
	.title_text{
	  font-size: 36rpx;
	  font-weight: bold;
	  text-align: center;
	  margin: auto;
	}
	.label_text{
	  font-size: 30rpx;
	  text-align: center;
	}
	.value_text{
	  font-size: 24rpx;
	  text-align: center;
	  margin: auto;
	}
	.action_button{
	  background: #add;
	  border: 1rpx solid;
	  margin:auto;
	  font-size: 30rpx;
	  line-height:1.8;
	  // width: 158px;
	  // height:40px;
	}
</style>
