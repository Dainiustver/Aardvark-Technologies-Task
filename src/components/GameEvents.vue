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
      </ul>
      <div class="eventStatus">
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <base-spinner v-if="isSpinning"></base-spinner>
      </div>
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
      loadSuccess: null,
      newGameStartsIn: null,
      newGameInterval: null,
      retryInterval: null,
      isSpinning: false,
      errorMessage: "",
      willRetryIn: null,
      gameId: null,
      uuid: null,
    };
  },

  methods: {
    async fetchNextGame() {
      this.isSpinning = true;
      this.errorMessage = "";
      this.willRetryIn = null;
      this.gameId = null;
      this.uuid = null;
      clearInterval(this.newGameInterval);
      this.currentEvent = "Fetching new game...";
      this.$store.dispatch("updateLogs", "Fetching new game...");

      try {
        const res = await axios.get(this.currentLink + "/nextGame");

        this.loadSuccess = true;
        this.isSpinning = false;
        this.newGameStartsIn = res.data.fakeStartDelta;
        this.gameId = res.data.id;
        this.uuid = res.data.uuid;
        this.updateCurrentEvent();
        this.$store.dispatch(
          "updateLogs",
          "New game fetched successfully. Starting timer..."
        );

        this.newGameInterval = setInterval(() => {
          if (this.newGameStartsIn > 0) {
            this.newGameStartsIn--;
            this.updateCurrentEvent();
          } else {
            clearInterval(this.newGameInterval);
            this.currentEvent = "Spinning...";
            this.isSpinning = true;
            this.renderCurrentGameResults();
          }
        }, 1000);
      } catch (e) {
        this.$store.dispatch(
          "updateLogs",
          "New game fetching failed! Retrying..."
        );
        this.retryFetch("fetch");
      }
    },

    updateCurrentEvent() {
      this.currentEvent = `Game ${this.gameId} will start in ${
        this.newGameStartsIn
      } ${this.newGameStartsIn === 1 ? "second" : "seconds"}...`;
    },

    async renderCurrentGameResults() {
      this.$store.dispatch(
        "updateLogs",
        "Rendering results for current game..."
      );

      try {
        const result = await axios.get(this.currentLink + `/game/${this.uuid}`);

        this.loadSuccess = true;

        if (result.data.outcome !== undefined) {
          setTimeout(() => {
            this.isSpinning = false;
            this.$store.dispatch("setGameWinner", result.data.outcome);
            this.eventHistory.push(
              `Game ${this.gameId} finished. The outcome was ${result.data.outcome}`
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
      this.loadSuccess = false;
      this.isSpinning = false;
      this.currentEvent = "";
      this.willRetryIn = initialRetries;

      if (this.retryInterval) clearInterval(this.retryInterval);

      this.retryInterval = setInterval(() => {
        this.errorMessage = this.retryErrorMessage;
        this.willRetryIn -= 1;

        if (this.willRetryIn <= 0) {
          clearInterval(this.retryInterval);
          this.isSpinning = true;
          this.errorMessage = "Retrying...";
          setTimeout(() => {
            mode === "fetch"
              ? this.fetchNextGame()
              : this.renderCurrentGameResults();
          }, 2000);
        }

        if (this.loadSuccess) {
          return;
        } else {
          this.retryFetch(mode);
        }
      }, 1000);
    },

    resetState() {
      this.currentEvent = "";
      this.eventHistory = [];
      this.loadSuccess = null;
      this.newGameStartsIn = null;
      if (this.newGameInterval) clearInterval(this.newGameInterval);
      this.newGameInterval = null;
      if (this.retryInterval) clearInterval(this.retryInterval);
      this.retryInterval = null;
      this.isSpinning = false;
      this.errorMessage = "";
      this.willRetryIn = null;
      this.gameId = null;
      this.uuid = null;
    },
  },

  computed: {
    currentLink() {
      return this.$store.getters.currentLink;
    },

    retryErrorMessage() {
      return `Something went wrong! Retrying in ${this.willRetryIn} ${
        this.willRetryIn === 1 ? "second" : "seconds"
      }`;
    },
  },

  watch: {
    currentLink(newValue) {
      if (newValue) {
        this.resetState();
        this.fetchNextGame();
      }
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

.eventStatus {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.error {
  margin-bottom: 3rem;
  color: red;
}
</style>
