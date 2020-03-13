// pages/featureDetail/featureDetail.js
var network = require("../data/request.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    featureDetailObject: '',
    arr: [], //正文几段

    imgArr: [],

    articleId: 0,

    status: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('discount1', '')

    let index = parseInt(options.index)
    let articleId = parseInt(options.articleId)
    this.setData({
      articleId
    })
    // 0是预览
    if (index == 0) {
      var that = this;
      wx.getStorage({
        key: 'featureDetail',
        success: function(res) {
          that.setData({
            featureDetailObject: res.data
          })

          var arr = new Array();
          arr.push({
            detail: res.data.showmodel,
            photo: res.data.photo,
          }, {
            detail: res.data.showmodel1,
            photo: res.data.photo2,
          }, {
            detail: res.data.showmodel2,
            photo: res.data.photo3,
          })
          that.setData({
            arr: arr,
          })

        },
      })
      // 1是查看
    } else if (index == 1) {
      var params = new Object()
      params.articleId = articleId
      var that = this
      var doSuccess = function(res) {
        var content = res.data.data.articleContent.split("-")
        var photo = res.data.data.articleImg.split("*")
        var arr = new Array()
        for (var i = 0; i < content.length; i++) {
          arr.push({
            detail: content[i],
            photo: photo[i].split("-")
          })
        }
        let obj = res.data.data
        obj.articlePublishTime = obj.articlePublishTime.split(" ")[0]

        that.setData({
          arr: arr,
          featureDetailObject: obj
        })

        //将所有图片集合在imgArr中
        let imgArr = []
        for (let i in arr) {
          for (let j in arr[i].photo) {
            imgArr.push(arr[i].photo[j])
          }
        }
        that.setData({
          imgArr
        })
      };
      network.POST('/activityArticle/ActivityArticleDetail', params, doSuccess);
      this.setData({
        status: index
      })
    }

  },

  //图片点击事件
  imgYu: function(e) {
    let url = e.currentTarget.dataset.src
    wx.previewImage({
      current: url, //当前图片地址
      urls: this.data.imgArr, //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //分享功能
  onShareAppMessage: function(res) {
    let name = this.data.featureDetailObject.articleTitle
    return {
      title: name,
      path: '/pages/login/login?pageId=123' + '&articleId=' + this.data.articleId,
      imageUrl: this.data.imgArr[0] //分享图片 宽高比 5:4
    }
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {
    wx: wx.stopPullDownRefresh(); //停止刷新操作
  },


})