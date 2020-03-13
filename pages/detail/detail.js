var network = require("../data/request.js")
const app = getApp();

Page({

  data: {
    captionArr: ['活动名称', '活动时间', '活动地址', '主办单位'],
    detailObject: {},
    index: 0, //活动列表索引
    status: 0, //详情标记
    activityId: 0, //活动id
    activityType: 0, //活动类型

    // 修改浮窗
    chooseSize: false,
    animationData: {},

    modalName: null, //抽屉
    joinTotal: 13,
    pageSize: 13,
    pageNumber: 1,
    participatorArr: [], //参与者数据
    distanceTime: '', //距离活动开始时间

    phoneArr: [], //参与者加密的号码集合

    userId: '',
    isSponsor: false,

    pageId: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.pageId) {
      var pageId = options.pageId
      this.setData({
        pageId
      })
    }
    var status = options.status,
      activityId = parseInt(options.activityId)
    this.setData({
      status,
      activityId
    })

    var that = this
    wx.getStorage({
      key: 'UserDto',
      success: function (res) {
        that.setData({
          userId: res.data.data.userId
        })
      },
    })


    //请求数据
    var params = new Object()
    params.activityId = activityId
    network.POST('/activity/ActivityDetail', params, this.doSuccess)
  },

  // 加载数据
  doSuccess: function (res) {

    if (res.data.code == 200 || res.data.code == 0) {
      this.setData({
        detailObject: res.data.data,
        activityType: parseInt(res.data.data.activityType)
      })
      this.calculateTime(res.data.data.activityStartTime)
    }
    if (this.data.userId == res.data.data.userId) {
      this.setData({
        isSponsor: true
      })
    }
  },

  //点击跳转到报名页面
  apply: function (e) {
    this.chooseSezi();
  },
  chooseSezi: function (e) {
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
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  makesure: function (e) {
    this.hideModal();
    this.setData({
      price: ''
    })
  },
  hideModal: function (e) {
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
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
  },


  // 提交表单数据
  formSubmit: function (e) {
    //对表单数据进行判断

    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/ //电话号码正则表达式验证
    let name = e.detail.value.userName.replace(/\s/g, "") //去掉空格
    let phone = e.detail.value.userPhone.replace(/\s/g, "") //去掉空格
    let beizhu = e.detail.value.beizhu
    if (!name) {
      wx: wx.showToast({
        icon: 'none',
        title: '请输入姓名'
      })
      return false
    }
    else if (!phone) {
      wx: wx.showToast({
        icon: 'none',
        title: '请输入电话号码'
      })
      return false
    }
    else if (!phoneReg.test(phone)) {
      wx: wx.showToast({
        icon: 'none',
        title: '电话号码输入有误'
      })
      return false
    }

    else {
      //报名活动
      var params2 = new Object()
      params2.registrationName = name //名字
      params2.registrationPhone = phone //电话
      params2.registrationRemark = beizhu
      params2.activityId = this.data.activityId //活动id
      params2.userId = this.data.userId //用户id

      if (parseInt(this.data.detailObject.activityType) == 0) {
        //企业报名
        network.POST('/register/companyActivity', params2, this.doSuccess2)
      } else {
        //个人报名
        network.POST('/register/personalActivity', params2, this.doSuccess2)
      }
    }

  },

  //加载数据
  doSuccess2: function (res) {
    wx.hideLoading();
    // 200是无需费用的企业活动
    if (res.data.code == 200) {
      wx.showModal({
        title: '提示',
        content: res.data.msg,
        showCancel: false,
        cancelColor: '#ccc',
        confirmColor: '#39b54a',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index'
            })
          }
        },
      })

    }
    // 201是需费用的企业活动
    else if (res.data.code == 201) {
      var that = this;
      var params = new Object()
      params.activityId = this.data.activityId
      var doSuccess = function (res) {
        wx.requestPayment({
          "appId": "wxcbed4a63560eb970",
          "timeStamp": res.data.data.timeStamp,
          "nonceStr": res.data.data.nonceStr,
          "package": res.data.data.package,
          "signType": res.data.data.signType,
          "paySign": res.data.data.paySign,
          "success": function (res) {
            wx.switchTab({
              url: '../index/index'
            })
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              cancelColor: '#ccc',
              confirmColor: '#39b54a',
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              },
            })
          },
          "fail": function (res) {

            var th = that;
            var params1 = new Object()
            var ac = th.data.activityId;
            var id = parseInt(th.data.userId);
            params1.activityId = ac
            params1.userId = id
            var doSuccess1 = function (res) {

              // if (res.data.code == 200) {
              //   wx.showModal({
              //     title: '提示',
              //     content: res.data.msg,
              //     showCancel: false,
              //     cancelColor: '#ccc',
              //     confirmColor: '#39b54a',
              //     success: function(res) {
              //       if (res.confirm) {
              //         wx.switchTab({
              //           url: '../index/index'
              //         })
              //       }
              //     },
              //   })
              // }
            }
            network.POST('/wechat/findWechatOrderStatus', params1, doSuccess1)

          }
        })
      };
      network.POST('/wechat/prepay', params, doSuccess)
    }
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    wx: wx.stopPullDownRefresh(); //停止刷新操作
  },
  // 取消活动
  cancelActivity: function () {
    var that = this
    wx.showModal({
      title: '确定取消吗',
      content: '您确定要取消该活动吗？',
      success(res) {
        if (res.confirm) {
          var params3 = new Object()
          params3.activityId = that.data.activityId
          params3.userId = that.data.userId
          network.POST('/activity/cancelActivity', params3, that.doSuccess3)
        } else if (res.cancel) {

        }
      }
    })
  },
  doSuccess3: function (res) {
    wx.hideLoading();
    if (res.data.code == 200 || res.data.code == 0) {
      wx.showModal({
        title: '提示',
        content: res.data.msg,
        showCancel: false,
        cancelColor: '#ccc',
        confirmColor: '#39b54a',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index'
            })
          }
        },
      })
    } else {
      wx.showModal({
        title: '提示',
        content: res.data.msg,
        showCancel: false,
        cancelColor: '#ccc',
        confirmColor: '#39b54a',
      })
    }
  },

  //退出活动
  exitActivity: function () {
    var that = this
    wx.showModal({
      title: '确定退出吗',
      content: '退出该活动后将无法重新报名,您确定要退出吗？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      confirmColor: '#39b54a',
      success: function (res) {
        if (res.confirm) {
          var params4 = new Object()
          params4.activityId = that.data.activityId
          params4.userId = that.data.userId
          network.POST('/register/quitActivity', params4, that.doSuccess4)
        } else if (res.cancel) {

        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  doSuccess4: function (res) {

    wx.hideLoading();
    if (res.data.code == 200 || res.data.code == 0) {
      wx.showModal({
        title: '提示',
        content: res.data.msg,
        showCancel: false,
        cancelColor: '#ccc',
        confirmColor: '#39b54a',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index'
            })
          }
        },
      })
    } else if (res.data.code == 201) {

      // 活动需付费则去申请退款
      var doSuccess = function (res) {

        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          cancelColor: '#ccc',
          confirmColor: '#39b54a',
          success: function (res) {

            if (res.confirm) {
              wx.switchTab({
                url: '../index/index'
              })
            }
          },
        })

      }
      var params4 = new Object()
      params4.activityId = this.data.activityId
      network.POST('/wechat/refund', params4, doSuccess)


    } else {
      wx.showModal({
        title: '提示',
        content: res.data.msg,
        showCancel: false,
        cancelColor: '#ccc',
      })
    }
  },

  // 点击获取现参与人数信息
  showModal1(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      pageNumber: 1
    })
    this.LoadingListData2(1)
  },
  //加载数据
  LoadingListData2: function (pageNumber) {
    var params5 = new Object()
    params5.activityId = this.data.activityId
    params5.limit = this.data.pageSize + ''
    params5.page = pageNumber + ''
    network.POST('/register/getParticipantListByActivityId', params5, this.doSuccess5)
  },
  doSuccess5: function (res) {
    wx.hideLoading();
    if (res.data.code == 200 || res.data.code == 0) {
      if (this.data.pageNumber == 1) {
        this.setData({
          participatorArr: res.data.data,
          joinTotal: res.data.count
        })
      } else {
        let listArr = this.data.participatorArr
        for (let i = 0; i < res.data.data.length; i++) {
          listArr.push(res.data.data[i])
        }
        this.setData({
          participatorArr: listArr,
          joinTotal: res.data.count
        })
      }
    }

    //仅处理加入的数据
    if (this.data.status == 0 || this.data.status == 2) {
      //对参与者手机号码进行加密
      this.encryptPhone(this.data.participatorArr)
    }
  },
  // 触底事件
  onReachBottom: function () {
    var allPageNum = this.data.joinTotal / this.data.pageSize
    //考虑少于pageSize的最后一页
    if (this.data.joinTotal % this.data.pageSize != 0)
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
      this.LoadingListData2(pageNumber)
    } else {
      wx.showToast({
        title: '已经到底部啦',
        duration: 2000
      })
    }
  },
  //隐藏抽屉
  hideModal1(e) {
    this.setData({
      modalName: null
    })
  },

  //计算时间差的函数
  calculateTime: function (d1) {
    var dateBegin = new Date(d1.replace(/-/g, "/")); //将-转化为/，使用new Date
    var dateNow = new Date(); //获取当前时间
    var dateDiff = dateBegin.getTime() - dateNow.getTime() //时间差的毫秒数
    //计算出相差天数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))
    //计算出小时数
    var leave1 = dateDiff % (24 * 3600 * 1000)
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)
    var minutes = Math.floor(leave2 / (60 * 1000))
    if (dateDiff <= 0) {
      this.setData({
        distanceTime: ''
      })
    } else {
      this.setData({
        distanceTime: dayDiff + "天" + hours + "小时" + minutes + "分"
      })
    }
  },

  //对参与者手机号码进行加密
  encryptPhone: function (array) {
    let phoneArr = []
    for (let i = 0; i < array.length; i++) {
      phoneArr[i] = array[i].registrationPhone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")
    }
    this.setData({
      phoneArr
    })

  },

  //发布花絮
  publish: function () {
    wx.navigateTo({
      url: '../feature/feature?activityId=' + this.data.activityId
    })
  },

  //返回前一个页面设置值
  returnPre: function () {
    if (this.data.pageId == 222) {
      wx.setStorageSync('discount', 100)
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  //分享功能
  onShareAppMessage: function (res) {
    let name = this.data.detailObject.activityTitle
    return {
      title: name,
      path: '/pages/login/login?ID=234' + '&activityId=' + this.data.activityId,
      imageUrl: this.data.detailObject.activityImg //分享图片 宽高比 5:4
    }
  },

})