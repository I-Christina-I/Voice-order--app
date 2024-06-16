// pages/profilepage/profilepage.js
Page({
  data: {
    // 初始化数据
  },

  // 事件处理函数
  viewReadingHistory: function() {
    // 跳转到阅读记录页面
    wx.navigateTo({
      url: '/pages/readinghistory/readinghistory'
    });
  },

  viewPictureBooks: function() {
    // 跳转到绘本页面
    wx.navigateTo({
      url: '/pages/picturebooks/picturebooks'
    });
  },

  viewPoints: function() {
    // 跳转到积分页面
    wx.navigateTo({
      url: '/pages/points/points'
    });
  },

  editProfile: function() {
    // 跳转到编辑资料页面
    wx.navigateTo({
      url: '/pages/editprofile/editprofile'
    });
  },

  exchangePoints: function() {
    // 跳转到积分兑换页面
    wx.navigateTo({
      url: '/pages/exchangepoints/exchangepoints'
    });
  },

  contactUs: function() {
    // 跳转到联系我们页面
    wx.navigateTo({
      url: '/pages/contactus/contactus'
    });
  }
});
