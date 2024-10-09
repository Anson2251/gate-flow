<script setup lang="ts">
import CircuitCanvas from './components/CircuitCanvas.vue';
import { ref } from 'vue';

const input1 = ref(false);
setTimeout(() => {
  input1.value = true;
  console.log("changed")
}, 1000)
</script>

<template>
  <CircuitCanvas :expression="'(A AND B) OR C'" :inputs="{ A: true, B: input1, C: false }"></CircuitCanvas>
</template>

<style scoped>

</style>
