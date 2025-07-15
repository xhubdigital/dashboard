<template>
  <div>
    <div
      v-if="categories.loading"
      class="q-col-gutter-md"
    >
      <div>
        <q-skeleton height="80px" />
      </div>
      <div>
        <q-skeleton height="80px" />
      </div>
      <div>
        <q-skeleton height="80px" />
      </div>
      <div>
        <q-skeleton height="80px" />
      </div>
    </div>
    <div
      v-else
      class="q-col-gutter-md"
    >
      <div>
        <main-menu-header
          :categories="categories.data"
        />
      </div>
      <div>
        <categories-list
          v-model:categories="categories.data"
          @request-edit-category="openCategoryDialog"
          @request-delete-category="openDeleteCategoryDialog"
          @request-edit-product="openEditProductPage"
          @request-edit-complements="openEditComplementsPage"
          @request-delete-product="openDeleteProductDialog"
          @new-product="openNewProductPage"
        />
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <q-dialog
        class="right-side-dialog"
        :model-value="$route.meta.isDialog"
        :position="$q.screen.lt.sm ? 'bottom' : 'right'"
        maximized
        full-height
        no-route-dismiss
        @hide="$router.push('/dashboard/menu')"
      >
        <div class="content">
          <component :is="Component" />
        </div>
      </q-dialog>
    </router-view>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';
import { propEq, reject } from 'ramda';
import { RouteLocationNormalized } from 'vue-router';

import { ILoadable } from '@helpers/ILoadable';
import { IProduct } from '@models/IProduct';
import { IProductCategory } from '@models/IProductCategory';
import { getProductCategoriesAndProducts } from '@api/productCategories';

import MainMenuHeader from '@components/dashboard/menu/MainMenuHeader.vue';
import ProductForm from '@pages/dashboard/menu/ProductForm.vue';
import CategoriesList, {
  DeleteCategoryForm,
} from '@components/dashboard/menu/categories-list';
import { DeleteProductForm } from '@components/dashboard/menu/products-list';

@Options({
  components: {
    MainMenuHeader,
    ProductForm,
    CategoriesList,
  },
})
export default class MainMenu extends Vue {
  categories: ILoadable<IProductCategory[]> = {
    loading: false,
    data: [],
  };

  beforeRouteUpdate(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
  ) {
    if (to.name === 'menu/main-menu' ||
      from.name === 'menu/main-menu/add-product'
    ) {
      void this.loadCategories();
    }
  }

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

  openNewProductPage(category: IProductCategory) {
    void this.$router.push({
      path: '/dashboard/menu/new',
      query: { category: category.id },
    });
  }

  openCategoryDialog(category: IProductCategory) {
    const { id } = category;

    void this.$router.push({
      path: `/dashboard/menu/categories/${id}`,
    });
  }

  openDeleteCategoryDialog(category: IProductCategory) {
    this.$q.dialog({
      component: DeleteCategoryForm,
      componentProps: {
        category,
      },
    }).onOk(() => {
      this.categories.data =
        reject(propEq('id', category.id), this.categories.data || []);
    });
  }

  openEditProductPage(product: IProduct) {
    const { id } = product;

    void this.$router.push({
      name: 'menu/main-menu/edit-product',
      params: { id },
    });
  }

  openEditComplementsPage(product: IProduct) {
    const { id } = product;

    void this.$router.push({
      name: 'menu/main-menu/edit-complements',
      params: { id },
    });
  }

  openDeleteProductDialog(product: IProduct) {
    this.$q.dialog({
      component: DeleteProductForm,
      componentProps: {
        product,
      },
    }).onOk(() => {
      void this.loadCategories();
    });
  }
}
</script>
