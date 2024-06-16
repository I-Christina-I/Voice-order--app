Component({
  methods: {
    goToMainPage() {
      wx.navigateTo({
        url: '/pages/mainpage/mainpage'
      });
    },
    goToProfilePage() {
      wx.navigateTo({
        url: '/packageB/profilepage/profilepage'
      });
    }
  }
});

