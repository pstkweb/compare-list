import Vue from 'vue';
import Vuex from 'vuex';
import uris from './modules/uris';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { uris },
});
