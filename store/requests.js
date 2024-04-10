import axios from "axios";

export default {
  state() {
    return {
      rouletteNumbersData: [],
      dataIsFetched: false,
    };
  },

  mutations: {
    updateRouletteNumbersData(state, payload) {
      state.rouletteNumbersData = payload;
    },

    setFetchingStatus(state, payload) {
      state.dataIsFetched = payload;
    },
  },

  actions: {
    async fetchHits(context) {
      context.dispatch("updateLogs", "Fetching stats...");
      context.dispatch("setFetchingStatus", false);
      const currentLink = context.getters.currentLink;

      try {
        const res = await axios.get(currentLink + "/stats?limit=200");
        context.dispatch("updateLogs", "Stats fetched successfully");
        const rollData = res.data.map((roll) => {
          return { result: roll.result, hits: roll.count };
        });
        context.commit("updateRouletteNumbersData", rollData);
      } catch (e) {
        context.dispatch("updateLogs", "Failed to fetch stats");
        context.dispatch("toggleReload");
      }
    },

    async fetchConfig(context) {
      if (!context.getters.rouletteNumbersData.length > 0) {
        throw new Error("failed to fetch /stats");
      }

      context.dispatch("updateLogs", "Fetching game configuration...");
      const currentLink = context.getters.currentLink;

      try {
        const res = await axios.get(currentLink + "/configuration");
        const config = res.data;
        const numArrayCopy = context.getters.rouletteNumbersData.slice();
        numArrayCopy.sort((a, b) => a.result - b.result);
        const updatedNumArray = numArrayCopy.map((num, i) => {
          return {
            result: config.results[i],
            hits: num.hits,
            color: config.colors[i],
            position: config.positionToId.findIndex(
              (position) => position === num.result
            ),
          };
        });
        context.commit("updateRouletteNumbersData", updatedNumArray);
        context.dispatch("updateLogs", "Configuration fetched successfully");
        context.dispatch("setFetchingStatus", true);
      } catch (e) {
        context.dispatch("updateLogs", "Failed to fetch configuration");
        context.dispatch("toggleReload");
      }
    },

    async init({ dispatch }) {
      await dispatch("fetchHits");
      await dispatch("fetchConfig");
    },

    setFetchingStatus(context, payload) {
      context.commit("setFetchingStatus", payload);
    },

    updateRouletteNumbersData(context, payload) {
      context.commit("updateRouletteNumbersData", payload);
    },
  },

  getters: {
    rouletteNumbersData(state) {
      return state.rouletteNumbersData;
    },

    dataIsFetched(state) {
      return state.dataIsFetched;
    },
  },
};
