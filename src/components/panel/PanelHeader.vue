<template>
  <q-toolbar class="panel-header">
    <div class="content flex items-center">
      <div class="flex items-center q-gutter-md">
        <div v-if="!$q.screen.gt.sm">
          <q-btn
            icon="mdi-menu"
            flat
            round
            color="primary"
            @click="toggleDrawer"
          />
        </div>
        <div class="logo">
          <img src="~assets/logos/hubx.png">
        </div>
      </div>
      <q-space />
      <div class="actions q-gutter-md">
        <q-avatar
          class="orders-icon cursor-pointer"
          size="xl"
          rounded
          @click="$router.push('/dashboard/orders')"
        >
          <q-icon name="mdi-clipboard-text-outline" />
          <q-badge
            color="primary"
            floating
          >
            {{ openOrders.length }}
          </q-badge>
          <q-tooltip>
            {{ $t('dashboard.orders.openOrders') }}
          </q-tooltip>
        </q-avatar>
        <q-avatar
          size="xl"
          rounded
        >
          <img :src="panelIcon">
        </q-avatar>
      </div>
    </div>
  </q-toolbar>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { pathOr } from 'ramda';

import { IUser } from '@models/IUser';
import { IOrder } from '@models/IOrder';

import placeholderImg from 'src/assets/logos/restaurant-placeholder.png';

@Options({
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('orders', ['openOrders']),
  },
  emits: ['toggleDrawer'],
})
export default class PanelHeader extends Vue {
  user!: IUser;
  openOrders!: IOrder[];

  get panelIcon() {
    return pathOr(placeholderImg, ['restaurant', 'picture'], this.user);
  }

  toggleDrawer() {
    this.$emit('toggleDrawer');
  }
}
</script>

<style lang="scss" scoped>
.panel-header {
  background: #FFF;
  border-bottom: 1px solid $separator-color;
  padding: 20px 25px;

  @media (max-width: $breakpoint-sm-max) {
    padding: 12px;
  }
}

.logo {
  display: flex;

  img {
    height: 46px;
  }
}

.content {
  width: 100%;
}

.orders-icon {
  background: rgba(255, 87, 34, 0.1);
  color: $primary;
}
</style>
