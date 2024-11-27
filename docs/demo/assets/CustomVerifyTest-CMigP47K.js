const r=`<script setup lang="ts">\r
import {ref} from 'vue';\r
import {Verify} from 'ls-base-lib';\r
\r
// 创建验证类的示例，每个验证类示例对应一个类。\r
const v = new Verify();\r
const inputValue = ref('12');\r
const errMessage = ref('');\r
const stringResult = ref('');\r
\r
// 待验证的测试类\r
class testClass {\r
  // 标记待验证的方法\r
  @v.fun()\r
  // 添加参数的验证规则\r
  customVerifyFun(@v.param('number', ['custom', x => x >= 10 && x <= 100, '必须是10-100之间的数']) value: number) {\r
    return \`你输入了\${value}\`;\r
  }\r
}\r
\r
// 创建测试类的实例，这里声明为any类型是因为环境是ts，不这样写下面的示例无法通过ts的类型检测。\r
const t: any = new testClass();\r
\r
function getValue(value: string) {\r
  if (value === '')\r
    return undefined;\r
  else if (/^\\d+$/.test(value))\r
    return Number(value);\r
  else\r
    return value;\r
}\r
\r
function customVerifyFun() {\r
  try {\r
    stringResult.value = t.customVerifyFun(getValue(inputValue.value));\r
    errMessage.value = '';\r
  } catch (e) {\r
    stringResult.value = '';\r
    errMessage.value = e.toString();\r
  }\r
}\r
\r
customVerifyFun();\r
<\/script>\r
\r
<template>\r
  <h3>custom类型验证</h3>\r
  <h4>自定义验证，使用返回boolean值的自定义函数验证参数是否符合要求</h4>\r
  <h4>可以把基础验证写在前面，这样可以省去基础验证环节</h4>\r
  <div>\r
    <input type="text" v-model="inputValue" name="customValue" @input="customVerifyFun"/>\r
  </div>\r
  <div>输出结果：{{ stringResult }}</div>\r
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
</style>`;export{r as default};
