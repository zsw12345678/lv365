const app = getApp();
var network = require("../data/request.js")
Page({
  data: {
    starCount: 0,
    // forksCount: 0,
    visitTotal: 0,

    menu: [{
      name: '近一个月',
      index: 0,
      showIcon: 'explorefill'
    }, {
      name: '近三个月',
      index: 1,
      showIcon: 'countdownfill'
    }, {
      name: '近半年',
      index: 2,
      showIcon: 'noticefill'
    }, {
      name: '时间段查询',
      index: 3,
      showIcon: 'paintfill'
    }],
    // 近月份菜单切换
    menuSign: 0,
    // 总菜单
    menuDate: '',
    // 修改浮窗
    chooseSize: false,
    animationData: {},


    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    startDate: '',
    endDate: '',
    showNumber: '',
    multiIndex: [0, 0, 0],
    systemDate: '',


    totalTurnover: '',
    activityAudit: '',
    titbitsAudit: '',
    menuDateUrl: '',



  },
  onShow: function() {
    this.attached()
    // 初始时间展示
    const date = new Date();
    var cur_year = date.getFullYear();
    var cur_month = date.getMonth() + 1;
    var day = date.getDate();
    if (cur_month < 10) {
      cur_month = '0' + cur_month
    }
    if (day < 10) {
      day = '0' + day
    }
    var nowDate = cur_year + '-' + cur_month + '-' + day;
    this.setData({
      startDate: nowDate,
      endDate: nowDate,
    })
    var that = this
    let doSuccess = function(res) {
      if (res.data.code == 200) {
        that.setData({
          totalTurnover: res.data.data.totalAccount
        })
      }
      wx.hideLoading();
    };
    let doSuccessActivityAudit = function(res) {
      if (res.data.code == 200) {
        that.setData({
          activityAudit: res.data.data.unAuditActivityCount
        })
      }
      wx.hideLoading();
    };
    let doSuccesstitbitsAudit = function(res) {
      if (res.data.code == 200) {
        that.setData({
          titbitsAudit: res.data.data.unAuditArticleCount
        })
      }
      wx.hideLoading();
    };
    let auditedCompanyActivityCount = function(res) {
      if (res.data.code == 200) {
        that.setData({
          auditedCompanyActivityCount: res.data.data.auditedCompanyActivityCount
        })
      }
      wx.hideLoading();
    };

    let auditedPersonalActivityCount = function(res) {
      if (res.data.code == 200) {
        that.setData({
          auditedPersonalActivityCount: res.data.data.auditedPersonalActivityCount
        })
      }
      wx.hideLoading();
    };

    let managerCount = function(res) {
      if (res.data.code == 200) {
        that.setData({
          managerCount: res.data.data.managerCount
        })
      }
      wx.hideLoading();
    };
    let auditedCompanyCount = function(res) {
      if (res.data.code == 200) {
        that.setData({
          auditedCompanyCount: res.data.data.auditedCompanyCount
        })
      }
      wx.hideLoading();
    };

    var params = new Object()

    //统计已审核企业活动发起总量
    network.POST('/statistics/auditedCompanyActivityCount', params, auditedCompanyActivityCount)
    // 统计已审核个人活动发起总量
    network.POST('/statistics/auditedPersonalActivityCount', params, auditedPersonalActivityCount)

    //系统用户总量
    network.POST('/statistics/managerCount', params, managerCount)
    //企业入驻总量
    network.POST('/statistics/auditedCompanyCount', params, auditedCompanyCount)
    // 总成交额请求
    network.GET('/statistics/totalAccount', doSuccess)
    //待审核活动数量
    network.GET('/statistics/unAuditActivityCount', doSuccessActivityAudit)
    //待审核花絮数量
    network.GET('/statistics/unAuditArticleCount', doSuccesstitbitsAudit)

  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    wx: wx.stopPullDownRefresh(); //停止刷新操作
  },
  changeTab: function(e) {
    // 图标转换
    this.checkTab(this.data.menuDateUrl, e.currentTarget.dataset.index)
    this.setData({
      menuSign: e.currentTarget.dataset.index
    })
  },
  checkTab: function(menuDateUrl, menuSign) {
    console.log(menuDateUrl)
    console.log(menuSign)
    var that = this
    let doSuccess = function(res) {
      if (res.data.code == 200) {
        if (that.data.menuDate == 4) {
          if (menuSign == 3) {
            that.setData({
              showNumber: 1
            })
          } else {
            that.setData({
              systemDate: res.data.data.auditedCompanyActivityCount + '单'
            })
          }

        } else if (that.data.menuDate == 5) {
          if (menuSign == 3) {
            that.setData({
              showNumber: 1
            })
          } else {
            that.setData({
              systemDate: res.data.data.auditedPersonalActivityCount + '单'
            })
          }
        } else if (that.data.menuDate == 6) {
          if (menuSign == 3) {
            that.setData({
              showNumber: 1
            })
          } else {
            that.setData({
              systemDate: res.data.data.managerCount + '人'
            })
          }
        } else if (that.data.menuDate == 7) {
          if (menuSign == 3) {
            that.setData({
              showNumber: 1
            })
          } else {
            that.setData({
              systemDate: res.data.data.auditedCompanyCount + '单'
            })
          }
        }
      } else {
        wx.showToast({
          title: '请求失败',
        })
      }
      wx.hideLoading();
    };
    var params = new Object()
    params.timePeriodType = menuSign
    network.POST(menuDateUrl, params, doSuccess)
  },
  showModel1: function(e) {
    this.chooseSezi();
    // 0企业活动发起总量
    this.setData({
      menuSign: 0,
      menuDate: e.currentTarget.dataset.status
    })
    var that = this
    var doSuccess = function(res) {
      if (res.data.code == 200) {
        if (e.currentTarget.dataset.status == 4) {
          that.setData({
            systemDate: res.data.data.auditedCompanyActivityCount + '单'
          })
        } else if (e.currentTarget.dataset.status == 5) {
          that.setData({
            systemDate: res.data.data.auditedPersonalActivityCount + '单'
          })
        } else if (e.currentTarget.dataset.status == 6) {
          that.setData({
            systemDate: res.data.data.managerCount + '人'
          })
        } else if (e.currentTarget.dataset.status == 7) {
          that.setData({
            systemDate: res.data.data.auditedCompanyCount + '单'
          })
        }
      } else {
        wx.showToast({
          title: '请求失败',
        })
      }
      wx.hideLoading();

    };
    var params = new Object()
    params.timePeriodType = 0
    // 一进去都是初始值近一个月的查询
    // 4企业活动发起总量
    if (e.currentTarget.dataset.status == 4) {
      network.POST('/statistics/auditedCompanyActivityCount', params, doSuccess)
      this.setData({
        menuDateUrl: '/statistics/auditedCompanyActivityCount'
      })
    }
    // 5个人活动发起总量
    else if (e.currentTarget.dataset.status == 5) {
      network.POST('/statistics/auditedPersonalActivityCount', params, doSuccess)
      this.setData({

        menuDateUrl: '/statistics/auditedPersonalActivityCount'
      })
    }
    // 6系统用户总量
    else if (e.currentTarget.dataset.status == 6) {
      network.POST('/statistics/managerCount', params, doSuccess)
      this.setData({
        menuDateUrl: '/statistics/managerCount'
      })
    }
    // 7企业入驻总量
    else if (e.currentTarget.dataset.status == 7) {
      this.setData({
        menuDateUrl: '/statistics/auditedCompanyCount'
      })
      network.POST('/statistics/auditedCompanyCount', params, doSuccess)
    }
  },
  DateChange(e) {
    if (e.currentTarget.dataset.starttime == '0') {
      if (e.detail.value > this.data.endDate) {
        wx.showModal({
          title: '提示',
          content: '开始时间不能大于结束时间',
        })
      } else {
        this.setData({
          startDate: e.detail.value
        })
      }
    } else if (this.data.endDate) {
      if (e.detail.value < this.data.startDate) {
        wx.showModal({
          title: '提示',
          content: '结束时间不能小于开始时间',
        })
      } else {
        this.setData({
          endDate: e.detail.value
        })
      }
    }
  },
  attached: function() {
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    numDH();

    function numDH() {
      if (i < 100) {
        setTimeout(function() {
          that.setData({
            starCount: that.data.titbitsAudit,
            // forksCount: i,
            visitTotal: that.data.activityAudit,
          })
          i++
          numDH();
        }, 200)
      }
    }
    wx.hideLoading()
  },
  makesureCheck: function() {
    this.setData({
      showNumber: ''
    })
  },
  // 查询时间段
  check: function() {
    var that = this
    var params = new Object()
    params.startDate = this.data.startDate
    params.endDate = this.data.endDate
    params.timePeriodType = 3
    var doSuccess = function(res) {
      if (res.data.code == 200) {
        that.setData({
          showNumber: 2
        })
        if (that.data.menuDate == 4) {
          that.setData({
            systemDate: res.data.data.auditedCompanyActivityCount + '单'
          })
        } else if (that.data.menuDate == 5) {
          that.setData({
            systemDate: res.data.data.auditedPersonalActivityCount + '单'
          })
        } else if (that.data.menuDate == 6) {
          that.setData({
            systemDate: res.data.data.managerCount + '人'
          })
        } else if (that.data.menuDate == 7) {
          that.setData({
            systemDate: res.data.data.auditedCompanyCount + '单'
          })
        }
      } else {
        wx.showToast({
          title: '请求失败',
        })
      }
      wx.hideLoading();
    };
    network.POST(this.data.menuDateUrl, params, doSuccess)
  },
  chooseSezi: function() {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideModal: function() {
    this.setData({})
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()
    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },
  gotoAudit: function(e) {
    var status = e.currentTarget.dataset.status;
    if (status == 0) {
      wx.navigateTo({
        url: '../audit/audit?status=' + '活动审核',
      })
    } else if (status == 1) {
      wx.navigateTo({
        url: '../audit/audit?status=' + '花絮审核',
      })
    }
  }
})