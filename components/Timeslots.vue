<template>
  <div class="container">
    <Timeslot
      v-for="item in this.timeslots"
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
import dayjs from 'dayjs';
export default {
  components: {
    Timeslot
  },
  data: function() {
    return {
      timeslots: []
    }
  },
  async fetch() {
    let timeslots = await this.$axios.$get('/api/getTimeslots')
    for(let timeslotIndex in timeslots) {
      let timeslot = timeslots[timeslotIndex];
      timeslot.startTime = dayjs(timeslot.startTimeUnix).format('DD MMM HH:MM');
      timeslot.endTime = dayjs(timeslot.endTimeUnix).format('HH:MM');
    }
    this.timeslots = timeslots;
  }
}
</script>

<style>
.container {
  display: grid;
  place-items: center;
}
</style>