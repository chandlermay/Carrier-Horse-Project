<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { supabase } from '../utils/supabase'

const emit = defineEmits(['compose'])

type Horse = {
  id: string
  name: string
  status: 'resting' | 'delivering'

  sentAt: string | null
  arrivalAt: string | null
  recipients: string | null

  progress: number
}

const horses = ref<Horse[]>([])
const loading = ref(true)

let progressTimer: ReturnType<typeof setInterval> | undefined
let refreshTimer: ReturnType<typeof setInterval> | undefined


function calculateProgress(
  sentAt: string | null,
  arrivalAt: string | null
) {
  if (!sentAt || !arrivalAt) {
    return 0
  }

  const start = new Date(sentAt).getTime()
  const end = new Date(arrivalAt).getTime()
  const now = Date.now()

  if (now <= start) {
    return 0
  }

  if (now >= end) {
    return 100
  }

  const totalTime = end - start
  const elapsedTime = now - start

  return Math.round(
    (elapsedTime / totalTime) * 100
  )
}


function updateProgress() {
  horses.value.forEach(horse => {
    if (horse.status === 'delivering') {
      horse.progress = calculateProgress(
        horse.sentAt,
        horse.arrivalAt
      )
    }
  })
}


async function getHorses() {
  loading.value = true

  const { data, error } =
    await supabase.rpc('get_my_horses')

  if (error) {
    console.log(
      'Error loading horses:',
      error.message
    )

    loading.value = false
    return
  }

  horses.value = (data ?? []).map((horse: any) => ({
    id: horse.id,
    name: horse.name,
    status: horse.status,

    sentAt: horse.sent_at,
    arrivalAt: horse.arrival_at,
    recipients: horse.recipients,

    progress: calculateProgress(
      horse.sent_at,
      horse.arrival_at
    )
  }))

  loading.value = false
}


onMounted(() => {
  getHorses()

  // Updates progress bars smoothly while the page is open.
  progressTimer = setInterval(() => {
    updateProgress()
  }, 1000)

  // Reloads horse status from Supabase periodically.
  refreshTimer = setInterval(() => {
    getHorses()
  }, 30000)
})


onUnmounted(() => {
  if (progressTimer) {
    clearInterval(progressTimer)
  }

  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>


<template>
  <section class="stable-card">

    <h2>Horse Stable</h2>


    <div class="horse-list">

      <p v-if="loading">
        Loading horses...
      </p>


      <p v-else-if="horses.length === 0">
        No horses in your stable.
      </p>


      <div
        v-for="horse in horses"
        v-else
        :key="horse.id"
        class="horse"
      >

        <div class="horse-header">

          <span class="horse-name">
            {{ horse.name }}
          </span>


          <span
            class="status"
            :class="horse.status"
          >

            <span class="status-dot"></span>

            {{
              horse.status === 'delivering'
                ? 'Deployed'
                : 'Resting'
            }}

          </span>

        </div>


        <!-- RESTING HORSE -->

        <div
          v-if="horse.status === 'resting'"
          class="resting-info"
        >
          Ready for delivery
        </div>


        <!-- DELIVERING HORSE -->

        <div
          v-else
          class="delivery-info"
        >

          <span v-if="horse.recipients">
            En route to {{ horse.recipients }}
          </span>

          <span v-else>
            Currently delivering
          </span>


          <div class="progress-track">

            <div
              class="progress"
              :style="{
                width: horse.progress + '%'
              }"
            ></div>

          </div>


          <span class="progress-text">
            {{ horse.progress }}% complete
          </span>

        </div>

      </div>

    </div>


    <button
      class="write-button"
      @click="emit('compose')"
    >
      Write Message →
    </button>

  </section>
</template>


<style scoped>
.stable-card {
  background-color: #cb9651;

  padding: clamp(1rem, 2vw, 1.5rem);

  color: #250f0b;

  box-shadow:
    0.35rem 0.35rem 0 rgba(37, 15, 11, 0.1);
}


.stable-card h2 {
  margin-top: 0;
  margin-bottom: 1.25rem;

  font-size: 1.1rem;
  font-weight: 400;
}


.horse {
  padding-block: 0.9rem;

  border-bottom:
    0.08rem solid rgba(37, 15, 11, 0.2);
}


.horse-list {
  max-height: 22rem;

  overflow-y: auto;

  padding-right: 0.5rem;
}


.horse-list::-webkit-scrollbar {
  width: 0.5rem;
}


.horse-list::-webkit-scrollbar-track {
  background-color:
    rgba(37, 15, 11, 0.1);
}


.horse-list::-webkit-scrollbar-thumb {
  background-color: #250f0b;
}


.horse-list::-webkit-scrollbar-thumb:hover {
  background-color: #cb980c;
}


.horse-header {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 1rem;
}


.horse-name {
  font-size: 0.9rem;
}


.status {
  display: flex;

  align-items: center;

  gap: 0.4rem;

  font-size: 0.75rem;
}


.status-dot {
  width: 0.6rem;
  height: 0.6rem;

  border-radius: 50%;

  background-color: currentColor;
}


.status.delivering {
  color: #7a2e1d;
}


.status.resting {
  color: #36552f;
}


.delivery-info,
.resting-info {
  margin-top: 0.6rem;

  font-family: Georgia, serif;
  font-size: 0.8rem;
}


.delivery-info {
  display: flex;
  flex-direction: column;
}


.progress-track {
  width: 100%;
  height: 0.35rem;

  margin-block: 0.5rem;

  background-color:
    rgba(37, 15, 11, 0.2);

  overflow: hidden;
}


.progress {
  height: 100%;

  background-color: #250f0b;

  transition: width 1s linear;
}


.progress-text {
  opacity: 0.7;

  font-size: 0.7rem;
}


.write-button {
  display: block;

  margin-top: 1.25rem;
  margin-left: auto;

  padding: 0;

  border: none;

  background: none;

  color: #250f0b;

  font-family: 'Rye', serif;
  font-size: 0.85rem;

  cursor: pointer;
}


.write-button:hover {
  opacity: 0.65;
}
</style>