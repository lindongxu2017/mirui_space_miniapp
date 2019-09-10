// pages/suggestion/suggestion.js
const app = getApp()
Page({

    data: {
        textareaVal: ''
    },

    onLoad: function (options) {

    },

    onShow: function () {
        // suggest
    },

    textInput (event) {
        let text = event.detail.value
        this.setData({
            textareaVal: text
        })
    },

    confirm () {
        if (this.data.textareaVal == '')　{
            wx.showModal({
                title: '提示',
                content: '请输入投诉内容',
                showCancel: false
            })
            return
        }
        app.fn.ajax('POST', {
            uid: app.globalData.userInfo.id,
            content: this.data.textareaVal
        }, app.api.index.suggest, res => {
            // console.log(res)
            wx.showToast({
                title: '提交成功',
                duration: 1000,
                icon: 'none',
                success () {
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 1000)
                }
            })
        })
    }
})