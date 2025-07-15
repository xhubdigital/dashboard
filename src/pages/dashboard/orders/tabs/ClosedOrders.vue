<template>
  <div class="q-col-gutter-lg">
    <div>
      <q-form
        class="row q-col-gutter-md"
        @submit.prevent="loadOrders"
      >
        <div class="col-12">
          <div class="row q-col-gutter-md">
            <div class="col-6 col-sm-3">
              <q-input
                v-model="filter.orderNumber"
                :label="$t('dashboard.orders.filterOrderNumber')"
                outlined
              />
            </div>
            <div class="col-6 col-sm-3">
              <q-select
                v-model="filter.status"
                :label="$t('dashboard.orders.filterStatus')"
                :options="statusOptions"
                map-options
                emit-value
                multiple
                outlined
              />
            </div>
            <div class="col-6 col-sm-3">
              <date-field
                v-model="filter.startDate"
                outlined
                :label="$t('dashboard.orders.startDate')"
              />
            </div>
            <div class="col-6 col-sm-3">
              <date-field
                v-model="filter.endDate"
                outlined
                :label="$t('dashboard.orders.endDate')"
              />
            </div>
          </div>
        </div>
        <div class="col-12 flex q-col-gutter-md">
          <div>
            <q-btn
              class="full-height q-px-lg"
              :label="$t('common.filter')"
              type="submit"
              unelevated
              color="primary"
            />
          </div>
          <div>
            <q-btn
              :label="$t('dashboard.orders.exportOrders')"
              color="primary"
              flat
            />
          </div>
        </div>
      </q-form>
    </div>
    <div>
      <orders-list
        :loading="orders.loading"
        :orders="orders.data"
        @request-update-orders="loadOrders"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';

import { ILoadable } from '@helpers/ILoadable';
import { IOrder, IOrderStatus } from '@models/IOrder';
import { getOrders } from '@api/orders';

import DateField from '@components/form/DateField.vue';
import OrdersList from '@components/dashboard/orders/OrdersList.vue';

interface OrdersFilter {
  orderNumber?: string;
  status?: IOrderStatus[];
  startDate: string;
  endDate: string;
}

@Options({
  components: {
    OrdersList,
    DateField,
  },
})
export default class ClosedOrders extends Vue {
  filter: OrdersFilter = {
    orderNumber: '',
    status: [IOrderStatus.Cancelled, IOrderStatus.Done],
    startDate: '',
    endDate: '',
  };

  orders: ILoadable<IOrder[]> = {
    loading: false,
    data: [],
  };

  get statusOptions() {
    return [
      {
        label: this.$t('dashboard.orders.status.cancelled'),
        value: IOrderStatus.Cancelled,
      },
      {
        label: this.$t('dashboard.orders.status.done'),
        value: IOrderStatus.Done,
      },
    ];
  }

  created() {
    this.filter.startDate = moment().format('DD/MM/YYYY');
    this.filter.endDate = this.filter.startDate;

    void this.loadOrders();
  }

  async loadOrders() {
    try {
      this.orders.loading = true;

      const { startDate, endDate, status, orderNumber } = this.filter;

      this.orders.data = await getOrders({
        status,
        orderNumber,
        startDate: moment(startDate, 'DD/MM/YYYY').startOf('day').toDate(),
        endDate: moment(endDate, 'DD/MM/YYYY').endOf('day').toDate(),
      });

      this.orders.loading = false;
    } catch {
      this.orders.loading = false;
    }
  }
}
</script>
