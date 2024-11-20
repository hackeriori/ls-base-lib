<script setup lang="ts">
import {onMounted, shallowRef, watch} from 'vue';
import {EditorState} from '@codemirror/state';
import {basicSetup, EditorView} from 'codemirror';
import {vue} from '@codemirror/lang-vue';
import {compileScript, compileStyle, compileTemplate, parse} from "vue/compiler-sfc";
import {transpileModule} from 'typescript';
import previewTemplate from "./preview.html?raw";
import {strInsertAt} from '../../util/stringUtil';

const props = defineProps<{
  code: string,
  importMap?: Record<string, string>
}>();
const editorRef = shallowRef();
const previewRef = shallowRef();
let iFrame: HTMLIFrameElement | null = null;
let sourceCode = '';
let messageFlag = Math.random();

watch(() => props.code, () => {
  sourceCode = props.code;
  dealCode(sourceCode);
})

/**
 * 创建沙盒
 */
function createSandbox() {
  const template = document.createElement("iframe");
  template.setAttribute("style", "width: 100%;height: 100%;border: none");
  // 插入通信通道号
  const temp = strInsertAt(previewTemplate, previewTemplate.indexOf('<script type="importmap">') + 36, `
\<script\>
const messageFlog = ${messageFlag};
\<\/script\>
`);
  // 找到模块的位置并加入自定义模块
  const modules: string [] = ['"vue": "https://unpkg.com/vue@3.5.12/dist/vue.esm-browser.js"'];
  if (props.importMap)
    for (const key in props.importMap) {
      modules.push(`"${key}": "${props.importMap[key]}"`);
    }
  template.srcdoc = strInsertAt(temp, temp.indexOf('<script type="importmap">') + 25, `{
    "imports": {
      ${modules.join(',\n')}
    }
  }`);
  previewRef.value.appendChild(template);
  return template;
}

/**
 * 处理编辑器代码
 * @param code
 */
function dealCode(code: string) {
  if (!code?.trim()) return;
  const compiledCode = compile(code);
  iFrame?.contentWindow.postMessage({type: "eval", code: compiledCode}, "*");
}

/**
 * 编译代码
 * @param code
 */
function compile(code: string) {
  const {descriptor} = parse(code);
  let _code = `
    if(window.__app__){
      window.__app__.unmount();
    }
    window.__app__ = null;
    `;
  const componentName = "__AppVue__";
  // 编译脚本。
  if (descriptor.script || descriptor.scriptSetup) {
    const script = compileScript(descriptor, {
      inlineTemplate: true,
      id: descriptor.filename
    });
    let jsScript: string;
    if (script.lang === 'ts')
      jsScript = transpileModule(script.content, {
        compilerOptions: {
          module: 99,
          experimentalDecorators: true
        }
      }).outputText;
    else
      jsScript = script.content;
    _code += jsScript.replace("export default", `window.${componentName} =`);
  }
  // 非 setup 模式下，需要编译 template。
  if (!descriptor.scriptSetup && descriptor.template) {
    const template = compileTemplate({
      source: descriptor.template.content,
      filename: descriptor.filename,
      id: descriptor.filename
    });
    _code = _code + ";" + template.code.replace("export function", `window.${componentName}.render = function`);
  }
  // 创建 vue app 实例并渲染。
  _code += `;
      import { createApp } from "vue";

      window.__app__ = createApp(window.${componentName});
      try{
        window.__app__.mount("#app");
      }catch(e){
        document.getElementById("app").innerHTML = e;
        throw e;
      }

      if (window.__style__) {
        window.__style__.remove();
      }
    `;
  // 编译 css 样式。
  if (descriptor.styles?.length) {
    const styles = descriptor.styles.map((style) => {
      return compileStyle({
        source: style.content,
        filename: descriptor.filename,
        id: descriptor.filename
      }).code;
    });
    _code += `
      window.__style__ = document.createElement("style");
      window.__style__.innerHTML = ${JSON.stringify(styles.join(""))};
      document.body.appendChild(window.__style__);
      `;
  }
  return _code;
}

function preViewReady(ev: MessageEvent) {
  if (ev.data.type === 'preViewReady' && ev.data.data === messageFlag) {
    sourceCode = props.code;
    dealCode(sourceCode);
    window.removeEventListener('message', preViewReady);
  }
}

window.addEventListener('message', preViewReady);

onMounted(() => {
  new EditorView({
    state: EditorState.create({
      doc: props.code,
      extensions: [
        basicSetup,
        vue(),
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            // 即使获取焦点，这个事件也会多次触发，需要缓存以节流
            const newCode = update.state.doc.toString();
            if (sourceCode !== newCode) {
              sourceCode = newCode;
              dealCode(sourceCode);
            }
          }
        })
      ]
    }),
    parent: editorRef.value
  });
  iFrame = createSandbox();
})
</script>

<template>
  <div class="height100 ls-flex ls-flex-unShrink">
    <div class="ls-flex-subItem-grow">
      <el-scrollbar>
        <div ref="editorRef"></div>
      </el-scrollbar>
    </div>
    <div class="splitLine"></div>
    <div class="height100 ls-flex-subItem-grow" ref="previewRef"></div>
  </div>

</template>

<style scoped>
.splitLine {
  border-left: 1px solid #222;
  margin: 0 6px;
}
</style>