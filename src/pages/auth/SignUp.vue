<template>
  <v-form
    v-slot="{ handleSubmit, setFieldValue}"
    :initial-values="{ acceptTerms: false }"
  >
    <q-form
      class="row q-py-xl"
      @submit.prevent="handleSubmit(signUp)"
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
          prefix="1"
          :done="step > 1"
          :header-nav="step > 1"
        >
          <q-page-container>
            <q-page class="row justify-center items-center">
              <div class="row justify-center q-pa-md">
                <div class="col-12 text-center self-center">
                  <div class="q-pa-lg q-pa-md-xl flex flex-center">
                    <div class="content">
                      <div class="sign-out">
                        <div class="h-title title q-pa-xs-md">
                          {{ $t('auth.owner.title') }}
                        </div>
                        <div class="caption">
                          {{ $t('auth.owner.caption') }}
                        </div>
                        <div class="row q-py-xl row q-col-gutter-md">
                          <div class="col-12 col-sm-6">
                            <v-field
                              v-slot="{ field, handleChange, errorMessage }"
                              :label="$t('auth.owner.name')"
                              name="name"
                              rules="required"
                            >
                              <text-input
                                name="name"
                                :label="$t('auth.owner.name')"
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
                              :label="$t('auth.owner.taxpayerRegistry')"
                              name="taxpayerRegistry"
                              rules="required|min:14"
                            >
                              <text-input
                                :label="$t('auth.owner.taxpayerRegistry')"
                                :model-value="field.value"
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
                              v-slot="{ field, handleChange, errorMessage }"
                              :label="$t('auth.owner.email')"
                              name="email"
                              rules="required|email"
                            >
                              <text-input
                                :label="$t('auth.owner.email')"
                                :model-value="field.value"
                                name="email"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              />
                            </v-field>
                          </div>
                          <div class="col-12 col-sm-6">
                            <v-field
                              v-slot="{ field, handleChange, errorMessage }"
                              :label="$t('auth.owner.phone')"
                              name="phone"
                              rules="required|min:14"
                            >
                              <text-input
                                :label="$t('auth.owner.phone')"
                                :model-value="field.value"
                                name="phone"
                                mask="(##)#####-####"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              />
                            </v-field>
                          </div>
                          <div class="col-12 q-py-lg">
                            <q-stepper-navigation>
                              <q-btn
                                class="full-width"
                                color="primary"
                                unelevated
                                no-caps
                                type="submit"
                                :label="step === 5 ? 'FINALIZAR' : 'CONTINUAR'"
                              />
                            </q-stepper-navigation>
                          </div>
                        </div>
                        <div class="sign-out-text">
                          {{ $t('auth.alreadyHaveAccount') }}
                          <router-link
                            class="sign-out-link"
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
          :title="$t('auth.address.title')"
          prefix="2"
          icon="create_new_folder"
          :done="step > 2"
          :header-nav="step > 2"
        >
          <q-page-container>
            <q-page class="row justify-center items-center">
              <div class="row justify-center q-pa-md">
                <div class="col-12 text-center self-center">
                  <div class="q-pa-lg q-pa-md-xl flex flex-center">
                    <div class="content">
                      <div class="sign-out">
                        <div class="h-title title q-pa-xs-md">
                          {{ $t('auth.address.title') }}
                        </div>
                        <div class="caption">
                          {{ $t('auth.address.caption') }}
                        </div>
                        <div class="row q-py-xl row q-col-gutter-md">
                          <div class="col-12 col-sm-6">
                            <v-field
                              v-slot="{ field, handleChange, errorMessage }"
                              :label="$t('auth.address.zipCode')"
                              name="restaurant.address.zipCode"
                              rules="required"
                            >
                              <text-input
                                ref="zipCodeInput"
                                :label="$t('auth.address.zipCode')"
                                name="restaurant.address.zipCode"
                                mask="#####-###"
                                :model-value="field.value"
                                :loading="loadingAddressByZipCode"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="onChangeZipCode(
                                  handleChange, setFieldValue, $event)"
                              />
                            </v-field>
                          </div>
                          <div class="col-12 col-sm-6 hidden">
                            <v-field
                              v-slot="{ field, handleChange, errorMessage }"
                              :label="$t('auth.address.state')"
                              name="restaurant.address.state"
                              rules="required"
                            >
                              <text-input
                                :label="$t('auth.address.state')"
                                name="restaurant.address.state"
                                :model-value="field.value"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              />
                            </v-field>
                          </div>
                          <div class="col-12 col-sm-6 hidden">
                            <v-field
                              v-slot="{ field, handleChange, errorMessage }"
                              :label="$t('auth.address.city')"
                              name="restaurant.address.city"
                              rules="required"
                            >
                              <text-input
                                :label="$t('auth.address.city')"
                                name="restaurant.address.city"
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
                              :label="$t('auth.address.streetName')"
                              name="restaurant.address.streetName"
                              rules="required"
                            >
                              <text-input
                                :label="$t('auth.address.streetName')"
                                name="restaurant.address.streetName"
                                :model-value="field.value"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              />
                            </v-field>
                          </div>
                          <div class="col-12 col-sm-6 hidden">
                            <v-field
                              v-slot="{ field, handleChange, errorMessage }"
                              :label="$t('auth.address.neighborhood')"
                              name="restaurant.address.neighborhood"
                              rules="required"
                            >
                              <text-input
                                :label="$t('auth.address.neighborhood')"
                                name="restaurant.address.neighborhood"
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
                              :label="$t('auth.address.number')"
                              name="restaurant.address.number"
                              rules="required"
                            >
                              <text-input
                                ref="addressNumberInput"
                                :label="$t('auth.address.number')"
                                name="restaurant.address.number"
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
                              :label="$t('auth.address.complement')"
                              name="restaurant.address.complement"
                            >
                              <text-input
                                :label="$t('auth.address.complement')"
                                name="restaurant.address.complement"
                                :model-value="field.value"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              />
                            </v-field>
                          </div>
                          <div class="col-12 q-py-lg col-sm-6">
                            <q-btn
                              label="Voltar"
                              class="full-width text-bold"
                              rounded-borders
                              outline
                              color="primary"
                              @click="step = 1"
                            />
                          </div>
                          <div class="col-12 q-py-lg col-sm-6">
                            <q-stepper-navigation>
                              <q-btn
                                class="full-width"
                                color="primary"
                                unelevated
                                type="submit"
                                no-caps
                                :label="step === 5 ? 'FINALIZAR' : 'CONTINUAR'"
                              />
                            </q-stepper-navigation>
                          </div>
                        </div>
                        <div class="sign-out-text">
                          {{ $t('auth.alreadyHaveAccount') }}
                          <router-link
                            class="sign-out-link"
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
          :name="3"
          :title="$t('auth.store.title')"
          prefix="3"
          icon="add_comment"
          :done="step > 3"
          :header-nav="step > 3"
        >
          <q-page-container>
            <q-page class="row justify-center items-center">
              <div class="row justify-center q-pa-md">
                <div class="col-12 text-center self-center">
                  <div class="q-pa-lg q-pa-md-xl flex flex-center">
                    <div class="content">
                      <div class="sign-out">
                        <div class="h-title title q-pa-xs-md">
                          {{ $t('auth.store.title') }}
                        </div>
                        <div class="caption">
                          {{ $t('auth.store.caption') }}
                        </div>
                        <div class="row q-py-xl row q-col-gutter-md">
                          <div class="col-12 col-sm-6">
                            <v-field
                              v-slot="{ field, handleChange, errorMessage }"
                              :label="$t('auth.store.employerIdentification')"
                              name="store.employerIdentification"
                              rules="required|min:18"
                            >
                              <text-input
                                :label="$t('auth.store.employerIdentification')"
                                mask="##.###.###/####-##"
                                name="store.employerIdentification"
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
                              :label="$t('auth.store.name')"
                              name="restaurant.name"
                              rules="required"
                            >
                              <text-input
                                :label="$t('auth.store.name')"
                                name="restaurant.name"
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
                              :label="$t('auth.store.url')"
                              name="restaurant.url"
                              rules="required"
                            >
                              <text-input
                                :label="$t('auth.store.url')"
                                name="restaurant.url"
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
                              :label="$t('auth.store.phone')"
                              name="store.phone"
                              rules="required|min:14"
                            >
                              <text-input
                                :label="$t('auth.store.phone')"
                                name="store.phone"
                                mask="(##)#####-####"
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
                              :label="$t('auth.store.specialty')"
                              name="specialty"
                              rules="required"
                            >
                              <select-input
                                :label="$t('auth.store.specialty')"
                                :options="specialtyOptions"
                                map-options
                                emit-value
                                :model-value="field.value"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              />
                            </v-field>
                          </div>
                          <div class="col-12 q-py-lg col-sm-6">
                            <q-btn
                              label="Voltar"
                              class="full-width text-bold"
                              outline
                              color="primary"
                              @click="step = 2"
                            />
                          </div>
                          <div class="col-12 q-py-lg col-sm-6">
                            <q-stepper-navigation>
                              <q-btn
                                class="full-width"
                                color="primary"
                                unelevated
                                type="submit"
                                no-caps
                                :label="step === 5 ? 'FINALIZAR' : 'CONTINUAR'"
                              />
                            </q-stepper-navigation>
                          </div>
                        </div>
                        <div class="sign-out-text">
                          {{ $t('auth.alreadyHaveAccount') }}
                          <router-link
                            class="sign-out-link"
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
          :name="4"
          :title="$t('auth.payment.title')"
          prefix="4"
          icon="add_comment"
          :done="step > 4"
          :header-nav="step > 4"
        >
          <q-page-container>
            <q-page class="row justify-center items-center">
              <div class="row justify-center q-pa-md">
                <div class="col-12 text-center self-center">
                  <div class="q-pa-lg q-pa-md-xl flex flex-center">
                    <div class="content">
                      <div class="sign-out">
                        <div class="h-title title q-pa-xs-md">
                          {{ $t('auth.payment.title') }}
                        </div>
                        <div class="caption">
                          {{ $t('auth.payment.caption') }}
                        </div>
                        <div class="row q-py-xl row q-col-gutter-md">
                          <div class="col-12 col-sm-6">
                            <v-field
                              v-slot="{ field, handleChange, errorMessage }"
                              :label="$t('auth.payment.bank')"
                              name="unit"
                              rules="required"
                            >
                              <select-input
                                :label="$t('auth.payment.bank')"
                                :options="bankOptions"
                                map-options
                                emit-value
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
                              :label="$t('auth.payment.agency')"
                              name="payment.agency"
                              rules="required"
                            >
                              <text-input
                                :label="$t('auth.payment.agency')"
                                name="payment.agency"
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
                              :label="$t('auth.payment.account')"
                              name="payment.account"
                              rules="required"
                            >
                              <text-input
                                :label="$t('auth.payment.account')"
                                name="payment.account"
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
                              :label="$t('auth.payment.number')"
                              name="payment.number"
                            >
                              <text-input
                                :label="$t('auth.payment.number')"
                                name="payment.number"
                                :model-value="field.value"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              />
                            </v-field>
                          </div>
                          <div class="col-12 q-py-lg col-sm-6">
                            <q-btn
                              label="Voltar"
                              class="full-width text-bold"
                              outline
                              color="primary"
                              @click="step = 3"
                            />
                          </div>
                          <div class="col-12 q-py-lg col-sm-6">
                            <q-stepper-navigation>
                              <q-btn
                                class="full-width"
                                color="primary"
                                unelevated
                                type="submit"
                                no-caps
                                :label="step === 5 ? 'FINALIZAR' : 'CONTINUAR'"
                              />
                            </q-stepper-navigation>
                          </div>
                        </div>
                        <div class="sign-out-text">
                          {{ $t('auth.alreadyHaveAccount') }}
                          <router-link
                            class="sign-out-link"
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
          :name="5"
          :title="$t('auth.finish.title')"
          prefix="5"
          icon="add_comment"
          :done="step > 5"
          :header-nav="step > 5"
        >
          <q-page-container>
            <q-page class="row justify-center items-center">
              <div class="row justify-center q-pa-md">
                <div class="col-12 text-center self-center">
                  <div class="q-pa-lg q-pa-md-xl flex flex-center">
                    <div class="content">
                      <div class="sign-out">
                        <div class="h-title title q-pa-xs-md">
                          {{ $t('auth.finish.title') }}
                        </div>
                        <div class="caption">
                          {{ $t('auth.finish.caption') }}
                        </div>
                        <div class="row q-py-xl row q-col-gutter-md">
                          <div class="col-12 col-sm-6">
                            <v-field
                              v-slot="{ field, handleChange, errorMessage }"
                              :label="$t('auth.finish.password')"
                              name="password"
                              rules="required|min:6"
                            >
                              <text-input
                                :label="$t('auth.finish.password')"
                                name="password"
                                :type="passwordFieldType"
                                :model-value="field.value"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              >
                                <template #append>
                                  <q-icon
                                    class="cursor-pointer"
                                    :name="passwordFieldIcon"
                                    @click="togglePasswordVisibility"
                                  />
                                </template>
                              </text-input>
                            </v-field>
                          </div>
                          <div class="col-12 col-sm-6">
                            <v-field
                              v-slot="{ field, handleChange, errorMessage }"
                              :label="$t('auth.finish.confirmPassword')"
                              name="confirmPassword"
                              rules="required|confirmed:@password"
                            >
                              <text-input
                                :label="$t('auth.finish.confirmPassword')"
                                name="confirmPassword"
                                :type="passwordFieldType2"
                                :model-value="field.value"
                                :error="!!errorMessage"
                                :error-message="errorMessage"
                                @update:model-value="handleChange"
                              >
                                <template #append>
                                  <q-icon
                                    class="cursor-pointer"
                                    :name="passwordFieldIcon2"
                                    @click="togglePassword2Visibility"
                                  />
                                </template>
                              </text-input>
                            </v-field>
                          </div>
                          <div class="col-12">
                            <v-field
                              v-slot="{ field, handleChange }"
                              :label="$t('auth.finish.acceptTerms')"
                              name="acceptTerms"
                            >
                              <q-checkbox
                                :model-value="field.value"
                                @update:model-value="handleChange"
                              >
                                <i18n-t keypath="auth.finish.acceptTerms">
                                  <a
                                    href="https://hub4u.app/termos.html"
                                    target="_blank"
                                    class="terms-link"
                                    @click.stop
                                  >
                                    {{ $t('auth.finish.terms') }}
                                  </a>
                                </i18n-t>
                              </q-checkbox>
                            </v-field>
                          </div>
                          <div class="col-12 q-py-xl col-sm-6">
                            <q-btn
                              label="Voltar"
                              class="full-width text-bold"
                              outline
                              color="primary"
                              @click="step = 4"
                            />
                          </div>
                          <div class="col-12 q-py-xl col-sm-6">
                            <q-stepper-navigation>
                              <q-btn
                                class="full-width"
                                color="primary"
                                unelevated
                                type="submit"
                                no-caps
                                :label="step === 5 ? 'FINALIZAR' : 'CONTINUAR'"
                              />
                            </q-stepper-navigation>
                          </div>
                        </div>
                        <div class="sign-out-text">
                          {{ $t('auth.alreadyHaveAccount') }}
                          <router-link
                            class="sign-out-link"
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
  step: number = 1;
  saving: boolean = false;
  passwordVisible: boolean = false;
  passwordVisible2: boolean = false;
  loadingAddressByZipCode: boolean = false;

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
    if(this.step === 1){
      this.step = 2;
      return false;
    }
    if(this.step === 2){
      this.step = 3;
      return false;
    }
    if(this.step === 3){
      this.step = 4;
      return false;
    }
    if(this.step === 4){
      this.step = 5;
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

.sign-out {
  .title {
    font-size: 3.75rem;
  }

  .caption {
    font-size: 1rem;
    letter-spacing: 0.1px;
    color: #545563;
  }

  .sign-out-text {
    text-align: center;
  }

  .sign-out-link {
    color: $primary;
    font-weight: bold;
  }

  .terms-link {
    color: $primary;
    font-weight: bold;
  }

  .q-btn{
    border: 1.5px solid;
  }
}
</style>
