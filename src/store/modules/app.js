import $http from '@/utils/http';

const appStore = {
  namespaced: true,

  state: {
    userInfo: {},
  },

  mutations: {
    _setUserInfo(state, payload) {
      state.userInfo = payload;
    },
  },

  actions: {
    // TODO 获取用户消息
    _getUserInfo({ commit }) {
      return $http
        .get(
          'api/user/auth/userauth/info?referch=1',
          {},
          {
            hideLoginBox: true,
          },
        )
        .then((res) => {
          commit('_setUserInfo', res.data);
        });
    },
  },
};

export default appStore;
