<script setup>
import { ref } from 'vue'
import paperTexture from '../assets/letter-paper-texture.png'
import waxSeal from '../assets/wax-seal.png'
import horseEmblem from '../assets/letter-horse-emblem.png'
import horseshoeEmblem from '../assets/Vintage Golden Horseshoe Divider.png'
const messages = [
  {
    id: 1,
    sender: 'Chandler',
    timeRemaining: '8 hours',
    ready: false,
    message: 'This message has not arrived yet.',
  },
  {
    id: 2,
    sender: 'Hing',
    timeRemaining: '2 hours',
    ready: false,
    message: 'This message has not arrived yet.',
  },
  {
    id: 3,
    sender: 'John',
    timeRemaining: 'Arrived',
    ready: true,
    message: 'The horse has safely delivered this letter.',
  },
]

const selectedMessage = ref(null)
const popupType = ref(null)

function openMessage(message) {
  selectedMessage.value = message

  if (message.ready) {
    popupType.value = 'letter'
  } else {
    popupType.value = 'waiting'
  }
}

function closePopup() {
  selectedMessage.value = null
  popupType.value = null
}
</script>

<template>
  <section class="inbox-card">
    <h2>Inbox</h2>

    <div class="message-list">
      <button
        v-for="message in messages"
        :key="message.id"
        class="message-row"
        :class="{ ready: message.ready }"
        @click="openMessage(message)"
      >
        <span>
          Message from {{ message.sender }}
        </span>

        <span class="arrival-time">
          {{ message.timeRemaining }}
        </span>
      </button>
    </div>
  </section>


  <!-- DARK OVERLAY -->

  <div
    v-if="selectedMessage"
    class="popup-overlay"
    @click.self="closePopup"
  >

    <!-- MESSAGE NOT READY -->

    <div
      v-if="popupType === 'waiting'"
      class="popup"
    >
      <button
        class="close-button"
        @click="closePopup"
        aria-label="Close"
      >
        ×
      </button>

      <h2>Letter Still Traveling</h2>

      <p>
        This letter has not arrived yet.
      </p>

      <p>
        Your horse is still on its journey.
      </p>

      <p class="wait-time">
        Expected arrival in
        <strong>{{ selectedMessage.timeRemaining }}</strong>.
      </p>
    </div>


    <!-- MESSAGE HAS ARRIVED -->

<div
  v-if="popupType === 'letter'"
  class="letter-popup"
  :style="{ backgroundImage: `url(${paperTexture})` }"
>
  <button
    class="close-button"
    @click="closePopup"
    aria-label="Close"
  >
    ×
  </button>

  <div class="letter-heading">
    <img
      :src="horseEmblem"
      class="letter-horse"
      alt=""
    />

    <div class="delivered-banner">
      Delivered Letter
    </div>
  </div>

  <div class="letter-details">
    <span class="detail-label">From:</span>
    <span>{{ selectedMessage.sender }}</span>

    <span class="detail-label">Subject:</span>
    <span>{{ selectedMessage.subject }}</span>

    <span class="detail-label">Delivered:</span>
    <span>{{ selectedMessage.deliveredAt }}</span>

    <span class="detail-label">Horse Used:</span>
    <span>{{ selectedMessage.horse }}</span>
  </div>

  <div class="letter-divider">
    <img class="horseshoeEmblem"
      :src="horseshoeEmblem"
      alt=""
    />
  </div>

  <div class="letter-body">
    {{ selectedMessage.message }}
  </div>

  <div class="seal-area">
    <div class="rope"></div>

    <img
      :src="waxSeal"
      class="wax-seal"
      alt=""
    />
  </div>
</div>

  </div>
</template>

<style scoped>
.inbox-card {
  background-color: #cb9651;

  padding: clamp(1rem, 2vw, 1.5rem);

  color: #250f0b;

  box-shadow:
    0.35rem 0.35rem 0 rgba(37, 15, 11, 0.1);
}

.inbox-card h2 {
  margin-top: 0;
  margin-bottom: 1.25rem;

  font-size: 1.1rem;
  font-weight: 400;
}


/* MESSAGE LIST */

.message-list {
  max-height: 22rem;

  overflow-y: auto;

  padding-right: 0.5rem;
}


/* MESSAGE BUTTON */

.message-row {
  width: 100%;

  display: flex;

  justify-content: space-between;
  align-items: center;

  gap: 1rem;

  padding: 1rem 0.5rem;

  border: none;
  border-bottom: 0.08rem solid rgba(37, 15, 11, 0.2);

  background: transparent;

  color: #250f0b;

  font-family: 'Rye', serif;
  font-size: clamp(0.7rem, 1vw, 0.9rem);

  text-align: left;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.message-row:hover {
  background-color: rgba(37, 15, 11, 0.08);
}

.message-row:active {
  transform: translateY(0.1rem);
}

.arrival-time {
  flex-shrink: 0;

  opacity: 0.75;
}


/* ARRIVED MESSAGE */

.message-row.ready {
  background-color: rgba(203, 152, 12, 0.13);
}

.message-row.ready .arrival-time {
  color: #36552f;

  opacity: 1;
}


/* SCROLLBAR */

.message-list::-webkit-scrollbar {
  width: 0.5rem;
}

.message-list::-webkit-scrollbar-track {
  background-color: rgba(37, 15, 11, 0.1);
}

.message-list::-webkit-scrollbar-thumb {
  background-color: #250f0b;
}

.message-list::-webkit-scrollbar-thumb:hover {
  background-color: #cb980c;
}


/* POPUP BACKGROUND */

.popup-overlay {
  position: fixed;

  inset: 0;

  z-index: 1000;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 1.5rem;

  background-color: rgba(37, 15, 11, 0.65);
}


/* POPUP */

.popup {
  position: relative;

  width: min(90%, 30rem);

  padding: clamp(1.5rem, 4vw, 2.5rem);

  box-sizing: border-box;

  background-color: #e4c388;

  color: #250f0b;

  box-shadow:
    0.5rem 0.5rem 0 rgba(0, 0, 0, 0.18);
}

.popup h2 {
  margin-top: 0;

  padding-right: 2rem;

  font-size: clamp(1.1rem, 2vw, 1.5rem);
}

.popup p {
  line-height: 1.6;
}


/* CLOSE X */

.close-button {
  position: absolute;

  top: 0.7rem;
  right: 0.9rem;

  border: none;

  background: transparent;

  color: #250f0b;

  font-size: 1.8rem;

  cursor: pointer;
}

.close-button:hover {
  color: #cb980c;
}


/* WAITING TIME */

.wait-time {
  margin-top: 1.5rem;

  padding-top: 1rem;

  border-top: 0.08rem solid rgba(37, 15, 11, 0.25);
}


/* OPEN LETTER */

.popup-overlay {
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

.letter-popup {
  position: relative;

  width: min(90%, 46rem);
  max-height: 85dvh;

  overflow-y: auto;

  padding: clamp(2.5rem, 5vw, 4rem);

  box-sizing: border-box;

  background-color: #e4c388;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;

  color: #250f0b;

  box-shadow:
    0 1rem 3rem rgba(37, 15, 11, 0.35);
}

.letter-popup::before {
  content: '';

  position: absolute;
  inset: 1rem;

  border: 0.08rem solid rgba(203, 152, 12, 0.75);

  pointer-events: none;
}

.letter-heading {
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 1.8rem;
}

.letter-horse {
  width: clamp(6rem, 15vw, 9rem);
  height: auto;

  margin-bottom: -0.6rem;
}

.delivered-banner {
  padding: 0.5rem 2rem;

  background-color: #cb980c;

  color: #e4c388;

  border: 0.08rem solid rgba(37, 15, 11, 0.4);

  font-family: 'Rye', serif;

  text-transform: uppercase;

  letter-spacing: 0.08rem;
}

.letter-details {
  display: grid;

  grid-template-columns: auto 1fr;

  gap: 0.65rem 2rem;

  margin-bottom: 1.8rem;
}

.detail-label {
  font-family: 'Rye', serif;
}

.letter-divider {
  margin-block: 1.5rem;
  text-align: center;

  color: #cb980c;
}

.horseshoeEmblem {
  width: 30vw;
  height: 9vh;
}

.letter-body {
  font-family: Georgia, serif;

  font-size: clamp(1rem, 1.4vw, 1.15rem);

  line-height: 1.75;

  white-space: pre-wrap;
}

.seal-area {
  position: relative;

  height: 5rem;

  margin-top: 2rem;
}

.rope {
  position: absolute;

  left: 0;
  top: 50%;

  width: 100%;
  height: 0.3rem;

  background-color: #b4854e;

  transform: translateY(-50%);
}

.wax-seal {
  position: absolute;

  right: 12%;
  top: 50%;

  width: 5rem;
  height: auto;

  transform: translateY(-50%);
}

.close-button {
  position: absolute;

  top: 1rem;
  right: 1.25rem;

  z-index: 2;

  border: none;

  background: transparent;

  color: #250f0b;

  font-size: 2rem;

  cursor: pointer;
}
</style>