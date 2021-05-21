export const state = () => ({
  slotID: "",
  title: "Title",
  dialogOpen: false
})

export const mutations = {
  openSignupDialog(state, obj) {
    state.slotID = obj.slotID
    state.title = obj.title
    state.dialogOpen = true
  },
  closeSignupDialog(state) {
    state.dialogOpen = false
  }
}