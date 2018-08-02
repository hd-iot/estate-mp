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
    pixelRatio:2,
    pHeight:836,
    height:252,
  },
  attached: function () {
    if (!this.data.domain) {
      return;
    }
    wx.getSystemInfo({
      success: (res)=> {
        this.setData({
          pixelRatio: res.pixelRatio
        });
      },
    })
    fetch('decoration/lists', 'POST', {
      domain: this.data.domain,
      is_online: 1,
    }).then(json => {
      if (json.result.data.length) {
        this.setData({
          list: json.result.data
        });
        this.setHeight(0);
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
    },
    swiperChange(e){
      let index = e.detail.current;
      this.setHeight(index);
    },
    setHeight(index){
      let pixelRatio = this.data.pixelRatio;
      let id = '#item-' + index;
      let query = wx.createSelectorQuery().in(this);
      setTimeout(() => {
        query.select(id).boundingClientRect().exec((res) => {
          let height = res[0].height * pixelRatio;
          console.log(height);
          this.setData({
            pHeight: 528 + 20 + height,
            height: height
          });
        });
      }, 100);
    }
  }
})
