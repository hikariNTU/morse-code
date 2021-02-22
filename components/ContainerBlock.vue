<template>
  <div class="container-blocks">
    <h2 :class="{ dark: this.$vuetify.theme.dark }">{{ title }}</h2>
    <div
      :class="{
        inner: true,
        'new-scroll-bar': true,
        flex: flex,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: "",
      type: String,
    },
    flex: {
      default: false,
      type: Boolean,
    },
  },
};
</script>

<style lang='scss'>
.container-blocks {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  > h2 {
    all: unset;
    position: sticky;
    top: 0;
    box-sizing: border-box;
    display: block;
    width: calc(100%);
    padding: 0.15rem 0.35rem;
    text-transform: capitalize;
    // background-color: #9992;
    font-size: 0.8rem;
    border-bottom: solid #9992 1px;
    font-weight: bold;
    background: #f9f9f9;
    z-index: 2;
    &.dark {
      background: #222;
    }
    // border-bottom: none;
  }
  > .inner {
    &.flex {
      display: flex;
      flex-direction: column;
    }
    outline: solid red;
    flex-grow: 1;
    overflow-y: auto;
  }
}
.new-scroll-bar {
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-button {
    width: 5px;
    background: #999;
    &:hover {
      background: #9997;
      cursor: pointer;
    }
  }
  /* Track */
  &::-webkit-scrollbar-track {
    background: #9996;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #999a;
    &:hover {
      background: #999;
    }
  }
}
</style>