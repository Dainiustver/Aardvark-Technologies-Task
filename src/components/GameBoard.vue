<template>
  <div class="gameBoard">
    <header>
      <h2>Gameboard</h2>
    </header>
    <div class="roulette">
      <button
        class="roulette__number"
        v-for="(slot, index) in rouletteNumbersData"
        :key="index"
        :style="getPositionStyle(index)"
        :class="{ roulette__winner: checkWinner(slot.result) }"
      >
        {{ slot.result }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rouletteNumbersData: [],
      winner: null,
    };
  },
  methods: {
    //Positioning roulette numbers in a circle, giving them white color and required background color
    getPositionStyle(index) {
      const totalNumbers = this.rouletteNumbersData.length;
      const angle = (index / totalNumbers) * (2 * Math.PI) - Math.PI / 2;

      const buttonSize = 40;
      const rouletteSize = 380;
      const radius = (rouletteSize - buttonSize) / 2 - 5;

      const x = radius * Math.cos(angle) + rouletteSize / 2;
      const y = radius * Math.sin(angle) + rouletteSize / 2;

      return {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
        color: "white",
        "--original-bg-color": this.rouletteNumbersData[index].color,
        backgroundColor: `${this.rouletteNumbersData[index].color}`,
      };
    },

    updateBoard() {
      const numArrayClone = this.$store.getters.rouletteNumbersData.slice();
      const numArraySorted = numArrayClone.sort(
        (a, b) => a.position - b.position
      );
      this.rouletteNumbersData = numArraySorted;
    },

    setWinner(num) {
      this.winner = num;
      setTimeout(() => {
        this.winner = null;
      }, 15000);
    },

    checkWinner(num) {
      return this.winner === num;
    },
  },

  computed: {
    dataIsReady() {
      return this.$store.getters.dataIsFetched;
    },

    fetchWinner() {
      return this.$store.getters.lastGameWinner;
    },
  },

  watch: {
    dataIsReady: {
      handler(newValue) {
        if (newValue) this.updateBoard();
      },
      immediate: true,
    },

    fetchWinner(newValue) {
      if (newValue) {
        this.setWinner(newValue);
      }
    },
  },
};
</script>

<style scoped>
.gameBoard {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 25rem;
  margin: 1rem 0 3rem;
}
.roulette {
  position: relative;
  width: 380px;
  height: 380px;
  margin-top: 1rem;
  border-radius: 50%;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}

.roulette__number {
  position: absolute;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  color: #000;
  font-size: 14px;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

@keyframes flashAnimation {
  0%,
  100% {
    background-color: var(--original-bg-color);
  }
  50% {
    background-color: rgb(14, 86, 243);
  }
}

.roulette__winner {
  animation: flashAnimation 3s infinite;
}
</style>
