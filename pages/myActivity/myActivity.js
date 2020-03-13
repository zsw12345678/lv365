// pages/myActivity/myActivity.js
var network = require("../data/request.js")
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,

    navbar: ["已发起", "已加入", "已完成", "已退出", "已取消"],
    currentTab: 0,
    activityItems: [], //存放活动数据

    pageSize: 6, // 每页加载条数
    pageNumber: 1, // 页数
    tatol: 6, //活动总条数
    userId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'UserDto',
      success: function (res) {

        that.setData({
          userId: res.data.data.userId
        })
        that.LoadingListData(0, 1)
      },
    })
    //加载数据
   
  },

  // 选项卡  
  filterTab: function (e) {
    let index = e.currentTarget.dataset.idx
    this.setData({
      currentTab: index,
      //activityItems: [],
      pageNumber: 1
    })

    //加载数据
    this.LoadingListData(index, 1)
  },

  // 加载数据   待改
  LoadingListData: function (currentTab, pageNumber) {
    var that = this
    var params = new Object()
    params.page = pageNumber + ''
    params.limit = this.data.pageSize + ''
    params.userId = this.data.userId //2加入96活动   1发起90活动
    params.userStatus = currentTab+''

    // 调用下拉加载数据，成功回调函数
    var doSuccess1 = function (res) {

      wx.hideLoading();
      let activityItems = res.data.data
      for (var i = 0; i < activityItems.length; i++) {
        activityItems[i].activityStartTime = activityItems[i].activityStartTime.split(" ")[0]
      }
      that.setData({
        activityItems,
        total: res.data.count,
        pageNumber: 1
      })
    }

    var doSuccess2 = function (res) {
      wx.hideLoading();
      let listArr = that.data.activityItems
      for (var i = 0; i < res.data.data.length; i++) {
        listArr.push(res.data.data[i]);
      }
      for (var i = 0; i < listArr.length; i++) {
        listArr[i].activityStartTime = listArr[i].activityStartTime.split(" ")[0]
      }
      that.setData({
        activityItems: listArr,
        total: res.data.count
      })
    }

    if (pageNumber == 1) {
      network.POST('/activity/myActivity', params, doSuccess1)
    } else {
      network.POST('/activity/myActivity', params, doSuccess2)
    }

  },


  // 触底事件
  onReachBottom: function () {
    var allPageNum = this.data.total / this.data.pageSize
    //考虑少于pageSize的最后一页
    if (this.data.total % this.data.pageSize != 0)
      allPageNum++;
    var pageNumber = this.data.pageNumber + 1
    if (pageNumber <= allPageNum) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 2000
      })
      this.setData({
        pageNumber: pageNumber
      })
      // 加载数据函数
      this.LoadingListData(this.data.currentTab, pageNumber)
    } else {
      wx.showToast({
        title: '已经到底部啦',
        duration: 2000
      })
    }

  },


  //点击跳转到详情页面
  toDetail(event) {
    //点击获取跳转页面的对应下标

    let index = event.currentTarget.dataset.index

    //获取活动id
    let object = this.data.activityItems[index]

    if (this.data.currentTab == 0) {
      wx.navigateTo({
        url: '../detail/detail?index=' + index + '&status=' + 1 + '&activityId=' + object.activityId
      })
    } else if (this.data.currentTab == 1) {
      wx.navigateTo({
        url: '../detail/detail?index=' + index + '&status=' + 2 + '&activityId=' + object.activityId
      })
    } else if (this.data.currentTab == 2) {
      wx.navigateTo({
        url: '../detail/detail?index=' + index + '&status=' + 3 + '&activityId=' + object.activityId
      })
    } else if (this.data.currentTab == 3 || this.data.currentTab == 4) {
      wx.navigateTo({
        url: '../detail/detail?index=' + index + '&status=' + 4 + '&activityId=' + object.activityId
      })
    }
  },

  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    this.LoadingListData(this.data.currentTab, this.data.pageNumber)
    wx: wx.stopPullDownRefresh(); //停止刷新操作
  },

})