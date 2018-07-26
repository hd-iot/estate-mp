// components/design/design.js
const fetch = require('../../utils/request.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    domain: {
      type: String
    },
    info:{
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: '',
    content: ''
  },
  attached: function() {
    if (!this.data.domain) {
      return;
    }
    fetch('design/info', 'POST', {
      domain: this.data.domain,
      is_online: 1,
    }).then(json => {
      if (json.result) {
        this.setData({
          imgUrl: json.result.image_list[0].show_image_url,
          content: json.result.content
        });
      }
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    preview: function(e) {
      wx.previewImage({
        urls: [this.data.imgUrl],
      });
    }
  }
})