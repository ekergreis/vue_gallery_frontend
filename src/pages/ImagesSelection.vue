<template>
  <div class="justify-center">
    <q-page padding class="row justify-center">
      <div>
        <div class="text-h5 text-center">Sélection des plus belles photos</div>
        <images :activeImages="galerieImages" />
      </div>
    </q-page>
  </div>
</template>

<script>
// GESTION AFFICHAGE D'UNE SELECTION IMAGES (BEST-OF)
import Images from 'components/Images';
import Http from 'axios';

export default {
  name: 'Galerie',
  components: {
    Images,
  },
  data() {
    return {
      galerieImages: '',
      loading: true,
      errored: false,
    };
  },
  computed: {
    dataParams() {
      // Actualisation suivant vuex store gallery img_select
      const $imgSelect = {};
      $imgSelect.img = this.$store.state.gallery.img_select;
      return JSON.stringify($imgSelect);
    },
  },
  watch: {
    dataParams(newJSON, oldJSON) {
      // Changement vuex store gallery img_select
      if (newJSON !== oldJSON) {
        this.ChargeGalerie();
      }
    },
  },
  // Chargement initial
  mounted() {
    this.ChargeGalerie();
  },
  methods: {
    // Chargement des infos images de la galerie
    ChargeGalerie() {
      this.galerieImages = [];
      Http({
        method: 'post',
        url: this.$store.getters['gallery/getRoute']('IMG_URL'),
        data: this.dataParams,
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => {
          this.galerieImages = [];
          response.data.img.forEach((image) => {
            const baseURL = `${this.$store.state.gallery.URL_IMG}${image.dir}/`;
            this.galerieImages.push({
              id: image.id,
              src: `${baseURL}${image.mini_filename}`,
              srcFull: `${baseURL}${image.filename}`,
              nbComment: image.comment_count,
              nbLike: image.like_count,
              Like: image.like_user,
            });
          });
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style>
</style>
