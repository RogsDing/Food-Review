Page({
  data: {
    messageContent: '',
    messages: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 20
  },

  onLoad: function() {
    this.loadMessages();
  },

  onShow: function() {
    this.refreshMessages();
  },

  onPullDownRefresh: function() {
    this.refreshMessages();
  },

  onReachBottom: function() {
    if (this.data.hasMore) {
      this.loadMoreMessages();
    }
  },

  refreshMessages: function() {
    this.setData({
      page: 1,
      hasMore: true,
      messages: []
    });
    this.loadMessages();
  },

  loadMessages: function() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    const openId = userInfo.openId || '';

    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'getMessages',
      data: {
        page: 1,
        pageSize: this.data.pageSize,
        openId: openId
      }
    }).then(res => {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();

      if (res.result && res.result.success) {
        this.setData({
          messages: res.result.messages || [],
          hasMore: (res.result.messages || []).length >= this.data.pageSize
        });
      }
    }).catch(err => {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
      console.error('加载留言失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  loadMoreMessages: function() {
    if (this.data.loading || !this.data.hasMore) return;

    const userInfo = wx.getStorageSync('userInfo') || {};
    const openId = userInfo.openId || '';
    const nextPage = this.data.page + 1;

    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'getMessages',
      data: {
        page: nextPage,
        pageSize: this.data.pageSize,
        openId: openId
      }
    }).then(res => {
      this.setData({ loading: false });

      if (res.result && res.result.success) {
        const newMessages = res.result.messages || [];
        this.setData({
          messages: this.data.messages.concat(newMessages),
          page: nextPage,
          hasMore: newMessages.length >= this.data.pageSize
        });
      }
    }).catch(err => {
      this.setData({ loading: false });
      console.error('加载更多留言失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  onMessageInput: function(e) {
    this.setData({
      messageContent: e.detail.value
    });
  },

  submitMessage: function() {
    const content = this.data.messageContent.trim();
    if (!content) {
      wx.showToast({ title: '请输入留言内容', icon: 'none' });
      return;
    }

    const userInfo = wx.getStorageSync('userInfo') || {};
    if (!userInfo.nickName) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '发布中...' });

    wx.cloud.callFunction({
      name: 'addMessage',
      data: {
        content: content,
        userInfo: {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl || '',
          openId: userInfo.openId || ''
        }
      }
    }).then(res => {
      wx.hideLoading();

      if (res.result && res.result.success) {
        wx.showToast({ title: '发布成功', icon: 'success' });
        this.setData({
          messageContent: '',
          page: 1,
          hasMore: true,
          messages: []
        });
        this.loadMessages();
      } else {
        wx.showToast({ title: res.result.error || '发布失败', icon: 'none' });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('发布留言失败:', err);
      wx.showToast({ title: '网络错误', icon: 'none' });
    });
  },

  deleteMessage: function(e) {
    const messageId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条留言吗？',
      confirmColor: '#ff6b00',
      success: (res) => {
        if (res.confirm) {
          this.doDeleteMessage(messageId);
        }
      }
    });
  },

  doDeleteMessage: function(messageId) {
    wx.showLoading({ title: '删除中...' });

    wx.cloud.callFunction({
      name: 'deleteMessage',
      data: {
        messageId: messageId
      }
    }).then(res => {
      wx.hideLoading();

      if (res.result && res.result.success) {
        wx.showToast({ title: '删除成功', icon: 'success' });
        const messages = this.data.messages.filter(item => item._id !== messageId);
        this.setData({ messages });
      } else {
        wx.showToast({ title: res.result.error || '删除失败', icon: 'none' });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('删除留言失败:', err);
      wx.showToast({ title: '网络错误', icon: 'none' });
    });
  }
});