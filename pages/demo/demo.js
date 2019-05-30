import {
  Tool
} from '../../utils/MyTool.js'
let tool = new Tool();

Page({

  data: {
    'fowMsgList': null
  },

  onLoad(options) {
    //获取跟进记录
    tool.request("getRecordList").then(suc => {
      this.setData({
        fowMsgList: suc.data
      });
    });
  },

})