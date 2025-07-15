<template>
  <div class="q-col-gutter-md">
    <div class="flex flex-center">
      <img src="@assets/images/inventory/inventory-history.png">
    </div>
    <div class="title h-title">
      {{ $t('dashboard.inventory.noHistoryItems.title') }}
    </div>
    <div class="message">
      {{ $t('dashboard.inventory.noHistoryItems.message') }}
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
