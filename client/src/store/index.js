import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ksk_userInfo: 0,
  },
  mutations: {
    CHANGE_USER_INFO: (state, data) => {
      state.ksk_userInfo = data
    },

  },
  actions: {},
  modules: {},
  plugins: [createPersistedState()]
})