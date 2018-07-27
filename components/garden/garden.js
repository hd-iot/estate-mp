// components/garden/garden.js
const fetch = require('../../utils/request.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    domain: {
      type: String
    },
    info: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    current: 0,
  },

  attached: function() {
    if (!this.data.domain) {
      return;
    }
    fetch('gardens/lists', 'POST', {
      domain: this.data.domain,
      is_online: 1,
    }).then(json => {
      if (json.result.data) {
        this.setData({
          list: json.result.data
        });
      }
    }).catch(data => {});
  },

  /**
   * 组件的方法列表
   */
  methods: {
    preview(e) {
      let src = e.currentTarget.dataset.src;
      wx.previewImage({
        urls: [src],
      });
    },
    swiperChange(e){
      this.setData({
        current: e.detail.current
      });
    }
  }
})