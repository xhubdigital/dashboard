<template>
  <q-checkbox
    v-bind="$props"
    class="input"
  />
</template>

<script>
export default {
  inheritAttrs: true,
};
</script>

<style lang="scss" scoped>
.input {
  ::v-deep(.q-checkbox__bg) {
    border-radius: 6px;
  }
}
</style>
