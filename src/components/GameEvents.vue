<template>
  <div class="events__container">
    <header>
      <h2>Events</h2>
    </header>
    <div class="events">
      <ul class="events__list">
        <li v-for="event in eventHistory" class="event" :key="event">
          {{ event }}
        </li>
        <li class="currentEvent">{{ currentEvent }}</li>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <base-spinner v-if="isSpinning"></base-spinner>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BaseSpinner from "./BaseSpinner.vue";
export default {
  data() {
    return {
      currentEvent: "",
      eventHistory: [],
      newGameTimer: null,
      newGameInterval: null,
      isSpinning: false,
      currentGame: null,
      errorMessage: "",
      retryTimer: null,
    };
  },

  methods: {
    async fetchNextGame() {
      this.isSpinning = true;
      this.currentEvent = "Fetching new game...";
      this.$store.dispatch("updateLogs", "Fetching new game...");

      try {
        const res = await axios.get(
          "https://dev-games-backend.advbet.com/v1/ab-roulette/1/nextGame"
        );

        this.isSpinning = false;
        this.newGameTimer = res.data.fakeStartDelta;
        this.updateCurrentEvent(res.data.id);

        this.newGameInterval = setInterval(() => {
          if (this.newGameTimer > 0) {
            this.newGameTimer--;
            this.updateCurrentEvent(res.data.id);
          } else {
            clearInterval(this.newGameInterval);
            this.currentEvent = "Spinning...";
            this.isSpinning = true;
            this.renderCurrentGameResults(res.data.id, res.data.uuid);
          }
        }, 1000);

        this.$store.dispatch(
          "updateLogs",
          "New game fetched successfully. Starting timer..."
        );
      } catch (e) {
        this.$store.dispatch(
          "updateLogs",
          "New game fetching failed! Retrying..."
        );
        this.retryFetch("fetch");

        // Handle error
      }
    },

    updateCurrentEvent(gameId) {
      this.currentEvent = `Game ${gameId} will start in ${this.newGameTimer} ${
        this.newGameTimer > 1 ? "seconds" : "second"
      }...`;
    },

    async renderCurrentGameResults(gameId, uuid) {
      this.$store.dispatch(
        "updateLogs",
        "Rendering results for current game..."
      );

      try {
        const result = await axios.get(
          `https://dev-games-backend.advbet.com/v1/ab-roulette/1/game/${uuid}`
        );

        if (result.data.outcome !== undefined) {
          setTimeout(() => {
            this.isSpinning = false;
            this.$store.dispatch("setGameWinner", result.data.outcome);
            this.eventHistory.push(
              `Game ${gameId} finished. The outcome was ${result.data.outcome}`
            );
            this.fetchNextGame();
          }, 2000);
        } else {
          setTimeout(() => {
            this.renderCurrentGameResults();
          }, 1000);
        }
      } catch (e) {
        this.$store.dispatch("updateLogs", "Rendering failed! Retrying...");

        this.retryFetch("load");
      }
    },

    retryFetch(mode) {
      this.isSpinning = false;
      this.currentEvent = null;
      this.retryTimer = 5;

      const retryInterval = setInterval(() => {
        this.errorMessage = `Something went wrong! Retrying in ${this.retryTimer} seconds...`;
        this.retryTimer--;

        if (this.retryTimer === -1) {
          clearInterval(retryInterval);
          this.isSpinning = true;
          this.errorMessage = "Retrying...";
          setTimeout(() => {
            this.errorMessage = `Something went wrong! Retrying in ${this.retryTimer} seconds...`;
            mode === "fetch"
              ? this.fetchNextGame()
              : this.renderCurrentGameResults();
          }, 2000);
        }
      }, 1000);
    },
  },

  mounted() {
    this.fetchNextGame();
  },

  components: { BaseSpinner },
};
</script>

<style scoped>
.events__container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 25rem;
  margin: 1rem 0;
}

.events__list {
  text-align: center;
  padding: 0;
}

.currentEvent {
  margin-bottom: 3rem;
}

.event {
  margin-bottom: 0.5rem;
}

.error {
  margin-bottom: 3rem;
  color: red;
}
</style>
