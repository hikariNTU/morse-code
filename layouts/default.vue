<template>
  <v-app dark>
    <!-- Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ icons[item.icon] }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Top Bar -->
    <v-app-bar :clipped-left="clipped" flat dense app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" tile>
        <v-icon>{{ icons.mdiMenu }}</v-icon>
      </v-app-bar-nav-icon>
      <v-btn icon tile @click.stop="miniVariant = !miniVariant">
        <v-icon>{{
          miniVariant ? icons.mdiMenuRight : icons.mdiMenuLeft
        }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        Toggle Dark mode
        <template #activator="{ on }">
          <v-btn tile v-on="on" icon @click.stop="$vuetify.theme.dark ^= true">
            <v-icon>{{ icons.mdiThemeLightDark }}</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-app-bar>

    <!-- Container -->
    <v-main>
      <v-container fluid class="pa-0">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import data from "~/assets/site-data.yml";
import {
  mdiMenuLeft,
  mdiMenuRight,
  mdiThemeLightDark,
  mdiRadioTower,
  mdiMenu,
} from "@mdi/js";
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      icons: {
        mdiMenuLeft,
        mdiMenuRight,
        mdiThemeLightDark,
        mdiRadioTower,
        mdiMenu,
      },
      ...data,
    };
  },
  mounted() {
    setTimeout(() => {
      let isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.$vuetify.theme.dark = isDark;
    }, 500);
  },
};
</script>
