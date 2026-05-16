Page({
  data: {
    review: {},
    isAuthor: false,
    reviewId: '',
    comments: [],
    commentContent: '',
    commentCount: 0,
    isLoggedIn: false
  },

  onLoad: function (options) {
    const reviewId = options.id;
    this.setData({ reviewId: reviewId });
    this.getReviewDetail(reviewId);
    this.checkLoginStatus();
    this.getComments(reviewId);
  },

  onShow: function () {
    if (this.data.reviewId) {
      this.getReviewDetail(this.data.reviewId);
      this.checkLoginStatus();
      this.getComments(this.data.reviewId);
    }
  },

  checkLoginStatus: function () {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      isLoggedIn: !!(userInfo && userInfo.nickName)
    });
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
  },

  getComments: function (reviewId) {
    wx.cloud.callFunction({
      name: 'getComments',
      data: { reviewId: reviewId }
    })
    .then(res => {
      if (res.result && res.result.success) {
        const comments = res.result.comments.map(comment => {
          comment.createTime = this.formatTime(comment.createTime);
          return comment;
        });
        this.setData({
          comments: comments,
          commentCount: res.result.count
        });
        this.processCommentAvatars(comments);
      }
    })
    .catch(err => {
      console.error('获取评论失败:', err);
    });
  },

  processCommentAvatars: function (comments) {
    const cloudAvatarList = [];
    comments.forEach((comment, index) => {
      if (comment.author && comment.author.avatarUrl && comment.author.avatarUrl.startsWith('cloud://')) {
        cloudAvatarList.push({ fileID: comment.author.avatarUrl, index: index });
      }
    });

    if (cloudAvatarList.length === 0) return;

    const fileList = cloudAvatarList.map(item => item.fileID);

    wx.cloud.callFunction({
      name: 'getImageUrl',
      data: { fileList: fileList }
    })
    .then(res => {
      if (res.result && res.result.success) {
        const tempUrls = {};
        res.result.data.forEach(item => {
          tempUrls[item.fileID] = item.tempFileURL;
        });

        cloudAvatarList.forEach(item => {
          const url = tempUrls[item.fileID];
          if (url) {
            this.setData({
              ['comments[' + item.index + '].author.avatarUrl']: url
            });
          }
        });
      }
    })
    .catch(err => {
      console.error('获取评论头像链接失败:', err);
    });
  },

  formatTime: function (isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hour = ('0' + date.getHours()).slice(-2);
      const minute = ('0' + date.getMinutes()).slice(-2);
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    } catch (e) {
      return isoString;
    }
  },

  onCommentInput: function (e) {
    this.setData({
      commentContent: e.detail.value
    });
  },

  submitComment: function () {
    const content = this.data.commentContent.trim();
    if (!content) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }

    if (!this.data.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再发表评论',
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

    wx.showLoading({ title: '发送中...' });

    const userInfo = wx.getStorageSync('userInfo') || {};

    wx.cloud.callFunction({
      name: 'addComment',
      data: {
        reviewId: this.data.reviewId,
        content: content,
        author: {
          nickName: userInfo.nickName || '',
          avatarUrl: userInfo.avatarUrl || ''
        }
      }
    }).then(res => {
      wx.hideLoading();
      if (res.result && res.result.success) {
        wx.showToast({ title: '评论成功', icon: 'success' });
        this.setData({ commentContent: '' });
        this.getComments(this.data.reviewId);
      } else {
        wx.showToast({ title: res.result.error || '评论失败', icon: 'none' });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('提交评论失败:', err);
      wx.showToast({ title: '网络错误，请重试', icon: 'none' });
    });
  },

  deleteComment: function (e) {
    const commentId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条评论吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中...' });

          wx.cloud.callFunction({
            name: 'deleteComment',
            data: { commentId: commentId }
          }).then(res => {
            wx.hideLoading();
            if (res.result && res.result.success) {
              wx.showToast({ title: '删除成功', icon: 'success' });
              this.getComments(this.data.reviewId);
            } else {
              wx.showToast({ title: res.result.error || '删除失败', icon: 'none' });
            }
          }).catch(err => {
            wx.hideLoading();
            console.error('删除评论失败:', err);
            wx.showToast({ title: '网络错误，请重试', icon: 'none' });
          });
        }
      }
    });
  }
});
