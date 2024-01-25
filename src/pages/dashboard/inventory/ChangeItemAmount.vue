<template>
  <div
    v-if="inventoryItem.loading"
    class="fit flex flex-center"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <v-form
    v-else
    v-slot="{ handleSubmit, meta, isSubmitting }"
    class="fit"
  >
    <q-form
      class="fit"
      @submit="handleSubmit(updateInventoryItemAmount)"
    >
      <basic-side-dialog
        :title="$t('dashboard.inventory.changeAmount')"
        @left-action-click="$router.back"
      >
        <template #default>
          <div>
            <div class="flex q-pa-md q-col-gutter-md no-wrap items-center">
              <div>
                <div
                  class="picture"
                  :style="{ backgroundImage: `url(${itemPicture})` }"
                />
              </div>
              <div class="details">
                <div class="label text-bold h-title">
                  {{ inventoryItem.data?.label }}
                </div>
                <div class="current-inventory">
                  <i18n-t keypath="dashboard.inventory.currentInventory">
                    <template #amount>
                      <span class="value">
                        {{ `${itemAmount} ${itemUnit}` }}
                      </span>
                    </template>
                  </i18n-t>
                </div>
              </div>
            </div>
            <q-separator />
            <div class="row q-pa-md">
              <div class="col-12">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  :label="$t('dashboard.inventory.variationField')"
                  name="change"
                  rules="required"
                >
                  <number-input
                    :label="$t('dashboard.inventory.variationField')"
                    autofocus
                    :model-value="field.value"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:model-value="handleChange"
                  />
                </v-field>
              </div>
              <div class="col-12">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  :label="$t('dashboard.inventory.itemPrice')"
                  name="price"
                  rules="required"
                >
                  <currency-input
                    :label="$t('dashboard.inventory.itemPrice')"
                    name="price"
                    :model-value="field.value"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:model-value="handleChange"
                  />
                </v-field>
              </div>
            </div>
          </div>
        </template>
        <template #bottom>
          <div class="flex q-pa-md">
            <q-space />
            <q-btn
              type="submit"
              :label="$t('common.save')"
              color="positive"
              unelevated
              :disable="!meta.dirty"
              :loading="isSubmitting"
            />
          </div>
        </template>
      </basic-side-dialog>
    </q-form>
  </v-form>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';
import { Form, Field } from 'vee-validate';
import { pathOr } from 'ramda';

import { getInventoryItem, updateInventoryItemAmount } from '@api/inventory';
import { ILoadable } from '@helpers/ILoadable';
import { IInventoryItem } from '@models/IInventoryItem';

import placeHolderImage from '@assets/placeholder-image.png';
import BasicSideDialog from '@layouts/BasicSideDialog.vue';
import NumberInput from '@components/form/NumberInput.vue';
import CurrencyInput from '@components/form/CurrencyInput.vue';

interface FormData {
  change: number;
  price: number;
}

@Options({
  components: {
    VForm: Form,
    VField: Field,
    BasicSideDialog,
    NumberInput,
    CurrencyInput,
  },
})
export default class InventoryItemForm extends Vue {
  inventoryItem: ILoadable<IInventoryItem | null> = {
    loading: false,
    data: null,
  };

  get itemPicture() {
    return pathOr(placeHolderImage, ['data', 'picture'], this.inventoryItem);
  }

  get itemAmount() {
    return pathOr(0, ['data', 'amount'], this.inventoryItem);
  }

  get itemUnit() {
    const unit = pathOr('unit', ['data', 'unit'], this.inventoryItem);

    return this.$t(`dashboard.inventory.unitsShort.${unit}`);
  }

  async mounted() {
    const id = this.$route.params.id as string;

    if (id) {
      await this.loadInventoryItem(id);
    }
  }

  async loadInventoryItem(id: string) {
    try {
      this.inventoryItem.loading = true;

      this.inventoryItem.data = await getInventoryItem(id);
    } finally {
      this.inventoryItem.loading = false;
    }
  }

  async updateInventoryItemAmount(formData: FormData) {
    const notifications = 'dashboard.inventory.notifications';

    try {
      const id = this.$route.params.id as string;

      await updateInventoryItemAmount(id, formData.change, formData.price);

      this.$q.notify({
        type: 'positive',
        message:
          this.$t(`${notifications}.updateInventoryItemAmountSuccess.message`),
      });

      void this.$router.push({ name: 'inventory/list' });
    } catch {
      this.$q.notify({
        type: 'negative',
        message: this.$t(
          `${notifications}.updateInventoryItemAmountGenericError.message`,
        ),
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.picture {
  width: 64px;
  height: 64px;
  border-radius: $generic-border-radius;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.details {
  font-size: 1.6rem;

  .current-inventory {
    font-size: 0.8rem;
    color: $grey-6;

    .value {
      font-weight: bold;
      color: $grey-8;
    }
  }
}
</style>
