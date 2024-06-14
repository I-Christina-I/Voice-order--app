// pages/detailpage/detailpage.js
Page({
  data: {
    book: {
      cover: '../../images/story.png', // 示例封面路径
      title: '好饿的毛毛虫',
      description: '  《好饿的毛毛虫》是由艾瑞·卡尔所著并绘制图片的绘本，最早是由世界出版公司在1969年出版，后来则由Penguin Putnam出版。书中描述一只很饿的毛虫，在变成蛹之前吃了各式各样的食物，后来变成蝴蝶的故事。此书获得许多儿童文学的奖项，以及一个大型的平面设计奖，全世界售出数量超过五千万本。'
    },
    characters: [
      { id: 1, name: '角色1', avatar: '../../images/兔子.png' },
      { id: 2, name: '角色2', avatar: '../../images/小狐狸.png' },
      { id: 3, name: '角色3', avatar: '../../images/小象.png' },
      { id: 4, name: '角色4', avatar: '../../images/小熊猫.png' }
    ],
    showCharacterSelection: false
  },
  onLoad(options) {
    const { id } = options;
    // Fetch book details by id
    // 假设 fetchBookDetails 是一个函数，用于获取书籍详细信息
    this.setData({
      book: fetchBookDetails(id)
    });
  },
  chooseCharacter() {
    this.setData({
      showCharacterSelection: true
    });
  },
  closeCharacterSelection() {
    this.setData({
      showCharacterSelection: false
    });
  },
  selectCharacter(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/reading/reading?characterId=${id}&bookId=${this.data.book.id}`
    });
  },
  navigateToMainPage() {
    wx.navigateTo({
      url: '/pages/mainpage/mainpage'
    });
  },
  navigateToProfilePage() {
    wx.navigateTo({
      url: '/pages/profilepage/profilepage'
    });
  }
});
