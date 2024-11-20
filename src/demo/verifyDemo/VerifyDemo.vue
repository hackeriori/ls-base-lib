<template>
  <div class="height100" style="padding: 0.5em;box-sizing: border-box">
    <el-scrollbar>
      <h1>验证类Verify</h1>
      <h3>背景环境</h3>
      <div>当你使用ts完成一个类库后，如何确保在js环境也获得类型校验的功能？考虑如下示例：</div>
      <div style="display: flex;min-height: 165px" v-loading="loadingCode">
        <TypeScriptCodeViewer :code="code1" style="margin-right: 1em"></TypeScriptCodeViewer>
        <TypeScriptCodeViewer :code="code2"></TypeScriptCodeViewer>
      </div>
      <div>Verify帮助我们将验证提前到参数定义阶段，省去函数体内验证代码，函数体内写函数本身要实现的功能即可。</div>
      <h3>类型定义</h3>
      请移步类型定义页关于<a target="_blank" href="/ls-base-lib/classes/index.Verify.html">Verify类</a>部分，和<a
      target="_blank" href="/ls-base-lib/types/declaration.ParameterVerifyType.html">基础验证类型</a>，<a
      target="_blank" href="/ls-base-lib/types/declaration.ParameterVerifyType.html">所有验证类型</a>
      <h3>验证规则</h3>
      <ul>
        <li>参数验证失败，将直接抛出异常，不会执行方法体。</li>
        <li>
          同一个参数，在有多个验证条件的情况下，按从左到右的顺序依次验证，一旦失败将跳过后面的验证。也就是说，可以把基础验证写在前面，这样自定义验证的验证内容就可以省去基础验证内容了。
        </li>
        <li>
          不要写自相矛盾的验证规则，例如param('number','string')，因为不存在既是数字，又是字符串的值，这样验证必然会抛出错误。
        </li>
      </ul>
      <h3>验证示例</h3>
      <div v-loading="loadingExample">
        <select v-model="exampleIndex" style="margin-bottom: 1.5em" @change="exampleSelected">
          <option v-for="item in examples" :value="item.index">{{ item.title }}</option>
        </select>
        <VuePlayground :code="exampleCode" :import-map="importMap" style="height: 250px"></VuePlayground>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent, ref, shallowRef} from 'vue';

const loadingExample = ref(true);
const loadingCode = ref(true);
const VuePlayground = defineAsyncComponent(async () => {
    const x = await import('../../components/vuePlayground/VuePlayground.vue');
    loadingExample.value = false;
    return x.default
  }
)
const TypeScriptCodeViewer = defineAsyncComponent(async () => {
  const x = await import('../../components/TypeScriptCodeViewer.vue');
  loadingCode.value = false;
  return x.default
})
const code1 = `// 使用代码验证，在函数体内实现验证逻辑
class testClass{
  twoNumberAddTestFun(a:number, b:number){
    if(!Number.isFinite(a) || !Number.isFinite(b))
      throw new Error('a and b must be number');
    return a * b;
  }
}`;
const code2 = `// 使用Verify验证，定义参数时验证即完成
const v = new Verify();
class testClass{
  @v.fun()
  twoNumberAddTestFun(@v.param('required', 'number') a: number, @v.param('required', 'number') b: number){
    return a * b;
  }
}`;
const importMap = {
  'ls-base-lib': './lsBaseLib.es.js'
};
const examples = [
  {index: 1, title: '必要性和数字类型验证', code: () => import('./NumberVerifyTest.vue?raw')},
  {index: 2, title: '字符串可选类型验证', code: () => import('./StringVerifyTest.vue?raw')}
]
const exampleIndex = ref(1);
const exampleCode = shallowRef('');

async function exampleSelected() {
  const codePromise = examples.find(item => item.index === exampleIndex.value).code;
  exampleCode.value = (await codePromise()).default;
}

exampleSelected();
</script>

<style scoped>

</style>
