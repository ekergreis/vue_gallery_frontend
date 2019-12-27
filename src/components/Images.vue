<template>
  <div class="row">
    <active-image v-for="(item, index) in activeImages" :key="item.id"
      :imagePos="index"
      :imageId="item.id"
      :src="item.src"
      :nbComment="item.nbComment"
      :nbLike="item.nbLike"
      :Like="item.Like"
      @diaporama="lanceDiaporama" />

    <carousel-image ref="carousel" v-if="showCarousel"
      :carouselImg="activeImages"
      @finFullscreen="stopCarousel" />
  </div>
</template>

<script>
// GESTION AFFICHAGE D'UNE GALERIE
import ActiveImage from 'components/ActiveImage';
import CarouselImage from 'components/CarouselImage';

export default {
  name: 'Galerie',
  components: {
    ActiveImage,
    CarouselImage,
  },
  data() {
    return {
      showCarousel: false,
    };
  },
  props: {
    activeImages: {},
  },
  methods: {
    // Gestion affichage diaporama (carousel)
    lanceDiaporama(pos) {
      this.showCarousel = true;
      this.$nextTick(function selectDiapo() {
        this.$refs.carousel.slide = pos;
      });
    },
    // Arrêt du diaporama (carousel)
    stopCarousel() {
      this.showCarousel = false;
    },
  },
};
</script>
<style>
</style>
