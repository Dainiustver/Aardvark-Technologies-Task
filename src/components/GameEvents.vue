<template>
  <div class="events__container">
    <header>
      <h2>Events</h2>
    </header>
    <div class="events">
      <base-spinner v-if="renderSpinner" class="eventStatus"></base-spinner>
      <ul class="events__list">
        <li class="currentEvent">{{ currentEvent }}</li>
        <li v-for="event in eventHistory" class="event" :key="event">
          {{ event }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
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
      this.$store.dispatch("toggleInput", true);

      try {
        const res = await axios.get(this.currentLink + "/nextGame");
        this.$store.dispatch("toggleInput", false);
        this.$store.dispatch(
          "updateLogs",
          "New game fetched successfully. Starting timer..."
        );
        this.isSpinning = false;
        this.newGameStartsIn = res.data.fakeStartDelta;
        this.updateCurrentEvent(res.data.id);

        this.newGameTimer = setInterval(() => {
          if (!this.dataIsReady) {
            this.resetState();
            return;
          }

          if (this.newGameStartsIn > 1) {
            this.newGameStartsIn--;
            this.updateCurrentEvent(res.data.id);
          } else {
            this.$store.dispatch("toggleInput", true);
            clearInterval(this.newGameTimer);
            this.newGameTimer = null;
            this.currentEvent = "Spinning...";
            this.isSpinning = true;

            const spinningDurationMiliseconds =
              (res.data.startDelta - res.data.fakeStartDelta + 1) * 1000;

            setTimeout(() => {
              this.renderCurrentGameResults(res.data.id, res.data.uuid);
            }, spinningDurationMiliseconds);
          } //Timer reaches 0, roulette "spins" for 3 seconds usually and then the result is shown. Giving +1 second just as a buffer.
        }, 1000);
      } catch (e) {
        this.resetState();
        this.$store.dispatch("setFetchingStatus", false);
        this.$store.dispatch("toggleInput", false);
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
        this.$store.dispatch("setGameWinner", result.data.outcome);
        this.$store.dispatch("toggleInput", false);
        this.isSpinning = false;
        this.eventHistory.unshift(
          `Game ${gameId} finished. The outcome was ${result.data.outcome}`
        );
        this.fetchNextGame();
      } catch (e) {
        this.resetState();
        this.$store.dispatch("setFetchingStatus", false);
        this.$store.dispatch("toggleInput", false);
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
    ...mapState({
      dataIsReady: (state) => state.requests.dataIsFetched,
      currentLink: "currentLink",
      screenSize: "screenSize",
    }),

    renderSpinner() {
      return this.isSpinning && this.screenSize <= 576;
    },
  },

  watch: {
    dataIsReady(newValue) {
      if (newValue) {
        this.fetchNextGame();
      }
    },

    isSpinning(newValue) {
      this.$store.dispatch("toggleSpin", newValue);
    },
  },

  beforeDestroy() {
    this.resetState();
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
  width: 100%;
}

.events {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.events__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 22rem;
  padding: 0 1rem;
  text-align: center;
  overflow-y: auto;
}

.eventStatus {
  margin: 1rem auto;
}

.currentEvent {
  margin-bottom: 3rem;
}

.event {
  margin-bottom: 0.5rem;
}
</style>
