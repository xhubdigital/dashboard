<template>
  <div class="text-center column flex-center q-col-gutter-lg">
    <div>
      <q-icon
        name="mdi-map-marker-remove"
        size="7rem"
        color="negative"
      />
    </div>
    <div class="title">
      {{ $t('dashboard.store.deliveryAreas.noAddressTitle') }}
    </div>
    <div class="description">
      {{ $t('dashboard.store.deliveryAreas.noAddressDescription') }}
    </div>
    <div class="actions">
      <q-btn
        :label="$t('dashboard.store.deliveryAreas.noAddressConfigAddress')"
        color="primary"
        rounded
        unelevated
        :to="{ name: 'store/details', params: { action: 'edit-address' } }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  font-size: 2rem;
  font-weight: bold;
}

.description {
  font-size: 1.2rem;
  color: $grey-6;
}
</style>
