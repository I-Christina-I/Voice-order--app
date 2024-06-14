Page({
  data: {
    currentIndex: 0, // 当前图片和音频的索引
    images: [], // 存储所有图片路径的数组
    audios: [], // 存储所有音频路径的数组
    isPlaying: false, // 播放状态
    autoPlayEnabled: false, // 是否启用自动播放
    audioContext: null, // 音频上下文
  },

  onLoad(options) {
    // 页面加载时初始化图片和音频数组
    this.setData({
      images: [
        '/images/story1-1.png', // 请使用实际的图片路径
        '/images/story1-2.png',
        '/images/story1-3.png',
        '/images/story1-4.png',
        '/images/story1-5.png',
        // ... 更多图片路径
      ],
      audios: [
        //'/audios/story1-1.mp3',
        //'/audios/story1-1.mp3', // 请使用实际的音频路径
        //'/audios/audio2.mp3',
        // ... 更多音频路径
      ],
    });
  },

  onReady() {
    // 页面初次渲染完成时显示第一张图片
    this.setData({ currentImage: this.data.images[this.data.currentIndex] });
  },

  turnPage(direction) {
    let newIndex = this.data.currentIndex;
    const imagesLength = this.data.images.length;
    if (direction === 'prev') {
      newIndex = newIndex > 0 ? newIndex - 1 : imagesLength - 1;
    } else if (direction === 'next') {
      newIndex = newIndex < imagesLength - 1 ? newIndex + 1 : 0;
    }
    this.setData({ currentIndex: newIndex });
    this.playVoice(newIndex);
  },

  playVoice(index) {
    const audioUrl = this.data.audios[index];
    if (!audioUrl) return;

    const newAudioContext = wx.createInnerAudioContext();
    newAudioContext.src = audioUrl;
    newAudioContext.play();

    this.setData({
      isPlaying: true,
      audioContext: newAudioContext,
      currentImage: this.data.images[index],
    });

    // 如果启用了自动播放，则在音频结束后自动翻页
    if (this.data.autoPlayEnabled) {
      newAudioContext.onEnded(() => {
        this.turnPage('next');
      });
    }
  },

  playPauseVoice() {
    if (!this.data.audioContext) {
      this.playVoice(this.data.currentIndex);
    } else {
      const action = this.data.audioContext.paused ? 'play' : 'pause';
      this.data.audioContext[action]();
      this.setData({
        isPlaying: !this.data.audioContext.paused,
      });
    }
  },

  toggleAutoPlay() {
    let newAutoPlayState = !this.data.autoPlayEnabled;
    this.setData({ autoPlayEnabled: newAutoPlayState });

    if (newAutoPlayState) {
      // 如果之前没有在自动播放，开始自动播放
      this.playVoice(this.data.currentIndex);
    } else {
      // 如果之前在自动播放，停止自动播放
      this.stopVoice();
    }
  },

  stopVoice() {
    if (this.data.audioContext) {
      this.data.audioContext.stop();
      this.setData({
        isPlaying: false,
        autoPlayEnabled: false,
      });
    }
  },

  // 页面卸载时停止音频播放
  onUnload() {
    this.stopVoice();
  },
});