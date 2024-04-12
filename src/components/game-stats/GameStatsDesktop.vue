<template>
  <div class="stats">
    <div class="stats__legend">
      <div class="stats__label stats__legend-spacer"></div>
      <div class="stats__label">Slot</div>
      <div class="stats__label">Hits</div>
    </div>
    <div class="stats__section stats__section--cold">
      <div class="stats__section-title">Cold</div>
      <div class="stats__slots">
        <div
          class="stats__slot"
          :style="{ backgroundColor: slot.color }"
          v-for="(slot, index) in coldSlots"
          :key="`cold-${slot.result}-${index}`"
        >
          {{ slot.result }}
        </div>
      </div>
      <div class="stats__hits">
        <div
          class="stats__hit"
          v-for="(slot, index) in coldSlots"
          :key="`cold-hit-${slot.result}-${index}`"
        >
          {{ slot.hits }}
        </div>
      </div>
    </div>
    <div class="stats__section stats__section--neutral">
      <div class="stats__section-title">Neutral</div>
      <div class="stats__slots">
        <div
          class="stats__slot"
          :style="{ backgroundColor: slot.color }"
          v-for="(slot, index) in neutralSlots"
          :key="`neutral-${slot.result}-${index}`"
        >
          {{ slot.result }}
        </div>
      </div>
      <div class="stats__hits">
        <div
          class="stats__hit"
          v-for="(slot, index) in neutralSlots"
          :key="`neutral-hit-${slot.result}-${index}`"
        >
          {{ slot.hits }}
        </div>
      </div>
    </div>
    <div class="stats__section stats__section--hot">
      <div class="stats__section-title">Hot</div>
      <div class="stats__slots">
        <div
          class="stats__slot"
          :style="{ backgroundColor: slot.color }"
          v-for="(slot, index) in hotSlots"
          :key="`hot-${slot.result}-${index}`"
        >
          {{ slot.result }}
        </div>
      </div>
      <div class="stats__hits">
        <div
          class="stats__hit"
          v-for="(slot, index) in hotSlots"
          :key="`hot-hit-${slot.result}-${index}`"
        >
          {{ slot.hits }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["coldSlots", "neutralSlots", "hotSlots"],
};
</script>

<style scoped>
.stats {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.stats__legend {
  display: none;
}

.stats__label {
  display: flex;
  align-items: center;
  text-align: center;
  font-weight: bold;
  height: 3rem;
  margin-top: 0.1rem;
  padding-right: 1rem;
}

.stats__slots,
.stats__hits {
  display: flex;
  height: 3rem;
}

.stats__slot,
.stats__hit {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  width: 2rem;
}

.stats__slot {
  color: white;
}

.stats__section-title {
  text-align: center;
  font-weight: bold;
  padding: 1rem;
}

.stats__section--cold {
  background-color: rgb(191, 218, 225);
}

.stats__section--neutral {
  background-color: rgb(239, 232, 232);
}

.stats__section--hot {
  background-color: rgb(239, 150, 150);
}

@media (min-width: 1300px) {
  .stats__legend {
    display: flex;
    flex-direction: column;
  }
}

@media (min-width: 1500px) {
  .stats__slot,
  .stats__hit {
    width: 2.3rem;
  }
}

@media (min-width: 1800px) {
  .stats__slot,
  .stats__hit {
    width: 2.5rem;
  }
}
</style>
