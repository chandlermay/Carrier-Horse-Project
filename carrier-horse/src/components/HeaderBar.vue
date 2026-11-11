<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { supabase } from '../utils/supabase'

import settingsIcon from '../assets/Golden Settings.png'
import profileIcon from '../assets/Golden Profile.png'
import horseLogo from '../assets/Vintage Galloping Mail Horse Logo.png'

import LocationSettings from './LocationSettings.vue'

const router = useRouter()
const showSettings = ref(false)
const showLocationSettings = ref(false)

function toggleSettings() {
  showSettings.value = !showSettings.value
}

function openLocationSettings() {
  showSettings.value = false
  showLocationSettings.value = true
}

function closeLocationSettings() {
  showLocationSettings.value = false
}

async function logOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.log(error.message)
    return
  }

  showSettings.value = false

  router.push('/')
}
</script>

<template>
  <header class="header-bar">
    <RouterLink to="/" class="brand">
      <img
        :src="horseLogo"
        alt="CarrierHorse Logo"
        class="horse-logo"
      />

      Carrier Horse
    </RouterLink>

    <nav class="header-actions">
      <button class="icon-button">
        <img
          :src="profileIcon"
          alt="Profile"
        />
      </button>

      <div class="settings-wrapper">
        <button
          class="icon-button"
          @click="toggleSettings"
        >
          <img
            :src="settingsIcon"
            alt="Settings"
          />
        </button>

        <div
          v-if="showSettings"
          class="settings-menu"
        >
          <button
            class="settings-option"
            @click="openLocationSettings"
          >
            Delivery Location
          </button>

          <button
            class="settings-option"
            @click="logOut"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  </header>

  <div
    v-if="showLocationSettings"
    class="location-overlay"
    @click.self="closeLocationSettings"
  >
    <div class="location-popup">
      <button
        class="location-close"
        type="button"
        aria-label="Close"
        @click="closeLocationSettings"
      >
        ×
      </button>

      <LocationSettings />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rye&display=swap');

.horse-logo {
    width: 4rem;
    height: 4rem;
}

.header-bar {
    height: 80px;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 8%;
    box-sizing: border-box;

    background-color: #2F241C;
    border-bottom: 1px solid rgba(47, 36, 28, 0.35);
}

.brand {
    font-family: 'Rye', serif;
    font-size: 1.5rem;
    color: #cb980c;
    text-decoration: none;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.icon-button {
    background: none;
    border: none;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
}

.icon-button img {
    width: clamp(2rem, 3vw, 3rem);
    aspect-ratio: 1;
    object-fit: contain;
    transition:
        transform 0.2s ease,
        opacity 0.2s ease;
}

.icon-button:hover img {
    transform: scale(1.08);
    opacity: 0.75;
}

.header-actions > .icon-button,
.settings-wrapper > .icon-button {
    background: none;
    border: none;
    padding: 0;

    font-family: 'Rye', serif;
    font-size: 0.95rem;

    color: #cb9651;

    cursor: pointer;

    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.header-actions > .icon-button:hover,
.settings-wrapper > .icon-button:hover{
    opacity: 0.65;
    transform: translateY(-2px);
}

.settings-wrapper {
    position: relative;
}

.settings-menu {
    position: absolute;

    top: calc(100% + 0.65rem);
    right: 0;

    z-index: 500;

    display: flex;
    flex-direction: column;

    width: 13rem;

    padding: 0.45rem;

    background-color: #cb9651;

    border: 0.1rem solid #250f0b;

    box-shadow:
        0 0.5rem 1rem rgba(37, 15, 11, 0.25);
}

.settings-option {
    width: 100%;

    padding: 0.85rem 1rem;

    border: none;

    background-color: transparent;
    color: #250f0b;

    font-family: Georgia, serif;
    font-size: 0.95rem;

    text-align: left;

    cursor: pointer;
}

.settings-option:hover {
    background-color: #e4c388;
}

.settings-option + .settings-option {
    border-top: 0.06rem solid rgba(37, 15, 11, 0.2);
}

.settings-menu::before {
    content: '';

    position: absolute;

    top: -0.45rem;
    right: 1rem;

    width: 0.8rem;
    height: 0.8rem;

    background-color: #cb9651;

    border-top: 0.1rem solid #250f0b;
    border-left: 0.1rem solid #250f0b;

    transform: rotate(45deg);
}

@media (max-width: 700px) {
    .header-bar {
        padding: 0 7%;
    }

    .brand {
        font-size: 1.3rem;
    }

    .header-actions {
        gap: 16px;
    }

    .header-actions button {
        font-size: 0.8rem;
    }

    .settings-menu {
        width: 11rem;
    }
}

.location-overlay {
  position: fixed;
  inset: 0;

  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 1.5rem;

  background-color: rgba(37, 15, 11, 0.12);

  backdrop-filter: blur(0.3rem);
  -webkit-backdrop-filter: blur(0.3rem);
}

.location-popup {
  position: relative;

  width: min(100%, 34rem);
}

.location-close {
  position: absolute;

  top: 1.35rem;
  right: 3rem;

  z-index: 2;

  border: none;
  background: transparent;

  color: #250f0b;

  font-size: 1.5rem;
  line-height: 1;

  cursor: pointer;
}

.location-close:hover {
  color: #cb980c;
}
</style>