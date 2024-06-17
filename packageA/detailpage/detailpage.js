// pages/detailpage/detailpage.js
const aliAI = require('../../utils/aliAI.js');
const aiImageGenerator = require('../../utils/aiImageGenerator.js');
var role="",words="",num=Math.floor(Math.random() * (10 - 4 + 1)) + 4;
const prompt ={
   openstart: "请按照以下格式生成一个交互型的儿童故事绘本的4个随机主人公",
   Description:"根据生成的四个角色，尽量简短的描述该儿童故事绘本的第一幕场景(100字以内)",
   decision:`按照如下格式同时根据以上场景进行故事展开场景中角色之间尽可能多的对话(角色说话顺序随机)：[(角色名称=${role},角色说话内容=${words}),(角色名称=${role},角色说话内容=${words}),(角色名称=${role},角色说话内容=${words})]`
};
Page({
  data: {
    book: {
      cover: '../../images/story.png', // 示例封面路径
      title: '好饿的毛毛虫',
      description: '  《好饿的毛毛虫》是由艾瑞·卡尔所著并绘制图片的绘本，最早是由世界出版公司在1969年出版，后来则由Penguin Putnam出版。书中描述一只很饿的毛虫，在变成蛹之前吃了各式各样的食物，后来变成蝴蝶的故事。此书获得许多儿童文学的奖项，以及一个大型的平面设计奖，全世界售出数量超过五千万本。'
    },
    sceneImagePath:'',  //场景图
    characterIMAGE:[],//动物图片路径
    showCharacterSelection: false,
    conversationHistory: [], //对话历史
    roleInf: [], //角色信息
    userRole:'',  //用户扮演的角色名称
    inputValue: '', // 输入的文本
    response: '', //回答
    flipped1: false,
    flipped2: false,
    flipped3: false,
    flipped4: false,
    selectedCard:'',  //选中的动物对应的卡片id,
  },
  onLoad(options) {
    const { id } = options;
    console.log(id)
    if(id==3)
    {
      const newBook = {
        cover: '../../images/Aistory.png', // 示例封面路径
        title: 'AI创作童话',
        description: '《AI创作童话》是一本由人工智能自动生成的儿童绘本，充满了无尽的想象力和创造力。每个故事、每个角色、每一幅插图都由AI独立创作，为孩子们呈现一个前所未有的奇幻世界。这本书不仅展示了AI的强大能力，也为小读者带来了无限的惊喜和乐趣。'
      };
      this.setData({
        isChoosing:true,
        book:newBook,
      })
    }
    else{    //阅读的故事书编辑此处
      let newBook
      if(id==1)
      {

        newBook = {
          cover: '../../images/story.png', // 示例封面路径
          title: 'AI创作童话',
          description: '《AI创作童话》是一本由人工智能自动生成的儿童绘本，充满了无尽的想象力和创造力。每个故事、每个角色、每一幅插图都由AI独立创作，为孩子们呈现一个前所未有的奇幻世界。这本书不仅展示了AI的强大能力，也为小读者带来了无限的惊喜和乐趣。'
        };
      }
      else{
        newBook = {
          cover: '../../images/story.png', // 示例封面路径
          title: 'AI创作童话',
          description: '《AI创作童话》是一本由人工智能自动生成的儿童绘本，充满了无尽的想象力和创造力。每个故事、每个角色、每一幅插图都由AI独立创作，为孩子们呈现一个前所未有的奇幻世界。这本书不仅展示了AI的强大能力，也为小读者带来了无限的惊喜和乐趣。'
        };
      }
      this.setData({
        isenter:true,
        book:newBook,
      })
    }
    // Fetch book details by id
    // 假设 fetchBookDetails 是一个函数，用于获取书籍详细信息
    // 
  },
  flipCard: function(e) {
    const index = e.currentTarget.dataset.index;
    const flipKey = `flipped${index}`;
    this.setData({
      [flipKey]: !this.data[flipKey]
    });
  },
  chooseCharacter: function(e) {
    // this.setData({
    //   showCharacterSelection: true
    // });
    const that = this;
    const app = getApp();
    this.setData({ showCharacterSelection: !this.data.showCharacterSelection,buttonVisible:false});
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
        //更新全局数据
        app.globalData.roleInf=that.data.roleInf
        //故事描述
        aliAI.callApi(prompt.Description, app.globalData.conversationHistory, (err, result) => {
          if (err) {
            that.setData({
              response: err
            });
          } else {
            // 隐藏加载图示
             //wx.hideLoading();
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
    }
    });//传递信息

  }, //生成绘本以及角色

  generateSceneImages:function(text){
    const app=getApp();
    const that=this;
    console.log(text);
    let prompt="儿童绘本插画风格，有四个动物,其内容如下"+text
    aiImageGenerator.generateImage(prompt, (sceneImagePath) => {
      that.setData({ sceneImagePath: sceneImagePath });
      app.globalData.sceneImagePath=sceneImagePath
      console.log("生成的图片路径==", sceneImagePath);
      that.generateImagesInSequence();
    },512);
  },

  generateImagesInSequence: function() {
    const app=getApp();
    const that = this;
    const prompts = this.data.roleInf.map(role => `风格为儿童绘本画风,动物角色为${role[0]}`);
    
    // 递归函数来依次处理每个生成图片请求
    function generateImage(index) {
      if (index >= 4) {
        // 隐藏加载图示
        wx.hideLoading();
        app.globalData.characterIMAGE=that.data.characterIMAGE
        return; // 所有图片生成完成
      }

      aiImageGenerator.generateImage(prompts[index], (resultImagePath) => {
        const updatedImageArray = [...that.data.characterIMAGE, resultImagePath];
        that.setData({ characterIMAGE: updatedImageArray });
        console.log("生成的图片路径==", resultImagePath);

        // 继续处理下一个请求
        generateImage(index + 1);
      });
    }

    // 从第一个请求开始
    generateImage(0);
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
  
  closeCharacterSelection() {
    this.setData({
      showCharacterSelection: false
    });
  },
  selectCharacter(e) {
    // const id = e.currentTarget.dataset.id;
    // wx.navigateTo({
    //   url: `/pages/reading/reading?characterId=${id}&bookId=${this.data.book.id}`
    // });
    const that=this;
    const app=getApp();
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedCard: index,
      userRole:this.data.roleInf[index][0]
    });
    app.globalData.selectedCard=index
    wx.navigateTo({
      url: `/packageB/reading/reading?characterId=${index}&roleInf=${this.data.roleInf}&userRole=${this.data.userRole}&sceneImagePath=${that.data.sceneImagePath}&characterIMAGE=${this.data.characterIMAGE}`
    });
    console.log(`选中的卡片索引: ${index}`);
  },
  navigateToMainPage() {
    wx.navigateTo({
      url: '/pages/mainpage/mainpage'
    });
  },
  navigateToProfilePage() {
    wx.navigateTo({
      url: '/pages/profilepage/profilepage'
    });
  },

  enterStory()
  {
    跳转到具体绘本
    // wx.navigateTo({
    //   url: '/pages/mainpage/mainpage'
    // });
  }
});
