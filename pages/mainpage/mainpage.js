// pages/mainpage/mainpage.js
Page({
  data: {
    books: [
      { id: 1, cover: '../../images/book1.jpg' },
      { id: 2, cover: '../../images/story.png' },
      { id: 3, cover: '../../images/book1.jpg' }
      // 添加更多的绘本数据
    ]
  },
  navigateToDetail(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detailpage/detailpage?id=${id}`
    });
  },
  onMouseEnter(event) {
    // Handle mouse enter if needed
  },
  onMouseLeave(event) {
    // Handle mouse leave if needed
  }
});
