<template>
  <v-container
    fluid
    class="pa-5 d-flex flex-column align-center justify-center"
  >
    <h1 class="text-h1 ma-5">
      {{ error.statusCode === 404 ? pageNotFound : otherError }}
    </h1>
    <v-simple-table dense>
      <thead>
        <tr>
          <th class="text-left">Key</th>
          <th class="text-left">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in error" :key="key">
          <td>{{ key }}</td>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <NuxtLink to="/" class="text-button"> Home page </NuxtLink>
  </v-container>
</template>

<script>
export default {
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred",
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
};
</script>
