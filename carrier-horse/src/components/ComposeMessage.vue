<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['close'])

const recipientInput = ref('')
const recipients = ref([])

const subject = ref('')
const messageBody = ref('')
const selectedHorse = ref('')

const horses = [
  {
    id: 1,
    name: 'American Horse',
    status: 'delivering',
  },
  {
    id: 2,
    name: 'British Horse',
    status: 'resting',
  },
  {
    id: 3,
    name: 'Chinese Horse',
    status: 'resting',
  },
]

const availableHorses = computed(() =>
  horses.filter((horse) => horse.status === 'resting')
)

const canSend = computed(() => {
  return (
    recipients.value.length > 0 &&
    subject.value.trim() !== '' &&
    messageBody.value.trim() !== '' &&
    selectedHorse.value !== ''
  )
})

function addRecipient() {
  const username = recipientInput.value.trim()

  if (
    username !== '' &&
    !recipients.value.includes(username)
  ) {
    recipients.value.push(username)
  }

  recipientInput.value = ''
}

function removeRecipient(username) {
  recipients.value = recipients.value.filter(
    (recipient) => recipient !== username
  )
}

function closeCompose() {
  emit('close')
}

function sendMessage() {
  if (!canSend.value) {
    return
  }

  // Backend/database sending logic will go here later.
}
</script>

<template>
  <div
    class="compose-overlay"
    @click.self="closeCompose"
  >
    <section class="compose-message">

      <button
        class="close-button"
        aria-label="Close"
        @click="closeCompose"
      >
        ×
      </button>


      <!-- RECIPIENTS -->

      <div class="field recipients-field">
        <label for="recipient">
          To
        </label>

        <div class="recipient-box">

          <div class="recipient-tags">
            <span
              v-for="recipient in recipients"
              :key="recipient"
              class="recipient-tag"
            >
              {{ recipient }}

              <button
                type="button"
                class="remove-recipient"
                @click="removeRecipient(recipient)"
              >
                ×
              </button>
            </span>
          </div>

          <input
            id="recipient"
            v-model="recipientInput"
            type="text"
            placeholder="Enter username"
            @keydown.enter.prevent="addRecipient"
          />
        </div>
      </div>


      <!-- SUBJECT -->

      <div class="field">
        <label for="subject">
          Subject
        </label>

        <input
          id="subject"
          v-model="subject"
          type="text"
          placeholder="Write a subject"
        />
      </div>


      <!-- MESSAGE -->

      <div class="field message-field">
        <label for="message">
          Letter
        </label>

        <textarea
          id="message"
          v-model="messageBody"
          placeholder="Write your letter..."
        ></textarea>
      </div>


      <!-- BOTTOM CONTROLS -->

      <div class="compose-controls">

        <div class="horse-selector">
          <label for="horse">
            Delivery Horse
          </label>

          <select
            id="horse"
            v-model="selectedHorse"
          >
            <option
              value=""
              disabled
            >
              Select a horse
            </option>

            <option
              v-for="horse in availableHorses"
              :key="horse.id"
              :value="horse.id"
            >
              {{ horse.name }}
            </option>
          </select>
        </div>


        <button
          class="send-button"
          :disabled="!canSend"
          @click="sendMessage"
        >
          Send Message →
        </button>

      </div>

    </section>
  </div>
</template>

<style scoped>
.compose-overlay {
  position: fixed;

  inset: 0;

  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1.5rem;

  background-color: rgba(37, 15, 11, 0.65);
}

.compose-message {
  position: relative;

  width: min(94%, 75rem);
  min-height: min(80dvh, 45rem);

  display: flex;
  flex-direction: column;

  gap: 1.5rem;

  padding: clamp(2rem, 5vw, 4.5rem);

  box-sizing: border-box;

  background-color: #e4c388;

  color: #250f0b;

  box-shadow:
    0.6rem 0.6rem 0 rgba(37, 15, 11, 0.18);
}


/* CLOSE BUTTON */

.close-button {
  position: absolute;

  top: 1rem;
  right: 1.25rem;

  border: none;

  background: transparent;

  color: #250f0b;

  font-size: 2rem;

  cursor: pointer;
}

.close-button:hover {
  color: #cb980c;
}


/* FIELDS */

.field {
  display: flex;
  flex-direction: column;

  gap: 0.5rem;
}

.field label,
.horse-selector label {
  font-family: 'Rye', serif;
  font-size: 0.85rem;
}

.field input,
.field textarea,
.horse-selector select {
  width: 100%;

  box-sizing: border-box;

  border: 0;
  border-bottom: 0.1rem solid rgba(37, 15, 11, 0.45);

  background: transparent;

  color: #250f0b;

  font: inherit;

  outline: none;
}

.field input {
  padding: 0.7rem 0;
}

.field textarea {
  min-height: 18rem;

  padding: 0.7rem 0;

  resize: vertical;
}

.field input:focus,
.field textarea:focus,
.horse-selector select:focus {
  border-color: #250f0b;
}


/* RECIPIENTS */

.recipient-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: 0.5rem;

  padding-bottom: 0.5rem;

  border-bottom: 0.1rem solid rgba(37, 15, 11, 0.45);
}

.recipient-box input {
  flex: 1;

  min-width: 10rem;

  border: none;

  padding: 0.4rem 0;
}

.recipient-tags {
  display: flex;
  flex-wrap: wrap;

  gap: 0.5rem;
}

.recipient-tag {
  display: flex;
  align-items: center;

  gap: 0.4rem;

  padding: 0.35rem 0.6rem;

  background-color: #cb9651;

  font-size: 0.8rem;
}

.remove-recipient {
  border: none;

  background: transparent;

  color: #250f0b;

  cursor: pointer;

  font-size: 1rem;

  padding: 0;
}


/* BOTTOM */

.compose-controls {
  margin-top: auto;

  display: flex;

  justify-content: space-between;
  align-items: flex-end;

  gap: 2rem;
}

.horse-selector {
  display: flex;
  flex-direction: column;

  gap: 0.5rem;

  min-width: min(100%, 15rem);
}

.horse-selector select {
  padding: 0.7rem 0;

  cursor: pointer;
}


/* SEND BUTTON */

.send-button {
  border: none;

  background-color: #250f0b;

  color: #cb980c;

  padding: 0.8rem 1.2rem;

  font-family: 'Rye', serif;

  cursor: pointer;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-0.1rem);
}

.send-button:disabled {
  opacity: 0.35;

  cursor: not-allowed;
}


/* MOBILE */

@media (max-width: 45rem) {
  .compose-message {
    min-height: 88dvh;

    padding:
      3.5rem
      1.25rem
      1.5rem;
  }

  .compose-controls {
    flex-direction: column;

    align-items: stretch;
  }

  .horse-selector {
    width: 100%;
  }

  .send-button {
    width: 100%;
  }
}
</style>