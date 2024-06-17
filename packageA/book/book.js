Page({
  data: {
    currentIndex: 0, // 当前图片和音频的索引
    images: [], // 存储所有图片路径的数组
    audios: [], // 存储所有音频路径的数组
    isPlaying: false, // 播放状态
    autoPlayEnabled: false, // 是否启用自动播放
    audioContext: null, // 音频上下文
    currentImage: '', // 确保 currentImage 在 data 中定义
  },

  onLoad(options) {
    // 页面加载时初始化图片和音频数组
    const images = [
      '/packageA/images/story1-2.png',
      '/packageA/images/story1-3.png',
      '/packageA/images/story1-4.png',
      '/packageA/images/story1-5.png',
      // ... 更多图片路径
    ];
    const audios = [
      '/packageA/audios/story1-1.mp3',
      '/packageA/audios/story1-1.mp3',
      // ... 更多音频路径
    ];
    this.setData({ images, audios });
  },

  onReady() {
    // 页面初次渲染完成时显示第一张图片和播放音频
    this.showFirstImageAndAudio();
  },

  showFirstImageAndAudio() {
    this.setData({
      currentImage: this.data.images[this.data.currentIndex],
    });
    this.playVoice(this.data.currentIndex);
  },

  turnPage(e) {
    const direction = e.detail.direction;
    let newIndex = this.data.currentIndex;

    if (direction === 'prev') {
      newIndex = newIndex - 1 < 0 ? this.data.images.length - 1 : newIndex - 1;
    } else if (direction === 'next') {
      newIndex = (newIndex + 1) % this.data.images.length;
    }

    this.setData({
      currentIndex: newIndex,
      currentImage: this.data.images[newIndex],
    });
  },

  playVoice(index) {
    const audioUrl = this.data.audios[index];
    if (!audioUrl) return;

    if (this.data.audioContext && this.data.audioContext.playing) {
      this.data.audioContext.stop();
    }

    const newAudioContext = wx.createInnerAudioContext();
    newAudioContext.src = audioUrl;
    newAudioContext.play();

    this.setData({
      isPlaying: true,
      audioContext: newAudioContext,
    });

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
    const newAutoPlayState = !this.data.autoPlayEnabled;
    this.setData({ autoPlayEnabled: newAutoPlayState });

    if (newAutoPlayState) {
      this.playVoice(this.data.currentIndex);
    } else {
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

  onUnload() {
    this.stopVoice();
  },
});