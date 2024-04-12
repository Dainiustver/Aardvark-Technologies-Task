<template>
  <div class="log__container">
    <header>
      <h2>Logs</h2>
    </header>
    <ul>
      <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    logs() {
      return this.$store.getters.logs;
    },
  },
};
</script>

<style scoped>
.log__container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

ul {
  /* max-height: 25rem; */
  padding-right: 1.5rem;
  overflow-y: auto;
}
</style>
