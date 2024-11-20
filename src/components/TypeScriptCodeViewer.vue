<script setup lang="ts">
import {onMounted, shallowRef} from 'vue';
import {basicSetup, EditorView} from 'codemirror';
import {EditorState} from '@codemirror/state';
import {javascript} from '@codemirror/lang-javascript';

const props = defineProps<{
  code: string,
}>();
const editorRef = shallowRef();

onMounted(() => {
  new EditorView({
    state: EditorState.create({
      doc: props.code,
      extensions: [
        basicSetup,
        javascript()
      ]
    }),
    parent: editorRef.value
  });
})
</script>

<template>
  <div ref="editorRef"></div>
</template>

<style scoped>

</style>