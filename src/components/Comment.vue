<template>
  <div >
    <q-chat-message v-for="item in comments" :key="item.id"
      :name="item.nom"
      :text="[item.texte]"
      :sent="item.byMe" />
  </div>
</template>

<script>
// GESTION COMMENTAIRES SUR IMAGE
export default {
  name: 'Comment',
  data() {
    return {
    };
  },
  // Paramètres du composant
  props: {
    imageId: Number,
    nom: String,
    comments: {},
  },
};
</script>
