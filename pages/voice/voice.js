const voice = require('../../utils/voice.js');

const recorderManager = wx.getRecorderManager();
const options = {
  duration: 60000, // 录音时长，单位 ms
  sampleRate: 16000, // 百度语音识别要求16kHz采样率
  numberOfChannels: 1, // 录音通道数
  encodeBitRate: 48000, // 编码码率
  format: 'pcm', // 百度语音识别支持 wav 格式
  frameSize: 50 // 指定帧大小，单位 KB
};
var filesize, tempFilePath;

Page({
  data: {
    msgList: [
      {
        nickname: '朝阳',
        avatarUrl: 'https://profile.csdnimg.cn/9/5/6/0_weixin_41192489',
        content: '连续参加了2次有趣青年的飞盘活动，发起人太阳的组织、引导和教学非常专业，热身运动也非常简单有趣，飞盘对战更加精彩激烈，节奏很快，心都快跳出来了，但大家一起得分的那一刻，胜利的狂喜将所有疲累和酸痛化为乌有，或许这就是体育团队竞技所独有的快乐和迷人的魅力。运动后，虽然大汗淋漓，但我和女朋友的气色都肉眼可见地变好了。最后，大家还会一起围绕预设话题交流思想，相互启发灵感，不仅帮我了解到更多朋友们的独特视角，也见识到许多优秀朋友们飞扬的文思、渊博的才学。<br><br>以后会多多参加有趣青年的活动，希望可以在坚持锻炼提升身体素质的同时，也收获思想的丰盈，结识更多优秀的伙伴，祝有趣青年越来越好，愿大家一起越来越牛！',
        imgList: ['https://profile.csdnimg.cn/9/5/6/0_weixin_41192489']
      }
    ],
    recording: false, // 录音状态
    token: '', // 百度Access Token
    recognitionResult: '' // 识别结果
  },

  onLoad: function() {
    const that = this;
    voice.getToken((err, token) => {
      if (err) {
        console.log("获取token失败", err);
      } else {
        that.setData({ token });
      }
    });
  },

  startRecording: function() {
    const that = this;
    wx.authorize({
      scope: 'scope.record',
      success() {
        console.log("录音授权成功");
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
      fail() {
        console.log("录音失败");
      },
    });
  },

  stopRecording: function() {
    const that = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('文件路径==', res);
      tempFilePath = res.tempFilePath;
      wx.getFileSystemManager().getFileInfo({
        filePath: tempFilePath,
        success: function(res) {
          filesize = res.size;
          console.log('文件长度', res);
          that.setData({ recording: false });
          voice.recognizeVoice(that.data.token, tempFilePath, filesize, (err, result) => {
            if (err) {
              wx.showModal({
                title: '提示',
                content: err,
                showCancel: false
              });
            } else {
              that.setData({ recognitionResult: result });
              console.log("文本",that.data.recognitionResult);
            }
          });
        },
        fail: function(err) {
          console.log("读取文件长度错误", err);
        }
      });
    });
  }
});

