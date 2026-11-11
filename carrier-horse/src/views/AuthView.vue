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

  const cleanedUsername = username.value.trim()

  if (cleanedUsername === '') {
    message.value = 'Enter a username.'
    return
  }

  if (email.value.trim() === '') {
    message.value = 'Enter an email.'
    return
  }

  if (password.value === '') {
    message.value = 'Enter a password.'
    return
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.value.trim(),
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
      username: cleanedUsername
    })

  if (profileError) {
    message.value = profileError.message
    return
  }

  const { error: horseError } = await supabase
    .from('horses')
    .insert({
      owner_id: data.user.id,
      name: 'American Horse',
      status: 'resting'
    })

  if (horseError) {
    message.value = horseError.message
    return
  }

  router.push('/dashboard')
}

async function logIn() {
  message.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
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
    <section class="auth-card">

      <div class="auth-heading">
        <h1>
          {{ mode === 'signup' ? 'Join the Trail' : 'Welcome Back' }}
        </h1>

        <p>
          {{
            mode === 'signup'
              ? 'Create your Carrier Horse account'
              : 'Log in to return to your stable'
          }}
        </p>
      </div>

      <div class="auth-tabs">

        <button
          class="tab-button"
          :class="{ active: mode === 'signup' }"
          @click="mode = 'signup'"
        >
          Sign Up
        </button>

        <button
          class="tab-button"
          :class="{ active: mode === 'login' }"
          @click="mode = 'login'"
        >
          Log In
        </button>

      </div>

      <div class="auth-form">

        <div
          v-if="mode === 'signup'"
          class="form-group"
        >
          <label for="username">
            Username
          </label>

          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Choose a username"
          />
        </div>

        <div class="form-group">
          <label for="email">
            Email
          </label>

          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label for="password">
            Password
          </label>

          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <button
          v-if="mode === 'signup'"
          class="submit-button"
          @click="signUp"
        >
          Create Account
        </button>

        <button
          v-else
          class="submit-button"
          @click="logIn"
        >
          Log In
        </button>

        <p
          v-if="message"
          class="auth-message"
        >
          {{ message }}
        </p>

      </div>

      <div class="auth-footer">
        <span class="footer-line"></span>
        <span>✦</span>
        <span class="footer-line"></span>
      </div>

    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rye&display=swap');

.auth-page {
  min-height: calc(100dvh - 5rem);

  display: flex;
  justify-content: center;
  align-items: center;

  padding: clamp(2rem, 5vw, 5rem) 1.5rem;

  background-color: #e4c388;
}

.auth-card {
  position: relative;

  width: min(100%, 30rem);

  padding: clamp(2rem, 5vw, 3.5rem);

  background-color: #cb9651;

  border: 0.12rem solid #250f0b;

  box-shadow:
    0 0.8rem 0 rgba(37, 15, 11, 0.12),
    0 1rem 2rem rgba(37, 15, 11, 0.2);
}

.auth-card::before {
  content: '';

  position: absolute;
  inset: 0.7rem;

  border: 0.06rem solid rgba(37, 15, 11, 0.45);

  pointer-events: none;
}

.auth-heading {
  position: relative;
  z-index: 1;

  text-align: center;

  margin-bottom: 1.8rem;
}

.auth-heading h1 {
  margin: 0;

  font-family: 'Rye', serif;
  font-size: clamp(1.7rem, 5vw, 2.5rem);
  font-weight: normal;

  color: #250f0b;
}

.auth-heading p {
  margin: 0.65rem 0 0;

  font-family: Georgia, serif;
  font-size: 1rem;

  color: rgba(37, 15, 11, 0.8);
}

.auth-tabs {
  position: relative;
  z-index: 1;

  display: grid;
  grid-template-columns: 1fr 1fr;

  margin-bottom: 2rem;

  border: 0.1rem solid #250f0b;
}

.tab-button {
  padding: 0.8rem 1rem;

  border: none;

  background-color: #e4c388;
  color: #250f0b;

  font-family: 'Rye', serif;
  font-size: 0.95rem;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.tab-button:first-child {
  border-right: 0.1rem solid #250f0b;
}

.tab-button.active {
  background-color: #250f0b;
  color: #cb980c;
}

.tab-button:hover:not(.active) {
  background-color: #d9af6e;
}

.auth-form {
  position: relative;
  z-index: 1;
}

.form-group {
  display: flex;
  flex-direction: column;

  gap: 0.4rem;

  margin-bottom: 1.25rem;
}

.form-group label {
  font-family: 'Rye', serif;
  font-size: 0.9rem;

  color: #250f0b;
}

.form-group input {
  width: 100%;

  padding: 0.85rem 1rem;

  box-sizing: border-box;

  border: 0.1rem solid #250f0b;
  outline: none;

  background-color: #e4c388;
  color: #250f0b;

  font-family: Georgia, serif;
  font-size: 1rem;
}

.form-group input::placeholder {
  color: rgba(37, 15, 11, 0.55);
}

.form-group input:focus {
  border-color: #cb980c;

  box-shadow:
    0 0 0 0.15rem rgba(203, 152, 12, 0.3);
}

.submit-button {
  width: 100%;

  margin-top: 0.5rem;

  padding: 0.9rem 1rem;

  border: 0.1rem solid #250f0b;

  background-color: #250f0b;
  color: #cb980c;

  font-family: 'Rye', serif;
  font-size: 1rem;

  cursor: pointer;
}

.submit-button:hover {
  background-color: #3b1a13;
}

.auth-message {
  margin: 1rem 0 0;

  text-align: center;

  font-family: Georgia, serif;
  font-size: 0.95rem;

  color: #250f0b;
}

.auth-footer {
  position: relative;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.75rem;

  margin-top: 2rem;

  color: #250f0b;
}

.footer-line {
  width: 30%;
  height: 0.06rem;

  background-color:
    rgba(37, 15, 11, 0.55);
}

@media (max-width: 35rem) {
  .auth-page {
    align-items: flex-start;

    padding-top: 2rem;
  }

  .auth-card {
    padding: 2rem 1.5rem;
  }
}
</style>