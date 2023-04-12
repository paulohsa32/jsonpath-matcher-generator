<template>
  <Head>
    <Title>Pathfinder | Convert json sample into
      JsonPath</Title>
  </Head>
  <header class="flex justify-between items-center p-4 h-16 bg-violet-900 text-violet-200">
    <h1 class="text-2xl font-bold">✈️ pathfinder</h1>
    <span class="hidden md:block text-sm italic font-extralight ml-4 mt-1 text-violet-400">// Convert json sample into
      JsonPath</span>
    <div class="flex-1"></div>
    <a href="https://github.com/paulohsa32/pathfinder">
      <Icon name="uil:github" class="text-3xl" />
    </a>
  </header>
  <div class="wrapper">
    <MonacoEditor v-model="sample" lang="json" class="editor" :options="{ theme: 'vs-dark', automaticLayout: true }" />

    <div class="result">
      <h2 class="text-2xl mb-4 text-white font-bold">Output</h2>

      <div class="relative text-slate-200 italic rounded-xl p-8 border border-slate-700 bg-slate-600">
        <button
          class="absolute top-0 right-0 p-1 pb-2 pl-2 bg-slate-700 hover:text-white rounded-tr-xl rounded-bl-xl text-slate-300"
          @click="copy(result)">
          <Icon name="uil:copy" class="text-xl" />
        </button>
        {{ result }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import copy from 'copy-text-to-clipboard';
import destr from 'destr';
import { computed, ref } from 'vue';
import { useJsonPath } from '../src';
import sampleData from '../src/data/test.json';
import { isValidJsonString } from '../src/helpers';

const sample = ref<string>(JSON.stringify(sampleData, null, 2))
const result = computed(() => jsonToJpath())

function jsonToJpath(): string {
  if (sample.value === '') return '';
  if (!isValidJsonString(sample.value)) {
    return 'Invalid JSON';
  }
  const jsonSample = destr(sample.value);

  return useJsonPath(jsonSample)
}
</script>


<style lang="scss">
.wrapper {
  @apply flex flex-col;
  background-color: #1e1e1e;

  @screen lg {
    @apply flex-row;
  }
}

.editor {
  @apply pt-4 mb-4 w-full;
  height: calc(50vh - 4rem);

  @screen lg {
    @apply pt-8 w-1/2 mb-0;
    height: calc(100vh - 8rem);
  }
}

.result {
  @apply bg-slate-500 text-slate-100 p-8 text-sm break-all w-full overflow-auto;
  height: calc(50vh - 1rem);

  @screen lg {
    @apply p-16;
    height: calc(100vh - 4rem);
    width: 50%;
  }
}
</style>
