import { defineRule, configure } from 'vee-validate';
import { confirmed, image, min, required, size, email } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import ptBR from '@vee-validate/i18n/dist/locale/pt_BR.json';
import { setLocale } from '@vee-validate/i18n';

import { checkURLAvailability } from './vee-validate-rules/checkURLAvailability';

defineRule('confirmed', confirmed);
defineRule('image', image);
defineRule('min', min);
defineRule('required', required);
defineRule('size', size);
defineRule('email', email);
defineRule('url-available', checkURLAvailability);

configure({
  generateMessage: localize({
    'pt-BR': ptBR,
  }),
});

setLocale('pt-BR');
