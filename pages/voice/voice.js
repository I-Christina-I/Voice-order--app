// const recorderManager = wx.getRecorderManager();
// const options = {
//   duration: 60000, // 录音时长，单位 ms
//   sampleRate: 16000, // 百度语音识别要求16kHz采样率
//   numberOfChannels: 1, // 录音通道数
//   encodeBitRate: 48000, // 编码码率
//   format: 'wav', // 百度语音识别支持 wav 格式
//   frameSize: 50 // 指定帧大小，单位 KB
// };
//    var filesize,tempFilePath
// Page({
//   data: {
//     recording: false, // 录音状态
//     token: '24.fc2746cc3e32a5e4c2069ecdaff217ae.2592000.1719571214.282335-76195465', // 百度Access Token
//     recognitionResult:'' //识别结果
//   },

//   onLoad: function() {
//     //获取token
//     const that = this;
//     wx.getStorage({
//       key:'expires_in',
//       success(res){
//         console.log("缓存中有accessToken")
//         console.log("token失效时间：",res.data)
//         const newT = new Date().getTime();
//         //用当前时间和存储时间判断是否过期
//         if(newT > parseInt(res.data)){
//           console.log("token过期,重新获取token")
//           that.getToken();
//         } else{
//           console.log("获取本地缓存的token")
//           that.setData({
//             token:wx.getStorageSync("access_token")
//           });
//         }
//       },fail(){
//         console.log("缓存中没有access_token")
//         that.getToken();
//       }
//     })
//   },
//   getToken:function(){
//     let that=this;
//     const apiKey = 'FShXulkUNxuUD3hhY1fjcRHx';
//     const secretKey = 'q63vgpihP5NBusDvdIh0FRuXQHzk0A0P';
//     const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;
//     wx.request({
//       url: url,
//       method: 'POST',
//       success(res){
//         console.log("创建access_token成功",res)
//         //将access_token存储到storage
//         wx.setStorage({
//           key:'access_token',
//           data:res.data.access_token
//         });
//         var date =new Date().getTime();
//         let time =date+3600*24*30*1000;
//         console.log('三十天后的时间',time)
//         wx.setStorage({
//           key:'expires_in',
//           data:time
//         });
//         that.setData({
//             token:res.data.access_token
//         });
//       }
//     })
//   },

//   startRecording: function() {
//     const that = this;
//     wx.authorize({
//       scope: 'scope.record',
//       success(){
//         console.log("录音授权成功");
//         recorderManager.start(options);
//         recorderManager.onStart(() => {
//           console.log('recorder start');
//           that.setData({ recording: true });
//         });
//         recorderManager.onError((res) => {
//           console.log(res);
//           that.setData({ recording: false });
//         });
//       },fail(){
//         console.log("录音失败");
//       },
//     })
    
//   },

//   stopRecording: function() {
//     const that = this;
//     recorderManager.stop();
//     recorderManager.onStop((res) => {
//       console.log('文件路径==', res);
//      tempFilePath=res.tempFilePath;
//      //获取文件长度
//      wx.getFileSystemManager().getFileInfo({
//        filePath:tempFilePath,
//        success:function(res){
//          filesize=res.size
//          console.log('文件长度',res)
//          that.recognizeVoice()
//        },fail:function(res){
//          console.log("读取文件长度错误",res);
//        }
//      })
//       that.setData({ recording: false });
//       that.recognizeVoice(tempFilePath);
//     });
//   },

//   recognizeVoice: function(filePath) {
//     const that = this;
//     wx.getFileSystemManager().readFile({
//       filePath:tempFilePath,
//       encoding:'base64',
//       success: function (res) {
//         wx.request({
//           url: 'https://vop.baidu.com/server_api',
//           data:{
//             token:that.data.token,
//             cuid:"13_56",
//             format: 'wav',
//             rate: 16000,
//             channel: 1,
//             speech: res.data,
//             len:filesize
//           },
//           header: {
//             'Content-Type':'application/json'
//           },
//           method:'POST',
//           success:function (res) {
//             if(res.data.result == '') {
//               wx.showModal({
//                 title: '提示',
//                 content: '听不清楚，请再说一遍！',
//                 showCancel: false
//               })
//               return;
//             }
//             console.log("识别成功==",res.data);
//             that.setData({
//               recognitionResult:res.data.result
//             })
//           },fail: function (res) {
//               console.log("失败",res)
//           }
//         });//语音识别结束
//       }
//     })
//   }
// });
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
  },

  onInputChange: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  }
});
