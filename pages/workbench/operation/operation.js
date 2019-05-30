import {
  Tool
} from '../../../utils/MyTool.js'
let tool = new Tool();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    'currentPage': 1,
    'staffList': null,
    'modalStaff': null,
    'customerList': null,
    'modalCustomer': null,
    'showStaffModal': false,
    'showCustModal': false,
    'cus_industry': ['互联网服务行业', '教育和培训行业', '旅游行业', '健康管理行业', '生物医药行业'],
    'industry_index': null,
    'cus_source': ['电话营销', '网络营销', '推广活动'],
    'source_index': null,
    'cus_type': ['意向客户', '非意向客户'],
    'type_index': null,
  },

  //跳转至添加页面
  toAdd(ev) {
    wx.navigateTo({
      url: '../add/add?add_flag=' + this.data.op,
    })
  },

  change(ev) {
    if (ev.currentTarget.dataset.flag == 1) {
      this.setData({
        source_index: ev.detail.value
      });
    } else if (ev.currentTarget.dataset.flag == 2) {
      this.setData({
        industry_index: ev.detail.value
      });
    } else {
      this.setData({
        type_index: ev.detail.value
      });
    }
  },

  //点击页面隐藏
  hideModal() {
    this.onCancel();
  },

  //显示详细信息
  showModal(ev) {
    if (this.data.op == 1) {
      this.setData({
        showStaffModal: true,
        modalStaff: this.data.staffList.list[ev.currentTarget.dataset.index]
      });
    } else {
      this.setData({
        showCustModal: true,
        modalCustomer: this.data.customerList.list[ev.currentTarget.dataset.index]
      });
    }
  },

  //取消按钮
  onCancel() {
    this.setData({
      showStaffModal: false,
      showCustModal: false,
      source_index: null,
      industry_index: null,
      type_index: null
    });
  },

  //移除操作
  onRemove(ev) {
    if (this.data.op == 1) {
      wx.showModal({
        title: '提示',
        content: '是否确认移除',
        confirmText: '移除',
        success: suc => {
          if (suc.confirm) {
            if (this.data.modalStaff.cus_name == null) {
              tool.request("sta_remove", this.data.modalStaff).then(suc => {
                this.onCancel();
                this.onShow();
              });
            } else {
              wx.showModal({
                title: '提示',
                content: '有跟进目标，暂无法移除！',
                showCancel: false
              });
            }
          }
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '是否确认移除',
        confirmText: '移除',
        success: suc => {
          if (suc.confirm) {
            if (this.data.modalCustomer.sta_id == null) {
              tool.request("cus_remove", this.data.modalCustomer).then(suc => {
                this.onCancel();
                this.onShow();
              });
            } else {
              wx.showModal({
                title: '提示',
                content: '该目标正在被跟进，暂无法移除！',
                showCancel: false
              });
            }
          }
        }
      });
    }
  },

  //修改按钮
  editMsg(ev) {
    if (this.data.op == 1) {
      wx.showModal({
        title: '提示',
        content: '是否确认修改',
        confirmText: '修改',
        success: suc => {
          if (suc.confirm) {
            this.data.modalStaff.sta_name = ev.detail.value.sta_name;
            this.data.modalStaff.sta_gender = ev.detail.value.sta_gender;
            this.data.modalStaff.sta_phone = ev.detail.value.sta_phone;
            this.data.modalStaff.sta_email = ev.detail.value.sta_email;
            tool.request("sta_saveOrUpdate", this.data.modalStaff).then(suc => {
              this.onCancel();
              this.onShow();
            });
          }
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '是否确认修改',
        confirmText: '修改',
        success: suc => {
          if (suc.confirm) {
            this.data.modalCustomer.cus_name = ev.detail.value.cus_name;
            this.data.modalCustomer.cus_gender = ev.detail.value.cus_gender;
            this.data.modalCustomer.cus_phone = ev.detail.value.cus_phone;
            this.data.modalCustomer.cus_source = ev.detail.value.cus_source;
            this.data.modalCustomer.cus_industry = ev.detail.value.cus_industry;
            this.data.modalCustomer.cus_type = ev.detail.value.cus_type == '意向客户' ? '0' : '1';
            console.log(this.data.modalCustomer);
            tool.request("cus_saveOrUpdate", this.data.modalCustomer).then(suc => {
              this.onCancel();
              this.onShow();
            });
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.op) {
      this.setData({
        op: options.op
      });
    }
  },

  onShow: function() {
    wx.showLoading({
      title: '数据加载中...'
    });
    this.setData({
      currentPage: 1
    });
    //获取所有员工/客户
    if (this.data.op == 1) {
      tool.request("getStaffs", {
        currentPage: this.data.currentPage
      }).then(suc => {
        setTimeout(wx.hideLoading, 500);
        this.setData({
          currentPage: suc.data.currentPage,
          staffList: suc.data
        });
      }, fal => {
        setTimeout(wx.hideLoading, 500);
        wx.showToast({
          title: '获取数据失败！',
          icon: 'none'
        });
      });
    } else {
      tool.request("getCustomers", {
        currentPage: this.data.currentPage
      }).then(suc => {
        setTimeout(wx.hideLoading, 500);
        console.log(suc.data)
        this.setData({
          currentPage: suc.data.currentPage,
          customerList: suc.data
        });
      }, fal => {
        setTimeout(wx.hideLoading, 500);
        wx.showToast({
          title: '获取数据失败！',
          icon: 'none'
        });
      });
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title: '加载数据中...'
    });
    setTimeout(res => {
      wx.hideLoading();
      //分页加载客户
      if (this.data.op == 1) {
        tool.request("getStaffs", {
          currentPage: ++this.data.currentPage
        }).then(suc => {
          if (this.data.staffList.currentPage < this.data.staffList.totalPage) {
            for (let i = 0; i < suc.data.list.length; i++) {
              this.data.staffList.list.push(suc.data.list[i]);
            }
            this.data.staffList.currentPage++;
            this.setData({
              staffList: this.data.staffList
            });
          } else {
            wx.showToast({
              title: '数据已全部加载完毕！',
              icon: 'none'
            });
          }
        }, fal => {
          wx.showToast({
            title: '获取数据失败！',
            icon: 'none'
          });
        });
      } else {
        tool.request("getCustomers", {
          currentPage: ++this.data.currentPage
        }).then(suc => {
          if (this.data.customerList.currentPage < this.data.customerList.totalPage) {
            for (let i = 0; i < suc.data.list.length; i++) {
              this.data.customerList.list.push(suc.data.list[i]);
            }
            this.data.customerList.currentPage++;
            this.setData({
              customerList: this.data.customerList
            });
          } else {
            wx.showToast({
              title: '数据已全部加载完毕！',
              icon: 'none'
            });
          }
        }, fal => {
          wx.showToast({
            title: '获取数据失败！',
            icon: 'none'
          });
        });
      }
    }, 500);
  }
})