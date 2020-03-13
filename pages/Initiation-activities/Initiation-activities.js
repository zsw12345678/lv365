const app = getApp();
var network = require("../data/request.js")
// chooseTime.js
var util = require('../../utils/util.js')
var cellId;
var date = new Date();
var years = [];
var months = [];
var days = [];
var hours = [];
var minutes = [];
var seconds = [];

var nowYear;
var nowMonth;
var nowDay;
var nowHour;
var nowMinute;
var nowSecond;

var t = 0;
var show = false;
var moveY = 200;

for (let i = new Date().getFullYear(); i < 2117; i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  i = zeroPadding(i);
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  i = zeroPadding(i);
  days.push(i)
}

for (let i = 0; i <= 23; i++) {
  i = zeroPadding(i);
  hours.push(i)
}
for (let i = 0; i <= 59; i++) {
  i = zeroPadding(i);
  minutes.push(i)
}
for (let i = 0; i <= 59; i++) {
  i = zeroPadding(i);
  seconds.push(i)
}
Page({
  data: {
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,


    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    second: '',

    showM: false,


    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list: [{
        name: '个人发布',
        color: 'olive'
      },
      {
        name: '企业发布',
        color: '#39b54a'
      }
    ],

    imgList: [],
    toggleDelay: false,

    startTime: '',
    startDate: '',
    RegistrationTime: '',
    RegistrationDeadline: '',
    InitiationActivities: '',
    EndActivity: '',
    firstDate: '',
    firstDate1: '',
    bindchangeStatus1: 0,
    bindchangeStatus3: 0,
    bindchangeStatus: 0,
    bindchangeStatus2: 0,


    multiIndex: [0, 0, 0],
    // 个人0企业2管理员1
    role: '',


    // 地址展示
    // 模拟数据
    addressNameStatus: 0,
    addressItem: [{}, {}],
    addressName: '',
    // 展示时间或者地址
    watchAdress: true,
    addressDate: '',
    addressId: '',
    shine: '',


    address: '',
    show: false,
    indivadualShow: true,
    enterpriseShow: false,

    model: '',
    // 修改浮窗
    chooseSize: false,
    animationData: {},
    fee: true,
    timeStatus: '',

    // 费用表单
    activityFee: '',
    account: '',
    emailAddress: '',
    emailNumber: '',
    people: '',
    phoneNumber: '',
    //  switchFee控制是否需要费用按钮
    switchFee: false,
    billOrNot: true,


    photo: '',
    windowHeight: '',

    userId: '',
  },


  onLoad: function() {
    this.setData({
      windowHeight: wx.$windowHeight + 'rpx',
      height: ''
    })
    var that = this;
    // 初始时间展示
    const date = new Date();
    nowYear = date.getFullYear();
    nowMonth = date.getMonth() + 1;
    nowDay = date.getDate();
    nowHour = date.getHours();
    nowMinute = date.getMinutes();
    nowSecond = date.getSeconds();

    //获取时间
    if (nowSecond < 10) {
      var nowSecond = '0' + nowSecond
    }
    if (nowMinute < 10) {
      var nowMinute = '0' + nowMinute
    }
    console.log(nowDay)
    if (nowDay < 10) {
      var nowDay = '0' + nowDay
    }
    var nowDay1 = parseInt(nowDay) + 1
    var nowDay2 = parseInt(nowDay) + 2
    if (nowDay1 < 10) {
      var nowDay1 = '0' + nowDay1
    }
    if (nowDay2 < 10) {
      var nowDay2 = '0' + nowDay2
    }

    if (nowHour < 10) {
      var nowHour = '0' + nowHour
    }
    if (nowMonth < 10) {
      var nowMonth = '0' + nowMonth
    }
    var nowYear1 = nowYear;
    var nowYear = parseInt(nowYear) + 1;
    var startTime = nowYear1 + '-' + nowMonth + '-' + nowDay + ' ' + nowHour + ':' + nowMinute + ':' + nowSecond;
    var startDate = nowYear + '-' + nowMonth + '-' + nowDay2 + ' ' + nowHour + ':' + nowMinute + ':' + nowSecond;
    this.setData({
      startDate: startDate,
      startTime: startTime,
      RegistrationTime: startTime,
      RegistrationDeadline: startDate,
      InitiationActivities: startTime,
      EndActivity: startDate,
    })
    //获取时间
    getNowDate(new Date());

    // 初始化

    days = getDays(nowYear, nowMonth);
    var nowyear1 = nowYear + 2
    var nowyear2 = nowYear - 1

    that.setData({
      year: nowYear,
      month: zeroPadding(nowMonth),
      days: days,
      day: zeroPadding(nowDay),
      hour: zeroPadding(nowHour),
      minute: zeroPadding(nowMinute),
      second: zeroPadding(nowSecond),
      firstDate2: nowyear2 + '-' + nowMonth + '-' + nowDay2 + ' ' + nowHour + ':' + nowMinute + ':' + nowSecond,
      firstDate1: nowyear2 + '-' + nowMonth + '-' + nowDay1 + ' ' + nowHour + ':' + nowMinute + ':' + nowSecond,
      firstDate: nowyear1 + '-' + nowMonth + '-' + nowDay + ' ' + nowHour + ':' + nowMinute + ':' + nowSecond,
      value: [nowYear - 2020, nowMonth - 1, nowDay, nowHour, nowMinute, nowSecond]
    })



    var that = this
    wx.getStorage({
      key: 'UserDto',
      success: function(res) {
        var last = JSON.stringify(res.data.data.rolesMap);
        that.setData({
          userId: res.data.data.userId,
          role: last[2]
        })
      },
    })

  },
  // 确认选择的地址
  makesureAddress: function(e) {
    this.hideModal(e)
    if (this.data.shine == '') {
      this.setData({
        addressId: this.data.addressDate[0].addressId,
        address: this.data.addressDate[0].addressName,
      })
    } else {
      this.setData({
        addressId: this.data.addressDate[this.data.shine].addressId,
        address: this.data.addressDate[this.data.shine].addressName,
      })
    }
  },
  //地址高亮选择
  highColor: function(e) {
    this.setData({
      addressId: this.data.addressDate[e.currentTarget.dataset.index].addressId,
      shine: e.currentTarget.dataset.index
    })
  },
  // 是否需要费用选择
  switchFee(e) {
    if (e.detail.value == true) {
      this.chooseSezi();
      this.setData({
        model: 0,
        fee: true
      })
    } else if (e.detail.value == false) {
      this.setData({
        model: 0,
        activityFee: '',
        account: '',
        emailAddress: '',
        emailNumber: '',
        people: '',
        phoneNumber: '',
        switchFee: false,
      })
    }
  },
  //获取现有场馆
  showAddress: function() {
    var that = this
    var doSuccess = function(res) {
      that.setData({
        addressId: res.data.data[0].addressId,
        addressDate: res.data.data
      })
      wx.hideLoading();
    };
    network.GET('/activity/getAddress', doSuccess)
    this.chooseSezi();
    this.setData({
      // model标记模态框展示内容
      model: 1,
    })
  },
  // 查看场馆预约时间
  watchTime: function(e) {

    if (e.currentTarget.dataset.watch == 0) {
      var params = new Object()
      params.addressId = this.data.addressId
      var that = this
      var doSuccess = function(res) {
        if (res.data.code = 200) {
          that.setData({
            addressTime: res.data.data.bookingList
          })
        }
      };
      this.setData({
        watchAdress: false
      })
      network.POST('/activity/getBookingListByAddressId', params, doSuccess)
    } else {
      this.setData({
        watchAdress: true
      })
    }
    wx.hideLoading();
  },
  // 按钮动效
  toggle(e) {
    this.setData({
      indivadualShow: false,
      enterpriseShow: true,
    })
    if (e.currentTarget.dataset.status == 1) {
      var that = this
      wx.getStorage({
        key: 'UserDto',
        success(res) {
          var a = JSON.stringify(res.data.data.rolesMap);
          console.log(a[2])
          if (a[2] == 1 || a[2] == 2) {
            that.setData({
              indivadualShow: false,
              enterpriseShow: true,
            })
          } else {
            console.log('sadasd')
            var th = that
            wx.showModal({
              title: '提示',
              content: '企业尚未认证，不能发布企业活动',
              showCancel: true, //是否显示取消按钮
              cancelText: "取消", //默认是“取消”
              cancelColor: '#ccc', //取消文字的颜色
              confirmText: "去认证", //默认是“确定”
              confirmColor: '#39b54a', //确定文字的颜色
              success: function(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../enterprise/enterprise',
                  })
                } else {
                  th.setData({
                    indivadualShow: true,
                    enterpriseShow: false,
                  })
                }
              },
            })

          }

        }
      })
    } else {
      this.setData({
        indivadualShow: true,
        enterpriseShow: false,
      })
    }

  },
  // 按钮动效
  toggleDelay() {
    var that = this;
    that.setData({
      toggleDelay: true
    })
    setTimeout(function() {
      that.setData({
        toggleDelay: false
      })
    }, 1000)
  },
  //开发票票与否选择
  bill: function(e) {
    if (e.detail.value == 0) {
      this.setData({
        fee: true,
        billOrNot: ''
      })
    } else if (e.detail.value == 1) {
      this.setData({
        fee: false
      })
    }
  },
  // 发票表单
  makesure: function(e) {
    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/ //电话号码正则表达式验证
    let phone = this.data.phoneNumber.replace(/\s/g, "") //去掉空格
    if (this.data.activityFee == '') {
      this.showmodel('请输入费用')
    } else if (this.data.activityFee < 0) {
      this.showmodel('费用不能少于0')
    } else if (this.data.account == '') {
      this.showmodel('请输入对公账号')
    } else if (this.data.fee == true) {
      if (this.data.emailAddress == '') {
        this.showmodel('邮寄地址不能为空')
      } else if (this.data.emailNumber == '') {
        this.showmodel('邮政编码不能为空')
      } else if (this.data.people == '') {
        this.showmodel('联系人姓名不能为空')
      } else if (phone == '') {
        this.showmodel('联系人电话不能为空')
      } else if (!phoneReg.test(phone)) {
        this.showmodel('请输入正确的手机号码')
      } else {
        this.hideModal(e)
      }
    } else {
      this.hideModal(e)
    }
    this.setData({
      switchFee: true,
      price: ''
    })

  },
  // 提示框函数
  showmodel: function(e) {
    wx.showModal({
      title: '提示',
      content: e,
    })
  },
  // 图片
  uploadPhoto(e) {
    var status = e.currentTarget.dataset.status;
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var returnDate = function(res) {
          that.setData({
            photo: res.data
          });

        }
        network.Upload('/uploadPictureFileToJson', tempFilePaths, returnDate)
      }
    })
  },
  // 表单收集
  formSubmit: function(e) {
    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/ //电话号码正则表达式验证
    var phone = e.detail.value.phone.replace(/\s/g, "") //去掉空格
    if (e.detail.value.activityName == '') {
      this.showmodel('活动名称不能为空')
    } else if (e.detail.value.name == '') {
      this.showmodel('请输入姓名或单位')
    } else if (phone == '') {
      this.showmodel('请输入发起人电话')
    } else if (!phoneReg.test(phone)) {
      this.showmodel('请输入正确电话号码')
    } else if (this.data.addressId == '') {
      this.showmodel('请选择活动地点')
    } else if (e.detail.value.number == '' || e.detail.value.number ==0) {
      this.showmodel('请输入0以上的活动名额')
    } else if (e.detail.value.activityDetail == '') {
      this.showmodel('请输入活动详情')
    } else {
      // 企业活动
      if (this.data.indivadualShow == false) {
        console.log('发布企业活动')
        let doSuccess = function(res) {
          if (res.data.code == 200) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#39b54a',
              success: function(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              },
            })
          }
          wx.hideLoading();
        };
        var params = new Object()
        params.userId = this.data.userId
        params.activityTitle = e.detail.value.activityName.replace(/(^\s*)|(\s*$)/g, "")
        params.activityLaunchUserName = e.detail.value.name.replace(/(^\s*)|(\s*$)/g, "")
        params.activityLaunchUserPhone = phone
        params.addressId = this.data.addressId
        params.activityStartTime = this.data.InitiationActivities
        params.activityEndTime = this.data.EndActivity
        params.activityRegisterStartTime = this.data.RegistrationTime
        params.activityRegisterEndTime = this.data.RegistrationDeadline
        params.activityContent = e.detail.value.activityDetail.replace(/(^\s*)|(\s*$)/g, "")
        params.activityImg = this.data.photo
        params.activityPeopleQuota = e.detail.value.number
        params.roleId = parseInt(this.data.role)

        params.activityType = 0
        if (this.data.switchFee == false) {
          params.isFee = '0'
          params.contacts = ''
          params.contacts_phone = ''
          params.contacts_postal_address = ''
          params.contacts_postal_code = ''
          params.registrationFee = ''
          params.publicAccount = ''
          params.isRequireInvoice = '0'
        } else {
          params.isFee = '1'
          params.registrationFee = this.data.activityFee
          params.publicAccount = this.data.account
          if (this.data.fee == true) {
            //  需要发票
            params.isRequireInvoice = '1'
            params.contacts = this.data.people
            params.contactsPhone = this.data.phoneNumber
            params.contactsPostalAddress = this.data.emailAddress
            params.contactsPostalCode = this.data.emailNumber
          } else if (this.data.fee == false) {
            params.isRequireInvoice = '0'
            params.contacts = ''
            params.contactsPhone = ''
            params.contactsPostalAddress = ''
            params.contactsPostalCode = ''
          }
        }
        network.POST('/companyActivity/lauComActivity', params, doSuccess)
      } else {
        // 发起个人活动
        let doSuccess = function(res) {
          if (res.data.code == 200) {
            wx: wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#39b54a',
              success: function(res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              },
            })
          }
          wx.hideLoading();
        };
        var params = new Object()
        params.userId = this.data.userId
        params.activityTitle = e.detail.value.activityName
        params.activityLaunchUserName = e.detail.value.name
        params.activityLaunchUserPhone = phone
        params.addressId = this.data.addressId
        params.activityStartTime = this.data.InitiationActivities
        params.activityEndTime = this.data.EndActivity
        params.activityRegisterStartTime = this.data.RegistrationTime
        params.activityRegisterEndTime = this.data.RegistrationDeadline
        params.activityContent = e.detail.value.activityDetail
        params.activityImg = this.data.photo
        params.isFee = '0'
        params.activityPeopleQuota = e.detail.value.number
        network.POST('/personalActivity/launchActivity', params, doSuccess)

      }
    }

  },
  fee: function(e) {
    // 0费用，1对公账号，2邮寄地址，3邮政编码，4联系人，5联系电话
    if (e.target.dataset.index == 0) {
      this.setData({
        activityFee: e.detail.value,
      })
    } else if (e.target.dataset.index == 1) {
      this.setData({
        account: e.detail.value,
      })
    } else if (e.target.dataset.index == 2) {
      this.setData({
        emailAddress: e.detail.value,
      })
    } else if (e.target.dataset.index == 3) {
      this.setData({
        emailNumber: e.detail.value,
      })
    } else if (e.target.dataset.index == 4) {
      this.setData({
        people: e.detail.value,
      })
    } else if (e.target.dataset.index == 5) {
      this.setData({
        phoneNumber: e.detail.value
      })
    }
  },
  // 滑动事件
  bindChange: function(e) {
    const val = e.detail.value
    // 获取天数
    days = getDays(val[0] + 2017, val[1] + 1);
    if (this.data.timeStatus == 1) {
      this.setData({
        bindchangeStatus1: 1,
      })
    }
    if (this.data.timeStatus == 0) {
      this.setData({
        bindchangeStatus: 1,
      })
    }
    if (this.data.timeStatus == 2) {
      this.setData({
        bindchangeStatus2: 1,
      })
    }
    if (this.data.timeStatus == 3) {
      this.setData({
        bindchangeStatus3: 1,
      })
    }
    this.setData({
      days: days,
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
      hour: this.data.hours[val[3]],
      minute: this.data.minutes[val[4]],
      second: this.data.seconds[val[5]]
    })

  },
  onReady: function() {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    })
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      // show: show
    })
  },
  //移动按钮点击事件
  translate: function(e) {
    this.setData({
      timeStatus: e.currentTarget.dataset.index,
      showM: true
    })
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    animationEvents(this, moveY, show);
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    wx: wx.stopPullDownRefresh(); //停止刷新操作
  },
  //隐藏弹窗浮层
  hiddenFloatView() {
    var date = this.data.year + '-' + this.data.month + '-' + this.data.day + ' ' + this.data.hour + ':' + this.data.minute + ':' + this.data.second;
    moveY = 200;
    show = true;
    t = 0;
    this.setData({
      showM: false
    })
    if (this.data.timeStatus == 0) {
      if (this.data.bindchangeStatus == 0) {
        var date = this.data.firstDate1
      }
      if (date >= this.data.RegistrationDeadline) {
        this.showmodel('报名开始时间必须小于报名截止时间')
      } else if (date < this.data.startTime) {
        this.showmodel('报名开始时间不能小于当前时间')
      } else {
        this.setData({
          RegistrationTime: date
        })
      }
    } else if (this.data.timeStatus == 1) {
      if (this.data.bindchangeStatus1 == 0 && this.data.RegistrationTime != this.data.firstDate1) {
        var date = this.data.firstDate1
      } else if (this.data.RegistrationTime == this.data.firstDate1 && this.data.bindchangeStatus1 == 0) {
        this.showmodel('报名截止时间不能等于报名开始时间')
      }
      if (this.data.RegistrationTime >= date) {
        this.showmodel('报名截止时间必须大于报名开始时间')
      } else if (date < this.data.startTime) {
        this.showmodel('报名截止时间不能小于当前时间')
      } else {
        this.setData({
          RegistrationDeadline: date
        })
        // 活动截止时间
      }
    } else if (this.data.timeStatus == 2) {

      var date = this.data.year + '-' + this.data.month + '-' + this.data.day + ' ' + this.data.hour + ':' + this.data.minute + ':' + this.data.second;
      if (this.data.bindchangeStatus2 == 0 && this.data.EndActivity != this.data.firstDate1) {
        var date = this.data.firstDate1
      }
      if (date >= this.data.EndActivity) {
        this.showmodel('活动开始时间不能大于活动结束时间')
      } else if (date < this.data.startTime) {
        this.showmodel('活动开始时间不能小于当前时间')
      } else {
        this.setData({
          InitiationActivities: date
        })
      }
    } else if (this.data.timeStatus == 3) {
      if (this.data.bindchangeStatus3 == 0 && this.data.InitiationActivities != this.data.firstDate1) {
        var date = this.data.firstDate1
      } else if (this.data.InitiationActivities == this.data.firstDate1 && this.data.bindchangeStatus3 == 0) {
        this.showmodel('活动结束时间不能等于活动报名开始时间')
      }
      if (this.data.InitiationActivities >= date) {
        this.showmodel('活动结束时间不能活动报名开始时间')
      } else if (date < this.data.startTime) {
        this.showmodel('活动结束时间不能小于当前时间')
      } else {
        this.setData({
          EndActivity: date
        })
      }
    }



  },
  // ------------------- 分割线 --------------------
  chooseSezi: function(e) {
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
    }, 100)
  },
  hideModal: function(e) {
    if (e.currentTarget.dataset.index == 0) {
      // 重置费用表单数据
      this.setData({
        activityFee: '',
        account: '',
        emailAddress: '',
        emailNumber: '',
        people: '',
        phoneNumber: '',
        switchFee: false,
      })
    }
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
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
    }, 100)
  },


  //页面滑至底部事件
  onReachBottom: function() {
    // Do something when page reach bottom.
  }
})
//动画事件
function animationEvents(that, moveY, show) {
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  })
  that.animation.translateY(moveY + 'vh').step()
  that.setData({
    animation: that.animation.export(),
    show: show
  })

}
//输入年、月计算当月天数
var getDays = function(year, month) {
  // month 取自然值，从 1-12 而不是从 0 开始
  var dayCount = new Date(year, month, 0).getDate();
  // 如果 month 按 javascript 的定义从 0 开始的话就是
  // return new Date(year, month + 1, 0).getDate()

  var tempDays = [];
  for (let i = 1; i <= dayCount; i++) {
    i = zeroPadding(i);
    tempDays.push(i)
  }
  return tempDays;
}

// 自动补零
function zeroPadding(i) {
  return ('0' + i).slice(-2);
  // return (Array(2).join(0) + i).slice(-2);
}


//获取当前年月日时分秒
function getNowDate(date) {
  nowYear = date.getFullYear();
  nowMonth = date.getMonth() + 1;
  nowDay = date.getDate();
  nowHour = date.getHours();
  nowMinute = date.getMinutes();
  nowSecond = date.getSeconds();
}

// 反向传值
function nav_back(that) {
  var rewriteTime = that.data.year + "-" + that.data.month + "-" + that.data.day + " " + that.data.hour + ":" + that.data.minute + ":" + that.data.second;

  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1]; //当前页面
  var prevPage = pages[pages.length - 2]; //上一个页面

  //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
  if (cellId == "21") {
    prevPage.setData({
      starTime: rewriteTime
    })
  } else if (cellId == "22") {
    prevPage.setData({
      endTime: rewriteTime
    })
  }
  var a = ''
}