import {
  Tool
} from '../../../utils/MyTool.js'
let tool = new Tool();

Page({

  data: {
    'customerList': null,
    'modalCustomer': null,
    'currentPage': 1,
    'showCustModal': false
  },

  onLoad: function(options) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 800
    });
    tool.request("getCustomersBy", {
      'currentPage': this.data.currentPage
    }).then(suc => {
      this.setData({
        customerList: suc.data
      });
    });
  },

  //显示详细信息
  showModal(ev) {
    this.setData({
      showCustModal: true,
      modalCustomer: this.data.customerList.list[ev.currentTarget.dataset.index]
    });
  },

  hideModal(ev) {
    this.onCancel();
  },

  onCancel(ev) {
    this.setData({
      showCustModal: false,
      modalCustomer: null
    });
  },

  //跟进操作
  onFollow(ev) {
    wx.showModal({
      title: '提示',
      content: '是否跟进',
      confirmText: '确认',
      success: res => {
        //点击确认
        if (res.confirm) {
          //获取用户信息缓存
          wx.getStorage({
            key: 'user_info',
            success: suc => {
              //判断是否是员工，是否已有跟进
              if (suc.data.sta_id && suc.data.sta_state == null) {
                //设置已有跟进标志位
                suc.data.cus_name = this.data.modalCustomer.cus_name;
                tool.request("sta_saveOrUpdate", suc.data);
                //绑定跟进
                this.data.modalCustomer.staff = suc.data;
                this.data.modalCustomer.sta_id = suc.data.sta_id;
                tool.request("cus_saveOrUpdate", this.data.modalCustomer);
                //刷新缓存
                wx.setStorage({
                  key: 'user_info',
                  data: suc.data,
                });
                this.onCancel();
                wx.navigateBack({
                  delta: 0
                });
              } else {
                this.onCancel();
                wx.showToast({
                  title: '暂时不支持！',
                  icon: 'none'
                });
              }
            },
          });
        }
      }
    })
  },


  //上拉加载
  onReachBottom: function() {
    tool.request("getCustomersBy", {
      currentPage: ++this.data.currentPage
    }).then(suc => {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 500
      });
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
})