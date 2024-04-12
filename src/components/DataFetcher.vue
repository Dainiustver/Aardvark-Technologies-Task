<template>
  <div
    :class="{ formField__container: true, 'tooltip-container': inputStatus }"
  >
    <span class="tooltip-content" v-if="inputStatus"
      >Input disabled while fetching data</span
    >
    <label for="apiBaseUrlInput">API Base URL</label>
    <input
      type="text"
      id="apiBaseUrlInput"
      v-model="baseAPI"
      :disabled="inputStatus"
    />
  </div>
  <div v-if="failedToFetch">
    <p class="errorMessage">
      Unfortunately something went wrong. Please check your internet connection
      and URL above. Automatically reloading in {{ retryingInCounter }}. Attempt
      {{ retryCounter }}/100
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseAPI: "https://dev-games-backend.advbet.com/v1/ab-roulette/1",
      retryingInInterval: null,
      retryingInCounter: 10,
      retryCounter: 1,
      failedToFetch: false,
    };
  },

  mounted() {
    //Setting up debounced setLink method. More info about this in the lower comment
    this.debouncedSetLink = this.debounce((newValue) => {
      this.$store.dispatch("setLink", newValue);
    }, 1000);
  },

  methods: {
    debounce(func, delay) {
      //Ensuring that requests are only sent after user is done typing the url. In this case the request is sent after 1 second of inactivity in URL input field. This prevents excessive API calls and potentially disrupting performance of the application by sending requests after every keystroke
      let timeoutId = null;

      return function (...args) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          func(...args);
        }, delay);
      };
    },
  },

  computed: {
    reloadTimerStarted() {
      return this.$store.getters.reloadTimerStarted;
    },

    inputStatus() {
      return this.$store.getters.inputStatus;
    },

    dataIsReady() {
      return this.$store.getters.dataIsFetched;
    },
  },

  watch: {
    baseAPI(newValue) {
      if (newValue) {
        this.debouncedSetLink(newValue);
      }
    },

    reloadTimerStarted(newValue) {
      if (!newValue) {
        return;
      }

      //This method fires if for some reason axios fails to fetch data from backend. Most likely network issues or wrong URL. The method is responsible for retrying to render the App
      this.failedToFetch = true;
      clearInterval(this.retryingInInterval);
      this.retryingInInterval = null;
      this.$store.dispatch("setLink", null); //Setting currentLink to null, because the App relies on watchers in several components, which watch the current link and fire when it is changed. If it was not set to null before reseting to the one in input field, currentLink would not change in vuex and watchers would not fire, breaking the retry mechanism

      this.retryingInInterval = setInterval(() => {
        if (this.dataIsReady) {
          this.retryingInCounter = 10;
          this.failedToFetch = false;
          clearInterval(this.retryingInInterval);
          this.retryingInInterval = null;
          return;
        }

        if (this.retryingInCounter <= 1) {
          this.retryCounter++;
          this.retryingInCounter = 10;
          this.failedToFetch = false;
          clearInterval(this.retryingInInterval);
          this.retryingInInterval = null;
          this.$store.dispatch("updateLogs", "Retrying...");
          this.$store.dispatch("setLink", this.baseAPI);
        } else {
          this.retryingInCounter--;
          this.$store.dispatch(
            "updateLogs",
            `Fetching failed. Retrying in ${this.retryingInCounter}`
          );
        }
      }, 1000);
    },

    retryCounter(newValue) {
      //Reloading the App if 100 unsuccessful attempts to reconnect were made
      if (newValue >= 101) {
        window.location.reload();
      }
    },

    dataIsReady(newValue) {
      if (newValue) {
        this.retryCounter = 1;
      }
    },
  },
};
</script>

<style scoped>
.formField__container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.formField__container input {
  margin: 2rem;
  padding: 1rem;
  width: 75%;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.formField__container input:focus {
  outline: none;
  border-color: #007bff;
}

.tooltip-container {
  position: relative;
}

.tooltip-content {
  position: absolute;
  visibility: hidden;
  width: 10rem;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  z-index: 1;
  bottom: 6rem;
  opacity: 0;
  transition: opacity 0.6s;
}

.tooltip-container:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
}

.errorMessage {
  margin: 0 0 3rem;
  padding: 0 1rem;
  color: red;
  text-align: center;
  font-weight: bold;
}

@media (min-width: 768px) {
  .formField__container input {
    width: 50%;
  }
}

@media (min-width: 1200px) {
  .formField__container input {
    width: 30%;
  }
}
</style>
