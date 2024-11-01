<template>
  <div class="height100">
    <div class="ls-text-halfLine" v-for="item in showInListRouters" :key="item.path">
      <router-link :to="{
        path:item.path,
        query:item.meta && item.meta['query'] || {},
        params:item.meta && item.meta['params'] || {}
      }">
        {{ item.name }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {RouteRecordRawLike, routes} from "./router";

const showInListRouters = computed(() => routes.filter(x => !x.meta || (x.meta && (x.meta['showInList'] === true || x.meta['showInList'] === undefined))) as RouteRecordRawLike[]);
</script>
