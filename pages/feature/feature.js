var network = require("../data/request.js")
Page({
  data: {
    photo: [],
    photo2: [],
    photo3: [],
    picture: [],
    picture2: [],
    picture3: [],
    activityId: '',
    tapIndex: 0,
    tapIndex2: 0,
    tapIndex3: 0,

    title: '',
    articleContent: '',
    articleImg: '',
    userId: '',

  },
  onLoad: function(options) {
    this.setData({
      activityId: options.activityId
    })

    var that = this
    wx.getStorage({
      key: 'UserDto',
      success: function(res) {
        that.setData({
          userId: res.data.data.userId
        })
      },
    })


  },
  formSubmit: function(e) {
    console.log('打印',e)
    var title = e.detail.value.textName.replace(/(^\s*)|(\s*$)/g, ""),
      detail = e.detail.value.detail.replace(/(^\s*)|(\s*$)/g, ""),
      detail2 = e.detail.value.detail2.replace(/(^\s*)|(\s*$)/g, ""),
      detail3 = e.detail.value.detail3.replace(/(^\s*)|(\s*$)/g, ""), //去前后空格
      status = e.detail.target.dataset.id

    if (!title) {
      this.showmodel('请输入文章标题')
    } else if (!detail && !detail2 && !detail3) {
      this.showmodel('请至少输入一段花絮详情')
    } else if ((!(this.data.photo.length != 0) && detail) || ((this.data.photo.length != 0) && !detail)) {
      this.showmodel('请输入相对应的文字或图片')
    } else if ((!(this.data.photo2.length != 0) && detail2) || ((this.data.photo2.length != 0) && !detail2)) {
      this.showmodel('请输入相对应的文字或图片')
    } else if ((!(this.data.photo3.length != 0) && detail3) || ((this.data.photo3.length != 0) && !detail3)) {
      this.showmodel('请输入相对应的文字或图片')
    } else {
      var params = new Object();
      params.articleTitle = title + '';
      params.showmodel = detail + '';
      params.showmodel1 = detail2 + '';
      params.showmodel2 = detail3 + '';
      params.photo = this.data.picture;
      params.photo2 = this.data.picture2;
      params.photo3 = this.data.picture3;

      wx.setStorage({
        key: 'featureDetail',
        data: params,

      })

      console.log('东西喜喜', status)
      if (status == 1) { //提交
        var params1 = new Object();
        params1.articleTitle = title;
        params1.userId = this.data.userId;
        params1.activityId = this.data.activityId;
        //处理内容
        var contentArr = []
        if (detail) {
          contentArr.push(detail)
        }
        if (detail2) {
          contentArr.push(detail2)
        }
        if (detail3) {
          contentArr.push(detail3)
        }
        params1.articleContent = contentArr.join('-');

        //处理图片
        var photoArr = []
        if (this.data.photo) {
          photoArr.push(this.data.photo)
        }
        if (this.data.photo2) {
          photoArr.push(this.data.photo2)
        }
        if (this.data.photo3) {
          photoArr.push(this.data.photo3)
        }
        for (var i in photoArr) {
          photoArr[i] = photoArr[i].join('-')
        }
        for (var j in photoArr) {
          if (!photoArr[j]) {
            photoArr.splice(j, 1)
          }
        }
        params1.articleImg = photoArr.join('*');
        console.log(params1.articleContent)
        console.log(params1.articleImg)
        network.POST('/activityArticle/publishActivityArticle', params1, this.success)
      } else if (status==2) {
        console.log('尽力啊')
        wx.navigateTo({
          url: '../featureDetail/featureDetail?index=' + 0
        })
      }
    }


  },

  success: function(res) {
    if (res.data.code == 200) {
      wx.showModal({
        title: '提示',
        content: '提交花絮成功,等待管理员审核',
        showCancel: false,
        cancelColor: '#68c0f2',
        success: function(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index'
            })
          }
        },
      })
    }
  },

  //预览或提交
  // submit: function(e) {
  //   this.setData({
  //     status: e.currentTarget.dataset.id
  //   })
  // },


  // 选择图片
  uploadPhoto(e) {
    var that = this;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;

        if (e.currentTarget.dataset.status == 0) {
          //判断是否第一次选图
          var tapIndex = that.data.tapIndex
          if (tapIndex > 0) {
            that.setData({
              photo: []
            })
          }
          tapIndex++
          that.setData({
            picture: tempFilePaths,
            tapIndex
          })
          //遍历上传的图片
          for (var i in tempFilePaths) {
            var imgList = []
            imgList.push(tempFilePaths[i])
            network.Upload('/uploadPictureFileToJson', imgList, that.doSuccess)
          }

        } else if (e.currentTarget.dataset.status == 1) {
          //判断是否第一次选图
          var tapIndex2 = that.data.tapIndex2
          if (tapIndex2 > 0) {
            that.setData({
              photo2: []
            })
          }
          tapIndex2++
          that.setData({
            picture2: tempFilePaths,
            tapIndex2
          })
          //遍历上传的图片
          for (var i in tempFilePaths) {
            var imgList = []
            imgList.push(tempFilePaths[i])
            network.Upload('/uploadPictureFileToJson', imgList, that.doSuccess2)
          }
        } else if (e.currentTarget.dataset.status == 2) {
          //判断是否第一次选图
          var tapIndex3 = that.data.tapIndex3
          if (tapIndex3 > 0) {
            that.setData({
              photo3: []
            })
          }
          tapIndex3++
          that.setData({
            picture3: tempFilePaths,
            tapIndex3
          })
          //遍历上传的图片
          for (var i in tempFilePaths) {
            var imgList = []
            imgList.push(tempFilePaths[i])
            network.Upload('/uploadPictureFileToJson', imgList, that.doSuccess3)
          }
        }

      }
    })
  },

  doSuccess: function(res) {
    let photo = this.data.photo
    photo.push(res.data)
    this.setData({
      photo
    })

  },

  doSuccess2: function(res) {
    let photo2 = this.data.photo2
    photo2.push(res.data)
    this.setData({
      photo2
    })

  },

  doSuccess3: function(res) {
    let photo3 = this.data.photo3
    photo3.push(res.data)
    this.setData({
      photo3
    })

  },

  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    wx: wx.stopPullDownRefresh(); //停止刷新操作
  },
  showmodel: function(e) {
    wx: wx.showModal({
      title: '提示',
      content: e,
    })
  }

})