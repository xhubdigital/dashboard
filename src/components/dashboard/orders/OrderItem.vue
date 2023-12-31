<template>
  <div class="item">
    <div class="header">
      <div class="quantity">
        {{ orderItem.quantity }}
      </div>
      <div class="product-name">
        {{ orderItem.product.label }}
      </div>
      <div class="price">
        {{ $n(price, 'currency') }}
      </div>
    </div>
    <div class="complements">
      <div
        v-for="complement in orderItem.complements"
        :key="complement.id"
      >
        <div
          v-for="option in complement.values"
          :key="option.id"
        >
          <template v-if="complement.complementGroup.repeatOption">
            {{ $t('dashboard.orders.quantity', { count: option.quantity }) }}
          </template>
          {{ option.complementGroupOption.label }}
        </div>
      </div>
    </div>
    <div
      v-if="observations"
      class="observations"
    >
      {{ $t('dashboard.orders.observations', { observations }) }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';

import { IOrderItem } from '@models/IOrder';
import { getOrderItemPrice } from '@helpers/price/getOrderItemPrice';

export default class OrderItem extends Vue {
  @Prop({ required: true }) orderItem!: IOrderItem;

  get price(): number {
    return getOrderItemPrice(this.orderItem);
  }

  get observations() {
    return this.orderItem.observations;
  }
}
</script>

<style lang="scss" scoped>
.item {
  .header {
    display: flex;
    align-items: center;

    .quantity {
      padding: 2px 6px;
      background: #eeeeee;
      border: 1px solid #bdbdbd;
      border-radius: 2px;
      font-weight: 700;
    }

    .product-name {
      padding: 0 8px;
      font-weight: bold;
      flex-grow: 1;
    }
  }

}
</style>
