// pages/songList/songlist.js
Page({
  data: {
    hotSinger: []
  },

  //获取热门歌手
  getHotSinger() {
    wx.showLoading({
      title: 'loding...'
    })
    wx.request({
      url: 'http://localhost:3000/top/artists',
      method: 'GET',
      success: ({ data: { artists } }) => {
        this.setData({
          hotSinger: [...artists]
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  //热门歌手详情
  hotLink({ currentTarget }) {
    //获取页面歌手下标
    const i = currentTarget.dataset.singerid
    //获取歌手信息
    const singer = this.data.hotSinger[i]
    wx.navigateTo({
      url: '/pages/singerDetail/singerDetail',
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: singer })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHotSinger()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

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
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})
