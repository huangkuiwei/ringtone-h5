<template>
  <view class="member-page">
    <view class="page-title">家庭成员</view>

    <view class="family">
      <view class="tips1">邀请家人 共享闹铃</view>
      <view class="tips2">家人可共享全部铃音 守护专属来电体验</view>
      <image @click="invitation" mode="widthFix" src="/static/images/member/btn01.png" />
    </view>

    <view class="family-detail">
      <view class="title">
        <text class="name">158****6688 的家庭</text>
        <text class="number">{{ rememberList.length }}人</text>
      </view>

      <view class="member-list">
        <template v-if="rememberList.length">
          <view class="item" v-for="item of rememberList" :key="item.id">
            <image mode="widthFix" src="/static/images/member/head.png" />
            <view class="phone">{{ item.phone }}</view>
            <view class="delete" @click="deleteRemember(item)">删除</view>
          </view>
        </template>

        <view v-else class="no-remember">暂无内容</view>
      </view>
    </view>

    <uni-popup ref="invitationDialog">
      <view class="invitation-dialog">
        <image mode="widthFix" src="/static/images/member/bg03.png" />

        <view class="content">
          <view class="title">新增成员</view>

          <view class="input-box">
            <text>手机号</text>
            <input v-model="phone" type="text" />
          </view>

          <view class="options">
            <image @click="$refs.invitationDialog.close()" mode="widthFix" src="/static/images/member/btn02.png" />
            <image @click="submitRemember" mode="widthFix" src="/static/images/member/btn03.png" />
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'indexPage',

  data() {
    return {
      rememberList: [
        { id: 0, phone: '152****1111' },
        { id: 1, phone: '152****2222' },
        { id: 2, phone: '152****3333' },
        { id: 3, phone: '152****4444' },
      ],
      phone: undefined,
    };
  },

  onShow() {},

  methods: {
    /**
     * TODO 邀请
     */
    invitation() {
      this.$refs.invitationDialog.open();
    },

    /**
     * TODO 删除
     * @param item
     */
    deleteRemember(item) {
      console.log('item', item);
    },

    /**
     * TODO 确认邀请
     */
    submitRemember() {
      if (/^1[3-9]\d{9}$/.test(this.phone)) {
      } else {
        uni.showToast({
          title: '手机号不正确',
          icon: 'none',
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
page {
  min-height: 100%;
  background: #f4f6fa url('@/static/images/member/bg01.png') left top/100% auto no-repeat;
}

.member-page {
  padding: 0 37rpx;

  .page-title {
  }

  .family {
    margin-top: 100rpx;
    padding: 46rpx 31rpx;
    background: url('@/static/images/member/bg02.png') left top/100% 100% no-repeat;
    display: flex;
    flex-direction: column;

    .tips1 {
      font-weight: 600;
      font-size: 29rpx;
      color: #000000;
    }

    .tips2 {
      margin-top: 20rpx;
      font-size: 21rpx;
      color: #696969;
    }

    image {
      margin-top: 41rpx;
      width: 203rpx;
    }
  }

  .family-detail {
    margin-top: 27rpx;
    background: #ffffff;
    border-radius: 21rpx;
    border: 3px solid #ffffff;
    padding: 36rpx 10rpx;

    .title {
      padding-left: 31rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .name {
        font-weight: 600;
        font-size: 29rpx;
        color: #000000;
      }

      .number {
        height: 40rpx;
        padding: 0 22rpx;
        background: #eff9ff;
        border-radius: 17rpx;
        font-size: 27rpx;
        color: #2987ff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .member-list {
      margin-top: 40rpx;
      background: #f6f6f6;
      border-radius: 21rpx;
      border: 3px solid #ffffff;
      padding: 28rpx 40rpx;
      display: flex;
      flex-direction: column;
      gap: 20rpx;

      .item {
        display: flex;
        align-items: center;

        image {
          flex-shrink: 0;
          width: 98rpx;
        }

        .phone {
          flex-grow: 1;
          margin-left: 24rpx;
          font-size: 31rpx;
          color: #000000;
        }

        .delete {
          width: 144rpx;
          height: 51rpx;
          background: #ffeded;
          border-radius: 25rpx;
          font-size: 20rpx;
          color: #ed0100;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .no-remember {
        text-align: center;
        font-size: 22rpx;
        color: #555555;
      }
    }
  }
}

.invitation-dialog {
  width: 630rpx;
  position: relative;

  image {
    width: 100%;
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    padding: 33rpx 36rpx;

    .title {
      font-weight: 600;
      font-size: 29rpx;
      color: #000000;
      text-align: center;
    }

    .input-box {
      margin-top: 40rpx;
      display: flex;
      align-items: center;

      text {
        flex-shrink: 0;
        font-size: 26rpx;
        color: #000000;
        margin-right: 11rpx;
      }

      input {
        flex-grow: 1;
        height: 81rpx;
        padding: 0 20rpx;
        background: #ffffff;
        border-radius: 10rpx;
        border: 1px solid #e5e5e5;
      }
    }

    .options {
      margin-top: 54rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      image {
        width: 270rpx;
      }
    }
  }
}
</style>
