// components/metro/metro.js
const fetch = require('../../utils/request.js');
const util = require('../../utils/util.js');
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
    tabs: [],
    len:0,
    current: 'metro',
    currentIndex:0,
    floorData: {
      leftImage: null,
      rightImage: null
    },
    busData: {
      leftImage: null,
      data: {}
    },
    metroData: {
      content: '',
      image_list: []
    },
    self_setting1Data: {
      content: '',
      image_list: []
    },
    self_setting2Data: {
      content: '',
      image_list: []
    },
    self_setting3Data: {
      content: '',
      image_list: []
    },
  },

  attached: function() {
    if (!this.data.domain) {
      return;
    }
    fetch('modulelabel/lists', 'POST', {
      domain: this.data.domain,
      module_id: 8,
      is_online: 1,
    }).then(json => {
      if (json.result.data) {
        this.setData({
          tabs: json.result.data,
          len: json.result.data.filter(v=>{
            return v.flag;
          }).length
        });
        for (let k = 0; k < json.result.data.length; k++) {
          if (json.result.data[k].flag) {
            this.setData({
              current: json.result.data[k].tab_name
            });
            break;
          }
        }
        this.getMoreInfo();
      }
    }).catch(data => {});
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getMoreInfo() {
      if (this.data.current == 'bus') {
        this.getBus();
      } else if (this.data.current == 'floor') {
        this.getFloor();
      } else {
        this.getTraffic();
      }
    },
    getTraffic() {
      if (this.data[this.data.current+'Data'].content){
        return;
      }
      let currentTab = this.data.tabs.filter(v => {
        return v.tab_name == this.data.current;
      });
      fetch('project/gettraffic','POST', {
        domain: this.data.domain,
        is_online: 1,
        type: currentTab[0].image_type
      }).then(json => {
        if (json.result) {
          this.setData({
            [this.data.current + 'Data.content']: util.formatHtml(json.result.content),
            [this.data.current + 'Data.image_list']: json.result.image_list
          });
        }
      }).catch(data => {})
    },
    getBus() {
      if (this.data.busData.leftImage){
        return;
      }
      fetch('bus/lists', 'POST', {
        domain: this.data.domain,
        is_online: 1,
      }).then(json => {
        if (json.result) {
          this.setData({
            busData: json.result
          });
        }
      }).catch(data => {})
    },
    getFloor() {
      if (this.data.floorData.leftImage) {
        return;
      }
      fetch('project/getfloor', 'POST', {
        domain: this.data.domain,
        is_online: 1,
      }).then(json => {
        if (json.result.list.length) {
          this.setData({
            'floorData.leftImage': json.result.list.find(x => x.type === 26),
            'floorData.rightImage': json.result.list.find(x => x.type === 27)
          });
        }
      }).catch(data => {})
    },
    changeTab(e) {
      let tab = e.currentTarget.dataset.tab;
      this.setData({
        current: tab
      });
      this.getMoreInfo();
    },
    preview(e) {
      let src = e.currentTarget.dataset.src;
      wx.previewImage({
        urls: [src],
      });
    },
    previewMulti(e){
      let urls = [];
      for(let k in this.data.floorData){
        urls.push(this.data.floorData[k].show_image_url);
      }
      wx.previewImage({
        urls: urls
      });
    },
    swiperChange(e) {
      this.setData({
        currentIndex: e.detail.current
      });
    }
  }
})