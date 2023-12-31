<template>
  <div class="complement-group-list-item-option q-pa-lg">
    <div class="title q-pb-md">
      {{ $t('dashboard.menu.complementOptions') }}
    </div>
    <div v-if="optionsModel.length === 0">
      {{ $t('dashboard.menu.noComplementOptions') }}
    </div>
    <div v-else>
      <complements-list-item-options-item
        v-for="option, index in optionsModel"
        :key="option.id"
        v-model:option="optionsModel[index]"
        :complement-group="complementGroup"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Model, Options, Prop } from 'vue-property-decorator';

import { IComplementGroup, IComplementGroupOption } from '@models/IComplementGroup';

import ComplementsListItemOptionsItem from './/ComplementsListItemOptionsItem.vue';

@Options({
  components: {
    ComplementsListItemOptionsItem,
  },
})
export default class ComplementsListItemOptions extends Vue {
  @Model('options') optionsModel!: IComplementGroupOption[];
  @Prop() complementGroup!: IComplementGroup;
}
</script>

<style lang="scss" scoped>
.complement-group-list-item-option {
  .title {
    font-weight: bold;
  }
}
</style>
