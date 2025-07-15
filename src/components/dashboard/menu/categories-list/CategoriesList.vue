<template>
  <div class="categories-list q-col-gutter-md">
    <div
      v-for="category, index in categoriesModel"
      :key="category.id"
    >
      <categories-list-item
        v-model:category="categoriesModel[index]"
        @new-product="$emit('new-product', $event)"
        @request-edit-category="$emit('request-edit-category', $event)"
        @request-delete-category="$emit('request-delete-category', $event)"
        @request-edit-product="$emit('request-edit-product', $event)"
        @request-edit-complements="$emit('request-edit-complements', $event)"
        @request-delete-product="$emit('request-delete-product', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Model } from 'vue-property-decorator';

import { IProductCategory } from '@models/IProductCategory';

import CategoriesListItem from './CategoriesListItem.vue';

@Options({
  components: {
    CategoriesListItem,
  },
  emits: [
    'request-edit-category',
    'request-delete-category',
    'request-edit-product',
    'request-edit-complements',
    'request-delete-product',
    'new-product',
  ],
})
export default class CategoriesList extends Vue {
  @Model('categories') categoriesModel!: IProductCategory[];
}
</script>
