import dayjs from 'dayjs';

export const state = () => ({
  timeslots: [],
})

export const actions = {
  async getTimeslots () {
    let timeslots = await this.$axios.$get('/api/getTimeslots')
    for(let timeslotIndex in timeslots) {
      let timeslot = timeslots[timeslotIndex];
      timeslot.startTime = dayjs(timeslot.startTimeUnix).format('DD MMM HH:mm');
      timeslot.endTime = dayjs(timeslot.endTimeUnix).format('HH:mm');
    }
    this.commit("timeslots/updateTimeslots", timeslots)
    return timeslots
  }
}

export const mutations = {
  updateTimeslots (state, timeslots) {
    state.timeslots = timeslots
  }
}