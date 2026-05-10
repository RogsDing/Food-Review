Page({
  data: {
    review: {},
    isAuthor: false,
    reviewId: ''
  },

  onLoad: function (options) {
    const reviewId = options.id;
    this.setData({ reviewId: reviewId });
    this.getReviewDetail(reviewId);
  },

  onShow: function () {
    if (this.data.reviewId) {
      this.getReviewDetail(this.data.reviewId);
    }
  },

  getReviewDetail: function (reviewId) {
    wx.cloud.callFunction({
      name: 'getReview',
      data: { reviewId: reviewId }
    })
    .then(res => {
      if (res.result) {
        console.log('[detail] 服务端返回 isAuthor:', res.result.isAuthor);
        console.log('[detail] 服务端返回 openId:', res.result.openId);

        if (!res.result.author) {
          res.result.author = { nickName: '微信用户', avatarUrl: '' };
        }

        this.processImageUrls(res.result);
        this.processAvatarUrl(res.result);

        this.setData({
          review: res.result,
          isAuthor: !!res.result.isAuthor
        });
      }
    })
    .catch(err => {
      wx.showToast({ title: '加载失败', icon: 'none' });
      console.error(err);
    });
  },

  processImageUrls: function(review) {
    if (review.imageFileIDs && review.imageFileIDs.length > 0) {
      wx.cloud.callFunction({
        name: 'getImageUrl',
        data: { fileList: review.imageFileIDs }
      })
      .then(res => {
        if (res.result && res.result.success) {
          const tempUrls = {};
          res.result.data.forEach(item => {
            tempUrls[item.fileID] = item.tempFileURL;
          });

          const updatedImageFileIDs = review.imageFileIDs.map(fileID => {
            return tempUrls[fileID] || fileID;
          });

          this.setData({
            'review.imageFileIDs': updatedImageFileIDs
          });
        }
      })
      .catch(err => {
        console.error('获取图片链接失败:', err);
      });
    }
  },

  processAvatarUrl: function(review) {
    if (review.author && review.author.avatarUrl && review.author.avatarUrl.startsWith('cloud://')) {
      wx.cloud.callFunction({
        name: 'getImageUrl',
        data: { fileList: [review.author.avatarUrl] }
      })
      .then(res => {
        if (res.result && res.result.success && res.result.data.length > 0) {
          this.setData({
            'review.author.avatarUrl': res.result.data[0].tempFileURL
          });
        }
      })
      .catch(err => {
        console.error('获取头像链接失败:', err);
      });
    }
  },

  editReview: function () {
    if (!this.data.isAuthor) {
      wx.showToast({ title: '无权限编辑此点评', icon: 'none' });
      return;
    }

    if (!getApp().globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再编辑点评',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/profile/profile' });
          }
        }
      });
      return;
    }

    const review = this.data.review;
    wx.setStorageSync('editReviewData', review);
    wx.navigateTo({
      url: '/pages/edit/edit'
    });
  },

  deleteReview: function () {
    if (!this.data.isAuthor) {
      wx.showToast({ title: '无权限删除此点评', icon: 'none' });
      return;
    }

    if (!getApp().globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再删除点评',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/profile/profile' });
          }
        }
      });
      return;
    }

    const that = this;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条点评吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({ title: '删除中...' });
          wx.cloud.callFunction({
            name: 'deleteReview',
            data: { reviewId: that.data.review._id }
          })
          .then(res => {
            wx.hideLoading();
            wx.showToast({ title: '删除成功', icon: 'success' });
            setTimeout(() => {
              wx.navigateBack();
            }, 1000);
          })
          .catch(err => {
            wx.hideLoading();
            wx.showToast({ title: '删除失败', icon: 'none' });
            console.error(err);
          });
        }
      }
    });
  },

  previewImage: function (e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.review.imageFileIDs;
    wx.previewImage({
      current: images[index],
      urls: images
    });
  }
});
