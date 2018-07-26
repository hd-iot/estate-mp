// components/news/news.js
const fetch = require('../../utils/request.js');
const util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    domain:{
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
    list:[]
  },
  attached:function(){
    if (!this.data.domain){
      return;
    }
    fetch('news/lists', 'POST', {
      domain: this.data.domain,
      is_online: 1,
    }).then(json => {
      if (json.result.data) {
        this.setData({
          list: json.result.data
        });
      }
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toDetail:function(e){
      let article = e.currentTarget.dataset.article;
      wx.setStorage({
        key: 'article',
        data: {
          title:article.title,
          content: util.formatHtml(article.content)
        },
        success:()=>{
          wx.navigateTo({
            url: '/pages/article/article',
          });
        }
      })
    }
  }
})
