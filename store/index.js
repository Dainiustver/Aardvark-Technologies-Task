import { createStore } from "vuex";
// import axios from "axios";

export default createStore({
  state() {
    return {
      rouletteNumbers: [],
      currentLink: "https://dev-games-backend.advbet.com/v1/ab-roulette/1",
      lastGameWinner: null,
      logs: [],
    };
  },
  mutations: {
    fillNumbers(state, numArray) {
      state.rouletteNumbers.push(...numArray);
    },
    setGameWinner(state, gameWinner) {
      state.lastGameWinner = gameWinner;
    },
    setLink(state, link) {
      state.currentLink = link;
    },
    updateLogs(state, log) {
      state.logs.unshift(log);
    },
  },
  actions: {
    fillNumbers(context, numArray) {
      context.commit("fillNumbers", numArray);
    },
    setGameWinner(context, gameWinner) {
      context.commit("setGameWinner", +gameWinner);
    },
    setLink(context, link) {
      context.commit("setLink", link);
    },
    updateLogs(context, log) {
      let currentDateTime = new Date().toLocaleString("lt-LT");
      context.commit("updateLogs", currentDateTime + " " + log);
    },
  },
  getters: {
    rouletteNumbers(state) {
      return state.rouletteNumbers;
    },
    lastGameWinner(state) {
      return state.lastGameWinner;
    },
    logs(state) {
      return state.logs;
    },
  },
});
