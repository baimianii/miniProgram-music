// components/home/search/search.js
Component({
  data: {
    keyWord: [],
    serachVal: '',
    serachTime: ''
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached: function () {
      if (this.data.serachVal == '') {
        this.getKeyWord()
      } else {
        clearInterval(this.data.serachTime)
      }
      console.log(this.data.serachVal)
    },
    // 在组件实例被从页面节点树移除时执行
    detached: function () {}
  },
  properties: {},

  methods: {
    //搜索建议
    getKeyWord() {
      wx.request({
        url: 'http://localhost:3000/search/hot',
        method: 'GET',
        success: ({ data }) => {
          const keyWordArr = [...data.result.hots]
          this.setData({
            serachTime: setInterval(() => {
              this.setData({
                keyWord: keyWordArr[Math.floor(Math.random() * 10)].first
              })
            }, 3000)
          })
        }
      })
    },
    getVal(e) {
      this.setData({
        serachVal: e.detail.value
      })
    }
  }
})
