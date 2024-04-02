<template>
  <div class="gameBoard">
    <header>
      <h2>Gameboard</h2>
    </header>
    <div class="roulette">
      <button
        class="roulette__number"
        v-for="(number, index) in rouletteNumbers"
        :key="index"
        :style="getPositionStyle(index)"
        :class="{ roulette__winner: checkWinner(number) }"
      >
        {{ number }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      rouletteNumbers: [],
      rouletteColors: [],
      winner: null,
    };
  },
  methods: {
    //Positioning roulette numbers in a circle, giving them white color and required background color
    getPositionStyle(index) {
      const totalNumbers = this.rouletteNumbers.length;
      const angle = (index / totalNumbers) * (2 * Math.PI);

      const buttonSize = 40;
      const rouletteSize = 380;
      const radius = (rouletteSize - buttonSize) / 2 - 5;

      const x = radius * Math.cos(angle) + rouletteSize / 2; //idk, some ChatGPT magic right here lol
      const y = radius * Math.sin(angle) + rouletteSize / 2;

      return {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
        color: "white",
        backgroundColor: `${this.rouletteColors[index]}`,
      };
    },

    setWinner(num) {
      this.winner = +num;
      setTimeout(() => {
        this.winner = null;
      }, 16000);
    },

    checkWinner(num) {
      return this.winner === num;
    },
  },

  computed: {
    fetchWinner() {
      return +this.$store.getters.lastGameWinner;
    },

    currentLink() {
      return this.$store.getters.currentLink;
    },
  },

  watch: {
    fetchWinner(newValue) {
      if (newValue) this.setWinner(newValue);
    },
  },

  async mounted() {
    this.$store.dispatch("updateLogs", "Fetching color configuration...");
    try {
      const res = await axios.get(this.currentLink + "/configuration");
      this.$store.dispatch("fillNumbers", res.data.results);
      this.rouletteNumbers = res.data.positionToId;
      this.rouletteColors = res.data.colors;
    } catch (e) {
      this.$store.dispatch("updateLogs", "Fetching failed! Retrying...");
      console.log(e);
    }
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
  width: 40px; /* Adjust size as needed */
  height: 40px; /* Adjust size as needed */
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff; /* Adjust colors as needed */
  color: #000; /* Adjust colors as needed */
  font-size: 14px; /* Adjust text size as needed */
  cursor: pointer;
  transform: translate(-50%, -50%); /* Center the numbers */
}

@keyframes flashAnimation {
  0%,
  100% {
    background-color: #ff0;
    color: #000;
  } /* Flash color */
  50% {
    background-color: #000;
    color: #ff0;
  } /* Original color */
}

.roulette__winner {
  animation: flashAnimation 3s infinite; /* Adjust timing as needed */
  font-weight: bold; /* Optional: Makes the text bold */
}
</style>
