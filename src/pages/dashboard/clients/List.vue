<template>
  <div class="q-pa-md q-col-gutter-md">
    <div class="q-pa-lg">
      <div class="page-title">
        {{ $t('dashboard.clients.title') }}
      </div>
      <div class="page-caption">
        {{ $t('dashboard.clients.caption') }}
      </div>
    </div>
    <div>
      <q-table
        :columns="fields"
        :rows="clients.data"
        :loading="clients.loading"
        color="primary"
        flat
        :pagination="{ rowsPerPage: 0 }"
        hide-pagination
      >
        <template #body-cell-origin="props">
          <q-td auto-width>
            <q-avatar
              v-if="getIsMarketplace(props.row.origin)"
              size="lg"
            >
              <img :src="getRowLogo(props.row.origin)">
            </q-avatar>
            <div v-else>
              {{ props.row.origin }}
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

import { IClient, IClientOrigin } from '@models/IClient';
import { ILoadable } from '@helpers/ILoadable';
import { formatPhone } from '@helpers/format/formatPhone';
import { getClients } from '@api/clients';

import IFOOD_LOGO from 'assets/marketplaces/ifood.png';
import UBER_EATS_LOGO from 'assets/marketplaces/uber-eats.png';
import FOOD99_LOGO from 'assets/marketplaces/99food.jpg';
import MANUAL_LOGO from 'assets/marketplaces/ifood.png';
import DELIVERY_LOGO from 'assets/marketplaces/ifood.png';

export default class List extends Vue {
  clients: ILoadable<IClient[]> = {
    loading: false,
    data: [],
  };

  get fields() {
    return [
      // {
      //   name: 'origin',
      //   label: this.$t('dashboard.clients.origin'),
      //   align: 'left',
      // },
      {
        name: 'name',
        label: this.$t('common.name'),
        field: 'name',
        align: 'left',
      },
      {
        name: 'email',
        label: this.$t('common.email'),
        field: 'email',
        align: 'left',
      },
      {
        name: 'phone',
        label: this.$t('common.phone'),
        field: 'phone',
        format: formatPhone,
        align: 'left',
      },
    ];
  }

  created() {
    void this.loadClients();
  }

  async loadClients() {
    try {
      this.clients.loading = true;

      this.clients.data = await getClients();

      this.clients.loading = false;
    } catch {
      this.clients.loading = false;
    }
  }

  getIsMarketplace(origin: IClientOrigin) {
    return !(origin === IClientOrigin.MANUAL ||
      origin === IClientOrigin.DELIVERY);
  }

  getRowLogo(origin: IClientOrigin) {
    return {
      [IClientOrigin.IFOOD]: IFOOD_LOGO,
      [IClientOrigin.UBER_EATS]: UBER_EATS_LOGO,
      [IClientOrigin.FOOD99]: FOOD99_LOGO,
      [IClientOrigin.MANUAL]: MANUAL_LOGO,
      [IClientOrigin.DELIVERY]: DELIVERY_LOGO,
    }[origin];
  }
}
</script>

<style lang="scss" scoped>
.origin-logo {
  display: div;
}
</style>
