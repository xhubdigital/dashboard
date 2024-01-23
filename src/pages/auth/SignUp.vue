<template>
  <div class="sign-up">
    <div class="h-title title">
      {{ $t('auth.signUp') }}
    </div>
    <div class="caption">
      {{ $t('auth.signUpCaption') }}
    </div>
    <v-form
      v-slot="{ handleSubmit }"
      :initial-values="{ acceptTerms: false }"
    >
      <q-form
        class="row q-py-xl"
        @submit="handleSubmit(signUp)"
      >
        <div class="col-12">
          <v-field
            v-slot="{ field, handleChange, errorMessage }"
            :label="$t('auth.ownerName')"
            name="name"
            rules="required"
          >
            <text-input
              :label="$t('auth.ownerName')"
              name="name"
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
            :label="$t('auth.email')"
            name="email"
            rules="required"
          >
            <text-input
              :label="$t('auth.email')"
              name="email"
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
            :label="$t('common.password')"
            name="password"
            rules="required|min:6"
          >
            <text-input
              :label="$t('common.password')"
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
        <div class="col-12">
          <v-field
            v-slot="{ field, handleChange, errorMessage }"
            :label="$t('auth.confirmPassword')"
            name="confirmPassword"
            rules="required|confirmed:@password"
          >
            <text-input
              :label="$t('auth.confirmPassword')"
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
            v-slot="{ field, handleChange, errorMessage }"
            :label="$t('auth.storeName')"
            name="restaurant.name"
            rules="required"
          >
            <text-input
              :label="$t('auth.storeName')"
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
            v-slot="{ field, handleChange }"
            :label="$t('auth.acceptTerms')"
            name="acceptTerms"
          >
            <q-checkbox
              :model-value="field.value"
              @update:model-value="handleChange"
            >
              <i18n-t keypath="auth.acceptTerms">
                <a
                  href="https://hub4u.app/termo_e_condicoes.html"
                  target="_blank"
                  class="terms-link"
                  @click.stop
                >
                  {{ $t('auth.terms') }}
                </a>
              </i18n-t>
            </q-checkbox>
          </v-field>
        </div>
        <div class="col-12 q-py-md">
          <q-btn
            :label="$t('auth.signUp')"
            class="full-width"
            type="submit"
            color="primary"
            unelevated
            no-caps
            :loading="saving"
          />
        </div>
      </q-form>
    </v-form>
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
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';
import { mapActions } from 'vuex';
import { Form, Field } from 'vee-validate';

import { DEFAULT_DASHBOARD_ROUTE } from 'src/router/routes';
import { IRegisterData } from '@api/auth';

import TextInput from '@components/form/TextInput.vue';

interface IRegisterForm extends IRegisterData {
  acceptTerms: boolean;
}

@Options({
  components: {
    TextInput,
    VForm: Form,
    VField: Field,
  },
  methods: {
    ...mapActions('user', [
      'register',
    ]),
  },
})
export default class SignUp extends Vue {
  register!: (registerData: IRegisterData) => Promise<void>;

  saving: boolean = false;

  passwordVisible: boolean = false;
  passwordVisible2: boolean = false;

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

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  togglePassword2Visibility() {
    this.passwordVisible2 = !this.passwordVisible2;
  }

  async signUp(registerData: IRegisterForm) {
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
}
</script>

<style lang="scss" scoped>
.sign-up {
  .title {
    font-size: 3.75rem;
  }

  .caption {
    font-size: 14px;
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
