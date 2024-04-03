import axios from "axios";

export default {
  state() {
    return {
      rouletteNumbersData: [],
      dataIsFetched: false,
    };
  },

  mutations: {
    updateHits(state, payload) {
      state.rouletteNumbersData = payload;
    },

    updateConfig(state, payload) {
      state.rouletteNumbersData = payload;
    },

    setFetchingStatus(state, payload) {
      state.dataIsFetched = payload;
    },
  },

  actions: {
    async fetchHits(context) {
      context.dispatch("updateLogs", "Fetching stats...");
      const currentLink = context.getters.currentLink;
      context.commit("setFetchingStatus", false);

      try {
        const res = await axios.get(currentLink + "/stats?limit=200"); //
        context.dispatch("updateLogs", "Stats fetched successfully");
        const rollData = res.data.map((roll) => {
          return { result: roll.result, hits: roll.count };
        });
        context.commit("updateHits", rollData);
      } catch (e) {
        context.dispatch("updateLogs", "Failed to fetch stats");
        context.dispatch("toggleReload");
      }
    },

    async fetchConfig(context) {
      context.dispatch("updateLogs", "Fetching game configuration...");
      const currentLink = context.getters.currentLink;

      try {
        const res = await axios.get(currentLink + "/configuration");
        context.dispatch("updateLogs", "Configuration fetched successfully");
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
        context.commit("updateConfig", updatedNumArray);
        context.commit("setFetchingStatus", true);
      } catch (e) {
        context.dispatch("updateLogs", "Failed to fetch configuration");
        context.dispatch("toggleReload");
      }
    },

    async init({ dispatch }) {
      await dispatch("fetchHits");
      await dispatch("fetchConfig");
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
