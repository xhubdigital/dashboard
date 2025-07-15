<template>
  <q-page>
    <div class="card">
      <div
        v-for="vContent, index in content"
        :key="index"
      >
        <div class="h-title">
          {{ vContent.title }}
        </div>
        <div
          v-for="paragraph, indexP in vContent.paragraphs"
          :key="indexP"
        >
          <p v-if="paragraph.title">
            <b>{{ paragraph.title }}</b>
          </p>
          <p
            v-for="body, indexBody in paragraph.body"
            :key="indexBody"
          >
            {{ body }}
          </p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

interface IPolicies {
  [key: string]: {
    title: string;
    paragraphs: {
      title: string;
      body: string[];
    }[];
  };
}

export default class PoliciesPage extends Vue {
  @Prop({ required: true }) content!: IPolicies;
}
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid $separator-color;
  padding: 20px;
  border-radius: $generic-border-radius;
}

.h-title{
  font-size: 18px;
  line-height: 2em;
  padding-bottom: 20px;
}
</style>
