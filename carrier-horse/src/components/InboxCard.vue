<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { supabase } from '../utils/supabase'

import paperTexture from '../assets/letter-paper-texture.png'
import waxSeal from '../assets/wax-seal.png'
import horseEmblem from '../assets/letter-horse-emblem.png'

type InboxMessage = {
  deliveryId: string
  messageId: string
  sender: string
  subject: string
  message: string | null
  arrivalAt: string
  deliveredAt: string
  horse: string
  ready: boolean
  read: boolean
  timeRemaining: string
}

const messages = ref<InboxMessage[]>([])
const selectedMessage = ref<InboxMessage | null>(null)
const popupType = ref<'waiting' | 'letter' | null>(null)

const loading = ref(true)
const inboxError = ref('')

let refreshTimer: ReturnType<typeof setInterval> | undefined

function getTimeRemaining(arrivalAt: string) {
  const arrival = new Date(arrivalAt).getTime()
  const now = Date.now()

  const difference = arrival - now

  if (difference <= 0) {
    return 'Arrived'
  }

  const totalMinutes = Math.ceil(difference / 60000)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`
  }

  if (hours > 0) {
    return `${hours}h`
  }

  return `${minutes}m`
}

function formatArrivalTime(arrivalAt: string) {
  return new Date(arrivalAt).toLocaleString()
}

async function loadInbox() {
  loading.value = true
  inboxError.value = ''

  const { data, error } = await supabase.rpc('get_my_inbox')

  if (error) {
    console.log('Error loading inbox:', error.message)
    inboxError.value = error.message
    loading.value = false
    return
  }

  messages.value = (data ?? []).map((row: any) => {
    const ready =
      new Date(row.arrival_at).getTime() <= Date.now()

    return {
      deliveryId: row.delivery_id,
      messageId: row.message_id,

      sender: row.sender_username,
      subject: row.subject,

      message: row.body,

      arrivalAt: row.arrival_at,
      deliveredAt: formatArrivalTime(row.arrival_at),

      horse: row.horse_name,

      ready,
      read: row.is_read,

      timeRemaining: getTimeRemaining(row.arrival_at)
    }
  })

  loading.value = false
}

async function openMessage(message: InboxMessage) {
  selectedMessage.value = message

  const ready =
    new Date(message.arrivalAt).getTime() <= Date.now()

  if (!ready) {
    message.ready = false
    message.timeRemaining =
      getTimeRemaining(message.arrivalAt)

    popupType.value = 'waiting'
    return
  }

  /*
    If the letter arrived after our previous inbox refresh,
    reload it so Supabase will now return the message body.
  */
  if (!message.message) {
    await loadInbox()

    const updatedMessage = messages.value.find(
      current =>
        current.deliveryId === message.deliveryId
    )

    if (!updatedMessage) {
      return
    }

    selectedMessage.value = updatedMessage
  }

  popupType.value = 'letter'

  const currentMessage = selectedMessage.value

  if (!currentMessage) {
    return
  }

  if (!currentMessage.read) {
    const { error } = await supabase
      .from('message_recipients')
      .update({
        read: true
      })
      .eq('id', currentMessage.deliveryId)

    if (error) {
      console.log(
        'Error marking message as read:',
        error.message
      )

      return
    }

    currentMessage.read = true
  }
}

function closePopup() {
  selectedMessage.value = null
  popupType.value = null
}

onMounted(() => {
  loadInbox()

  refreshTimer = setInterval(() => {
    loadInbox()
  }, 30000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<template>
  <section class="inbox-card">
    <h2>Inbox</h2>

    <div class="message-list">
      <p
        v-if="loading"
        class="inbox-status"
      >
        Loading inbox...
      </p>

      <p
        v-else-if="inboxError"
        class="inbox-error"
      >
        {{ inboxError }}
      </p>

      <p
        v-else-if="messages.length === 0"
        class="inbox-status"
      >
        No letters yet.
      </p>

      <button
        v-for="message in messages"
        v-else
        :key="message.deliveryId"
        class="message-row"
        :class="{
          ready: message.ready,
          unread: message.ready && !message.read
        }"
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


  <!-- POPUP OVERLAY -->

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
        <strong>
          {{ selectedMessage.timeRemaining }}
        </strong>.
      </p>
    </div>


    <!-- MESSAGE HAS ARRIVED -->

    <div
      v-if="popupType === 'letter'"
      class="letter-popup"
      :style="{
        backgroundImage: `url(${paperTexture})`
      }"
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
        <span class="detail-label">
          From:
        </span>

        <span class="detail-label-value">
          {{ selectedMessage.sender }}
        </span>


        <span class="detail-label">
          Subject:
        </span>

        <span class="detail-label-value">
          {{ selectedMessage.subject }}
        </span>


        <span class="detail-label">
          Delivered:
        </span>

        <span class="detail-label-value">
          {{ selectedMessage.deliveredAt }}
        </span>


        <span class="detail-label">
          Horse Used:
        </span>

        <span class="detail-label-value">
          {{ selectedMessage.horse }}
        </span>
      </div>

      <div class="seal-area">
        <div class="rope"></div>
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

.inbox-status,
.inbox-error {
  padding: 1rem 0.5rem;

  margin: 0;

  font-family: Georgia, serif;
}

.inbox-error {
  color: #6b1717;
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


/* UNREAD ARRIVED MESSAGE */

.message-row.unread {
  font-weight: bold;

  border-left: 0.2rem solid #cb980c;
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
  justify-content: center;
  align-items: center;

  padding: 1.5rem;

  background-color: rgba(37, 15, 11, 0.12);

  backdrop-filter: blur(0.3rem);
  -webkit-backdrop-filter: blur(0.3rem);
}


/* WAITING POPUP */

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


/* WAITING TIME */

.wait-time {
  margin-top: 1.5rem;

  padding-top: 1rem;

  border-top: 0.08rem solid rgba(37, 15, 11, 0.25);
}


/* OPEN LETTER */

.letter-popup {
  position: relative;

  width: min(90%, 46rem);
  max-height: 85dvh;

  overflow-y: auto;

  padding: 3rem;

  box-sizing: border-box;

  background-color: #e4c388;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;

  color: #250f0b;

  border: 0.12rem solid #cb980c;

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

.letter-popup::after {
  content: '';

  position: absolute;

  inset: 1.35rem;

  border: 0.04rem solid rgba(203, 152, 12, 0.45);

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

  color: #f4e6ce;

  border: 0.08rem solid rgba(37, 15, 11, 0.4);

  font-family: 'Rye', serif;

  text-transform: uppercase;

  letter-spacing: 0.08rem;
}

.letter-details {
  display: grid;

  grid-template-columns: auto 1fr;

  gap: 0.65rem 2rem;

  margin-left: 3rem;
  margin-bottom: 1.8rem;

  font-family: Georgia, serif;
  font-size: 1rem;
}

.detail-label {
  font-family: 'Rye', serif;
}

.detail-label-value {
  font-family: Georgia, serif;

  font-size: 1.2rem;
}

.letter-body {
  margin-left: 3rem;

  font-family: Georgia, serif;

  font-size: clamp(1rem, 1.4vw, 1.15rem);

  line-height: 1.75;

  white-space: pre-wrap;
}

.seal-area {
  position: relative;

  height: 3rem;

  margin-top: 0.2rem;
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


/* CLOSE X */

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

.close-button:hover {
  color: #cb980c;
}
</style>