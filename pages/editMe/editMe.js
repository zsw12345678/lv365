var network = require("../data/request.js")

Page({

  data: {
    telephone: '',
    nickname: '',
    avatar: '',
    sex: ''
  },


  onShow: function() {
    var that = this
    wx.getStorage({
      key: 'UserDto',
      success(res) {
        that.setData({
          avatar: res.data.data.avatar,
          sex: res.data.data.sex,
          telephone: res.data.data.phone,
          nickname: res.data.data.nickName,
        });
      }
    })
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    wx: wx.stopPullDownRefresh(); //停止刷新操作
  },

  // 选择图片
  uploadPhoto() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          avatar: res.tempFilePaths[0]
        })
        network.Upload('/uploadPictureFileToJson', tempFilePaths, that.getAsyncUser)
      }
    })

  },


  // 修改图片的回调函数
  getAsyncUser: function(res) {
    var ava = res.data
    var that=this
    wx.getStorage({
      key: 'UserDto',
      success: function (res) {
        var params = new Object();
        params.userId = res.data.data.userId;
        params.avatar = ava
        network.POST('/system/user/updateUser', params, that.refreshUser)
      },
    })
    
   
  },

  //修改用户信息
  refreshUser: function(res) {
    if(res.data.code==200){
      this.setData({
        avatar: res.data.data.avatar
      })
      wx.setStorage({
        key: 'UserDto',
        data: res.data
      })
    }
    wx.showToast({
      title: res.data.msg,
    })
  
  },

  // 修改内容
  bindinput: function(e) {
    if (this.data.status == 0) {
      // 0为简介

      this.setData({
        summary: e.detail.value
      })
    } else if (this.data.status == 1) {
      this.setData({
        commentAccount: e.detail.value
      })
    } else if (this.data.status == 2) {
      this.setData({
        nickname: e.detail.value
      })
    }
  },






})