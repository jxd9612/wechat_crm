import {
  Tool
} from '../../utils/MyTool.js'
let tool = new Tool();

Page({

  data: {
    'type': null,
    'showModal': false,
    'customerInfo': null
  },

  //显示模态框
  showModal(ev) {
    tool.request("getIndustry").then(suc => {
      this.setData({
        customerInfo: suc.data,
        showModal: true
      })
    });
  },

  //隐藏模态框
  hideModal(ev) {
    this.setData({
      showModal: false
    });
  },

  onLoad(options) {
    //获取用户缓存，判断用户类型
    wx.getStorage({
      key: 'user_info',
      success: res => {
        //1为管理类型，图标全部高亮显示；2为员工类型，图标部分高亮
        if (res.data.type == 1) {
          this.setData({
            type: 1
          });
        } else {
          this.setData({
            type: 2
          });
        }
      },
      //未能获取到缓存信息，类型设置为空
      fail: fal => {
        this.setData({
          type: null
        });
      }
    });
  },

  //跳至跟进页界面
  toDemo(ev) {
    wx.navigateTo({
      url: '../demo/demo',
    });
  },

  //跳至客户管理界面
  toCustomer(ev) {
    wx.navigateTo({
      url: '../workbench/operation/operation?op=2',
    });
  },

  //跳至员工管理界面
  toStaff(ev) {
    wx.navigateTo({
      url: '../workbench/operation/operation?op=1',
    });
  },

  showTip(ev) {
    wx.showToast({
      title: '暂无内容',
      icon: 'none'
    });
  },

  //页面显示是重新判断
  onShow(ev) {
    this.onLoad();
  }

})