<template>
  <q-page padding class="row justify-center">
    <div class="col">
      <div>
        <div class="text-h5 text-center">
          {{ nomGalerie }}
          <q-input v-if="idGalerie === null" outlined v-model="form.name" label="Nom Galerie"
                   dense class="q-pb-xs"  />
        </div>
        <div class="text-subtitle1 text-center">
          {{ periodeGalerie }}
          <div v-if="idGalerie === null" class="row float">
            <div style="padding: 10px 10px 0 0;">Période du</div>
            <date-picker v-model="form.dateDeb" />
            <div style="padding: 10px 10px 0 10px;">au</div>
            <date-picker v-model="form.dateFin" />
          </div>
        </div>
        <div class="text-body2 text-italic text-center">
          {{ descriptGalerie }}
          <q-input v-if="idGalerie === null" outlined v-model="form.descript" label="Description"
                   type="textarea" :rows="3" dense class="q-pb-xs"  />
        </div>
        <div v-if="idGalerie === null" class="q-pa-xs">
          <q-option-group
            v-model="form.group"
            :options="lstGroup"
            color="green" type="toggle" dense
          />
        </div>
        <div v-if="idGalerie === null" style="padding: 10px 0 30px 0;">
          <q-btn @click="createGalerie()">Créer la galerie</q-btn>
        </div>
      </div>

      <images :activeImages="galerieImages" />
      <div v-if="groupesGalerie"
           class="text-body2 text-italic text-left" style="padding-bottom: 30px">
        Groupe{{ pluriel }} associé{{ pluriel }} : {{ groupesGalerie }}
      </div>

      <div v-if="affUploadImages" class="row float-left">
        <div style="padding: 0 10px 0 0;">
          <q-uploader
            ref="uploadcomponent"
            url=""
            extensions="image/*"
            multiple hide-upload-btn
          />
        </div>
        <div >
          <q-btn @click="uploadFile()">Envoyer les images</q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
// GESTION AFFICHAGE D'UNE GALERIE
import Images from 'components/Images';
import DatePicker from 'components/DatePicker';
import Http from 'axios';

export default {
  name: 'Galerie',
  components: {
    Images,
    DatePicker,
  },
  data() {
    return {
      idGalerie: null,
      galerieImages: [],
      lstGroup: [],
      nomGalerie: '',
      descriptGalerie: '',
      periodeGalerie: '',
      groupesGalerie: '',
      pluriel: '',
      loading: true,
      errored: false,
      affFormNewGalerie: false,
      affUploadImages: false,
      form: {
        name: '',
        dateDeb: '',
        dateFin: '',
        descript: '',
        group: [],
      },
    };
  },
  // CHARGEMENT INITIAL
  mounted() {
    this.lstGroup = this.$store.getters['gallery/getGroups'];
    if (this.$route.params.id) {
      this.ChargeGalerie();
    }
  },
  // RECHARGEMENT PAGE SUITE APPEL ROUTER
  watch: {
    $route() {
      this.InitVar();
      if (this.$route.params.id) {
        this.ChargeGalerie();
      } else {
        this.affFormNewGalerie = true;
      }
    },
  },
  methods: {
    // INITIALISATION GALERIE
    InitVar() {
      this.idGalerie = null;
      this.affFormNewGalerie = false;
      this.galerieImages = [];
      this.nomGalerie = '';
      this.descriptGalerie = '';
      this.periodeGalerie = '';
      this.groupesGalerie = '';
      this.affUploadImages = false;
    },

    // CHARGEMENT GALERIE
    ChargeGalerie() {
      this.idGalerie = this.$route.params.id;
      const dataParams = {
        id: this.idGalerie,
      };

      Http({
        method: 'post',
        url: this.$store.getters['gallery/getRoute']('IMG_URL'),
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
            const baseURL = `${this.$store.getters['gallery/getStorage']}${image.dir}/`;
            this.galerieImages.push({
              id: image.id,
              src: `${baseURL}${image.mini_filename}`,
              srcFull: `${baseURL}${image.filename}`,
              nbComment: image.comment_count,
              nbLike: image.like_count,
              Like: image.like_user,
            });
          });

          this.affUploadImages = true;
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // CREATION GALERIE
    createGalerie() {
      console.log(this.form.dateDeb);
      const reqParams = {
        name: this.form.name,
        descript: this.form.descript,
        date_start: this.form.dateDeb,
        date_end: this.form.dateFin,
      };
      reqParams.group = [];
      this.form.group.forEach((idGroup) => {
        reqParams.group.push({ id: idGroup });
      });
      Http.post(this.$store.getters['gallery/getRoute']('GALERIE_URL'), reqParams, {
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        console.log(response);
      });
    },

    // UPLOAD IMAGES
    uploadFile() {
      this.$refs.uploadcomponent.workingThreads = true;
      this.$refs.uploadcomponent.files.forEach((image) => {
        this.getBase64(image).then((dataImg) => {
          // simulating a delay of 2 seconds
          setTimeout(() => {
            const data = {
              id: this.idGalerie,
              data: dataImg,
            };
            Http.post(this.$store.getters['gallery/getRoute']('IMG_UPLOAD_URL'), data, {
              headers: { 'Content-Type': 'application/json' },
            }).then((response) => {
              console.log(response);
              this.$refs.uploadcomponent.removeFile(image);
            });
          }, 4000);
        }).catch(() => {
          this.$q.notify({
            color: 'negative',
            message: 'Failed to convert file...',
          });
        });
      });
      this.$refs.uploadcomponent.uploadedSize = 0;
      this.$refs.uploadcomponent.workingThreads = false;
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // reader.onloadend = (e) => resolve(imageToDataUri(e, 400, 400))
        reader.readAsDataURL(file);
        console.log(reader.result);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
  },
};
</script>
<style>
</style>
