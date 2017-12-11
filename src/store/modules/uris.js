import HTTP from '../../api';

const state = {
  uris: [],
  list: null,
};

const getters = {
  uris: state => state.uris,
  list: state => state.list,
};

const actions = {
  add({ commit, dispatch, state }, uri) {
    if (typeof uri === 'string') {
      const regex = new RegExp(
        '(http(s){0,1}://.){0,1}(www\\.){0,1}[\\-a-zA-Z0-9@:%\\._\\+~#=]{2,256}\\.[a-z‌​]{2,6}\\b([\\-a-zA-Z0-9‌​@:%_\\+\\.~#\\?&=]{0,})',
        'g',
      );
      if (regex.exec(uri)) {
        if (state.uris.filter(u => u.url === uri).length === 0) {
          if (state.uris.length === 0) {
            dispatch('create');
          }

          commit('add', { url: uri });
        } else {
          throw new Error('Already added');
        }
      } else {
        throw new Error('Not an URL');
      }
    } else if (state.uris.filter(u => u.url === uri.url).length === 0) {
      if (state.uris.length === 0) {
        dispatch('create');
      }

      commit('add', { url: uri });
    } else {
      throw new Error('Already added');
    }
  },
  create({ commit, state }) {
    if (state.list === null) {
      HTTP.post('list/create')
        .then((response) => {
          commit('create', response.data.id);
        })
        .catch(() => {
          throw new Error('Unable to create your list');
        });
    }
  },
};

const mutations = {
  add(state, uri) {
    state.uris.push(uri);
  },
  clear(state) {
    state.uris = [];
    state.list = null;
  },
  create(state, listId) {
    state.list = listId;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
