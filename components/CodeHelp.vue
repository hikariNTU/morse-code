<template>
  <v-dialog v-model="dialog" max-width="720">
    <template v-slot:activator="{ on, attrs }">
      <TooltipIconBtn
        v-bind="attrs"
        v-on="on"
        :icon="icons.mdiHelp"
        :action="() => (dialog = !dialog)"
      >
        Show Tips
      </TooltipIconBtn>
    </template>
    <v-card>
      <v-card-title class="headline"> Morse Code Guideline </v-card-title>

      <v-card-text>
        You can type character inside the Key Catcher box, it will automatically
        play after you finish typing.
      </v-card-text>

      <v-card-text
        >You can also directly type text inside Input Text area. The text will
        be translated into Morse code immediately by the given code
        set.</v-card-text
      >

      <v-card-text>
        The morse code pattern follow the international standard of base time.
        Generally speaking, 1 base time silent will be insert between each
        primitive sign, and 3 base time silent will be insert between each
        character. 7 base time will be insert between word, which will be
        equivalent to three interword note '|'.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false"> OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TooltipIconBtn from "./TooltipIconBtn.vue";
import { mdiHelp } from "@mdi/js";
export default {
  components: { TooltipIconBtn },
  data() {
    return {
      dialog: false,
      icons: { mdiHelp },
    };
  },
};
</script>

<style>
</style>