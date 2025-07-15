<template>
  <q-table
    flat
    color="primary"
    :columns="fields"
    :rows="orders"
    :loading="loading"
    :pagination="{ rowsPerPage: 0 }"
    hide-pagination
    @row-click="openOrderDetails"
  >
    <template #body-cell-status="props">
      <q-td
        :props="props"
        class="order-status"
      >
        <q-badge
          class="q-mr-sm"
          :color="getOrderStatusBadgeColor(props.row.status)"
          rounded
        />
        {{ props.value }}
      </q-td>
    </template>
    <template #body-cell-total="props">
      <q-td
        :props="props"
        class="order-total"
      >
        {{ props.value }}
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { sum, map, prop } from 'ramda';

import {
  IOrder,
  IOrderPaymentInfoType,
  IOrderStatus,
  IOrderType,
} from '@models/IOrder';

import OrderDetails from './OrderDetails.vue';

export default class OrdersList extends Vue {
  @Prop({ required: true }) orders!: IOrder[];
  @Prop({ default: false }) loading!: boolean;
  @Prop({ default: false }) hideStatus!: boolean;

  get fields() {
    return [
      {
        name: 'createdAt',
        label: this.$t('dashboard.orders.orderTime'),
        field: 'createdAt',
        align: 'left',
        format: (date: Date) => moment(date).format('HH:mm - DD/MM'),
      },
      {
        name: 'paymentType',
        label: this.$t('dashboard.orders.orderPaymentType'),
        field: (order: IOrder) => order.paymentInfo.type,
        format: (type: IOrderPaymentInfoType) => this.formatPaymentType(type),
        align: 'left',
      },
      {
        name: 'type',
        label: this.$t('dashboard.orders.orderType'),
        field: 'type',
        format: (type: IOrderType) => this.formatOrderType(type),
        align: 'left',
      },
      {
        name: 'status',
        label: this.$t('dashboard.orders.orderStatus'),
        field: 'status',
        align: 'left',
        format: (status: IOrderStatus) => {
          return this.$t(`dashboard.orders.status.${status}`);
        },
      },
      {
        name: 'items',
        label: this.$t('dashboard.orders.orderItemsCount'),
        field: (order: IOrder): number =>
          sum(map(prop('quantity'), order.items)),
      },
      {
        name: 'serviceFee',
        label: this.$t('dashboard.orders.orderDeliveryFee'),
        field: 'serviceFee',
        format: (total: number) => this.$n(total, 'currency'),
      },
      {
        name: 'total',
        label: this.$t('dashboard.orders.orderTotal'),
        field: (order: IOrder) => order.subTotal + order.serviceFee,
        format: (total: number) => this.$n(total, 'currency'),
      },
    ];
  }

  getOrderStatusBadgeColor(status: IOrderStatus) {
    return {
      [IOrderStatus.Pending]: 'yellow',
      [IOrderStatus.Cancelled]: 'negative',
      [IOrderStatus.Production]: 'info',
      [IOrderStatus.Delivery]: 'secondary',
      [IOrderStatus.Done]: 'positive',
    }[status];
  }

  formatPaymentType(type: IOrderPaymentInfoType) {
    return {
      [IOrderPaymentInfoType.CreditCardOnDelivery]:
        this.$t('common.creditCard'),
      [IOrderPaymentInfoType.DebitCardOnDelivery]: this.$t('common.debitCard'),
      [IOrderPaymentInfoType.MoneyOnDelivery]: this.$t('common.money'),
    }[type];
  }

  formatOrderType(type: IOrderType) {
    return {
      [IOrderType.Delivery]: this.$t('common.delivery'),
      [IOrderType.Takeout]: this.$t('common.takeout'),
      [IOrderType.Local]: this.$t('common.consumeOnLocal'),
    }[type];
  }

  openOrderDetails(_: unknown, order: IOrder) {
    this.$q.dialog({
      component: OrderDetails,
      componentProps: { order },
    }).onOk(() => {
      this.$emit('requestUpdateOrders');
    });
  }
}
</script>

<style lang="scss" scoped>
.order-total {
  font-weight: bold;
}
</style>
