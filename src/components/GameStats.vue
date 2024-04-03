<template>
  <header>
    <h2 class="stats__header">Stats (last {{ resultsCounter }})</h2>
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
  <div class="errorMessage">
    <p v-if="dataFetchSuccess === false">
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
      retryTimeout: null,
      retryInterval: null,
      retryCounter: null,
      resultsCounter: 200,
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
        clearTimeout(this.retryTimeout);
        clearInterval(this.retryInterval);
        const rollData = await axios.get(this.currentLink + "/stats?limit=200");
        this.allSlots = rollData.data;

        const numberColors = await axios.get(
          this.currentLink + "/configuration"
        );

        const newArray = [];
        this.allSlots.forEach((slot) => {
          const idx = numberColors.data.results.findIndex(
            (num) => num == slot.result
          );

          newArray.push({
            result: slot.result === 37 ? "00" : slot.result, //Not the cleanest code I have to agree, but this comes from the fact that /stats returns results in which double zero roll is named as 37 and in /configuration same result is returned as 00 and thus my forEach above doesn't find a match. Hopefully roulette numbers won't change for a while and this will be fine
            count: slot.count,
            color: slot.result === 37 ? "green" : numberColors.data.colors[idx],
          });
        });
        this.allSlots = newArray;
      } catch (e) {
        this.$store.dispatch("updateLogs", "Fetching failed! Retrying...");
        this.dataFetchSuccess = false;
        if (this.retryTimeout) {
          clearTimeout(this.retryTimeout);
        }
        this.retryTimeout = setTimeout(() => {
          this.fetchGameData();
        }, 5000);
        this.retryCounter = 5;
        if (this.retryInterval) clearInterval(this.retryInterval);
        this.retryInterval = setInterval(() => {
          this.retryCounter--;
        }, 1000);
      }
    },

    resetState() {
      this.allSlots = [];
      this.dataFetchSuccess = null;
      this.retryCounter = null;
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
        this.retryTimeout = null;
      }
      if (this.retryInterval) {
        clearInterval(this.retryInterval);
        this.retryInterval = null;
      }
    },

    sortArray(arr) {
      return arr.sort((a, b) => a.count - b.count);
    },
  },

  computed: {
    currentLink() {
      return this.$store.getters.currentLink;
    },

    newWinner() {
      return this.$store.getters.lastGameWinner;
    },

    coldSlots() {
      return this.allSlots.slice(0, 5);
    },

    neutralSlots() {
      return this.allSlots.slice(5, -5);
    },

    hotSlots() {
      return this.allSlots.slice(-5);
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
        this.resultsCounter += 1;
      }
    },

    currentLink(newValue) {
      if (newValue) {
        this.resetState();
        this.fetchGameData();
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
  margin-top: 1rem;
  height: 2rem;
  color: red;
  text-align: center;
}
</style>
