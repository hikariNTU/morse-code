<template>
  <v-dialog v-model="dialog" max-width="720" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <TooltipIconBtn
        v-bind="attrs"
        v-on="on"
        icon="mdi-view-list"
        :action="() => (dialog = !dialog)"
      >
        Code Table
      </TooltipIconBtn>
    </template>
    <v-card>
      <v-card-title class="headline"> Code Character Set </v-card-title>

      <v-card-text class="new-scroll-bar">
        The player is using following code set. Both American and
        International(ITU) set use the same logic to encode text. While American
        code set is generally more complicate than ITU standard, it's faster
        than ITU.
        <v-simple-table dense>
          <thead>
            <tr>
              <th class="text-left">Code Symbol</th>
              <th class="text-left">Duration</th>
              <th class="text-left">Active</th>
              <th class="text-left">Description</th>
            </tr>
          </thead>
          <tbody class="pre">
            <template v-for="(v, c) of code.definition">
              <tr :key="c">
                <td>{{ c }}</td>
                <td>{{ v[0] }}</td>
                <td class="red--text">{{ v[1] ? "●" : "" }}</td>
                <td>{{ v[2] }}</td>
                <td></td>
              </tr>
            </template>
          </tbody>
        </v-simple-table>
        <v-simple-table dense>
          <thead>
            <tr>
              <th class="text-left">Char</th>
              <th class="text-left">International</th>
              <th class="text-left">American</th>
            </tr>
          </thead>
          <tbody class="pre">
            <template v-for="(v, c) of codeList">
              <tr :key="c">
                <td>{{ c }}</td>
                <td>
                  <v-btn text tile @click="emitText(v[0])">{{ v[0] }}</v-btn>
                </td>
                <td>
                  <v-btn text tile @click="emitText(v[1])">{{ v[1] }}</v-btn>
                </td>
              </tr>
            </template>
          </tbody>
        </v-simple-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="callTable"> Use Table Set </v-btn>
        <v-btn text @click="dialog = false"> OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TooltipIconBtn from "./TooltipIconBtn.vue";
import data from "~/assets/code-table.yml";
import { mapValues } from "lodash";

export default {
  components: { TooltipIconBtn },
  data() {
    return {
      dialog: false,
      code: data,
    };
  },
  computed: {
    codeList() {
      return mapValues(this.code.international.code, (v, key) => [
        v,
        this.code.american.code[key],
      ]);
    },
  },
  methods: {
    callTable() {
      this.$emit("show-table");
      this.dialog = false;
    },
    emitText(text) {
      this.$emit("play-text", text, true);
    },
  },
};
</script>

<style lang='scss' scope>
.pre {
  font-family: "Consolas", "Courier New", Courier, monospace;
  font-size: large;
  font-weight: bold;
}
</style>