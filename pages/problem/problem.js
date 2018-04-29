//index.js
//获取应用实例
const app = getApp()
var timer;
Page({

  data: {
    cgmsg:'',
    mystore:0,
    flag: true,
    disabled: false,
    startnum: 0,
    Widths: 90,
    problem: {}
  },
  hidemodal: function () {
    
      wx.navigateTo({
        url: '../index/index',
      })
    
    
  },
  checktrue: function (event) {
     
    this.setData({
      disabled: true
    });
    var that = this;
    var tf = parseInt(event.target.dataset.tf);

    if (!tf) {
      this.setData({
        disabled: true
      });
      clearTimeout(timer);
      that.setData({ flag: false, cgmsg:'闯关失败' })
       
    }
    else {
      // 修改分数
      that.setData({
        mystore:that.data.mystore+1,
        startnum:that.data.startnum+1
      });
      clearTimeout(timer);
      wx.getStorage({
        key: 'Plist',
        success: function (res) {
          if (that.data.startnum >= res.data.length) {
            wx.request({
              url: 'https://www.linyidz.cn/bsindex.php/Api/sharetickets',
              data: {
                openid: getApp().globalData.openid
              },
              header: {},
              method: 'GET',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
                that.setData({ flag: false, cgmsg: '闯关成功' })
              },
              fail: function (res) {
                 
              },
              complete: function (res) { },
            })
             
          } else {
            var prob = res.data;
            var count = prob.length;
            //var nums = parseInt(Math.random() * count);

            that.setData({
              Widths: 90,
              problem: prob[that.data.startnum],
              disabled: false
            });
            that.Countdown();
          }

        },
      })
       

    }
  },
  // 倒计时

  onLoad: function (options) {
    var that = this;
    clearTimeout(timer);

    wx.getStorage({
      key: 'Plist',
      success: function (res) {
        var prob = res.data;
        var count = prob.length;
        //var nums = parseInt(Math.random() * count);
        var nums = that.data.startnum;

        that.setData({
          Widths: 90,
          problem: prob[nums],
          disabled: false
        });
        that.Countdown();
      },
    })
  },
  Countdown: function () {
    var that = this;
    timer = setTimeout(function () {
      var Widthss = that.data.Widths - 3;
      if (Widthss < 0) {
        that.setData({ flag: false, cgmsg:'闯关失败' })
        clearTimeout(timer);
      } else {
        that.setData({
          Widths: Widthss
        });
        that.Countdown();
      }
    }, 100);
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
      imageUrl:'/img/a.png',
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
          success: function (res) {
            if (res.data.status) {
              console.log('分享成功');
              wx.navigateTo({
                url: '../index/index',
              })
            }
          },
          fail: function (res) {
            console.log(res);
            wx.navigateTo({
              url: '../index/index',
            })
          },
          complete: function (res) { },
        })
      },
      fail: function (res) {
        console.log(res);
        wx.navigateTo({
          url: '../index/index',
        })
      }
    }
  }
})

