<template>
  <div class="ls-text-halfLine cardBox">
    <div class="exampleBox">
      <slot></slot>
    </div>
    <div class="ls-flex ls-flex-end">
      <el-button @click="expandCode">查看代码</el-button>
    </div>
    <div class="exampleCode" :class="{expanded:isExpand}">
      <div>
        <slot name="code"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const isExpand = ref(false);

function expandCode() {
  isExpand.value = !isExpand.value;
}
</script>

<style scoped>
.cardBox {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.exampleBox {
  padding: 1em;
  border-bottom: 1px solid #dcdfe6;
}

.exampleCode {
  display: grid;
  grid-template-rows: 0fr;
  transition: .3s;
  overflow: hidden;
  background-color: #f5f7fa;
  color: #0b8235;
}

.exampleCode.expanded {
  grid-template-rows: 1fr;
}

.exampleCode > div {
  min-height: 0;
}

</style>
