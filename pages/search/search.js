// pages/search/search.js
const fetch = require('../../utils/request.js');
const PREFIX = 'http://house-mobile.evergrande.cn/api/index.php/';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    hasSearched: false,
    searchKey: '',
    list: [],
    requestTask:null,
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
  clickSearch(e){
    var key = e.currentTarget.dataset.key;
    this.doSearch(key);
    this.setData({
      searchKey:key
    });
  },
  doSearch: function(key) {
    if (this.data.requestTask) {
      this.data.requestTask.abort();
      this.setData({
        requestTask: null
      });
    }
    this.setData({
      hasSearched: true
    });
    fetch('project/lists?page=1', 'POST', {
      name: key,
      limit: 100,
      is_online: 1
    }).then(json => {
      this.handleData(json);
    }).catch(msg => {
      console.log(msg);
    })
  },
  handleData:function(json){
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
  },
  formSubmit: function() {
    this.doSearch(this.data.searchKey);
    this.saveSearchkey();
  },
  saveSearchkey: function() {
    if (!this.data.searchKey) {
      return;
    }
    var arry = JSON.parse(JSON.stringify(this.data.searchWords));
    if (arry.indexOf(this.data.searchKey) < 0) {
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
    });
    if (!e.detail.value) return;
    wx.showNavigationBarLoading();
    if (this.data.requestTask){
      this.data.requestTask.abort();
      this.setData({
        requestTask: null
      });
    }
    let requestTask = wx.request({
      url: PREFIX +'project/lists?page=1',
      method:'POST',
      data:{
        name: e.detail.value,
        limit: 10,
        is_online: 1
      },
      success:(res)=>{
        let json = null;
        if(res.data.code==200){
          json = res.data;
          this.handleData(json);
        }
      },
      complete:()=>{
        wx.hideNavigationBarLoading();
        this.setData({
          requestTask: null
        });
      }
    });
    this.setData({
      requestTask: requestTask
    });
  }
})