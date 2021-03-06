// components/sale/sale.js
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
    buildingIndex:0,
    image: ''
  },

  attached: function() {
    if (!this.data.domain) {
      return;
    }
    fetch('period/lists_new', 'POST', {
      domain: this.data.domain,
      is_online: 1,
    }).then(json => {
      if (json.result.list.length) {
        this.setData({
          list: json.result.list
        });
        this.data.list.forEach(iItem => {
          iItem.placeinfo_list.forEach(jItem => {
            let temp = {
              layout: jItem.title + '平面图',
              layout_txt: jItem.plan_txt,
              image_list: jItem.image_list
            }
            jItem.layout_list.splice(0, 0, temp);
          });
        });
        let index = this.data.list.findIndex((value) => value.type === 2 || value.type === 3);
        if (index !== -1) {
          this.setData({
            current: index
          });
        }
        this.cpuImage();
      }
    }).catch(data => {})
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cpuImage() {
      let show_image_url = '';
      if (this.data.list.length && this.data.list[this.data.current].image_list.length) {
        show_image_url = this.data.list[this.data.current].image_list[0].show_image_url;
      }
      this.setData({
        image: show_image_url
      });
    },
    chosenPeriod(e){
      let index = e.currentTarget.dataset.index;
      this.setData({
        current:index,
        buildingIndex:0
      });
      this.cpuImage();
    },
    preview(e){
      let src= e.currentTarget.dataset.src;
      wx.previewImage({
        urls: [src],
      });
    },
    previewMulti(e){
      let list = e.currentTarget.dataset.item;
      let urls = [];
      list.forEach(item => {
        if (item.image_list.length) {
          urls.push(item.image_list[0].show_image_url);
        }
      });
      wx.previewImage({
        urls: urls,
      });
    },
    swiperChange(e){
      this.setData({
        buildingIndex: e.detail.current
      });
    }
  }
})