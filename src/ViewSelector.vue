<template>
  <div class="height100">
    <div class="ls-text-halfLine" v-for="item in showInListRouters" :key="item.path">
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
