import { allSubjectList } from '@/api/subject'

const state = {
  subjects: []
}

const getters = {
  subjectEnumFormat: (state) => (key) => {
    for (const item of state.subjects) {
      if (item.id === key) {
        return item.name + ' ( ' + item.levelName + ' )'
      }
    }
    return null
  }
}

// actions
const actions = {
  initSubject({ commit }, action) {
    allSubjectList().then(re => {
      commit('setSubjects', re.data)
      if (action !== undefined) {
        action()
      }
    })
  }
}

// mutations
const mutations = {
  setSubjects: (state, subjects) => {
    state.subjects = subjects
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
