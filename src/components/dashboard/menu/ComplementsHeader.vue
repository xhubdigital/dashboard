<template>
  <div class="menu-header q-pa-lg">
    <div class="row q-col-gutter-lg">
      <div class="col-6">
        <div class="title h-title">
          {{ $t('dashboard.menu.categoriesTitle') }}
        </div>
        <div class="subtitle">
          <div>
            {{ $t('dashboard.menu.complementsSubtitle.label', {
              groups: $t('dashboard.menu.complementsSubtitle.groups', {
                count: complementGroups.length,
              }),
              complements: $t(
                'dashboard.menu.complementsSubtitle.complements',
                { count: totalComplements }
              ),
            }) }}
          </div>
        </div>
      </div>
      <div class="col-6 actions">
        <div class="flex justify-end items-center q-col-gutter-md">
          <div>
            <q-btn
              :label="$t('dashboard.menu.newCategoryGroup')"
              color="primary"
              unelevated
              to="/dashboard/menu/complements/new"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';
import { sum, map } from 'ramda';

import { IComplementGroup } from '@models/IComplementGroup';

@Options({
  components: {
  },
})
export default class ComplementsHeader extends Vue {
  @Prop({ required: true }) complementGroups!: IComplementGroup[];

  get totalComplements() {
    return sum(map((group: IComplementGroup) => {
      return group.options.length;
    }, this.complementGroups));
  }
}
</script>

<style lang="scss" scoped>
.menu-header {
  border: 1px solid $separator-color;
  border-radius: $generic-border-radius;

  .title {
    font-size: 18px;
  }
}
</style>
