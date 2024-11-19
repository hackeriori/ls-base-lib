<template>
  <div class="height100" style="padding: 0.5em;box-sizing: border-box">
    <el-scrollbar>
      <h1>验证类Verify</h1>
      <h3>背景环境</h3>
      <div>当你使用ts完成一个类库后，如何确保在js环境也获得类型一致性体验</div>
      <div>你是否经常处理客户的报错信息，排查下来是因为调用你类库的传参错误而你没有判断</div>
      <div>考虑如下示例</div>
      <pre>class testClass{
  testFun(a:number, b:number){
    return a * b;
  }
}</pre>
      <div>在ts环境内使用这个类库，不必考虑a和b的类型，因为编译器会强制它们为数字类型，否则无法通过编译</div>
      <div>但是，在js环境，我们不得不为类库添加对应的校验代码以防止后面的代码运行出错</div>
      <div>如何有效管理参数验证以创建一个稳定运行的类库，你可以考虑使用Verify类</div>
      <h3>使用基础</h3>
      <ul>
        <li>
          Verify为运行时验证，使用场景是构建稳健的第三方类库，为类方法的参数提供系列验证（因为你无法保证使用类库的环境为ts，此时编译时的类型验证就失效了）
        </li>
        <li>Verify被设计成类而没有设计成单独的方法，是因为使用了类的私有属性作为Map来存储规则，而没有使用反射Reflect</li>
        <li>验证方法均使用esnext语法，需要兼容老旧浏览器的请考虑babel第三方库或打全局补丁</li>
        <li>在生产环境，因为代码压缩，错误提示的参数名会发生变化（变为压缩后的名称），但是第N个参数仍然准确</li>
      </ul>
      <h3>Verify类型</h3>
      <ul>
        <li><a href="/ls-base-lib/classes/index.Verify.html">Class Verify</a></li>
      </ul>
      <div>布尔判断并非使用真值或者假值判断，而使用严格相等判断是否为true或false</div>
      <div>
        由于对象类型（数组是对象，日期也是对象）在js中是广义的，简单的判断对象类型并不能有效约束参数，暂时不将它添加到基础的验证类型，请考虑类instanceof验证和custom验证
      </div>
      <h3>验证规则</h3>
      <ul>
        <li>参数验证失败，将直接抛出异常，不会执行方法体。</li>
        <li>在没有参数时（即参数不传的情况下）不会执行参数验证（required除外），传了参数，即使传的undefined，也会参与验证，除非你使用可选参数</li>
        <li>
          在有多个验证条件的情况下，按从左到右的顺序依次验证，一旦失败将跳过后面的验证。也就是说，可以把基础验证写在前面，这样自定义验证的验证内容就可以不用再去写基础验证的相关内容了
        </li>
        <li>
          不要写自相矛盾的验证规则，例如('number','string')，因为不存在既是数字，又是字符串的变量，这样验证必然会抛出错误。
        </li>
      </ul>
      <h3>验证示例</h3>
      <h4>必要性和数字类型验证</h4>
      <VuePlayground :code="RequiredTest" :import-map="importMap" style="height: 250px"></VuePlayground>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import VuePlayground from '../../components/vuePlayground/VuePlayground.vue';
import RequiredTest from './BaseVerifyTest.vue?raw';

const importMap = {
  'ls-base-lib': './lsBaseLib.es.js'
};
</script>

<style scoped>

</style>
