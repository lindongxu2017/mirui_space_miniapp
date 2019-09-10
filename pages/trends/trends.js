// pages/trends/trends.js
const app = getApp()
import store from '../../store'
import create from '../../utils/create'
create(store, {

    data: {
        trendsList: [],
        loading: false,
        showBtn: true,
        noData: false
    },

    onLoad: function(options) {
        if (this.store.data.trendsList.length == 0) {
            this.getList()
        }
    },

    onShow: function() {
        if (wx.getStorageSync('release')) {
            this.setData({
                loading: false,
                trendsList: []
            })
            this.getList()
            wx.removeStorageSync('release')
        }
    },

    onReachBottom: function() {
        this.getList()
    },

    getList () {
        if (this.data.loading) {
            return false
        }
        this.data.loading = true
        app.fn.ajax('POST', {
            uid: app.globalData.userInfo.id,
            page: Math.ceil(this.data.trendsList.length / 10) + 1,
            limit: 10
        }, app.api.trends.list, res => {
            this.data.loading = false
            this.store.data.trendsList = this.store.data.trendsList.concat(res.data)
            this.update()
            if (this.store.data.trendsList.length >= res.count) {
                this.data.loading = true
            }
            if (this.store.data.trendsList.length == 0) {
                this.setData({
                    noData: true
                })
            }
        })
    },

    release (e) {
        // console.log(e.detail)
        this.setData({
            showBtn: e.detail
        })
    }
})