<script setup lang="ts">
import {ref} from 'vue';
import {Verify} from 'ls-base-lib';

// 创建验证类的示例，每个验证类示例对应一个类。
const v = new Verify();
const errMessage = ref('');
const messageResult = ref('');
const inputValue = ref('animal');

class Animal {
  name() {
    return 'I\'m an animal';
  }
}

class Cat extends Animal {
}

class Phone {
  name(){
    return 'I\'m a cell phone';
  }
}

// 待验证的测试类
class testClass {
  // 标记待验证的方法
  @v.fun()
  // 添加参数的验证规则
  animalFun(@v.param(['instanceof',Animal]) value: Animal) {
    return value.name();
  }
}

// 创建测试类的实例，这里声明为any类型是因为环境是ts，不这样写下面的示例无法通过ts的类型检测。
const t: any = new testClass();

function getValue(value: string) {
  if (value === 'animal')
    return new Animal();
  else if (value === 'cat')
    return new Cat();
  else
    return new Phone();
}

function animalFun() {
  try {
    messageResult.value = t.animalFun(getValue(inputValue.value));
    errMessage.value = '';
  } catch (e) {
    messageResult.value = '';
    errMessage.value = e.toString();
  }
}

animalFun();
</script>

<template>
  <h3>instanceof类型验证</h3>
  <h4>验证参数是继承自某个类，这个示例中，函数的参数需要一个Animal的类型，尝试在下方选择吧</h4>
  <div>
    <input type="radio" v-model="inputValue" name="animal" value="animal" @change="animalFun"/>
    <label for='animal'>Animal</label>
    <input type="radio" v-model="inputValue" name="cat" value="cat" @change="animalFun"/>
    <label for='cat'>Cat</label>
    <input type="radio" v-model="inputValue" name="phone" value="phone" @change="animalFun"/>
    <label for='phone'>Phone</label>
  </div>
  <div>输出结果：{{ messageResult }}</div>
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