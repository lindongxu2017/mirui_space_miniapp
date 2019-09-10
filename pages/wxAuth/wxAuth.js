var app = getApp()
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad(option) {
        // console.log(this.data.canIUse)
    },
    bindGetUserInfo(res) {
        if (res.detail.errMsg == 'getUserInfo:ok') {
            // app.globalData.userInfo = res.detail.userInfo
            wx.navigateBack({
                success() {
                    app.fn.login()
                }
            })
        } else {
            wx.showToast({
                title: '授权失败！',
                icon: 'none',
                duration: 2000
            })
        }
    }
})