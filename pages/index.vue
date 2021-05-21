<template>
  <div>
    <v-alert
      type="warning"
      text
    >
      I.V.M. met corona kunnen er maximum 4 mensen per tijdstip registreren
    </v-alert>
    <SignupDialog />
    <Timeslots />
  </div>
</template>

<script>
import Timeslots from "../components/Timeslots";
import SignupDialog from "../components/SignupDialog";

export default {
  components: {
    Timeslots,
    SignupDialog,
  },
};
</script>
