const recorderManager = wx.getRecorderManager();
const util = require('../../utils/util.js'); // 引入工具文件

const options = {
  duration: 60000, // 录音时长，单位 ms
  sampleRate: 16000, // 百度语音识别要求16kHz采样率
  numberOfChannels: 1, // 录音通道数
  encodeBitRate: 96000, // 编码码率
  format: 'wav', // 百度语音识别支持 wav 格式
  frameSize: 50 // 指定帧大小，单位 KB
};

Page({
  data: {
    recording: false, // 录音状态
    accessToken: '24.fc2746cc3e32a5e4c2069ecdaff217ae.2592000.1719571214.282335-76195465', // 百度Access Token
    recognitionResult:'' //识别结果
  },

  onLoad: function() {
    const that = this;
    util.getAccessToken((token) => {
      that.setData({ accessToken: token });
    });
  },

  startRecording: function() {
    const that = this;
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start');
      that.setData({ recording: true });
    });
    recorderManager.onError((res) => {
      console.log(res);
      that.setData({ recording: false });
    });
  },

  stopRecording: function() {
    const that = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('recorder stop', res);
      const { tempFilePath } = res;
      that.setData({ recording: false });
      that.recognizeVoice(tempFilePath);
    });
  },

  recognizeVoice: function(filePath) {
    const that = this;
    wx.uploadFile({
      url: `https://vop.baidu.com/server_api?dev_pid=1536&cuid=YOUR_CUID&token=${that.data.accessToken}`,
      filePath: filePath,
      name: 'file',
      header: {
        'Content-Type': 'audio/wav'
      },
      success(res) {
        console.log('upload success', res);
        const data = JSON.parse(res.data);
        if(data.result){
          const resultText = data.result.join(' ');
          that.setData({ recognitionResult: resultText });
        }
        console.log('Recognition Result:', data);
      },
      fail(err) {
        console.log('upload fail', err);
      }
    });
  }
});
