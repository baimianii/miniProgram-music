// components/home/newmusic/newmusic.js
Component({
  properties: {},
  data: {
    newMusic: [],
    currentPage: 0 // 当前页数
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached: function () {
      this.getNewMusic()
    }
  },
  methods: {
    //获取最新音乐
    getNewMusic() {
      wx.showLoading({
        title: 'loding...'
      })
      wx.request({
        url: 'http://localhost:3000/top/song?type=7',
        method: 'GET',
        success: ({ data }) => {
          this.setData({
            newMusic: [...data.data.slice(0, 50)]
          })
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    },
    //点击播放音乐
    playlink({ currentTarget }) {
      //获取最新音乐下标
      const index = Object.values(currentTarget.dataset)[0]
      //最新音乐数据
      const musicdata = this.data.newMusic
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
    }
  }
})
