<template>
  <q-page padding class="row justify-center">
    <div class="col">
      <div>

        <div v-if="idGalerie !== null">
          <div class="text-h5 text-center" >{{ form.name }}</div>
          <div class="text-subtitle1 text-center" >{{ periodeGalerie }}</div>
          <div class="text-body2 text-italic text-center">{{ form.descript }}</div>
        </div>

        <div v-else>
          <div>
            <q-input outlined v-model="form.name" label="Nom Galerie" dense class="q-pb-xs"  />
          </div>
          <div>
            <div class="row float">
              <div style="padding: 10px 10px 0 0;">Période du</div>
              <date-picker v-model="form.dateDeb" disable readonly />
              <div style="padding: 10px 10px 0 10px;">au</div>
              <date-picker v-model="form.dateFin" />
            </div>
          </div>
          <div>
            <q-input outlined v-model="form.descript" label="Description"
                     type="textarea" :rows="3" dense class="q-pb-xs"  />
          </div>
          <div>
            <q-option-group
              v-model="form.group"
              :options="lstGroup"
              color="green" type="toggle" dense
            />
          </div>
          <div style="padding: 10px 0 30px 0;">
            <q-btn @click="createGalerie()">Créer la galerie</q-btn>
          </div>
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
import { mapState } from 'vuex';
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

      periodeGalerie: '',
      groupesGalerie: '',
      pluriel: '',

      form: {
        name: '',
        dateDeb: '',
        dateFin: '',
        descript: '',
        group: [],
      },

      loading: true,
      errored: false,
      affUploadImages: false,
    };
  },
  // CHARGEMENT INITIAL
  mounted() {
    if (this.$route.params.id) {
      this.ChargeGalerie();
    } else {
      this.selectAllGroup();
    }
  },
  // RECHARGEMENT PAGE SUITE APPEL ROUTER
  watch: {
    $route() {
      this.InitVar();
      if (this.$route.params.id) this.ChargeGalerie();
    },
    lstGroup() {
      this.selectAllGroup();
    },
  },
  computed: {
    ...mapState({
      lstGroup: state => state.gallery.groups,
    }),
  },
  methods: {
    // INITIALISATION GALERIE
    InitVar() {
      this.idGalerie = null;

      this.form.name = '';
      this.form.descript = '';
      this.form.dateDeb = '';
      this.form.dateFin = '';
      this.form.group = [];

      this.galerieImages = [];
      this.periodeGalerie = '';
      this.groupesGalerie = '';
      this.affUploadImages = false;

      this.selectAllGroup();
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
          if (this.$route.params.id) {
            this.form.name = response.data.name;
            this.form.descript = response.data.description;
            this.form.dateDeb = response.data.date_start;
            this.form.dateFin = response.data.date_end;
            this.constructPeriode();

            response.data.groups.forEach((group) => {
              if (this.groupesGalerie !== '') {
                this.pluriel = 's';
                this.groupesGalerie = `${this.groupesGalerie}, `;
              }
              this.groupesGalerie = `${this.groupesGalerie}${group}`;
            });

            // Infos Images
            if (response.data.img) {
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
            }

            this.affUploadImages = true;
          }
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
        // Modif vuex store pour actualisation menu et page
        this.$store.commit('gallery/setNewGallery', response.data.id);
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
              this.$refs.uploadcomponent.removeFile(image);

              // Affichage image dans galerie
              if (response.data.id > 0) {
                const baseURL = `${this.$store.state.gallery.URL_IMG}${response.data.dir}/`;
                this.galerieImages.push({
                  id: response.data.id,
                  src: `${baseURL}${response.data.mini_filename}`,
                  srcFull: `${baseURL}${response.data.filename}`,
                  nbComment: 0,
                  nbLike: 0,
                  Like: false,
                });
              }
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
    constructPeriode() {
      this.periodeGalerie = '';
      if (this.form.dateDeb !== '' && this.form.dateFin !== '') {
        this.periodeGalerie = `${this.form.dateDeb} au ${this.form.dateFin}`;
      } else if (this.form.dateDeb !== '' && (this.form.dateFin === '' || this.form.dateDeb === this.form.dateFin)) {
        this.periodeGalerie = this.form.dateDeb;
      }
    },
    selectAllGroup() {
      this.lstGroup.forEach((group) => {
        this.form.group.push(group.value);
      });
    },
  },
};
</script>
<style>
</style>
