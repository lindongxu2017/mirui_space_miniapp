// pages/myContract/myContract.js
const app = getApp()
Page({

    data: {
        list: [],
        loading: false,
        noData: false
    },

    onLoad: function (options) {
        this.getList()
    },

    onShow: function () {

    },

    getList () {
        if (this.data.loading || this.data.finish) {
            return
        }
        this.data.loading = true
        app.fn.ajax('POST', {
            uid: app.globalData.userInfo.id
        }, app.api.center.contract, res => {
            this.data.loading = false;
            this.setData({
                list: this.data.list.concat(res.data)
            })
            if (this.data.list.length == 0) {
                this.setData({
                    noData: true
                })
            }
        })
        
    },

    onReachBottom: function () {

    }
})