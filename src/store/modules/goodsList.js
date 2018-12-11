
const goodsList = {
  state: {
    goodsList: {}
  },

  mutations: {
    SET_GOODSLIST: (state, goodsList) => {
      state.goodsList = goodsList
    }
  },

  actions: {
    setGoodsList({ commit }, goodsList) {
      return new Promise((resolve, reject) => {
        commit('SET_GOODSLIST', goodsList)
        resolve()
      })
    }
  }
}

export default goodsList
