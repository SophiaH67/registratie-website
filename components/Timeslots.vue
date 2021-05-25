<template>
  <div class="container">
    <div>
      <div>
        <v-card
          elevation="2"
          width="80%"
          min-width="30rem"
          max-width="60rem"
          class="justify-center"
          style="margin: 1rem"
        >
          <v-flex class="pa-10 pb-8 text-center">
            <v-img src="/header.png" class="mx-auto"/>
          </v-flex>
        </v-card>
      </div>
      <Timeslot
        v-for="item in timeslots"
        :key="item.startTimeUnix"
        :startTime="item.startTime"
        :endTime="item.endTime"
        :families="item.families || []"
        :slotID="item._id"
        :roomLeft="item.roomLeft"
        :registered="item.registered"
        />
    </div>
  </div>
</template>

<script>
import Timeslot from './Timeslot';
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Timeslot
  },
  methods: mapActions("timeslots", ["getTimeslots"]),
  computed: mapState("timeslots", ["timeslots"]),
  async fetch() {
    await this.getTimeslots()
  }
}
</script>

<style>
.container {
  display: grid;
  place-items: center;
}
</style>