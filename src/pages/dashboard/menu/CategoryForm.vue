<template>
  <div
    v-if="editingProductCategory.loading"
    class="fit flex flex-center"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <v-form
    v-else
    v-slot="{ handleSubmit }"
    class="product-form fit"
    :initial-values="initialValue"
  >
    <q-form
      class="fit"
      @submit="handleSubmit(saveProductCategory)"
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
                :label="$t('dashboard.menu.categoryName')"
                name="label"
                rules="required"
              >
                <text-input
                  :label="$t('dashboard.menu.categoryName')"
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
              :loading="saving"
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
  getProductCategory,
  saveProductCategory,
  updateProductCategory,
} from '@api/productCategories';
import { ILoadable } from '@helpers/ILoadable';
import { IProductCategory } from '@models/IProductCategory';

import BasicSideDialog from '@layouts/BasicSideDialog.vue';
import TextInput from '@components/form/TextInput.vue';

@Options({
  components: {
    VForm: Form,
    VField: Field,
    BasicSideDialog,
    TextInput,
  },
})
export default class CategoryForm extends Vue {
  editingProductCategory: ILoadable<IProductCategory | null> = {
    loading: false,
    data: null,
  };

  categories: ILoadable<IProductCategory[]> = {
    loading: false,
    data: [],
  };

  saving: boolean = false;

  get title() {
    return this.editingProductCategory.data?.id
      ? this.$t('dashboard.menu.editingCategory')
      : this.$t('dashboard.menu.creatingCategory');
  }

  get initialValue(): Partial<IProductCategory> {
    if (this.editingProductCategory.data) {
      return clone(this.editingProductCategory.data);
    }

    return {};
  }

  get getParsedCategories() {
    return this.categories.data?.map((category: IProductCategory) => {
      const { id, label } = category;

      return { value: { id }, label };
    });
  }

  async mounted() {
    const id = this.$route.params.id as string;

    if (id) {
      await this.loadCategory(id);
    }
  }

  async loadCategory(id: string) {
    try {
      this.editingProductCategory.loading = true;

      this.editingProductCategory.data = await getProductCategory(id);
    } finally {
      this.editingProductCategory.loading = false;
    }
  }

  async saveProductCategory(category: IProductCategory) {
    try {
      this.saving = true;

      const id = this.editingProductCategory.data?.id;

      if (id) {
        await updateProductCategory(id, category);
      } else {
        await saveProductCategory(category);
      }

      void this.$router.push({ name: 'menu/main-menu' });
    } finally {
      this.saving = false;
    }
  }
}
</script>
