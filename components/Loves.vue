<template>
  <div class="particle" :style="{ animationDelay: `${duration}s` }">
    <div
      class="falling-warper"
      v-for="x in 25"
      :key="x"
      :style="getRandomStyle()"
    >
      <svg
        class="love"
        viewBox="0 0 32 29.6"
        :style="{ fill: `#f${getRandomInt(0, 9)}${getRandomInt(0, 9)}` }"
      >
        <path
          d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
	c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    duration: {
      default: 5,
      type: Number,
    },
  },
  mounted() {
    this.timer = setTimeout(() => {
      this.$emit("time-up");
    }, this.duration * 1000 + 1500);
  },
  methods: {
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    },
    getRandomStyle() {
      return {
        width: `${3 * Math.random() + 1}rem`,
        left: `${100 * Math.random()}%`,
        animationDelay: `${Math.random()}s`,
        animationDuration: `${Math.random() + 1}s`,
        fill: `hsl(12, 20, 50)`,
        opacity: `${Math.random() * 0.5 + 0.5}`,
      };
    },
    endMe() {},
  },
  destroyed() {
    clearTimeout(this.timer);
  },
};
</script>

<style lang='scss' scoped>
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes fallings {
  @for $i from 1 through 10 {
    #{$i * 10%} {
      transform: translateY($i * $i * 1.2vh - 5vh);
    }
  }
}

.particle {
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background: red;
  z-index: 10000;
  pointer-events: none;
  animation: fade-out 1.5s linear forwards;
  > .falling-warper {
    position: absolute;
    top: -13vh;
    left: 30%;
    margin: 2rem;
    width: 5rem;
    height: 5rem;
    > .love {
      fill: red;
      // animation: fallings 1s infinite linear, pulse 2s infinite linear;
      animation: pulse 0.5s infinite;
    }
    animation: fallings 1s infinite linear;
  }
}
</style>