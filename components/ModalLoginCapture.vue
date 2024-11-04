<template>
  <div class="modal overlay">
    <div class="content">
      <div class="close" @click="close()">&times;</div>
      <div class="item">
        <div>
          <div class="bubble-element Group cmaUaIaQ bubble-r-container flex row" style="overflow: visible; justify-content: flex-start; border-radius: 0px; opacity: 1; align-self: center; min-width: 160px; max-width: 160px; order: 1; min-height: 35px; max-height: 35px; width: 160px; flex-grow: 1; height: max-content; margin: 10px 10px 10px 0px; z-index: 8; background-color: rgba(255, 255, 255, 0); background-repeat: no-repeat; background-position: center center; background-size: cover; background-image: url(&quot;https://ff520f7e780dd0eafa95355f6c465eb0.cdn.bubble.io/f1684836661176x661161624568722400/Capture%20White%20App%20Wordmark.svg&quot;);"></div>
        </div>
        <form name="capture-login-form" @submit.prevent="getCaptureToken()">
          <input id="email" type="email" placeholder="email" />
          <input id="password" type="password" placeholder="password">
          <button type="submit" :disabled="loading">
            <div v-if="loading" class="loadingContainer">
              <div class="loadingIcon">◌</div>
            </div>
            <template v-else>Login</template>
          </button>
        </form>
        <div class="message">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const emit = defineEmits(['close']);

const loading = ref();
const message = ref();

function close() {
  emit('close');
}

async function getCaptureToken() {
  const email = document.querySelector("#email")!.value;
  const password = document.querySelector("#password")!.value;
  if (!email || !password) {
    return;
  }
  loading.value = true;
  const response = await fetch('https://api.numbersprotocol.io/api/v3/auth/token/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (data.error) {
    message.value = data.error.message;
  } else if (data.auth_token) {
    message.value = 'Success!';
    localStorage.setItem('captureToken', data.auth_token);
    setTimeout(() => close(), 2000);
  }
  loading.value = false;
}
</script>

<style scoped>
.modal.overlay {
  background: #000000c7;
  height: 100vh;
  width: 100vw;
  padding-top: 16px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
}
.modal .content p {
  font-size: 20px;
  margin: 0;
  padding: 20px;
}
.modal .content .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  width: 600px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #1c212e;
  margin: auto;
  padding: 20px;
  max-width: calc(100% - 130px);
  margin: 10px auto;
  flex-direction: column;
}
input {
  padding: 16px;
  margin: 10px;
  background: black;
  border: 1px solid white;
  border-radius: 6px;
  color: white;
  font-family: 'Poppins', sans-serif;
}
button {
  color: white;
  border: 1px solid white;
  background: black;
  cursor: pointer;
  padding: 16px 0px;
  font-weight: bold;
  font-size: 16px;
  margin: 9px;
  border-radius: 6px;
}

.close {
  font-size: 48px;
  cursor: pointer;
  display: flex;
  justify-content: end;
  text-align: center;
  width: 600px;
  padding: 0;
  max-width: calc(100% - 130px);
  margin: 0px auto;
}


.loadingContainer {
  width: 100%;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.loadingIcon {
  font-size: 40px;
  animation: spinner 0.8s linear infinite;
}

form {
  width: 300px;
  display: flex;
  flex-direction: column;
}
</style>
