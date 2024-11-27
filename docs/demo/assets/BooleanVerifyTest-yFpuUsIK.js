const n=`<script setup lang="ts">\r
import {ref} from 'vue';\r
import {Verify} from 'ls-base-lib';\r
\r
// 创建验证类的示例，每个验证类示例对应一个类。\r
const v = new Verify();\r
const inputValue = ref('true');\r
const errMessage = ref('');\r
const jsonResult = ref('');\r
\r
// 待验证的测试类\r
class testClass {\r
  // 标记待验证的方法\r
  @v.fun()\r
  // 添加参数的验证规则\r
  jsonWrapFun(@v.param('required', 'boolean') value: boolean) {\r
    return JSON.stringify({man: value});\r
  }\r
}\r
\r
// 创建测试类的实例，这里声明为any类型是因为环境是ts，不这样写下面的示例无法通过ts的类型检测。\r
const t: any = new testClass();\r
\r
function getValue(value: string) {\r
  if (value === 'true' || value === 'false')\r
    return JSON.parse(value);\r
  else\r
    return value;\r
}\r
\r
function jsonWrapFun() {\r
  try {\r
    jsonResult.value = t.jsonWrapFun(getValue(inputValue.value));\r
    errMessage.value = '';\r
  } catch (e) {\r
    jsonResult.value = '';\r
    errMessage.value = e.toString();\r
  }\r
}\r
\r
jsonWrapFun();\r
<\/script>\r
\r
<template>\r
  <h3>boolean类型验证</h3>\r
  <h4>验证值为boolean，真值例如<code>1</code>，假植例如<code>0</code>，<code>''</code>都无法通过校验</h4>\r
  <h4>如果你的参数不需要严格的boolean校验，只是单纯的需要一个真值或者假值，就没必要使用boolean验证</h4>\r
  <div>\r
    <input type="text" v-model="inputValue" name="booleanValue" @input="jsonWrapFun"/>\r
  </div>\r
  <div>输出结果：{{ jsonResult }}</div>\r
  <div v-if="errMessage" style="color:#ff0000">{{ errMessage }}</div>\r
</template>\r
\r
<style scoped>\r
div {\r
  margin: 0.5em 0;\r
}\r
\r
code {\r
  background-color: lightgray;\r
  margin: 0 2px\r
}\r
</style>`;export{n as default};
