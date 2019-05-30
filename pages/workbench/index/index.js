import {
  Tool
} from '../../../utils/MyTool.js'
let tool = new Tool();

Page({

  data: {
    'type': 1,
    'abandonClient': 0,
    'waitToFow': 0
  },

  //跳转至管理页面
  toOpera(ev) {
    wx.getStorage({
      key: 'user_info',
      success: suc => {
        wx.navigateTo({
          url: '../operation/operation?op=' + ev.currentTarget.dataset.op,
        });
      },
      fail: fal => {
        wx.showToast({
          title: '请登录！',
          icon: 'none'
        })
      },
    });
  },

  //跳转至未跟进客户页面
  toFow(ev) {
    wx.getStorage({
      key: 'user_info',
      success: suc => {
        if (suc.data.cus_name == null) {
          wx.showToast({
            title: '未选择要跟进的客户！',
            icon: 'none'
          })
        } else {
          wx.navigateTo({
            url: '../newfow/newfow',
          });
        }
      },
      fail: fal => {
        wx.showToast({
          title: '请登录！',
          icon: 'none'
        });
      },
    });
  },

  //跳转至我的跟进页面
  toMineFow(ev) {
    wx.getStorage({
      key: 'user_info',
      success: suc => {
        wx.navigateTo({
          url: '../minefow/minefow',
        })
      },
      fail: fal => {
        wx.showToast({
          title: '请登录！',
          icon: 'none'
        });
      },
    });
  },

  //跳转至显示页面
  toList(ev) {
    wx.navigateTo({
      url: '../list/list'
    });
  },

  onLoad: function(options) {
    wx.getStorage({
      key: 'user_info',
      success: suc => {
        if (suc.data.type) {
          this.setData({
            type: 1
          });
        } else {
          this.setData({
            type: null
          });
        }
        tool.request("cus_getMsg").then(suc => {
          this.setData({
            waitToFow: suc.data.waitToFow,
            abandonClient: suc.data.abandonClient
          });
        });
      },
      fail: fal => {
        this.setData({
          waitToFow: 0,
          abandonClient: 0,
          type: 1
        });
      }
    });
  },

  onShow: function() {
    this.onLoad();
  }

})