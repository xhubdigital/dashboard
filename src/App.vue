<template>
  <router-view v-if="!loading" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapActions, mapGetters } from 'vuex';
import { path } from 'ramda';

import { onRequestError } from '@boot/axios';
import { IUser } from '@models/IUser';

import { DEFAULT_DASHBOARD_ROUTE } from './router/routes';

@Options({
  computed: {
    ...mapGetters('user', ['user']),
  },
  methods: {
    ...mapActions('application', [
      'startStore',
    ]),
    ...mapActions('user', [
      'autoSignIn',
    ]),
  },
})
export default class App extends Vue {
  autoSignIn!: () => Promise<unknown>;
  startStore!: () => void;
  user!: IUser;

  loading: boolean = false;

  mounted() {
    this.startStore();
    void this.checkAuth();

    onRequestError((error: unknown) => {
      if (!this.$route.meta.isAuth &&
        path(['response', 'status'], error) === 401
      ) {
        setTimeout(() => {
          void this.$router.push('/');
        });
      }
    });
  }

  async checkAuth() {
    try {
      this.loading = true;

      await this.autoSignIn();

      const { isAuth } = this.$route.meta;

      if (
        this.user !== null &&
        this.$route.path !== DEFAULT_DASHBOARD_ROUTE &&
        this.$route.name !== 'receipt/details'
      ) {
        void this.$router.push(DEFAULT_DASHBOARD_ROUTE);
      } else if (!isAuth && this.user === null) {
        void this.$router.push({ name: 'auth/sign-in' });
      }
    } finally {
      this.hideSplashScreen();
      this.loading = false;
    }
  }

  hideSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    splashScreen?.classList.add('deleting');

    setTimeout(() => {
      splashScreen?.remove();
    }, 300);
  }
}
</script>
