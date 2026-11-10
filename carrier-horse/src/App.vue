<script setup>
import HeaderBar from './components/HeaderBar.vue';
import HomeView from './views/HomeView.vue';
import { RouterView } from 'vue-router'
import StatusBar from './components/StatusBar.vue'
</script>

<template>
  <HeaderBar></HeaderBar>
  <StatusBar></StatusBar>
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
  background-color: #e4c388;
}

</style>