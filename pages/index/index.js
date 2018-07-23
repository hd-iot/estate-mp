//index.js
//获取应用实例
const app = getApp();
const fetch = require('../../utils/request.js');

Page({
  data: {
    logo: '',
    bannerList: [],
    bannerDes: '',
    cityCode: '110100',
    hotProjects: [],
    projectList:[],
    prev: 42,
    next: 206,
    current:0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.getLogo();
    this.getBanner();
    this.getHotProject();
    this.getProject(this.data.cityCode);
  },
  getLogo: function() {
    fetch('image/getlogo', 'POST', {
      is_online: 1
    }).then(res => {
      this.setData({
        logo: res.result.list[0].show_image_url
      });
    });
  },
  getBanner() {
    fetch('promote/lists', 'POST', {
      type: 42,
      is_online: 1
    }).then(res => {
      this.setData({
        bannerList: res.result.list,
        bannerDes: res.result.list[0].des || ''
      });
    });
  },
  getGeo() {
    fetch('city/iptocity', 'POST').then(json => {
      if (json.result.local_city_code) {
        const code = json.result.local_city_code;
        console.log(code);
      }

    }).catch(data => {
      console.log(data);
    });
  },
  bannerChange(e) {
    this.setData({
      bannerDes: this.data.bannerList[e.detail.current].des,
      current: e.detail.current
    });
  },
  hotChange(e) {
    if (e.detail.current == 0) {
      this.setData({
        prev: 42,
        next: 206
      });
    } else if (e.detail.current == 2) {
      this.setData({
        prev: 206,
        next: 42
      });
    } else {
      this.setData({
        prev: 124,
        next: 124
      });
    }
  },
  getHotProject() {
    fetch('project/promotelist', 'POST', {
      is_online: 1,
      is_nationwide: 0,
      provinceid: this.data.cityCode.slice(0, 2) + '0000'
    }).then(res => {
      this.setData({
        hotProjects: res.result.list
      });
    })
  },
  getProject(code) {
    fetch('city/maplist','POST', {
      code: code * 1,
      is_online: 1,
      domain: ''
    }).then(json => {
      this.setData({
        projectList: json.result.list[0].project_list
      });
    }).catch(data => {
      console.log(data);
     });
  },
  
})