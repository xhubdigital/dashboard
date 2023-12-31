<template>
  <div class="complements-list q-col-gutter-md">
    <div
      v-for="group, index in groupsModel"
      :key="group.id"
    >
      <complements-list-item
        v-model:complement-group="groupsModel[index]"
        @request-delete-complement-group="deleteComplementGroup($event)"
        @request-edit-complement-group="editComplementGroup($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Model } from 'vue-property-decorator';

import { IComplementGroup } from '@models/IComplementGroup';

import ComplementsListItem from './ComplementsListItem.vue';

@Options({
  components: {
    ComplementsListItem,
  },
  emits: [
    'request-delete-complement-group',
    'request-edit-complement-group',
  ],
})
export default class CategoriesList extends Vue {
  @Model('complementGroups') groupsModel!: IComplementGroup[];

  deleteComplementGroup(group: IComplementGroup) {
    this.$emit('request-delete-complement-group', group);
  }

  editComplementGroup(group: IComplementGroup) {
    this.$emit('request-edit-complement-group', group);
  }
}
</script>
