<script setup>
import { computed, ref } from 'vue'
import usaMap from './usa.svg'
import horseLogo from "../assets/Vintage Galloping Mail Horse Logo.png"

const routes = [
    {
        name: 'New York City to Seattle',
        from: 'New York City, NY',
        to: 'Seattle, WA',

        fromX: 981.98,
        fromY: 541.12,

        toX: 526.14,
        toY: 457.99,

        path: `
      M 981.98 541.12
      L 909.03 531.75
      L 853.06 527.20
      L 799.99 489.68
      L 727.28 466.74
      L 653.31 481.81
      L 571.41 457.83
      L 526.14 457.99
    `,
    },

    {
        name: 'Los Angeles to Boston',
        from: 'Los Angeles, CA',
        to: 'Boston, MA',

        fromX: 564.67,
        fromY: 621.84,

        toX: 1009.09,
        toY: 521.41,

        path: `
      M 564.67 621.84
      L 593.56 596.03
      L 624.64 540.78
      L 689.49 553.07
      L 775.09 534.09
      L 853.06 527.20
      L 909.03 531.75
      L 1009.09 521.41
    `,
    },

    {
        name: 'Chicago to Miami',
        from: 'Chicago, IL',
        to: 'Miami, FL',

        fromX: 853.06,
        fromY: 527.20,

        toX: 923.05,
        toY: 722.05,

        path: `
      M 853.06 527.20
      L 866.86 552.75
      L 870.62 571.05
      L 861.12 596.19
      L 883.55 625.45
      L 911.87 688.49
      L 923.05 722.05
    `,
    },
]

const selectedRoute = ref(0)

const currentRoute = computed(() => routes[selectedRoute.value])

const routePath = computed(() => currentRoute.value.path)

function chooseRoute(index) {
    selectedRoute.value = index
}
</script>

<template>
    <section class="route-map">
        <div class="map-panel">
            <div class="map-frame">

                <!-- Permanent map -->
                <img :src="usaMap" class="map-image" alt="Map of the continental United States" />

                <!-- Everything inside here changes independently -->
                <svg class="route-overlay" viewBox="477 421 593.3779761904764 318.2870370370371"
                    preserveAspectRatio="xMidYMid meet">
                    <!-- Route -->
                    <path :d="routePath" class="delivery-route" />

                    <!-- Starting point -->
                    <circle :cx="currentRoute.fromX" :cy="currentRoute.fromY" r="3" class="city-marker" />

                    <!-- Destination -->
                    <circle :cx="currentRoute.toX" :cy="currentRoute.toY" r="3" class="city-marker" />

                    <!-- City Names Display on Map-->
                    <text :x="currentRoute.fromX" :y="currentRoute.fromY - 10" class="city-label" text-anchor="middle">
                        {{ currentRoute.from }}
                    </text>

                    <text :x="currentRoute.toX" :y="currentRoute.toY - 10" class="city-label" text-anchor="middle">
                        {{ currentRoute.to }}
                    </text>
                    <!-- Moving horse -->
                    <image :key="currentRoute.name" :href="horseLogo" width="28" height="28" x="-14" y="-14">
                        <animateMotion :path="routePath" dur="15s" repeatCount="indefinite" />
                    </image>
                </svg>

            </div>

            <div class="route-info">
                <h2>
                    {{ currentRoute.from }} → {{ currentRoute.to }}
                </h2>
            </div>

            <div v-if="routes.length > 1" class="route-selector">
                <button v-for="(route, index) in routes" :key="route.name" :class="{ active: selectedRoute === index }"
                    @click="chooseRoute(index)">
                    {{ route.from }} → {{ route.to }}
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rye&display=swap');

.route-map {
    width: min(92%, 60rem);
    margin-inline: auto;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.map-panel {
  width: 100%;

  background-color: #cb9651;

  padding: clamp(1.5rem, 3vw, 2.5rem);

  box-sizing: border-box;

  border-radius: 0;

  outline: 0.08rem solid rgba(203, 152, 12, 0.45);
  outline-offset: -0.45rem;

  box-shadow:
    0 0.6rem 1.4rem rgba(47, 36, 28, 0.1);
  margin-top: 2rem;
}

.map-frame {
    position: relative;

    width: 100%;

    /*
    This ratio comes directly from your SVG:
    593.377976 / 318.287037
  */
    aspect-ratio: 593.377976 / 318.287037;

    flex-shrink: 0;
}

/*
  The real USA map and the route overlay occupy
  exactly the same space.
*/

.map-image,
.route-overlay {
    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;

    display: block;
}

.map-image {
    object-fit: contain;
}

.route-overlay {
    overflow: visible;
}

/* Route */

.delivery-route {
    fill: none;
    stroke: #cb980c;
    stroke-width: 2.5;
    stroke-dasharray: 7 6;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* City dots */

.city-marker {
    fill: #c33404;
    stroke: #c33404;
    stroke-width: 2;
}

.city-label {
    fill: #c33404;
    font-family: 'Rye', serif;
    font-size: 12px;
}

/* Information underneath */

.route-info {
    margin-top: 1rem;

    text-align: center;

    color: #2f241c;
}

.route-info h2 {
    margin: 0;

    font-family: 'Rye', serif;
    font-size: clamp(1rem, 2vw, 1.6rem);
    font-weight: 400;
}

/* Route selection */

.route-selector {
    width: 100%;

    margin-top: 1.5rem;

    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    gap: 0.8rem;
}

.route-selector button {
    padding: 0.6rem 1rem;

    background: transparent;

    border: 0.08rem solid rgba(47, 36, 28, 0.4);
    border-radius: 100rem;

    color: #2f241c;

    font-family: 'Rye', serif;
    font-size: clamp(0.7rem, 1vw, 0.9rem);

    cursor: pointer;
    transition:
        background-color 0.2s ease,
        transform 0.2s ease,
        border-color 0.2s ease;
}

.route-selector button:hover {
    background-color: rgba(47, 36, 28, 0.12);
    transform: translateY(-0.15rem);
    border-color: #2f241c;
}

.route-selector button.active {
    background-color: #2f241c;
    color: #e4c388;
}
</style>