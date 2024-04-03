<template>
  <div class="formField__container">
    <label for="apiBaseUrlInput">API Base URL</label>
    <input type="text" id="apiBaseUrlInput" v-model="baseAPI" />
  </div>
  <div v-if="reloadTimerStarted">
    <p class="errorMessage">
      Unfortunately something went wrong. Please check your internet connection
      and URL above. Automatically reloading in {{ retryingInCounter }}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseAPI: "https://dev-games-backend.advbet.com/v1/ab-roulette/1",
      fetchSuccessful: true,
      retryingInCounter: 10,
    };
  },

  mounted() {
    this.debouncedSetLink = this.debounce((newValue) => {
      this.$store.dispatch("setLink", newValue);
    }, 1000);
  },

  methods: {
    debounce(func, delay) {
      //Ensuring that requests are only sent after user is done typing the url. In this case the request is sent after 1 second of inactivity in URL input field. This prevents excessive API calls and potentially disrupting performance of the application by sending requests after every keystroke.
      let timeoutId = null;
      return function (...args) {
        if (timeoutId) clearTimeout(timeoutId);
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
  },

  watch: {
    baseAPI(newValue) {
      if (newValue) {
        this.debouncedSetLink(newValue);
      }
    },

    reloadTimerStarted(newValue) {
      if (newValue) {
        setInterval(() => {
          this.retryingInCounter -= 1;
        }, 1000);
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
  margin: 3rem auto;
  max-width: 50%;
}

.formField__container input {
  margin: 2rem;
  padding: 1rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.formField__container input:focus {
  outline: none;
  border-color: #007bff;
}

.errorMessage {
  color: red;
  text-align: center;
  font-weight: bold;
  margin-bottom: 3rem;
}
</style>
