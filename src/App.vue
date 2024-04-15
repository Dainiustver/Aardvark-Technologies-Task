<template>
  <header>
    <h1>Aardvark Roulette Game</h1>
  </header>
  <data-fetcher></data-fetcher>
  <game-stats></game-stats>
  <div>
    <game-events></game-events>
    <game-board></game-board>
    <game-logs></game-logs>
  </div>
</template>

<script>
import DataFetcher from "./components/DataFetcher.vue";
import GameStats from "./components/game-stats/GameStatsParent.vue";
import GameEvents from "./components/GameEvents.vue";
import GameBoard from "./components/GameBoard.vue";
import GameLogs from "./components/GameLogs.vue";

export default {
  data() {
    return {
      throttledCheckScreenSize: null,
    };
  },

  watch: {
    currentLink: {
      handler(newValue) {
        if (newValue) {
          this.$store.dispatch("init");
        }
      },
      immediate: true,
    },
  },

  computed: {
    currentLink() {
      return this.$store.state.currentLink;
    },
  },

  mounted() {
    this.throttledCheckScreenSize = this.throttle(() => {
      this.$store.dispatch(
        "checkScreenSize",
        document.documentElement.clientWidth || window.innerWidth
      );
    }, 100);

    window.addEventListener("resize", this.throttledCheckScreenSize);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.throttledCheckScreenSize);
  },

  methods: {
    throttle(func, limit) {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => {
            inThrottle = false;
          }, limit);
        }
      };
    },
  },

  components: {
    DataFetcher,
    GameStats,
    GameEvents,
    GameBoard,
    GameLogs,
  },
};
</script>

<style scoped>
header {
  width: 100%;
  margin-bottom: 2rem;
}

h1 {
  padding: 0 2rem;
  text-align: center;
}

div {
  display: flex;
  justify-content: space-around;
}

@media (max-width: 992px) {
  div {
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
