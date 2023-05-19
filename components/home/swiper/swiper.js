// components/home/swiper/swiper.js
Component({
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached: function () {
      this.getBanner()
    },
    // 在组件实例被从页面节点树移除时执行
    detached: function () {}
  },
  properties: {},

  data: {
    banners: []
  },

  methods: {
    //获取banner
    getBanner() {
      wx.request({
        url: 'http://localhost:3000/banner',
        method: 'GET',
        success: ({ data: { banners } }) => {
          this.setData({
            banners: [...banners]
          })
        }
      })
    }
  }
})
