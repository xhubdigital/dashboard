<template>
  <text-input
    v-model="urlModel"
    v-bind="$props"
    class="url-input"
    :dense="false"
  >
    <template #prepend>
      <q-icon name="mdi-link-variant" />
    </template>
    <template #append>
      <div class="flex items-center q-col-gutter-sm">
        <div class="flex">
          <div class="sulfix">
            {{ websiteSulfix }}
          </div>
        </div>
        <div class="flex">
          <q-btn
            icon="mdi-content-copy"
            size="sm"
            round
            unelevated
            color="primary"
            @click="copyURL"
          >
            <q-tooltip>
              {{ $t('common.copy') }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </template>
  </text-input>
</template>

<script lang="ts">
import { Vue, Options, Model } from 'vue-property-decorator';

import TextInput from '@components/form/TextInput.vue';
import { copyToClipboard } from 'quasar';

@Options({
  inheritAttrs: true,
  components: {
    TextInput,
  },
})
export default class URLInput extends Vue {
  @Model('modelValue') urlModel!: string;

  get websiteSulfix() {
    // Use environment variable for website domain, fallback to default
    const domain = process.env.VUE_APP_WEBSITE_DOMAIN;
    return `.${domain}`;
  }

  copyURL() {
    void copyToClipboard(this.urlModel + this.websiteSulfix);

    this.$q.notify({
      type: 'positive',
      message:
        this.$t('dashboard.store.details.notifications.urlCopied.message'),
    });
  }
}
</script>

<style lang="scss" scoped>
.url-input {
  ::v-deep(.q-field__control) {
    background: $grey-4;
    font-size: 1.4rem;

    input {
      font-weight: 700;
    }
  }
}

.sulfix {
  height: 30px;
  line-height: 30px;
  padding: 0 12px;
  font-size: 1.1rem;
  background: $primary;
  color: #FFF;
  border-radius: 30px;
}
</style>
