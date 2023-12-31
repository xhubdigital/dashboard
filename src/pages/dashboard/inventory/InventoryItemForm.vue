<template>
  <div
    v-if="editingInventoryItem.loading"
    class="fit flex flex-center"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <v-form
    v-else
    v-slot="{ handleSubmit, values, meta, isSubmitting }"
    class="new-inventory-item fit"
    :initial-values="initialValue"
  >
    <q-form
      class="fit"
      @submit="handleSubmit(saveInventoryItem)"
    >
      <basic-side-dialog
        :title="title"
        @left-action-click="$router.back"
      >
        <template #default>
          <div class="row q-pa-md q-col-gutter-md">
            <div class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.inventory.itemPicture')"
                name="picture"
                :rules="
                  typeof values.picture === 'string' ? null : 'image|size:2048'
                "
              >
                <image-input
                  :label="$t('dashboard.inventory.itemPicture')"
                  accept=".jpg, image/*"
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
                :label="$t('dashboard.inventory.itemName')"
                name="label"
                rules="required"
              >
                <text-input
                  :label="$t('dashboard.inventory.itemName')"
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
                :label="$t('dashboard.inventory.itemUnit')"
                name="unit"
                rules="required"
              >
                <select-input
                  :label="$t('dashboard.inventory.itemUnit')"
                  :options="unitOptions"
                  map-options
                  emit-value
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
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
import { clone } from 'ramda';

import {
  getInventoryItem,
  saveInventoryItem,
  updateInventoryItem,
} from '@api/inventory';
import { ILoadable } from '@helpers/ILoadable';
import { convertEntityFiles } from '@helpers/format/convertEntityFiles';
import { IInventoryItem, IInventoryItemUnit } from '@models/IInventoryItem';

import BasicSideDialog from '@layouts/BasicSideDialog.vue';
import TextInput from '@components/form/TextInput.vue';
import SelectInput from '@components/form/SelectInput.vue';
import ImageInput from '@components/form/ImageInput.vue';

@Options({
  components: {
    VForm: Form,
    VField: Field,
    BasicSideDialog,
    TextInput,
    SelectInput,
    ImageInput,
  },
})
export default class InventoryItemForm extends Vue {
  editingInventoryItem: ILoadable<IInventoryItem | null> = {
    loading: false,
    data: null,
  };

  get title() {
    return this.editingInventoryItem.data?.id
      ? this.$t('dashboard.inventory.editingInventoryItem')
      : this.$t('dashboard.inventory.creatingInventoryItem');
  }

  get initialValue(): Partial<IInventoryItem> {
    if (this.editingInventoryItem.data) {
      return clone(this.editingInventoryItem.data);
    }

    return {
      unit: IInventoryItemUnit.Unit,
    };
  }

  get unitOptions() {
    return [
      {
        label: this.$t('dashboard.inventory.units.unit'),
        value: IInventoryItemUnit.Unit,
      },
      {
        label: this.$t('dashboard.inventory.units.liters'),
        value: IInventoryItemUnit.Liters,
      },
      {
        label: this.$t('dashboard.inventory.units.grams'),
        value: IInventoryItemUnit.Grams,
      },
      {
        label: this.$t('dashboard.inventory.units.kilos'),
        value: IInventoryItemUnit.Kilos,
      },
    ];
  }

  async mounted() {
    const id = this.$route.params.id as string;

    if (id) {
      await this.loadInventoryItem(id);
    }
  }

  async loadInventoryItem(id: string) {
    try {
      this.editingInventoryItem.loading = true;

      this.editingInventoryItem.data = await getInventoryItem(id);
    } finally {
      this.editingInventoryItem.loading = false;
    }
  }

  async saveInventoryItem(formData: IInventoryItem) {
    const id = this.editingInventoryItem.data?.id;

    const inventoryItem = await convertEntityFiles(formData, ['picture']);

    if (id) {
      await this.updateInventoryItem(id, inventoryItem);
    } else {
      await this.saveNewInventoryItem(inventoryItem);
    }
  }

  async saveNewInventoryItem(inventoryItem: IInventoryItem) {
    const notifications = 'dashboard.inventory.notifications';

    await saveInventoryItem(inventoryItem);

    this.$q.notify({
      type: 'positive',
      message: this.$t(`${notifications}.createInventoryItemSuccess.message`),
    });

    void this.$router.push({ name: 'inventory/list' });
  }

  async updateInventoryItem(id: string, inventoryItem: IInventoryItem) {
    const notifications = 'dashboard.inventory.notifications';

    try {
      await updateInventoryItem(id, inventoryItem);

      this.$q.notify({
        type: 'positive',
        message: this.$t(`${notifications}.updateInventoryItemSuccess.message`),
      });

      void this.$router.push({ name: 'inventory/list' });
    } catch {
      this.$q.notify({
        type: 'negative',
        message:
          this.$t(`${notifications}.updateInventoryItemGenericError.message`),
        caption:
          this.$t(`${notifications}.updateInventoryItemGenericError.caption`),
      });
    }
  }
}
</script>
