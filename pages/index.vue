<template>
  <div>
    <v-alert
      type="warning"
      text
    >
      I.V.M. met corona kunnen er maximum 4 mensen per tijdstip registreren
    </v-alert>
    <Timeslots />
  </div>
</template>

<script>
import Timeslots from "../components/Timeslots";

export default {
  components: {
    Timeslots,
  },
};
</script>
