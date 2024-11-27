const n=`<script setup lang="ts">\r
import {ref} from 'vue';\r
import {Verify} from 'ls-base-lib';\r
\r
// 创建验证类的示例，每个验证类示例对应一个类。\r
const v = new Verify();\r
const errMessage = ref('');\r
const messageResult = ref('');\r
const inputValue = ref('animal');\r
\r
class Animal {\r
  name() {\r
    return 'I\\'m an animal';\r
  }\r
}\r
\r
class Cat extends Animal {\r
}\r
\r
class Phone {\r
  name(){\r
    return 'I\\'m a cell phone';\r
  }\r
}\r
\r
// 待验证的测试类\r
class testClass {\r
  // 标记待验证的方法\r
  @v.fun()\r
  // 添加参数的验证规则\r
  animalFun(@v.param(['instanceof',Animal]) value: Animal) {\r
    return value.name();\r
  }\r
}\r
\r
// 创建测试类的实例，这里声明为any类型是因为环境是ts，不这样写下面的示例无法通过ts的类型检测。\r
const t: any = new testClass();\r
\r
function getValue(value: string) {\r
  if (value === 'animal')\r
    return new Animal();\r
  else if (value === 'cat')\r
    return new Cat();\r
  else\r
    return new Phone();\r
}\r
\r
function animalFun() {\r
  try {\r
    messageResult.value = t.animalFun(getValue(inputValue.value));\r
    errMessage.value = '';\r
  } catch (e) {\r
    messageResult.value = '';\r
    errMessage.value = e.toString();\r
  }\r
}\r
\r
animalFun();\r
<\/script>\r
\r
<template>\r
  <h3>instanceof类型验证</h3>\r
  <h4>验证参数是继承自某个类，这个示例中，函数的参数需要一个Animal的类型，尝试在下方选择吧</h4>\r
  <div>\r
    <input type="radio" v-model="inputValue" name="animal" value="animal" @change="animalFun"/>\r
    <label for='animal'>Animal</label>\r
    <input type="radio" v-model="inputValue" name="cat" value="cat" @change="animalFun"/>\r
    <label for='cat'>Cat</label>\r
    <input type="radio" v-model="inputValue" name="phone" value="phone" @change="animalFun"/>\r
    <label for='phone'>Phone</label>\r
  </div>\r
  <div>输出结果：{{ messageResult }}</div>\r
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
