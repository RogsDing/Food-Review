Page({
  data: {
    review: {},
    isAuthor: false
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
        // 检查当前用户是否是点评的作者
        const isAuthor = getApp().globalData.userInfo && res.result.openId === getApp().globalData.openId;
        
        // 处理图片链接
        this.processImageUrls(res.result);
        
        this.setData({
          review: res.result,
          isAuthor: isAuthor
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
  
  // 处理图片链接，使用云函数获取临时链接
  processImageUrls: function(review) {
    if (review.imageFileIDs && review.imageFileIDs.length > 0) {
      // 调用云函数获取临时链接
      wx.cloud.callFunction({
        name: 'getImageUrl',
        data: {
          fileList: review.imageFileIDs
        }
      })
      .then(res => {
        if (res.result && res.result.success) {
          const tempUrls = {};
          res.result.data.forEach(item => {
            tempUrls[item.fileID] = item.tempFileURL;
          });
          
          // 更新点评中的图片链接
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
  
  editReview: function () {
    // 检查用户是否登录
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
    
    // 检查是否是作者
    if (!this.data.isAuthor) {
      wx.showToast({
        title: '无权限编辑此点评',
        icon: 'none'
      });
      return;
    }
    
    const review = this.data.review;
    // 将编辑数据存储到本地存储
    wx.setStorageSync('editReviewData', review);
    // 跳转到编辑页面
    wx.navigateTo({
      url: '/pages/edit/edit'
    });
  },
  
  deleteReview: function () {
    // 检查用户是否登录
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
    
    // 检查是否是作者
    if (!this.data.isAuthor) {
      wx.showToast({
        title: '无权限删除此点评',
        icon: 'none'
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