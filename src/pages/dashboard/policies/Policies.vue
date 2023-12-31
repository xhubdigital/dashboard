<template>
  <q-page>
    <div class="container q-gutter-md">
      <div class="h-title">
        {{ $t('policies.title') }}
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
          :to="{ name: 'policies/contents' }"
          :label="$t('policies.tabs[0].name')"
        />
        <q-route-tab
          :to="{ name: 'policies/privacy' }"
          :label="$t('policies.tabs[1].name')"
        />
        <q-route-tab
          :to="{ name: 'policies/illicit' }"
          :label="$t('policies.tabs[2].name')"
        />
      </q-tabs>
      <div>
        <router-view />
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
export default class policies extends Vue {
}
</script>

<style lang="scss" scoped>
.h-title{
  font-size: 24px;
}
</style>
