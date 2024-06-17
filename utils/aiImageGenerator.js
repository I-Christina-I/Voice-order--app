function getToken(callback) {
  const apiKey = 'EWktwvpqnHLVBmzXjfOkbxIU';
  const secretKey = 'jPX4zCB21RCe8lwuRSrWtnS9rC7NJJEp';
  const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;

  wx.request({
    url: url,
    method: 'POST',
    success(res) {
      console.log("创建access_token成功", res);
      const token = res.data.access_token;
      const date = new Date().getTime();
      const time = date + 3600 * 24 * 30 * 1000;
      wx.setStorageSync('access_token1', token);
      wx.setStorageSync('expires_in1', time);
      callback(token);
    }
  });
}

function checkImageStatus(token, taskId, callback) {
  wx.request({
    url: `https://aip.baidubce.com/rpc/2.0/ernievilg/v1/getImgv2?access_token=${token}`,
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: { "task_id": taskId },
    success(res) {
      console.log("查询返回数据==", res.data);
      if (res.data.data) {
        if (res.data.data.task_status == "RUNNING") {
          setTimeout(() => {
            checkImageStatus(token, taskId, callback);
          }, 3000);
        } else {
          callback(res.data.data.sub_task_result_list[0].final_image_list[0].img_url);
        }
      } else {
        wx.showModal({
          title: '错误',
          content: '任务查询失败，请检查任务ID是否正确。',
          showCancel: false
        });
      }
    },
    fail(res) {
      console.log("失败", res);
    }
  });
}

function generateImage(prompt, callback,width=512) {
  const token = wx.getStorageSync('access_token1');
  const expiresIn = wx.getStorageSync('expires_in1');
  const currentTime = new Date().getTime();

  if (!token || currentTime > parseInt(expiresIn)) {
    getToken((newToken) => {
      requestImage(newToken, prompt, callback,width);
    });
  } else {
    requestImage(token, prompt, callback,width);
  }
}

function requestImage(token, prompt, callback,width) {
  wx.request({
    url: `https://aip.baidubce.com/rpc/2.0/ernievilg/v1/txt2imgv2?access_token=${token}`,
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      "prompt": prompt,
      "width": width,
      "height": 512,
    },
    success(res) {
      console.log("API返回数据==", res.data);
      if (res.data.data && res.data.data.task_id) {
        console.log("生成成功==", res.data);
        setTimeout(() => {
          checkImageStatus(token, res.data.data.task_id, callback);
        }, 7000);
      } else {
        wx.showModal({
          title: '错误',
          content: '返回数据格式不正确，请检查API文档和返回值。',
          showCancel: false
        });
      }
    },
    fail(res) {
      wx.showModal({
        title: '错误',
        content: '网络请求失败，请检查网络连接',
        showCancel: false
      });
      console.log("失败", res);
    }
  });
}

module.exports = {
  generateImage: generateImage
};