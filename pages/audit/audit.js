var network = require("../data/request.js")

Page({

  data: {
    navbar: ['待审核', '已审核'],
    currentTab: 0,


    auditName: '',

    activityDone: '',
    count1: '',
    reachBottom1: false,
    // 页数
    page1: '1',
    // 每次加载条数
    limit1: '5',




    activity: '',
    reachBottom: false,
    count: '6',
    // 页数
    page: '1',
    // 每次加载条数
    limit: '5',
    status: ""
  },

  onLoad: function(options) {
    if (typeof(options) == 'undefined') {
      var that = this
      wx.getStorage({
        key: 'featureOrActivityJduge',
        success: function(res) {
          console.log(res.data)
          that.setData({
            auditName: res.data,
          })
          if (res.data == '活动审核') {
            that.setData({
              activity: '',
              activityDone: '',
              page: '1',
              page1: '1',
            })

            that.loadingListData(that.data.page, that.data.limit, '/activity/findActivityByState', '未审核')
          } else if (res.data == '花絮审核') {
            that.setData({
              activity: '',
              activityDone: '',
              page: '1',
              page1: '1',
            })
            that.loadingListData(that.data.page, that.data.limit, '/activityArticle/findActivityArticleByState', '未审核')
          }
        },
      })
    } else {
      this.setData({
        auditName: options.status,
      })
      if (options.status == '活动审核') {
        this.loadingListData(this.data.page, this.data.limit, '/activity/findActivityByState', '未审核')
      } else if (options.status == '花絮审核') {
        this.loadingListData(this.data.page, this.data.limit, '/activityArticle/findActivityArticleByState', '未审核')
      }
    }


  },

  // 顶部导航
  navbarTap: function(e) {
    //  3代表待审核 4代表已审核
    if (this.data.activity.length == 0 && this.data.auditName == '花絮审核' && e.currentTarget.dataset.idx == 0) {
      this.loadingListData(this.data.page, this.data.limit, '/activityArticle/findActivityArticleByState', '未审核')
    } else if (this.data.activity.length == 0 && this.data.auditName == '活动审核' && e.currentTarget.dataset.idx == 0) {
      this.loadingListData(this.data.page, this.data.limit, '/activity/findActivityByState', '未审核')
    } else if (this.data.activityDone.length == 0 && this.data.auditName == '花絮审核' && e.currentTarget.dataset.idx == 1) {
      this.loadingListData(this.data.page1, this.data.limit1, '/activityArticle/findActivityArticleByState', '已审核')
    } else if (this.data.activityDone.length == 0 && this.data.auditName == '活动审核' && e.currentTarget.dataset.idx == 1) {
      this.loadingListData(this.data.page1, this.data.limit1, '/activity/findActivityByState', '已审核')
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    });
  },



  // 分页加载数据
  onReachBottom: function() {
    if (this.data.currentTab == 0) {
      var allpagenum = this.data.count / this.data.limit
      if (this.data.count % this.data.limit != 0)
        allpagenum++; //考虑少于limit的最后一页
      var page = parseInt(this.data.page) + 1
      if (page <= allpagenum) {
        this.setData({
          page: page
        })
        // 加载数据函数
        if (this.data.auditName == '花絮审核') {
          this.loadingListData(this.data.page, this.data.limit, '/activityArticle/findActivityArticleByState', '未审核')
        } else if (this.data.auditName == '活动审核') {
          this.loadingListData(this.data.page, this.data.limit, '/activity/findActivityByState', '未审核')
        }
      } else {
        wx.showToast({
          title: '已经到底部啦',
          duration: 2000
        })
        this.setData({
          reachBottom: true
        })
      }
    } else if (this.data.currentTab == 1) {
      var allpagenum1 = this.data.count1 / this.data.limit1
      if (this.data.count1 % this.data.limit1 != 0)
        allpagenum1++; //考虑少于limit的最后一页
      var page1 = parseInt(this.data.page1) + 1
      if (page1 <= allpagenum1) {
        this.setData({
          page1: page1
        })
        // 加载数据函数
        if (this.data.auditName == '花絮审核') {
          this.loadingListData(this.data.page1, this.data.limit1, '/activityArticle/findActivityArticleByState', '已审核')
        } else if (this.data.auditName == '活动审核') {
          this.loadingListData(this.data.page1, this.data.limit1, '/activity/findActivityByState', '已审核')
        }
      } else {
        wx.showToast({
          title: '已经到底部啦',
          duration: 2000
        })
        this.setData({
          reachBottom1: true
        })
      }
    }
  },



  //已预约加载数据
  loadingListData: function(page, limit, url, status) {
    var params = new Object();
    var page = page.toString()
    var limit = limit.toString()
    params.page = page;
    params.limit = limit;
    if (this.data.auditName == '活动审核') {
      params.activityState = status;
    } else if (this.data.auditName == '花絮审核') {
      params.articleState = status
    }
    var that = this;
    var doSuccess = function(res) {
      if (res.data.code == 200) {
        if (that.data.auditName == '活动审核') {
          var simple = res.data.data.data
        } else if (that.data.auditName == '花絮审核') {
          var simple = res.data.data.data
          for (var i = 0; i < res.data.data.data.length; i++) {
            simple[i].articleImg = simple[i].articleImg.split("*")
          }
          for (var i = 0; i < simple.length; i++) {
            simple[i].articleImg = simple[i].articleImg[0].split("-")
          }
        }
        if (status == '未审核') {
          if (that.data.activity == '') {
            var a = new Array()
            that.setData({
              activity: a.concat(simple),
              count: res.data.data.count,
            })
          } else {
            that.setData({
              activity: that.data.activity.concat(simple),
              count: res.data.data.count,
            })

          }
          wx.hideLoading();
        } else if (status == '已审核') {
          if (that.data.activityDone == '') {
            var a = new Array()
            that.setData({
              activityDone: a.concat(simple),
              count1: res.data.data.count,
            })

          } else {
            that.setData({
              activityDone: that.data.activityDone.concat(simple),
              count1: res.data.data.count,
            })

          }
          wx.hideLoading();
        }
      } else {
        wx.showToast({
          title: '请求失败',
        })
      }
    }
    network.POST(url, params, doSuccess);

  },

  godetail: function(e) {
    if (e.currentTarget.dataset.index1 == undefined) {
      wx.navigateTo({
        url: '/pages/detail/detail?activityId=' + e.currentTarget.dataset.index + '&status=' + 4
      })
    } else {
      wx.navigateTo({
        url: '/pages/featureDetail/featureDetail?articleId=' + e.currentTarget.dataset.index1 + '&index=' + 1
      })
    }

  },



  approved: function(e) {
    var params = new Object();
    var that = this
    var doSuccess = function(res) {
      if (res.data.code == 200) {
        console.log('跳转', res)
        var th = that;
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          confirmText: '确认',
          confirmColor: '#39b54a',
          success: function(res) {
            if (res.confirm) {
              console.log('重新加载数据')
              wx.setStorage({
                key: 'featureOrActivityJduge',
                data: th.data.auditName,
              })
              th.onLoad()
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }

      wx.hideLoading();

    };
    if (this.data.auditName == '活动审核') {
      params.activityId = e.currentTarget.dataset.index
      network.POST('/activity/passActivity', params, doSuccess);
    } else if (this.data.auditName == '花絮审核') {
      params.articleId = e.currentTarget.dataset.index1
      network.POST('/activityArticle/passActivityArticle', params, doSuccess);
    }



    var that = this;



  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    wx: wx.stopPullDownRefresh(); //停止刷新操作
  },
  Notapproved: function(e) {

    var params = new Object();
    var that = this
    var doSuccess = function(res) {
      if (res.data.code == 200) {
        console.log('取消')
        var th = that;
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          confirmText: '确认',
          confirmColor: '#39b54a',
          success: function(res) {
            if (res.confirm) {
              console.log('重新加载数据')
              wx.setStorage({
                key: 'featureOrActivityJduge',
                data: th.data.auditName,
              })
              th.onLoad()
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }
      wx.hideLoading();
    };
    if (this.data.auditName == '活动审核') {
      params.activityId = e.currentTarget.dataset.index
      network.POST('/activity/CancelActivity', params, doSuccess);
    } else if (this.data.auditName == '花絮审核') {
      params.articleId = e.currentTarget.dataset.index1
      network.POST('/activityArticle/cancelActivityArticle', params, doSuccess);
    }
  },




})