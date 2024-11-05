<template>
  <PageHeader />
  <form name="content-form" @submit.prevent="">
    <h3>+ New Chapter</h3>
    <div class="form-input">
      <h3>Hero</h3>
      <select id="hero" name="hero" @change="showHero">
        <option selected></option>
        <option v-for="(hero, idx) in heroes" :key="idx" :value="idx">[{{ hero.kind }}] {{ hero.name }}</option>
      </select>
    </div>
    <div class="form-input">
      <h3>chapter</h3>
      <input id="chapter" type="chapter" name="chapter" placeholder="Mission: ..." />
    </div>
    <button type="submit" :disabled="lastGenerated || loading1 || loading2" @click="create">
      <template v-if="loading1">loading... please wait for about 1min</template>
      <template v-else-if="lastGenerated">done ✔</template>
      <template v-else>create</template>
    </button>
    <button type="submit" :disabled="!lastGenerated || loading1 || loading2 || finished" @click="upload">
      <template v-if="loading2">loading... please wait for about 1min</template>
      <template v-else-if="finished">done ✔</template>
      <template v-else>send to Capture</template>
    </button>

    <button v-if="finished" @click="readChapter()">
      done! 🎉 click here to start reading...
    </button>
    <div v-if="message">{{ message }}</div>
    <img v-else :src="selectedHeroImg" />
  </form>

  <ModalLoginCapture v-if="showLogin" @close="showLogin = false" />
</template>

<script lang="ts" setup>
import { useData } from 'vike-vue/useData';
import { Data } from './+data';
import { IPFS_NODE } from '../+config';
import { ref } from 'vue';
import PageHeader from '../../components/PageHeader.vue';
import ModalLoginCapture from '../../components/ModalLoginCapture.vue';

const selectedHeroImg = ref();
const lastGenerated = ref();
const finished = ref();
const loading1 = ref();
const loading2 = ref();
const showLogin = ref();
const message = ref();

const { heroes } = useData<Data>();
console.log(heroes);

function showHero(event) {
  const selected = event?.target.value;
  console.log(selected);
  selectedHeroImg.value = `${IPFS_NODE}/${heroes[selected].cardNid}`;
}

async function verifyCaptureToken(token: string) {
  const response = await fetch('https://api.numbersprotocol.io/api/v3/auth/users/me', {
    method: 'GET',
    headers: {
      'Authorization': `token ${token}`,
    },
  })
  const data = await response.json();
  console.log(data);
  return !data.error;
}

async function create(event: any) {
  if (!localStorage.getItem('captureToken') || !await verifyCaptureToken(localStorage.getItem('captureToken') || '')) {
    showLogin.value = true;
    return;
  }

  loading1.value = true;
  console.log("criar");
  event.preventDefault();
  const hero = document.querySelector('#hero').value;
  const chapter = document.querySelector('#chapter').value;

  const result = await fetch('/api/create-chapter', {
    method: 'post',
    body: JSON.stringify({ hero, chapter }),
    headers: {
      'content-type': 'application/json'
    },
  });
  const data = await result.json();
  lastGenerated.value = data.key;
  console.log(data);
  if (data.locked) {
    message.value = 'we are busy now, please retry in 10 seconds...';
    setTimeout(() => message.value = false, 10000);
  }
  loading1.value = false;
}

async function upload() {
  if (!localStorage.getItem('captureToken') || !await verifyCaptureToken(localStorage.getItem('captureToken') || '')) {
    showLogin.value = true;
    return;
  }

  loading2.value = true;
  const response = await fetch('/api/upload-chapter', {
    method: 'post',
    body: JSON.stringify({ key: lastGenerated.value, token: localStorage.getItem('captureToken') }),
    headers: {
      'content-type': 'application/json'
    },
  });
  if (response.status == 200) {
    finished.value = true;
    loading2.value = false;
  } else {
    const data = await response.json();
    console.log(data);
    loading2.value = false;
    message.value = 'error, try again. ' + data.message;
  }
}

function readChapter() {
  location.href = `/read?key=${lastGenerated.value-2}`;
}
</script>

<style scoped>
h3 {
  text-transform: uppercase;
  font-weight: 300;
  -webkit-letter-spacing: 2px;
  -moz-letter-spacing: 2px;
  -ms-letter-spacing: 2px;
  letter-spacing: 2px;
  font-size: 14px;
  font-family: 'Poppins',sans-serif;
  margin-bottom: 6px;
}
form {
  padding: 0;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: auto;
}
button {
  color: white;
  border: 1px solid white;
  background: black;
  cursor: pointer;
  padding: 10px;
  font-weight: bold;
  font-size: 16px;
  margin: 10px;
  border-radius: 6px;
}
select {
  padding: 10px;
  margin: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  background: black;
  border: 1px solid white;
  border-radius: 6px;
  color: white;
}
input {
  padding: 10px;
  margin: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  background: black;
  border: 1px solid white;
  border-radius: 6px;
  color: white;
}
img {
  margin-top: 10px;
}
.form-input {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.form-input h3 {
  width: 100px;
  text-align: right;
}
.form-input input,select {
  width: 100%;
}
button:disabled {
  color: rgba(255, 255, 255, 0.4);
  background: #333333;
  cursor: not-allowed;
}
</style>
