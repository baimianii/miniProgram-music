// components/home/newsong/nessong.js
Component({
  properties: {},
  lifetimes: {
    attached() {
      this.getNewSong()
    }
  },
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    //获取新歌新碟
    getNewSong() {
      const songList = []
      wx.request({
        url: 'http://localhost:3000/album/newest',
        success: ({ data: { albums } }) => {
          for (let i = 0; i < albums.length; i += 2) {
            songList.push(albums.slice(i, i + 2))
          }
          this.setData({
            newSong: songList
          })
          console.log(songList)
        }
      })
    }
  }
})
