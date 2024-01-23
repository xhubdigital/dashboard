<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="fit row">
        <div class="gt-xs col-6 col-md-7 bg-primary flex items-center">
          <auth-product-highlights />
        </div>
        <div
          class="col-12 col-sm-6 col-md-5 q-pa-lg q-pa-md-xl flex flex-center"
        >
          <div class="content">
            <router-view />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';

import AuthProductHighlights from '@components/auth/AuthProductHighlights.vue';

@Options({
  components: { AuthProductHighlights },
})
export default class AuthLayout extends Vue {
}
</script>

<style lang="scss" scoped>
.content {
  max-width: 400px;
  margin: 0 auto;
}
</style>
