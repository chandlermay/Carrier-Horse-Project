<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToDashboard() {
    router.push('/dashboard')
}
function goToSignUp() {
    router.push('/signup')
} function goToHowDoesItWork() {
    router.push('/howdoesitwork')
}
</script>

<template>
    <main class="home-page">
        <section class="hero">
            <p class="tagline">Carrier Horse sends messages at horse-speed.</p>
            <div class="animation-placeholder">
                <span>Horse animation goes here</span>
            </div>
        </section>
        <nav class="home-nav">
            <button @click="goToDashboard">Send a horse →</button>
            <button @click="goToSignUp">Sign Up →</button>
            <button @click="goToHowDoesItWork"> How does it work? →</button>
        </nav>

    </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rye&display=swap');
.home-page {
  min-height: calc(100vh - 80px);
  background-color: #e5ca98;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 70px 8% 55px;
  box-sizing: border-box;
}

.hero {
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

.tagline {
  max-width: 850px;
  margin: 0;

  font-family: 'Rye', serif;
  font-size: clamp(2.3rem, 5vw, 4.8rem);
  font-weight: 400;
  line-height: 1.1;

  color: #2f241c;
}

.animation-placeholder {
  width: min(500px, 75vw);
  height: 240px;

  margin-top: 55px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px dashed rgba(47, 36, 28, 0.35);
  border-radius: 18px;

  color: rgba(47, 36, 28, 0.55);

  font-family: 'Rye', serif;
}

.home-nav {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.home-nav button {
  background-color: transparent;

  border: none;
  border-top: 1px solid rgba(47, 36, 28, 0.45);

  padding: 18px 4px 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'Rye', serif;
  font-size: 1.05rem;
  font-weight: 400;

  color: #2f241c;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.home-nav button span {
  font-size: 1.3rem;

  transition: transform 0.2s ease;
}

.home-nav button:hover {
  transform: translateY(-3px);
  border-color: #2f241c;
}

.home-nav button:hover span {
  transform: translateX(5px);
}

@media (max-width: 700px) {
  .home-page {
    padding: 45px 7% 35px;
  }

  .tagline {
    font-size: 2.6rem;
  }

  .animation-placeholder {
    height: 180px;
    margin-top: 35px;
  }

  .home-nav {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>