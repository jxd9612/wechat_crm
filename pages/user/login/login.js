import {
  Tool
} from '../../../utils/MyTool.js'
let tool = new Tool();

Page({

  data: {
    tip: null
  },

  //账号密码登录方法
  normalLogin(ev) {
    // 用户名或者密码不为空则请求服务器，否则给出用户提示
    if (ev.detail.value.username != '' && ev.detail.value.password != '') {
      wx.showLoading({
        title: '登录中...',
      });
      //请求服务器，验证账号密码，服务器返回标识及用户信息
      tool.request('normalLogin', {
        username: ev.detail.value.username,
        password: ev.detail.value.password
      }).then(suc => {
        //返回flag为true则将用户信息缓存，跳转
        if (suc.data.flag) {
          setTimeout(function() {
            wx.hideLoading();
            wx.setStorage({
              key: 'user_info',
              data: suc.data.user,
            });
            wx.switchTab({
              url: '../mine/mine',
            });
          }, 300);
          //员工登录
        } else if (suc.data.staff != null) {
          setTimeout(function() {
            wx.hideLoading();
            wx.setStorage({
              key: 'user_info',
              data: suc.data.staff,
            });
            wx.switchTab({
              url: '../mine/mine',
            });
          }, 300);
        } else {
          setTimeout(wx.hideLoading, 500);
          this.setData({
            tip: '账号或密码有误！'
          });
        }
      });
    } else {
      this.setData({
        tip: '请输入正确的用户名或者密码！'
      });
    }
  },

  //微信快捷登录
  quickLogin(ev) {
    wx.showToast({
      title: '登录中...',
      icon: 'loading',
      duration: 500
    });
    //获取code换取openid
    wx.login({
      success: suc => {
        tool.request("login", {
          js_code: suc.code,
          appid: 'wx61af54b6e38eeb02',
          secret: '27263c3c60f2f65c26812c20064ca8a5',
          grant_type: 'authorization_code'
        }).then(suc1 => {
          //检测openid是否存在
          tool.request("quickLogin", {
            openId: suc1.data.openid
          }).then(suc2 => {
            //存在，直接登录
            if (suc2.data.flag) {
              wx.setStorage({
                key: 'user_info',
                data: suc2.data.user
              });
              wx.switchTab({
                url: '../mine/mine'
              });
              //不存在，注册
            } else {
              wx.removeStorage({
                key: 'registInfo'
              });
              wx.setStorage({
                key: 'registInfo',
                data: {
                  openid: suc1.data.openid,
                  uname: ev.detail.userInfo.nickName,
                  avatarUrl: ev.detail.userInfo.avatarUrl
                }
              });
              wx.navigateTo({
                url: '../register/register'
              });
            }
          });
          //请求失败操作
        }, fal => {
          wx.showToast({
            title: '请求失败！',
            icon: 'none',
            duration: 500
          });
        });
      },
      //获取code失败
      fail: fal => {
        wx.showToast({
          title: '请求失败！',
          icon: 'none',
          duration: 500
        });
      }
    });
  }

})