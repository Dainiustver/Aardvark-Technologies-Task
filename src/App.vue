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
import GameStats from "./components/GameStats.vue";
import GameEvents from "./components/GameEvents.vue";
import GameBoard from "./components/GameBoard.vue";
import GameLogs from "./components/GameLogs.vue";
export default {
  components: {
    DataFetcher,
    GameStats,
    GameEvents,
    GameBoard,
    GameLogs,
  },

  computed: {
    currentLink() {
      return this.$store.getters.currentLink;
    },

    reloadNeeded() {
      return this.$store.getters.reloadNeeded;
    },
  },
  watch: {
    currentLink: {
      handler() {
        this.$store.dispatch("init");
      },
      immediate: true,
    },

    reloadNeeded(newValue) {
      if (newValue) {
        window.location.reload();
      }
    },
  },
};
</script>

<style scoped>
header {
  text-align: center;
}

div {
  display: flex;
  justify-content: space-around;
}
</style>
