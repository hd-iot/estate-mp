// components/service/service.js
const fetch = require('../../utils/request.js');
const util = require('../../utils/util.js');
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
    tabs: [],
    len: 0,
    current: 'butler',
    butlerData: {
      type: 19,
      image_list: []
    },
    noticeData: {
      type: 20,
      image_list: []
    },
    contactsData: {
      type: 21,
      image_list: []
    },
    activityData: {
      id: '',
      title: '',
      content: '',
      image_list: [],
    },
    self_setting1Data: {
      type: 37,
      image_list: []
    },
    self_setting2Data: {
      type: 38,
      image_list: []
    },
    self_setting3Data: {
      type: 39,
      image_list: []
    },
    letterList: [],
    contacts: {
      name: "",
      room_num: "",
      contacts: "",
      content: ""
    },
  },

  attached: function() {
    if (!this.data.domain) {
      return;
    }
    fetch('modulelabel/lists', 'POST', {
      domain: this.data.domain,
      module_id: 10,
      is_online: 1,
    }).then(json => {
      if (json.result.data) {
        this.setData({
          tabs: json.result.data,
          len: json.result.data.filter(v => {
            return v.flag;
          }).length
        });
        for (let k = 0; k < json.result.data.length; k++) {
          if (json.result.data[k].flag) {
            this.setData({
              current: json.result.data[k].tab_name
            });
            break;
          }
        }
        this.getMoreInfo();
      }
    }).catch(data => {});
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getMoreInfo() {
      if (this.data.current == 'contacts') return;
      if (this.data.current == 'hdletter') {
        this.getLetter();
      } else if (this.data.current == 'activity') {
        this.getActivity();
      } else {
        this.getImage();
      }
    },
    getImage() {
      const current = this.data.current;
      const type = this.data.tabs.find(v => {
        return v.tab_name == current;
      }).image_type;
      const handle = (json) => {
        if (json) {
          this.setData({
            [current + 'Data.image_list[0]']: json
          });
        }
      };
      fetch('project/getservice', 'POST', {
        domain: this.data.domain,
        type: type,
        is_online: 1
      }).then((json) => {
        handle(json.result);
      }).catch(data => {});
    },

    getLetter(limit = 4) {
      let url = "letter/lists?page=1";
      fetch(url, 'POST', {
        domain: this.data.domain,
        limit: limit,
        is_online: 1
      }).then(json => {
        if (json.result.data.length) {
          this.setData({
            letterList: json.result.data
          });
        }
      }).catch(data => {});
    },

    getActivity() {
      fetch('activity/info', 'POST', {
        domain: this.data.domain,
        is_online: 1
      }).then(json => {
        if (json.result) {
          this.setData({
            activityData: json.result
          });
        }
      }).catch(data => {});
    },
    changeTab(e) {
      let tab = e.currentTarget.dataset.tab;
      this.setData({
        current: tab
      });
      this.getMoreInfo();
    },
    preview(e) {
      let src = e.currentTarget.dataset.src;
      wx.previewImage({
        urls: [src],
      });
    },
    onInput(e) {
      let key = e.currentTarget.dataset.key;
      let val = e.detail.value;
      this.setData({
        ['contacts.' + key]: val
      });
      const msg = this.checkParams(this.data.contacts);
    },
    checkParams(contacts) {
      if (contacts.content === '') {
        return '请输入您的意见';
      } else if (contacts.name === '') {
        return '请输入您的姓名';
      } else if (contacts.room_num === '') {
        return '请输入放号';
      } else if (!/^1\d{10}$/.test(contacts.contacts)) {
        return '请输入正确的手机号码';
      } else {
        return '';
      }
    },
    onSubmit(e) {
      const msg = this.checkParams(this.data.contacts);
      if(msg){
        wx.showToast({
          title: msg,
          icon: 'none'
        });
        return;
      }
      fetch('/feedback/add', 'POST', Object.assign({domain:this.data.domain},this.data.contacts)).then(json => {
        wx.showToast({
          title: '提交成功',
          icon:'success'
        });
        this.setData({
          ['contacts.name']: '',
          ['contacts.room_num']: '',
          ['contacts.contacts']: '',
          ['contacts.content']: ''
        });
      }).catch(data => {});
    }
  }
})