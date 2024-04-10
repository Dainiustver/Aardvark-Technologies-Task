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
import axios from "axios";
export default {
  data() {
    return {
      allSlots: [],
    };
  },
  methods: {
    updateStats() {
      const rouletteNumbersSorted = this.sortByHits(
        this.$store.getters.rouletteNumbersData.slice()
      );
      this.allSlots = rouletteNumbersSorted;
    },

    sortByHits(arr) {
      return arr.sort((a, b) => {
        if (a.hits !== b.hits) return a.hits - b.hits; //Sorting in ascending order if numbers don't have the same amount of hits

        if (a.result === "00") return 1; //Keeping "00" at the end of numbers with the same amount of hits, as shown in the demo
        if (b.result === "00") return -1;

        return 0; //If hits match and there is no "00" in the comparison, keep default sorting settings
      });
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
    async newWinner(newValue) {
      //This watcher updates rouletteNumberData in Vuex after each spin (specifically the hits of each number). Alternative approach would be to dispatch "init" function in Vuex, but that would fire unneeded axios request. Another approach is to use response from /stats and use the data directly in this component, without updating Vuex, but that would leave the store with old data. That approach would be simpler, but I believe that having all updated data in one place is the better practise

      if (newValue) {
        this.$store.dispatch("updateLogs", "Fetching stats...");
        const currentLink = this.$store.getters.currentLink;

        try {
          const res = await axios.get(currentLink + "/stats?limit=200");
          this.$store.dispatch("updateLogs", "Stats fetched successfully");
          const rollData = res.data.map((roll) => {
            return {
              result: roll.result === 37 ? "00" : roll.result.toString(), //slightly hard-coded I have to agree, but this is needed because /stats returns number "00" as 37, while /configuration returns "00". Conversion is done to later sort returned array from /stats by "results" in ascending order, equal to original array in Vuex. Otherwise indexes don't match.
              hits: roll.count,
            };
          });

          const rollDataSortedByResult = rollData.sort(
            (a, b) => a.result - b.result
          );

          const originalNumsSortedByResult =
            this.$store.getters.rouletteNumbersData
              .slice()
              .sort((a, b) => a.result - b.result);

          const updatedRouletteNumbersData = originalNumsSortedByResult.map(
            (num, i) => {
              return {
                result: num.result,
                hits: rollDataSortedByResult[i].hits,
                color: num.color,
                position: num.position,
              };
            }
          );

          this.$store.dispatch(
            "updateRouletteNumbersData",
            updatedRouletteNumbersData
          );
          this.updateStats();
        } catch (e) {
          this.$store.dispatch("updateLogs", "Failed to fetch stats");
          this.$store.dispatch("toggleReload");
        }
      }
    },

    dataIsReady(newValue) {
      if (newValue) {
        this.updateStats();
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
