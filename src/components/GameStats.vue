<template>
  <header>
    <h2 class="stats__header">Stats (last 200)</h2>
  </header>
  <div class="stats">
    <div class="stats__legend">
      <div class="stats__label stats__legend-spacer"></div>
      <div class="stats__label">Slot</div>
      <div class="stats__label">Hits</div>
    </div>
    <div class="stats__section stats__section--cold">
      <div class="stats__section-title">Cold</div>
      <div class="stats__slots">
        <div
          class="stats__slot"
          :style="{ backgroundColor: slot.color }"
          v-for="(slot, index) in coldSlots"
          :key="`cold-${slot}-${index}`"
        >
          {{ slot.result }}
        </div>
      </div>
      <div class="stats__hits">
        <div
          class="stats__hit"
          v-for="(hit, index) in coldSlots"
          :key="`cold-hit-${hit}-${index}`"
        >
          {{ hit.count }}
        </div>
      </div>
    </div>
    <div class="stats__section stats__section--neutral">
      <div class="stats__section-title">Neutral</div>
      <div class="stats__slots">
        <div
          class="stats__slot"
          :style="{ backgroundColor: slot.color }"
          v-for="(slot, index) in neutralSlots"
          :key="`neutral-${slot}-${index}`"
        >
          {{ slot.result }}
        </div>
      </div>
      <div class="stats__hits">
        <div
          class="stats__hit"
          v-for="(hit, index) in neutralSlots"
          :key="`neutral-hit-${hit}-${index}`"
        >
          {{ hit.count }}
        </div>
      </div>
    </div>
    <div class="stats__section stats__section--hot">
      <div class="stats__section-title">Hot</div>
      <div class="stats__slots">
        <div
          class="stats__slot"
          :style="{ backgroundColor: slot.color }"
          v-for="(slot, index) in hotSlots"
          :key="`hot-${slot}-${index}`"
        >
          {{ slot.result }}
        </div>
      </div>
      <div class="stats__hits">
        <div
          class="stats__hit"
          v-for="(hit, index) in hotSlots"
          :key="`hot-hit-${hit}-${index}`"
        >
          {{ hit.count }}
        </div>
      </div>
    </div>
  </div>
  <div v-if="dataFetchSuccess === false">
    <p class="errorMessage">
      Sorry, something went wrong! Retrying in {{ retryCounter }} seconds...
    </p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      allSlots: [],
      dataFetchSuccess: null,
      retryCounter: null,
      retryInterval: null,
    };
  },
  methods: {
    async fetchGameData() {
      this.$store.dispatch(
        "updateLogs",
        "Fetching last 200 games and color configuration..."
      );
      try {
        this.dataFetchSuccess = true;
        clearInterval(this.retryInterval);
        const rollData = await axios.get(
          "https://dev-games-backend.advbet.com/v1/ab-roulette/1/stats?limit=200"
        );

        this.allSlots = rollData.data;

        const numberColors = await axios.get(
          "https://dev-games-backend.advbet.com/v1/ab-roulette/1/configuration"
        );

        const newArray = [];
        this.allSlots.forEach((slot) => {
          const idx = numberColors.data.results.findIndex(
            (num) => num == slot.result
          );

          newArray.push({
            result: slot.result,
            count: slot.count,
            color: numberColors.data.colors[idx],
          });
        });
        this.allSlots = newArray;
      } catch (e) {
        this.$store.dispatch("updateLogs", "Fetching failed! Retrying...");
        this.dataFetchSuccess = false;
        setTimeout(() => {
          this.fetchGameData();
        }, 5000);
        this.retryCounter = 5;
        this.retryInterval = setInterval(() => {
          this.retryCounter--;
        }, 1000);
      }
    },

    sortArray(arr) {
      return arr.sort((a, b) => a.count - b.count);
    },
  },
  computed: {
    coldSlots() {
      return this.allSlots.slice(0, 5);
    },
    neutralSlots() {
      return this.allSlots.slice(5, 32);
    },
    hotSlots() {
      return this.allSlots.slice(32);
    },
    newWinner() {
      return this.$store.getters.lastGameWinner;
    },
  },
  mounted() {
    this.fetchGameData();
  },

  watch: {
    newWinner(newValue) {
      if (newValue) {
        const idx = this.allSlots.findIndex((slot) => newValue === slot.result);
        this.allSlots[idx].count++;
        this.allSlots = this.sortArray(this.allSlots);
      }
    },
  },
};
</script>

<style scoped>
.stats {
  display: flex;
  justify-content: center;
}

.stats__header {
  text-align: center;
}

.stats__legend {
  display: flex;
  flex-direction: column;
}

.stats__label {
  display: flex;
  align-items: center;
  margin-top: 0.1rem;
}

.stats__legend div {
  padding-right: 1rem;
  height: 3rem;
}

.stats__slots,
.stats__hits {
  display: flex;
  height: 3rem;
}

.stats__slot,
.stats__hit {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  width: 2.5rem;
}

.stats__slot {
  color: white;
}

.stats__section-title,
.stats__label {
  text-align: center;
  font-weight: bold;
}

.stats__section-title {
  padding: 1rem;
}

.stats__section--cold {
  background-color: rgb(191, 218, 225);
}

.stats__section--neutral {
  background-color: rgb(239, 232, 232);
}

.stats__section--hot {
  background-color: rgb(239, 150, 150);
}

.errorMessage {
  color: red;
  text-align: center;
}
</style>
