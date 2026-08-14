<template>
  <view class="login-page">
    <view class="page-title">
      <text></text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#666666" type="left" size="22"></uni-icons>
      </view>
    </view>

    <view class="container">
      <view class="title">
        <view>您好，</view>
        <view>欢迎使用咪咕明星闹铃</view>
      </view>

      <view class="input-box">
        <view class="phone-box">
          <view class="label">手机号</view>
          <view class="value">
            <input
              type="text"
              :value="formState.phone"
              @input="formState.phone = $event.detail.value"
              placeholder="请输入手机号"
            />
          </view>
        </view>

        <view class="code-box">
          <view class="label">验证码</view>
          <view class="value">
            <input
              type="number"
              :maxlength="6"
              placeholder="请输入验证码"
              :value="formState.sms_code"
              @input="formState.sms_code = $event.detail.value"
            />
            <text class="code" @click="sendCode">{{ codeTip }}</text>
          </view>
        </view>
      </view>

      <view class="login" @click="login">
        <image mode="widthFix" src="/static/images/login/btn01.png" />
      </view>
    </view>
  </view>
</template>

<script>
import $http from '@/utils/http';
import { mapActions } from 'vuex';

export default {
  name: 'login',

  data() {
    return {
      formState: {
        phone: '',
        sms_sign: '',
        sms_code: '',
      },
      countdown: 0,
    };
  },

  watch: {
    countdown(value) {
      setTimeout(() => {
        if (value > 0) {
          let countdown = this.countdown - 1;

          if (countdown < 0) {
            this.countdown = 0;
          } else {
            this.countdown--;
          }
        }
      }, 1000);
    },
  },

  computed: {
    disabled() {
      return !!this.countdown;
    },

    codeTip() {
      if (this.countdown) {
        return `${this.countdown}S重新获取`;
      } else {
        return '获取验证码';
      }
    },
  },

  methods: {
    ...mapActions('app', ['_getUserInfo']),

    /**
     * 发送验证码
     */
    sendCode() {
      if (this.disabled) return;

      if (!this.formState.phone) {
        uni.showToast({
          title: '手机号错误',
          icon: 'none',
        });

        return;
      }

      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/global/sms/send_code', {
          mobile: this.formState.phone,
        })
        .then((res) => {
          uni.hideLoading();

          this.formState.sms_sign = res.data.sign;
          this.countdown = 60;
        });
    },

    /**
     * 登录
     */
    login() {
      if (!this.formState.phone) {
        uni.showToast({
          title: '手机号错误',
          icon: 'none',
        });

        return;
      }

      if (!this.formState.sms_code) {
        uni.showToast({
          title: '验证码错误',
          icon: 'none',
        });

        return;
      }

      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/app/user/login', {
          phone: this.formState.phone,
          sms_sign: this.formState.sms_sign,
          sms_code: this.formState.sms_code,
        })
        .then((res) => {
          // 登录完成之后保存 token
          uni.setStorageSync('alarmToken', res.data.token);

          // 登录完成获取用户信息
          this._getUserInfo().then(() => {
            uni.hideLoading();

            uni.showToast({
              title: '登录成功',
              icon: 'none',
              mask: true,
            });

            uni.switchTab({
              url: '/pages/index/index',
            });
          });
        });
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  background: #ffffff url('@/static/images/login/bg.png') top left/100% auto no-repeat;
}
</style>

<style scoped lang="scss">
.login-page {
  .page-title {
  }

  .container {
    padding-top: 160rpx;

    .title {
      padding-left: 63rpx;
      display: flex;
      flex-direction: column;
      font-weight: 500;
      font-size: 34rpx;
      color: #000000;
      gap: 20rpx;
    }

    .input-box {
      margin-top: 140rpx;
      padding: 0 55rpx;
      display: flex;
      flex-direction: column;
      gap: 56rpx;

      .phone-box,
      .code-box {
        display: flex;
        flex-direction: column;
        padding-bottom: 20rpx;
        border-bottom: 1px solid #e6e6e6;
        gap: 24rpx;

        .label {
          font-size: 29rpx;
          color: #000000;
        }

        .value {
          position: relative;

          .code {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 27rpx;
            color: #0061f2;
          }
        }
      }
    }

    .login {
      margin-top: 90rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        width: 572rpx;
      }
    }
  }
}
</style>
