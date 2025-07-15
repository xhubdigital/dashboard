<template>
  <div class="product">
    <div class="q-pa-md">
      <div class="flex q-col-gutter-md no-wrap">
        <div>
          <div
            class="picture"
            :style="{ backgroundImage: `url(${productImage(productModel)})` }"
          />
        </div>
        <div class="details">
          <div class="label text-bold h-title">
            {{ productModel.label }}
          </div>
          <div class="description text-grey">
            {{ productModel.description }}
          </div>
        </div>
        <q-space />
        <div class="more-info q-col-gutter-lg">
          <div class="price">
            {{ formatPrice(productModel.price) }}
          </div>
          <div class="status">
            <h-btn-toggle
              :model-value="productModel.status"
              :options="statusOptions"
              :loading="changingStatus"
              @click.stop
              @update:model-value="changeProductStatus"
            />
          </div>
          <div class="actions">
            <q-btn
              icon="mdi-dots-horizontal"
              size="md"
              flat
              round
            >
              <q-menu
                anchor="bottom right"
                self="top right"
              >
                <q-list style="min-width: 100px">
                  <q-item
                    v-close-popup
                    clickable
                    @click="$emit('request-edit-product', productModel)"
                  >
                    <q-item-section avatar>
                      <q-icon name="mdi-pencil" />
                    </q-item-section>
                    <q-item-section>{{ $t('common.edit') }}</q-item-section>
                  </q-item>
                  <q-item
                    v-close-popup
                    clickable
                    @click="$emit('request-edit-complements', productModel)"
                  >
                    <q-item-section avatar>
                      <q-icon name="mdi-food" />
                    </q-item-section>
                    <q-item-section>
                      {{ $t('dashboard.menu.complements') }}
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-close-popup
                    clickable
                    @click="$emit('request-delete-product', productModel)"
                  >
                    <q-item-section avatar>
                      <q-icon name="mdi-delete" />
                    </q-item-section>
                    <q-item-section>{{ $t('common.delete') }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Model } from 'vue-property-decorator';

import { updateProduct } from '@api/products';
import { moneyToString } from '@helpers/format/moneyToString';
import { IProduct } from '@models/IProduct';

import placeHolderImage from '@assets/placeholder-image.png';
import HBtnToggle from '@components/common/HBtnToggle.vue';

@Options({
  components: {
    HBtnToggle,
  },
  emits: [
    'request-edit-product',
    'request-edit-complements',
    'request-delete-product',
  ],
})
export default class ProductsListItem extends Vue {
  @Model('product') productModel!: IProduct;

  changingStatus: boolean = false;

  get statusOptions() {
    return [
      {
        value: false,
        label: this.$t('common.paused'),
      },
      {
        value: true,
        label: this.$t('common.activated'),
      },
    ];
  }

  productImage(product: IProduct) {
    const { picture } = product;

    return picture ? picture : placeHolderImage;
  }

  formatPrice(price: number) {
    return `R$ ${moneyToString(price)}`;
  }

  async changeProductStatus(status: boolean) {
    const notifications = 'dashboard.menu.notifications';

    try {
      this.changingStatus = true;

      const { id } = this.productModel;

      await updateProduct(id, { status });

      this.$emit('update:product', {
        ...this.productModel,
        status,
      });

      this.$q.notify({
        type: 'positive',
        message:
          this.$t(`${notifications}.updateProductStatusSuccess.message`),
      });
    } catch {
      this.$q.notify({
        type: 'negative',
        message:
          this.$t(`${notifications}.updateProductStatusGenericError.message`),
        caption:
          this.$t(`${notifications}.updateProductStatusGenericError.caption`),
      });
    } finally {
      this.changingStatus = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.product {
  background: #FFF;

  &:not(:last-child)::after {
    height: 1px;
    width: calc(100% - 32px);
    margin: 0 auto;
    background: $separator-color;
    content: '';
    display: block;
  }

  .handle {
    cursor: move;
    align-self: center;
  }

  .picture {
    width: 64px;
    height: 64px;
    border-radius: $generic-border-radius;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .details {
    .label {
      font-size: 1rem;
    }

    .description {
      font-size: 0.8rem;
      color: #545563;
    }
  }

  .more-info {
    display: flex;
    align-items: center;

    .price {
      font-size: 1.1rem;
      font-weight: bold;
      white-space: nowrap;
    }

    .actions {
      margin-right: 2rem;
    }
  }
}
</style>
