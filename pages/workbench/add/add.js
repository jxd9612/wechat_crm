import {
  Tool
} from '../../../utils/MyTool.js'
let tool = new Tool();

Page({

  data: {
    'flag': 1,
    'sta_gender': ['男', '女'],
    'gender_index': null,
    'cus_industry': ['互联网服务行业', '教育和培训行业', '旅游行业', '健康管理行业', '生物医药行业'],
    'industry_index': null,
    'cus_source': ['电话营销', '网络营销', '推广活动'],
    'source_index': null,
    'cus_type': ['意向客户', '非意向客户'],
    'type_index': null,
  },

  bindGender(ev) {
    if (ev.currentTarget.dataset.flag == 1) {
      this.setData({
        gender_index: ev.detail.value
      });
    } else if (ev.currentTarget.dataset.flag == 2) {
      this.setData({
        industry_index: ev.detail.value
      });
    } else if (ev.currentTarget.dataset.flag == 3) {
      this.setData({
        source_index: ev.detail.value
      });
    } else {
      this.setData({
        type_index: ev.detail.value
      });
    }
  },

  //添加员工操作
  addStaff(ev) {
    wx.showLoading({
      title: '添加中...'
    });
    tool.request('sta_saveOrUpdate', {
      sta_name: ev.detail.value.sta_name,
      sta_gender: ev.detail.value.sta_gender,
      sta_phone: ev.detail.value.sta_phone,
      sta_email: ev.detail.value.sta_email,
      sta_uname: '用户' + ev.detail.value.sta_username,
      sta_username: ev.detail.value.sta_username,
      sta_password: '123456'
    }).then(suc => {
      setTimeout(function() {
        wx.hideLoading();
        wx.showToast({
          title: '添加成功！',
          icon: 'none'
        });
        wx.navigateBack({
          delta: 1
        });
      }, 500);
    });
  },

  //添加客户操作
  addCust(ev) {
    wx.showLoading({
      title: '添加中...'
    });
    tool.request('cus_saveOrUpdate', ev.detail.value).then(suc => {
      setTimeout(function() {
        wx.hideLoading();
        wx.showToast({
          title: '添加成功！',
          icon: 'none'
        });
        wx.navigateBack({
          delta: 1
        });
      }, 500);
    });
  },

  onLoad: function(options) {
    if (options.add_flag) {
      this.setData({
        flag: options.add_flag
      });
    }
  }

})