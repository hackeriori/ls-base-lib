import{E as _}from"./ExampleBox.111e36a4.js";import{d as b,s as h,k as B,r as F,o as D,a as g,f as k,w as v,h as o,g as A}from"./index.64925254.js";function T(s,l,n){let e=Array.isArray(s)?s:{length:s},u=0,a=!1;function i(p){for(;p.timeRemaining()>0&&u<e.length&&!a;)l(e[u],u),u++;!a&&u<e.length?requestIdleCallback(i):n&&n(a)}function c(){a=!0}return e.length>0?requestIdleCallback(i):n&&n(a),c}function R(s,l,n,e){let u=Array.isArray(s)?s:{length:s},a=0,i=!1;function c(){const r=Math.min(a+l,u.length);for(let t=a;t<r&&!i;t++)n(u[t],t);a=r,!i&&a<u.length?setTimeout(c):e&&e(i)}function p(){i=!0}return u.length>0?setTimeout(c):e&&e(i),p}const C={class:"height100"},x=A(" \u6DFB\u52A0 "),E=A(" \u4E2A\u5143\u7D20 "),y=o("div",null,"\u7ACB\u5373\u6DFB\u52A0\uFF0C\u5982\u679C\u6570\u91CF\u6BD4\u8F83\u5927\uFF0C\u4F1A\u4F7FUI\u5361\u6B7B\uFF0C\u7A7A\u95F2\u65F6\u95F4\u6DFB\u52A0\u5219\u4E0D\u4F1A",-1),I=["disabled"],w=["disabled"],N=["disabled"],L={style:{height:"300px"}},M=o("pre",null,`<div>\r
  \u6DFB\u52A0\r
  <el-input type="number" v-model="taskNumber" style="display: inline;width: 250px"></el-input>\r
  \u4E2A\u5143\u7D20\r
</div>\r
<div>\u7ACB\u5373\u6DFB\u52A0\uFF0C\u5982\u679C\u6570\u91CF\u6BD4\u8F83\u5927\uFF0C\u4F1A\u4F7FUI\u5361\u6B7B\uFF0C\u7A7A\u95F2\u65F6\u95F4\u6DFB\u52A0\u5219\u4E0D\u4F1A</div>\r
<button :disabled="taskIsRun" @click="startAppend">\u7ACB\u5373\u6DFB\u52A0</button>\r
<button style="margin-left: 2em;margin-right: 2em" :disabled="taskIsRun" @click="appendIdleTime">\r
  \u7A7A\u95F2\u65F6\u95F4Idle\u6DFB\u52A0\r
</button>\r
<button style="margin-right: 2em" :disabled="taskIsRun" @click="appendUseTimeout">\u7A7A\u95F2\u65F6\u95F4Timeout\u6DFB\u52A0</button>\r
<button @click="breakTask">\u4E2D\u65AD\u6267\u884C</button>\r
<div style="height: 300px">\r
  <el-scrollbar>\r
    <div ref="rootRef"></div>\r
  </el-scrollbar>\r
</div>\r
import {ref, shallowRef} from "vue";\r
import {funChunkRun, funTimeoutRun} from "../util/functionUtil";\r
import ExampleBox from "../components/exampleBox/ExampleBox.vue";\r
\r
const rootRef = shallowRef<HTMLDivElement>();\r
const taskNumber = ref(200000);\r
const taskIsRun = ref(false);\r
\r
let taskBreaker: Function | undefined = undefined;\r
\r
function startAppend() {\r
  rootRef.value!.innerHTML = '';\r
  for (let i = 0; i < taskNumber.value; i++) {\r
    const dom = document.createElement('div');\r
    dom.innerText = i.toString();\r
    rootRef.value?.append(dom);\r
  }\r
  alert('\u5B8C\u6210');\r
}\r
\r
async function appendIdleTime() {\r
  taskIsRun.value = true;\r
  rootRef.value!.innerHTML = '';\r
  let isBreak = false\r
  await new Promise<boolean>(resolve => {\r
    taskBreaker = funChunkRun(taskNumber.value, (unused, i) => {\r
      const dom = document.createElement('div');\r
      dom.innerText = i.toString();\r
      rootRef.value?.append(dom);\r
    }, _isBreak => {\r
      isBreak = _isBreak;\r
      taskBreaker = undefined;\r
      resolve(true);\r
    })\r
  });\r
  alert(isBreak ? '\u88AB\u4E2D\u65AD' : '\u5B8C\u6210');\r
  taskIsRun.value = false;\r
}\r
\r
async function appendUseTimeout() {\r
  taskIsRun.value = true;\r
  rootRef.value!.innerHTML = '';\r
  let isBreak = false\r
  await new Promise<boolean>(resolve => {\r
    taskBreaker = funTimeoutRun(taskNumber.value, 300, (unused, i) => {\r
      const dom = document.createElement('div');\r
      dom.innerText = i.toString();\r
      rootRef.value?.append(dom);\r
    }, _isBreak => {\r
      isBreak = _isBreak;\r
      taskBreaker = undefined;\r
      resolve(true);\r
    })\r
  })\r
  alert(isBreak ? '\u88AB\u4E2D\u65AD' : '\u5B8C\u6210');\r
  taskIsRun.value = false;\r
}\r
\r
function breakTask() {\r
  taskBreaker && taskBreaker();\r
}`,-1),S=b({__name:"AppendLargeDom",setup(s){const l=h(),n=B(2e5),e=B(!1);let u;function a(){l.value.innerHTML="";for(let r=0;r<n.value;r++){const t=document.createElement("div");t.innerText=r.toString(),l.value?.append(t)}alert("\u5B8C\u6210")}async function i(){e.value=!0,l.value.innerHTML="";let r=!1;await new Promise(t=>{u=T(n.value,(d,f)=>{const m=document.createElement("div");m.innerText=f.toString(),l.value?.append(m)},d=>{r=d,u=void 0,t(!0)})}),alert(r?"\u88AB\u4E2D\u65AD":"\u5B8C\u6210"),e.value=!1}async function c(){e.value=!0,l.value.innerHTML="";let r=!1;await new Promise(t=>{u=R(n.value,300,(d,f)=>{const m=document.createElement("div");m.innerText=f.toString(),l.value?.append(m)},d=>{r=d,u=void 0,t(!0)})}),alert(r?"\u88AB\u4E2D\u65AD":"\u5B8C\u6210"),e.value=!1}function p(){u&&u()}return(r,t)=>{const d=F("el-input"),f=F("el-scrollbar");return D(),g("div",C,[k(f,null,{default:v(()=>[k(_,null,{code:v(()=>[M]),default:v(()=>[o("div",null,[x,k(d,{type:"number",modelValue:n.value,"onUpdate:modelValue":t[0]||(t[0]=m=>n.value=m),style:{display:"inline",width:"250px"}},null,8,["modelValue"]),E]),y,o("button",{disabled:e.value,onClick:a},"\u7ACB\u5373\u6DFB\u52A0",8,I),o("button",{style:{"margin-left":"2em","margin-right":"2em"},disabled:e.value,onClick:i}," \u7A7A\u95F2\u65F6\u95F4Idle\u6DFB\u52A0 ",8,w),o("button",{style:{"margin-right":"2em"},disabled:e.value,onClick:c},"\u7A7A\u95F2\u65F6\u95F4Timeout\u6DFB\u52A0",8,N),o("button",{onClick:p},"\u4E2D\u65AD\u6267\u884C"),o("div",L,[k(f,null,{default:v(()=>[o("div",{ref_key:"rootRef",ref:l},null,512)]),_:1})])]),_:1})]),_:1})])}}});export{S as default};
