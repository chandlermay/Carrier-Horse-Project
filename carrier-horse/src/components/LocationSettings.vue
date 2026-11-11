<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { supabase } from '../utils/supabase'
import { getCurrentLocation } from '../utils/location'

const latitude = ref<number | null>(null)
const longitude = ref<number | null>(null)

const zipCode = ref('')

const locationUpdatedAt = ref<string | null>(null)

const loading = ref(true)
const saving = ref(false)

const message = ref('')


async function loadSavedLocation() {
  loading.value = true

  const { data: userData } =
    await supabase.auth.getUser()

  const user = userData.user

  if (!user) {
    message.value = 'You must be logged in.'

    loading.value = false
    return
  }


  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      current_latitude,
      current_longitude,
      current_zip_code,
      location_updated_at
      `
    )
    .eq('id', user.id)
    .single()


  if (error) {
    message.value = error.message

    loading.value = false
    return
  }


  latitude.value =
    data.current_latitude ?? null

  longitude.value =
    data.current_longitude ?? null

  zipCode.value =
    data.current_zip_code ?? ''

  locationUpdatedAt.value =
    data.location_updated_at ?? null


  loading.value = false
}


async function useCurrentLocation() {
  message.value = ''
  saving.value = true

  try {

    const coordinates =
      await getCurrentLocation()


    const { data: userData } =
      await supabase.auth.getUser()

    const user = userData.user


    if (!user) {
      message.value =
        'You must be logged in.'

      saving.value = false
      return
    }


    const updatedAt =
      new Date().toISOString()


    const { error } = await supabase
      .from('profiles')
      .update({
        current_latitude:
          coordinates.latitude,

        current_longitude:
          coordinates.longitude,

        location_updated_at:
          updatedAt
      })
      .eq('id', user.id)


    if (error) {
      message.value = error.message

      saving.value = false
      return
    }


    latitude.value =
      coordinates.latitude

    longitude.value =
      coordinates.longitude

    locationUpdatedAt.value =
      updatedAt


    message.value =
      'Current delivery location updated.'

  } catch (error) {

    if (error instanceof Error) {
      message.value = error.message
    } else {
      message.value =
        'Could not determine your location.'
    }

  } finally {
    saving.value = false
  }
}


async function saveZipCode() {
  message.value = ''

  const cleanedZip =
    zipCode.value.trim()


  if (!/^\d{5}$/.test(cleanedZip)) {
    message.value =
      'Enter a valid 5-digit ZIP code.'

    return
  }


  saving.value = true


  const { data: userData } =
    await supabase.auth.getUser()

  const user = userData.user


  if (!user) {
    message.value =
      'You must be logged in.'

    saving.value = false
    return
  }


  const updatedAt =
    new Date().toISOString()


  const { error } = await supabase
    .from('profiles')
    .update({
      current_zip_code:
        cleanedZip,

      current_latitude:
        null,

      current_longitude:
        null,

      location_updated_at:
        updatedAt
    })
    .eq('id', user.id)


  if (error) {
    message.value = error.message

    saving.value = false
    return
  }


  latitude.value = null
  longitude.value = null

  locationUpdatedAt.value =
    updatedAt


  message.value =
    'Delivery ZIP code updated.'

  saving.value = false
}


function formatUpdatedTime() {
  if (!locationUpdatedAt.value) {
    return 'Never'
  }

  return new Date(
    locationUpdatedAt.value
  ).toLocaleString()
}


onMounted(() => {
  loadSavedLocation()
})
</script>


<template>
  <section class="location-card">

    <h2>Delivery Location</h2>

    <p class="description">
      Carrier Horse uses your latest delivery
      location when another user sends you a letter.
    </p>


    <p v-if="loading">
      Loading location...
    </p>


    <template v-else>

      <div
        v-if="
          latitude !== null &&
          longitude !== null
        "
        class="location-status"
      >
        <strong>
          Current location saved
        </strong>

        <span>
          Updated:
          {{ formatUpdatedTime() }}
        </span>
      </div>


      <div
        v-else-if="zipCode"
        class="location-status"
      >
        <strong>
          ZIP {{ zipCode }}
        </strong>

        <span>
          Updated:
          {{ formatUpdatedTime() }}
        </span>
      </div>


      <div
        v-else
        class="location-status"
      >
        <strong>
          No delivery location saved
        </strong>
      </div>


      <button
        class="location-button"
        :disabled="saving"
        @click="useCurrentLocation"
      >
        {{
          saving
            ? 'Updating...'
            : 'Use My Current Location'
        }}
      </button>


      <div class="divider">

        <span></span>

        <p>or</p>

        <span></span>

      </div>


      <div class="zip-group">

        <label for="locationZip">
          Enter ZIP Code Manually
        </label>

        <input
          id="locationZip"
          v-model="zipCode"
          type="text"
          inputmode="numeric"
          maxlength="5"
          placeholder="ZIP code"
        />

        <button
          class="zip-button"
          :disabled="saving"
          @click="saveZipCode"
        >
          Save ZIP
        </button>

      </div>


      <p
        v-if="message"
        class="location-message"
      >
        {{ message }}
      </p>

    </template>

  </section>
</template>


<style scoped>
.location-card {
  width: min(100%, 32rem);
  
  box-sizing: border-box;

  padding: 2rem;

  background-color: #cb9651;

  border: 0.1rem solid #250f0b;

  color: #250f0b;
}


.location-card h2 {
  margin-top: 0;
  text-align: center;
  font-family: 'Rye', serif;

  font-weight: normal;
}

.description {
  font-family: Georgia, serif;

  line-height: 1.5;
}


.location-status {
  display: flex;
  flex-direction: column;

  gap: 0.35rem;

  margin-block: 1.5rem;

  padding: 1rem;

  border:
    0.08rem solid rgba(37, 15, 11, 0.35);

  background-color:
    rgba(228, 195, 136, 0.35);

  font-family: Georgia, serif;
}


.location-button,
.zip-button {
  border: 0.1rem solid #250f0b;

  background-color: #250f0b;
  color: #cb980c;

  padding: 0.8rem 1rem;

  font-family: 'Rye', serif;

  cursor: pointer;
}


.location-button {
  width: 100%;
}


.location-button:disabled,
.zip-button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}


.divider {
  display: flex;

  align-items: center;

  gap: 1rem;

  margin-block: 1.5rem;
}


.divider span {
  flex: 1;

  height: 0.05rem;

  background-color:
    rgba(37, 15, 11, 0.4);
}


.divider p {
  margin: 0;

  font-family: Georgia, serif;
}


.zip-group {
  display: flex;
  flex-direction: column;

  gap: 0.6rem;
}


.zip-group label {
  font-family: 'Rye', serif;

  font-size: 0.85rem;
}


.zip-group input {
  box-sizing: border-box;

  width: 100%;

  padding: 0.8rem;

  border: 0.1rem solid #250f0b;

  background-color: #e4c388;

  color: #250f0b;

  font-family: Georgia, serif;

  font-size: 1rem;
}


.location-message {
  margin-bottom: 0;

  font-family: Georgia, serif;

  text-align: center;
}
</style>