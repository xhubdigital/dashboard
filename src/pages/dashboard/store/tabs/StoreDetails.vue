<template>
  <div>
    <div
      v-if="restaurant.loading"
      class="q-pa-xl flex flex-center"
    >
      <q-spinner
        color="primary"
        size="80px"
      />
    </div>
    <div
      v-else
      class="store-form"
    >
      <v-form
        v-slot="{ handleSubmit, values, meta, setFieldValue, isSubmitting }"
        :initial-values="restaurant.data"
      >
        <q-form
          class="row q-py-xl"
          @submit="handleSubmit(updateStore)"
        >
          <div class="content row q-col-gutter-md">
            <div class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.banner')"
                name="banner"
                :rules="
                  typeof values.banner === 'string' ? null : 'image|size:2048'
                "
              >
                <image-input
                  class="banner-input"
                  :label="$t('dashboard.store.banner')"
                  accept=".jpg, image/*"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12 picture-input-container flex flex-center">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.picture')"
                name="picture"
                :rules="
                  typeof values.picture === 'string' ? null : 'image|size:2048'
                "
              >
                <image-input
                  class="picture-input"
                  accept=".jpg, image/*"
                  round
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage, meta: fMeta }"
                :label="$t('dashboard.store.url')"
                name="url"
                rules="required|url-available"
              >
                <url-input
                  :label="$t('dashboard.store.url')"
                  name="url"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  :loading="fMeta.pending"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12 col-sm-6">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.name')"
                name="name"
                rules="required"
              >
                <text-input
                  :label="$t('dashboard.store.name')"
                  name="name"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12 col-sm-6">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.id')"
                name="id"
              >
                <text-input
                  :label="$t('dashboard.store.id')"
                  name="id"
                  :model-value="field.value"
                  readonly
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                >
                  <template #append>
                    <q-btn
                      flat
                      round
                      icon="mdi-content-copy"
                      size="sm"
                      @click="copyStoreId(field.value)"
                    />
                  </template>
                </text-input>
              </v-field>
            </div>
            <div class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.description')"
                name="description"
              >
                <text-input
                  :label="$t('dashboard.store.description')"
                  name="description"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12 col-sm-6">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.preparationTime')"
                name="preparationTime"
                rules="required"
              >
                <number-input
                  :label="$t('dashboard.store.preparationTime')"
                  name="preparationTime"
                  :model-value="field.value"
                  :hint="$t('dashboard.store.preparationTimeHint')"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12 col-sm-6">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.minimumOrderValue')"
                name="minimumOrder"
                rules="required"
              >
                <currency-input
                  :label="$t('dashboard.store.minimumOrderValue')"
                  name="minimumOrder"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12">
              <div class="h-title m-title">
                {{ $t('dashboard.store.address') }}
              </div>
            </div>
            <div class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.zipCode')"
                name="address.zipCode"
                rules="required"
              >
                <text-input
                  ref="zipCodeInput"
                  :label="$t('dashboard.store.zipCode')"
                  name="address.zipCode"
                  mask="#####-###"
                  :model-value="field.value"
                  :loading="loadingAddressByZipCode"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="
                    onChangeZipCode(handleChange, setFieldValue, $event)
                  "
                />
              </v-field>
            </div>
            <div class="col-12 col-sm-6">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.state')"
                name="address.state"
                rules="required"
              >
                <text-input
                  :label="$t('dashboard.store.state')"
                  name="address.state"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12 col-sm-6">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.city')"
                name="address.city"
                rules="required"
              >
                <text-input
                  :label="$t('dashboard.store.city')"
                  name="address.city"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12 col-sm-6">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.streetName')"
                name="address.streetName"
                rules="required"
              >
                <text-input
                  :label="$t('dashboard.store.streetName')"
                  name="address.streetName"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12 col-sm-6">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.neighborhood')"
                name="address.neighborhood"
                rules="required"
              >
                <text-input
                  :label="$t('dashboard.store.neighborhood')"
                  name="address.neighborhood"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12 col-sm-6">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.number')"
                name="address.number"
                rules="required"
              >
                <text-input
                  ref="addressNumberInput"
                  :label="$t('dashboard.store.number')"
                  name="address.number"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12 col-sm-6">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('dashboard.store.complement')"
                name="address.complement"
              >
                <text-input
                  :label="$t('dashboard.store.complement')"
                  name="address.complement"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  @update:model-value="handleChange"
                />
              </v-field>
            </div>
          </div>
          <div class="col-12 separator">
            <q-separator
              color="separator-color"
              inset
            />
          </div>
          <div class="col-12 flex">
            <div>
              <q-btn
                outline
                rounded
                no-caps
                color="negative"
                :label="$t('dashboard.store.logout')"
                @click="signOut"
              />
            </div>
            <q-space />
            <div>
              <q-btn
                :label="$t('dashboard.store.saveChanges')"
                type="submit"
                class="q-btn"
                color="primary"
                unelevated
                no-caps
                :disable="!meta.dirty"
                :loading="isSubmitting"
              />
            </div>
          </div>
        </q-form>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Ref } from 'vue-property-decorator';
import { mapActions, mapMutations } from 'vuex';
import { Form, Field, FormActions } from 'vee-validate';
import { scroll, copyToClipboard, QInput } from 'quasar';
import { path, pathOr } from 'ramda';

import {
  getAddressByZipCode,
  getUserRestaurant,
  updateRestaurant,
} from '@api/restaurants';
import { IRestaurant } from '@models/IRestaurant';
import { ILoadable } from '@helpers/ILoadable';
import { convertEntityFiles } from '@helpers/format/convertEntityFiles';

import CurrencyInput from '@components/form/CurrencyInput.vue';
import ImageInput from '@components/form/ImageInput.vue';
import TextInput from '@components/form/TextInput.vue';
import NumberInput from '@components/form/NumberInput.vue';
import UrlInput from '@components/dashboard/store/URLInput.vue';

const { getScrollTarget, setVerticalScrollPosition } = scroll;

@Options({
  components: {
    VForm: Form,
    VField: Field,
    CurrencyInput,
    ImageInput,
    TextInput,
    NumberInput,
    UrlInput,
  },
  methods: {
    ...mapActions('user', [
      'logout',
    ]),
    ...mapMutations('user', [
      'updateRestaurant',
    ]),
  },
})
export default class SignIn extends Vue {
  @Ref('addressNumberInput') addressNumberInputRef!: QInput;
  @Ref('zipCodeInput') zipCodeInputRef!: QInput;

  logout!: () => Promise<void>;
  updateRestaurant!: (restaurant: IRestaurant) => void;

  restaurant: ILoadable<IRestaurant | null> = {
    data: null,
    loading: false,
  };

  loadingAddressByZipCode: boolean = false;

  created() {
    void this.loadRestaurant();
  }

  performActions() {
    const action = path(['params', 'action'], this.$route);

    if (action === 'edit-address') {
      this.zipCodeInputRef.focus();

      const target = getScrollTarget(this.zipCodeInputRef.$el);
      const offsetTop = pathOr(0, ['$el', 'offsetTop'], this.zipCodeInputRef);

      setVerticalScrollPosition(target, offsetTop, 300);
    }
  }

  async loadRestaurant() {
    try {
      this.restaurant.loading = true;

      this.restaurant.data = await getUserRestaurant();

      setTimeout(() => {
        this.performActions();
      });
    } finally {
      this.restaurant.loading = false;
    }
  }

  async onChangeZipCode(
    handleChange: (value: string) => void,
    updateFormValue: (key: string, value: unknown) => void,
    zipCode: string,
  ) {
    handleChange(zipCode);

    if (zipCode.length === 9) {
      try {
        this.loadingAddressByZipCode = true;

        const address = await getAddressByZipCode(zipCode.replace('-', ''));

        updateFormValue('address', {
          id: this.restaurant.data?.address?.id,
          ...address,
        });

        this.addressNumberInputRef.focus();
      } finally {
        this.loadingAddressByZipCode = false;
      }
    }
  }

  async updateStore(
    restaurant: IRestaurant,
    actions: FormActions<Record<string, unknown>>,
  ) {
    try {
      const updatedRestaurant = await convertEntityFiles(
        restaurant,
        ['banner', 'picture'],
      );

      this.restaurant.data = await updateRestaurant(updatedRestaurant);

      setTimeout(actions.resetForm);

      this.updateRestaurant(this.restaurant.data);

      this.$q.notify({
        type: 'positive',
        message:
          this.$t('dashboard.store.notifications.updateStoreSuccess.message'),
      });
    } catch {
      this.$q.notify({
        type: 'negative',
        message: this.$t(
          'dashboard.store.notifications.updateStoreGenericError.message',
        ),
        caption: this.$t(
          'dashboard.store.notifications.updateStoreGenericError.caption',
        ),
      });
    }
  }

  copyStoreId(id: string) {
    void copyToClipboard(id);

    this.$q.notify({
      type: 'positive',
      message:
        this.$t('dashboard.store.details.notifications.storeIdCopied.message'),
    });
  }

  signOut() {
    void this.logout();
    void this.$router.push('/');
  }
}
</script>

<style lang="scss" scoped>
.store-form {
  @media (min-width: $breakpoint-sm-min) {
    padding: 20px;
    border: 1px solid $separator-color;
    border-radius: $generic-border-radius;
  }
}

.m-title {
  font-size: 18px;
}

form {
  padding: 0;
}

.banner-input {
  ::v-deep(.q-img) {
    height: 180px !important;
  }
}

.picture-input-container {
  margin-top: -96px;
}

.picture-input {
  ::v-deep(.q-field__control) {
    background: transparent !important;
  }

  ::v-deep(.q-img) {
    background: white !important;
    height: 120px !important;
    width: 120px !important;
  }
}

.content {
  width: 100%;
}

.separator {
  width: 100%;
  padding: 0;
  margin: 20px 0;
}
</style>
