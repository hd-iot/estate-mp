// components/surrounding/surrounding.js
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
    longitude: "",
    latitude: "",
    circles: [{
      latitude: "",
      longitude: "",
      fillColor: "#0066FFAA",
      radius: 3000
    }],
    markers:[
      {
        latitude: "",
        longitude: "",
        iconPath: '/image/location.png',
        width:50,
        height:50,
        title:'test'
      }
    ]
  },

  attached: function() {
    if (!this.data.domain) {
      return;
    }
    fetch('surrounding/info', 'POST', {
      domain: this.data.domain,
      is_online: 1,
    }).then(json => {
      if (json.result) {
        let coors = json.result.coor.split(',');
        this.setData({
          longitude: coors[0],
          latitude: coors[1],
          ['markers[0].longitude']: coors[0],
          ['markers[0].latitude']: coors[1],
        });
      }
    }).catch(data => {});
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})