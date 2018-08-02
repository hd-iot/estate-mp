// pages/book/book.js
const fetch = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countdown: 0,
    preventPost: true,
    preventCode: false,
    codeTitle: '获取验证码',
    sended: false,
    bookingForm: {
      domain: '',
      mobile: '',
      name: '',
      code: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ['bookingForm.domain']: options.domain
    });
  },

  toSubmit: function(e) {
    fetch('booking/add', 'POST', this.data.bookingForm).then(json => {
      wx.showToast({
        title: '预约成功，稍后将会有专业的销售人员联系您',
        icon: 'none'
      });
      this.flag = false;
      this.setData({
        ['bookingForm.name']: '',
        ['bookingForm.mobile']: '',
        ['bookingForm.code']: ''
      });
    }).catch(data => {});
  },

  onInput(e) {
    let key = e.currentTarget.dataset.key;
    let val = e.detail.value;
    this.setData({
      ['bookingForm.' + key]: val
    });
    const msg = this.checkParams();
    const flag = msg ? true : false;
    this.setData({
      preventPost: flag
    });
  },

  checkParams() {
    if (this.data.bookingForm.name === '') {
      return '请输入姓名';
    } else if (!/^\d{6}$/.test(this.data.bookingForm.code)) {
      return '请输入正确的验证码';
    } else if (!/^1\d{10}$/.test(this.data.bookingForm.mobile)) {
      return '请您输入正确手机号';
    } else {
      return '';
    }
  },

  getCode(e) {
    let codeType = this.data.sended ? 7 : 5;
    let mobile = this.data.bookingForm.mobile;
    if ((!/^1\d{10}$/.test(mobile))) {
      wx.showToast({
        title: '请您输入正确手机号',
        icon: 'none'
      });
      return;
    }
    let params = {
      mobile: mobile,
      type: codeType
    };
    fetch('user/sendsms', 'POST', params).then((json) => {
      this.setData({
        sended: true
      });
      this.startCountdown();
    }).catch(data => {});
  },
  startCountdown() {
    this.setData({
      countdown: 60
    });
    let intervalId = setInterval(() => {
      this.setData({
        countdown: this.data.countdown - 1,
      });
      if (this.data.countdown == 0) {
        clearInterval(intervalId);
        this.setData({
          codeTitle: '获取验证码'
        });
      } else {
        this.setData({
          codeTitle: '重发验证码(' + this.data.countdown + ')'
        });
      }
    }, 1000);
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