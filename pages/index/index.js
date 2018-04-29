//logs.js
const util = require('../../utils/util.js')
var times;
Page({
  data: {
    flag:true,
    status:true,
    protext: '开始',
    number: 3,
    pagestatus:false
  },
  hidemodal:function(){
    this.setData({
      flag:true
    });
  },
  starts: function () {
    console.log(getApp().globalData.openid);
   var that=this;
    wx.request({
      url: 'https://www.linyidz.cn/bsindex.php/Api/gettickets',
      data: {
        openid: getApp().globalData.openid
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.status)
        {
          if (that.data.status) {
            that.Countime();
            that.setData({
              status: false
            });
          }
        }
        else{
          that.setData({
            flag:false
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })

    
    
  },
  Countime: function () {
    var that = this;
    var nums = that.data.number;
    times = setTimeout(function () {
      var nnum = that.data.number - 1
      if (nnum < 0) {
        clearTimeout(times);
        wx.navigateTo({
          url: '../problem/problem',
        })
      } else {
        that.setData({
          protext: nums,
          number: nnum
        });
        that.Countime();
      }


    }, 1000);

  },
  onShow:function(){
    if(getApp().globalData.openid=='')
    {
      wx.showToast({
        title: '请求中...',
        duration:3000,
        icon:'loading'
      })
    }
  },
  onLoad: function () {
    if (getApp().globalData.openid == '') {
      wx.showToast({
        title: '...请求中...',
        duration: 5000,
        icon: 'loading'
      })
    }
    console.log(getApp().globalData.openid);
    var that=this;
    
    wx.request({
      url: 'https://www.linyidz.cn/bsindex.php/Api/getproblem',
      data: {
        uid: 1
      },
      header: {},
      method: 'GET',
      success: function (res) {
       // console.log(res.data);
        wx.setStorage({
          key: 'Plist',
          data: res.data,
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })

    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  onShareAppMessage: function (res) {
    var that=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '快来趣味答题',
      path: '/pages/index/index',
      imageUrl: '/img/a.png',
      success: function (res) {
        wx.request({
          url: 'https://www.linyidz.cn/bsindex.php/Api/sharetickets',
          data: {
            openid: getApp().globalData.openid
          },
          header: {},
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            if(res.data.status)
            {
              console.log('分享成功');
              that.setData({
                flag:true
              });
            }
          },
          fail: function(res) {
            that.setData({
              flag: true
            });
          },
          complete: function(res) {},
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
