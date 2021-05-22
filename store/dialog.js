export const state = () => ({
  slotID: "",
  title: "Title",
  dialogOpen: false,
  roomLeft: 0
})

export const mutations = {
  openSignupDialog(state, obj) {
    state.slotID = obj.slotID
    state.title = obj.title
    state.roomLeft = obj.roomLeft
    state.dialogOpen = true
  },
  closeSignupDialog(state) {
    state.dialogOpen = false
  }
}