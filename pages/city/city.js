// pages/city/city.js
const fetch = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: {},
    geo: {},
    list: [],
    inList: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'city',
      success: (res) => {
        this.setData({
          city: res.data
        });
      },
    });
    this.getCity();
  },
  getCity: function () {
    fetch('city/listsbyletter', 'POST', {
      type: 1,
      is_online: 1,
    }).then(json => {
      if (json.result.list) {
        let arry = [];
        for (let name in json.result.list) {
          let citys = json.result.list[name];
          let item = {
            citys: citys,
            name: name
          }
          if (citys.length > 0) {
            arry.push(item);
          }
        }
        this.setData({
          list: arry,
        });
        this.getGeo();
      }
    }).catch(msg => {
      console.log(msg);
    })
  },
  getGeo: function () {
    fetch('city/iptocity', 'POST').then(json => {
      if (json.result.local_city_code) {
        const code = json.result.local_city_code;
        this.setData({
          geo: {
            name: json.result.local_city_name,
            code: code
          }
        });
        this.data.list.forEach(item => {
          let inList = item.citys.find(item => {
            return item.code === code
          });
          if (inList) {
            this.setData({
              inList: false
            });
          }
        });
      }
    }).catch(data => { })
  },
  onClickCity: function (e) {
    let city = e.currentTarget.dataset.city;
    let content = `您当前城市为${this.data.city.name}\r\n是否将城市切换到${city.name}？`;
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          wx.setStorage({
            key: 'city',
            data: { code: city.code, name: city.name },
            success: () => {
              wx.navigateTo({
                url: '../index/index'
              });
            }
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})