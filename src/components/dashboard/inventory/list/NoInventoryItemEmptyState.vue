<template>
  <div class="q-col-gutter-md">
    <div class="flex flex-center">
      <img src="@assets/images/inventory/inventory.png">
    </div>
    <div class="title h-title">
      {{ $t('dashboard.inventory.noInventoryItems.title') }}
    </div>
    <div class="message">
      {{ $t('dashboard.inventory.noInventoryItems.message') }}
    </div>
    <div class="flex flex-center">
      <q-btn
        color="primary"
        :label="$t('dashboard.inventory.noInventoryItems.action')"
        no-caps
        unelevated
        :to="{ name: 'inventory/new' }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
img {
  height: 30vh;
}

.title, .message {
  text-align: center;
}

.title {
  font-size: 2rem;
}
</style>
