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
      newGameTimer: null,
      newGameStartsIn: null,
      isSpinning: false,
    };
  },

  methods: {
    async fetchNextGame() {
      this.resetState();

      this.isSpinning = true;
      this.currentEvent = "Fetching new game...";
      this.$store.dispatch("updateLogs", "Fetching new game...");

      try {
        const res = await axios.get(this.currentLink + "/nextGame");
        this.$store.dispatch(
          "updateLogs",
          "New game fetched successfully. Starting timer..."
        );
        this.isSpinning = false;
        this.newGameStartsIn = res.data.fakeStartDelta;
        this.updateCurrentEvent(res.data.id);

        this.newGameTimer = setInterval(() => {
          if (this.newGameStartsIn > 1) {
            this.newGameStartsIn--;
            this.updateCurrentEvent(res.data.id);
          } else {
            clearInterval(this.newGameTimer);
            this.currentEvent = "Spinning...";
            this.isSpinning = true;
            this.renderCurrentGameResults(res.data.id, res.data.uuid);
          }
        }, 1000);
      } catch (e) {
        this.$store.dispatch("updateLogs", "New game fetch failed");
        this.$store.dispatch("toggleReload");
      }
    },

    updateCurrentEvent(gameId) {
      this.currentEvent = `Game ${gameId} will start in ${
        this.newGameStartsIn
      } ${this.newGameStartsIn > 1 ? "seconds" : "second"}...`;
    },

    async renderCurrentGameResults(gameId, uuid) {
      this.$store.dispatch(
        "updateLogs",
        "Rendering results for current game..."
      );

      try {
        const result = await axios.get(this.currentLink + `/game/${uuid}`);
        this.$store.dispatch("updateLogs", "Rendering was successful");
        if (result.data.outcome !== undefined) {
          this.isSpinning = false;
          this.$store.dispatch("setGameWinner", result.data.outcome);
          this.eventHistory.push(
            `Game ${gameId} finished. The outcome was ${result.data.outcome}`
          );
          this.fetchNextGame();
        } else {
          setTimeout(() => {
            this.renderCurrentGameResults(gameId, uuid);
          }, 3000);
        }
      } catch (e) {
        this.$store.dispatch("updateLogs", "Rendering failed");
        this.$store.dispatch("toggleReload");
      }
    },

    resetState() {
      this.currentEvent = "";
      clearInterval(this.newGameTimer);
      this.newGameTimer = null;
      this.newGameStartsIn = null;
      this.isSpinning = false;
    },
  },

  computed: {
    dataIsReady() {
      return this.$store.getters.dataIsFetched;
    },
    currentLink() {
      return this.$store.getters.currentLink;
    },
  },

  watch: {
    dataIsReady: {
      handler(newValue) {
        if (newValue) {
          this.resetState();
          this.fetchNextGame();
          this.eventHistory = [];
        }
      },
      immediate: true,
    },
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
