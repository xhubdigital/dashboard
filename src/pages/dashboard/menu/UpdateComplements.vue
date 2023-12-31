<template>
  <basic-side-dialog
    :title="$t('dashboard.menu.editComplements')"
    @left-action-click="$router.back"
  >
    <template #default>
      <div
        v-if="product.loading"
        class="fit flex flex-center"
      >
        <q-spinner
          color="primary"
          size="80px"
        />
      </div>
      <div v-else>
        <div class="flex q-pa-md q-col-gutter-md no-wrap items-center">
          <div>
            <div
              class="picture"
              :style="{ backgroundImage: `url(${productImage})` }"
            />
          </div>
          <div class="details">
            <div class="label text-bold h-title">
              {{ product.data?.label }}
            </div>
            <div class="description text-grey">
              {{ product.data?.description }}
            </div>
          </div>
        </div>
        <div
          v-if="product.data && product.data.complementGroups.length > 0"
          class="complement-groups"
        >
          <vue-draggable
            v-model="product.data.complementGroups"
            item-key="id"
          >
            <template #item="{ element, index }">
              <div class="complement-group q-pa-md flex no-wrap items-center">
                <div>
                  <q-icon
                    class="handle"
                    size="xs"
                    name="mdi-drag-vertical"
                  />
                </div>
                <div class="q-px-sm">
                  {{ element.complementGroup.label }}
                </div>
                <q-space />
                <div>
                  <q-btn
                    round
                    flat
                    size="sm"
                    color="negative"
                    icon="mdi-delete"
                    @click="removeItem(index)"
                  />
                </div>
              </div>
            </template>
          </vue-draggable>
        </div>
        <div
          v-else
          class="q-pa-md text-center"
        >
          <div>{{ $t('dashboard.menu.noComplementsMessage') }}</div>
          <div>{{ $t('dashboard.menu.noComplementsCaption') }}</div>
        </div>
        <div class="q-pa-md">
          <v-form v-slot="{ handleSubmit }">
            <q-form
              class="row q-col-gutter-md items-center"
              @submit="handleSubmit(addItem)"
            >
              <div class="col">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  :label="$t('dashboard.menu.selectComplementGroup')"
                  name="complementGroup"
                  rules="required"
                >
                  <select-input
                    ref="complementGroup"
                    :label="$t('dashboard.menu.selectComplementGroup')"
                    autofocus
                    :options="preparedComplementGroups"
                    :loading="complementGroups.loading"
                    map-options
                    emit-value
                    use-input
                    input-debounce="0"
                    :model-value="field.value"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:model-value="handleChange"
                    @filter="filterComplementGroups"
                  />
                </v-field>
              </div>
              <div class="col-auto">
                <q-btn
                  type="submit"
                  icon="mdi-plus"
                  color="positive"
                  round
                  unelevated
                />
              </div>
            </q-form>
          </v-form>
        </div>
      </div>
    </template>
    <template #bottom>
      <div class="flex q-pa-md">
        <q-space />
        <q-btn
          :label="$t('common.save')"
          color="positive"
          unelevated
          :loading="saving"
          @click="updateProductComplements"
        />
      </div>
    </template>
  </basic-side-dialog>
</template>

<script lang="ts">
import { Vue, Options, Ref } from 'vue-property-decorator';
import { Form, Field, FormActions } from 'vee-validate';
import VueDraggable from 'vuedraggable';
import { pathOr, remove } from 'ramda';
import { QSelect } from 'quasar';

import { ILoadable } from '@helpers/ILoadable';
import { IProduct } from '@models/IProduct';
import { IComplementGroup } from '@models/IComplementGroup';
import { getProduct, updateProductComplements } from '@api/products';
import { getComplementGroups } from '@api/complementGroups';

import placeHolderImage from '@assets/placeholder-image.png';
import BasicSideDialog from '@layouts/BasicSideDialog.vue';
import SelectInput from '@components/form/SelectInput.vue';

interface IFormData {
  complementGroup: IComplementGroup;
}

@Options({
  components: {
    VForm: Form,
    VField: Field,
    BasicSideDialog,
    SelectInput,
    VueDraggable,
  },
})
export default class UpdateComplements extends Vue {
  @Ref('complementGroup') complementGroupRef!: QSelect;

  saving: boolean = false;

  product: ILoadable<IProduct | null> = {
    data: null,
    loading: false,
  };

  complementGroups: ILoadable<IComplementGroup[]> = {
    data: [],
    loading: false,
  };
  filteredComplementGroups: IComplementGroup[] = [];

  get productImage() {
    return pathOr(placeHolderImage, ['data', 'picture'], this.product);
  }

  get preparedComplementGroups() {
    return this.filteredComplementGroups.map((complementGroup) => {
      return { label: complementGroup.label, value: complementGroup };
    });
  }

  created() {
    void this.loadProduct();
    void this.loadComplementGroups();
  }

  async loadProduct() {
    const id = this.$route.params.id as string;

    try {
      this.product.loading = true;

      this.product.data = await getProduct(id);
    } finally {
      this.product.loading = false;
    }
  }

  async loadComplementGroups() {
    try {
      this.complementGroups.loading = true;

      this.complementGroups.data = await getComplementGroups();
      this.filteredComplementGroups = this.complementGroups.data;
    } finally {
      this.complementGroups.loading = false;
    }
  }

  addItem(
    { complementGroup }: IFormData,
    actions: FormActions<Record<string, unknown>>,
  ) {
    this.product.data?.complementGroups.push({
      complementGroup,
      complementGroupId: complementGroup.id,
      productId: this.product.data.id,
    });

    actions.resetForm();

    this.complementGroupRef.focus();
  }

  removeItem(index: number) {
    if (!this.product.data) {
      return;
    }

    this.product.data.complementGroups = remove(
      index,
      1,
      this.product.data.complementGroups,
    );
  }

  filterComplementGroups(
    filter: string,
    update: (callback: () => void) => void,
  ) {
    if (filter === '') {
      update(() => {
        this.filteredComplementGroups = this.complementGroups.data;
      });

      return;
    }

    update(() => {
      const filterLower = filter.toLowerCase();

      this.filteredComplementGroups =this.complementGroups.data
        .filter(({ label }: IComplementGroup) => {
          return label.toLowerCase().indexOf(filterLower) !== -1;
        });
    });
  }

  async updateProductComplements() {
    const notifications = 'dashboard.menu.notifications';
    try {
      if (!this.product.data) {
        return;
      }

      this.saving = true;

      await updateProductComplements(
        this.product.data,
        this.product.data.complementGroups.map((complementGroup) => {
          return complementGroup.complementGroupId;
        }),
      );

      this.$q.notify({
        type: 'positive',
        message:
          this.$t(`${notifications}.updateProductComplementsSuccess.message`),
      });

      void this.$router.push({ name: 'menu/main-menu' });
    } catch {
      this.$q.notify({
        type: 'negative',
        message: this.$t(
          `${notifications}.updateProductComplementsGenericError.message`,
        ),
        caption: this.$t(
          `${notifications}.updateProductComplementsGenericError.caption`,
        ),
      });
    } finally {
      this.saving = false;
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
  .label {
    font-size: 1.4rem;
  }

  .description {
    font-size: 0.8rem;
    color: #545563;
  }
}

.complement-groups {
  border-top: 1px solid $separator-color;
}

.complement-group {
  border-bottom: 1px solid $separator-color;

  .handle {
    cursor: move;
  }
}
</style>
