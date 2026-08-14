<template>
  <view class="ringtone-page">
    <view class="page-title">铃音列表</view>

    <view class="order">
      <view class="title">已订购闹铃包</view>

      <view class="order-list">
        <template v-if="orderList.length">
          <view class="order-item" v-for="item of orderList" :key="item.id">
            <text class="name">{{ item.name }}</text>
            <text class="order-no">{{ item.box_id }}</text>
          </view>
        </template>

        <view class="no-order" v-else>暂无内容</view>
      </view>
    </view>

    <view class="aigc-order">
      <view class="title">AIGC闹铃</view>

      <view class="order-list">
        <template v-if="aigcOrderList.length">
          <view class="order-item" v-for="item of aigcOrderList" :key="item.id">
            <image :src="item.image_path" mode="widthFix" />

            <view class="info">
              <text class="name">{{ item.name }}</text>
              <text class="status" :class="{ 'no-setting': !item.is_set }">
                {{ item.is_set ? '已设置' : '未设置' }}
              </text>
            </view>

            <text class="option" @click="deleteAigc(item)">删除</text>
          </view>
        </template>

        <view class="no-order" v-else>暂无内容</view>
      </view>
    </view>

    <view class="ringtone-order">
      <view class="title">铃音盒闹铃</view>

      <view class="order-list">
        <template v-if="ringtoneOrderList.length">
          <view class="order-item" v-for="item of ringtoneOrderList" :key="item.id">
            <image :src="item.image_path" mode="widthFix" />

            <view class="info">
              <text class="name">{{ item.name }}</text>
              <text class="status" :class="{ 'no-setting': !item.is_set }">
                {{ item.is_set ? '已设置' : '未设置' }}
              </text>
            </view>

            <text class="option" @click="setting(item)" :class="{ setting: !item.is_set }">
              {{ item.is_set === '已设置' ? '取消设置' : '设置铃音' }}
            </text>
          </view>
        </template>

        <view class="no-order" v-else>暂无内容</view>
      </view>
    </view>
  </view>
</template>

<script>
import $http from '@/utils/http';

export default {
  name: 'ringtonePage',

  data() {
    return {
      orderList: [],
    };
  },

  onShow() {
    this.getData();
  },

  computed: {
    aigcOrderList() {
      return this.orderList.filter((item) => item.type === 0);
    },

    ringtoneOrderList() {
      return this.orderList.filter((item) => item.type === 1);
    },
  },

  methods: {
    getData() {
      return $http
        .post('api/app/ringtone/query-ringtones', {
          pageIndex: 1,
          pageSize: 9999,
        })
        .then((res) => {
          res.data.forEach((item) => {
            item.image_path = item.image_path || '/static/images/index/head.png';
          });

          this.orderList = res.data;
        });
    },

    /**
     * 删除
     * @param item
     */
    deleteAigc(item) {
      uni.showModal({
        title: '提示',
        content: '确认删除该条数据吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '加载中...',
              mask: true,
            });

            $http
              .post('api/app/ringtone/delete-ringtone', {
                id: item.id,
              })
              .then(() => {
                this.getData();
                uni.hideLoading();

                uni.showToast({
                  title: '操作成功',
                  icon: 'none',
                });
              });
          }
        },
      });
    },

    /**
     * 设置
     * @param item
     */
    setting(item) {
      let api = '';

      if (item.is_set) {
        api = 'api/app/ringtone/cancel-set-ringtone';
      } else {
        api = 'api/app/ringtone/set-ringtone';
      }

      uni.showModal({
        title: '提示',
        content: item.is_set ? '确认取消设置该铃音？' : '确认设置该铃音？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '加载中...',
              mask: true,
            });

            $http
              .post(api, {
                id: item.id,
              })
              .then(() => {
                this.getData();
                uni.hideLoading();

                uni.showToast({
                  title: '操作成功',
                  icon: 'none',
                });
              });
          }
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
page {
  min-height: 100%;
  background: #f4f6fa url('@/static/images/member/bg01.png') left top/100% auto no-repeat;
}

.ringtone-page {
  padding: 0 37rpx 80rpx;

  .page-title {
  }

  .order {
    margin-top: 100rpx;

    .title {
      font-weight: 600;
      font-size: 29rpx;
      color: #000000;
    }

    .order-list {
      margin-top: 23rpx;
      background: linear-gradient(to left, #f6fbd5, #ffffff);
      padding: 31rpx;
      border-radius: 20rpx;
      border: 4rpx solid #ffffff;
      display: flex;
      flex-direction: column;
      gap: 29rpx;

      .order-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 24rpx;
        color: #000000;

        &:not(:last-child) {
          padding-bottom: 29rpx;
          border-bottom: 2rpx solid #00000020;
        }
      }

      .no-order {
        text-align: center;
        font-size: 22rpx;
        color: #555555;
      }
    }
  }

  .aigc-order,
  .ringtone-order {
    margin-top: 37rpx;

    .title {
      font-weight: 600;
      font-size: 29rpx;
      color: #000000;
    }

    .order-list {
      margin-top: 25rpx;
      background: #ffffff;
      border-radius: 21rpx;
      border: 3px solid #ffffff;
      padding: 25rpx 17rpx;
      display: flex;
      flex-direction: column;
      gap: 7rpx;

      .order-item {
        background: #f6f6f6;
        border-radius: 21rpx;
        border: 3px solid #ffffff;
        padding: 25rpx 19rpx;
        display: flex;
        align-items: center;

        image {
          flex-shrink: 0;
          width: 113rpx;
        }

        .info {
          margin-left: 18rpx;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 30rpx;

          .name {
            font-size: 30rpx;
            color: #000000;
          }

          .status {
            width: 118rpx;
            height: 41rpx;
            background: #cce5ff;
            border-radius: 21rpx;
            font-size: 20rpx;
            color: #2f84ee;
            display: flex;
            align-items: center;
            justify-content: center;

            &.no-setting {
              background: #f0ffed;
              color: #16a91d;
            }
          }
        }

        .option {
          width: 144rpx;
          height: 51rpx;
          background: #ffeded;
          border-radius: 25rpx;
          font-size: 20rpx;
          color: #ed0100;
          display: flex;
          align-items: center;
          justify-content: center;

          &.setting {
            background: #cce5ff;
            color: #2f84ee;
          }
        }
      }

      .no-order {
        text-align: center;
        font-size: 22rpx;
        color: #555555;
      }
    }
  }
}
</style>
