<template>
  <div>
    <div class="q-gutter-y-md">
      <form @submit.prevent="handleSubmit(addGroup)">

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
                type="submit" dense class="bg-primary text-white">
                {{ form.groupSelect.name ? 'Modifier' : 'Valider' }} groupe
              </q-btn>
            </div>
            <div class="q-pa-xs">
              <q-btn v-if="form.groupSelect.name" type="submit" dense class="bg-red text-white">
                Supprimer groupe
              </q-btn>
            </div>
          </div>

          <q-space/>
      </form>
    </div>
  </div>
</template>

<script>
// GESTION GROUP
import API from '../api/routes';

export default {
  name: 'AddGroup',
  data() {
    return {
      lstGroup: null,
      lstUsers: null,
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
  mounted() {
    // Chargement des infos groupes / users
    (async () => {
      const response = await this.$oauth.getAPI(API.endpoints.GROUPS_INFOS_URL);

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
    addGroup() {
      // Appel API validation
      console.log(`Validation ${this.form.groupSelect.id} / ${this.form.groupSelect.name}`);
    },
  },
};
</script>
