<script setup lang="ts">
import {ref} from 'vue';
import {Verify} from 'ls-base-lib';

const stringResult = ref('');
const stringA = ref('hello');
const stringB = ref('world');
const errMessage = ref('');

// 创建验证类的示例，每个验证类示例对应一个类。
const v = new Verify();

// 待验证的测试类
class testClass {
  // 标记待验证的方法
  @v.fun()
  // 添加参数的验证规则
  twoStringCombineTestFun(@v.param('string') stringA: string, @v.param('?string') stringB = 'world') {
    return stringA + ' ' + stringB;
  }
}

// 创建测试类的实例，这里声明为any类型是因为环境是ts，不这样写下面的示例无法通过ts的类型检测。
const t: any = new testClass();

function getValue(value: string) {
  if (value === '')
    return undefined;
  else if(/^\d+$/.test(value))
    return Number(value);
  else
    return value;
}

function twoStringCombineFun() {
  try {
    // 由于调用的时候第一个参数是传了的，所以必定导致验证，如果不传那么不会验证，第二个参数不传或传undefined都将使用默认值。
    stringResult.value = t.twoStringCombineTestFun(getValue(stringA.value), getValue(stringB.value));
    errMessage.value = '';
  } catch (e) {
    stringResult.value = '';
    errMessage.value = e.toString();
  }
}

twoStringCombineFun();
</script>

<template>
  <h3>字符串和可选类型验证</h3>
  <h4>尝试改变下面输入框的值，更改为非字符串或清除，看看结果。</h4>
  <div>第一个字符串：<input v-model="stringA" @input="twoStringCombineFun"/></div>
  <div>第二个字符串：<input v-model="stringB" @input="twoStringCombineFun"/>（可选的）</div>
  <div>合并后为：{{ stringResult }}</div>
  <div v-if="errMessage" style="color:#ff0000">{{ errMessage }}</div>
</template>

<style scoped>
div {
  margin: 0.5em 0;
}
</style>