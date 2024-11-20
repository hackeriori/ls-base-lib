<script setup lang="ts">
import {ref} from 'vue';
import {Verify} from 'ls-base-lib';

const numberResult = ref('');
const numberA = ref(3);
const numberB = ref(4);
const errMessage = ref('');

// 创建验证类的示例，每个验证类示例对应一个类。
const v = new Verify();

// 待验证的测试类
class testClass {
  // 标记待验证的方法
  @v.fun()
  // 添加参数的验证规则
  twoNumberAddTestFun(@v.param('required', 'number') numberA: number, @v.param('required', 'number') numberB) {
    return (numberA + numberB);
  }
}

// 创建测试类的实例，这里声明为any类型是因为环境是ts，不这样写下面的示例无法通过ts的类型检测。
const t: any = new testClass();

function getValue(value: number | string) {
  if (value === '')
    return undefined;
  else
    return value;
}

function twoNumberAddTestFun() {
  try {
    numberResult.value = t.twoNumberAddTestFun(getValue(numberA.value), getValue(numberB.value)).toString();
    errMessage.value = '';
  } catch (e) {
    numberResult.value = '';
    errMessage.value = e.toString();
  }
}

twoNumberAddTestFun();
</script>

<template>
  <h3>必要性和数字类型验证</h3>
  <h4>尝试改变下面输入框的值，更改为非数字或清除，看看结果。</h4>
  <div>第一个数：<input v-model.number="numberA" @input="twoNumberAddTestFun"/></div>
  <div>第二个数：<input v-model.number="numberB" @input="twoNumberAddTestFun"/></div>
  <div>和为：{{ numberResult }}</div>
  <div v-if="errMessage" style="color:#ff0000">错误信息：{{ errMessage }}</div>
</template>

<style scoped>
div {
  margin: 0.5em 0;
}
</style>