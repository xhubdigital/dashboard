<template>
  <q-btn-toggle
    :props="$attrs"
    unelevated
    no-caps
  >
    <q-inner-loading :showing="$attrs.loading">
      <q-spinner
        color="primary"
        size="sm"
      />
    </q-inner-loading>
  </q-btn-toggle>
</template>

<style lang="scss" scoped>
.q-btn-toggle {
  background: #EDEEF2;
  padding: 4px;
  border-radius: 12px;

  ::v-deep(.q-btn-item) {
    font-size: 12px;
    border-radius: inherit;
    padding: 6px 12px;
  }
}
</style>
