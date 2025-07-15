<template>
  <div v-if="order">
    <div
      v-for="item in order.items"
      :key="item.id"
    >
      <div>
        {{ $n(getOrderItemPrice(item), 'currency') }}
      </div>
      <div>
        {{ `${item.quantity}x ${item.product.label}` }}
      </div>
      <div
        v-for="complement in item.complements"
        :key="complement.id"
      >
        <div
          v-for="option in complement.values"
          :key="option.id"
        >
          <template
            v-if="complement.complementGroup.repeatOption && option.quantity"
          >
            {{ `${option.quantity}x ` }}
          </template>
          {{ option.complementGroupOption.label }}
        </div>
      </div>
      <div v-if="item.observations">
        {{ `Observações: ${item.observations}` }}
      </div>
      <br>
    </div>
    <hr>
    <div>{{ orderType }}</div>
    <div>{{ `Pagamento: ${paymentInfo}` }}</div>
    <div>
      {{
        `${$t('dashboard.orders.orderSubTotal')}: ${$n(subTotal, 'currency')}`
      }}
    </div>
    <div>
      {{ `${$t('dashboard.orders.orderServiceFee')}: ${$n(fee, 'currency')}` }}
    </div>
    <div>
      {{ `${$t('dashboard.orders.orderTotal')}: ${$n(total, 'currency')}` }}
    </div>
    <hr>
    <div>{{ `${userName} - ${userPhone}` }}</div>
    <div v-if="isDelivery">
      {{ address }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { path, pathOr } from 'ramda';

import { getOrderItemPrice } from '@helpers/price/getOrderItemPrice';
import { formatAddress } from '@helpers/format/formatAddress';
import { formatPhone } from '@helpers/format/formatPhone';
import { IOrder, IOrderPaymentInfoType, IOrderType } from '@models/IOrder';
import { getOrder } from '@api/orders';

export default class OrderReceipt extends Vue {
  order: IOrder | null = null;

  getOrderItemPrice = getOrderItemPrice;

  get orderId(): string {
    return this.$route.params.id as string;
  }

  get userName() {
    if (!this.order) {
      return '';
    }

    return pathOr(this.order.userName, ['client', 'name'], this.order);
  }

  get userPhone() {
    if (!this.order) {
      return '';
    }

    const phone = path<string>(['client', 'phone'], this.order);

    return phone ? formatPhone(phone) : this.order.userPhone;
  }

  get address() {
    if (!this.order) {
      return '';
    }

    return formatAddress(this.order.address);
  }

  get isDelivery(): boolean {
    if (!this.order) {
      return false;
    }

    return this.order.type === IOrderType.Delivery;
  }

  get orderType(): string {
    if (!this.order) {
      return '';
    }

    return {
      [IOrderType.Delivery]: 'Entrega',
      [IOrderType.Takeout]: 'Retirada',
      [IOrderType.Local]: 'Consumir no local',
    }[this.order.type];
  }

  get paymentInfo() {
    if (!this.order) {
      return '';
    }

    const { paymentInfo: { type, changeFor } } = this.order;

    return {
      [IOrderPaymentInfoType.CreditCardOnDelivery]:
        this.$t('common.creditCard'),
      [IOrderPaymentInfoType.DebitCardOnDelivery]:
        this.$t('common.debitCard'),
      [IOrderPaymentInfoType.MoneyOnDelivery]: changeFor
        ? this.$t('dashboard.orders.paymentMoneyWithChange', {
          change: this.$n(changeFor, 'currency'),
        })
        : this.$t('dashboard.orders.paymentMoneyWithoutChange'),
    }[type];
  }

  get subTotal() {
    if (!this.order) {
      return 0;
    }

    return this.order.subTotal;
  }

  get fee() {
    if (!this.order) {
      return 0;
    }

    return this.order.serviceFee;
  }

  get total() {
    return this.subTotal + this.fee;
  }

  mounted() {
    void this.loadOrder();
  }

  async loadOrder() {
    this.order = await getOrder(this.orderId);

    setTimeout(() => {
      window.print();
      window.close();
    }, 200);
  }
}
</script>
