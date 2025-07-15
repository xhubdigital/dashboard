<template>
  <div class="sign-in text-center">
    <div class="logo q-py-xl">
      <img src="~assets/logos/hub4u.png">
    </div>
    <!-- <div class="h-title title">
      {{ $t('auth.login') }}
    </div> -->
    <div class="caption">
      {{ $t('auth.loginCaption') }}
    </div>
    <v-form
      v-slot="{ handleSubmit }"
      :initial-values="{ keepAuthenticated: true }"
    >
      <q-form
        class="row q-py-xl"
        @submit="handleSubmit(signIn)"
      >
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
            rules="required"
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
        <!-- <div class="col-12">
          <v-field
            v-slot="{ field, handleChange }"
            :label="$t('auth.keepAuthenticated')"
            name="keepAuthenticated"
          >
            <q-checkbox
              :label="$t('auth.keepAuthenticated')"
              :model-value="field.value"
              @update:model-value="handleChange"
            />
          </v-field>
        </div> -->
        <div class="col-12 q-py-md">
          <q-btn
            :label="$t('auth.signIn')"
            class="full-width"
            type="submit"
            color="primary"
            unelevated
            no-caps
            :loading="authenticating"
          />
        </div>
        <div class="col-12">
          <q-btn
            :label="$t('auth.forgotPassword')"
            class="full-width text-bold"
            color="primary"
            flat
            no-caps
            @click="forgotPassword"
          />
        </div>
      </q-form>
    </v-form>
    <div class="register-text">
      {{ $t('auth.noAccountYet') }}
      <router-link
        class="register-link"
        to="/sign-up"
      >
        {{ $t('auth.signUpAccount') }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';
import { mapActions } from 'vuex';
import { Form, Field } from 'vee-validate';

import { DEFAULT_DASHBOARD_ROUTE } from 'src/router/routes';
import { IAuthData } from '@store/user/actions';

import TextInput from '@components/form/TextInput.vue';
import { path } from 'ramda';

@Options({
  components: {
    TextInput,
    VForm: Form,
    VField: Field,
  },
  methods: {
    ...mapActions('user', [
      'login',
    ]),
  },
})
export default class SignIn extends Vue {
  login!: (authData: IAuthData) => Promise<void>;

  authenticating: boolean = false;

  passwordVisible: boolean = false;

  get passwordFieldType() {
    return this.passwordVisible ? 'text' : 'password';
  }

  get passwordFieldIcon() {
    return this.passwordVisible ? 'mdi-eye-off' : 'mdi-eye';
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async signIn(authData: IAuthData) {
    try {
      this.authenticating = true;

      await this.login(authData);

      void this.$router.push(DEFAULT_DASHBOARD_ROUTE);
    } catch (error) {
      const errorKey = path(['response', 'status'], error) === 401
        ? 'loginInvalid'
        : 'loginGenericError';

      this.$q.notify({
        type: 'negative',
        message: this.$t(`auth.notifications.${errorKey}.message`),
        caption: this.$t(`auth.notifications.${errorKey}.caption`),
      });
    } finally {
      this.authenticating = false;
    }
  }

  forgotPassword() {
    console.log('forgotPassword');
  }
}
</script>

<style lang="scss" scoped>
.sign-in {
  .title {
    font-size: 3.75rem;
  }

  .caption {
    font-size: 14px;
    letter-spacing: 0.1px;
    color: #545563;
  }

  .register-text {
    text-align: center;
  }

  .register-link {
    color: $primary;
    font-weight: bold;
  }
}
</style>
