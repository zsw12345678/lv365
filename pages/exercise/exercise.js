// pages/exercise/exercise.js
var network = require("../data/request.js")
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,

    tabTxt: ['全部活动', '时间', '参与人数'], //分类
    tab: [true, true, true],
    nav: [false, false, false],
    exercise_id: 0, //活动
    time_id: 0, //时间
    number_id: 0, //参与人数
    show: false, //列表显示
    hide: true, //蒙层显示

    //导航筛选值
    filterArr: [
      ['企业活动', '个人活动', '全部活动'],
      ['从近到远', '从远到近', '不限时间'],
      ['从高到低', '从低到高', '不限人数']
    ],

    //列表数据
    listArr: [], //存放数据的数组
    activity: 2, // 活动： 0企业活动, 1个人活动, 2全部活动
    time: 2, // 时间： 0从近到远, 1从远到近, 2不限时间
    number: 2, // 参与人数：0从高到低, 1从低到高， 2不限人数

    //加载数据
    total: 6, // 总条数
    pageSize: 6, // 每次加载条数
    pageNumber: 1, // 页数
    reachBottom: false, // 到底显示

    change: true,
    discount: '',

    index: '',

    scrollY: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('discount', '')
    var that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowHeight: res.windowHeight + 'rpx'
        })
      }
    })
  },

  //点击tab时触发
  onTabItemTap(item) {
    var sign = wx.getStorageSync('sign')
    if (!sign) {
      //页面回到初始化状态
      this.setData({
        nav: [true, false, false],
        tabTxt: ['全部活动', '时间', '参与人数'],
        tab: [true, true, true],
        activity: 2,
        time: 2,
        number: 2,
        exercise_id: 2,
        time_id: 2,
        number_id: 2,
        //listArr: [],
        pageNumber: 1,
        show: false, //列表显示
        hide: true, //蒙层显示
      })


      if (this.data.change) {
        this.LoadingListData(1, 2, 2, 2)
      }

      this.setData({
        change: true
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let discount = wx.getStorageSync('discount')
    if (!discount) {

      //0代表企业活动 1代表个人活动
      let index = wx.getStorageSync('index')

      let tabTxt = this.data.tabTxt
      if (index == 0) {
        tabTxt = ['企业活动', '时间', '参与人数']
      } else if (index == 1) {
        tabTxt = ['个人活动', '时间', '参与人数']
      } else {
        tabTxt = ['全部活动', '时间', '参与人数']
      }

      this.setData({
        nav: [true, false, false],
        tabTxt: tabTxt,
        activity: index,
        time: 2,
        number: 2,
        exercise_id: index,
        time_id: 2,
        number_id: 2,
        //listArr: [],
        pageNumber: 1,
        show: false, //列表显示
        hide: true, //蒙层显示
      })

      //预加载数据
      if (index == 0) {

        this.LoadingListData(1, 0, 2, 2)
        wx.setStorageSync('sign', 1)
      } else if (index == 1) {

        this.LoadingListData(1, 1, 2, 2)
        wx.setStorageSync('sign', 1)
      } else {

        this.LoadingListData(1, 2, 2, 2)
        wx.setStorageSync('sign', '')
        this.setData({
          change: false
        })
      }

      wx.setStorageSync('index', 2)
    }

  },


  // 加载数据 
  LoadingListData: function(pageNumber, activity, time, number) {

    var that = this
    var params = new Object()
    params.page = pageNumber + ''
    params.limit = that.data.pageSize + ''
    params.activityType = activity + ''
    params.timeCondition = time + ''
    params.numberCondition = number + ''


    // 调用下拉加载数据，成功回调函数
    var doSuccess1 = function(res) {
      var arr = res.data.data,
        count = res.data.data.length
      for (var i = 0; i < count; i++) {
        arr[i].activityStartTime = arr[i].activityStartTime.split(" ")[0]
        // let nowTime = new Date()
        // let endTime = new Date(arr[i].activityRegisterEndTime)
        // if (nowTime.getTime() > endTime.getTime()) {
        //   arr.splice(i, 1)
        //   i--
        //   count--
        // }
      }
      that.setData({
        listArr: arr,
        total: res.data.count,
        pageNumber: 1
      })
      wx.hideLoading();
    }

    var doSuccess2 = function(res) {

      var listArr = that.data.listArr
      for (var i = 0; i < res.data.data.length; i++) {
        listArr.push(res.data.data[i])
      }
      var count = listArr.length
      for (var i = 0; i < count; i++) {
        listArr[i].activityStartTime = listArr[i].activityStartTime.split(" ")[0]
      }

      that.setData({
        listArr,
        total: res.data.count
      })
      wx.hideLoading();
    }

    if (pageNumber == 1) {
      network.POST('/activity/getActivityRecordByCondition', params, doSuccess1)
    } else {
      network.POST('/activity/getActivityRecordByCondition', params, doSuccess2)
    }

    wx.setStorageSync('discount', '')

  },



  // 选项卡  
  filterTab: function(e) {

    let data = [true, true, true],
      nav = [false, false, false],
      index = e.currentTarget.dataset.indx,
      hide
    data[index] = !this.data.tab[index]
    nav[index] = true
    this.setData({
      tab: data,
      show: true,
      index,
      nav
    })
    if (this.data.show) {
      hide = true
    }
    if (!this.data.tab[index]) {
      hide = false
    }
    this.setData({
      hide,
      index
    })

    this.setScollTop()
  },

  //筛选项点击操作  
  filter: function(e) {
    let self = this,
      id = e.currentTarget.dataset.id,
      txt = e.currentTarget.dataset.txt,
      tabTxt = this.data.tabTxt
    switch (e.currentTarget.dataset.indx) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [false, true, true],
          tabTxt: tabTxt,
          exercise_id: id,
          show: false,
          hide: true,
          activity: id,
          pageNumber: 1,
        })
        break

      case '1':
        tabTxt[1] = txt;
        self.setData({
          tab: [true, false, true],
          tabTxt: tabTxt,
          time_id: id,
          show: false,
          hide: true,
          time: id,
          pageNumber: 1,
        })
        break

      case '2':
        tabTxt[2] = txt
        self.setData({
          tab: [true, true, false],
          tabTxt: tabTxt,
          number_id: id,
          show: false,
          hide: true,
          number: id,
          pageNumber: 1,
        })
        break
    }
    self.setData({
      tab: [true, true, true]
    })
    //加载数据
    self.LoadingListData(1, this.data.activity, this.data.time, this.data.number)

  },

  // 触底事件
  onReachBottom: function() {


    var allPageNum = this.data.total / this.data.pageSize
    //考虑少于pageSize的最后一页
    if (this.data.total % this.data.pageSize != 0)
      allPageNum++;
    var pageNumber = this.data.pageNumber + 1
    if (pageNumber <= allPageNum) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 200
      })
      this.setData({
        pageNumber: pageNumber
      })
      // 加载数据函数
      this.LoadingListData(pageNumber, this.data.activity, this.data.time, this.data.number)
    } else {
      wx.showToast({
        title: '已经到底部啦',
        duration: 2000
      })
      this.setData({
        reachBottom: true,
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
      url: '/pages/detail/detail?activityId=' + object.activityId + '&status=' + 0 + '&pageId=' + 222
    })
  },


  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    if (this.data.hide) {
      this.LoadingListData(1, this.data.activity, this.data.time, this.data.number)
    }
    wx: wx.stopPullDownRefresh(); //停止刷新操作
  },

  //点击蒙层收起筛选项
  maskTap: function() {
    let data = [true, true, true],
      nav = [false, false, false],
      index = this.data.index,
      hide
    data[index] = !this.data.tab[index]
    nav[index] = true
    this.setData({
      tab: data,
      show: true,
      index,
      nav
    })
    if (this.data.show) {
      hide = true
    }
    if (!this.data.tab[index]) {
      hide = false
    }
    this.setData({
      hide,
      index
    })

    this.setScollTop()
  },

  onPageScroll: function(e) { // 获取滚动条当前位置
    if (e.scrollTop != 0) {
      this.setData({
        scrollY: -(e.scrollTop * 2)
      })
    }
  },

  setScollTop: function(e) { // 回到原前位置
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: -(this.data.scrollY / 2),
        duration: 0
      })
    }
  },

  handleMove: function() {

  }
})