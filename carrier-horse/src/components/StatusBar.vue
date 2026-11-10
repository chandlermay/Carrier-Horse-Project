<script setup>
import horseSprite from '../assets/Four Pixel-Art Horse Running Frames.png'
import westernLandscape from '../assets/western-landscape.png'
</script>

<template>
  <div class="status-bar">

    <img class="landscape-img"
      :src="westernLandscape"
      
      alt=""
    />
    <img class="landscape-img"
      :src="westernLandscape"
      alt=""
    />

    <div
      class="horse"
      :style="{ backgroundImage: `url(${horseSprite})` }"
    ></div>

  </div>
</template>

<style scoped>
.status-bar {
  position: relative;

  width: 100%;
  height: 5rem;

  overflow: hidden;

  background-color: #250f0b;
}

.landscape-img {
  display: inline-block;
  vertical-align: bottom;

  width: 50%;
  height: 5rem;

  object-fit: cover;
}

.horse {
  position: absolute;

  left: -5rem;
  bottom: 0.6rem;

  width: 4rem;
  height: 3rem;

  background-repeat: no-repeat;
  background-size: 400% 180%;

  animation:
    horse-move 12s linear infinite,
    horse-run 0.9s steps(4) infinite;
}

@keyframes horse-move {
  from {
    left: -5rem;
  }

  to {
    left: calc(100% + 5rem);
  }
}

@keyframes horse-run {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 133.333% 0;
  }
}
</style>