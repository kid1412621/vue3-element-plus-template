import { createStore } from "vuex";

export default createStore({
  state: {
    token: sessionStorage.getItem("token") || "",
  },
  getters: {
    isAuth: (state) => !!state.token,
  },
  mutations: {
    updateToken: (state, token) => {
      state.token = token;
      sessionStorage.setItem("token", token);
    },
  },
  actions: {},
  modules: {},
});
