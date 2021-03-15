export const state = () => ({
  initialCount: 0,
})

export const getters = {
  initialCount(state) {
    return state.initialCount
  },
}

export const mutations = {
  initialCount(state, payload) {
    state.initialCount = payload
  },
}
