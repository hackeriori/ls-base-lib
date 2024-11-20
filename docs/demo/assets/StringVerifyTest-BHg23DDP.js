const r=`<script setup lang="ts">\r
import {ref} from 'vue';\r
import {Verify} from 'ls-base-lib';\r
\r
const numberResult = ref('');\r
const numberA = ref(3);\r
const numberB = ref(4);\r
const errMessage = ref('');\r
\r
// 创建验证类的示例，每个验证类示例对应一个类。\r
const v = new Verify();\r
\r
// 待验证的测试类\r
class testClass {\r
  // 标记待验证的方法\r
  @v.fun()\r
  // 添加参数的验证规则\r
  twoNumberAddTestFun(@v.param('required', 'number') numberA: number, @v.param('required', 'number') numberB) {\r
    return (numberA + numberB);\r
  }\r
}\r
\r
// 创建测试类的实例，这里声明为any类型是因为环境是ts，不这样写下面的示例无法通过ts的类型检测。\r
const t: any = new testClass();\r
\r
function getValue(value: number | string) {\r
  if (value === '')\r
    return undefined;\r
  else\r
    return value;\r
}\r
\r
function twoNumberAddTestFun() {\r
  try {\r
    numberResult.value = t.twoNumberAddTestFun(getValue(numberA.value), getValue(numberB.value)).toString();\r
    errMessage.value = '';\r
  } catch (e) {\r
    numberResult.value = '';\r
    errMessage.value = e.toString();\r
  }\r
}\r
\r
twoNumberAddTestFun();\r
<\/script>\r
\r
<template>\r
  <h3>必要性和数字类型验证</h3>\r
  <h4>尝试改变下面输入框的值，更改为非数字或清除，看看结果。</h4>\r
  <div>第一个数：<input v-model.number="numberA" @input="twoNumberAddTestFun"/></div>\r
  <div>第二个数：<input v-model.number="numberB" @input="twoNumberAddTestFun"/></div>\r
  <div>和为：{{ numberResult }}</div>\r
  <div v-if="errMessage" style="color:#ff0000">错误信息：{{ errMessage }}</div>\r
</template>\r
\r
<style scoped>\r
div {\r
  margin: 0.5em 0;\r
}\r
</style>`;export{r as default};
