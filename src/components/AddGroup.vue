<template>
  <div>
    <div class="q-gutter-y-md">
      <q-input outlined v-model="form.groupNew" label="Nouveau groupe"
                         v-if="!form.groupSelect.name"
                         dense class="q-py-xs" />

      <q-select dense class="q-pb-xs"
                v-if="!form.groupNew"
                outlined label="Sélection groupe"
                v-model="form.groupSelect"
                :options="lstGroup"
                option-value="id"
                option-label="name"
                input-debounce="0" />

      <div class="q-pa-xs">
        <q-option-group
          v-model="form.users"
          :options="lstUsers"
          color="green" type="toggle" dense
        />
      </div>

      <div class="row float-right">
        <div class="q-pa-xs">
          <q-btn v-if="form.groupNew || form.groupSelect.name"
                 @click="addGroup()" dense class="bg-primary text-white">
            {{ form.groupSelect.name ? 'Modifier' : 'Valider' }} groupe
          </q-btn>
        </div>
        <div class="q-pa-xs">
          <q-btn v-if="form.groupSelect.name"
                 @click="delGroup()" dense class="bg-red text-white">
            Supprimer groupe
          </q-btn>
        </div>
      </div>
      <q-space/>
    </div>
  </div>
</template>

<script>
// GESTION GROUP
import Http from 'axios';
import { Notify } from 'quasar';

export default {
  name: 'AddGroup',
  data() {
    return {
      lstGroup: [],
      lstUsers: [],
      form: {
        groupNew: '',
        groupSelect: {
          id: 0,
          name: '',
        },
        users: [],
      },
    };
  },
  watch: {
    // Changement saisie nouveau groupe => gestion users
    'form.groupNew': {
      handler(newVal, oldVal) {
        if (oldVal !== '' && newVal === '') {
          this.form.users = [];
        }
      },
      deep: true,
    },
    // Changement sélection groupe => gestion users
    'form.groupSelect': {
      handler() {
        this.form.users = [];
        if (this.form.groupSelect.name) {
          this.lstGroup.forEach((group) => {
            if (this.form.groupSelect.id === group.id) {
              this.form.users = group.users;
            }
          });
        }
      },
      deep: true,
    },
  },
  mounted() {
    // Chargement des infos groupes / users
    (async () => {
      const url = this.$store.getters['gallery/getRoute']('GROUPS_URL');
      const response = await Http.get(url);

      // Chargement liste groupes existant
      this.lstGroup = [];
      this.lstGroup.push({
        id: 0,
        name: '',
      });
      response.data.Groups.forEach((group) => {
        this.lstGroup.push({
          id: group.id,
          name: group.name,
          users: group.users,
        });
      });

      // Chargement users existant
      this.lstUsers = [];
      response.data.Users.forEach((user) => {
        this.lstUsers.push({
          value: user.id,
          label: user.name,
        });
      });
    })();
  },
  methods: {
    addGroupError() {
      Notify.create({
        message: 'Erreur validation',
        icon: 'lock',
        timeout: 2500,
      });
    },
    addGroup() {
      // Appel API validation
      const reqParams = {};
      if (this.form.groupNew) reqParams.name = this.form.groupNew;
      if (this.form.groupSelect.id) reqParams.id = this.form.groupSelect.id;
      reqParams.usergroup = [];
      this.form.users.forEach((idUser) => {
        reqParams.usergroup.push({ id: idUser });
      });

      Http({
        method: 'post',
        url: this.$store.getters['gallery/getRoute']('GROUPS_URL'),
        data: reqParams,
      })
        .then(() => {
          this.$emit('hideFen');
        })
        .catch(() => {
          this.addGroupError();
        });
    },
    delGroup() {
      // Appel API suppression
      if (this.form.groupSelect.id) {
        const reqParams = {};
        reqParams.id = this.form.groupSelect.id;

        Http({
          method: 'delete',
          url: this.$store.getters['gallery/getRoute']('GROUPS_URL'),
          data: reqParams,
        })
          .then(() => {
            this.$emit('hideFen');
          })
          .catch(() => {
            this.addGroupError();
          });
      }
    },
  },
};
</script>
