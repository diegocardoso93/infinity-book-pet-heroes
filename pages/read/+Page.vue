<template>
  <PageHeader />

  <div class="container">
    <template v-if="!captureId">
      <Page v-if="status === 0" />
      <div v-else class="end">
        That's all folks, for now. <br />
        Perhaps you'll contribute with the next chapter?
      </div>
    </template>
    <capture-eye v-else :nid="captureId">
      <media-viewer :src="`https://ipfs-pin.numbersprotocol.io/ipfs/${captureId}`" />
    </capture-eye>

    <div class="buttons">
      <button id="btnPrev" class="btnround" :disabled="currentKey==1" @click="goToPage(-1)">❮</button>
      <input type="number" min="1" :value="currentKey" @change="onChangeInputPage($event)" />
      <button id="btnNext" class="btnround" @click="goToPage(+1)">❯</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vike-vue/useData';
import { Data } from './+data';
import PageHeader from '../../components/PageHeader.vue';
import Page from '../render/+Page.vue';

const { captureId, status } = useData<Data>();
const currentKey = +new URLSearchParams(location.search).get('key')!;

function goToPage(num: number) {
  const newKey = currentKey+num;
  if (newKey < 1) {
    return;
  }
  location.replace(`/read?key=${newKey}`);
}

function onChangeInputPage(event) {
  const newKey = event.target.value;
  if (newKey < 1) {
    event.target.value = 1;
    return;
  }
  location.replace(`/read?key=${newKey}`);
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  flex-direction: column;
  align-items: center;
}
.btnround {
  border-radius: 100%;
  height: 40px;
  width: 40px;
  border: 0;
  font-size: 22px;
  cursor: pointer;
}
input {
  width: 64px;
  font-size: 23px;
}
.buttons {
  display: flex;justify-content: space-between;margin-top: 43px;z-index: 1;position: relative;width: 100%;max-width: 200px;
}
.end {
  font-size: 40px;
  width: 1076px;
  height: 564px;
  padding: 180px;
  text-align: center;
}
</style>
