const voice = require('../../utils/voice.js');
const aliAI = require('../../utils/aliAI.js');
const aiImageGenerator = require('../../utils/aiImageGenerator.js');
const recorderManager = wx.getRecorderManager();
const Delay = 2000; //对话延迟时间
const Pagesum=1  //页面总数
const dialogsum=4  //每个页面的总对话数量

const options = {
  duration: 60000, // 录音时长，单位 ms
  sampleRate: 16000, // 百度语音识别要求16kHz采样率
  numberOfChannels: 1, // 录音通道数
  encodeBitRate: 48000, // 编码码率
  format: 'pcm', // 百度语音识别支持 wav 格式
  frameSize: 50 // 指定帧大小，单位 KB
};
var role="",words="";
const prompt ={
   openstart: "请按照以下格式生成一个交互型的儿童故事绘本的4个随机主人公",
   Description:"根据以上内容，尽量简短的描述该儿童故事绘本的第二幕场景(100字以内,也是最后一幕场景)",
   decision:`按照如下格式同时根据以上场景进行故事展开场景中角色之间尽可能多的对话(角色说话顺序随机)：[(角色名称=${role},角色说话内容=${words}),(角色名称=${role},角色说话内容=${words}),(角色名称=${role},角色说话内容=${words})]`
};
Page({
  data: {
    isTextInput: false, // 控制输入框的类型
    recording: false, // 录音状态
    token: '', // 百度Access Token
    recognitionResult: '', // 识别结果
    inputValue: '', // 输入的文本
    response: '', //回答
    conversationHistory: [], //对话历史
    resultImagePath:'../../images/story.png',//ai图
    roleInf: [], //角色信息
    selectedCard:'',  //选中的动物对应的卡片id,
    sceneImagePath:'', //场景图
    userRole:'',  //用户扮演的角色名称
    roletext:[], //角色说话文本
    narratorText:'', //旁白文本
    matches:[],  //转换得到的数组
    characterIMAGE:[], //角色图片
    dialogueContent:[],  //角色对话内容
    currentCharacter:'',//当前角色的头像
    currentDialog: '', //当前的对话框
    currentPage: 0,
    dialognum: dialogsum, //对话数
    isISpeaking: false,
  },

  onLoad: function(options) {
    const app=getApp();
    const that=this;
    console.log(options); // 确认参数传递是否正确
    that.setData({
      selectedCard: app.globalData.selectedCard,
      roleInf:app.globalData.roleInf,
      userRole: options.userRole,
      sceneImagePath: app.globalData.sceneImagePath,
      characterIMAGE: app.globalData.characterIMAGE
    });
    that.Animaltext();
    
  },

  Animaltext:function(){
    const that=this;
    const app=getApp();
    var num=Math.floor(Math.random() * (10 - 4 + 1)) + 4;
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
    const that=this;
    const app=getApp();
    if (index >= this.data.dialogueContent.length) {
            if(that.data.dialognum>0)
          {
            this.setData({
              isISpeaking: true,
              narratorText:`小朋友轮到你${this.data.userRole}说话啦`
            });
          }
          else{
            that.data.dialognum=dialogsum;
            this.setData({
              IsnextPage: true,
              isISpeaking: true,
              narratorText:`第一幕场景结束了，请点击下一页`
            });
          }
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
    this.setData({
      isSpeaking: true,
      currentDialog: array[index][1],
      currentCharacter: that.data.characterIMAGE[roleIndex]
    });
    console.log("roleIndex=",roleIndex)
    console.log("roletext=",that.data.roletext)
    // 递归调用下一个
    setTimeout(() => {
      this.setData({
        isSpeaking: false,
      })
      this.Rolespeak(index + 1);
    }, Delay); // 延时1秒
  },

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

  onReady: function() {
    console.log('Reading page is ready');
  },

  nextPage: function() {
    const app=getApp();
    const that=this;
    if (this.data.currentPage < Pagesum) {
      this.setData({
        IsnextPage: false,
        isISpeaking: false,
        narratorText: '',
        currentPage: this.data.currentPage + 1
      });
      //故事描述
      // 显示加载图示
      wx.showLoading({
        title: '正在加载...',
        mask: true
      });

      aliAI.callApi(prompt.Description, app.globalData.conversationHistory, (err, result) => {
        if (err) {
          that.setData({
            response: err
          });
        } else {
          that.setData(result);
          that.data.sceneDescription=that.data.response;
          // 更新全局数据
          app.globalData.conversationHistory = that.data.conversationHistory;
          console.log("文本内容",that.data.response); 
          //开始描述故事
          //更新图片！！！！
          that.generateSceneImages(that.data.response);
          //更新图片！！！！
      }
      });   //调用大模型生成场景信息
    } else {
      // 跳转到 suggest 页面
      wx.navigateTo({
        url: '/packageA/suggest/suggest'
      });
    }
  },

  generateSceneImages:function(text){
    const app=getApp();
    const that=this;
    console.log(text);
    let prompt="儿童绘本插画风格，有四个动物,其内容如下"+text
    aiImageGenerator.generateImage(prompt, (sceneImagePath) => {
      that.setData({ sceneImagePath: sceneImagePath });
      app.globalData.sceneImagePath=sceneImagePath
      console.log("生成的图片路径==", sceneImagePath);
      // 隐藏加载图示
      wx.hideLoading();
      that.Animaltext();
    },512);
  },

  selectCharacter: function(e) {
    const character = e.currentTarget.dataset.character;
    this.setData({
      selectedCharacter: character
    });
  },

  switchToVoiceInput: function() {
    this.setData({
      isTextInput: false
    });
  },

  switchToTextInput: function() {
    this.setData({
      isTextInput: true
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
    console.log("id=",that.data.selectedCard)
    this.setData({
      dialognum:that.data.dialognum-1,
      isISpeaking:false,
      isSpeaking:true,
      currentDialog: this.data.inputValue,
      currentCharacter: that.data.characterIMAGE[that.data.selectedCard]
    })
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
          isSpeaking:false,
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
    console.log('停止录音');
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

