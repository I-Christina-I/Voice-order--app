Page({
  data: {
    token: '24.a35c0d5742cd5186a65397eb5b3cb266.2592000.1720367097.282335-79737679', // 百度Access Token
    description: '', // 用户输入的描述
    resultImagePath: '', // AI生成的图片路径
  },

  onLoad: function() {
    //获取token
    const that = this;
    wx.getStorage({
      key:'expires_in1',
      success(res){
        console.log("缓存中有accessToken1")
        console.log("token失效时间：",res.data)
        const newT = new Date().getTime();
        //用当前时间和存储时间判断是否过期
        if(newT > parseInt(res.data)){
          console.log("token过期,重新获取token1")
          that.getToken();
        } else{
          console.log("获取本地缓存的token")
          that.setData({
            token:wx.getStorageSync("access_token1")
          });
        }
      },fail(){
        console.log("缓存中没有access_token1")
        that.getToken();
      }
    })
  },

  getToken: function() {
    let that = this;
    const apiKey = 'EWktwvpqnHLVBmzXjfOkbxIU';
    const secretKey = 'jPX4zCB21RCe8lwuRSrWtnS9rC7NJJEp';
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;
    wx.request({
      url: url,
      method: 'POST',
      success(res) {
        console.log("创建access_token成功", res);
        // 将access_token存储到storage
        wx.setStorage({
          key: 'access_token',
          data: res.data.access_token
        });
        var date = new Date().getTime();
        let time = date + 3600 * 24 * 30 * 1000;
        console.log('三十天后的时间', time);
        wx.setStorage({
          key: 'expires_in',
          data: time
        });
        that.setData({
          token: res.data.access_token
        });
      }
    });
  },

  handleInput: function(e) {
    this.setData({
      description: e.detail.value
    });
  },

  generateImage: function() {
    const that = this;
    wx.request({
      url: `https://aip.baidubce.com/rpc/2.0/wenxin/v1/basic/textToImage?access_token=${that.data.token}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        "text": "荷花",
        "style": "油画",
        "resolution": "512*512",
        "num": 1
      },
      success: function(res) {
        console.log("API返回数据==", res.data);
        if (res.data.data && res.data.data.taskId) {
          console.log("生成成功==", res.data);
          setTimeout(() => {
            that.checkImageStatus(res.data.data.taskId);
          },3000)
        } else {
          wx.showModal({
            title: '错误',
            content: '返回数据格式不正确，请检查API文档和返回值。',
            showCancel: false
          });
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '错误',
          content: '网络请求失败，请检查网络连接',
          showCancel: false
        });
        console.log("失败", res);
      }
    });
  },
  

  checkImageStatus: function(taskId) {
    const that = this;
    console.log("检查任务ID==", taskId);
    wx.request({
      url: `https://aip.baidubce.com/rpc/2.0/wenxin/v1/basic/getImg?access_token=${that.data.token}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        "taskId":taskId
      },
      success: function(res) {
        console.log("查询返回数据==", res.data);
        if (res.data.data) {
          that.setData({
            resultImagePath: res.data.data.imgUrls[0].image
          });
        } else {
          wx.showModal({
            title: '错误',
            content: '任务查询失败，请检查任务ID是否正确。',
            showCancel: false
          });
        }
      },
      fail: function(res) {
        console.log("失败", res);
      }
    });
  }
});

