<template>
  <div
    v-if="editingProduct.loading"
    class="fit flex flex-center"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <v-form
    v-else
    v-slot="{ values, handleSubmit, meta, isSubmitting }"
    class="product-form fit"
    :initial-values="initialValue"
  >
    <q-form
      class="fit"
      @submit="handleSubmit(saveProduct)"
    >
      <basic-side-dialog
        :title="title"
        @left-action-click="$router.back"
      >
        <template #top>
          <q-tabs
            v-model="activeTab"
            align="left"
            active-color="primary"
            no-caps
          >
            <q-tab name="details">
              {{ $t('dashboard.menu.details') }}
            </q-tab>
            <q-tab name="inventory">
              {{ $t('dashboard.menu.inventory') }}
            </q-tab>
          </q-tabs>
        </template>
        <template #default>
          <q-tab-panels
            v-model="activeTab"
            keep-alive
          >
            <q-tab-panel name="details">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <v-field
                    v-slot="{ field, handleChange, errorMessage }"
                    :label="$t('dashboard.menu.productPicture')"
                    name="picture"
                    :rules="typeof values.picture === 'string'
                      ? null : 'image|size:2048'"
                  >
                    <image-input
                      :label="$t('dashboard.menu.productPicture')"
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
                    :label="$t('dashboard.menu.productName')"
                    name="label"
                    rules="required"
                  >
                    <text-input
                      :label="$t('dashboard.menu.productName')"
                      maxlength="50"
                      counter
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
                    :label="$t('dashboard.menu.productCategory')"
                    name="categoryId"
                    rules="required"
                  >
                    <select-input
                      :label="$t('dashboard.menu.productCategory')"
                      :options="getParsedCategories"
                      map-options
                      emit-value
                      :display-value="categories.loading ? '' : undefined"
                      :loading="categories.loading"
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
                    :label="$t('dashboard.menu.productDescription')"
                    name="description"
                  >
                    <text-input
                      :label="$t('dashboard.menu.productDescription')"
                      maxlength="300"
                      counter
                      autogrow
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
                    :label="$t('dashboard.menu.productPrice')"
                    rules="required"
                    name="price"
                  >
                    <currency-input
                      class="product-price"
                      :label="$t('dashboard.menu.productPrice')"
                      :model-value="field.value"
                      :error="!!errorMessage"
                      :error-message="errorMessage"
                      @update:model-value="handleChange"
                    />
                  </v-field>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="inventory">
              <div class="inventory q-col-gutter-md">
                <div class="label">
                  {{ $t('dashboard.menu.supplies') }}
                </div>
                <div class="supplies-list q-col-gutter-md">
                  <v-field
                    v-slot="{ field, handleChange }"
                    name="inventoryItems"
                  >
                    <supplies-input
                      :inventory-items="inventoryItems.data"
                      :loading="inventoryItems.loading"
                      :model-value="field.value"
                      @update:model-value="handleChange"
                      @new-inventory-item="onNewInventoryItem"
                    />
                  </v-field>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </template>
        <template #bottom>
          <div class="flex q-pa-md">
            <q-btn
              v-if="activeTab === 'details'"
              :label="$t('dashboard.menu.setupInventory')"
              color="primary"
              unelevated
              :disable="isSubmitting"
              @click="activeTab = 'inventory'"
            />
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

import { getProductCategories } from '@api/productCategories';
import { getInventoryItems } from '@api/inventory';
import { getProduct, saveProduct, updateProduct } from '@api/products';
import { ILoadable } from '@helpers/ILoadable';
import { convertEntityFiles } from '@helpers/format/convertEntityFiles';
import { IProduct } from '@models/IProduct';
import { IProductCategory } from '@models/IProductCategory';
import { IInventoryItem } from '@models/IInventoryItem';

import BasicSideDialog from '@layouts/BasicSideDialog.vue';
import CurrencyInput from '@components/form/CurrencyInput.vue';
import TextInput from '@components/form/TextInput.vue';
import NumberInput from '@components/form/NumberInput.vue';
import SelectInput from '@components/form/SelectInput.vue';
import ImageInput from '@components/form/ImageInput.vue';
import SuppliesInput from '@components/dashboard/menu/product-form/SuppliesInput.vue';

@Options({
  components: {
    VForm: Form,
    VField: Field,
    BasicSideDialog,
    CurrencyInput,
    TextInput,
    NumberInput,
    SelectInput,
    ImageInput,
    SuppliesInput,
  },
})
export default class ProductForm extends Vue {
  editingProduct: ILoadable<IProduct | null> = {
    loading: false,
    data: null,
  };

  categories: ILoadable<IProductCategory[]> = {
    loading: false,
    data: [],
  };

  inventoryItems: ILoadable<IInventoryItem[]> = {
    loading: false,
    data: [],
  };

  activeTab: string = 'details';

  get title() {
    return this.editingProduct.data?.id
      ? this.$t('dashboard.menu.editingProduct')
      : this.$t('dashboard.menu.creatingProduct');
  }

  get initialValue(): Partial<IProduct> {
    if (this.editingProduct.data) {
      return {
        ...clone(this.editingProduct.data),
        category: {
          id: this.editingProduct.data.category.id,
        } as IProductCategory,
      };
    }

    const categoryId = String(this.$route.query.category);

    return {
      price: 0,
      categoryId: categoryId,
      inventoryItems: [],
    };
  }

  get getParsedCategories() {
    return this.categories.data?.map((category: IProductCategory) => {
      const { id, label } = category;

      return { value: id, label };
    });
  }

  async mounted() {
    void this.loadCategories();
    void this.loadInventoryItems();

    const id = this.$route.params.id as string;

    if (id) {
      await this.loadProduct(id);
    }
  }

  async loadProduct(id: string) {
    try {
      this.editingProduct.loading = true;

      this.editingProduct.data = await getProduct(id);
    } finally {
      this.editingProduct.loading = false;
    }
  }

  async loadCategories() {
    try {
      this.categories.loading = true;

      this.categories.data = await getProductCategories();
    } finally {
      this.categories.loading = false;
    }
  }

  async loadInventoryItems() {
    try {
      this.inventoryItems.loading = true;

      this.inventoryItems.data = await getInventoryItems();
    } finally {
      this.inventoryItems.loading = false;
    }
  }

  async saveProduct(formData: IProduct) {
    const id = this.editingProduct.data?.id;

    const formDataWithPicture = await convertEntityFiles(formData, ['picture']);

    const product = {
      ...formDataWithPicture,
      inventoryItems: formDataWithPicture.inventoryItems.filter((item) => {
        return item.inventoryItemId;
      }),
    };

    if (id) {
      await this.updateProduct(id, product);
    } else {
      await this.saveNewProduct(product);
    }
  }

  async saveNewProduct(product: IProduct) {
    await saveProduct(product);

    void this.$router.push({ name: 'menu/main-menu' });
  }

  async updateProduct(id: string, product: IProduct) {
    await updateProduct(id, product);

    void this.$router.push({ name: 'menu/main-menu' });
  }

  onNewInventoryItem(inventoryItem: IInventoryItem) {
    this.inventoryItems.data.push(inventoryItem);
  }
}
</script>

<style lang="scss" scoped>
.product-form {
  .product-price {
    ::v-deep(.q-field__control) {
      font-size: 1.1rem;
    }

    ::v-deep(.q-field__prefix), ::v-deep(.q-field__native) {
      font-weight: bold;
    }
  }
}

.inventory {
  .label {
    font-size: 1.4rem;
    font-weight: bold;
  }
}
</style>
