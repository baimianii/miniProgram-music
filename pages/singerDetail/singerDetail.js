// pages/singerDetail/singerDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    singerdata: {}, //歌手数据
    singerdedail: {}, //歌手详情
    HotMusic: {}, //热门单曲
    currentPage: 10, // 当前页数
    isLoading: false, // 是否正在加载数据
    isShow: '展开',
    isIcon: 'arrow-up',
    istrue: true,
    height: '100'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    this.getOpenerEventChannel().on('acceptDataFromOpenerPage', ({ data }) => {
      this.setData({ singerdata: data })
    })
    this.getdetail()
    this.getHotMusic()
  },
  //渲染页面
  getdetail() {
    wx.request({
      url: `http://localhost:3000/artist/desc?id=${this.data.singerdata.id}`,
      success: ({ data }) => {
        this.setData({
          singerdedail: data
        })
      }
    })
  },
  //热门单曲
  getHotMusic() {
    this.setData({
      loading: true
    })
    wx.showLoading({
      title: 'loding...'
    })
    wx.request({
      url: `http://localhost:3000/artist/top/song?id=${this.data.singerdata.id}`,
      method: 'GET',
      success: ({ data }) => {
        this.setData({
          HotMusic: [...data.songs.slice(0, this.data.currentPage)],
          currentPage: this.data.currentPage + 10,
          isLoading: false
        })
      },
      complete: () => {
        setTimeout(() => {
          wx.hideLoading()
        }, 800)
      }
    })
  },
  //设置简介折叠
  showBrief() {
    if (this.data.istrue) {
      this.setData({
        isShow: '展开',
        isIcon: 'arrow-down',
        istrue: !this.data.istrue,
        height: '700'
      })
    } else {
      this.setData({
        isShow: '折叠',
        isIcon: 'arrow-up',
        istrue: !this.data.istrue,
        height: '100'
      })
    }
  },

  //跳转播放页面
  playlink({ currentTarget }) {
    //获取音乐下标
    const index = Object.values(currentTarget.dataset)
    const musicdata = this.data.HotMusic
    //获取歌曲id
    const songId = musicdata[index].id

    wx.request({
      url: `http://localhost:3000/check/music?id=${songId}`,
      success: ({ data }) => {
        if (data.success === true) {
          //新增数据下标
          const objdata = {
            musicdata: musicdata,
            nowIndex: index
          }
          wx.navigateTo({
            url: '/pages/play/play',
            data: {
              objdata: objdata
            },
            success: (res) => {
              res.eventChannel.emit('acceptDataFromOpenerPage', { data: objdata })
            }
          })
        } else {
          //弹出框提示
          wx.showModal({
            title: '友情提示',
            content: '当前歌曲没有版权，不能播放',
            showCancel: true
          })
        }
      },
      complete: () => {}
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.setNavigationBarTitle({
      title: `${this.data.singerdata.name}`
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
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
  onReachBottom() {
    if (!this.data.isLoading) {
      this.getHotMusic()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
