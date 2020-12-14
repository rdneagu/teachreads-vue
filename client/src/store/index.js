import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    tooltip: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    unsetUser(state) {
      state.user = null;
    },
  },
  actions: {
  },
  modules: {
  },
});
