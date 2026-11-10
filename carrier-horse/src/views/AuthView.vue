<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'

const router = useRouter()

const mode = ref<'signup' | 'login'>('signup')

const username = ref('')
const email = ref('')
const password = ref('')
const message = ref('')

async function signUp() {
  message.value = ''

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) {
    message.value = error.message
    return
  }

  if (!data.user) {
    message.value = 'Could not create account.'
    return
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      username: username.value
    })

  if (profileError) {
    message.value = profileError.message
    return
  }

  router.push('/dashboard')
}

async function logIn() {
  message.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    message.value = error.message
    return
  }

  router.push('/dashboard')
}
</script>

<template>
  <main class="auth-page">
    <div class="auth-card">

      <div class="auth-tabs">
        <button @click="mode = 'signup'">
          Sign Up
        </button>

        <button @click="mode = 'login'">
          Log In
        </button>
      </div>

      <h1>
        {{ mode === 'signup' ? 'Create Account' : 'Log In' }}
      </h1>

      <input
        v-if="mode === 'signup'"
        v-model="username"
        type="text"
        placeholder="Username"
      />

      <input
        v-model="email"
        type="email"
        placeholder="Email"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
      />

      <button
        v-if="mode === 'signup'"
        @click="signUp"
      >
        Sign Up
      </button>

      <button
        v-else
        @click="logIn"
      >
        Log In
      </button>

      <p>{{ message }}</p>

    </div>
  </main>
</template>