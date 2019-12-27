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
        <q-btn v-if="affBtnAdmin" flat round dense icon="group_add" />
        <q-btn v-if="affBtnAdmin" flat round dense icon="person_add" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item clickable tag="a" to="/">
          <q-item-section avatar>
            <q-icon name="first_page" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Accueil</q-item-label>
            <q-item-label caption></q-item-label>
          </q-item-section>
        </q-item>

        <q-item tag="a" to="/add_galerie">
          <q-item-section avatar>
            <q-icon name="add_photo_alternate" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Ajouter galerie</q-item-label>
            <q-item-label caption></q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-for="(item, index) in detMenu" :key="index"
          tag="a" :to="{ name: 'galerie', params: { id: item.id }}">
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
    </q-page-container>
  </q-layout>
</template>

<script>
import { Notify } from 'quasar';
import API from '../api/routes';

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: false,
      APIRoutes: API,
      user: '',
      detMenu: '',
    };
  },
  mounted() {
    // Chargement des infos générales (galeries)
    (async () => {
      const response = await this.$oauth.getAPI(API.endpoints.MENU_URL);
      this.user = response.data.Util;
      if (this.user === '') this.logout();

      this.detMenu = response.data.Galeries;

      this.$store.commit('gallery/setImgSelect', response.data.BestImgs);
    })();
  },
  computed: {
    // Indicateur du role pour afficher boutons ajouter utilisateur ou groupe
    affBtnAdmin() {
      return this.$oauth.isAdmin();
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
        this.$oauth.logout();
        // [OAUTH] Redirection vers route Login
        this.$router.replace('/login');
      }, timeout);
    },
  },
};
</script>
