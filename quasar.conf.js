/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli/quasar-conf-js

/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const { configure } = require('quasar/wrappers');
const path = require('path');

require('dotenv').config();

module.exports = configure(function(ctx) {
  return {
    // https://v2.quasar.dev/quasar-cli/supporting-ts
    supportTS: {
      tsCheckerConfig: {
        eslint: {
          enabled: true,
          files: './src/**/*.{ts,tsx,js,jsx,vue}',
        },
      },
    },

    // https://v2.quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli/boot-files
    boot: [
      'i18n',
      'vue-router',
      'vee-validate',
      'axios',
      'google-maps',
    ],

    // https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.scss',
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      'mdi-v6',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      // 'material-icons', // optional, you are not bound to it
    ],

    build: {
      vueRouterMode: 'history', // available values: 'hash', 'history'

      // transpile: false,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: true, // https://v2.quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // extractCSS: false,

      env: {
        GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY,
        VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
        VUE_APP_WEBSITE_DOMAIN: process.env.VUE_APP_WEBSITE_DOMAIN,
      },

      // https://v2.quasar.dev/quasar-cli/handling-webpack
      chainWebpack(/* chain */) {
        //
      },

      extendWebpack(cfg) {
        // linting is slow in TS projects, we execute it only for
        // production builds
        if (ctx.prod) {
          cfg.module.rules.push({
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /node_modules/,
          });
        }

        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          '@assets': path.resolve(__dirname, './src/assets'),
          '@api': path.resolve(__dirname, './src/api'),
          '@boot': path.resolve(__dirname, './src/boot'),
          '@components': path.resolve(__dirname, './src/components'),
          '@helpers': path.resolve(__dirname, './src/helpers'),
          '@layouts': path.resolve(__dirname, './src/layouts'),
          '@models': path.resolve(__dirname, './src/models'),
          '@pages': path.resolve(__dirname, './src/pages'),
          '@store': path.resolve(__dirname, './src/store'),
        };
      },
    },

    devServer: {
      https: false,
      port: 8080,
      open: true, // opens browser window automatically

      proxy: {
        '/api': {
          // target: 'https://api.hub4u.app',
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },

    // https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      config: {
        notify: {
          position: 'top-right',
        },
      },

      cssAddon: true,

      iconSet: 'mdi-v6', // Quasar icon set
      lang: 'pt-BR', // Quasar language pack

      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ['Dialog', 'Notify'],
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      maxAge: 1000 * 60 * 60 * 24 * 30,

      chainWebpackWebserver(/* chain */) {
        //
      },

      middlewares: [
        ctx.prod ? 'compression' : '',
        'render', // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        exclude: [
          '_redirects',
        ],
      }, // only for GenerateSW

      chainWebpackCustomSW(/* chain */) {
        //
      },

      manifest: {
        name: 'Hub4u',
        short_name: 'Hub4u',
        description: 'Usamos tecnologia acessível para melhor a experiência ' +
          'do varejo brasileiro.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#FF5722',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },

    cordova: {
    },

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'hub4u-dashboard',
      },

      chainWebpack(/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackMain also available besides this chainWebpackMain
      },

      chainWebpackPreload(/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackPreload also available besides this chainWebpackPreload
      },
    },
  };
});
