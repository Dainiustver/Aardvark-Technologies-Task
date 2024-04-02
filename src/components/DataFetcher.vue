<template>
  <div class="formField__container">
    <label for="apiBaseUrlInput">API Base URL</label>
    <input type="text" id="apiBaseUrlInput" v-model="baseAPI" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseAPI: "https://dev-games-backend.advbet.com/v1/ab-roulette/1",
    };
  },

  created() {
    this.debouncedSetLink = this.debounce((newValue) => {
      this.$store.dispatch("setLink", newValue);
    }, 1000);
  },

  methods: {
    debounce(func, delay) {
      let timeoutId = null;
      return function (...args) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
        }, delay);
      };
    },
  },

  watch: {
    baseAPI(newValue) {
      if (newValue) {
        this.debouncedSetLink(newValue);
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
</style>
