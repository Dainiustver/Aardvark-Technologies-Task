import { createStore } from "vuex";
import requests from "./requests";

export default createStore({
  modules: {
    requests,
  },
  state() {
    return {
      currentLink: "https://dev-games-backend.advbet.com/v1/ab-roulette/1",
      lastGameWinner: null,
      logs: [],
      reloadNeeded: false,
      reloadTimerStarted: false,
    };
  },
  mutations: {
    setGameWinner(state, gameWinner) {
      state.lastGameWinner = gameWinner;
    },
    setLink(state, link) {
      state.currentLink = link;
    },
    updateLogs(state, log) {
      state.logs.unshift(log);
    },
    toggleReload(state) {
      state.reloadNeeded = true;
    },
    startReloadTimer(state) {
      state.reloadTimerStarted = true;
    },
  },
  actions: {
    setGameWinner(context, gameWinner) {
      context.commit("setGameWinner", gameWinner);
    },
    setLink(context, link) {
      context.commit("setLink", link);
    },
    updateLogs(context, log) {
      let currentDateTime = new Date().toLocaleString("lt-LT");
      context.commit("updateLogs", currentDateTime + " " + log);
    },
    toggleReload(context) {
      context.commit("startReloadTimer");
      setTimeout(() => {
        context.commit("toggleReload");
      }, 10000);
    },
  },
  getters: {
    rouletteNumbers(state) {
      return state.rouletteNumbers;
    },
    lastGameWinner(state) {
      return state.lastGameWinner;
    },
    currentLink(state) {
      return state.currentLink;
    },
    logs(state) {
      return state.logs;
    },
    reloadNeeded(state) {
      return state.reloadNeeded;
    },
    reloadTimerStarted(state) {
      return state.reloadTimerStarted;
    },
  },
});
