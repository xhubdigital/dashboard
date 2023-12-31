<template>
  <div
    v-if="complementGroup.loading || categories.loading"
    class="fit flex flex-center"
  >
    <q-spinner
      color="primary"
      size="80px"
    />
  </div>
  <div
    v-else
    class="complement-group-product-form fit"
  >
    <q-form
      class="fit"
      @submit="connectComplementGroupToProducts"
    >
      <basic-side-dialog
        :title="$t('dashboard.menu.complementsToProductsTitle')"
        :sub-title="$t('dashboard.menu.complementsToProductsSubtitle')"
        @left-action-click="$router.back"
      >
        <template #default>
          <div class="q-pa-md q-col-gutter-md">
            <div>
              <text-input
                v-model="filter"
                placeholder="Pesquisar produto"
                autofocus
              >
                <template #append>
                  <q-icon name="mdi-magnify" />
                </template>
              </text-input>
            </div>
            <div>
              <q-tree
                v-model:ticked="connectedProducts"
                v-model:expanded="expanded"
                :nodes="filteredCategories"
                :filter="filter"
                node-key="id"
                children-key="products"
                tick-strategy="leaf"
                icon="mdi-chevron-right"
                no-connectors
                default-expand-all
              >
                <template #default-header="props">
                  <div
                    :class="{ 'text-bold': Boolean(props.node.products) }"
                    class="q-pa-xs"
                  >
                    {{ props.node.label }}
                  </div>
                </template>
              </q-tree>
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
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';

import { connectComplementGroupToProducts, getComplementGroup } from '@api/complementGroups';
import { ILoadable } from '@helpers/ILoadable';
import { IComplementGroup } from '@models/IComplementGroup';
import { IProductCategory } from '@models/IProductCategory';

import BasicSideDialog from '@layouts/BasicSideDialog.vue';
import SingleCheckbox from '@components/form/SingleCheckbox.vue';
import { getProductCategoriesAndProducts } from '@api/productCategories';
import TextInput from '@components/form/TextInput.vue';

@Options({
  components: {
    BasicSideDialog,
    SingleCheckbox,
    TextInput,
  },
})
export default class ComplementGroupToProductForm extends Vue {
  complementGroup: ILoadable<IComplementGroup | null | null> = {
    loading: false,
    data: null,
  };

  categories: ILoadable<IProductCategory[]> = {
    loading: false,
    data: [],
  };

  filter: string = '';
  expanded: string[] = [];
  connectedProducts: string[] = [];

  saving: boolean = false;

  get filteredCategories() {
    return this.categories.data?.filter((category: IProductCategory) => {
      return category.products.length > 0;
    });
  }

  mounted() {
    const id = this.$route.params.id as string;

    void this.loadComplementGroup(id);
    void this.loadCategories();
  }

  async loadComplementGroup(id: string) {
    try {
      this.complementGroup.loading = true;

      this.complementGroup.data = await getComplementGroup(id);

      const { connectedProducts } = this.complementGroup.data;
      this.connectedProducts = connectedProducts
        .map((row) => {
          return row.productId;
        });
    } finally {
      this.complementGroup.loading = false;
    }
  }

  async loadCategories() {
    try {
      this.categories.loading = true;

      this.categories.data = await getProductCategoriesAndProducts();
    } finally {
      this.categories.loading = false;
    }
  }

  async connectComplementGroupToProducts() {
    try {
      this.saving = true;

      await connectComplementGroupToProducts(
        this.complementGroup.data as IComplementGroup,
        this.connectedProducts,
      );

      void this.$router.push({ name: 'menu/complements' });
    } finally {
      this.saving = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.subtitle {
  font-size: 1.2rem;
}
</style>
