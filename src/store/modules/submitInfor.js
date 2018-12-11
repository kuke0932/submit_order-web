
const submitDetails = {
  state: {
    submitDetails: {}
  },

  mutations: {
    SET_SUBMITDETAILS: (state, submitDetails) => {
      state.submitDetails = submitDetails
    }
  },

  actions: {
    setSubmitDetails({ commit }, submitDetails) {
      return new Promise((resolve, reject) => {
        commit('SET_SUBMITDETAILS', submitDetails)
        resolve()
      })
    }
  }
}

export default submitDetails
