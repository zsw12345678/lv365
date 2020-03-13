const app = getApp();
var network = require("../data/request.js")
Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    navBtn: [{
        'name': '发起活动',
        'icon': '../photo/network.png',
      },
      {
        'name': '环保回收',
        'icon': '../photo/tab.png',
      },
      {
        'name': '企业活动',
        'icon': '../photo/io.png',
      },
      {
        'name': '个人活动',
        'icon': '../photo/round.png',
      },
    ],
    CustomBar: app.globalData.CustomBar,
    ads: '',
    iconItemNormal: [],
    iconItemHot: [],
    iconItemExtend: [],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    second: 5,
    elements: [{
        title: '企业活动',
        name: 'Enterprise',
        color: 'blue',
        icon: 'qr_code'
      },
      {
        title: '个人活动',
        name: 'Personal',
        color: 'green',
        icon: 'myfill'
      },
    ],

    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    status: 0,
    js_code: '',
    titbit: [{}, {}],

    encryptedData: '',
    js_code: '',
    iv: '',
    nickName: '',
    avatarUrl: '',
    gender: '',


    // 全部数据
    activityArticle: [],
    // 总条数
    count: '',
    // 页数
    page: '1',
    // 每次加载条数
    limit: '3',
    // 到底显示
    reachBottom: false,
    ID: '',
    articleId: '',
    hasOnShow: false
  },
  onLoad: function(options) {
    var th = this
    wx.getStorage({
      key: 'shareStatus',
      success: function(res) {
        if (res.data.pageId) {
          th.goarticleDetail(res.data.pageId, res.data.articleId)
        } else if (res.data.ID) {
          th.goactivityDetail(res.data.activityId, res.data.ID)
        }
      },
    })


  },

  onShow: function() {
    this.activity()
    this.slider()
    this.new()
    wx.setStorageSync('index', 2)
    this.setData({
      page: '1'
    })
    this.loadingListData('1', this.data.limit);

  },


  adsGo: function(e) {
    if (e.currentTarget.dataset.status == '花絮') {
      this.tofeatureDetail(e)
    } else if (e.currentTarget.dataset.status == '活动') {
      this.tofeatureDetail1(e)
    } else {
      wx.showToast({
        title: '无相关详情',
      })
    }
  },
  goarticleDetail: function(Id, articleId) {
    if (Id == '123') {
      wx.navigateTo({
        url: '/pages/featureDetail/featureDetail?articleId=' + articleId + '&index=' + 1,
      })
    }
  },
  goactivityDetail: function(activityId, Id) {
    if (Id == '234') {
      wx.navigateTo({
        url: '/pages/detail/detail?activityId=' + activityId + '&status=' + 0
      })
    }
  },


  new: function() {
    var that = this
    var doSuccess = function(res) {
      if (res.data.code == 200) {}
      wx.hideLoading();
    };

    wx.getStorage({
      key: 'UserDto',
      success: function(res) {
        var params = new Object();
        params.userId = res.data.data.userId;
        network.POST('/wechat/deleteWechatOrder', params, doSuccess);
      },
    })

  },

  slider: function() {
    // 轮播
    var that = this
    var doSuccess = function(res) {
      that.setData({
        ads: res.data.data,
      })
      wx.hideLoading();
    };
    var params = new Object();
    params.page = 1 + "";
    params.limit = 10 + "";
    network.POST('/rotaryInfo/list', params, doSuccess);
  },

  openSearch: function() {
    wx: wx.navigateTo({
      url: '../search/search'
    })
  },
  activity: function() {
    var that = this
    var doSuccess = function(res) {
      let listArr = res.data.data
      that.setData({
        activity: listArr,
      })
      wx.hideLoading();
    };
    var params = new Object();
    params.timeCondition = 2 + '';
    params.activityType = 2 + '';
    params.numberCondition = 0 + '';
    params.page = 1 + '';
    params.limit = 50 + '';
    network.POST('/activity/getPopularActivity', params, doSuccess);
  },

  loadingListData: function(page, limit) {

    var params = new Object();
    params.page = page + '';
    params.limit = limit + '';
    var that = this
    var doSuccess = function(res) {
      var simple = res.data.data
      for (var i = 0; i < res.data.data.length; i++) {
        simple[i].articleImg = simple[i].articleImg.split("*")
      }
      for (var i = 0; i < simple.length; i++) {
        simple[i].articleImg = simple[i].articleImg[0].split("-")
      }
      if (page == '1') {
        that.setData({
          activityArticle: simple,
          count: res.data.count,
          page: '1'
        })
      } else {
        that.setData({
          activityArticle: that.data.activityArticle.concat(simple),
          count: res.data.count,

        })
      }
      wx.hideLoading();
    };
    network.POST('/activityArticle/showActivityArticle', params, doSuccess);


  },


  // 分页加载数据
  onReachBottom: function() {
    var allpagenum = this.data.count / this.data.limit;
    if (this.data.count % this.data.limit != 0)
      allpagenum++; //考虑少于page的最后一页
    var page = parseInt(this.data.page) + 1

    if (page <= allpagenum) {
      this.setData({
        page: page
      })
      // 加载数据函数
      this.loadingListData(this.data.page, this.data.limit)
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

  //点击自定义showModel
  cancel: function(e) {
    var that = this
    that.setData({
      isShowModel: false
    })
  },

  //点击tab按钮进入相应页面
  onBindtap: function(e) {
    var index = e.currentTarget.dataset.index
    if (index == 0) {
      wx.navigateTo({
        url: '../Initiation-activities/Initiation-activities',
      })
    } else if (index == 1) {
      wx.navigateToMiniProgram({
        appId: 'wxef56fdfe12bca85d', // 要跳转的小程序的appid
        path: 'pages/index/index', // 跳转的目标页面
        success(res) {}
      })
    } else if (index == 2) {
      wx.setStorageSync('index', 0)
      wx.setStorageSync('discount', '')
      wx.switchTab({
        url: '/pages/exercise/exercise',
      })
    } else if (index == 3) {
      wx.setStorageSync('index', 1)
      wx.setStorageSync('discount', '')
      wx.switchTab({
        url: '/pages/exercise/exercise',
      })
    }
  },

  //点击跳转到花絮详情页面
  tofeatureDetail: function(e) {
    wx.navigateTo({
      url: '/pages/featureDetail/featureDetail?articleId=' + e.currentTarget.dataset.index1 + '&index=' + 1
    })
  },

  tofeatureDetail1: function(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?activityId=' + e.currentTarget.dataset.index + '&status=' + 0
    })
  },

  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    wx: wx.stopPullDownRefresh(); //停止刷新操作
  },


})