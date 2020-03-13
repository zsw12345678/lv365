//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    status: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    js_code: '',
    options: ''
  },

  onLoad: function(options) {
    wx.setStorage({
      key: 'shareStatus',
      data: '',
    })
    this.setData({
      options: options
    })


    var that = this
    wx.getSetting({
      success: function(res) {
        var th = that
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              console.log('已经授权', res)
              var that = th
              wx.login({
                success: function(res) {
                  that.setData({
                    js_code: res.code
                  })
                  wx.request({
                    url: getApp().data.host + '/wechat/login',
                    data: {
                      js_code: res.code,
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success(res) {

                      if (res.data.code != 200) {
                        wx.hideLoading()
                        wx.showModal({
                          title: '提示',
                          content: '请求失败',
                        })
                      } else {
                        wx.setStorageSync('token', res.data.msg)
                        wx.setStorageSync('UserDto', res.data)
                        if (th.data.options.pageId || th.data.options.ID) {
                          wx.setStorage({
                            key: 'shareStatus',
                            data: options,
                          })
                        }
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }
                    }

                  })
                }
              })
            }

          })
        } else {
          that.setData({
            modelText: '绿创活动中心平台申请获取以下权限，获得您的公开信息(昵称，头像等)',
            isShowModel: true
          })
        }
      }
    });


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    var that = this
    wx.login({
      success: function(res) {
        console.log('用户信息', res)
        var js_code = res.code;
        that.setData({
          js_code: js_code
        })
        var th = that
        wx.getUserInfo({
          success: function(res) {
            var that = th;
            that.setData({
              modelText: '绿创活动中心平台申请获取您的手机号码',
              isShowModel: true,
              status: 1,
              encryptedData: res.encryptedData,
              iv: res.iv,
              nickName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl,
              gender: res.userInfo.gender,
              userInfo: e.detail.userInfo,
              hasUserInfo: true
            })
          }
        });
      }

    })


  },
  getPhoneNumber: function(e) {

    var js_code = this.data.js_code
    var nickName = this.data.nickName
    var headImg = this.data.avatarUrl
    var that = this
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {} else if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: getApp().data.host + '/wechat/login',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          encryptedData: e.detail.encryptedData,
          js_code: this.data.js_code,
          iv: e.detail.iv,
          nickName: this.data.nickName,
          avatarUrl: this.data.avatarUrl,
          gender: this.data.gender,
        },
        success: function(res) {
          console.log('手机授权', res)
          var th = that
          if (res.data.code == 200) {
            wx.setStorageSync('token', res.data.msg)
            wx.setStorageSync('UserDto', res.data)
            if (th.data.options.pageId || th.data.options.ID) {
              console.log(22222)
              wx.setStorage({
                key: 'shareStatus',
                data: th.data.options,
              })
            }
            wx.switchTab({
              url: '../index/index',
            })

          }
        },
        fail: function(res) {

        }

      });
    }


  },

  //点击自定义showModel
  cancel: function(e) {
    if (e.currentTarget.dataset.cancel == 0) {
      var that = this
      that.setData({
        isShowModel: false
      })
      wx: wx.showModal({
        title: '提示',
        content: '未授权将不能使用该小程序,请授权',
        showCancel: false,
        cancelText: '拒绝授权',
        cancelColor: '#ccc',
        confirmText: '去授权',
        confirmColor: '#39b54a',
        success: function(res) {
          if (res.confirm) {
            var a = new Object
            that.onLoad(a)
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (e.currentTarget.dataset.cancel == 1) {
      var that = this
      that.setData({
        isShowModel: false
      })
      wx: wx.showModal({
        title: '提示',
        content: '未授权手机号将不能使用该小程序,请授权',
        showCancel: false,
        cancelText: '拒绝授权',
        cancelColor: '#ccc',
        confirmText: '去授权',
        confirmColor: '#39b54a',
        success: function(res) {
          var th = that
          if (res.confirm) {
            var a = new Object
            th.setData({
              modelText: '绿创活动中心平台申请获取您的手机号码',
              isShowModel: true,
              status: 1,
            })
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }

  },



})