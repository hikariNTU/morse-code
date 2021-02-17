<template>
  <div class="containers">
    <div>
      <div
        tabindex="0"
        :class="{ commander: true, on: show }"
        @keydown="keyCatcher"
        role="application"
      >
        <label>Key Catcher</label>
        <div>{{ text }}</div>
        <pre>{{ whichKey }}</pre>
      </div>

      <div class="code-chunks">
        <div
          v-for="(c, idx) in text"
          :key="idx"
          @click="() => playText(code[c] ? code[c] : null)"
        >
          <pre>{{ code[c] || " " }}</pre>
          <div>{{ c }}</div>
        </div>
      </div>
    </div>
    <!-- <div class="indicator" :style="{ opacity: show ? 1 : 0 }">morse code</div> -->
    <div class="setting">
      <v-form class="pa-5">
        <v-row class="justify-space-around mb-3">
          <v-btn @click="playSound = !playSound" icon elevation="2">
            <v-icon> mdi-volume-{{ playSound ? "high" : "off" }} </v-icon>
          </v-btn>
          <v-btn @click.prevent="stopAll" icon elevation="2">
            <v-icon>mdi-stop</v-icon>
          </v-btn>
          <v-btn type="submit" @click.prevent="playAll" color="primary">
            Translate<v-icon>mdi-play</v-icon>
          </v-btn>
        </v-row>
        <v-textarea
          label="Input"
          v-model="text"
          @keydown.ctrl.13="playAll"
          auto-grow
        />
      </v-form>
    </div>
    <style>
      {{displayStyle}}
    </style>
    <div class="code">
      <div class="wrap">
        <span v-for="(c, idx) in displayCode" :key="idx">{{ c }}&#8203;</span>
      </div>
    </div>
    <div>
      <div class="d-flex flex-column text-left pa-7 rounded-lg">
        <h3 class="mb-2"><v-icon>mdi-tune</v-icon> Setting</h3>
        <label for="base-time">base time</label>
        <v-slider
          v-model="baseTime"
          class="align-center"
          :max="500"
          :min="5"
          hide-details
        >
          <template v-slot:append>
            <v-text-field
              id="base-time"
              v-model="baseTime"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 5em"
              suffix="ms"
            />
          </template>
        </v-slider>
        <label for="frequency">frequency</label>
        <v-slider
          v-model="sqrtFreq"
          class="align-center"
          :max="10"
          :min="1"
          :step="0.00001"
          hide-details
        >
          <template v-slot:append>
            <v-text-field
              id="frequency"
              v-model="frequency"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 5em"
              suffix="Hz"
            />
          </template>
        </v-slider>
        <label for="volume">volume</label>
        <v-slider
          v-model="volume"
          class="align-center"
          :max="100"
          :min="0"
          hide-details
        >
          <template v-slot:append>
            <v-text-field
              id="volume"
              v-model="volume"
              class="mt-0 pt-0"
              hide-details
              single-line
              :max="100"
              :min="0"
              :step="5"
              type="number"
              style="width: 5em"
              suffix="%"
            />
          </template>
        </v-slider>
      </div>
    </div>
  </div>
</template>

<script>
import code from "~/assets/code-table.yml";
import AudioBuzzer from "~/assets/audio";
import { debounce, words } from "lodash";

const _ALLOWANCE_CHAR = new Set(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.;!-_[]{}'\":/?<>()&%@#$ "
);
const allowChar = (char) => {
  return _ALLOWANCE_CHAR.has(char);
};

const waitFor = (wait = 500) => {
  return new Promise((resolve) => {
    setTimeout(resolve, wait);
  });
};

export default {
  data() {
    return {
      au: null,
      code: code,
      audioCtxAvailable: true,
      text: "",
      show: false,
      playSound: true,
      baseTime: 50,
      frequency: 440,
      volume: 50,
      isRunning: {}, // storing running token for async calls
      whichKey: "",
      currentPosition: -1,
    };
  },
  computed: {
    displayStyle() {
      return `
      .code > .wrap > span:nth-child(${this.currentPosition}) {
        outline: #9995 solid;
      }
      `;
    },
    displayCode() {
      return words(this.text.toLowerCase())
        .join(" ")
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
    volume() {
      this.au.volume = this.volume;
    },
    playSound() {
      if (!this.playSound) {
        this.au.stop();
      }
    },
  },
  mounted() {
    this.createAudioContext();
  },

  methods: {
    async createAudioContext() {
      try {
        // Create an audio context for playing beeps
        this.au = new AudioBuzzer({
          type: "hello",
          frequency: this.frequency,
          volume: this.volume,
        });
      } catch (e) {
        if (e instanceof TypeError) {
          console.error("AU Type ERROR.");
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
        case "Delete":
          this.text = "";
        case "Escape":
          const keyArr = Object.getOwnPropertySymbols(this.isRunning);
          if (keyArr.length !== 0) {
            this.stopAll();
          } else {
            document.activeElement.blur();
          }
          break;
        default:
          if (e.key.length === 1 && allowChar(e.key)) {
            this.text += e.key;
            this.debouncedPlay();
          }
      }
    },
    play() {
      this.show = true;
      this.playSound && this.au.start();
    },
    stop(force = false) {
      this.show = false;
      (this.playSound || force) && this.au.stop();
    },
    async playInstance(interval = 1) {
      this.play();
      await waitFor(interval * this.baseTime);
    },
    playAll() {
      this.playText();
    },
    playText: async function (text) {
      // token lock
      let displayPos = false;
      if (text === undefined) {
        text = this.displayCode;
        displayPos = true;
      }

      const sym = Symbol("Playing Token");
      const isRunning = this.isRunning;
      this.stopAll();
      isRunning[sym] = true;
      if (this.playSound) this.au.resumePlay();
      for (const [idx, c] of text.split("").entries()) {
        if (!isRunning[sym]) {
          break;
        }
        if (displayPos) this.currentPosition = idx + 1;
        switch (c) {
          case ".":
            await this.playInstance(1);
            break;
          case "_":
            await this.playInstance(3);
            break;
          case "|":
            // this.show = false;
            await waitFor(this.baseTime);
            break;
        }
        this.stop();
        await waitFor(this.baseTime);
      }
      // finish text token, clean up it
      this.currentPosition = -1;
      delete isRunning[sym];
    },

    stopAll() {
      this.stop(true);
      const isRunning = this.isRunning;
      for (const key of Object.getOwnPropertySymbols(isRunning)) {
        isRunning[key] = false;
      }
    },
  },

  destroyed() {
    this?.au?.destroyed();
  },
};
</script>

<style lang='scss'>
%fc {
  display: flex;
  justify-content: center;
  align-items: center;
}
$bcolor: #aaa2;
.containers {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: repeat(2, calc((100vh - 68px) / 2));
  grid-template-columns: 1fr 320px;
  border-top: solid $bcolor;
  border-left: solid $bcolor;
  // justify-content: space-between;
  // overflow-y: scroll;

  // align-items: center;
  > div {
    border-bottom: solid $bcolor;
    border-right: solid $bcolor;
    overflow-y: auto;
    width: 100%;
  }
}

.setting {
  padding: 0.5rem;
  min-width: 320px;
  > form {
    height: 100%;
  }
}
.code-chunks {
  margin: 1rem;
  text-align: center;
  > div {
    display: inline-flex;
    flex-direction: column;
    margin: 0.15rem;
    font-family: "Consolas", Courier, monospace;
    background: #6661;
    padding: 0.2rem;
    border: solid 0.02rem #6662;
    height: 2.5em;
    line-height: 1.7em;
    > pre {
      color: #666;
      font-size: 0.7em;
      line-height: 0.8em;
      letter-spacing: 0.2em;
      font-weight: bold;
    }
    &:hover {
      cursor: pointer;
      background: #6662;
    }
  }
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
  background-color: #9991;
  user-select: none;
  // white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-all;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.1s, box-shadow 0.3s;
  // &.on {
  //   background-color: #2223;
  // }
  &:hover {
    border-color: #9992;
  }
  &:focus {
    box-shadow: 0 0 5px 2px #9994;
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
  // @extend %fc;
  // position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  font-size: 3rem;
  font-family: consolas, Courier, monospace;
  // min-height: 20rem;
  // max-width: 70%;
  padding: 1.5rem;
  // background: #3331;
  color: #8889;
  letter-spacing: 0.03em;
  white-space: pre-wrap;
  overflow-wrap: break-all;
  word-break: break-all;
  user-select: none;
  // pointer-events: none;
}
</style>