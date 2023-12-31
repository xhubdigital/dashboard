<template>
  <div class="products">
    <template
      v-for="product, index in productsModel"
      :key="product.id"
    >
      <products-list-item
        v-model:product="productsModel[index]"
        @request-edit-product="$emit('request-edit-product', $event)"
        @request-edit-complements="$emit('request-edit-complements', $event)"
        @request-delete-product="$emit('request-delete-product', $event)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Model } from 'vue-property-decorator';

import { IProduct } from '@models/IProduct';

import ProductsListItem from './ProductsListItem.vue';

@Options({
  components: {
    ProductsListItem,
  },
  emits: [
    'request-edit-product',
    'request-edit-complements',
    'request-delete-product',
  ],
})
export default class ProductsList extends Vue {
  @Model('products') productsModel!: IProduct[];
}
</script>
