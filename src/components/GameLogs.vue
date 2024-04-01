<template>
  <div class="log__container">
    <header>
      <h2>Logs</h2>
    </header>
    <ul>
      <li v-for="log in logs" :key="log">{{ log }}</li>
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
  width: 25rem;
  margin: 1rem 0;
}
</style>
