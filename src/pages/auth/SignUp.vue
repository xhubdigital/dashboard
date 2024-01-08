<template>
  <v-form
    v-slot="{ handleSubmit/*, setFieldValue */}"
    :initial-values="initialValues"
  >
    <q-form
      ref="formulario"
      class="row q-py-xl"
      @submit="handleSubmit(signUp)"
    >
      <q-stepper
        ref="stepper"
        v-model="step"
        alternative-labels
        color="primary"
        animated
      >
        <q-step
          :name="1"
          :title="$t('auth.owner.title')"
          icon="settings"
          :done="step > 1"
          :header-nav="step > 1"
        >
          <q-page-container>
            <q-page class="row justify-center items-center">
              <div class="row justify-center q-pa-md">
                <div class="col-12 text-center self-center">
                  <div class="q-pa-lg q-pa-md-xl flex flex-center">
                    <div class="content">
                      <div class="sign-in">
                        <div class="h-title title q-pa-xs-md">
                          {{ $t('auth.owner.title') }}
                        </div>
                        <div class="caption">
                          {{ $t('auth.owner.caption') }}
                        </div>
                        <div class="row q-py-xl row q-col-gutter-md">
                          <div class="col-12 col-sm-6">
                            <v-field
                              v-slot="{ handleChange, errorMessage }"
                              :label="$t('auth.owner.name')"
                              name="name"
                              rules="required"
                            >
                              <text-input
                                v-model="name"
                                name="name"
                                :label="$t('auth.owner.name')"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              />
                            </v-field>
                          </div>
                          <div class="col-12 col-sm-6">
                            <v-field
                              v-slot="{ handleChange, errorMessage }"
                              :label="$t('auth.owner.taxpayerRegistry')"
                              name="taxpayerRegistry"
                              rules="required|min:14"
                            >
                              <text-input
                                v-model="taxpayerRegistry"
                                :label="$t('auth.owner.taxpayerRegistry')"
                                mask="###.###.###-##"
                                name="taxpayerRegistry"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              />
                            </v-field>
                          </div>
                          <div class="col-12 col-sm-6">
                            <v-field
                              v-slot="{ handleChange, errorMessage }"
                              :label="$t('auth.owner.email')"
                              name="email"
                              rules="required|email"
                            >
                              <text-input
                                v-model="email"
                                :label="$t('auth.owner.email')"
                                name="email"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              />
                            </v-field>
                          </div>
                          <div class="col-12 col-sm-6">
                            <v-field
                              v-slot="{ handleChange, errorMessage }"
                              :label="$t('auth.owner.phone')"
                              name="phone"
                              rules="required|min:14"
                            >
                              <text-input
                                v-model="phone"
                                :label="$t('auth.owner.phone')"
                                name="phone"
                                mask="(##)#####-####"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              />
                            </v-field>
                          </div>
                          <div class="col-12 q-py-md">
                            <q-stepper-navigation>
                              <q-btn
                                class="full-width"
                                color="primary"
                                unelevated
                                type="submit"
                                no-caps
                                :label="step === 3 ? 'Finish' : 'Continue'"
                              />
                            </q-stepper-navigation>
                          </div>
                        </div>
                        <div class="sign-in-text">
                          {{ $t('auth.alreadyHaveAccount') }}
                          <router-link
                            class="sign-in-link"
                            to="/"
                          >
                            {{ $t('auth.signInAccount') }}
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-page>
          </q-page-container>
        </q-step>
        <q-step
          :name="2"
          title="Create an ad group"
          caption="Optional"
          icon="create_new_folder"
          :done="step > 2"
          :header-nav="step > 2"
        >
          <q-stepper-navigation>
            <q-btn
              color="primary"
              label="Continue"
              @click="() => { done2 = true; step = 3 }"
            />
            <q-btn
              flat
              color="primary"
              label="Back"
              class="q-ml-sm"
              @click="step = 1"
            />
          </q-stepper-navigation>
        </q-step>
        <q-step
          :name="3"
          title="Create an ad"
          icon="add_comment"
          :header-nav="step > 3"
        >
          <q-stepper-navigation>
            <q-btn
              color="primary"
              label="Finish"
              @click="done3 = true"
            />
            <q-btn
              class="q-ml-sm"
              color="primary"
              label="Back"
              flat
              @click="step = 2"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-form>
  </v-form>
</template>

<script lang="ts">
import { Vue, Options, Ref } from 'vue-property-decorator';
import { mapActions, mapMutations } from 'vuex';
import { Form, Field, FormActions } from 'vee-validate';
import { QInput } from 'quasar';
import { DEFAULT_DASHBOARD_ROUTE } from 'src/router/routes';
import { IRegisterData } from '@api/auth';
import TextInput from '@components/form/TextInput.vue';
import {
  getAddressByZipCode,
  updateRestaurant,
} from '@api/restaurants';
import { IRestaurant } from '@models/IRestaurant';
import { ILoadable } from '@helpers/ILoadable';
import { convertEntityFiles } from '@helpers/format/convertEntityFiles';
import UrlInput from '@components/dashboard/store/URLInput.vue';
import SelectInput from '@components/form/SelectInput.vue';
// import { email } from '@vee-validate/rules';
interface IRegisterForm extends IRegisterData {
  acceptTerms: boolean;
}
export enum Specialty {
  Restaurant = 'restaurant',
  Pharmacy = 'parmacy',
}
@Options({
  components: {
    TextInput,
    VForm: Form,
    VField: Field,
    UrlInput,
    SelectInput,
  },
  methods: {
    ...mapActions('user', [
      'register',
    ]),
    ...mapMutations('user', [
      'updateRestaurant',
    ]),
  },
})
export default class SignUp extends Vue {
  @Ref('addressNumberInput') addressNumberInputRef!: QInput;
  register!: (registerData: IRegisterData) => Promise<void>;
  updateRestaurant!: (restaurant: IRestaurant) => void;
  restaurant: ILoadable<IRestaurant | null> = {
    data: null,
    loading: false,
  };
  name: string = '';
  taxpayerRegistry: string = '';
  email: string = '';
  phone: string = '';
  step: number = 1;
  saving: boolean = false;
  passwordVisible: boolean = false;
  passwordVisible2: boolean = false;
  loadingAddressByZipCode: boolean = false;

  get initialValues() {
    return {
      acceptTerms: false,
      name: this.name,
      taxpayerRegistry: this.taxpayerRegistry,
      email: this.email,
      phone: this.phone,
      step: 1,
    };
  }

  get passwordFieldType() {
    return this.passwordVisible ? 'text' : 'password';
  }

  get passwordFieldIcon() {
    return this.passwordVisible ? 'mdi-eye-off' : 'mdi-eye';
  }

  get passwordFieldType2() {
    return this.passwordVisible2 ? 'text' : 'password';
  }

  get passwordFieldIcon2() {
    return this.passwordVisible2 ? 'mdi-eye-off' : 'mdi-eye';
  }

  get specialtyOptions() {
    return [
      {
        label: this.$t('auth.store.specialtyOptions.restaurant'),
        value: Specialty.Restaurant,
      },
      {
        label: this.$t('auth.store.specialtyOptions.pharmacy'),
        value: Specialty.Pharmacy,
      },
    ];
  }


  get bankOptions() {
    return [
      {
        'value': '001',
        'label': 'Banco do Brasil S.A.',
      },
    ];
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  togglePassword2Visibility() {
    this.passwordVisible2 = !this.passwordVisible2;
  }

  async signUp(registerData: IRegisterForm) {

    this.name = registerData.name;
    this.taxpayerRegistry = registerData.taxpayerRegistry;
    this.email = registerData.email;
    this.phone = registerData.phone;

    if(this.step === 1){
      this.step = 2;
      return false;
    }

    if (!registerData.acceptTerms) {
      this.$q.notify({
        type: 'negative',
        message: this.$t('auth.notifications.notAcceptedTerms.message'),
        caption: this.$t('auth.notifications.notAcceptedTerms.caption'),
      });

      return;
    }
    try {
      this.saving = true;

      await this.register(registerData);

      void this.$router.push(DEFAULT_DASHBOARD_ROUTE);

      this.saving = false;
    } catch {
      this.saving = false;
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
        updateFormValue('restaurant.address', {
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
}
</script>

<style lang="scss" scoped>
.q-stepper{
  box-shadow: none;
  position: fixed !important;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.q-stepper__header--border{
  border-color: #fff !important;
}

.q-stepper__nav{
  padding: 0;
}

.q-page{
  min-height: auto !important;
}

.sign-in {
  .title {
    font-size: 3.75rem;
  }

  .caption {
    font-size: 1rem;
    letter-spacing: 0.1px;
    color: #545563;
  }

  .sign-in-text {
    text-align: center;
  }

  .sign-in-link {
    color: $primary;
    font-weight: bold;
  }

  .terms-link {
    color: $primary;
    font-weight: bold;
  }
}
</style>
