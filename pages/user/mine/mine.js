import {
  Tool
} from '../../../utils/MyTool.js'
let tool = new Tool();

Page({

  data: {
    "flag": 0,
    "user_info": null
  },

  //清除用户信息缓存并将当前用户信息清空
  clearUserInfo() {
    wx.showLoading({
      title: '注销中...'
    });
    setTimeout(ev => {
      wx.hideLoading();
      wx.removeStorage({
        key: 'user_info',
        success: suc => {
          this.setData({
            user_info: null
          });
        }
      });
    }, 500);
  },

  //绑定微信
  bindInfo(ev) {
    wx.showLoading({
      title: '绑定中...'
    });
    //获取openid
    wx.login({
      success: suc => {
        tool.request("login", {
          js_code: suc.code,
          appid: 'wx61af54b6e38eeb02',
          secret: '27263c3c60f2f65c26812c20064ca8a5',
          grant_type: 'authorization_code'
        }).then(suc1 => {
          wx.hideLoading();
          //更新信息
          wx.getStorage({
            key: 'user_info',
            success: res => {
              if (res.data.type == 1) {
                //更新用户数据库信息
                tool.request("user_save", {
                  uid: res.data.uid,
                  openId: suc1.data.openid,
                  uname: ev.detail.userInfo.nickName,
                  avatarUrl: ev.detail.userInfo.avatarUrl,
                  username: res.data.username,
                  password: res.data.password,
                  type: res.data.type
                }).then(suc => {
                  //更新当前用户缓存信息
                  wx.setStorage({
                    key: 'user_info',
                    data: suc.data,
                  });
                  //刷新显示
                  this.onShow();
                  wx.showToast({
                    title: '绑定成功！'
                  });
                });
              } else {
                wx.hideLoading();
                //员工暂时不支持绑定微信
                wx.showToast({
                  title: '暂不支持！',
                  icon: 'none'
                });
              }
            }
          })
        }, fal => {
          wx.hideLoading();
        });
      },
      //获取code失败
      fail: fal => {
        setTimeout(function() {
          wx.hideLoading();
          wx.showToast({
            title: '请求失败，请检查网络！',
            icon: 'none'
          })
        }, 500);
      }
    });
  },

  //修改密码
  toUpdate(ev) {
    //获取用户缓存
    wx.getStorage({
      key: 'user_info',
      success: suc => {
        //判断用户类型
        if (suc.data.type == 1) {
          wx.navigateTo({
            url: '../register/register?update=' + ev.currentTarget.dataset.update
          });
          //员工类型暂不支持
        } else {
          wx.showToast({
            title: '暂不支持！',
            icon: 'none'
          });
        }
      },
      fail: fal => {
        wx.showToast({
          title: '请先登录！',
          icon: 'none'
        });
      }
    })
  },

  //跳转至添加员工界面
  toAdd(ev) {
    wx.navigateTo({
      url: '../../workbench/add/add?add_flag=' + ev.currentTarget.dataset.add_flag
    })
  },

  //页面显示执行
  onShow: function() {
    wx.getStorage({
      key: 'user_info',
      success: res => {
        console.log(res.data);
        this.setData({
          user_info: res.data
        });
      }
    });
  },
})