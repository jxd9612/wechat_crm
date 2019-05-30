const TIME = require('util.js');
const MAP = require('../lib/amap-wx.js');

let localData = {
  latitude: '', //纬度
  longitude: '', //经度
  key: 'b7e0c9b107a55a861a512cf730b03e25', //申请的高德地图key
  url: 'http://localhost/wechat_crm/'
  // url: 'https://www.jxd9612.xyz/wechat_crm/'
};

class Tool {
  constructor() {}

  let test = 123;

  showTime() {
    // let time = TIME.formatTime(new Date());
    // console.log(time);
    // console.log(localData.key);
    return 1;
  }

  /**
   * 加载当前坐标地址，获取结果并设置到调用页面的data
   */
  loadAddr(_this) {
    wx.getLocation({
      success: res => {
        let myMapFile = new MAP.AMapWX({
          "key": localData.key
        });
        myMapFile.getRegeo({
          location: res.longitude + ',' + res.latitude,
          success: data => {
            _this.setData({
              addr: data[0].regeocodeData.formatted_address
            });
          },
          fail: err => {
            wx.showToast({
              title: '返回结果时失败！'
            });
          }
        });
      },
      fail: err => {
        wx.showToast({
          title: '连接失败，请检查网络！'
        });
      }
    });
  }

  request(_url, data) {
    return new Promise(function(resolve, reject) {
      wx.request({
        url: localData.url + _url,
        data: data,
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        dataType: 'json',
        success: res => {
          resolve(res);
        },
        fail: res => {
          reject(res);
        },
      })
    });
  }

}

export {
  Tool
}