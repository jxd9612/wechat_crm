import {
  Tool
} from '../../../utils/MyTool.js'
let tool = new Tool();

Page({

  data: {
    'myFowList': null,
    'sta_name': null
  },

  onLoad: function(options) {
    wx.getStorage({
      key: 'user_info',
      success: res => {
        tool.request("getRecordBy", res.data).then(suc => {
          if (suc.data != '') {
            this.setData({
              myFowList: suc.data,
              sta_name: res.data.sta_name
            });
          }
        });
      },
    })
  }
})