<script setup lang="ts">
import {onMounted, shallowRef} from 'vue';
import {EditorState} from '@codemirror/state';
import {EditorView, basicSetup} from 'codemirror';
import {vue} from '@codemirror/lang-vue';

const editorRef = shallowRef();
const code = shallowRef('');

onMounted(() => {
  const state = EditorState.create({
    doc: code.value,
    extensions: [
      basicSetup,
      vue(),
      EditorView.updateListener.of((update) => {
        if (update.changes) {
          code.value = editorView.state.doc.toString();
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