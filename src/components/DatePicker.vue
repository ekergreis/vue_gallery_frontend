<template>
  <div style="max-width: 160px; margin:0px" >
    <q-input class="q-pb-xs" outlined dense v-model="date" mask="##/##/####" >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="date" mask="DD/MM/YYYY"
                    minimal @input="() => $refs.qDateProxy.hide()" :locale="myLocale" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: '01/01/2020',
      myLocale: {
        days: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
        daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
        months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split('_'),
        monthsShort: 'Janv_Févr_Mars_Avr_Mai_Juin_Juill_Août_Sept_Oct_Nov_Déc'.split('_'),
        firstDayOfWeek: 1,
      },
    };
  },
  mounted() {
    this.$emit('input', this.date);
  },
  watch: {
    date() {
      this.$emit('input', this.date);
    },
  },
};
</script>
