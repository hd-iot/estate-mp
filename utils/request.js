const PREFIX = 'http://house-mobile.evergrande.cn/api/index.php/';
//封装Request请求方法
function requst(url, method, data = {},header = {}) {
  wx.showNavigationBarLoading();
  return new Promise((resove, reject) => {
    wx.request({
      url: PREFIX+url,
      data: data,
      header: header,
      method: method.toUpperCase(), // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        wx.hideNavigationBarLoading();
        var data = res.data;
        if (data.code === 200) {
          resove(data);
        } else {
          if (data.code === 404) {
            wx.showToast({
              title: '找不到对应内容，请联系管理员',
              icon: 'none'
            });
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none'
            });
          }
          reject(data);
        }
      },
      fail: function (msg) {
        console.log('reqest error', msg);
        wx.hideNavigationBarLoading();
        reject(msg);
      }
    })
  })
}
module.exports = requst;