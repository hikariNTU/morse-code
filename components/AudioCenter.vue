<template>
  <div class="containter">
    <audio controls ref="audio" v-show="false">
      <source src="/chaser.mp3" type="audio/mpeg" />
      Audio Handler
    </audio>
    <div
      tabindex="0"
      :class="{ commander: true, on: show }"
      @keydown.prevent="keyCatcher"
    >
      <label>Key Catcher</label>
      <div>{{ text }}</div>
      <pre>{{ whichKey }}</pre>
    </div>
    <div class="indicator" :style="{ opacity: show ? 1 : 0 }" v-show="false">
      morse code
    </div>
    <!-- <div>{{ queue }}</div> -->
    <v-form class="elevation-2 rounded-lg pa-3">
      <v-checkbox label="play sound" v-model="playSound" />
      <v-slider
        v-model="baseTime"
        class="align-center"
        label="base time"
        :max="500"
        :min="5"
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model="baseTime"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 5em"
            suffix="ms"
          ></v-text-field>
        </template>
      </v-slider>
      <v-textarea label="Input" v-model="text" />
      <v-btn class="mx-5" @click.prevent="resumePlay">Resume</v-btn>
      <v-btn
        class="mx-5"
        type="submit"
        @click.prevent="playText"
        color="primary"
        >Translate</v-btn
      >
    </v-form>
    <div>
      <v-slider
        v-model="sqrtFreq"
        class="align-center"
        label="frequency"
        :max="10"
        :min="1"
        :step="0.00001"
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model="frequency"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 5em"
            suffix="Hz"
          ></v-text-field>
        </template>
      </v-slider>
    </div>
    <div class="code">{{ displayCode }}</div>
  </div>
</template>

<script>
import code from "~/assets/code-table.yml";
import AudioBuzzer from "~/assets/audio";
import { debounce } from "lodash";

const waitFor = (wait = 500) => {
  return new Promise((resolve) => {
    setTimeout(resolve, wait);
  });
};

export default {
  data() {
    return {
      au: null,
      audioCtxAvailable: true,
      text: "",
      show: false,
      playSound: true,
      baseTime: 50,
      frequency: 440,
      volume: 50,
      isRunning: {}, // storing running token for async calls
      whichKey: "",
    };
  },
  computed: {
    displayCode() {
      return this.text
        .toLowerCase()
        .split("")
        .map((char) => code[char])
        .filter((value) => value !== undefined)
        .join("|");
    },
    sqrtFreq: {
      get() {
        return this.frequency ** 0.25;
      },
      set(value) {
        this.frequency = Math.round(value ** 4);
      },
    },
  },
  watch: {
    frequency() {
      this.au.frequency = this.frequency;
    },
  },
  mounted() {
    this.createAudioContext();
  },

  methods: {
    async createAudioContext() {
      try {
        // Create an audio context for playing beeps
        this.au = new AudioBuzzer();
      } catch (e) {
        if (e instanceof TypeError) {
          this.audioCtxAvailable = false;
        } else {
          console.error("Unknow error occured when creating audio context.");
          throw e;
        }
      }
    },

    debouncedPlay: debounce(function () {
      this.playText();
    }, 500),

    keyCatcher(e) {
      // console.log(e);
      this.whichKey = e.key;
      switch (e.key) {
        case "Backspace":
          this.text = this.text.slice(0, -1);
          break;
        case "Enter":
          this.playText();
          break;
        case "Tab":
          e.srcElement.blur();
          break;
        case "Escape":
          const keyArr = Object.getOwnPropertySymbols(this.isRunning);
          console.log(this.isRunning);
          if (keyArr.length !== 0) {
            for (let key of keyArr) {
              this.isRunning[key] = false;
            }
          } else {
            document.activeElement.blur();
          }
          break;
        default:
          if (e.key.length === 1) {
            this.text += e.key;
            this.debouncedPlay();
          }
      }
    },

    async playInstance(interval = 1) {
      this.show = true;
      this.playSound && this.au.start();
      await waitFor(interval * this.baseTime);
      this.show = false;
      this.playSound && this.au.stop();
    },
    playText: async function () {
      // token lock
      const sym = Symbol("Playing Token");
      const isRunning = this.isRunning;
      for (const key of Object.getOwnPropertySymbols(isRunning)) {
        isRunning[key] = false;
      }
      isRunning[sym] = true;
      if (this.playSound) this.au.resumePlay();
      for (let c of this.displayCode.split("")) {
        if (!isRunning[sym]) {
          break;
        }
        switch (c) {
          case ".":
            await this.playInstance(1);
            break;
          case "_":
            await this.playInstance(3);
            break;
          case "|":
            this.show = false;
            await waitFor(this.baseTime);
            break;
          default:
            this.show = false;
        }
        this.show = false;
        await waitFor(this.baseTime);
      }
      // finish text token, clean up it
      delete isRunning[sym];
    },
  },
  destroyed() {
    this?.au?.destroyed();
  },
};
</script>

<style lang='scss' scoped>
%fc {
  display: flex;
  justify-content: center;
  align-items: center;
}

.containter {
  @media screen and(min-width: 960px) {
    padding: 3rem;
  }
  padding: 1rem;
}

.setting {
  border: solid #2222;
}

.commander {
  position: relative;
  width: fit-content;
  max-width: 70%;
  min-width: 10rem;
  min-height: 10rem;
  margin: 2rem auto;
  padding: 2.5rem 1rem;
  font-size: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  border: 0.2rem solid transparent;
  background-color: #2221;
  color: #666;
  user-select: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-all;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.1s, box-shadow 0.3s;
  // &.on {
  //   background-color: #2223;
  // }
  &:hover {
    border-color: #2222;
  }
  &:focus {
    border-color: #2222;
    box-shadow: 0 0 5px 2px #2222 inset;
    outline: none;
  }
  > label {
    position: absolute;
    top: 0.5rem;
    font-size: 0.5em;
    color: #888;
  }
  > pre {
    position: absolute;
    bottom: 0.5rem;
    font-size: 0.5em;
    color: #999;
  }
  &.on::after {
    content: "";
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 100rem;
    background-color: #e44;
    box-shadow: 0 0 0.1rem 2px #f222;
  }
}
.indicator {
  letter-spacing: 0.1em;
  background: #3333;
  padding: 1rem;
  border-radius: 100rem;
  transition: opacity 0.1s;
}
.code {
  @extend %fc;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 3rem;
  // min-height: 20rem;
  max-width: 70%;
  margin: 10px auto;
  padding: 1.5rem;
  // background: #3331;
  color: #2221;
  border-radius: 5px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-all;
  user-select: none;
  pointer-events: none;
}
</style>