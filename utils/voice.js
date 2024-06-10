// voice.js
const getToken = (callback) => {
  const apiKey = 'FShXulkUNxuUD3hhY1fjcRHx';
  const secretKey = 'q63vgpihP5NBusDvdIh0FRuXQHzk0A0P';
  const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;

  wx.getStorage({
    key: 'expires_in',
    success(res) {
      const newT = new Date().getTime();
      if (newT > parseInt(res.data)) {
        requestNewToken(url, callback);
      } else {
        const token = wx.getStorageSync("access_token");
        callback(null, token);
      }
    },
    fail() {
      requestNewToken(url, callback);
    }
  });
};

const requestNewToken = (url, callback) => {
  wx.request({
    url: url,
    method: 'POST',
    success(res) {
      console.log("创建access_token成功", res);
      if (res.data.access_token) {
        wx.setStorage({
          key: 'access_token',
          data: res.data.access_token
        });
        var date = new Date().getTime();
        let time = date + 3600 * 24 * 30 * 1000;
        wx.setStorage({
          key: 'expires_in',
          data: time
        });
        callback(null, res.data.access_token);
      } else {
        callback(res.data.error);
      }
    },
    fail(err) {
      console.log("获取token失败", err);
      callback(err);
    }
  });
};

const recognizeVoice = (token, filePath, fileSize, callback) => {
  wx.getFileSystemManager().readFile({
    filePath: filePath,
    encoding: 'base64',
    success: function(res) {
      wx.request({
        url: 'https://vop.baidu.com/server_api',
        data: {
          token: token,
          cuid: "13_56",
          format: 'pcm',
          rate: 16000,
          channel: 1,
          speech: res.data,
          len: fileSize
        },
        header: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        success: function(res) {
          if (res.data.result == '') {
            console.log("听不清楚",res.data);
            callback('听不清楚，请再说一遍！');
          } else {
            console.log("识别成功=",res.data)
            callback(null, res.data.result);
          }
        },
        fail: function(err) {
          console.log("失败", err);
          callback(err);
        }
      });
    },
    fail: function(err) {
      console.log("读取文件失败", err);
      callback(err);
    }
  });
};

module.exports = {
  getToken,
  recognizeVoice
};
