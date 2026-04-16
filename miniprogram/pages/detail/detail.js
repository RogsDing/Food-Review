Page({
  data: {
    review: {}
  },
  
  onLoad: function (options) {
    const reviewId = options.id;
    this.getReviewDetail(reviewId);
  },
  
  getReviewDetail: function (reviewId) {
    wx.showLoading({ title: '加载中...' });
    wx.cloud.callFunction({
      name: 'getReview',
      data: {
        reviewId: reviewId
      }
    })
    .then(res => {
      wx.hideLoading();
      if (res.result) {
        this.setData({
          review: res.result
        });
      }
    })
    .catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      console.error(err);
    });
  },
  
  editReview: function () {
    const review = this.data.review;
    // 将编辑数据存储到本地存储
    wx.setStorageSync('editReviewData', review);
    // 跳转到编辑页面
    wx.navigateTo({
      url: '/pages/edit/edit'
    });
  },
  
  deleteReview: function () {
    const that = this;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条点评吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({ title: '删除中...' });
          wx.cloud.callFunction({
            name: 'deleteReview',
            data: {
              reviewId: that.data.review._id
            }
          })
          .then(res => {
            wx.hideLoading();
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 1000);
          })
          .catch(err => {
            wx.hideLoading();
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
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