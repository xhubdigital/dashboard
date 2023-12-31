<template>
  <div
    v-if="editingComplementGroup.loading"
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
      @submit="handleSubmit(saveComplementGroup)"
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
                    :label="$t('dashboard.menu.complementGroupName')"
                    name="label"
                    rules="required"
                  >
                    <text-input
                      :label="$t('dashboard.menu.complementGroupName')"
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
                <div class="col-6">
                  <v-field
                    v-slot="{ field, handleChange }"
                    :label="$t('dashboard.menu.complementGroupMin')"
                    name="min"
                  >
                    <select-input
                      :label="$t('dashboard.menu.complementGroupMin')"
                      :model-value="field.value"
                      :options="[0, 1]"
                      @update:model-value="handleChange"
                    />
                  </v-field>
                </div>
                <div class="col-6">
                  <v-field
                    v-slot="{ field, handleChange }"
                    :label="$t('dashboard.menu.complementGroupMax')"
                    name="max"
                  >
                    <select-input
                      :label="$t('dashboard.menu.complementGroupMax')"
                      :model-value="field.value"
                      :options="maxOptions"
                      @update:model-value="handleChange"
                    />
                  </v-field>
                </div>
                <div class="col-12">
                  <v-field
                    v-slot="{ field, handleChange, errorMessage }"
                    :label="$t('dashboard.menu.complementGroupRepeatOption')"
                    name="repeatOption"
                  >
                    <single-checkbox
                      :label="$t('dashboard.menu.complementGroupRepeatOption')"
                      :model-value="field.value"
                      :error="!!errorMessage"
                      :error-message="errorMessage"
                      @update:model-value="handleChange"
                    />
                  </v-field>
                </div>
                <div class="col-12 h-title subtitle">
                  {{ $t('dashboard.menu.complementGroupOptions') }}
                </div>
                <div class="col-12">
                  <v-field
                    v-slot="{ field, handleChange }"
                    :label="$t('dashboard.menu.complementGroupRepeatOption')"
                    name="options"
                  >
                    <complement-group-options-field
                      :model-value="field.value"
                      @update:model-value="handleChange"
                    />
                  </v-field>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="inventory">
              <div class="q-col-gutter-md">
                <div class="col-12">
                  <v-field
                    v-slot="{ field, handleChange }"
                    :label="$t('dashboard.menu.complementGroupRepeatOption')"
                    name="options"
                  >
                    <options-supplies-field
                      :model-value="field.value"
                      @update:model-value="handleChange"
                    />
                  </v-field>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
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

import { getComplementGroup, saveComplementGroup, updateComplementGroup } from '@api/complementGroups';
import { ILoadable } from '@helpers/ILoadable';
import { IComplementGroup, IComplementGroupOption } from '@models/IComplementGroup';

import BasicSideDialog from '@layouts/BasicSideDialog.vue';
import TextInput from '@components/form/TextInput.vue';
import SelectInput from '@components/form/SelectInput.vue';
import SingleCheckbox from '@components/form/SingleCheckbox.vue';
import ComplementGroupOptionsField from '@components/dashboard/menu/complements/ComplementGroupOptionsField.vue';
import OptionsSuppliesField from '@components/dashboard/menu/complements/OptionsSuppliesField.vue';

interface IComplementGroupFormData {
  id?: string;
  label: string;
  min: number;
  max: number;
  repeatOption: boolean;
  options: IComplementGroupOption[];
}

@Options({
  components: {
    VForm: Form,
    VField: Field,
    BasicSideDialog,
    TextInput,
    SelectInput,
    SingleCheckbox,
    ComplementGroupOptionsField,
    OptionsSuppliesField,
  },
})
export default class ComplementGroupForm extends Vue {
  editingComplementGroup: ILoadable<IComplementGroup | null> = {
    loading: false,
    data: null,
  };

  saving: boolean = false;
  activeTab: string = 'details';

  get title() {
    return this.editingComplementGroup.data?.id
      ? this.$t('dashboard.menu.editingComplementGroup')
      : this.$t('dashboard.menu.creatingComplementGroup');
  }

  get initialValue(): Partial<IComplementGroupFormData> {
    const { data: group } = this.editingComplementGroup;

    if (group) {
      return {
        ...clone(group),
        min: group.required ? 1 : 0,
        max: group.multiple ? group.maxOptions : 1,
        options: group.options,
      };
    }

    return {
      min: 0,
      max: 1,
      repeatOption: false,
      options: [
        {
          label: '',
          price: 0,
          position: 0,
          inventoryItems: [],
        },
      ],
    };
  }

  get maxOptions(): number[] {
    return Array.from({ length: 50 }, (_, i) => i + 1);
  }

  async mounted() {
    const id = this.$route.params.id as string;

    if (id) {
      await this.loadComplementGroup(id);
    }
  }

  async loadComplementGroup(id: string) {
    try {
      this.editingComplementGroup.loading = true;

      this.editingComplementGroup.data = await getComplementGroup(id);
    } finally {
      this.editingComplementGroup.loading = false;
    }
  }

  async saveComplementGroup(complementGroup: IComplementGroupFormData) {
    try {
      this.saving = true;

      const id = this.editingComplementGroup.data?.id;

      const formattedComplementGroup = {
        ...complementGroup,
        maxOptions: complementGroup.max,
        required: complementGroup.min === 1,
        multiple: complementGroup.max > 1,
        options: complementGroup.options.map((option) => {
          return {
            ...option,
            inventoryItems: option.inventoryItems.filter((item) => {
              return item.inventoryItemId && item.amount;
            }),
          };
        }),
      };

      if (id) {
        await updateComplementGroup(id, formattedComplementGroup);
      } else {
        await saveComplementGroup(formattedComplementGroup);
      }

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
