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
    //Positioning roulette numbers in a circle if device's width is large, otherwise rendering a table on the screen. Also giving the numbers white color and required background color regardless of device's width
    getPositionStyle(index) {
      if (this.screenSize <= 576) {
        return {
          position: "static",
          "--original-bg-color": this.rouletteNumbersData[index].color,
          backgroundColor: this.rouletteNumbersData[index].color,
        };
      }

      const totalNumbers = this.rouletteNumbersData.length;
      const angle = (index / totalNumbers) * (2 * Math.PI) - Math.PI / 2; //This is some ChatGPT magic

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
        "--original-bg-color": this.rouletteNumbersData[index].color,
        backgroundColor: this.rouletteNumbersData[index].color,
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

    screenSize() {
      return this.$store.getters.screenSize;
    },
  },

  watch: {
    dataIsReady(newValue) {
      if (newValue) {
        this.updateBoard();
      }
    },

    fetchWinner(newValue) {
      this.setWinner(newValue);
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
  width: 100%;
}

.roulette {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 380px;
  height: 380px;
  margin: 1rem;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.roulette__number {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 1px solid #ccc;
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

@media (max-width: 576px) {
  .roulette {
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>
