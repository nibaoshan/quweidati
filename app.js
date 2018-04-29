//app.js
App({
  
  globalData: {
    openid:'',
    userInfo: null
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that=this;
    // 登录
    wx.login({
      success: res => {
        //console.log(res);
        wx.request({
          url: 'https://www.linyidz.cn/dzxcxApi.php/TmpApi/getUserOpenId',
          data:{
            code:res.code,
            appid:'wxcc662605af452cb8',
            secret:'bcd3e6def86c16f61c4e795103086ec3'
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            //console.log(res);
            that.globalData.openid=res.data.openid
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
         
        //if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            
            success: res => {
               
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
       // }
      }
    })
  }
})