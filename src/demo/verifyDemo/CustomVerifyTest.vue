<script setup lang="ts">
import {ref} from 'vue';
import {Verify} from 'ls-base-lib';

// 创建验证类的示例，每个验证类示例对应一个类。
const v = new Verify();
const inputValue = ref('12');
const errMessage = ref('');
const stringResult = ref('');

// 待验证的测试类
class testClass {
  // 标记待验证的方法
  @v.fun()
  // 添加参数的验证规则
  customVerifyFun(@v.param('number', ['custom', x => x >= 10 && x <= 100, '必须是10-100之间的数']) value: number) {
    return `你输入了${value}`;
  }
}

// 创建测试类的实例，这里声明为any类型是因为环境是ts，不这样写下面的示例无法通过ts的类型检测。
const t: any = new testClass();

function getValue(value: string) {
  if (value === '')
    return undefined;
  else if (/^\d+$/.test(value))
    return Number(value);
  else
    return value;
}

function customVerifyFun() {
  try {
    stringResult.value = t.customVerifyFun(getValue(inputValue.value));
    errMessage.value = '';
  } catch (e) {
    stringResult.value = '';
    errMessage.value = e.toString();
  }
}

customVerifyFun();
</script>

<template>
  <h3>custom类型验证</h3>
  <h4>自定义验证，使用返回boolean值的自定义函数验证参数是否符合要求</h4>
  <h4>可以把基础验证写在前面，这样可以省去基础验证环节</h4>
  <div>
    <input type="text" v-model="inputValue" name="customValue" @input="customVerifyFun"/>
  </div>
  <div>输出结果：{{ stringResult }}</div>
  <div v-if="errMessage" style="color:#ff0000">{{ errMessage }}</div>
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