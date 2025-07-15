<template>
  <div class="q-col-gutter-md">
    <div
      v-for="item in order.items"
      :key="item.id"
    >
      <order-item :order-item="item" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IOrder } from '@models/IOrder';

import OrderItem from './OrderItem.vue';

@Options({
  components: {
    OrderItem,
  },
})
export default class OrderItems extends Vue {
  @Prop({ required: true }) order!: IOrder;
}
</script>
