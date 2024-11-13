<script setup lang="ts">
import {onMounted, shallowRef} from 'vue';
import {EditorState} from '@codemirror/state';
import {EditorView, basicSetup} from 'codemirror';
import {vue} from '@codemirror/lang-vue';
import {parse, compileScript, compileTemplate, compileStyle} from "vue/compiler-sfc";

const props = defineProps<{
  code: string
}>();
const editorRef = shallowRef();
let code = props.code;

function compile(code) {
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
    _code += script.content.replace(
      "export default",
      `window.${componentName} =`
    );
  }
  // 非 setup 模式下，需要编译 template。
  if (!descriptor.scriptSetup && descriptor.template) {
    const template = compileTemplate({
      source: descriptor.template.content,
      filename: descriptor.filename,
      id: descriptor.filename
    });
    _code = _code + ";" + template.code.replace(
      "export function",
      `window.${componentName}.render = function`
    );
  }

  // 创建 vue app 实例并渲染。
  _code += `;
      import { createApp } from "vue";

      window.__app__ = createApp(window.${componentName});
      window.__app__.mount("#app");

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

onMounted(() => {
  const state = EditorState.create({
    doc: code,
    extensions: [
      basicSetup,
      vue(),
      EditorView.updateListener.of((update) => {
        if (update.changes) {
          code = editorView.state.doc.toString();
        }
      })
    ]
  });

  const editorView = new EditorView({
    state,
    parent: editorRef.value
  });
})
</script>

<template>
  <el-scrollbar>
    <div ref="editorRef"></div>
  </el-scrollbar>
</template>

<style scoped>

</style>