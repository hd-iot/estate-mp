// components/decoration/decoration.js
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
  },
  attached: function () {
    if (!this.data.domain) {
      return;
    }
    fetch('decoration/lists', 'POST', {
      domain: this.data.domain,
      is_online: 1,
    }).then(json => {
      if (json.result.data.length) {
        this.setData({
          list: json.result.data
        });
      }
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    preview(e){
      let item = e.currentTarget.dataset.item;
      let urls = [];
      item.image_list.forEach(image => {
        if (image.type === 32) {
          urls.push(image.show_image_url);
        }
      });
      if(!urls.length){
        return;
      }
      wx.previewImage({
        urls: urls,
      });
    }
  }
})
