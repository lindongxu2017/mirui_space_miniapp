// pages/discover/discover.js
const app = getApp()
Page({

    data: {
        company: null,
        bannerList: [],
        companyList: [],
        serviceList: []
    },

    onLoad: function(options) {
        this.getCompanyInfo()
        this.getBanner()
        this.getCompanyList()
        this.getServiceList()
    },

    onShow: function() {

    },


    getCompanyInfo () {
        app.fn.ajax('POST', {}, app.api.discover.company, res => {
            this.setData({
                company: res.data
            })
        })
    },

    preview () {
        const self = this
        wx.previewImage({
            current: self.data.company.img_arr[0],
            urls: self.data.company.img_arr
        })
    },

    getBanner () {
        app.fn.ajax('POST', {type: 2}, app.api.discover.banner, res => {
            this.setData({
                bannerList: res.data
            })
        })
    },

    getCompanyList () {
        app.fn.ajax('POST', {
            page: 1,
            limit: 3
        }, app.api.discover.memberCompany, res => {
            this.setData({
                companyList: res.data
            })
        })
    },

    getServiceList () {
        app.fn.ajax('POST', {
            page: 1,
            limit: 4
        }, app.api.discover.serviceList, res => {
            this.setData({
                serviceList: res.data
            })
        })
    },

    onShareAppMessage: function (res) {
        return {
            title: '米瑞空间',
            path: '/pages/discover/discover'
        }
    }
})