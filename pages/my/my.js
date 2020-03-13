var network = require("../data/request.js")
Page({
  options: {
    addGlobalClass: true,
  },

  data: {
    nickname: '',
    avatar: '',
  },
  onLoad: function() {
    this.updata()
  },
  onShow: function() {
    var that = this
    var refreshUser = function(res) {
      wx.setStorage({
        key: 'UserDto',
        data: res.data
      })
      that.updata()
    }
    network.GET('/getAsyncUser', refreshUser)

  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    wx: wx.stopPullDownRefresh(); //停止刷新操作
  },
  updata: function() {
    var that = this
    wx.getStorage({
      key: 'UserDto',
      success(res) {
        console.log(res)
        that.setData({
          avatar: res.data.data.avatar,
          nickname: res.data.data.nickName,
          role: JSON.stringify(res.data.data.rolesMap)[2],
        })
      }
    })
  }



})