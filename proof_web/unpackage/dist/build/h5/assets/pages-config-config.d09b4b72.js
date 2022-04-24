import{m as t,o as e,c as s,w as a,a as n,b as l,t as i,e as o,i as u,g as r,T as c,A as d,s as g,d as f,r as _,F as p,k as m,f as h,h as v,j as x}from"./index.72c8eacf.js";import{_ as b,r as k,a as C}from"./uni-number-box.4b3e9081.js";var y=b({name:"config_item",props:["full","stop","title","desc"],data:()=>({})},[["render",function(c,d,g,f,_,p){const m=u,h=r,v=k(t("uni-number-box"),C);return e(),s(h,{class:"value_panel"},{default:a((()=>[n(h,{class:"title_pan"},{default:a((()=>[n(m,{class:"title_text"},{default:a((()=>[l(i(g.title),1)])),_:1}),g.desc?(e(),s(m,{key:0,class:"desc_text"},{default:a((()=>[l(i(g.desc),1)])),_:1})):o("",!0)])),_:1}),n(h,{class:"values_pan"},{default:a((()=>[n(m,{class:"label_text"},{default:a((()=>[l("满载温差")])),_:1}),n(v,{min:g.full[1],max:g.full[2],step:g.full[3],value:g.full[0],onChange:g.full[4]},null,8,["min","max","step","value","onChange"]),n(m,{class:"label_text"},{default:a((()=>[l("停止温差")])),_:1}),n(v,{min:g.stop[1],max:g.stop[2],step:g.stop[3],value:g.stop[0],onChange:g.stop[4]},null,8,["min","max","step","value","onChange"])])),_:1})])),_:1})}],["__scopeId","data-v-67fc0a0a"]]);var S=b({data:()=>({config:{},settings:[]}),onLoad(){this.getConfig()},computed:{current_server:()=>c.state.server,proof_box_servers:()=>c.state.servers},methods:{switchServer(t){this.proof_box_servers.forEach((e=>{e.name===t.detail.value&&(console.log("update server to:",e),c.commit("update_server",e))}))},getConfig(){d({url:this.current_server.addr+"/box_config",dataType:"json",mode:"cors",success:t=>{this.config=t.data,this.getSettings()},fail:t=>{console.log("fail get status",t)}})},getSettings(){d({url:this.current_server.addr+"/get_settings",method:"GET",mode:"cors",dataType:"json",success:t=>{this.settings=t.data}})},onSubmit(){let t=JSON.stringify(this.settings);d({url:this.current_server.addr+"/change_settings",dataType:"text",method:"POST",mode:"cors",data:t,timeout:9e3,success:t=>{onReturn()}})},onReturn(){g({url:"../index/index"})}}},[["render",function(o,c,d,g,b,C){const S=u,T=v,j=x,R=m,w=h,E=r,I=k(t("config_item"),y);return e(),s(E,{class:"setup_header"},{default:a((()=>[n(E,{class:"server_select_panel"},{default:a((()=>[n(S,{class:"title_text"},{default:a((()=>[l(" 选择设备： ")])),_:1}),n(R,{onChange:C.switchServer},{default:a((()=>[(e(!0),f(p,null,_(C.proof_box_servers,(t=>(e(),s(j,{class:"label_text",key:t.name},{default:a((()=>[n(T,{value:t.name,checked:C.current_server.name===t.name},{default:a((()=>[l(i(t.name),1)])),_:2},1032,["value","checked"])])),_:2},1024)))),128))])),_:1},8,["onChange"]),n(w,{class:"action_button",onClick:C.onReturn},{default:a((()=>[l("切换")])),_:1},8,["onClick"])])),_:1}),(e(!0),f(p,null,_(b.config.heaters,((t,a)=>(e(),s(I,{title:"加热器件"+t,key:t,full:[b.settings[t]?b.settings[t][1]:5,5,8,.5,e=>{b.settings[t][1]=e}],stop:[b.settings[t]?b.settings[t][2]:-1,-2,1,.5,e=>{b.settings[t][2]=e}]},null,8,["title","full","stop"])))),128)),(e(!0),f(p,null,_(b.config.humis,((t,a)=>(e(),s(I,{title:"加湿器件"+t,key:t,full:[b.settings[t]?b.settings[t][1]:10,10,30,2,e=>{b.settings[t][1]=e}],stop:[b.settings[t]?b.settings[t][2]:-1,-5,5,2,e=>{b.settings[t][2]=e}]},null,8,["title","full","stop"])))),128)),(e(!0),f(p,null,_(b.config.fans,((t,a)=>(e(),s(I,{title:"风扇器件"+t,key:t,desc:"设置-1,-1时风扇全速运转,-2,-2时风扇最低速运转",full:[b.settings[t]?b.settings[t][1]:-1,-2,6,.5,e=>{b.settings[t][1]=e}],stop:[b.settings[t]?b.settings[t][2]:-1,-2,1,.5,e=>{b.settings[t][2]=e}]},null,8,["title","full","stop"])))),128)),(e(!0),f(p,null,_(b.config.frigs,((t,a)=>(e(),s(I,{title:"制冷器件"+t,key:t,full:[b.settings[t]?b.settings[t][1]:3,-6,6,.5,e=>{b.settings[t][1]=e}],stop:[b.settings[t]?b.settings[t][2]:-1,-6,6,.5,e=>{b.settings[t][2]=e}]},null,8,["title","full","stop"])))),128)),n(E,{class:"action_pan"},{default:a((()=>[n(w,{class:"action_button",onClick:C.onReturn},{default:a((()=>[l("返回")])),_:1},8,["onClick"]),n(w,{class:"action_button",onClick:C.getSettings},{default:a((()=>[l("恢复")])),_:1},8,["onClick"]),n(w,{class:"action_button",onClick:C.onSubmit},{default:a((()=>[l("设置")])),_:1},8,["onClick"])])),_:1})])),_:1})}],["__scopeId","data-v-f8b45e00"]]);export{S as default};
