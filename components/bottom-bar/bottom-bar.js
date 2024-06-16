Component({
  methods: {
    goToMainPage() {
      wx.navigateTo({
        url: '/pages/mainpage/mainpage'
      });
    },
    goToProfilePage() {
      wx.navigateTo({
        url: '/pages/profilepage/profilepage'
      });
    }
  }
});

