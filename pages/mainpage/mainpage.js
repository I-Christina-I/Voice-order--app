// pages/mainpage/mainpage.js
Page({
  data: {
    books: [
      { id: 1, cover: '/packageA/images/story1-1.png' },
      { id: 2, cover: '/packageA/images/story2-1.png' },
      { id: 3, cover: '../../images/Aistory.png' }
      // 添加更多的绘本数据
    ]
  },
  navigateToDetail(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/packageA/detailpage/detailpage?id=${id}`
    });
  },
  onMouseEnter(event) {
    // Handle mouse enter if needed
  },
  onMouseLeave(event) {
    // Handle mouse leave if needed
  }
});
