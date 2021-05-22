export const state = () => ({
  text: "",
  open: true,
})

export const mutations = {
  createSnackbar(state, text) {
    state.text = text
    state.dialogOpen = true
  },
  closeSnackbar(state) {
    state.open = false
  }
}