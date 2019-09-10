var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({

    data: {
        info: null,
        type: '',
        id: ''
    },

    onLoad: function (options) {
        if (options.type) {
            this.data.type = options.type
        }
        if (options.id) {
            this.getDetail(options.id)
            this.data.id = options.id
        }
    },

    onShow: function () {

    },

    onShareAppMessage () {
        return {
            title: this.data.info.name,
            path: '/pages/serviceDetail/serviceDetail?id=' + this.data.id
        }
    },

    getDetail (id) {
        app.fn.ajax('POST', {
            business_id: id
        }, app.api.discover.serviceDetail, res => {
            this.setData({
                info: res.data
            }, () => {
                WxParse.wxParse('article', 'html', this.data.info.content, this, 5);
            })
        })
    }
})