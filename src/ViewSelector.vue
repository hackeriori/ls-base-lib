<template>
  <div class="height100">
    <div class="ls-text-halfLine" v-for="item in showInListRouters" :key="item.path" style="margin:0.5em 0">
      <router-link :to="{
        path:item.path,
        query:item.meta?.query,
      }">
        {{ item.name }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {routes} from "./router";

const showInListRouters = computed(() => routes.filter(x => !x.meta || (x.meta && (x.meta['showInList'] === true || x.meta['showInList'] === undefined))));
</script>
