
const material = {
  state: {
    checkedMaterial: {}
  },

  mutations: {
    SET_CHECKEDMATERIAL: (state, checkedMaterial) => {
      state.checkedMaterial = checkedMaterial
    }
  },

  actions: {
    setCheckedMaterial({ commit }, checkedMaterial) {
      return new Promise((resolve, reject) => {
        commit('SET_CHECKEDMATERIAL', checkedMaterial)
        resolve()
      })
    }
  }
}

export default material
