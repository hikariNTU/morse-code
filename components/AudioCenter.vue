<template>
  <div class="containers">
    <!-- <div class="indicator" :style="{ opacity: show ? 1 : 0 }">MORSE CODE</div> -->
    <!-- Main container -->
    <ContainerBlock title="main">
      <!-- <v-card width="250px" tabindex="1" class="align-self-center"> -->
      <v-btn
        fab
        @click="resumeAudio"
        @keydown="play"
        @keyup="stop"
        @mousedown="play"
        @mouseout="stop"
        @mouseup="stop"
        @blur="stop"
        @touchstart.stop.prevent="play"
        @touchend="stop"
        color="secondary"
        :class="{ 'red--text': show, 'morse-fab': true }"
      >
        <v-icon>mdi-broadcast</v-icon>
      </v-btn>
      <!-- </v-card> -->
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
          v-for="(c, idx) in shortText"
          :key="idx"
          @click="() => playText(code[c] ? c : null)"
          :clickable="code[c] ? code[c] : null"
        >
          <pre>{{ code[c] || " " }}</pre>
          <div>{{ c }}</div>
        </div>
        <div v-if="shortText.length < text.length">
          <pre>…</pre>
          <div>……</div>
        </div>
      </div>
    </ContainerBlock>

    <!-- Control Panel -->
    <ContainerBlock title="Control Panel" flex>
      <v-textarea
        class="ma-2"
        label="Input Text"
        v-model="text"
        @keydown.ctrl.13="playAll"
        auto-grow
      />

      <v-row
        :class="{
          'ma-0': true,
          'mt-3': true,
          control: true,
          dark: this.$vuetify.theme.dark,
        }"
        :style="{ flexGrow: 0 }"
      >
        <tooltip-icon-btn
          :icon="`mdi-volume-${playSound ? 'high' : 'off'}`"
          :action="() => (playSound = !playSound)"
        >
          Toggle Mute
        </tooltip-icon-btn>
        <tooltip-icon-btn icon="mdi-stop" :action="stopAll">
          Stop Playback
        </tooltip-icon-btn>
        <tooltip-icon-btn icon="mdi-table-of-contents" :action="showCodeTable">
          Show Current Code Book
        </tooltip-icon-btn>

        <v-spacer />

        <tooltip-icon-btn
          icon="mdi-play"
          text="start"
          :action="playAll"
          secondary
        >
          Play Input text using code table.
        </tooltip-icon-btn>
      </v-row>
    </ContainerBlock>

    <!-- Code display area -->
    <component :is="'style'">
      {{ displayStyle }}
    </component>
    <ContainerBlock title="translated code">
      <div class="wrap--code code">
        <!-- Use zero-space for wrapping -->
        <span v-for="(c, idx) in displayCode" :key="idx">{{ c }}&#8203;</span>
      </div>
    </ContainerBlock>

    <!-- Setting Panel -->
    <ContainerBlock title="Setting">
      <div class="d-flex flex-column text-left pa-5">
        <v-select
          v-model="codeStandard"
          :items="['international', 'american']"
          append-outer-icon="mdi-book-open"
          hint="Code Standard in use."
          item-text="standard"
          item-value="abbr"
          label="Code Standard"
        />
        <v-btn @click="playSample" tile class="mb-3" depressed>
          Play Test <v-icon>mdi-play</v-icon>
        </v-btn>
        <label for="base-time">base time</label>
        <v-slider
          v-model="baseTime"
          class="align-center"
          :max="500"
          :min="5"
          hide-details
          color="secondary"
        >
          <template v-slot:append>
            <v-text-field
              color="secondary"
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
          color="secondary"
          v-model="sqrtFreq"
          class="align-center"
          :max="10"
          :min="1"
          :step="0.00001"
          hide-details
        >
          <template v-slot:append>
            <v-text-field
              color="secondary"
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
          color="secondary"
          v-model="volume"
          class="align-center"
          :max="100"
          :min="0"
          hide-details
        >
          <template v-slot:append>
            <v-text-field
              color="secondary"
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
    </ContainerBlock>
  </div>
</template>

<script>
import code from "~/assets/code-table.yml";
import AudioBuzzer from "~/assets/audio";
import ContainerBlock from "~/components/ContainerBlock";
import { debounce } from "lodash";
import TooltipIconBtn from "./TooltipIconBtn.vue";

const _ALLOWANCE_CHAR = new Set(Object.keys(code.international.code));

const allowChar = (char) => {
  return _ALLOWANCE_CHAR.has(char?.toLowerCase());
};

const waitFor = (wait = 500) => {
  return new Promise((resolve) => {
    setTimeout(resolve, wait);
  });
};

export default {
  components: { ContainerBlock, TooltipIconBtn },
  data() {
    return {
      au: null,
      code: code.international.code,
      audioCtxAvailable: true,
      text: "Hello World!",
      show: false,
      playSound: true,
      baseTime: 50,
      frequency: 440,
      volume: 50,
      isRunning: {}, // storing running token for async calls
      whichKey: "",
      currentPosition: -1,
      codeStandard: "international",
    };
  },

  computed: {
    shortText() {
      return this.text?.length ? this.text.slice(0, 65).toLowerCase() : "";
    },
    displayStyle() {
      return `
      .wrap--code > span:nth-child(${this.currentPosition}) {
        outline: ${this.show ? "#e66" : "#9995"} solid;
      }
      `;
    },
    displayCode() {
      return this.text
        .toLowerCase()
        .split("")
        .map((char) => this.code[char])
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
    codeStandard() {
      let newCode = code[this.codeStandard]?.code;
      if (newCode) {
        this.code = newCode;
        this.stopAll();
      }
    },
  },
  mounted() {
    this.createAudioContext();
  },

  methods: {
    bindThis(handler) {
      return handler.bind(this);
    },
    async createAudioContext() {
      try {
        // Create an audio context for playing beeps
        this.au = new AudioBuzzer({
          type: "sine",
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
    /**
     * @type function
     * @description Debounce for input from key catcher.
     * @returns {function} debounced playText()
     */
    debouncedPlay: debounce(function () {
      this.playText();
    }, 500),

    keyCatcher(e) {
      // console.log(e);
      this.whichKey = e.key;
      switch (e.key) {
        case "Backspace":
          this.stopAll();
          this.text = this.text.slice(0, -1);
          break;
        case "Enter":
          this.playText();
          break;
        case "Tab":
          e.srcElement.blur();
          break;
        case "Delete":
          this.stopAll();
          this.text = "";
          break;
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
            e.preventDefault();
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
    resumeAudio() {
      if (this.playSound) this.au.resumePlay();
    },
    showCodeTable() {
      this.stopAll();
      this.text = Object.keys(this.code).join("");
    },
    /**
     * Play given code for Morse Code Buzzer with proper set.
     * @param { String } text - Code sequence for AudioCtx to play
     */
    playText: async function (text) {
      // Prepare code to play
      let displayPos = false;
      if (text === undefined) {
        text = this.displayCode;
        displayPos = true;
      } else if (text === null) {
        return;
      } else if (text) {
        text = text
          .split("")
          .map((c) => {
            return this.code[c];
          })
          .filter((v) => v)
          .join("|");
      }

      // token lock
      const sym = Symbol("Playing Token");
      const isRunning = this.isRunning;
      // tag clear other playing sessions

      this.stopAll();
      // Register playing token in running sessions
      isRunning[sym] = true;
      // this is needed to resume audio ctx for auto-play policy
      this.resumeAudio();
      for (const [idx, c] of text.split("").entries()) {
        if (!isRunning[sym]) {
          // check if this session is tagged as clear
          break;
        }
        if (displayPos) this.currentPosition = idx + 1;
        switch (c) {
          case ".":
            await this.playInstance(1);
            break;
          case "-":
            await this.playInstance(2);
            break;
          case "_":
            await this.playInstance(3);
            break;
          case "4":
            await this.playInstance(4);
            break;
          case "e":
            await this.playInstance(11);
            break;
          case "|":
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
    playSample: function () {
      this.playText("testing text.");
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
html,
body {
  overflow: auto;
}
.containers {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  border-top: solid $bcolor;
  border-left: solid $bcolor;
  margin-bottom: 5rem;
  @media screen and(min-width: 720px) {
    margin-bottom: 0;
    grid-template-columns: 1fr 320px;
    grid-template-rows: repeat(2, calc((100vh - 52px) / 2));
    overflow-y: hidden;
  }
  > div {
    border-bottom: solid $bcolor;
    border-right: solid $bcolor;
    overflow-y: auto;
    width: 100%;
  }
}

.code-chunks {
  margin: 1rem;
  text-align: center;
  text-transform: capitalize;
  line-height: 1.7em;
  > div {
    display: inline-flex;
    flex-direction: column;
    margin: 0.15rem;
    font-family: "Consolas", Courier, monospace;
    background: #6661;
    padding: 0.2rem;
    border: solid 0.02rem #6662;
    height: 2.5em;
    > pre {
      color: #666;
      font-size: 0.7em;
      line-height: 0.8em;
      letter-spacing: 0.2em;
      font-weight: bold;
    }
    &[clickable]:hover {
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
  overflow-wrap: break-word;
  word-break: break-all;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.1s, box-shadow 0.3s;
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
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 1rem;
  left: 50%;
  width: 10rem !important;
  height: 2.5rem;
  letter-spacing: 0.1em;
  font-size: small;
  font-weight: 700;
  background: #3333;
  padding: 0.2rem;
  border-radius: 100rem;
  transform: translateX(-50%);
  transition: opacity 0.1s;
  z-index: 100;
  user-select: none;
  pointer-events: none;
}

.morse-fab {
  position: fixed;
  z-index: 1000;
  bottom: 3rem;
  left: 1rem;
  user-select: none;
  touch-action: none;
  @media screen and(min-width: 720px) {
    bottom: 1rem;
  }
}

.control {
  border-top: solid #9995 1px;
  position: fixed;
  bottom: 0;
  width: 100%;
  @media screen and(min-width: 720px) {
    position: sticky;
  }
  background: white;
  z-index: 5;
  > button {
    margin: 0;
    border: solid #9994;
    border-width: 0 1px 0 0;
    &:last-of-type {
      border: none;
    }
  }
  &.dark {
    background: #111;
  }
}
.code {
  font-size: 1.8em;
  font-family: consolas, Courier, monospace;
  padding: 1.5rem;
  color: #8889;
  letter-spacing: 0.03em;
  white-space: pre-wrap;
  overflow-wrap: break-all;
  word-break: break-all;
}
.container-block {
  margin: 0;
  padding: 0;
  > h2 {
    all: unset;
    position: sticky;
    top: 0;
    box-sizing: border-box;
    display: block;
    width: calc(100%);
    padding: 0.15rem 0.35rem;
    text-transform: capitalize;
    font-size: 0.8rem;
    border-bottom: solid #9992 1px;
    font-weight: bold;
    background: #f9f9f9;
    z-index: 2;
  }
}
</style>