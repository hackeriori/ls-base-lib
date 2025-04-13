<script setup lang="ts">
import {ref} from "vue";
import {funIdleRun, funTaskRun} from "../util/functionUtil";
import ExampleBox from "../components/exampleBox/ExampleBox.vue";
import {ElMessage} from "element-plus";
import 'element-plus/es/components/message/style/css'
import FibWorker from "./fibonacci.worker.ts?worker";
import {fibonacci, type MessageType} from "./fibonacci.shared";

const taskNumber = ref(50);
const fibonacciNumber = ref(33);
const taskIsRun = ref(false);
const numberInTask = ref(1);
let taskBreaker: Function | undefined = undefined;

function startNormalTask() {
  const startTime = performance.now();
  for (let i = 0; i < taskNumber.value; i++) {
    fibonacci(fibonacciNumber.value);
  }
  const endTime = performance.now();
  ElMessage.success(`完成，耗时${endTime - startTime}毫秒`);
}

async function startWithIdle() {
  taskIsRun.value = true;
  const startTime = performance.now();
  let isBreak = false;
  await new Promise<boolean>(resolve => {
    taskBreaker = funIdleRun(taskNumber.value, () => {
      fibonacci(fibonacciNumber.value);
    }, _isBreak => {
      isBreak = _isBreak;
      taskBreaker = undefined;
      resolve(true);
    })
  });
  const endTime = performance.now();
  ElMessage.success((isBreak ? '被中断' : '完成') + `，耗时${endTime - startTime}毫秒`);
  taskIsRun.value = false;
}

async function startWithTask() {
  taskIsRun.value = true;
  let isBreak = false
  const startTime = performance.now();
  await new Promise<boolean>(resolve => {
    taskBreaker = funTaskRun(taskNumber.value, numberInTask.value, () => {
      fibonacci(fibonacciNumber.value);
    }, _isBreak => {
      isBreak = _isBreak;
      taskBreaker = undefined;
      resolve(true);
    })
  })
  const endTime = performance.now();
  ElMessage.success((isBreak ? '被中断' : '完成') + `，耗时${endTime - startTime}毫秒`);
  taskIsRun.value = false;
}

async function startWithWorker() {
  function taskDone() {
    taskBreaker = undefined;
    taskIsRun.value = false;
    const endTime = performance.now();
    ElMessage.success(`完成，耗时${endTime - startTime}毫秒`);
  }

  taskIsRun.value = true;
  const startTime = performance.now();
  const worker = new FibWorker();
  worker.addEventListener('message', taskDone);
  const message: MessageType = {
    taskNumber: taskNumber.value,
    fibonacciNumber: fibonacciNumber.value
  }
  taskBreaker = () => {
    worker.terminate();
    taskDone()
  };
  worker.postMessage(message);
}

function breakTask() {
  taskBreaker && taskBreaker();
}
</script>

<template>
  <div class="height100">
    <el-scrollbar>
      <ExampleBox>
        <h3>计算斐波那契数列</h3>
        <div>
          计算次数：
          <el-input type="number" v-model.number="taskNumber" style="display: inline;width: 100px"></el-input>
        </div>
        <div>
          计算深度：
          <el-input type="number" v-model.number="fibonacciNumber" style="display: inline;width: 100px"></el-input>
        </div>
        <h3>使用主线程计算，计算期间UI会停止响应</h3>
        <button @click="startNormalTask">开始计算</button>
        <div class="gridBox">
          <div style="border:1px solid #cccccc;margin: 0.5em;padding: 0.5em">
            <h3>使用空闲时间计算，如果每次任务耗时较短，则UI不会停止响应。</h3>
            <div>但是如果页面主线程一直比较繁忙，则空闲时间几乎会没有（不会执行其中的函数）</div>
            <button :disabled="taskIsRun" @click="startWithIdle">
              空闲时间计算
            </button>
            <h3>使用宏任务分片计算，注意尽量分割任务到17毫秒之内，这样不会影响到每帧的渲染</h3>
            <div>
              每次宏任务的计算次数
              <el-input type="number" v-model.number="numberInTask" style="display: inline;width:100px"></el-input>
            </div>
            <button :disabled="taskIsRun" @click="startWithTask">宏任务分片计算</button>
            <h3>使用其他线程计算，完全不会影响主线程</h3>
            <button :disabled="taskIsRun" @click="startWithWorker">使用线程计算</button>
          </div>
          <div style="display: flex;align-items: center;">
            <button :disabled="!taskIsRun" @click="breakTask">中断执行</button>
          </div>
        </div>
        <template #code>
        <pre>&lt;div&gt;
  添加
  &lt;el-input type="number" v-model="taskNumber" style="display: inline;width: 250px"&gt;&lt;/el-input&gt;
  个元素
&lt;/div&gt;
&lt;div&gt;立即添加，如果数量比较大，会使UI卡死，空闲时间添加则不会&lt;/div&gt;
&lt;button :disabled="taskIsRun" @click="startAppend"&gt;立即添加&lt;/button&gt;
&lt;button style="margin-left: 2em;margin-right: 2em" :disabled="taskIsRun" @click="appendIdleTime"&gt;
  空闲时间Idle添加
&lt;/button&gt;
&lt;button style="margin-right: 2em" :disabled="taskIsRun" @click="appendUseTimeout"&gt;空闲时间Timeout添加&lt;/button&gt;
&lt;button @click="breakTask"&gt;中断执行&lt;/button&gt;
&lt;div style="height: 300px"&gt;
  &lt;el-scrollbar&gt;
    &lt;div ref="rootRef"&gt;&lt;/div&gt;
  &lt;/el-scrollbar&gt;
&lt;/div&gt;
import {ref, shallowRef} from "vue";
import {funChunkRun, funTimeoutRun} from "../util/functionUtil";
import ExampleBox from "../components/exampleBox/ExampleBox.vue";

const rootRef = shallowRef&lt;HTMLDivElement&gt;();
const taskNumber = ref(200000);
const taskIsRun = ref(false);

let taskBreaker: Function | undefined = undefined;

function startAppend() {
  rootRef.value!.innerHTML = '';
  for (let i = 0; i &lt; taskNumber.value; i++) {
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
  await new Promise&lt;boolean&gt;(resolve =&gt; {
    taskBreaker = funChunkRun(taskNumber.value, (unused, i) =&gt; {
      const dom = document.createElement('div');
      dom.innerText = i.toString();
      rootRef.value?.append(dom);
    }, _isBreak =&gt; {
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
  await new Promise&lt;boolean&gt;(resolve =&gt; {
    taskBreaker = funTimeoutRun(taskNumber.value, 300, (unused, i) =&gt; {
      const dom = document.createElement('div');
      dom.innerText = i.toString();
      rootRef.value?.append(dom);
    }, _isBreak =&gt; {
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
}</pre>
        </template>
      </ExampleBox>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.gridBox {
  display: grid;
  grid-template-columns: auto 1fr;
}
</style>