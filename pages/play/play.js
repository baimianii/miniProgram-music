// pages/play/play.js

Page({
  data: {
    musicList: [],
    _currentMusic: {},
    _musicId: '',
    _audio: {},
    isPlay: false,
    lrcData: [],
    audioDuration: ''
  },

  onLoad(options) {
    options: {
      pureDataPattern: /^_/
    }
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', ({ data }) => {
      this.setData({
        /*nowIndex: data.nowIndex, //歌曲数据下标 */
        _currentMusic: data.musicdata[data.nowIndex], //当前歌曲,
        _musicId: data.musicdata[data.nowIndex].id //获取歌曲id
      })
    })
    this.getMusicDetail()
  },
  //获取歌曲详情
  async getMusicDetail() {
    await wx.p.request({
      method: 'GET',
      url: `http://localhost:3000/song/detail?ids=${this.data._musicId}`,
      success: ({ data: { songs } }) => {
        this.setData({ musicList: songs[0] })
      }, //最新歌曲数据
      complete: () => {
        this.playaudio()
        this.getLrc()
      }
    })
  },

  //进入页面播放
  playaudio: function () {
    const audio = wx.createInnerAudioContext() //音乐实列
    audio.src = `http://music.163.com/song/media/outer/url?id=${this.data.musicList.id}.mp3`

    audio.play(() => {
      audio.pause()
    })
    if (audio.play()) {
      audio.stop()
    }
    audio.autoplay = true
    this.setData({ _audio: audio })
    audio.onCanplay(() => {
      audio.duration
      setTimeout(() => {
        const duration = audio.duration
        let min = parseInt(duration / 60)
        let sec = parseInt(duration % 60)
        min.toString().length == 1 ? (min = `0${min}`) : min
        sec.toString().length == 1 ? (sec = `0${sec}`) : sec
        this.setData({ audioDuration: audio.duration, showTime2: `${min}:${sec}` })
      }, 1000)
      console.log(this.data)
    })
  },
  //暂停播放
  togglePlay: function () {
    const audio = this.data._audio
    this.data.isPlay ? audio.play() : audio.pause()
    this.data.isPlay ? this.setData({ isPlay: false }) : this.setData({ isPlay: true })
  },
  //获取时间

  //获取歌词
  async getLrc() {
    const geci = []
    await wx.p.request({
      url: `http://localhost:3000/lyric?id=${this.data.musicList.id}`,
      success: ({ data }) => {
        const reg = /\[\d{2}:\d{2}\.\d{2,3}\]/
        //歌词分行显示
        const lrcList = data.lrc.lyric.split('\n')
        lrcList.forEach((item) => {
          //歌词和时间分离
          const itemData = item.match(reg)
          if (itemData) {
            const itmeData0 = itemData[0]
            //时间分离
            const lrcData = itmeData0.slice(1, -1).split(':')
            //处理时间,得到时间戳
            const time = parseFloat(lrcData[0]) * 60 + parseFloat(lrcData[1])
            //处理歌词 将时间替换为空
            const lrcStr = item.replace(reg, '')
            //存入data 响应页面
            geci.push([time, lrcStr])
          }
        })
        this.setData({ lrcData: geci })
      }
    })
  },
  //进度条拖动
  sliderChange: function (e) {
    const audio = this.data._audio
    const value = e.detail.value
    this.setData({ audioTime: value })
    const duration = this.data.audioDuration
    value = parseInt((value * duration) / 100)
    this.setData({
      audioSeek: value,
      isPlayAudio: true
    })
    audio.seek(value)
    audio.play()
    console.log(this.data)
  },
  onReady() {},

  onShow() {},

  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
