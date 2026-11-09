<script setup>
import HeaderBar from './components/HeaderBar.vue';
import HomeView from './views/HomeView.vue';

</script>

<template>
  <HeaderBar></HeaderBar>
  <RouterView></RouterView>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
}
</style>