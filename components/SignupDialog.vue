<template>
  <v-row justify="center">
    <v-dialog v-model="dialogOpen" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="name" label="Naam" :rules="requiredRule"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Aantal personen"
                  type="number"
                  v-model="amountOfPeople"
                  :rules="amountOfPeopleRule"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-file-input v-on:change="uploadHandler($event)" accept="image/png, image/jpeg, image/bmp" v-on: label="Foto" prepend-icon="mdi-camera" />
              </v-col>
            </v-row>
            <v-img :src='pictureb64' :width="!pictureb64 ? 0 : undefined" :height="!pictureb64 ? 0 : undefined" />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeSignupDialog()">
            Annuleren
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="signup(slotID, name, pictureb64, amountOfPeople)"
          >
            Registreren
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "SignupDialog",
  modules: ["@nuxtjs/axios"],
  computed: mapState("dialog", ["title", "slotID", "dialogOpen"]),
  data: function () {
    return {
      pictureb64: "",
      amountOfPeopleRule: [
        (v) => !!v || "Verplicht",
        (v) => v >= 1 || "Minimum is 1",
        (v) => v <= 4 || "Maximum is 4",
      ],
      requiredRule: [(v) => !!v || "Verplicht"],
      amountOfPeople: "",
      name: ""
    };
  },
  methods: {
    signup(slotID, name, picture, amountOfPeople) {
      let family = {
        slotID: slotID,
        name: name,
        picture: picture,
        amountOfPeople: parseInt(amountOfPeople),
      };
      this.$axios.$post("/api/addFamily", family).then(res => {
        if (res?.data?.error) throw new Exception(res.data.error)
        this.closeSignupDialog()
        this.getTimeslots()
      });
    },
    async uploadHandler(event){
      if(!event) return this.pictureb64 = ""
      const reader = new FileReader();
      reader.readAsDataURL(event);
      reader.onload = () => this.pictureb64 = reader.result;
      reader.onerror = error => {throw new Exception(error)}
    },
    ...mapMutations("dialog", ["closeSignupDialog"]),
    ...mapActions("timeslots", ["getTimeslots"]),
  },
};
</script>