<template>
  <div>
    <div class="q-gutter-y-md">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(addUser)">

            <ValidationProvider name="Nom utilisateur"
              rules="required" immediate v-slot="{ errors }">
              <q-input outlined v-model="form.name" label="Nom utilisateur" dense class="q-py-md">
                <span class="spec-error-validator">{{ errors[0] }}</span>
              </q-input>
            </ValidationProvider>

            <ValidationProvider name="E-Mail" rules="required|email" immediate v-slot="{ errors }">
              <q-input outlined v-model="form.email" label="E-mail" dense class="q-pb-md">
                <span class="spec-error-validator">{{ errors[0] }}</span>
              </q-input>
            </ValidationProvider>

            <ValidationProvider name="Mot de passe"
              rules="required|confirmed:confirmation" immediate v-slot="{ errors }">
              <q-input outlined v-model="form.password" dense :type="isPwd ? 'password' : 'text'"
                label="Mot de passe">
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
                <span class="spec-error-validator">{{ errors[0] }}</span>
              </q-input>
            </ValidationProvider>

            <ValidationProvider vid="confirmation">
              <q-input outlined v-model="form.password_confirmation" dense
                class="q-pb-md"
                :type="isPwd ? 'password' : 'text'"
                label="Confirmation du mot de passe">
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </ValidationProvider>

            <q-select outlined v-model="form.role" :options="optionsRole" label="Role"
              class="q-pb-md" dense />

            <div class="row float-right">
              <q-btn type="submit" dense class="bg-primary text-white">
                Créer compte
              </q-btn>
            </div>

        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
// CREATION USER
// Chargement règles de contrôle Vee-Validate
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email, confirmed } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'Champ requis',
});
extend('email', {
  ...email,
  message: 'E-mail invalide',
});
extend('confirmed', {
  ...confirmed,
  message: 'Les mots de passe ne correspondent pas',
});

export default {
  name: 'AddUser',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'Standard',
      },
      isPwd: true,
      optionsRole: ['Standard', 'Admin'],
    };
  },
  methods: {
    addUser() {
      // Appel API validation
      console.log('Création');
    },
  },
};
</script>
