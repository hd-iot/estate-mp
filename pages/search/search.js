// pages/search/search.js
const fetch = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    hasSearched: false,
    searchKey: '',
    list: [],
    searchWords: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getStorage({
      key: 'searchWords',
      success: (res) => {
        this.setData({
          searchWords: res.data
        });
      },
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  doSearch: function(key) {
    fetch('project/lists?page=1', 'POST', {
      name: key,
      limit: 100,
      is_online: 1
    }).then(json => {
      var arry = [];
      if (json.result.data.length) {
        json.result.data.forEach(item => {
          if (item.image_list) {
            let photoData = item.image_list.find((x) => x.type === 2);
            if (photoData) {
              item.photo = photoData.show_image_url;
            } else {
              item.photo = '';
            }
          } else {
            item.photo = '';
          }
        });
        arry = json.result.data;
      }
      this.setData({
        total: json.result.total,
        list: arry,
        hasSearched: true
      });
    }).catch(msg => {
      console.log(msg);
    })
  },
  formSubmit: function() {
    this.saveSearchkey();
    this.doSearch(this.data.searchKey);
  },
  saveSearchkey: function() {
    if (!this.data.searchKey) {
      return;
    }
    var arry = JSON.parse(JSON.stringify(this.data.searchWords));
    if (arry.indexOf(this.data.searchKey) >= 0) {
      arry.push(this.data.searchKey);
      this.setData({
        searchWords: arry
      });
    }
    wx.setStorage({
      key: 'searchWords',
      data: arry,
    })
  },
  bindInput: function(e) {
    this.setData({
      searchKey: e.detail.value
    })
  }
})