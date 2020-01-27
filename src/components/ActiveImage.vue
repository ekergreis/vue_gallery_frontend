<template>
  <div>

    <q-card class="my-card" :style="cardStyles">
      <q-img :src="src" :style="imgStyles" @click="diaporama" />
      <q-card-actions align="right">
        <q-btn round flat icon="comment" class="q-ml-md" @click="fenComment">
          <q-badge v-show="nbComment" color="blue" floating>{{ nbComment }}</q-badge>
        </q-btn>
        <q-btn round flat :icon="iconLike" class="q-ml-md">
          <q-badge v-show="nbLike" color="blue" floating>{{ nbLike }}</q-badge>
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-dialog v-model="affComment">
      <q-card style="max-width: 800px;width:700px;height:500px">
        <q-card-section class="row items-center">
          <q-img :src="src" style="max-width:100px;margin-right:20px" />
          <div class="text-h6">Commentaires</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <comment :imageId="imageId" :comments="activeComments" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
// GESTION AFFICHAGE D'UNE IMAGE
import Comment from 'components/Comment';
import Http from 'axios';

export default {
  name: 'ActiveImage',
  components: {
    Comment,
  },
  data() {
    return {
      affComment: false,
      activeComments: [],
    };
  },
  // Paramètres du composant
  props: {
    imagePos: {
      type: Number,
      default: 0,
    },
    imageId: {
      type: Number,
      default: 0,
    },
    src: {
      type: String,
    },
    nbComment: {
      type: Number,
      default: 0,
    },
    nbLike: {
      type: Number,
      default: 0,
    },
    Like: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 250,
    },
    margin: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    // Style du q-card (contenant l'image et les boutons actions)
    cardStyles() {
      const stls = [
        { margin: `${this.margin}px` },
      ];
      return stls;
    },
    // Style de l'image miniature
    imgStyles() {
      const stls = [
        { padding: this.round ? '2px 2px 0 2px' : '0' },
        { margin: '0px' },
        { cursor: 'pointer' },
        { width: `${this.size}px` },
        { height: '100%' },
      ];
      return stls;
    },
    // Sélection de l'image Like
    iconLike() {
      let iconLike = 'favorite_border';
      if (this.Like) iconLike = 'favorite';
      return iconLike;
    },
  },
  methods: {
    // Envoi Event au parent (Galerie) pour affichage diaporama (carousel)
    diaporama() {
      this.$emit('diaporama', this.imagePos);
    },
    // Affichage fenêtre commentaires
    fenComment() {
      this.showCarousel = false;
      this.activeComments = [];

      const dataParams = {
        id: this.imageId,
      };

      Http({
        method: 'get',
        url: this.$store.getters['gallery/getRoute']('COMMENTS_URL'),
        params: dataParams,
      })
        .then((response) => {
          response.data.forEach((comment) => {
            this.activeComments.push({
              id: comment.id,
              texte: comment.comment,
              nom: comment.create_by,
              byMe: comment.create_by_me,
            });
          });
          this.affComment = true;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
        });
    },
  },
};

</script>
