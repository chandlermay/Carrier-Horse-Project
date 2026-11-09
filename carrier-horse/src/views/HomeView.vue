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
    <p>Carrier Horse sends messages at horse-speed.</p>
    <nav>
        <button @click="goToDashboard">Send a horse →</button>
        <button @click="goToSignUp">Sign Up -></button>
        <button @click="goToHowDoesItWork"> How does it work? -></button>
    </nav>
</template>

<style></style>