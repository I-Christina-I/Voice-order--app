// Page({
//   // 页面初始数据
//   data: {
//     response: '',
//     inputValue: '',
//     conversationHistory: [] // 添加对话历史记录
//   },
//   onCallApi: function() {
//     const that = this;
//     // 将用户输入添加到对话历史中
//     const newMessage = {
//       "role": "user",
//       "content": [{ "text": this.data.inputValue }]
//     };
//     const updatedHistory = this.data.conversationHistory.concat(newMessage);

//     wx.request({
//       url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
//       method: 'POST',
//       header: {
//         "Content-Type": 'application/json',
//         Authorization: 'sk-c40ead50dc2d4389be73ba0c72df778d',
//       },
//       data: {
//         model: "qwen-audio-turbo",
//         "input": {
//           "messages": updatedHistory
//         },
//       },
//       success: (res => {
//         console.log('成功', res);
//         // 提取并保存响应数据
//         if (res.data && res.data.output && res.data.output.choices && res.data.output.choices.length > 0) {
//           const assistantMessage = {
//             "role": "assistant",
//             "content": [{ "text": res.data.output.choices[0].message.content[0].text }]
//           };
//           const newHistory = updatedHistory.concat(assistantMessage);
//           that.setData({
//             response: assistantMessage.content[0].text,
//             conversationHistory: newHistory, // 更新对话历史
//             inputValue: '' // 清空输入框
//           });
//         } else {
//           that.setData({
//             response: 'No response data'
//           });
//         }
//       }),
//       fail: (err => {
//         console.log('失败', err);
//       })
//     });
//   },

//   onInputChange: function(e) {
//     this.setData({
//       inputValue: e.detail.value
//     });
//   },

//   onLoad() {
//     // 页面加载时执行的逻辑
//   },

//   // 生命周期函数 - 监听页面初次渲染完成
//   onReady() {
    
//   },
// });

const utils = require('../../utils/aliAI.js');

Page({
  data: {
    response: '',
    inputValue: '',
    conversationHistory: [] // 添加对话历史记录
  },

  onCallApi: function() {
    const that = this;
    utils.callApi(this.data.inputValue, this.data.conversationHistory, (err, result) => {
      if (err) {
        that.setData({
          response: err
        });
      } else {
        that.setData(result);
      }
    });
  },

  onInputChange: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  onLoad() {
    // 页面加载时执行的逻辑
  },

  onReady() {
    // 生命周期函数 - 监听页面初次渲染完成
  }
});
