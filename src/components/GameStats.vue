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
          :key="`cold-${slot.number}-${index}`"
        >
          {{ slot.result }}
        </div>
      </div>
      <div class="stats__hits">
        <div
          class="stats__hit"
          v-for="(slot, index) in coldSlots"
          :key="`cold-hit-${slot.number}-${index}`"
        >
          {{ slot.hits }}
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
          :key="`neutral-${slot.number}-${index}`"
        >
          {{ slot.result }}
        </div>
      </div>
      <div class="stats__hits">
        <div
          class="stats__hit"
          v-for="(slot, index) in neutralSlots"
          :key="`neutral-hit-${slot.number}-${index}`"
        >
          {{ slot.hits }}
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
          :key="`hot-${slot.number}-${index}`"
        >
          {{ slot.result }}
        </div>
      </div>
      <div class="stats__hits">
        <div
          class="stats__hit"
          v-for="(slot, index) in hotSlots"
          :key="`hot-hit-${slot.number}-${index}`"
        >
          {{ slot.hits }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allSlots: [],
      resultsCounter: 200,
    };
  },
  methods: {
    updateStats() {
      const rouletteNumbersDataClone = this.$store.getters.rouletteNumbersData;
      const rouletteNumbersSorted = this.sortByHits(rouletteNumbersDataClone);
      this.allSlots = rouletteNumbersSorted;
    },

    sortByHits(arr) {
      return arr.sort((a, b) => a.hits - b.hits);
    },
  },

  computed: {
    dataIsReady() {
      return this.$store.getters.dataIsFetched;
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

  watch: {
    newWinner(newValue) {
      if (newValue) {
        const idx = this.allSlots.findIndex((slot) => slot.result === newValue);
        this.allSlots[idx].hits++;
        this.allSlots = this.sortByHits(this.allSlots);
        this.resultsCounter++;
      }
    },

    dataIsReady(newValue) {
      if (newValue) {
        this.updateStats();
        this.resultsCounter = 200;
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
