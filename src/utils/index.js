import store from '@/store';

export const toRouter = (url, params) => {
  params ? (url = url + '?' + params) : '';

  uni.navigateTo({
    url,
  });
};

export const toSwitch = (url) => {
  uni.switchTab({
    url,
  });
};

export const toReLaunch = (url, params) => {
  params ? (url = url + '?' + params) : '';

  uni.reLaunch({
    url,
  });
};

export const toBack = (delta = 1) => {
  uni.navigateBack(delta);
};

/**
 * 验证是否登录，未登录弹窗提示
 */
export function verifyIsLogin() {
  if (store.getters['app/isLogin']) {
    return true;
  }

  uni.showModal({
    title: '提示',
    content: '您当前未登录或登录已失效，为了您有更好的体验，咪咕明星需要您登录',
    showCancel: true,
    success: (res) => {
      if (res.confirm) {
        toRouter('/packageLogin/pages/login/login');
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });

  throw Error('请先登录');
}
