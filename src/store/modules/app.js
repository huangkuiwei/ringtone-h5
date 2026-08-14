import $http from '@/utils/http';

const appStore = {
  namespaced: true,

  state: {
    userInfo: {},
  },

  getters: {
    isLogin: (state) => {
      return state.userInfo.id;
    },

    count: (state) => {
      return state.userInfo.use_count || 0;
    },
  },

  mutations: {
    _setUserInfo(state, payload) {
      state.userInfo = payload;
    },
  },

  actions: {
    // 获取用户消息
    _getUserInfo({ commit }) {
      return $http
        .post(
          'api/app/user/get',
          {},
          {
            hideLoginBox: true,
          },
        )
        .then((res) => {
          res.data.phone = res.data.phone.slice(0, 3) + '****' + res.data.phone.slice(-4);
          commit('_setUserInfo', res.data);
        });
    },
  },
};

export default appStore;
