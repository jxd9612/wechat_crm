import {
  Tool
} from '../../../utils/MyTool.js'
let tool = new Tool();

Page({

  data: {
    'flag': null,
    'user_flag': true,
    'pass_flag': true,
    'check_pass': true,
    'update': null
  },

  //校验账号
  checkUser(ev) {
    let reg = /^[a-zA-Z]{1}[a-zA-Z0-9]{5,7}$/;
    if (reg.test(ev.detail.value)) {
      this.setData({
        user_flag: true,
      });
    } else {
      this.setData({
        pass_flag: true,
        user_flag: false
      });
    }
  },

  //校验密码
  checkPass(ev) {
    let reg = /^\w{6,12}$/;
    if (reg.test(ev.detail.value)) {
      this.setData({
        pass_flag: true,
      });
    } else {
      this.setData({
        check_pass: true,
        user_flag: true,
        pass_flag: false
      });
    }
  },

  //检测账号是否正确
  check(ev) {
    wx.getStorage({
      key: 'user_info',
      success: suc => {
        if (suc.data.password != ev.detail.value) {
          this.setData({
            flag: 3,
            check_pass: false,
            pass_flag: true
          });
        } else {
          this.setData({
            flag: null,
            check_pass: true,
            pass_flag: true
          });
        }
      },
    });
  },

  //注册功能
  register(ev) {
    if (this.data.user_flag && this.data.pass_flag) {
      wx.showLoading({
        title: '注册中...',
      });
      //获取注册信息缓存
      wx.getStorage({
        key: 'registInfo',
        //获取成功，进行微信绑定操作
        success: suc => {
          tool.request('user_save', {
            openId: suc.data.openid,
            uname: suc.data.uname,
            avatarUrl: suc.data.avatarUrl,
            username: ev.detail.value.username,
            password: ev.detail.value.password,
            type: 1
          }).then(suc => {
            setTimeout(function() {
              wx.hideLoading();
              wx.showToast({
                title: '注册成功！',
                icon: 'none'
              });
              wx.setStorage({
                key: 'user_info',
                data: suc.data,
              });
              wx.switchTab({
                url: '../mine/mine',
              });
            }, 500);
          }, fal => {
            setTimeout(function() {
              wx.hideLoading();
              wx.showToast({
                title: '注册失败，请检查网络！',
                icon: 'none'
              });
            }, 500);
          });
        },
        //获取失败，进行普通注册操作
        fail: fal => {
          tool.request('user_save', {
            uname: '用户_' + ev.detail.value.username,
            username: ev.detail.value.username,
            password: ev.detail.value.password,
            type: 1
          }).then(suc => {
            setTimeout(function() {
              wx.hideLoading();
              wx.showToast({
                title: '注册成功！',
                icon: 'none'
              });
              wx.setStorage({
                key: 'user_info',
                data: suc.data,
              });
              wx.switchTab({
                url: '../mine/mine',
              });
            }, 500);
          }, fal => {
            setTimeout(function() {
              wx.hideLoading();
              wx.showToast({
                title: '注册失败，请检查网络！',
                icon: 'none'
              });
            }, 500);
          });
        }
      });
    }
  },

  //更新密码
  updatePassword(ev) {
    if (this.data.flag != 3 && this.data.pass_flag) {
      //获取用户缓存信息，修改密码，更新缓存信息
      wx.getStorage({
        key: 'user_info',
        success: suc => {
          suc.data.password = ev.detail.value.password;
          wx.showLoading({
            title: '更新中...',
          });
          setTimeout(function() {
            tool.request("user_save", suc.data).then(suc => {
              wx.setStorage({
                key: 'user_info',
                data: suc.data
              });
              wx.navigateBack({
                delta: 1
              });
              wx.hideLoading();
            });
          }, 500);
        },
      });
    }
  },

  onLoad: function(options) {
    //区分表单
    if (options.update)
      this.setData({
        update: options.update
      });
  }

})