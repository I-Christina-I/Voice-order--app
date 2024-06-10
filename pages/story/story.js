const voice = require('../../utils/voice.js');
const aliAI = require('../../utils/aliAI.js');
const recorderManager = wx.getRecorderManager();
const Delay = 2000; //对话延迟时间
const options = {
  duration: 60000, // 录音时长，单位 ms
  sampleRate: 16000, // 百度语音识别要求16kHz采样率
  numberOfChannels: 1, // 录音通道数
  encodeBitRate: 48000, // 编码码率
  format: 'pcm', // 百度语音识别支持 wav 格式
  frameSize: 50 // 指定帧大小，单位 KB
};
var role="",words="",num=Math.floor(Math.random() * (10 - 4 + 1)) + 4;
const prompt ={
   openstart: "请按照以下格式生成一个交互型的儿童故事绘本的4个随机主人公",
   Description:"根据生成的四个角色，描述该儿童故事绘本的第一幕场景",
   decision:`按照如下格式同时根据以上场景进行故事展开场景中角色之间尽可能多的对话(角色说话顺序随机)：[(角色名称=${role},角色说话内容=${words}),(角色名称=${role},角色说话内容=${words}),(角色名称=${role},角色说话内容=${words})]`
};
var filesize, tempFilePath;
Page({
  data: {
    showComponents: false, //是否展示页面
    showCards: false, //是否展示卡片
    isTextInput: false, // 控制输入框的类型
    recording: false, // 录音状态
    token: '', // 百度Access Token
    recognitionResult: '', // 识别结果
    inputValue: '', // 输入的文本
    response: '', //回答
    conversationHistory: [], //对话历史
    resultImagePath:'../../images/story.png',//ai图
    roleInf: [], //角色信息
    flipped1: false,
    flipped2: false,
    flipped3: false,
    flipped4: false,
    selectedCard:'',  //选中的动物对应的卡片id,
    sceneDescription:'',
    buttonVisible:true,  //卡片按钮是否可见
    userRole:'',  //用户扮演的角色名称
    roletext:[], //角色说话文本
    narratorText:'', //旁白文本
    matches:[],  //转换得到的数组
    dialogueContent:[]  //角色对话内容
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

  switchToTextInput: function() {
    this.setData({ isTextInput: true });
  },

  switchToVoiceInput: function() {
    this.setData({ isTextInput: false });
  },

  toggleComponents:function () {
    this.setData({ showComponents: !this.data.showComponents });
  },

  showCards:function () {
    const that = this;
    const app = getApp();
    this.setData({ showCards: !this.data.showCards,buttonVisible:false});
    const roleName='',roleCharacter='',Roledescription='';
    let promptStart=`按照以下给定格式生成一个交互型的儿童故事绘本的4个主人公(最好是动物):[(角色1名称=${roleName},角色1性格=${roleCharacter},角色1描述=${Roledescription}),(角色2名称=${roleName},角色2性格=${roleCharacter},角色2描述=${Roledescription}),(角色3名称=${roleName},角色3性格=${roleCharacter},角色3描述=${Roledescription}),(角色4名称=${roleName},角色4性格=${roleCharacter},角色4描述=${Roledescription})]`

    // 显示加载图示
    wx.showLoading({
      title: '正在加载...',
      mask: true
    });

    aliAI.callApi(promptStart, app.globalData.conversationHistory, (err, result) => {
      if (err) {
        console.log("信息错误",err);
        console.log("result:",result);
        that.setData({
          response: err
        });
      } else {
        that.setData(result);
        // 更新全局数据
        app.globalData.conversationHistory = that.data.conversationHistory;

        console.log("文本内容",that.data.response); 
        //提取字符串转为数组
        that.TextToArray(result.response);
        that.setData({
          roleInf:that.data.matches
        });
        //故事描述
        aliAI.callApi(prompt.Description, app.globalData.conversationHistory, (err, result) => {
          if (err) {
            that.setData({
              response: err
            });
          } else {
            // 隐藏加载图示
            wx.hideLoading();
            that.setData(result);
            // 更新全局数据
            app.globalData.conversationHistory = that.data.conversationHistory;
            console.log("文本内容",that.data.response); 
            //开始描述故事
            //更新图片！！！！
    
                
            //更新图片！！！！
        }
        });   //调用大模型生成场景信息
    }
    });//传递信息

  }, //生成绘本以及角色

  TextToArray: function (text) {
    // 提取所有的角色信息
    const regex = text.match(/\((.*?)\)/g);

    if (regex) {
      this.data.matches = regex.map(match => {
        const attributes = match.replace(/[()]/g, '').split(',');
        return attributes.map(attr => attr.split('=')[1]);
      });
    } else {
      this.data.matches = []; // 或者其他默认值处理
    }
  },

  hideCards: function() {
    this.setData({
      showCards: false
    });
  },

  flipCard: function(e) {
    const index = e.currentTarget.dataset.index;
    const flipKey = `flipped${index}`;
    this.setData({
      [flipKey]: !this.data[flipKey]
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
              that.setData({ inputValue: result[0] });
              if(that.data.inputValue==''){return;}
              console.log("input输出",that.data.inputValue);
              that.sendText();
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
  },

  sendText: function() {
    const app=getApp();
    const that = this;
    if(this.data.inputValue=='')
    {
      wx.showModal({
        title: '提示',
        content: "输入内容为空",
        showCancel: false
      })
      return;
    }
    that.setData({
      narratorText:""
    })
    let num1=Math.floor(Math.random() * (10 - 4 + 1)) + 4
    let start=`角色名称=${that.data.userRole},角色说话内容="`;
    let end =`"根据上述角色说的话继续按照下面的格式补充角色之间尽可能多的对话（并且第${num1}个角色为${that.data.userRole}）：[(角色名称=${role},角色说话内容=${words}),(角色名称=${role},角色说话内容=${words}),(角色名称=${role},角色说话内容=${words})]`
    let prompt_temp=start+this.data.inputValue+end;
    aliAI.callApi(prompt_temp, app.globalData.conversationHistory, (err, result) => {
      if (err) {
        that.setData({
          response: err
        });
      } else {
        that.setData(result);
        that.setData({
          conversationHistory_temp: result.conversationHistory
        });//添加全局对话历史
        console.log("文本内容",that.data.response); 
        //处理输出
        that.TextToArray(result.response);
        that.setData({
          dialogueContent:that.data.matches
        })  //获取对话文本
        that.Rolespeak();
    }
    },that.data.userRole);
    console.log('发送文本:', this.data.inputValue);
    // 在这里处理发送文本的逻辑
  },

  selectCard: function(e) {
    const that=this;
    const app=getApp();
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedCard: index,
      showCards: false,
      userRole:this.data.roleInf[index][0]
    });
    console.log(`选中的卡片索引: ${index}`);
    let decision=`按照如下格式同时根据以上场景进行故事展开场景中角色之间尽可能多的对话(角色说话顺序随机，并且第${num}个角色为${this.data.userRole})：[(角色名称=${role},角色说话内容=${words}),(角色名称=${role},角色说话内容=${words}),(角色名称=${role},角色说话内容=${words})]`;
    aliAI.callApi(decision, app.globalData.conversationHistory, (err, result) => {
      if (err) {
        that.setData({
          response: err
        });
      } else {
        that.setData(result);
        // 更新全局数据
        app.globalData.conversationHistory = that.data.conversationHistory;
        console.log("文本内容",that.data.response); 
        //处理输出
        that.TextToArray(result.response);
        that.setData({
          dialogueContent:that.data.matches
        })  //获取对话文本
        that.Rolespeak();
    }
    },that.data.userRole);
  },

  Rolespeak:function (index = 0) {
    if (index >= this.data.dialogueContent.length) {
      this.setData({
        narratorText:`小朋友轮到你${this.data.userRole}说话啦`
      });
      return;
    };// 终止条件

    let text = [[], [], [], []];
    let array = this.data.dialogueContent;
    let roleInf = this.data.roleInf;

    let roleIndex = this.findStringIn2DArray(roleInf, array[index][0]);
    console.log("标号",roleIndex);
    if (roleIndex !== -1) {
      text[roleIndex].push(array[index][1]);
    }
    this.setData({
      roletext: text
    });
    console.log("roletext=",this.data.roletext)
    // 递归调用下一个
    setTimeout(() => {
      this.Rolespeak(index + 1);
    }, Delay); // 延时1秒
  },

  findStringIn2DArray:function(array, target) {
    console.log("array",array,"target",target);
    for (let i = 0; i < array.length; i++) {
      if (array[i][0].includes(target)) {
        return i; // 返回第几行
      }
    }
    return -1; // 如果没有找到，返回 -1
  }

});
