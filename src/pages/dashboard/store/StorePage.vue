<template>
  <q-page>
    <div class="container q-gutter-md">
      <div class="h-title">
        {{ $t('dashboard.store.title') }}
      </div>
      <q-tabs
        class="h-tabs text-grey"
        no-caps
        inline-label
        active-color="white"
        indicator-color="transparent"
        align="justify"
      >
        <q-route-tab
          :to="{ name: 'store/details' }"
          :label="$t('dashboard.store.details.title')"
        />
        <q-route-tab
          :to="{ name: 'store/members' }"
          :label="$t('dashboard.store.members.title')"
        />
        <q-route-tab
          :to="{ name: 'store/work-hours' }"
          :label="$t('dashboard.store.workHours.title')"
        />
        <q-route-tab
          :to="{ name: 'store/delivery-areas' }"
          :label="$t('dashboard.store.deliveryAreas.title')"
        />
      </q-tabs>
      <div>
        <router-view v-slot="{ Component }">
          <template v-if="Component">
            <component :is="Component" />
          </template>
        </router-view>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.h-title {
  font-size: 24px;
}
</style>
