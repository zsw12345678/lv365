// pages/search/search.js
var network = require("../data/request.js")
const app = getApp();

Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    listArr: [], //存放数据的数组
    inputValue: '', //搜索框输入内容
    show: false,

    total: 6, // 总条数
    pageSize: 6, // 每次加载条数
    pageNumber: 1, // 页数
    reachBottom: false, // 到底显示
  },

  onLoad: function (options) {

  },

  //搜索输入
  onBindTnput: function (event) {
    let inputValue = event.detail.value;
    this.setData({
      inputValue: inputValue
    });
    this.setData({
      show: true
    })
    if (!inputValue) {
      this.setData({
        show: false
      })
    }
  },

  //获取焦点
  onBindFocus: function (event) {
    if (this.data.inputValue) {
      this.setData({
        show: true
      })
    }
  },

  //清空输入
  clearInput: function () {
    this.setData({
      show: false,
      inputValue: ''
    })
  },

  //确认搜索
  searchWord: function () {
    let that = this;
    let keyword = this.data.inputValue.replace(/\s/g, "")  //去掉空格;
    if (keyword) { //不为空
      //加载第一页数据
      that.loadingListData(1);
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入关键词',
        showCancel: false
      });
    }
  },

  //加载数据
  loadingListData: function (pageNumber) {
    let that = this
    let keyword = this.data.inputValue.replace(/\s/g, "")  //去掉空格;
    let params = new Object()
    params.page = pageNumber + ''
    params.limit = that.data.pageSize + ''
    params.keyword = keyword+""
    var success1 = function (res) {
      console.log(res)

      //请求的数据不为0
      if (res.data.data.data.length != 0) {
        let arr = res.data.data.data
        for (var i = 0; i < arr.length; i++) {
          arr[i].activityStartTime = arr[i].activityStartTime.split(" ")[0]
        }
        that.setData({
          total: res.data.data.count,
          listArr: arr,
          pageNumber: 1
        })
      } else if (pageNumber == 1) {
        wx.showModal({
          title: '提示',
          content: '暂时查询不到相关活动',
          showCancel: false
        });
      }

    }

    var success2 = function (res) {
      let listArr = that.data.listArr
      //请求的数据不为0
      if (res.data.data.data.length != 0) {
        for (var i = 0; i < res.data.data.data.length; i++) {
          listArr.push(res.data.data.data[i]);
        }
        let arr = listArr
        for (var i = 0; i < arr.length; i++) {
          arr[i].activityStartTime = arr[i].activityStartTime.split(" ")[0]
        }

        that.setData({
          total: res.data.data.count,
          listArr: arr
        })
      } else if (pageNumber == 1) {
        wx.showModal({
          title: '提示',
          content: '暂时查询不到相关活动',
          showCancel: false
        });
      }

    }
    //隐藏 loading提示框
    wx.hideLoading();

    if (pageNumber == 1) {
      network.POST("/activity/findAllActivity", params, success1)
    } else {
      network.POST("/activity/findAllActivity", params, success2)
    }

  },

  // 触底事件
  onReachBottom: function () {
    var that = this
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
      that.setData({
        pageNumber: pageNumber
      })
      // 加载数据函数
      that.loadingListData(pageNumber)
    } else {
      wx.showToast({
        title: '已经到底部啦',
        duration: 2000
      })
      this.setData({
        reachBottom: true
      })
    }
  },


  //点击跳转到详情页面
  toDetail(event) {

    //点击获取跳转页面的对应下标
    let index = event.currentTarget.dataset.index
    //获取活动id
    let object = this.data.listArr[index]
    wx.navigateTo({
      url: '/pages/detail/detail?activityId=' + object.activityId + '&status=' + 0
    })
  },

  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    this.loadingListData(this.data.pageNumber)
    wx: wx.stopPullDownRefresh();//停止刷新操作
  },

});