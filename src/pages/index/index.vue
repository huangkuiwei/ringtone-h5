<template>
  <view class="index-page">
    <view class="page-title">内容创作</view>

    <view class="sub-title">多样风格随心切换，轻松打造精彩短片</view>

    <view class="content-wrapper">
      <view class="content-box">
        <view class="upload" @click="uploadImg">
          <view class="upload-title">上传照片</view>

          <view class="upload-box">
            <image class="cropper-blob" v-if="cropperBlob" mode="heightFix" :src="cropperBlob" />
            <image class="add-icon" v-else mode="widthFix" src="/static/images/index/add.png" />
          </view>

          <view class="tips"
            >照片示例：请确保人脸完整,正面大头照或半身照、光线清晰： 分辨率540x960以上，宽高比9:16</view
          >
        </view>

        <view class="style">
          <view class="style-title">视频风格</view>

          <view class="style-select">
            <picker
              mode="selector"
              @change="styleIndex = $event.detail.value"
              range-key="name"
              :value="styleIndex"
              :range="styleList"
            >
              <view class="style-value">
                <text v-if="styleList[styleIndex]">{{ styleList[styleIndex].name }}</text>
                <text v-else style="color: #666666">请选择</text>

                <image mode="widthFix" src="/static/images/index/icon01.png" />
              </view>
            </picker>
          </view>
        </view>
      </view>

      <view class="create-btn" @click="creation">
        <image mode="widthFix" src="/static/images/index/btn01.png" />
        <text class="times">剩余{{ count }}次</text>
      </view>

      <view class="drafts">
        <view class="drafts-title">草稿箱</view>

        <view class="drafts-list" v-if="draftsList.length">
          <view class="item" v-for="item of draftsList" :key="item.id">
            <image mode="aspectFill" :src="item.image_path" />

            <view class="detail">
              <view class="name">{{ item.template_name }}</view>
              <view class="time">{{ item.create_at }}</view>
              <view class="status" v-if="item.Status === 0">创作中</view>
              <view class="status status1" v-else-if="item.Status === 1">审核中</view>
              <view class="status status2" v-else-if="item.Status === 2">审核成功</view>
              <view class="status status3" v-else-if="item.Status === 3">创作失败</view>
            </view>

            <view class="options">
              <view class="add" @click="addVideo" v-if="item.Status === 2">添加铃音列表</view>
              <view class="delete" @click="deleteVideo(item)">删除视频</view>
            </view>
          </view>
        </view>

        <view v-else class="no-drafts">暂无内容</view>
      </view>
    </view>

    <uni-popup ref="editImgDialog">
      <view class="edit-img-dialog" v-if="selectFile">
        <view class="tip1">请拖动、缩放图片，在9:16框内选取合适区域</view>
        <view class="tip2">输出规格:540x960以上，宽高比9:16</view>

        <view class="cropper">
          <img class="cropper-img" :src="selectFile.path" alt="" />
        </view>

        <view class="options">
          <view @click="reduce">缩小</view>
          <view @click="amplify">放大</view>
        </view>

        <view class="options2">
          <view class="submit" @click="submit">确定裁剪并上传</view>
          <view class="reset" @click="uploadImg">重新上传</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import Cropper from 'cropperjs';
import $http from '@/utils/http';
import { mapActions, mapGetters } from 'vuex';
import { verifyIsLogin } from '@/utils';

let cropper = null;

export default {
  name: 'indexPage',

  data() {
    return {
      styleList: [],
      styleIndex: undefined,
      draftsList: [],
      selectFile: undefined,
      scale: 1,
      cropperBlob: undefined,
      imagePath: undefined,
    };
  },

  computed: {
    ...mapGetters('app', ['count']),
  },

  onShow() {
    this.getDraftsList();
    this.getTemplateList();
  },

  methods: {
    ...mapActions('app', ['_getUserInfo']),

    /**
     * 获取草稿箱数据
     */
    getDraftsList() {
      $http
        .post('api/app/draft/query-drafts', {
          pageIndex: 1,
          pageSize: 9999,
        })
        .then((res) => {
          res.data.Items.forEach((item) => {
            item.image_path = item.image_path || '/static/images/index/head.png';
          });

          this.draftsList = res.data.Items;
        });
    },

    /**
     * 获取视频风格模板数据
     */
    getTemplateList() {
      $http
        .post('api/app/template/query-templates', {
          pageIndex: 1,
          pageSize: 9999,
        })
        .then((res) => {
          this.styleList = res.data.Items;
        });
    },

    /**
     * 上传照片
     */
    uploadImg() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.selectFile = undefined;
          this.scale = 1;

          setTimeout(() => {
            this.selectFile = res.tempFiles[0];
            this.$refs.editImgDialog.open();

            setTimeout(() => {
              let img = document.querySelector('.cropper-img');
              cropper = new Cropper(img, {
                aspectRatio: 3 / 4,
                dragMode: 'move',
              });
            }, 0);
          }, 0);
        },
      });
    },

    /**
     * 缩小
     */
    reduce() {
      if (this.scale <= 0.2) {
        return;
      }

      this.scale = this.scale - 0.1;
      cropper.scale(this.scale);
    },

    /**
     * 放大
     */
    amplify() {
      this.scale = this.scale + 0.1;
      cropper.scale(this.scale);
    },

    /**
     * 添加铃音列表
     */
    addVideo(item) {
      uni.showModal({
        title: '提示',
        content: '确认将该条数据添加到铃音列表吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '加载中...',
              mask: true,
            });

            $http
              .post('api/app/draft/set-as-ringtone', {
                id: item.id,
              })
              .then(() => {
                this.getDraftsList();
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
     * 删除视频
     */
    deleteVideo(item) {
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
              .post('api/app/draft/delete-draft', {
                id: item.id,
              })
              .then(() => {
                this.getDraftsList();
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
     * 确定裁剪并上传
     */
    submit() {
      cropper.getCroppedCanvas().toBlob((blob) => {
        uni.showLoading({
          title: '上传中...',
          mask: true,
        });

        this.cropperBlob = URL.createObjectURL(blob);

        const file = new File([blob], 'file.png', {
          lastModified: new Date().getTime(),
          type: 'image/png',
        });

        $http.upload('api/global/fileupload/upload', file).then((res) => {
          uni.hideLoading();
          this.imagePath = res.data;
        });

        this.$refs.editImgDialog.close();
      });
    },

    /**
     * 立即创作
     */
    creation() {
      verifyIsLogin();

      if (!this.count) {
        uni.showToast({
          title: '创作次数为0',
          icon: 'none',
        });

        return;
      }

      if (!this.styleList[this.styleIndex]) {
        uni.showToast({
          title: '请选择视频风格',
          icon: 'none',
        });

        return;
      }

      if (!this.imagePath) {
        uni.showToast({
          title: '请上传照片',
          icon: 'none',
        });

        return;
      }

      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/app/draft/add-draft', {
          image_path: this.imagePath,
          template_id: this.styleList[this.styleIndex].id,
        })
        .then(() => {
          uni.hideLoading();
          this.getDraftsList();
          this._getUserInfo();

          uni.showToast({
            title: '任务创建成功',
            icon: 'none',
          });

          // 恢复初始数据
          this.styleIndex = undefined;
          this.selectFile = undefined;
          this.scale = 1;
          this.cropperBlob = undefined;
          this.imagePath = undefined;
        });
    },
  },
};
</script>

<style scoped lang="scss">
page {
  min-height: 100%;
  background: #f4f6fa url('@/static/images/index/bg.png') left top/100% auto no-repeat;
}

.index-page {
  .page-title {
  }

  .sub-title {
    padding-top: 350rpx;
    font-size: 28rpx;
    color: #3e2c2b;
    font-style: italic;
    text-align: center;
  }

  .content-wrapper {
    margin-top: 25rpx;
    padding: 0 38rpx 80rpx;

    .content-box {
      background: #ffffff;
      border-radius: 21rpx;
      border: 6px solid #a4ecad;
      padding: 26rpx;

      .upload {
        .upload-title {
          font-weight: 500;
          font-size: 29rpx;
          color: #000000;
        }

        .upload-box {
          margin-top: 16rpx;
          border-radius: 7rpx;
          border: 1px dashed #a0a0a0;
          height: 348rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .cropper-blob {
            height: 100%;
          }

          .add-icon {
            width: 56rpx;
          }
        }

        .tips {
          margin-top: 23rpx;
          font-size: 24rpx;
          line-height: 32rpx;
          color: #676767;
        }
      }

      .style {
        margin-top: 31rpx;

        .style-title {
          font-weight: 500;
          font-size: 29rpx;
          color: #000000;
        }

        .style-select {
          margin-top: 16rpx;

          .style-value {
            border-radius: 7rpx;
            border: 1px solid #a0a0a0;
            padding: 25rpx 29rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;

            image {
              width: 22rpx;
            }
          }
        }
      }
    }

    .create-btn {
      margin-top: 56rpx;
      position: relative;

      image {
        width: 100%;
      }

      .times {
        position: absolute;
        top: -16rpx;
        right: 56rpx;
        width: 110rpx;
        height: 37rpx;
        background: #a4ecad;
        border-radius: 18rpx;
        font-weight: 500;
        font-size: 21rpx;
        color: #228f0d;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .drafts {
      margin-top: 56rpx;

      .drafts-title {
        padding-left: 40rpx;
        font-weight: 500;
        font-size: 29rpx;
        color: #000000;
      }

      .drafts-list {
        margin-top: 25rpx;
        display: flex;
        flex-direction: column;
        gap: 17rpx;

        .item {
          background: #ffffff;
          border-radius: 21rpx;
          padding: 16rpx;
          display: flex;

          image {
            flex-shrink: 0;
            width: 140rpx;
            height: 140rpx;
            border-radius: 21rpx;
          }

          .detail {
            flex-grow: 1;
            margin-left: 31rpx;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-around;

            .name {
              font-size: 27rpx;
              color: #000000;
            }

            .time {
              font-size: 25rpx;
              color: #606060;
            }

            .status {
              font-weight: 500;
              font-size: 24rpx;
              color: #9d16a9;
              background: #ffedfe;
              border-radius: 7rpx;
              padding: 4rpx 10rpx;

              &.status1,
              &.status2 {
                background: #f0ffed;
                color: #16a91d;
              }

              &.status3 {
                background: #ffeded;
                color: #ed0100;
              }
            }
          }

          .options {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 19rpx;

            view {
              width: 159rpx;
              height: 56rpx;
              border-radius: 28rpx;
              font-size: 22rpx;
              display: flex;
              align-items: center;
              justify-content: center;

              &.add {
                background: #cce5ff;
                color: #2f84ee;
              }

              &.delete {
                background: #ffeded;
                color: #ed0100;
              }
            }
          }
        }
      }

      .no-drafts {
        margin-top: 25rpx;
        text-align: center;
        font-size: 22rpx;
        color: #555555;
      }
    }
  }
}

.edit-img-dialog {
  width: 672rpx;
  background: #ffffff;
  border-radius: 21rpx;
  padding: 40rpx 45rpx;

  .tip1 {
    font-size: 29rpx;
    color: #000000;
    text-align: center;
  }

  .tip2 {
    margin-top: 20rpx;
    font-size: 25rpx;
    color: #8c8c8c;
    text-align: center;
  }

  .cropper {
    margin-top: 40rpx;
    height: 600rpx;
  }

  .options {
    margin-top: 31rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    view {
      width: 278rpx;
      height: 70rpx;
      background: #f7faff;
      border-radius: 14rpx;
      border: 1px solid #76afff;
      font-weight: 500;
      font-size: 26rpx;
      color: #2f7de9;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .options2 {
    margin-top: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    view {
      width: 278rpx;
      height: 70rpx;
      border-radius: 14rpx;
      font-weight: 500;
      font-size: 26rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &.submit {
        background: #2f7de9;
        border: 1px solid #76afff;
        color: #ffffff;
      }

      &.reset {
        background: #f7faff;
        color: #2f7de9;
      }
    }
  }
}
</style>
