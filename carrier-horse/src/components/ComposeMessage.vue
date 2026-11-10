<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { supabase } from '../utils/supabase'

const emit = defineEmits(['close'])

type Recipient = {
  id: string
  username: string
}

type Horse = {
  id: string
  name: string
  status: 'resting' | 'delivering'
}

const recipientInput = ref('')
const recipients = ref<Recipient[]>([])
const recipientError = ref('')

const subject = ref('')
const messageBody = ref('')
const selectedHorse = ref('')

const horses = ref<Horse[]>([])
const loadingHorses = ref(true)

const sending = ref(false)
const sendError = ref('')

const canSend = computed(() => {
  return (
    recipients.value.length > 0 &&
    subject.value.trim() !== '' &&
    messageBody.value.trim() !== '' &&
    selectedHorse.value !== ''
  )
})

async function getAvailableHorses() {
  loadingHorses.value = true

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if (!user) {
    loadingHorses.value = false
    return
  }

  const { data, error } = await supabase
    .from('horses')
    .select('id, name, status')
    .eq('owner_id', user.id)
    .eq('status', 'resting')
    .order('created_at', { ascending: true })

  if (error) {
    console.log('Error loading horses:', error.message)
    loadingHorses.value = false
    return
  }

  horses.value = data ?? []
  loadingHorses.value = false
}

async function addRecipient() {
  const username = recipientInput.value.trim()

  if (username === '') {
    return
  }

  recipientError.value = ''

  const { data, error } = await supabase.rpc(
    'find_profile_by_username',
    {
      search_username: username
    }
  )

  if (error) {
    recipientError.value = error.message
    return
  }

  if (!data || data.length === 0) {
    recipientError.value = 'User not found.'
    return
  }

  const foundUser = data[0]

  const alreadyAdded = recipients.value.some(
    recipient => recipient.id === foundUser.id
  )

  if (alreadyAdded) {
    recipientError.value = 'Recipient already added.'
    return
  }

  recipients.value.push({
    id: foundUser.id,
    username: foundUser.username
  })

  recipientInput.value = ''
}

function removeRecipient(id: string) {
  recipients.value = recipients.value.filter(
    recipient => recipient.id !== id
  )
}

function closeCompose() {
  emit('close')
}

async function sendMessage() {
  if (!canSend.value || sending.value) {
    return
  }

  sending.value = true
  sendError.value = ''

  const { data: userData, error: userError } =
    await supabase.auth.getUser()

  const user = userData.user

  if (userError || !user) {
    sendError.value = 'You must be logged in to send a message.'
    sending.value = false
    return
  }

  // Create the actual message
  const { data: message, error: messageError } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      subject: subject.value.trim(),
      body: messageBody.value.trim()
    })
    .select('id')
    .single()

  if (messageError || !message) {
    sendError.value =
      messageError?.message ?? 'Could not create message.'

    sending.value = false
    return
  }

  // TEMPORARY:
  // Messages arrive 5 minutes after being sent.
  // We will replace this with real horse travel calculations later.
  const arrivalTime = new Date(
    Date.now() + 5 * 60 * 1000
  ).toISOString()

  const recipientRows = recipients.value.map(recipient => ({
    message_id: message.id,
    recipient_id: recipient.id,
    horse_id: selectedHorse.value,
    arrival_at: arrivalTime
  }))

  const { error: recipientInsertError } = await supabase
    .from('message_recipients')
    .insert(recipientRows)

  if (recipientInsertError) {
    sendError.value = recipientInsertError.message
    sending.value = false
    return
  }

  // Mark the selected horse as delivering
  const { error: horseError } = await supabase
    .from('horses')
    .update({
      status: 'delivering'
    })
    .eq('id', selectedHorse.value)
    .eq('owner_id', user.id)

  if (horseError) {
    sendError.value = horseError.message
    sending.value = false
    return
  }

  sending.value = false

  emit('close')
}

onMounted(() => {
  getAvailableHorses()
})
</script>

<template>
  <div
    class="compose-overlay"
    @click.self="closeCompose"
  >
    <section class="compose-card">
      <button
        class="close-button"
        type="button"
        aria-label="Close"
        @click="closeCompose"
      >
        ×
      </button>

      <div class="compose-heading">
        <h2>Write a Message</h2>
        <p>Send your letter by Carrier Horse</p>
      </div>

      <div class="form-group">
        <label for="recipient">
          To
        </label>

        <div class="recipient-box">
          <div
            v-for="recipient in recipients"
            :key="recipient.id"
            class="recipient-chip"
          >
            <span>
              {{ recipient.username }}
            </span>

            <button
              type="button"
              class="remove-recipient"
              aria-label="Remove recipient"
              @click="removeRecipient(recipient.id)"
            >
              ×
            </button>
          </div>

          <input
            id="recipient"
            v-model="recipientInput"
            type="text"
            placeholder="Enter username and press Enter"
            @keydown.enter.prevent="addRecipient"
          />
        </div>

        <p
          v-if="recipientError"
          class="recipient-error"
        >
          {{ recipientError }}
        </p>
      </div>

      <div class="form-group">
        <label for="subject">
          Subject
        </label>

        <input
          id="subject"
          v-model="subject"
          type="text"
          placeholder="Enter a subject"
        />
      </div>

      <div class="form-group">
        <label for="message">
          Message
        </label>

        <textarea
          id="message"
          v-model="messageBody"
          placeholder="Write your message..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="horse">
          Select Horse
        </label>

        <select
          id="horse"
          v-model="selectedHorse"
          :disabled="loadingHorses || horses.length === 0"
        >
          <option value="" disabled>
            {{
              loadingHorses
                ? 'Loading horses...'
                : horses.length === 0
                  ? 'No resting horses available'
                  : 'Choose an available horse'
            }}
          </option>

          <option
            v-for="horse in horses"
            :key="horse.id"
            :value="horse.id"
          >
            {{ horse.name }}
          </option>
        </select>
      </div>

      <button
  class="send-button"
  type="button"
  :disabled="!canSend || sending"
  @click="sendMessage"
>
  {{ sending ? 'Sending...' : 'Send Message →' }}
</button>

<p
  v-if="sendError"
  class="send-error"
>
  {{ sendError }}
</p>
    </section>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rye&display=swap');

.compose-overlay {
  position: fixed;
  inset: 0;

  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 1.5rem;

  background-color: rgba(37, 15, 11, 0.2);

  backdrop-filter: blur(0.25rem);
  -webkit-backdrop-filter: blur(0.25rem);
}

.compose-card {
  position: relative;

  width: min(100%, 38rem);
  max-height: 90dvh;

  overflow-y: auto;

  box-sizing: border-box;

  padding: clamp(2rem, 5vw, 3rem);

  background-color: #cb9651;

  border: 0.12rem solid #250f0b;

  color: #250f0b;

  box-shadow: 0 1rem 3rem rgba(37, 15, 11, 0.35);
}

.compose-card::before {
  content: '';

  position: absolute;
  inset: 0.7rem;

  border: 0.06rem solid rgba(37, 15, 11, 0.4);

  pointer-events: none;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1.2rem;

  z-index: 2;

  border: none;
  background: none;

  color: #250f0b;

  font-size: 1.8rem;
  line-height: 1;

  cursor: pointer;
}

.close-button:hover {
  color: #cb980c;
}

.compose-heading {
  position: relative;
  z-index: 1;

  margin-bottom: 2rem;

  text-align: center;
}

.compose-heading h2 {
  margin: 0;

  font-family: 'Rye', serif;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: normal;
}

.compose-heading p {
  margin: 0.5rem 0 0;

  font-family: Georgia, serif;

  color: rgba(37, 15, 11, 0.75);
}

.form-group {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;

  gap: 0.45rem;

  margin-bottom: 1.3rem;
}

.form-group label {
  font-family: 'Rye', serif;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;

  box-sizing: border-box;

  padding: 0.85rem 1rem;

  border: 0.1rem solid #250f0b;
  outline: none;

  background-color: #e4c388;
  color: #250f0b;

  font-family: Georgia, serif;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #cb980c;

  box-shadow: 0 0 0 0.15rem rgba(203, 152, 12, 0.3);
}

.form-group textarea {
  min-height: 10rem;

  resize: vertical;
}

.recipient-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: 0.5rem;

  padding: 0.6rem;

  border: 0.1rem solid #250f0b;

  background-color: #e4c388;
}

.recipient-box input {
  flex: 1;

  min-width: 10rem;

  padding: 0.35rem;

  border: none;

  background: transparent;

  box-shadow: none;
}

.recipient-box input:focus {
  border: none;

  box-shadow: none;
}

.recipient-chip {
  display: flex;
  align-items: center;

  gap: 0.4rem;

  padding: 0.35rem 0.55rem;

  border: 0.08rem solid #250f0b;

  background-color: #cb980c;
  color: #250f0b;

  font-family: Georgia, serif;
  font-size: 0.9rem;
}

.remove-recipient {
  padding: 0;

  border: none;

  background: none;
  color: #250f0b;

  font-size: 1rem;
  line-height: 1;

  cursor: pointer;
}

.recipient-error {
  margin: 0.25rem 0 0;

  font-family: Georgia, serif;
  font-size: 0.9rem;

  color: #6b1717;
}

.send-button {
  position: relative;
  z-index: 1;

  width: 100%;

  padding: 0.9rem 1rem;

  border: 0.1rem solid #250f0b;

  background-color: #250f0b;
  color: #cb980c;

  font-family: 'Rye', serif;
  font-size: 1rem;

  cursor: pointer;
}

.send-button:hover:not(:disabled) {
  background-color: #3b1a13;
}

.send-button:disabled {
  opacity: 0.45;

  cursor: not-allowed;
}

@media (max-width: 35rem) {
  .compose-overlay {
    align-items: flex-start;

    padding: 1rem;
  }

  .compose-card {
    padding: 2.5rem 1.5rem 2rem;
  }
}
.send-error {
  position: relative;
  z-index: 1;

  margin: 1rem 0 0;

  text-align: center;

  font-family: Georgia, serif;
  font-size: 0.9rem;

  color: #6b1717;
}
</style>