Page({
  data: {
    selectedCharacter: '',
    bookId: '',
    currentPage: 0,
    pages: [
      { image: '/images/story.png' },
      { image: '/images/story.png' },
      { image: '/images/story.png' }
      // 可以继续添加更多页面
    ],
    isTextInput: true,
    inputValue: ''
  },

  onLoad: function(options) {
    console.log(options); // 确认参数传递是否正确
    this.setData({
      selectedCharacter: options.characterId || 'defaultCharacter',
      bookId: options.bookId || 'defaultBook'
    });
  },

  onReady: function() {
    console.log('Reading page is ready');
  },

  prevPage: function() {
    if (this.data.currentPage > 0) {
      this.setData({
        currentPage: this.data.currentPage - 1
      });
    }
  },

  nextPage: function() {
    if (this.data.currentPage < this.data.pages.length - 1) {
      this.setData({
        currentPage: this.data.currentPage + 1
      });
    } else {
      // 跳转到 voice 页面
      wx.navigateTo({
        url: '/pages/voice/voice'
      });
    }
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
    const text = this.data.inputValue;
    if (text) {
      // 发送文字消息的逻辑
      console.log('发送文字:', text);
      this.setData({
        inputValue: ''
      });
    }
  },

  startRecording: function() {
    console.log('开始录音');
  },

  stopRecording: function() {
    console.log('停止录音');
  }
});

