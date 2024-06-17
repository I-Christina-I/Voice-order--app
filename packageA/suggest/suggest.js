const aliAI = require('../../utils/aliAI.js');

Page({
  data: {
    suggestionText: '',  // 建议类文字变量
    response:'',
    conversationHistory:[]
  },
  
  onLoad: function() {
    // 初始化建议类文字
    const app=getApp();
    const that=this;
    let prompt="最后根据以上的所有内容，对小朋友(即我)扮演角色时说的话进行评价，并且给小朋友(我)一些人生价值观的建议"
    aliAI.callApi(prompt, app.globalData.conversationHistory, (err, result) => {
      if (err) {
        that.setData({
          response: err
        });
      } else {
        that.setData(result);
        console.log("文本内容",that.data.response); 
        that.setData({
          suggestionText: that.data.response
        });
    }
    });   //调用大模型生成场景信息
  },

  handleExit: function() {
    // 处理退出按钮点击事件
    wx.navigateTo({
      url: '/packageA/detailpage/detailpage'
    });
  }
});
