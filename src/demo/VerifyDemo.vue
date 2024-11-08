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
        <li>Verify的实例有两个方法fun和param，它们都是装饰器工厂函数，分别用于方法和参数</li>
        <li>fun方法没有参数，param方法的参数为ParameterVerifyType类型，详见下方验证类型或定义文件</li>
        <li>验证方法均使用esnext语法，需要兼容老旧浏览器的请考虑babel第三方库或打全局补丁</li>
      </ul>
      <h3>验证类型</h3>
      <ul>
        <li>'required'：必要性验证</li>
        <li>'number'：数字类型验证</li>
        <li>'string'：字符串类型验证</li>
        <li>'boolean'：布尔类型验证</li>
        <li>'function'：方法类型验证</li>
        <li>'array'：数组类型验证</li>
        <li>'date'：日期类型验证</li>
        <li>'dom'：dom类型验证</li>
        <li>'map'：Map类型验证</li>
        <li>'regExp'：正则表达式类型验证</li>
        <li>'symbol'：symbol类型验证</li>
        <li>'asyncFunction'：异步方法类型验证</li>
        <li>['instanceof',x]：类实例验证，x为类</li>
        <li>['custom',x,y]：自定义验证；x为验证方法，返回值是否通过验证；y为验证失败提示信息（可选）</li>
      </ul>
      <div>布尔判断并非使用真值或者假值判断，而使用严格相等判断是否为true或false</div>
      <div>
        由于对象类型（数组是对象，日期也是对象）在js中是广义的，简单的判断对象类型并不能有效约束参数，暂时不将它添加到基础的验证类型，请考虑类实例验证和自定义验证
      </div>
      <h3>验证规则</h3>
      <ul>
        <li>参数验证失败，将直接抛出异常，不会执行方法体。参考必要性验证，本应执行的alert因为验证失败而没有执行</li>
        <li>在没有参数时不会执行参数验证（required除外），参考空参不参与验证，第二个参数不传时，不会执行number验证</li>
        <li>
          在有多个验证条件的情况下，按从左到右的顺序依次验证，一旦失败将跳过后面的验证。参考验证的顺序，自定义验证由于前方的数字验证未通过而不会执行（也就是说，可以把基础验证写在前面，这样自定义验证的验证内容就可以不用再去写基础验证的相关内容了）
        </li>
        <li>
          不要写自相矛盾的验证规则，例如('number','string')，因为不存在既是数字，又是字符串的变量，这样验证必然会抛出错误。
        </li>
      </ul>
      <h3>验证示例</h3>
      <ExampleBox>
        <el-button @click="requiredTest">必要性验证</el-button>
        <el-button @click="emptyTest">空参不参与验证</el-button>
        <el-button @click="orderTest">验证的顺序</el-button>
        <div>验证消息</div>
        <div :style="{color: message.startsWith('执行成功')?'green':'red'}">{{ message }}</div>
        <template #code>
          <pre>&lt;el-button @click="requiredTest"&gt;必要性验证&lt;/el-button&gt;
&lt;el-button @click="emptyTest"&gt;空参不参与验证&lt;/el-button&gt;
&lt;el-button @click="orderTest"&gt;验证的顺序&lt;/el-button&gt;
&lt;div&gt;验证消息&lt;/div&gt;
&lt;div :style="&#123;color: message.startsWith('执行成功')?'green':'red'&#125;"&gt;&#123;&#123; message &#125;&#125;&lt;/div&gt;
&lt;script setup lang="ts"&gt;
import Verify from "./Verify";
import &#123;ref&#125; from "vue";

const message = ref('');
const v = new Verify();

class testClass &#123;
  @v.fun()
  testFun(@v.param('required', 'number', ['custom', x =&gt; x &gt; 0, '必须是正数']) a: number, @v.param('number') b?: number) &#123;
    if (b)
      return (a + b);
    else
      return a
  &#125;
&#125;

const t: any = new testClass();

function runSuccess(value: number) &#123;
  message.value = '执行成功：' + value;
&#125;

function requiredTest() &#123;
  try &#123;
    runSuccess(t.testFun());
  &#125; catch (e) &#123;
    message.value = e as string;
  &#125;
&#125;

function emptyTest() &#123;
  try &#123;
    runSuccess(t.testFun(1));
  &#125; catch (e) &#123;
    message.value = e as string;
  &#125;
&#125;

function orderTest() &#123;
  try &#123;
    runSuccess(t.testFun('1'));
  &#125; catch (e) &#123;
    message.value = e as string;
  &#125;
&#125;
&lt;/script&gt;</pre>
        </template>
      </ExampleBox>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import ExampleBox from "../components/exampleBox/ExampleBox.vue";
import {Verify} from "../library/verify/Verify";
import {ref} from "vue";

const message = ref('');
const v = new Verify();

class testClass {
  @v.fun()
  testFun(@v.param('required', 'number', ['custom', x => x > 0, '必须是正数']) a: number, @v.param('number') b?: number) {
    if (b)
      return (a + b);
    else
      return a
  }
}

const t: any = new testClass();

function runSuccess(value: number) {
  message.value = '执行成功：' + value;
}

function requiredTest() {
  try {
    runSuccess(t.testFun());
  } catch (e) {
    message.value = e as string;
  }
}

function emptyTest() {
  try {
    runSuccess(t.testFun(1));
  } catch (e) {
    message.value = e as string;
  }
}

function orderTest() {
  try {
    runSuccess(t.testFun('1'));
  } catch (e) {
    message.value = e as string;
  }
}
</script>

<style scoped>

</style>
