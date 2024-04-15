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
      return this.$store.state.logs;
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
  max-height: 22rem;
  padding: 0 1rem;
  overflow-y: auto;
}
</style>
