<template>
  <header class="header">
    <Logo />
    <a href="/"><h1>Infinity Book: Pet Heroes</h1></a>
    <div class="action">
      <a v-if="pathname != '/create'" href="/create" title="new chapter">
        <img src="../assets/page-add.svg" />
      </a>
    </div>
  </header>
</template>

<script lang="ts" setup>
import Logo from './Logo.vue';

const pathname = location.pathname;
</script>

<style scoped>
.header {
  display: flex;
  width: 1024px;
  justify-content: space-between;
  margin: auto;
  font: 14px 'Poppins', sans-serif;
}
a {
  cursor: pointer;
  text-decoration: none;
  color: #fff;
  margin: auto 0;
}
.action {
  padding-top: 32px;
}
</style>
