// components/swiperDots/swiper-dots.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    total: {
      type: Number,
      value: 3,
    },
    align: {
      type: String,
      value: 'center'
    },
    current:{
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    rAlign: 'center',
  },

  attached: function () {
    this.jc();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jc() {
      if (this.data.align === 'left') {
        this.setData({
          rAlign: 'flex-start'
        })
      } else if (this.data.align === "right") {
        this.setData({
          rAlign: 'flex-end'
        })
      } else {
        this.setData({
          rAlign: this.data.align
        })
      }
    }
  }
})
