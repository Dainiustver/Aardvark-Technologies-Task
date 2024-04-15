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
      screenSize: null,
      reloadTimerStarted: false,
      inputStatus: false,
      isSpinning: false,
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

    checkScreenSize(state, screenSize) {
      state.screenSize = screenSize;
    },

    toggleReload(state) {
      state.reloadTimerStarted = true;
    },

    toggleInput(state, payload) {
      state.inputStatus = payload;
    },

    toggleSpin(state, newValue) {
      state.isSpinning = newValue;
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

    checkScreenSize(context, screenSize) {
      context.commit("checkScreenSize", screenSize);
    },

    toggleReload(context) {
      context.commit("toggleReload");
    },

    toggleInput(context, payload) {
      context.commit("toggleInput", payload);
    },

    toggleSpin(context, newValue) {
      context.commit("toggleSpin", newValue);
    },
  },
});
