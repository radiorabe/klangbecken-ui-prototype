import Vue from 'vue'
import axios from 'axios'

import index from '@/search'


export default {
  state: {
    data: {},
  },

  getters: {
    hasData: (state) => !!state.data,
    data: (state) => state.data,
  },

  mutations: {
    setData: (state, newData) => {
      index.add(Object.values(newData))
      state.data = newData
    },
    addItem: (state, item) => {
      for (let key in item) {
        index.add(item[key])
        Vue.set(state.data, key, item[key])
      }
    },
    removeItem: (state, itemId) => {
      index.remove(state.data[itemId])
      Vue.delete(state.data, itemId)
    },
    updateItem: (state, {itemId, modifications}) => {
      for (let key in modifications) {
        Vue.set(state.data[itemId], key, modifications[key])
      }
      index.update(state.data[itemId])
    },
  },

  actions: {
    async loadData({commit}) {
      try {
        let response = await axios.get('/data/index.json')
        commit('setData', response.data)
      } catch (err) {
        // Show notification!
      }
    },
    async updateMetadata({commit}, {entry, modifications}) {
      try {
        let path = `/api/${entry.playlist}/${entry.id}${entry.ext}`
        await axios.put(path, modifications)
        commit('updateItem', {itemId: entry.id, modifications})
      } catch (err) {
        // Notification
      }
    },
  },
}
