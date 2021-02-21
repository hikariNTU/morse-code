<template>
  <v-tooltip top>
    <slot />
    <template #activator="{ on }">
      <v-btn
        v-on="on"
        tile
        depressed
        :class="secondary ? 'secondary' : null"
        @click.prevent="doAction"
        :icon="text ? null : true"
      >
        {{ text }}<v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script>
export default {
  name: "TooltipIconBtn",
  props: {
    text: {
      default: "",
      type: String,
    },
    icon: {
      default: "",
      type: String,
    },
    action: {
      default: null,
      type: Function,
    },
    secondary: {
      default: false,
      type: Boolean,
    },
  },
  methods: {
    doAction() {
      if (this.action) {
        this.action();
      } else {
        console.log("Hello you press an empty icon");
      }
    },
  },
};
</script>

<style>
</style>