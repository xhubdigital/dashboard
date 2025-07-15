<template>
  <div class="inventory-list-header q-pa-lg">
    <div class="row q-col-gutter-lg items-center">
      <div class="col-6">
        <div class="title h-title">
          {{ $t('dashboard.inventory.listTitle') }}
        </div>
      </div>
      <div class="col-6 actions">
        <div class="flex justify-end items-center q-col-gutter-md">
          <div>
            <q-btn
              :label="$t('dashboard.inventory.newItem')"
              color="primary"
              unelevated
              :to="{ name: 'inventory/new' }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inventory-list-header {
  border: 1px solid $separator-color;
  border-radius: $generic-border-radius;

  .title {
    font-size: 18px;
  }
}
</style>
