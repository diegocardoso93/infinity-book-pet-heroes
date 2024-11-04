<template>
  <slot />
</template>

<script lang="ts" setup>
</script>

<style>
body {
  margin: 0;
  background: #131313 url('../assets/background.svg') no-repeat center top;
  -webkit-font-smoothing: antialised;
  overflow: hidden;
  color: white;
}
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
</style>

<style scoped>
.layout {
  display: flex;
  max-width: 900px;
  margin: auto;
}
.content {
  padding: 20px;
  padding-bottom: 50px;
  min-height: 100vh;
  flex-grow: 1;
}
/* Page Transition Animation */
#page-content {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}
body.page-is-transitioning #page-content {
  opacity: 0;
}
</style>
