<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { supabase } from './utils/supabase'

import HeaderBar from './components/HeaderBar.vue'
import StatusBar from './components/StatusBar.vue'

const user = ref<any>(null)

let authSubscription: any

onMounted(async () => {
  const { data } = await supabase.auth.getSession()

  user.value = data.session?.user ?? null

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      user.value = session?.user ?? null
    }
  )

  authSubscription = listener.subscription
})

onUnmounted(() => {
  authSubscription?.unsubscribe()
})
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