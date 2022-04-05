import { constantRoutes } from '@/router'

const state = {
  routes: constantRoutes
}

const mutations = {
  initRoutes: (state) => {
    state.routes = constantRoutes
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
