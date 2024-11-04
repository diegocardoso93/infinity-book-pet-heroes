<template>
  <PageHeader />
  <h1 class="text">Let's write this <span>story</span> together</h1> 
  <div class="btn-wrapper"><button @click="start()">Start!</button></div>
</template>

<script lang="ts" setup>
import PageHeader from '../../components/PageHeader.vue';

function start() {
  location.href = '/read?key=1';
}
</script>

<style scoped>
.text {
  font-size: 66px;
  font-weight: 800;
  line-height: 70px;
  text-align: center;
  max-width: 600px;
  width: 100%;
  margin: 168px auto;
  font-family: 'Poppins', sans-serif;
}
.text span {
  background-image: linear-gradient(45deg, #cf0, #6ff);
  background-size: 100%;
  background-repeat: repeat;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
}
.btn-wrapper {
  display: flex;
  justify-content: center;
}
button {
  font-size: 18px;
  margin: 20px;
  margin-top: 20px;
  background: white;
  color: #131313;
  border: 0;
  border-radius: 4px;
  padding: 5px 16px;
  font-weight: bold;
  text-transform: uppercase;
  -webkit-transition: background 0.2s;
  transition: background 0.2s;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  padding: 16px 26px;
}
button:hover {
  background: #0b0b0b;
  color: white;
}
</style>
