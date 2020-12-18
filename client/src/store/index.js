import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    tooltip: null,
  },
  mutations: {
    setUser(state, user) {
      console.log(user);
      state.user = user;
    },
    unsetUser(state) {
      state.user = null;
    },
    showTooltip(state, tooltip) {
      state.tooltip = tooltip;
    },
    hideTooltip(state) {
      state.tooltip = null;
    },
  },
  actions: {
  },
  modules: {
  },
});
