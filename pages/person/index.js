// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {},
  //level  followeds  follows  avatarUrl
  onLoad() {
    this.getPerson()
  },
  getPerson() {
    wx.request({
      url: 'http://localhost:3000/user/detail?uid=1628790244',
      success: ({ data }) => {
        this.setData({ personData: data })
      }
    }),
      wx.request({
        url: 'http://localhost:3000/user/playlist?uid=1628790244',
        success: ({ data: { playlist } }) => {
          this.setData({ personSong: playlist })
        }
      })
  }
})
