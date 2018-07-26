// pages/album/album.js
const fetch = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    domain:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      domain: options.domain
    });
    fetch('category/lists', 'POST', {
        domain: options.domain,
        is_online: 1
      }).then(json => {
        if (json.result) {
          this.setData({
            list: json.result.list
          });
        }
      })
      .catch(data => {});
  },
  preview(e) {
    let id = e.currentTarget.dataset.id;
    fetch("category/info", 'POST', {
        domain: this.data.domain,
        id: id,
        is_online: 1
      }).then(json => {
        if (json.result.image_list.length) {
          let urls = json.result.image_list.map(item => {
            return item.show_image_url;
          });
          wx.previewImage({
            urls: urls,
          });
        }
      })
      .catch(data => {});
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

  }
})