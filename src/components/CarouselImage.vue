<template>
  <div class="q-pa-md">
    <q-carousel
      swipeable
      animated
      arrows
      v-model="slide"
      :fullscreen.sync="fullscreen"
      infinite
      thumbnails >

      <q-carousel-slide v-for="(item, index) in carouselImg" :key="item.id"
        :name="index"
        :img-src="item.srcFull"
        class="image-entiere" />

      <template v-slot:control>
        <q-carousel-control
          position="bottom-right"
          :offset="[18, 18]"
        >
          <q-btn
            push round dense color="white" text-color="primary"
            :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="sortieFullscreen"
          />
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
</template>

<script>
// GESTION DIAPORAMA PLEIN ECRAN SUR IMAGE
export default {
  name: 'CarouselImage',
  data() {
    return {
      fullscreen: true,
      slide: 0,
    };
  },
  // Paramètres du composant
  props: {
    carouselImg: {},
  },
  methods: {
    // Envoi Event au parent (Galerie) pour fermer le diaporama (carousel)
    sortieFullscreen() {
      this.$emit('finFullscreen');
    },
  },
};
</script>

<style>
.image-entiere {
  background-size: contain;  /* ne pas couper l'image  */
  background-repeat: no-repeat;  /* n'afficher qu'une seule fois l'image */
  background-color: black;  /* remplir en noir espace vide  */
}
</style>
