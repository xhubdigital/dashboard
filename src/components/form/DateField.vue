<template>
  <q-input
    v-model="value"
    v-bind="$props"
    @focus.stop="onFocus"
  >
    <template #append>
      <q-icon
        name="mdi-calendar"
        class="cursor-pointer"
        @click.stop
      >
        <q-popup-proxy
          ref="dateRef"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="value"
            mask="DD/MM/YYYY"
            :options="options"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script lang="ts">
import { QPopupProxy } from 'quasar';
import { Vue, Model, Ref, Prop } from 'vue-property-decorator';

export default class DateField extends Vue {
  @Ref('dateRef') dateRef!: QPopupProxy;
  @Model('modelValue') value!: string;
  @Prop() options!: unknown[];

  onFocus() {
    this.dateRef.show();
  }
}
</script>
