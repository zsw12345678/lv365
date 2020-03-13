var network = require("../data/request.js")
Page({
  data: {
    status: '',
    photo: '',
    photo1: ''
  },
  // 更新图片
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
        var b = tempFilePaths.join("-");
        that.setData({
          status: e.currentTarget.dataset.status
        })

        // 上传企业营业执照0；上传对接人工作证明1；
        if (status == 0) {
          network.Upload('/uploadPictureFileToJson', tempFilePaths, that.returnDate)
        } else {
          network.Upload('/uploadPictureFileToJson', tempFilePaths, that.returnDate)
        }

      }
    })
  },

  returnDate: function(res) {

    if (res.code == 200) {
      if (this.data.status == 0) {
        var b = res.data.split(',');

        this.setData({
          photo: b
        })
      } else if (this.data.status == 1) {
        var b = res.data.split(',');
        this.setData({
          photo1: b
        })
      }
      wx.showToast({
        title: '上传成功', //提示文字
        duration: 2000, //显示时长
        mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
        icon: 'success', //图标，支持"success"、"loading"  
      })
    } else {
      wx.showToast({
        title: '上传失败请重新上传', //提示文字
        duration: 2000, //显示时长
        mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
        icon: 'success', //图标，支持"success"、"loading"  
      })
    }

  },
  formSubmit: function(e) {
    var params = new Object()

 

    params.companyName = e.detail.value.enterprise
    params.linkmanName = e.detail.value.workerName
    params.emergencyPhone = e.detail.value.workerNumber
    params.businessLicenseImg = this.data.photo[0]
    params.employeeLicenseImg = this.data.photo1[0]

    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/ //电话号码正则表达式验证
    let phone = e.detail.value.workerNumber.replace(/\s/g, "") //去掉空格

    var doSuccess = function(res) {};
    doSuccess = function(res) {
      if (res.data.code == 200) {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          cancelText: '取消',
          cancelColor: '#ccc',
          confirmText: '确认',
          confirmColor: '#39b54a',
          success: function(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index/index',
              })
            }
          },
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.msg,
        })
      }
      wx.hideLoading();

    };


    if (e.detail.value.enterprise == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入企业名称',
      })
    } else if (e.detail.value.workerName == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入姓名',
      })
    } else if (e.detail.value.workerNumber == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入电话',
      })
    } else if (this.data.photo == '') {
      wx.showToast({
        icon: 'none',
        title: '您还没上传企业营业执照',
      })
    } else if (this.data.photo1 == '') {
      wx.showToast({
        icon: 'none',
        title: '您还没上传对接人工作证明',
      })
    } else if (!phoneReg.test(phone)) {
      wx.showToast({
        icon: 'none',
        title: '电话号码输入有误'
      })
    } else {
      network.POST('/company/certify', params, doSuccess)
    }

  },


  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    wx: wx.stopPullDownRefresh(); //停止刷新操作
  },
  cancel: function(e) {

    if (e.currentTarget.dataset.cancel == 0) {
      this.setData({
        photo: ''
      })
    } else if (e.currentTarget.dataset.cancel == 1) {
      this.setData({
        photo1: ''
      })
    }
  }
})