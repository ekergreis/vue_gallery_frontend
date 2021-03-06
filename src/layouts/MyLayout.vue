<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Galeries
        </q-toolbar-title>

        <q-space/>
        <div style="margin-right: 30px">{{ this.user }}</div>
        <q-btn v-if="affBtnAdmin" flat round dense icon="group_add"  @click="affGroup = true" />
        <q-btn v-if="affBtnAdmin" flat round dense icon="person_add" @click="affUser = true" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item clickable v-ripple :to="{ name: 'img_selection'}" exact
                :active="link === 'img_selection'" @click="link = 'img_selection'" >
          <q-item-section avatar>
            <q-icon name="first_page" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Accueil</q-item-label>
            <q-item-label caption></q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple :to="{ name: 'galerie'}" exact
                :active="link === 'galerie'" @click="link = 'galerie'">
          <q-item-section avatar>
            <q-icon name="add_photo_alternate" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Ajouter galerie</q-item-label>
            <q-item-label caption></q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-for="(item, index) in detMenu" :key="index" exact
                clickable v-ripple :to="{ name: 'galerie', params: { id: item.id }}"
                :active="link === `galerie/${item.id}`" @click="link = 'galerie/${item.id}'">
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
            <q-item-label caption>{{ item.date_start }} au {{ item.date_end }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Déconnexion</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />

    <q-dialog full-height v-if="affBtnAdmin"
              v-model="affFenComptes" >
      <q-card style="max-width: 500px;width:400px">
        <q-card-section class="row items-center">
          <div v-if="affUser" class="text-h6 ">Création compte utilisateur</div>
          <div v-if="affGroup" class="text-h6">Gestion groupes</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <add-user v-if="affUser" @hideFen="hideFenComptes" />
          <add-group v-if="affGroup" @hideFen="hideFenComptes" />
        </q-card-section>
      </q-card>
    </q-dialog>

    </q-page-container>
  </q-layout>
</template>

<script>
import { Notify } from 'quasar';
import Http from 'axios';
import { mapState } from 'vuex';
import AddUser from 'components/AddUser';
import AddGroup from 'components/AddGroup';

export default {
  name: 'MyLayout',
  components: {
    AddUser,
    AddGroup,
  },
  data() {
    return {
      link: '',
      leftDrawerOpen: false,
      user: '',
      detMenu: null,

      affUser: false,
      affGroup: false,
    };
  },
  mounted() {
    // Chargement des infos générales (galeries)
    this.chargeMenu();
  },
  computed: {
    // Detect demande rechargement menu
    ...mapState({
      new_gallery: state => state.gallery.new_gallery,
    }),
    // Indicateur du role pour afficher boutons ajouter utilisateur ou groupe
    affBtnAdmin() {
      return this.$store.getters['auth/roleAuth'];
    },
    // Indicateur d'affichage de la fenêtre gestion de comptes ou groupes
    affFenComptes: {
      get() {
        if (this.affUser || this.affGroup) return true;
        return false;
      },
      set() {
        this.affUser = false;
        this.affGroup = false;
      },
    },
  },
  watch: {
    new_gallery(idGallery) {
      this.chargeMenu(idGallery);
    },
  },
  methods: {
    // Clic sur deconnexion
    logout() {
      const timeout = 1500;
      Notify.create({
        message: 'Déconnexion en cours ...',
        icon: 'alarm_add',
        timeout,
      });
      setTimeout(() => {
        // [OAUTH] Déconnexion
        this.$store.dispatch('auth/logout');
        // [OAUTH] Redirection vers route Login
        this.$router.replace('/login');
      }, timeout);
    },
    // Déclenchement fermeture fenêtre comptes (users/groupes)
    hideFenComptes() {
      this.affUser = false;
      this.affGroup = false;
    },
    async chargeMenu(idGallery = null) {
      this.detMenu = null;
      const url = this.$store.getters['gallery/getRoute']('GALERIE_URL');
      const response = await Http.get(url);

      this.user = response.data.Util;
      if (this.user === '') this.logout();

      this.detMenu = response.data.Galeries;

      this.$store.commit('gallery/setGroups', response.data.Groups);
      this.$store.commit('gallery/setImgSelect', response.data.BestImgs);

      if (idGallery !== null) {
        this.$router.replace(`/galerie/${idGallery}`);
      }
    },
  },
};
</script>
