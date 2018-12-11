import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import material from './modules/material'
import submit from './modules/submitInfor'
import goodsList from './modules/goodsList'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    user,
    material,
    submit,
    goodsList
  },
  getters
})

export default store
