<template>
  <div class="menu-header q-pa-lg">
    <div class="row q-col-gutter-lg">
      <div class="col-6">
        <div class="title h-title">
          {{ $t('dashboard.menu.mainMenuTitle') }}
        </div>
        <div class="subtitle">
          <div>
            {{ $t('dashboard.menu.mainMenuSubtitle.label', {
              categories: $t('dashboard.menu.mainMenuSubtitle.categories', {
                count: categories.length,
              }),
              products: $t('dashboard.menu.mainMenuSubtitle.products', {
                count: totalProductsCount,
              }),
            }) }}
          </div>
        </div>
      </div>
      <div class="col-6 actions">
        <div class="flex justify-end items-center q-col-gutter-md">
          <div>
            <q-btn
              :label="$t('dashboard.menu.reorder')"
              color="primary"
              outline
              icon="mdi-sort-variant"
              to="/dashboard/menu/reorder"
            />
          </div>
          <div>
            <q-btn
              :label="$t('dashboard.menu.newCategory')"
              color="primary"
              unelevated
              to="/dashboard/menu/categories/new"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';
import { map, sum } from 'ramda';

import { IProductCategory } from '@models/IProductCategory';

@Options({
  components: {
  },
})
export default class MainMenuHeader extends Vue {
  @Prop({ required: true }) categories!: IProductCategory[];

  get totalProductsCount() {
    return sum(map((category: IProductCategory) => {
      return category.products.length;
    }, this.categories));
  }
}
</script>

<style lang="scss" scoped>
.menu-header {
  border: 1px solid $separator-color;
  border-radius: $generic-border-radius;

  .title {
    font-size: 18px;
  }
}
</style>
