<template>
  <q-carousel
    v-model="slide"
    class="carousel"
    animated
    navigation
    infinite
    arrows
    transition-prev="slide-right"
    transition-next="slide-left"
    height="90vh"
  >
    <q-carousel-slide
      name="first"
      class="item"
    >
      <div class="image slide-1" />
      <div class="text">
        <div class="title">
          {{ $t('auth.slides.first.title') }}
        </div>
        <div class="caption">
          {{ $t('auth.slides.first.caption') }}
        </div>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default class AuthLayout extends Vue {
  slide: string = 'first';
}
</script>

<style lang="scss" scoped>
.carousel {
  background: transparent;
  width: 100%;
}

.item {
  color: #FFF;
  text-align: center;
  display: flex;
  flex-direction: column;

  .image {
    flex-grow: 1;
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    margin: 24px;

    &.slide-1 {
      background-image: url(assets/auth/slide-1.svg);
    }
  }

  .text {
    max-width: 60%;
    margin: 0 auto;
    margin-bottom: 60px;

    .title {
      font-family: 'Fira Sans';
      font-size: 2.4rem;
      font-weight: bold;
    }

    .caption {
      font-size: 1.2rem;
    }
  }
}
</style>
