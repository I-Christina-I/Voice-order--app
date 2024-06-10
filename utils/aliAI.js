// aliAI.js
const callApi = (inputValue, conversationHistory, callback, stop = "") => {
  const newMessage = {
    "role": "user",
    "content": [{ "text": inputValue }],
  };
  const updatedHistory = conversationHistory.concat(newMessage);

  wx.request({
    url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    method: 'POST',
    header: {
      "Content-Type": 'application/json',
      Authorization: 'sk-c40ead50dc2d4389be73ba0c72df778d',
    },
    data: {
      model: "qwen-turbo",
      "input": {
        "messages": updatedHistory
      },
      "parameters":{
        "temperature": 0.9, // 增加温度以提高多样性
        "result_format":"message",
        "stop" : stop  //停止词
      }
    },
    success: (res) => {
      console.log('API 调用成功，响应数据:', res);
      if (res.data && res.data.output && res.data.output.choices && res.data.output.choices.length > 0) {
        const assistantMessage = {
          "role": "assistant",
          "content": [{ "text": res.data.output.choices[0].message.content }]
        };
        const newHistory = updatedHistory.concat(assistantMessage);
        callback(null, {
          response: assistantMessage.content[0].text,
          conversationHistory: newHistory,
          inputValue: ''
        });
      } else {
        console.warn('API 响应无数据:', res.data);
        callback('No response data');
      }
    },
    fail: (err) => {
      console.error('API 调用失败:', err);
      callback(err);
    }
  });
};

module.exports = {
  callApi
};
