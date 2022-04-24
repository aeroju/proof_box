<template>
	<view>
		<qiun-data-charts class="h5_chart" type="line" :chartData="dChartData" :opts="easyChartOption"/>
	</view>
</template>

<script>
	import baseOption from "./chart_option_dchart.js"
	import store from '@/store/index.js'
	export default {
		name:"charts_panel",
		props:["config","measure","tt","th","dts","mode"],
		data() {
			return {
				time_series:[],
				sensors_data:[],
			};
		},
		beforeMount(){
			this.initChart();
		},
		mounted(){
			this.initData();
		},
		computed:{
			current_server(){
				return store.state.server
			},
			target_temp(){
				return this.tt
			},
			target_humi(){
				return this.th
			},
			dChartData(){
				if(this.measure && this.dts){
					let lines=[this.dts]
					this.measure.forEach((sensor)=>{
						lines.push(sensor[0]);
						lines.push(sensor[1]);
						lines.push(sensor[2]);
					})
					this.addData(lines)
				}
				// let data={categories:this.time_series,series:this.sensors_data}
				return this.shrinkData(100)
			},
			dChartOption(){
				let op=baseOption["baseOption"];

				op["line"]["extra"]["markLine"]["data"][0]["value"]=this.target_temp;
				if(this.mode==="COOLER"){
					op["line"]["extra"]["markLine"]["data"][1]["value"]=this.target_humi	
				}
				return op["line"];
			},
			easyChartOption(){
				let op={};
				// #ifdef H5
				op['xAxis']={'labelCount':50./this.time_series.length}
				// #endif
				// #ifndef H5
				op['xAxis']={'labelCount':30./this.time_series.length}
				// #endif
				if(this.mode==='COOLER'){
					op['extra']={'markLine':{'data':[{'value':this.target_temp},{'value':this.target_humi}]}};
				}else{
					op['extra']={'markLine':{'data':[{'value':this.target_temp}]}};
				}
				return op
				
			}
			
		},
		methods:{
			initChart(){
				let hcs=["#ee4423","#ee6423","#ee8423"]
				let ucs=["#2323ee","#6464ee","#8484ff"]
				if(this.config && this.config["sersors"]){
					this.config["sersors"].forEach((s,index)=>{
						this.sensors_data.push({"name":s + "温度","data":[],'color':hcs[index]})
						this.sensors_data.push({"name":s + "湿度","data":[],'color':ucs[index]})
					})
					
				}
			},
			valid_date(s){
				if(parseFloat(s)){
					return parseFloat(s)
				}else{
					return 0
				}
				
			},
			addData(line){
				this.time_series.push(line[0].split(' ')[1]);
				for(let i=1,j=0;i<line.length;i=i+3){
					// j=0
					this.sensors_data[j]['data'].push(this.valid_date(line[i+1]))
					j=j+1
					this.sensors_data[j]['data'].push(this.valid_date(line[i+2]))
					j=j+1
				}
			},
			initData(){
				uni.request({
				  url: this.current_server.addr + '/his',
				  method:'GET',
				  dataType: "text",
				  mode:'cors',
				  success:(res)=>{
					var lines = res.data.split("\n");
					for(var i=0;i<lines.length;i++){
						var line=lines[i].split("^");
						this.addData(line);
					}
				  }	
				})
			},
			shrinkData(max_rows){
				const total_rows=this.time_series.length
				const shrink_rate=parseInt(total_rows/max_rows)
				console.log('begin to shrink..., rate:',shrink_rate)
				if(! shrink_rate || shrink_rate<=1){
					return {categories:this.time_series,series:this.sensors_data}
				}else{
					console.log('begin to shrink..., rate:',shrink_rate)
					let shrink_time_series=[]
					let shrink_series=[]
					this.sensors_data.forEach(item=>{
						shrink_series.push({name:item.name,data:[],color:item.color})
					})
					let k=0
					for(let i=0;i<total_rows;i+=shrink_rate){
						k=i+shrink_rate
						if(k>=total_rows){
							k=total_rows-1
						}
						shrink_time_series.push(Math.max(...this.time_series.slice(i,k)))
						for(let j=0;j<shrink_series.length;j++){
							let data_to_shrink=this.sensors_data[j].data.slice(i,k)
							let _max=Math.max(...data_to_shrink)
							let _min=Math.min(...data_to_shrink)
							
							//尖峰
							if(data_to_shrink[0]<_max && data_to_shrink[data_to_shrink.length-1]<_max){
								shrink_series[j].data.push(_max)
							}else if(data_to_shrink[0]>_min && data_to_shrink[data_to_shrink.length-1]>_min){
								shrink_series[j].data.push(_min)
							}else{
								let _sum=data_to_shrink.reduce((previous, current) => current += previous)
								let _ave=_sum/data_to_shrink.length
								shrink_series[j].data.push(_ave)
							}
							
						}
					}
					return {categories:shrink_time_series,series:shrink_series}
				}
			}
		}

	}
</script>

<style>
	.h5_chart{
		/* #ifdef H5 */
		width: 2400rpx;
		height:1600rpx;
		/* #endif */
		/* #ifndef H5 */
		width: 100%;
		height:600rpx;
		/* #endif */

		  margin-left:auto;
		  margin-right:auto;
		  margin-top:1px;
		  background:#f8f8f7;
	}
</style>
