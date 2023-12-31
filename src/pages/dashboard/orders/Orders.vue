<template>
  <q-page>
    <div class="container q-gutter-md">
      <div class="h-title">
        {{ $t('dashboard.orders.title') }}
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
          :to="{ name: 'orders/open' }"
          :label="$t('dashboard.orders.openOrders')"
        />
        <q-route-tab
          :to="{ name: 'orders/closed' }"
          :label="$t('dashboard.orders.closedOrders')"
        />
      </q-tabs>
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import DateField from '@components/form/DateField.vue';
import OrdersList from '@components/dashboard/orders/OrdersList.vue';

@Options({
  components: {
    OrdersList,
    DateField,
  },
})
export default class Orders extends Vue {
}
</script>

<style lang="scss" scoped>
.h-title {
  font-size: 24px;
}
</style>
