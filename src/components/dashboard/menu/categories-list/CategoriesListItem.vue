<template>
  <div class="category">
    <div
      class="q-pa-lg flex items-center cursor-pointer"
      @click="toggleOpened"
    >
      <div>
        <div class="label h-title">
          {{ categoryModel.label }}
        </div>
        <div class="quantity">
          {{ $t('dashboard.menu.productsCount', { count: productsCount }) }}
        </div>
      </div>
      <q-space />
      <div class="flex items-center q-col-gutter-md">
        <div>
          <h-btn-toggle
            :model-value="categoryModel.status"
            :options="statusOptions"
            :loading="changingStatus"
            @click.stop
            @update:model-value="changeCategoryStatus"
          />
        </div>
        <div>
          <q-btn
            class="open-btn"
            :class="{ 'rotate-180': !opened }"
            icon="mdi-chevron-up"
            color="primary"
            size="lg"
            round
            flat
          />
        </div>
      </div>
    </div>
    <q-slide-transition>
      <div v-show="opened">
        <q-separator />
        <products-list
          v-model:products="categoryModel.products"
          @request-edit-product="$emit('request-edit-product', $event)"
          @request-edit-complements="$emit('request-edit-complements', $event)"
          @request-delete-product="$emit('request-delete-product', $event)"
        />
        <q-separator />
        <div class="flex q-pa-lg q-col-gutter-md">
          <div>
            <q-btn
              :label="$t('dashboard.menu.deleteCategory')"
              color="negative"
              outline
              no-caps
              @click="$emit('request-delete-category', categoryModel)"
            />
          </div>
          <q-space />
          <div>
            <q-btn
              :label="$t('dashboard.menu.editCategory')"
              color="primary"
              flat
              no-caps
              @click="$emit('request-edit-category', categoryModel)"
            />
          </div>
          <div>
            <q-btn
              :label="$t('dashboard.menu.newProduct')"
              color="primary"
              unelevated
              no-caps
              @click="$emit('new-product', categoryModel)"
            />
          </div>
        </div>
      </div>
    </q-slide-transition>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Model } from 'vue-property-decorator';

import { updateProductCategory } from '@api/productCategories';
import { IProductCategory } from '@models/IProductCategory';

import HBtnToggle from '@components/common/HBtnToggle.vue';

import ProductsList from '../products-list';

@Options({
  components: {
    HBtnToggle,
    ProductsList,
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
export default class CategoriesListItem extends Vue {
  @Model('category') categoryModel!: IProductCategory;

  opened: boolean = false;
  changingStatus: boolean = false;

  get productsCount() {
    return this.categoryModel.products.length;
  }

  get statusOptions() {
    return [
      {
        value: false,
        label: 'Pausado',
      },
      {
        value: true,
        label: 'Ativado',
      },
    ];
  }

  toggleOpened() {
    this.opened = !this.opened;
  }

  async changeCategoryStatus(status: boolean) {
    const notifications = 'dashboard.menu.notifications';

    try {
      this.changingStatus = true;

      const { id } = this.categoryModel;

      await updateProductCategory(id, { status });

      this.$emit('update:category', {
        ...this.categoryModel,
        status,
      });

      this.$q.notify({
        type: 'positive',
        message:
          this.$t(`${notifications}.updateCategoryStatusSuccess.message`),
      });
    } catch {
      this.$q.notify({
        type: 'negative',
        message:
          this.$t(`${notifications}.updateCategoryStatusGenericError.message`),
        caption:
          this.$t(`${notifications}.updateCategoryStatusGenericError.caption`),
      });
    } finally {
      this.changingStatus = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.category {
  border: 1px solid $separator-color;
  border-radius: $generic-border-radius;

  .label {
    font-size: 1.2rem;
  }
}

.open-btn {
  transition: transform 0.3s ease;
}
</style>
