<script setup>
import HorseStableCard from '../components/HorseStableCard.vue'
import InboxCard from '../components/InboxCard.vue'
const messages = [
    {
        sender: 'Chandler',
        arrival: '8 hours',
    },
    {
        sender: 'Hing',
        arrival: '2 hours',
    },
]
</script>

<template>
    <main class="dashboard-page">
        <div class="dashboard-layout">
            <section class="dashboard-sidebar">
                <HorseStableCard />
                <InboxCard />

            </section>


            <section class="map-section">
                <div class="map-placeholder">
                    <span>Live Horse Map</span>
                </div>
            </section>

        </div>
    </main>
</template>

<style scoped>
.dashboard-page {
    min-height: calc(100dvh - 5rem);

    background-color: #e4c388;

    padding: clamp(1.5rem, 3vw, 3rem);

    box-sizing: border-box;

    font-family: 'Rye', serif;
    color: #2f241c;
}

.dashboard-layout {
    width: min(96%, 90rem);

    margin-inline: auto;
    margin-top: 3rem;
    display: grid;

    grid-template-columns:
        minmax(15rem, 0.8fr) minmax(0, 2.4fr);

    gap: clamp(1.5rem, 3vw, 3rem);

    align-items: stretch;
}


/* LEFT SIDE */

.dashboard-sidebar {
    display: flex;

    flex-direction: column;

    gap: clamp(1.5rem, 4vh, 3rem);
}

.dashboard-card {
    background-color: #cb9651;

    padding: clamp(1rem, 2vw, 1.5rem);

    box-sizing: border-box;

    box-shadow:
        0.35rem 0.35rem 0 rgba(47, 36, 28, 0.1);
}

.dashboard-card h2 {
    margin: 0 0 1.25rem;

    font-size: clamp(1rem, 1.4vw, 1.25rem);

    font-weight: 400;
}


/* HORSE STABLE */

.stable-card {
    min-height: 13rem;

    display: flex;

    flex-direction: column;
}

.horse-row {
    display: grid;

    grid-template-columns:
        minmax(0, 1fr) auto minmax(0, 0.7fr);

    gap: 0.8rem;

    align-items: center;

    font-size: clamp(0.75rem, 1vw, 1rem);
}

.arrow {
    text-align: center;
}

.write-button {
    margin-top: auto;

    align-self: flex-end;

    background: none;

    border: none;

    padding: 0;

    font-family: 'Rye', serif;

    color: #250f0b;

    cursor: pointer;

    font-size: clamp(0.75rem, 1vw, 1rem);
}

.write-button:hover {
    text-decoration: underline;
    transform: translateY(-0.1rem);
    opacity: 0.7;
}


/* INBOX */

.inbox-card {
    min-height: 13rem;
}

.message-row {
    display: flex;

    justify-content: space-between;

    gap: 1rem;

    margin-bottom: 1.25rem;

    font-size: clamp(0.75rem, 1vw, 1rem);
}


/* MAP */

.map-section {
    min-width: 0;
}

.map-placeholder {
    width: 100%;

    min-height: 34rem;

    background-color: #cb9651;

    display: flex;

    align-items: center;

    justify-content: center;

    box-shadow:
        0.35rem 0.35rem 0 rgba(47, 36, 28, 0.1);

    color: rgba(47, 36, 28, 0.5);

    font-size: clamp(1rem, 2vw, 1.5rem);
}


/* RESPONSIVE */

@media (max-width: 50rem) {
    .dashboard-layout {
        grid-template-columns: 1fr;
    }

    .dashboard-sidebar {
        display: grid;

        grid-template-columns: 1fr 1fr;
    }

    .map-section {
        grid-row: 1;
    }

    .map-placeholder {
        min-height: 24rem;
    }
}

@media (max-width: 35rem) {
    .dashboard-sidebar {
        grid-template-columns: 1fr;
    }

    .dashboard-page {
        padding: 1rem;
    }
}
</style>