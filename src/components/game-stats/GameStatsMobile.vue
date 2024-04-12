<template>
  <div class="toggleStats__container">
    <button
      class="toggleStats__container--button"
      @click="toggleStatsVisibility"
    >
      {{ buttonCaption }}
    </button>
  </div>
  <div v-if="showStats" class="gameStatsContent">
    <div class="legend">
      <h3>Slots</h3>
      <h3>Hits</h3>
    </div>
    <div class="slotsContainer">
      <div class="slotsContainer__title slotsContainer__title--cold">
        <p>C</p>
        <p>O</p>
        <p>L</p>
        <p>D</p>
      </div>
      <div class="slotsContainer__numbers">
        <div class="slotsContainer__slots">
          <p
            v-for="(slot, index) in coldSlots"
            class="slotsContainer__slot"
            :style="{ backgroundColor: slot.color }"
            :key="`cold-${slot.result}-${index}`"
          >
            {{ slot.result }}
          </p>
        </div>
        <div class="slotsContainer__hits">
          <p
            v-for="(slot, index) in coldSlots"
            class="slotsContainer__hit"
            :key="`cold-${slot.result}-${index}`"
          >
            {{ slot.hits }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="renderMode === 'mobile'" class="slotsContainer">
      <div class="slotsContainer__title slotsContainer__title--neutral">
        <p>N</p>
        <p>E</p>
        <p>U</p>
        <p>T</p>
        <p>R</p>
        <p>A</p>
        <p>L</p>
      </div>
      <div class="slotsContainer__numbers">
        <div class="slotsContainer__slots">
          <p
            v-for="(slot, index) in neutralSlots"
            class="slotsContainer__slot"
            :style="{ backgroundColor: slot.color }"
            :key="`neutral-${slot.result}-${index}`"
          >
            {{ slot.result }}
          </p>
        </div>
        <div class="slotsContainer__hits">
          <p
            v-for="(slot, index) in neutralSlots"
            class="slotsContainer__hit"
            :key="`neutral-${slot.result}-${index}`"
          >
            {{ slot.hits }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="renderMode === 'tablet'" class="slotsContainer">
      <div class="slotsContainer__title slotsContainer__title--neutral">
        <p>N</p>
        <p>E</p>
        <p>U</p>
        <p>T</p>
        <p>R</p>
        <p>A</p>
        <p>L</p>
      </div>
      <div class="slotsContainer__numbers">
        <div class="slotsContainer__slots">
          <p
            v-for="(slot, index) in firstHalfNeutralSlots"
            class="slotsContainer__slot"
            :style="{ backgroundColor: slot.color }"
            :key="`neutral-${slot.result}-${index}`"
          >
            {{ slot.result }}
          </p>
        </div>
        <div class="slotsContainer__hits">
          <p
            v-for="(slot, index) in firstHalfNeutralSlots"
            class="slotsContainer__hit"
            :key="`neutral-${slot.result}-${index}`"
          >
            {{ slot.hits }}
          </p>
        </div>

        <div class="slotsContainer__slots">
          <p
            v-for="(slot, index) in secondHalfNeutralSlots"
            class="slotsContainer__slot"
            :style="{ backgroundColor: slot.color }"
            :key="`neutral-${slot.result}-${index}`"
          >
            {{ slot.result }}
          </p>
        </div>
        <div class="slotsContainer__hits">
          <p
            v-for="(slot, index) in secondHalfNeutralSlots"
            class="slotsContainer__hit"
            :key="`neutral-${slot.result}-${index}`"
          >
            {{ slot.hits }}
          </p>
        </div>

        <div class="slotsContainer__slots">
          <p
            v-for="(slot, index) in thirdHalfNeutralSlots"
            class="slotsContainer__slot"
            :style="{ backgroundColor: slot.color }"
            :key="`neutral-${slot.result}-${index}`"
          >
            {{ slot.result }}
          </p>
        </div>
        <div class="slotsContainer__hits">
          <p
            v-for="(slot, index) in thirdHalfNeutralSlots"
            class="slotsContainer__hit"
            :key="`neutral-${slot.result}-${index}`"
          >
            {{ slot.hits }}
          </p>
        </div>
      </div>
    </div>

    <div class="slotsContainer">
      <div class="slotsContainer__title slotsContainer__title--hot">
        <p>H</p>
        <p>O</p>
        <p>T</p>
      </div>
      <div class="slotsContainer__numbers">
        <div class="slotsContainer__slots">
          <p
            v-for="(slot, index) in hotSlots"
            class="slotsContainer__slot"
            :style="{ backgroundColor: slot.color }"
            :key="`hot-${slot.result}-${index}`"
          >
            {{ slot.result }}
          </p>
        </div>
        <div class="slotsContainer__hits">
          <p
            v-for="(slot, index) in hotSlots"
            class="slotsContainer__hit"
            :key="`hot-${slot.result}-${index}`"
          >
            {{ slot.hits }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showStats: false,
    };
  },

  methods: {
    toggleStatsVisibility() {
      this.showStats = !this.showStats;
    },
  },

  computed: {
    buttonCaption() {
      return this.showStats ? "Hide statistics" : "Show statistics";
    },

    renderMode() {
      return this.$store.getters.screenSize >= 768 ? "tablet" : "mobile";
    },

    arrLength() {
      return this.neutralSlots.length;
    },

    firstHalfNeutralSlots() {
      return this.neutralSlots.slice(0, this.arrLength / 3);
    },

    secondHalfNeutralSlots() {
      return this.neutralSlots.slice(
        this.arrLength / 3,
        (this.arrLength / 3) * 2
      );
    },

    thirdHalfNeutralSlots() {
      return this.neutralSlots.slice((this.arrLength / 3) * 2);
    },
  },
  props: ["coldSlots", "neutralSlots", "hotSlots"],
};
</script>

<style scoped>
.gameStatsContent {
  margin-bottom: 1rem;
}
.legend {
  display: flex;
  justify-content: space-around;
  width: calc(100% - 6rem);
  padding: 1rem 3rem;
}

.slotsContainer,
.slotsContainer__numbers {
  display: flex;
}

.slotsContainer__numbers {
  justify-content: space-around;
  width: calc(100% - 6rem);
  padding-right: 3rem;
}

.slotsContainer__title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  width: 3rem;
}

.slotsContainer__title--cold {
  background-color: rgb(191, 218, 225);
}

.slotsContainer__title--neutral {
  background-color: rgb(239, 232, 232);
}

.slotsContainer__title--hot {
  background-color: rgb(239, 150, 150);
}

.slotsContainer__slot,
.slotsContainer__hit {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: 3rem;
  border-radius: 2rem;
}

.slotsContainer__slot {
  color: white;
}

.slotsContainer__hit {
  background-color: rgb(203, 196, 196);
}

.toggleStats__container {
  display: flex;
  justify-content: center;
  margin: 2rem auto;
}

.toggleStats__container--button {
  background: linear-gradient(145deg, #6e8efb, #88a2f9);
  border: none;
  border-radius: 30px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 10px 20px;
  text-align: center;
  transition: background 0.3s, box-shadow 0.3s;
}

.toggleStats__container--button:hover {
  background: linear-gradient(145deg, #88a2f9, #6e8efb);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.toggleStats__container--button:active {
  background: linear-gradient(145deg, #88a2f9, #6e8efb);
  box-shadow: inset 0 4px 15px rgba(0, 0, 0, 0.2);
}

@media (min-width: 768px) {
  .legend {
    display: none;
  }

  .slotsContainer__numbers {
    flex-direction: column;
    justify-content: space-evenly;
  }

  .slotsContainer__slots,
  .slotsContainer__hits {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slotsContainer__slot,
  .slotsContainer__hit {
    margin: 0 0.5rem;
  }
}
</style>
