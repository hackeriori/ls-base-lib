import{a as V,E as F}from"./el-button-KGYOF8z0.js";import{E as T}from"./ExampleBox-DNpshfl_.js";import{d as M,j as w,o as N,a as E,e as b,w as y,h as n,f as c,t as S,n as C}from"./index-CB37_AYZ.js";function j(e,l){return`${typeof e=="object"?e.constructor.name:e.name}类中的${l.toString()}方法中：`}function q(e,l,s){return e[l].toString().match(/\(.*\)/)[0].slice(1,-1).replace(/\/\*.*\*\//,"").split(",")[s].trim()}function P(e){return Array.isArray(e)?e[0]:e}function f(e,l="校验失败！",s=!1){return function(o,u,i,r){let d=!0,p=[];for(let a=0;a<o.length;a++){const t=o[a];(t.index<r.length||s)&&(e(t.index<r.length?r[t.index]:void 0,t)||(d=!1,p.push(`第${t.index+1}个参数${t.name}，${typeof l=="string"?l:l(t)}`)))}if(!d)throw`${j(u,i)}${p.join("；")}！`}}const m=new Map;m.set("required",f(e=>e!==void 0,"是必须的",!0));m.set("number",f(e=>Number.isFinite(e),"必须是数字"));m.set("string",f(e=>typeof e=="string","必须是字符串"));m.set("boolean",f(e=>e===!0||e===!1,"必须是布尔值"));m.set("function",f(e=>typeof e=="function","必须是函数"));m.set("array",f(e=>Array.isArray(e),"必须是数组"));m.set("date",f(e=>e instanceof Date&&!isNaN(e.valueOf()),"必须是日期"));m.set("dom",f(e=>e instanceof HTMLElement,"必须是HTMLElement"));m.set("map",f(e=>e instanceof Map,"必须是Map类型"));m.set("regExp",f(e=>e instanceof RegExp,"必须是正则表达式"));m.set("symbol",f(e=>typeof e=="symbol","必须是Symbol"));m.set("asyncFunction",f(e=>typeof e=="function"&&e.constructor.name==="AsyncFunction","必须是异步函数"));m.set("instanceof",f((e,l)=>e instanceof l.instance,e=>`必须是[${e.instance.name}]的实例类型`));m.set("custom",f((e,l)=>l.custom(e),e=>e.customText||"自定义校验失败"));class ${#t=new Map;param(...l){return(s,o,u)=>{const i=this.#t.get(o)||new Map;for(let r=0;r<l.length;r++){let d=P(l[r]);const p=i.get(d)||[];p.unshift({name:q(s,o,u),index:u,instance:d==="instanceof"?l[r][1]:void 0,custom:d==="custom"?l[r][1]:void 0,customText:d==="custom"&&l[r].length>2?l[r][2]:void 0}),i.set(d,p)}this.#t.set(o,i)}}fun(){return(l,s,o)=>{const u=o.value,i=this.#t.get(s);o.value=function(){if(i)for(const[r,d]of i)m.get(r)(d,l,s,arguments);return u.apply(this,arguments)}}}}var k=Object.defineProperty,A=Object.getOwnPropertyDescriptor,B=(e,l,s,o)=>{for(var u=A(l,s),i=e.length-1,r;i>=0;i--)(r=e[i])&&(u=r(l,s,u)||u);return u&&k(l,s,u),u},g=(e,l)=>(s,o)=>l(s,o,e);const D={class:"height100",style:{padding:"0.5em","box-sizing":"border-box"}},L=M({__name:"VerifyDemo",setup(e){const l=w(""),s=new $;class o{testFun(t,v){return v?t+v:t}}B([s.fun(),g(0,s.param("required","number",["custom",a=>a>0,"必须是正数"])),g(1,s.param("number"))],o.prototype,"testFun");const u=new o;function i(a){l.value="执行成功："+a}function r(){try{i(u.testFun())}catch(a){l.value=a}}function d(){try{i(u.testFun(1))}catch(a){l.value=a}}function p(){try{i(u.testFun("1"))}catch(a){l.value=a}}return(a,t)=>{const v=V,x=F;return N(),E("div",D,[b(x,null,{default:y(()=>[t[5]||(t[5]=n("h1",null,"验证类Verify",-1)),t[6]||(t[6]=n("h3",null,"背景环境",-1)),t[7]||(t[7]=n("div",null,"当你使用ts完成一个类库后，如何确保在js环境也获得类型一致性体验",-1)),t[8]||(t[8]=n("div",null,"你是否经常处理客户的报错信息，排查下来是因为调用你类库的传参错误而你没有判断",-1)),t[9]||(t[9]=n("div",null,"考虑如下示例",-1)),t[10]||(t[10]=n("pre",null,`class testClass{
  testFun(a:number, b:number){
    return a * b;
  }
}`,-1)),t[11]||(t[11]=n("div",null,"在ts环境内使用这个类库，不必考虑a和b的类型，因为编译器会强制它们为数字类型，否则无法通过编译",-1)),t[12]||(t[12]=n("div",null,"但是，在js环境，我们不得不为类库添加对应的校验代码以防止后面的代码运行出错",-1)),t[13]||(t[13]=n("div",null,"如何有效管理参数验证以创建一个稳定运行的类库，你可以考虑使用Verify类",-1)),t[14]||(t[14]=n("h3",null,"使用基础",-1)),t[15]||(t[15]=n("ul",null,[n("li",null," Verify为运行时验证，使用场景是构建稳健的第三方类库，为类方法的参数提供系列验证（因为你无法保证使用类库的环境为ts，此时编译时的类型验证就失效了） "),n("li",null,"Verify被设计成类而没有设计成单独的方法，是因为使用了类的私有属性作为Map来存储规则，而没有使用反射Reflect"),n("li",null,"Verify的实例有两个方法fun和param，它们都是装饰器工厂函数，分别用于方法和参数"),n("li",null,"fun方法没有参数，param方法的参数为ParameterVerifyType类型，详见下方验证类型或定义文件"),n("li",null,"验证方法均使用esnext语法，需要兼容老旧浏览器的请考虑babel第三方库或打全局补丁")],-1)),t[16]||(t[16]=n("h3",null,"验证类型",-1)),t[17]||(t[17]=n("ul",null,[n("li",null,"'required'：必要性验证"),n("li",null,"'number'：数字类型验证"),n("li",null,"'string'：字符串类型验证"),n("li",null,"'boolean'：布尔类型验证"),n("li",null,"'function'：方法类型验证"),n("li",null,"'array'：数组类型验证"),n("li",null,"'date'：日期类型验证"),n("li",null,"'dom'：dom类型验证"),n("li",null,"'map'：Map类型验证"),n("li",null,"'regExp'：正则表达式类型验证"),n("li",null,"'symbol'：symbol类型验证"),n("li",null,"'asyncFunction'：异步方法类型验证"),n("li",null,"['instanceof',x]：类实例验证，x为类"),n("li",null,"['custom',x,y]：自定义验证；x为验证方法，返回值是否通过验证；y为验证失败提示信息（可选）")],-1)),t[18]||(t[18]=n("div",null,"布尔判断并非使用真值或者假值判断，而使用严格相等判断是否为true或false",-1)),t[19]||(t[19]=n("div",null," 由于对象类型（数组是对象，日期也是对象）在js中是广义的，简单的判断对象类型并不能有效约束参数，暂时不将它添加到基础的验证类型，请考虑类实例验证和自定义验证 ",-1)),t[20]||(t[20]=n("h3",null,"验证规则",-1)),t[21]||(t[21]=n("ul",null,[n("li",null,"参数验证失败，将直接抛出异常，不会执行方法体。参考必要性验证，本应执行的alert因为验证失败而没有执行"),n("li",null,"在没有参数时不会执行参数验证（required除外），参考空参不参与验证，第二个参数不传时，不会执行number验证"),n("li",null," 在有多个验证条件的情况下，按从左到右的顺序依次验证，一旦失败将跳过后面的验证。参考验证的顺序，自定义验证由于前方的数字验证未通过而不会执行（也就是说，可以把基础验证写在前面，这样自定义验证的验证内容就可以不用再去写基础验证的相关内容了） "),n("li",null," 不要写自相矛盾的验证规则，例如('number','string')，因为不存在既是数字，又是字符串的变量，这样验证必然会抛出错误。 ")],-1)),t[22]||(t[22]=n("h3",null,"验证示例",-1)),b(T,null,{code:y(()=>t[3]||(t[3]=[n("pre",null,`<el-button @click="requiredTest">必要性验证</el-button>
<el-button @click="emptyTest">空参不参与验证</el-button>
<el-button @click="orderTest">验证的顺序</el-button>
<div>验证消息</div>
<div :style="{color: message.startsWith('执行成功')?'green':'red'}">{{ message }}</div>
<script setup lang="ts">
import Verify from "./Verify";
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
<\/script>`,-1)])),default:y(()=>[b(v,{onClick:r},{default:y(()=>t[0]||(t[0]=[c("必要性验证")])),_:1}),b(v,{onClick:d},{default:y(()=>t[1]||(t[1]=[c("空参不参与验证")])),_:1}),b(v,{onClick:p},{default:y(()=>t[2]||(t[2]=[c("验证的顺序")])),_:1}),t[4]||(t[4]=n("div",null,"验证消息",-1)),n("div",{style:C({color:l.value.startsWith("执行成功")?"green":"red"})},S(l.value),5)]),_:1})]),_:1})])}}});export{L as default};
