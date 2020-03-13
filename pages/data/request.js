/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 *doSuccess：成功的回调函数
 */
function POST(url, params, doSuccess) {
  let token = wx.getStorageSync('token');
  let header;
  if (token) {
    header = {
      'content-type': 'application/x-www-form-urlencoded',
      'token': token
    };
  } else {
    header = {
      'content-type': 'application/json'
    };
  }
  var url = url;
  // wx: wx.showLoading({
  //   title: '加载中',
  // })
  wx.request({
    url: getApp().data.host + url,
    header: header,
    data: params,
    method: 'POST',
    success: function(res) {
      if (res.data.code == 200 || res.data.code == 0 || res.data.code == 201) {
        //访问成功
        doSuccess(res)
        // wx.hideLoading()
      } else if (res.data.code == 400 || res.data.code == 403) {
        console.log(res)
        wx.request({
          url: getApp().data.host + '/checkToken',
          header: header,
          method: 'GET',
          success: function(res) {
            console.log(res)
            if (res.data.code == 0 || res.data.code == 200 || res.data.code == 201) {
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '请求失败',
              })
            } else {
              wx.login({
                success: function(res) {
                  var js_code = res.code
                  //发送请求
                  wx.request({
                    url: getApp().data.host + '/wechat/login',
                    data: {
                      js_code: js_code,
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success(res) {
                      if (res.data.code != 200) {
                        wx.hideLoading()
                        wx.showModal({
                          title: '提示',
                          content: '请求失败',
                        })
                      } else {
                        wx.setStorageSync('token', res.data.msg)
                        wx.setStorageSync('UserDto', res.data)
                        let header = {
                          'content-type': 'application/x-www-form-urlencoded',
                          'token': res.data.msg
                        };
                        wx.request({
                          url: getApp().data.host + url,
                          header: header,
                          data: params,
                          method: 'POST',
                          success: function(res) {
                            console.log('二次请求成功', res)
                            if (res.statusCode == 200) {
                              wx.hideLoading() //访问成功
                              doSuccess(res)
                            } else {
                              wx.showModal({
                                title: '提示',
                                content: '请求失败',
                                showCancel: false
                              })
                            }
                          }
                        })
                      }



                    }
                  })
                }
              })
            }

          },
          fail: function(res) {

            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '请求失败',
            })
          }

        })

      } else {
        wx: wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: res.data.msg,
        })
      }

    },
    fail: function() {
      wx.showModal({
        title: '提示',
        content: '请求失败',
        success: function(res) {
          if (res.confirm) {
            console.log('开启')
          } else {
            console.log('用户点击取消')
          }
        }
      })


    },
  })
}

//GET请求，不需传参，直接URL调用，
function GET(url, doSuccess) {
  let token = wx.getStorageSync('token');
  let header;
  if (token) {
    header = {
      'content-type': 'application/json',
      'token': token
    };
  } else {
    header = {
      'content-type': 'application/json'
    };
  }
  wx.request({
    url: getApp().data.host + url,
    header: header,
    method: 'GET',
    success: function(res) {
      if (res.data) {
        if (res.data.code == 200 || res.data.code == 0 || res.data.code == 201) {
          //访问成功
          doSuccess(res)
        } else if (res.data.code == 400 || res.data.code == 403) {
          wx.request({
            url: getApp().data.host + '/checkToken',
            header: header,
            method: 'GET',
            success: function(res) {
              if (res.data.code == 0 || res.data.code == 200 || res.data.code == 201) {
                wx.showModal({
                  title: '提示',
                  content: '请求失败',
                })
              } else {
                wx.login({
                  success: function(res) {
                    var js_code = res.code
                    //发送请求
                    wx.request({
                      url: getApp().data.host + '/wechat/login',
                      data: {
                        js_code: js_code,
                      },
                      method: 'POST',
                      header: {
                        'content-type': 'application/json',
                        // 默认值，
                      },
                      success(res) {
                        if (res.data.code != 200) {
                          wx.showModal({
                            title: '提示',
                            content: '请求失败',
                            showCancel: false
                          })
                        } else {
                          wx.setStorageSync('token', res.data.msg)
                          wx.setStorageSync('UserDto', res.data)
                          let header = {
                            'content-type': 'application/x-www-form-urlencoded',
                            'token': res.data.msg
                          };
                          wx.request({
                            url: getApp().data.host + url,
                            header: header,
                            method: 'GET',
                            success: function(res) {
                              console.log(res)
                              if (res.statusCode == 200) { //访问成功
                                doSuccess(res)
                              } else {
                                wx: wx.hideLoading()
                                wx.showModal({
                                  title: '提示',
                                  content: '请求失败',
                                  showCancel: false
                                })
                              }
                            }
                          })
                        }



                      }
                    })
                  }
                })
              }
            },
            fail: function() {
              wx.showModal({
                title: '提示',
                content: '请求失败',
                showCancel: false
              })
            },
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }

      }
    }
  })
}

//Upload请求，不需传参，直接URL调用，
function Upload(url, tempFilePaths, doSuccess) {
  let token = wx.getStorageSync('token');
  var tempFilePaths = tempFilePaths;
  var url = url
  let header;
  if (token) {
    header = {
      'content-type': 'application/json',
      'token': token
    };
  } else {
    header = {
      'content-type': 'application/json',
    };
  }
  wx.showLoading({
    title: '上传中',
  })
  wx.uploadFile({
    url: getApp().data.host + url,
    header: header,
    filePath: tempFilePaths[0],
    name: 'file',
    // formData: params,
    success(res) {
      var a = JSON.parse(res.data)
      if (a.code == 0 || a.code == 200 || res.data.code == 201) {
        wx: wx.hideLoading()
        doSuccess(a)
      }
      else if (a.code == 400 || a.code == 403) {
        wx.request({
          url: getApp().data.host + '/checkToken',
          header: header,
          method: 'GET',
          success: function(res) {
            if (res.data.status == 0) {
              wx.showModal({
                title: '提示',
                content: '请求失败',
              })
              wx: wx.hideLoading()
            } else {
              wx.login({
                success: function(res) {
                  var js_code = res.code
                  //发送请求
                  wx.request({
                    url: getApp().data.host + '/login_wechat',
                    data: {
                      js_code: js_code,
                    },
                    header: {
                      'content-type': 'application/json',
                      // 默认值，
                    },
                    success(res) {
                      if (res.data.status != 0) {
                        wx.showModal({
                          title: '提示',
                          content: '请求失败',
                        })
                        wx: wx.hideLoading()
                      } else {
                        wx.setStorageSync('token', res.data.msg)
                        wx.setStorageSync('UserDto', res.data)
                        let header = {
                          'content-type': 'application/x-www-form-urlencoded',
                          'token': res.data.msg
                        };
                        wx.uploadFile({
                          url: getApp().data.host + url,
                          header: header,
                          filePath: tempFilePaths,
                          name: 'file',
                          formData: params,
                          success(res) {
                            console.log(res)
                            wx: wx.hideLoading()
                            if (res.statusCode == 200) { //访问成功
                              res.data = JSON.parse(res.data)
                              doSuccess(res)
                            }
                          },
                          fail(res) {
                            wx: wx.hideLoading()
                          }
                        })
                      }



                    }
                  })
                }
              })
            }
          },
          fail: function() {
            wx: wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '请求失败',
              showCancel: false
            })
          },
        })
      } else {
        wx: wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: a.msg,
          showCancel: false
        })
      }

    },
    fail: function() {
      wx: wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '请求失败',
        showCancel: false
      })
    }

  })
}
//Download请求
function Download(tempFilePaths, doSuccess) {
  let token = wx.getStorageSync('token');
  var tempFilePaths = tempFilePaths;
  let header;
  if (token) {
    header = {
      'content-type': 'application/json',
      'token': token
    };
  } else {
    header = {
      'content-type': 'application/json'
    };
  }
  wx: wx.showLoading({
    title: '下载中',
    mask: true,
  })
  wx.downloadFile({
    url: tempFilePaths,
    header: header,
    success(res) {
      doSuccess(res)
      // wx.saveFile({
      //   tempFilePath: res.tempFilePath,
      //   success(res) {
      //     console.log('保存',res)
      //     wx: wx.showModal({
      //       title: '提示',
      //       content: '下载成功，该文件' + res.savedFilePath + '已保存到微信文件夹',
      //     })
      //     wx.hideLoading()
      //     console.log(res)
      //     const savedFilePath = res.savedFilePath
      //   },
      //   fail(res) {
      //     wx: wx.showModal({
      //       title: '提示',
      //       content: '保存到本地存储失败',
      //     })
      //     wx.hideLoading()
      //   }
      // })

      //   FileSystemManager.saveFile({
      //   tempFilePath: res.tempFilePath,
      //   filePath:fs.writeFileSync(`${wx.env.USER_DATA_PATH}/hello.txt`, 'hello, world', 'utf8'),
      //   success(res) {
      //     console.log('保存',res)
      //     wx: wx.showModal({
      //       title: '提示',
      //       content: '下载成功，该文件' + res.savedFilePath + '已保存到微信文件夹',
      //     })
      //     wx.hideLoading()
      //     console.log(res)
      //     const savedFilePath = res.savedFilePath
      //   },
      //   fail(res) {
      //     wx: wx.showModal({
      //       title: '提示',
      //       content: '保存到本地存储失败',
      //     })
      //     wx.hideLoading()
      //   }
      // })
    },
    fail(res) {
      wx: wx.showModal({
        title: '提示',
        content: '下载失败',
      })
      wx.hideLoading()
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST,
  Upload: Upload,
  Download: Download
}