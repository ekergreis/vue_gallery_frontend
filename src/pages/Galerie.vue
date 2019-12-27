<template>
  <q-page padding class="row justify-center">
    <div>
      <div>
        <div class="text-h5 text-center">{{ nomGalerie }}</div>
        <div class="text-subtitle1 text-center">{{ periodeGalerie }}</div>
        <div class="text-body2 text-italic text-center">{{ descriptGalerie }}</div>
      </div>

      <images :activeImages="galerieImages" />

      <div v-if="groupesGalerie" class="text-body2 text-italic text-left">
        Groupe{{ pluriel }} associé{{ pluriel }} : {{ groupesGalerie }}
      </div>
    </div>
  </q-page>
</template>

<script>
// GESTION AFFICHAGE D'UNE GALERIE
import Images from 'components/Images';
import Http from 'axios';
import API from '../api/routes';

export default {
  name: 'Galerie',
  components: {
    Images,
  },
  data() {
    return {
      galerieImages: '',
      nomGalerie: '',
      descriptGalerie: '',
      periodeGalerie: '',
      groupesGalerie: '',
      pluriel: '',
      loading: true,
      errored: false,
    };
  },
  // Chargement initial
  mounted() {
    this.ChargeGalerie();
  },
  // Appel autre galerie => rechargement page
  watch: {
    $route() {
      this.ChargeGalerie();
    },
  },
  methods: {
    // Chargement des infos images de la galerie
    ChargeGalerie() {
      this.galerieImages = [];

      const dataParams = {
        id: this.$route.params.id,
      };

      Http({
        method: 'post',
        url: API.endpoints.GALERIE_URL,
        params: dataParams,
      })
        .then((response) => {
          // Infos Galerie
          this.nomGalerie = response.data.name;
          this.descriptGalerie = response.data.description;
          if (response.data.date_start !== '' && response.data.date_end !== '') {
            this.periodeGalerie = `${response.data.date_start} au ${response.data.date_end}`;
          }
          response.data.groups.forEach((group) => {
            if (this.groupesGalerie !== '') {
              this.pluriel = 's';
              this.groupesGalerie = `${this.groupesGalerie}, `;
            }
            this.groupesGalerie = `${this.groupesGalerie}${group}`;
          });

          // Infos Images
          response.data.img.forEach((image) => {
            const baseURL = `${API.IMG_URL}${image.dir}/`;
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
