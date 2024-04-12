<template>
  <header>
    <h2 class="stats__header">Stats (last 200)</h2>
  </header>
  <component
    :is="statsBasedOnWidth"
    :key="statsBasedOnWidth"
    :coldSlots="coldSlots"
    :neutralSlots="neutralSlots"
    :hotSlots="hotSlots"
  ></component>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import GameStatsDesktop from "./GameStatsDesktop.vue";
import GameStatsMobile from "./GameStatsMobile.vue";

export default {
  data() {
    return {
      allSlots: [],
      statsBasedOnWidth: null,
    };
  },
  methods: {
    updateStats() {
      const rouletteNumbersSorted = this.sortByHits(
        this.$store.state.requests.rouletteNumbersData.slice()
      );

      this.allSlots = rouletteNumbersSorted;

      if (this.statsBasedOnWidth !== null) {
        return;
      }

      this.adjustStatsDesign();
    },

    sortByHits(arr) {
      return arr.sort((a, b) => {
        if (a.hits !== b.hits) return a.hits - b.hits; //Sorting in ascending order if numbers don't have the same amount of hits

        if (a.result === "00") return 1; //Keeping "00" at the end of numbers with the same amount of hits, as shown in the demo
        if (b.result === "00") return -1;

        return 0; //If hits match and there is no "00" in the comparison, keep default sorting settings
      });
    },

    adjustStatsDesign(screenSize) {
      this.statsBasedOnWidth =
        screenSize <= 1210 ? "GameStatsMobile" : "GameStatsDesktop";
    },
  },

  computed: {
    ...mapState({
      dataIsReady: (state) => state.requests.dataIsFetched,
      newWinner: "lastGameWinner",
      screenSize: "screenSize",
    }),

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
        const currentLink = this.$store.state.currentLink;

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
            this.$store.state.requests.rouletteNumbersData
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

    screenSize(screenSize) {
      this.adjustStatsDesign(screenSize);
    },
  },

  components: {
    GameStatsDesktop,
    GameStatsMobile,
  },
};
</script>

<style scoped>
.stats__header {
  text-align: center;
}
</style>
