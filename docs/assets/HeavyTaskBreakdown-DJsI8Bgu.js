import{E as R}from"./ExampleBox-CdN3YW78.js";import{d as I,j as w,o as _,a as E,e as v,w as x,h as o,f as y,E as B,b as g,_ as N}from"./index-C52NouP0.js";function h(s,u,r){let t=Array.isArray(s)?s:{length:s},a=0,n=!1;function d(p){for(;p.timeRemaining()>0&&a<t.length&&!n;)u(t[a],a),a++;!n&&a<t.length?requestIdleCallback(d):r&&r(n)}function k(){n=!0}return t.length>0?requestIdleCallback(d):r&&r(n),k}function V(s,u,r,t){let a=Array.isArray(s)?s:{length:s},n=0,d=!1;function k(){const T=Math.min(n+u,a.length);for(let c=n;c<T&&!d;c++)r(a[c],c);n=T,!d&&n<a.length?setTimeout(k):t&&t(d)}function p(){d=!0}return a.length>0?setTimeout(k):t&&t(d),p}function U(s){return new Worker(""+new URL("fibonacci.worker-rI31KqaK.js",import.meta.url).href,{name:s?.name})}function b(s){return s<=1?s:b(s-1)+b(s-2)}const M={class:"height100"},W={class:"gridBox"},A={style:{border:"1px solid #cccccc",margin:"0.5em",padding:"0.5em"}},C=["disabled"],H=["disabled"],L=["disabled"],P={style:{display:"flex","align-items":"center"}},$=["disabled"],q=I({__name:"HeavyTaskBreakdown",setup(s){const u=w(50),r=w(33),t=w(!1),a=w(1);let n;function d(){const m=performance.now();for(let l=0;l<u.value;l++)b(r.value);const e=performance.now();B.success(`完成，耗时${e-m}毫秒`)}async function k(){t.value=!0;const m=performance.now();let e=!1;await new Promise(f=>{n=h(u.value,()=>{b(r.value)},i=>{e=i,n=void 0,f(!0)})});const l=performance.now();B.success((e?"被中断":"完成")+`，耗时${l-m}毫秒`),t.value=!1}async function p(){t.value=!0;let m=!1;const e=performance.now();await new Promise(f=>{n=V(u.value,a.value,()=>{b(r.value)},i=>{m=i,n=void 0,f(!0)})});const l=performance.now();B.success((m?"被中断":"完成")+`，耗时${l-e}毫秒`),t.value=!1}async function T(){function m(){n=void 0,t.value=!1;const i=performance.now();B.success(`完成，耗时${i-e}毫秒`)}t.value=!0;const e=performance.now(),l=new U;l.addEventListener("message",m);const f={taskNumber:u.value,fibonacciNumber:r.value};n=()=>{l.terminate(),m()},l.postMessage(f)}function c(){n&&n()}return(m,e)=>{const l=g("el-input"),f=g("el-scrollbar");return _(),E("div",M,[v(f,null,{default:x(()=>[v(R,null,{code:x(()=>e[10]||(e[10]=[o("pre",null,`<div>
  添加
  <el-input type="number" v-model="taskNumber" style="display: inline;width: 250px"></el-input>
  个元素
</div>
<div>立即添加，如果数量比较大，会使UI卡死，空闲时间添加则不会</div>
<button :disabled="taskIsRun" @click="startAppend">立即添加</button>
<button style="margin-left: 2em;margin-right: 2em" :disabled="taskIsRun" @click="appendIdleTime">
  空闲时间Idle添加
</button>
<button style="margin-right: 2em" :disabled="taskIsRun" @click="appendUseTimeout">空闲时间Timeout添加</button>
<button @click="breakTask">中断执行</button>
<div style="height: 300px">
  <el-scrollbar>
    <div ref="rootRef"></div>
  </el-scrollbar>
</div>
import {ref, shallowRef} from "vue";
import {funChunkRun, funTimeoutRun} from "../util/functionUtil";
import ExampleBox from "../components/exampleBox/ExampleBox.vue";

const rootRef = shallowRef<HTMLDivElement>();
const taskNumber = ref(200000);
const taskIsRun = ref(false);

let taskBreaker: Function | undefined = undefined;

function startAppend() {
  rootRef.value!.innerHTML = '';
  for (let i = 0; i < taskNumber.value; i++) {
    const dom = document.createElement('div');
    dom.innerText = i.toString();
    rootRef.value?.append(dom);
  }
  alert('完成');
}

async function appendIdleTime() {
  taskIsRun.value = true;
  rootRef.value!.innerHTML = '';
  let isBreak = false
  await new Promise<boolean>(resolve => {
    taskBreaker = funChunkRun(taskNumber.value, (unused, i) => {
      const dom = document.createElement('div');
      dom.innerText = i.toString();
      rootRef.value?.append(dom);
    }, _isBreak => {
      isBreak = _isBreak;
      taskBreaker = undefined;
      resolve(true);
    })
  });
  alert(isBreak ? '被中断' : '完成');
  taskIsRun.value = false;
}

async function appendUseTimeout() {
  taskIsRun.value = true;
  rootRef.value!.innerHTML = '';
  let isBreak = false
  await new Promise<boolean>(resolve => {
    taskBreaker = funTimeoutRun(taskNumber.value, 300, (unused, i) => {
      const dom = document.createElement('div');
      dom.innerText = i.toString();
      rootRef.value?.append(dom);
    }, _isBreak => {
      isBreak = _isBreak;
      taskBreaker = undefined;
      resolve(true);
    })
  })
  alert(isBreak ? '被中断' : '完成');
  taskIsRun.value = false;
}

function breakTask() {
  taskBreaker && taskBreaker();
}`,-1)])),default:x(()=>[e[11]||(e[11]=o("h3",null,"计算斐波那契数列",-1)),o("div",null,[e[3]||(e[3]=y(" 计算次数： ")),v(l,{type:"number",modelValue:u.value,"onUpdate:modelValue":e[0]||(e[0]=i=>u.value=i),modelModifiers:{number:!0},style:{display:"inline",width:"100px"}},null,8,["modelValue"])]),o("div",null,[e[4]||(e[4]=y(" 计算深度： ")),v(l,{type:"number",modelValue:r.value,"onUpdate:modelValue":e[1]||(e[1]=i=>r.value=i),modelModifiers:{number:!0},style:{display:"inline",width:"100px"}},null,8,["modelValue"])]),e[12]||(e[12]=o("h3",null,"使用主线程计算，计算期间UI会停止响应",-1)),o("button",{onClick:d},"开始计算"),o("div",W,[o("div",A,[e[6]||(e[6]=o("h3",null,"使用空闲时间计算，如果每次任务耗时较短，则UI不会停止响应。",-1)),e[7]||(e[7]=o("div",null,"但是如果页面主线程一直比较繁忙，则空闲时间几乎会没有（不会执行其中的函数）",-1)),o("button",{disabled:t.value,onClick:k}," 空闲时间计算 ",8,C),e[8]||(e[8]=o("h3",null,"使用宏任务分片计算，注意尽量分割任务到17毫秒之内，这样不会影响到每帧的渲染",-1)),o("div",null,[e[5]||(e[5]=y(" 每次宏任务的计算次数 ")),v(l,{type:"number",modelValue:a.value,"onUpdate:modelValue":e[2]||(e[2]=i=>a.value=i),modelModifiers:{number:!0},style:{display:"inline",width:"100px"}},null,8,["modelValue"])]),o("button",{disabled:t.value,onClick:p},"宏任务分片计算",8,H),e[9]||(e[9]=o("h3",null,"使用其他线程计算，完全不会影响主线程",-1)),o("button",{disabled:t.value,onClick:T},"使用线程计算",8,L)]),o("div",P,[o("button",{disabled:!t.value,onClick:c},"中断执行",8,$)])])]),_:1})]),_:1})])}}}),D=N(q,[["__scopeId","data-v-28d1437a"]]);export{D as default};
