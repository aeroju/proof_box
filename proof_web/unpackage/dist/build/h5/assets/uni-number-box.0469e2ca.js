import{V as t,o as e,c as u,w as i,a,W as l,R as s,b as n,i as o,g as r,X as d}from"./index.8a365006.js";var c=(t,e)=>{const u=t.__vccOpts||t;for(const[i,a]of e)u[i]=a;return u};function m(e,u){return t(e)?u:e}var h=c({name:"UniNumberBox",emits:["change","input","update:modelValue","blur","focus"],props:{value:{type:[Number,String],default:1},modelValue:{type:[Number,String],default:1},min:{type:Number,default:0},max:{type:Number,default:100},step:{type:Number,default:1},background:{type:String,default:"#f5f5f5"},color:{type:String,default:"#333"},disabled:{type:Boolean,default:!1}},data:()=>({inputValue:0}),watch:{value(t){this.inputValue=+t},modelValue(t){this.inputValue=+t}},created(){1===this.value&&(this.inputValue=+this.modelValue),1===this.modelValue&&(this.inputValue=+this.value)},methods:{_calcValue(t){if(this.disabled)return;const e=this._getDecimalScale();let u=this.inputValue*e,i=this.step*e;if("minus"===t){if(u-=i,u<this.min*e)return;u>this.max*e&&(u=this.max*e)}if("plus"===t){if(u+=i,u>this.max*e)return;u<this.min*e&&(u=this.min*e)}this.inputValue=(u/e).toFixed(String(e).length-1),this.$emit("change",+this.inputValue),this.$emit("input",+this.inputValue),this.$emit("update:modelValue",+this.inputValue)},_getDecimalScale(){let t=1;return~~this.step!==this.step&&(t=Math.pow(10,String(this.step).split(".")[1].length)),t},_onBlur(t){this.$emit("blur",t);let e=t.detail.value;if(!e)return;e=+e,e>this.max?e=this.max:e<this.min&&(e=this.min);const u=this._getDecimalScale();this.inputValue=e.toFixed(String(u).length-1),this.$emit("change",+this.inputValue),this.$emit("input",+this.inputValue)},_onFocus(t){this.$emit("focus",t)}}},[["render",function(t,c,m,h,p,b){const V=o,f=r,_=d;return e(),u(f,{class:"uni-numbox"},{default:i((()=>[a(f,{onClick:c[0]||(c[0]=t=>b._calcValue("minus")),class:"uni-numbox__minus uni-numbox-btns",style:s({background:m.background})},{default:i((()=>[a(V,{class:l(["uni-numbox--text",{"uni-numbox--disabled":p.inputValue<=m.min||m.disabled}]),style:s({color:m.color})},{default:i((()=>[n("-")])),_:1},8,["class","style"])])),_:1},8,["style"]),a(_,{disabled:m.disabled,onFocus:b._onFocus,onBlur:b._onBlur,class:"uni-numbox__value",type:"number",modelValue:p.inputValue,"onUpdate:modelValue":c[1]||(c[1]=t=>p.inputValue=t),style:s({background:m.background,color:m.color})},null,8,["disabled","onFocus","onBlur","modelValue","style"]),a(f,{onClick:c[2]||(c[2]=t=>b._calcValue("plus")),class:"uni-numbox__plus uni-numbox-btns",style:s({background:m.background})},{default:i((()=>[a(V,{class:l(["uni-numbox--text",{"uni-numbox--disabled":p.inputValue>=m.max||m.disabled}]),style:s({color:m.color})},{default:i((()=>[n("+")])),_:1},8,["class","style"])])),_:1},8,["style"])])),_:1})}],["__scopeId","data-v-3684a261"]]);export{c as _,h as a,m as r};