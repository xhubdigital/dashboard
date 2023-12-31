import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import { locale } from 'moment';

import messages from 'src/i18n';

const i18n = createI18n({
  locale: 'pt-BR',
  messages,
  numberFormats: {
    'pt-BR': {
      currency: {
        style: 'currency',
        currency: 'BRL',
      },
      inventoryAmount: {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
      distance: {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    },
  },
});

locale('pt-BR');

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

export { i18n, messages };
