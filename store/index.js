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
      reloadTimerStarted: false,
      inputStatus: false,
    };
  },

  mutations: {
    setGameWinner(state, gameWinner) {
      state.lastGameWinner = gameWinner;
    },

    setLink(state, link) {
      state.currentLink = link;
      state.reloadTimerStarted = false;
      state.lastGameWinner = null;
    },

    updateLogs(state, log) {
      state.logs.unshift(log);
    },

    toggleReload(state) {
      state.reloadTimerStarted = true;
    },

    toggleInput(state, payload) {
      state.inputStatus = payload;
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
      context.commit("toggleReload");
    },

    toggleInput(context, payload) {
      context.commit("toggleInput", payload);
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

    reloadTimerStarted(state) {
      return state.reloadTimerStarted;
    },

    inputStatus(state) {
      return state.inputStatus;
    },
  },
});
