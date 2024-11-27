const n=`<script setup lang="ts">\r
import {ref} from 'vue';\r
import {Verify} from 'ls-base-lib';\r
\r
const stringResult = ref('');\r
const stringA = ref('hello');\r
const stringB = ref('world');\r
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
  twoStringCombineTestFun(@v.param('string') stringA: string, @v.param('?string') stringB = 'world') {\r
    return stringA + ' ' + stringB;\r
  }\r
}\r
\r
// 创建测试类的实例，这里声明为any类型是因为环境是ts，不这样写下面的示例无法通过ts的类型检测。\r
const t: any = new testClass();\r
\r
function getValue(value: string) {\r
  if (value === '')\r
    return undefined;\r
  else if(/^\\d+$/.test(value))\r
    return Number(value);\r
  else\r
    return value;\r
}\r
\r
function twoStringCombineFun() {\r
  try {\r
    // 由于调用的时候第一个参数是传了的，所以必定导致验证，如果不传那么不会验证，第二个参数不传或传undefined都将使用默认值。\r
    stringResult.value = t.twoStringCombineTestFun(getValue(stringA.value), getValue(stringB.value));\r
    errMessage.value = '';\r
  } catch (e) {\r
    stringResult.value = '';\r
    errMessage.value = e.toString();\r
  }\r
}\r
\r
twoStringCombineFun();\r
<\/script>\r
\r
<template>\r
  <h3>字符串和可选类型验证</h3>\r
  <h4>尝试改变下面输入框的值，更改为非字符串或清除，看看结果。</h4>\r
  <div>第一个字符串：<input v-model="stringA" @input="twoStringCombineFun"/></div>\r
  <div>第二个字符串：<input v-model="stringB" @input="twoStringCombineFun"/>（可选的）</div>\r
  <div>合并后为：{{ stringResult }}</div>\r
  <div v-if="errMessage" style="color:#ff0000">{{ errMessage }}</div>\r
</template>\r
\r
<style scoped>\r
div {\r
  margin: 0.5em 0;\r
}\r
</style>`;export{n as default};
