<template>
  <div class="container">
    <Timeslot
      v-for="item in timeslots"
      :key="item.startTimeUnix"
      :startTime="item.startTime"
      :endTime="item.endTime"
      :families="item.families || []"
      :slotID="item._id"
      />
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