<template>
  <view class="ringtone-page">
    <view class="page-title">闹铃设置</view>

    <!--TODO 缺少切图-->
    <view class="alarm-setting">
      <view class="title">预约闹铃设置</view>

      <view class="funs">
        <view class="fun-item">
          <image mode="widthFix" src="/static/images/member/head.png" />
          <view class="tips1">新增预约个人闹铃</view>
          <view class="tips2">专属视频闹铃电话提醒</view>
          <view class="btn" @click="appointment(1)">立即预约 ＞</view>
        </view>

        <view class="fun-item">
          <image mode="widthFix" src="/static/images/member/head.png" />
          <view class="tips1">新增预约家庭闹铃</view>
          <view class="tips2">专属视频闹铃电话提醒家人</view>
          <view class="btn btn2" @click="appointment(2)">立即预约 ＞</view>
        </view>
      </view>
    </view>

    <view class="alarm">
      <view class="title">闹铃列表</view>

      <view class="order-list">
        <template v-if="alarmList.length">
          <view class="order-item" v-for="item of alarmList" :key="item.id">
            <view class="info">
              <text class="type">类型：{{ item.type === 1 ? '个人' : '家庭' }}</text>
              <text class="account">账号：{{ item.account }}</text>
            </view>

            <text class="frequency">频率：{{ item.frequency === 1 ? '单次' : '周期' }}</text>
            <text class="time">预约时间：{{ item.time }}</text>
            <text class="name">视频播放：{{ item.name }}</text>

            <view class="options">
              <text @click="toggle(item)">停用</text>
              <text @click="modify(item)">修改</text>
              <text @click="deleteItem(item)">删除</text>
            </view>
          </view>
        </template>

        <view class="no-order" v-else>暂无内容</view>
      </view>
    </view>

    <uni-popup ref="appointmentDialog">
      <view class="appointment-dialog">
        <view class="title">新增预约{{ alarmData.type === 1 ? '个人' : '家庭' }}闹钟</view>

        <view class="frequency">
          <text :class="{ active: alarmData.frequency === 1 }" @click="alarmData.frequency = 1">单次</text>
          <text :class="{ active: alarmData.frequency === 2 }" @click="alarmData.frequency = 2">周期</text>
        </view>

        <view class="line"></view>

        <view class="week" v-if="alarmData.frequency === 2">
          <view
            class="item"
            :class="{ active: item.selected }"
            @click="item.selected = !item.selected"
            v-for="item of weekList"
            :key="item.id"
          >
            {{ item.text }}
          </view>
        </view>

        <view class="detail">
          <view class="left">
            <view class="time" v-if="alarmData.frequency === 1">
              <text class="label">预约时间</text>
              <picker mode="date" :value="alarmData.date" @change="alarmData.date = $event.detail.value">
                <view class="value">
                  <text class="value-text" v-if="alarmData.date">{{ alarmData.date }}</text>
                  <text class="value-text" v-else style="color: #666666">选择日期</text>
                  <uni-icons type="calendar" size="12" />
                </view>
              </picker>
            </view>

            <view class="video">
              <text class="label">视频播放</text>
              <picker
                mode="selector"
                @change="alarmData.video = $event.detail.value"
                range-key="name"
                :value="alarmData.video"
                :range="alarmData.type === 1 ? videoList.slice(0, 2) : videoList"
              >
                <view class="value">
                  <text class="value-text" v-if="videoList[alarmData.video]">
                    {{ videoList[alarmData.video].name }}
                  </text>
                  <text class="value-text" v-else style="color: #666666">请选择</text>
                  <image mode="widthFix" src="/static/images/index/icon01.png" />
                </view>
              </picker>
            </view>
          </view>

          <view class="line"></view>

          <view class="right">
            <view class="label">
              <text>小时</text>
              <text>分钟</text>
            </view>

            <view class="icons">
              <image mode="widthFix" src="/static/images/index/icon01.png" />
              <image mode="widthFix" src="/static/images/index/icon01.png" />
            </view>

            <view class="picker-view">
              <view class="dots">:</view>

              <picker-view
                mask-style="background: transparent"
                :value="alarmData.time"
                @change="alarmData.time = $event.detail.value"
              >
                <picker-view-column>
                  <view class="item" v-for="(item, index) in hours" :key="index">{{ item }}</view>
                </picker-view-column>

                <picker-view-column>
                  <view class="item" v-for="(item, index) in minutes" :key="index">{{ item }}</view>
                </picker-view-column>
              </picker-view>
            </view>

            <view class="icons">
              <image mode="widthFix" src="/static/images/index/icon01.png" />
              <image mode="widthFix" src="/static/images/index/icon01.png" />
            </view>
          </view>
        </view>

        <view class="options">
          <view @click="$refs.appointmentDialog.close()">关闭</view>
          <view @click="submit">保存</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'indexPage',

  data() {
    const hours = [];
    const minutes = [];

    for (let i = 0; i < 24; i++) {
      hours.push(i.toString().padStart(2, '0'));
    }

    for (let i = 0; i < 60; i++) {
      minutes.push(i.toString().padStart(2, '0'));
    }

    return {
      alarmList: [
        {
          id: 0,
          type: 1,
          name: '家庭AICG',
          account: '158****8899',
          frequency: 1,
          time: '2026-05-06 12:35:52',
        },
        {
          id: 1,
          type: 1,
          name: '家庭AICG',
          account: '158****8899',
          frequency: 1,
          time: '2026-05-06 12:35:52',
        },
        {
          id: 2,
          type: 1,
          name: '家庭AICG',
          account: '158****8899',
          frequency: 2,
          time: '2026-05-06 12:35:52',
        },
        {
          id: 3,
          type: 2,
          name: '家庭AICG',
          account: '158****8899',
          frequency: 2,
          time: '2026-05-06 12:35:52',
        },
      ],
      alarmData: {
        type: 1,
        frequency: 1,
        date: undefined,
        time: undefined,
        video: 0,
      },
      weekList: [
        { id: 0, value: 0, text: '一', selected: false },
        { id: 1, value: 1, text: '二', selected: false },
        { id: 2, value: 2, text: '三', selected: false },
        { id: 3, value: 3, text: '四', selected: false },
        { id: 4, value: 4, text: '五', selected: false },
        { id: 5, value: 5, text: '六', selected: false },
        { id: 6, value: 6, text: '日', selected: false },
      ],
      videoList: [
        { id: 0, name: '随机播放', value: '随机播放' },
        { id: 1, name: '顺序播放全部', value: '顺序播放全部' },
        { id: 2, name: '家庭aigc', value: '家庭aigc' },
      ],
      hours,
      minutes,
    };
  },

  onShow() {},

  methods: {
    /**
     * TODO 预约
     */
    appointment(type) {
      this.alarmData = {
        type: type,
        frequency: 1,
        date: undefined,
        time: undefined,
        video: 0,
      };

      this.$refs.appointmentDialog.open();
    },

    /**
     * TODO 停用/启用
     * @param item
     */
    toggle(item) {
      console.log('item', item);
    },

    /**
     * 修改
     * @param item
     */
    modify(item) {
      this.alarmData = JSON.parse(JSON.stringify(item));
      this.$refs.appointmentDialog.open();
    },

    /**
     * TODO 删除
     * @param item
     */
    deleteItem(item) {
      console.log('item', item);
    },

    /**
     * TODO 保存
     */
    submit() {},
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

  .alarm-setting {
    margin-top: 100rpx;
    background: #ffd4a3;
    padding: 34rpx 28rpx;
    border-radius: 21rpx;

    .title {
      font-weight: 600;
      font-size: 29rpx;
      color: #000000;
    }

    .funs {
      margin-top: 35rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .fun-item {
        background: #ffffff;
        padding-bottom: 20rpx;
        border-radius: 21rpx;
        width: 303rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        image {
          width: 183rpx;
        }

        .tips1 {
          margin-top: 11rpx;
          font-weight: 500;
          font-size: 25rpx;
          color: #000000;
        }

        .tips2 {
          margin-top: 9rpx;
          font-size: 16rpx;
          color: #6d6d6d;
        }

        .btn {
          margin-top: 20rpx;
          width: 155rpx;
          height: 48rpx;
          background: #cce5ff;
          border-radius: 24rpx;
          font-weight: 500;
          font-size: 20rpx;
          color: #2f84ee;
          display: flex;
          align-items: center;
          justify-content: center;

          &.btn2 {
            background: #ffebcc;
            color: #ee6b3e;
          }
        }
      }
    }
  }

  .alarm {
    margin-top: 36rpx;

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
      gap: 12rpx;

      .order-item {
        background: #f6f6f6;
        border-radius: 21rpx;
        border: 3px solid #ffffff;
        padding: 36rpx 32rpx;
        display: flex;
        flex-direction: column;
        gap: 30rpx;
        font-size: 19rpx;
        color: #000000;
        position: relative;

        .info {
          display: flex;
          gap: 30rpx;
        }

        .options {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 36rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 26rpx;

          text {
            width: 118rpx;
            height: 41rpx;
            background: #fffced;
            border-radius: 21rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            &:nth-child(1) {
              background: #fffced;
              color: #c97600;
            }

            &:nth-child(2) {
              background: #cce5ff;
              color: #2f84ee;
            }

            &:nth-child(3) {
              background: #ffeded;
              color: #ed0100;
            }
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

.appointment-dialog {
  width: 630rpx;
  background: linear-gradient(173deg, #fff7e5 0%, #ffffff 100%);
  border-radius: 35rpx;
  padding: 43rpx 36rpx;

  .title {
    font-weight: 600;
    font-size: 29rpx;
    color: #000000;
    text-align: center;
  }

  .frequency {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 90rpx;
    margin-top: 48rpx;

    text {
      width: 200rpx;
      height: 68rpx;
      background: #e6e6e6;
      border-radius: 34rpx;
      font-size: 26rpx;
      color: #000000;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        background: #ddebff;
        border: 1px solid #2f7de9;
        color: #000000;
      }
    }
  }

  .line {
    margin-top: 29rpx;
    height: 2rpx;
    background: #000000;
    opacity: 0.18;
  }

  .week {
    margin-top: 26rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .item {
      width: 48rpx;
      height: 48rpx;
      background: #ddebff;
      border-radius: 7rpx;
      font-weight: 600;
      font-size: 24rpx;
      color: #006ff8;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        background: #006ff8;
        color: #ffffff;
      }
    }
  }

  .detail {
    margin-top: 54rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      flex-shrink: 0;
      width: 45%;
      display: flex;
      flex-direction: column;
      gap: 40rpx;

      .time,
      .video {
        .label {
          font-size: 23rpx;
          color: #000000;
        }

        picker {
          margin-top: 28rpx;

          .value {
            width: 241rpx;
            height: 45rpx;
            background: rgba(0, 0, 0, 0);
            border-radius: 7rpx;
            border: 1px solid #cbcbcb;
            font-size: 18rpx;
            color: #000000;
            display: flex;
            align-items: center;
            padding: 0 10rpx;

            .value-text {
              flex-grow: 1;
            }

            image {
              width: 12rpx;
            }
          }
        }
      }
    }

    .line {
      flex-shrink: 0;
      width: 2rpx;
      height: 220rpx;
      align-self: flex-start;
      background: #00000030;
    }

    .right {
      flex-shrink: 0;
      width: 45%;

      .label {
        font-size: 23rpx;
        color: #000000;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }

      .icons {
        margin-top: 26rpx;
        display: flex;
        align-items: center;
        justify-content: space-around;

        image {
          width: 16rpx;
        }
      }

      .picker-view {
        margin-top: 29rpx;
        font-weight: 600;
        font-size: 58rpx;
        color: #000000;
        position: relative;

        .dots {
          position: absolute;
          left: 116rpx;
        }

        picker-view {
          height: 68rpx;

          picker-view-column {
            .item {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
    }
  }

  .options {
    margin-top: 61rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    view {
      width: 271rpx;
      height: 82rpx;
      border-radius: 41rpx;
      font-weight: 600;
      font-size: 26rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &:nth-child(1) {
        background: #dfdfdf;
        color: #000000;
      }

      &:nth-child(2) {
        background: #ee6b3e;
        color: #ffffff;
      }
    }
  }
}
</style>
