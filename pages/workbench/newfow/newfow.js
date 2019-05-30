import {
  Tool
} from '../../../utils/MyTool.js'
let tool = new Tool();

Page({

  data: {
    'test': 1,
    'addr': null,
    'cur_time': null,
    'nex_time': null,
    'fow_way': ['', '跟进方式1', '跟进方式2', '跟进方式3'],
    'way_index': null,
    'fow_state': ['', '初访', '洽谈中', '已签约', '已放弃'],
    'state_index': null,
    'cusName': null
  },

  fowTime(e) {
    // console.log(e.target.dataset.flag);
    if (e.target.dataset.flag == 1) {
      this.setData({
        cur_time: e.detail.value
      });
    } else if (e.target.dataset.flag == 2) {
      this.setData({
        nex_time: e.detail.value
      });
    } else if (e.target.dataset.flag == 3) {
      this.setData({
        way_index: e.detail.value
      });
    } else {
      this.setData({
        state_index: e.detail.value
      });
    }
  },

  getLocal() {
    wx.showLoading({
      title: '正在获取坐标...',
      success: res => {
        tool.loadAddr(this);
        setTimeout(wx.hideLoading, 1000);
      },
      fail: err => {
        wx.showToast({
          title: '获取坐标失败，请检查网络!'
        });
        setTimeout(wx.hideLoading, 1000);
      }
    });
  },

  addRecord(ev) {
    wx.showToast({
      title: '更新中...',
      icon: 'loading',
      duration: 500
    });
    wx.getStorage({
      key: 'user_info',
      success: res => {
        tool.request("addRecord", {
          fol_way: ev.detail.value.fol_way,
          fol_firstTime: ev.detail.value.fol_firstTime,
          fol_addr: ev.detail.value.fol_addr,
          fol_state: ev.detail.value.fol_state,
          fol_nextTime: ev.detail.value.fol_nextTime,
          fol_detail: ev.detail.value.fol_detail,
          sta_id: res.data.sta_id,
          cus_name: this.data.cusName,
          sta_name: res.data.sta_name
        }).then(suc => {
          wx.redirectTo({
            url: '../minefow/minefow'
          });
        });
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getStorage({
      key: 'user_info',
      success: res => {
        tool.request("getName", res.data).then(suc => {
          this.setData({
            cusName: suc.data.cus_name
          });
        });
      }
    })
  }
})