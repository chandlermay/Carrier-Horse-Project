<script setup>
import settingsIcon from './Vintage Brown Gear Icon.png'
import profileIcon from './Vintage Cowboy Silhouette Emblem.png'
</script>

<template>
    <header class="header-bar">
        <div class="brand">
            <img src="./Galloping Horse Mail Courier.png" alt="CarrierHorse Logo" class="horse-logo" />
            Carrier Horse
        </div>
        <nav class="header-actions">
            <button class="icon-button">
                <img :src="profileIcon" alt="Profile" />
            </button>
            <button class="icon-button">
                <img :src="settingsIcon" alt="Settings" />
            </button>
        </nav>
    </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rye&display=swap');

.horse-logo {
    width: 10%;
    height: 10%;
}

.header-bar {
    height: 80px;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 8%;
    box-sizing: border-box;

    background-color: #e5ca98;
    border-bottom: 1px solid rgba(47, 36, 28, 0.35);
}

.brand {
    font-family: 'Rye', serif;
    font-size: 1.7rem;
    color: #2f241c;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.icon-button {
    background: none;
    border: none;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
}

.icon-button img {
    width: clamp(2rem, 3vw, 3rem);
    aspect-ratio: 1;
    object-fit: contain;
    transition:
        transform 0.2s ease,
        opacity 0.2s ease;
}

.icon-button:hover img {
    transform: scale(1.08);
    opacity: 0.75;
}

.header-actions button {
    background: none;
    border: none;
    padding: 0;

    font-family: 'Rye', serif;
    font-size: 0.95rem;

    color: #2f241c;

    cursor: pointer;

    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.header-actions button:hover {
    opacity: 0.65;
    transform: translateY(-2px);
}

@media (max-width: 700px) {
    .header-bar {
        padding: 0 7%;
    }

    .brand {
        font-size: 1.3rem;
    }

    .header-actions {
        gap: 16px;
    }

    .header-actions button {
        font-size: 0.8rem;
    }
}
</style>