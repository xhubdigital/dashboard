<template>
  <div
    v-if="categories.loading"
    class="fit flex flex-center"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <basic-side-dialog
    title="Reordenar produtos"
    @left-action-click="$router.back"
  >
    <template #default>
      <div class="row">
        <div class="col-6">
          <vue-draggable
            v-model="categories.data"
            item-key="id"
            @end="onDragEndCategory"
          >
            <template #item="{ element: category }">
              <div
                class="category flex no-wrap"
                @click="selectedCategory = category"
              >
                <div>
                  <q-icon
                    class="handle"
                    size="xs"
                    name="mdi-drag-vertical"
                  />
                </div>
                <div
                  class="label ellipsis"
                  :class="{ active: selectedCategory === category }"
                >
                  {{ category.label }}
                </div>
                <q-space />
                <div v-if="category.id === updatingCategoryId">
                  <q-spinner color="primary" />
                </div>
              </div>
            </template>
          </vue-draggable>
        </div>
        <div class="products-list">
          <div v-if="selectedCategory">
            <vue-draggable
              v-model="selectedCategory.products"
              item-key="id"
              @end="onDragEndProduct"
            >
              <template #item="{ element: product }">
                <div class="product flex no-wrap">
                  <div>
                    <q-icon
                      class="handle"
                      size="xs"
                      name="mdi-drag-vertical"
                    />
                  </div>
                  <div class="label ellipsis">
                    {{ product.label }}
                  </div>
                  <q-space />
                  <div v-if="product.id === updatingProductId">
                    <q-spinner color="primary" />
                  </div>
                </div>
              </template>
            </vue-draggable>
          </div>
        </div>
      </div>
    </template>
  </basic-side-dialog>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';
import VueDraggable from 'vuedraggable';
import { pathOr } from 'ramda';

import { ILoadable } from '@helpers/ILoadable';
import { IProductCategory } from '@models/IProductCategory';
import { getProductCategoriesAndProducts, reorderProductCategory } from '@api/productCategories';
import { reorderProduct } from '@api/products';

import BasicSideDialog from '@layouts/BasicSideDialog.vue';

@Options({
  components: {
    BasicSideDialog,
    VueDraggable,
  },
})
export default class ReorderProducts extends Vue {
  categories: ILoadable<IProductCategory[]> = {
    loading: false,
    data: [],
  };

  updatingCategoryId: string | null = null;
  updatingProductId: string | null = null;

  selectedCategory: IProductCategory | null = null;

  created() {
    void this.loadCategories();
  }

  async loadCategories() {
    try {
      this.categories.loading = true;

      this.categories.data = await getProductCategoriesAndProducts();

      this.categories.loading = false;
    } catch {
      this.categories.loading = false;
    }
  }

  async onDragEndCategory(event: unknown) {
    const notifications = 'dashboard.menu.notifications';

    try {
      const oldIndex = pathOr(0, ['oldIndex'], event);
      const newIndex = pathOr(0, ['newIndex'], event);

      if (oldIndex === newIndex) {
        return;
      }

      const category = this.categories.data[newIndex];

      this.updatingCategoryId = category.id;

      const isBefore = oldIndex > newIndex;

      await reorderProductCategory(
        category,
        newIndex,
        isBefore,
      );

      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.categoryReorderSuccess.message`),
      });
    } catch {
      this.$q.notify({
        type: 'negative',
        message:
          this.$t(`${notifications}.categoryReorderGenericError.message`),
        caption:
          this.$t(`${notifications}.categoryReorderGenericError.caption`),
      });
    } finally {
      this.updatingCategoryId = null;
    }
  }

  async onDragEndProduct(event: unknown) {
    const notifications = 'dashboard.menu.notifications';

    try {
      const oldIndex = pathOr(0, ['oldIndex'], event);
      const newIndex = pathOr(0, ['newIndex'], event);

      if (!this.selectedCategory || oldIndex === newIndex) {
        return;
      }

      const product = this.selectedCategory.products[newIndex];

      this.updatingProductId = product.id;

      const isBefore = oldIndex > newIndex;

      await reorderProduct(
        product,
        newIndex,
        isBefore,
      );

      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.productReorderSuccess.message`),
      });
    } catch {
      this.$q.notify({
        type: 'negative',
        message: this.$t(`${notifications}.productReorderGenericError.message`),
        caption: this.$t(`${notifications}.productReorderGenericError.caption`),
      });
    } finally {
      this.updatingProductId = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.products-list {
  width: calc(50% + 1px);
  margin-left: -1px;
}

.category, .product {
  border: 1px solid $separator-color;
  padding: 12px;

  .label {
    padding: 0 8px;

    &.active {
      font-weight: bold;
    }
  }

  .handle {
    cursor: move;
  }
}
</style>
