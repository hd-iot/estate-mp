// pages/detail/detail.js
const fetch = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectInfo: null,
    domain: "",
    bannerImg: '',
    queues: ['news', 'design', 'period', 'garden', 'decoration', 'club', 'community', 'metro', 'surrounding', 'service', 'link'],
    loadMap: {
      news: false,
      design: false,
      period: false,
      garden: false,
      decoration: false,
      club: false,
      community: false,
      traffic: false,
      facilities: false,
      tenement: false,
      fans: false
    },
    list: {
      proj_index: {
        id: '',
        ctitle: '首页地图楼盘信息',
        etitle: '',
        hasData: true
      },
      proj_ad: {
        id: '',
        ctitle: '楼盘广告图',
        etitle: '',
        hasData: false,
        moduleName: 'Ad'
      },
      proj_info: {
        id: '',
        ctitle: '楼盘基本信息',
        etitle: '',
        hasData: true,
        moduleName: 'Overall'
      },
      proj_category: {
        id: '',
        ctitle: '楼盘相册',
        etitle: '',
        hasData: true,
        moduleName: 'Albumn'
      },
      proj_news: {
        id: 1,
        ctitle: '楼盘资讯',
        etitle: 'News',
        hasData: false,
        moduleName: 'News'
      },
      proj_design: {
        id: 2,
        ctitle: '楼盘总规划',
        etitle: 'Overall Design',
        hasData: false,
        moduleName: 'Design'
      },
      proj_period: {
        id: 3,
        ctitle: '销售动态',
        etitle: 'Sales Trend',
        hasData: false,
        moduleName: 'Sale'
      },
      proj_garden: {
        id: 4,
        ctitle: '园林',
        etitle: 'Gardens',
        hasData: false,
        moduleName: 'Gardens'
      },
      proj_decoration: {
        id: 5,
        ctitle: '9A精装',
        etitle: '9A Refined Decoration',
        hasData: false,
        moduleName: 'Decoration'
      },
      proj_club: {
        id: 6,
        ctitle: '铂金会所',
        etitle: 'Club',
        hasData: false,
        moduleName: 'Club'
      },
      proj_community: {
        id: 7,
        ctitle: '小区配套',
        etitle: 'Community',
        hasData: false,
        moduleName: 'Community'
      },
      proj_metro: {
        id: 8,
        ctitle: '交通配套',
        etitle: 'Traffic',
        hasData: false,
        moduleName: 'Traffic'
      },
      proj_surrounding: {
        id: 9,
        ctitle: '周边配套',
        etitle: 'Surrounding Facilities',
        hasData: false,
        moduleName: 'Facilities'
      },
      proj_service: {
        id: 10,
        ctitle: '售后与物业服务',
        etitle: 'After-sales and Property',
        hasData: false,
        moduleName: 'Tenement'
      },
      proj_link: {
        id: '',
        ctitle: '友情链接',
        etitle: '',
        hasData: false,
        moduleName: 'Fans'
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      domain: options.domain
    });
    this.getList(options.domain);
    this.getModule();
    this.getProjectInfo(options.domain);
  },
  getProjectInfo: function(domain) {
    fetch('project/info', 'POST', {
      domain: domain,
      is_online: 1,
    }).then(json => {
      if (json.result) {
        json.result.layout = json.result.layout.filter(item => {
          return item != "";
        });
        let arry = json.result.image_list.map(item => {
          return item.show_image_url
        });
        wx.setNavigationBarTitle({
          title: json.result.name,
        });
        let tmp = json.result.image_list.find((value) => {
          return value.type === 2;
        });
        this.setData({
          projectInfo: json.result,
          bannerImg: tmp ? tmp.show_image_url : '',
        });
      }
    }).catch(data => {
      console.log(data)
    });
  },
  getList: function(domain) {
    fetch('project/index', 'POST', {
      is_online: 1,
      domain: domain,
    }).then(json => {
      for (let k in this.data.list) {
        let id = k;
        let key = "list." + k + ".hasData";
        if (json.result[id] !== undefined) {
          this.setData({
            [key]: json.result[id]
          });
        }
      }
      for (let i in this.data.queues) {
        let _k = this.data.queues[i]
        let _key = 'proj_' + _k;
        if (this.data.list[_key].hasData) {
          this.setData({
            ['loadMap.' + _k]: true,
            curIndex: i
          });
          break;
        }
      }
    }).catch(data => {})
  },
  getModule: function() {
    fetch('module/lists', 'POST').then(json => {
      json.result.list.forEach(item => {
        for (let k in this.data.list) {
          if (this.data.list[k].id === item.id) {
            this.setData({
              ['list.' + k + '.ctitle']: item.ctitle,
              ['list.' + k + '.etitle']: item.etitle
            })
          }
        }
      })
    }).catch(data => {});
  },
  previewImg: function() {
    wx.navigateTo({
      url: '/pages/album/album?domain=' + this.data.domain,
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    for (let i in this.data.queues) {
      let key = this.data.queues[i];
      if (this.data.list['proj_' + key].hasData && !this.data.loadMap[key]) {
        this.setData({
          ['loadMap.' + key]: true
        });
        break;
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})