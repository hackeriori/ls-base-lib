<script setup lang="ts">
import {ref} from 'vue';
import {Verify} from 'ls-base-lib';

// 创建验证类的示例，每个验证类示例对应一个类。
const v = new Verify();
const inputValue = ref('true');
const errMessage = ref('');
const jsonResult = ref('');

// 待验证的测试类
class testClass {
  // 标记待验证的方法
  @v.fun()
  // 添加参数的验证规则
  jsonWrapFun(@v.param('required', 'boolean') value: boolean) {
    return JSON.stringify({man: value});
  }
}

// 创建测试类的实例，这里声明为any类型是因为环境是ts，不这样写下面的示例无法通过ts的类型检测。
const t: any = new testClass();

function getValue(value: string) {
  if (value === 'true' || value === 'false')
    return JSON.parse(value);
  else
    return value;
}

function jsonWrapFun() {
  try {
    jsonResult.value = t.jsonWrapFun(getValue(inputValue.value));
    errMessage.value = '';
  } catch (e) {
    jsonResult.value = '';
    errMessage.value = e.toString();
  }
}

jsonWrapFun();
</script>

<template>
  <h3>boolean类型验证</h3>
  <h4>验证值为boolean，真值例如<code>1</code>，假植例如<code>0</code>，<code>''</code>都无法通过校验</h4>
  <h4>如果你的参数不需要严格的boolean校验，只是单纯的需要一个真值或者假值，就没必要使用boolean验证</h4>
  <div>
    <input type="text" v-model="inputValue" name="booleanValue" @input="jsonWrapFun"/>
  </div>
  <div>输出结果：{{ jsonResult }}</div>
  <div v-if="errMessage" style="color:#ff0000">错误信息：{{ errMessage }}</div>
</template>

<style scoped>
div {
  margin: 0.5em 0;
}

code {
  background-color: lightgray;
  margin: 0 2px
}
</style>