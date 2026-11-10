<script setup>
const horses = [
  {
    id: 1,
    name: 'American Horse',
    status: 'delivering',
    destination: 'Seattle, WA',
    progress: 62,
  },
  {
    id: 2,
    name: 'British Horse',
    status: 'resting',
    destination: null,
    progress: 0,
  },
  {
    id: 3,
    name: 'Chinese Horse',
    status: 'resting',
    destination: null,
    progress: 0,
  },
]
</script>

<template>
  <section class="stable-card">
    <h2>Horse Stable</h2>

<div class="horse-list">
  <div
    v-for="horse in horses"
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

        {{ horse.status === 'delivering' ? 'Deployed' : 'Resting' }}
      </span>
    </div>

    <div
      v-if="horse.status === 'delivering'"
      class="delivery-info"
    >
      <span>
        En route to {{ horse.destination }}
      </span>

      <div class="progress-track">
        <div
          class="progress"
          :style="{ width: horse.progress + '%' }"
        ></div>
      </div>

      <span class="progress-text">
        {{ horse.progress }}% complete
      </span>
    </div>

    <div
      v-else
      class="resting-info"
    >
      Ready for delivery
    </div>
  </div>
</div>

    <button class="write-button">
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

  border-bottom: 0.08rem solid rgba(37, 15, 11, 0.2);
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
  background-color: rgba(37, 15, 11, 0.1);
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

  font-family: serif;
  font-size: 0.8rem;
}

.progress-track {
  width: 100%;
  height: 0.35rem;

  margin-block: 0.5rem;

  background-color: rgba(37, 15, 11, 0.2);

  overflow: hidden;
}

.progress {
  height: 100%;

  background-color: #250f0b;

  transition: width 0.4s ease;
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