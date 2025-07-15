<template>
  <q-page>
    <div class="container q-gutter-md">
      <div class="h-title">
        {{ $t('dashboard.menu.title') }}
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
          :to="{ name: 'menu/main-menu' }"
          :label="$t('dashboard.menu.mainMenu')"
        />
        <q-route-tab
          :to="{ name: 'menu/complements' }"
          :label="$t('dashboard.menu.complements')"
        />
      </q-tabs>
      <div>
        <router-view />
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.h-title{
  font-size: 24px;
}
</style>
