// pages/placeDetail/placeDetail.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({

    data: {
        info: {},
        room_id: '',
        type: ''
    },

    onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: options.title,
		});
        // console.log(options)
        if (options.id) {
            this.setData({
                room_id: options.id,
                type: options.type
            })
            this.getdetail()
        }
    },

    onShow: function () {
        
    },

    getdetail () {
        app.fn.ajax('POST', {
            room_id: this.data.room_id
        }, app.api.index.roomDetail, res => {
            // console.log(res)
            this.setData({
                info: res.data
            }, () => {
                WxParse.wxParse('article', 'html', this.data.info.introduce, this, 5);
                wx.setStorageSync('roomInfo', res.data)
            })
        })
    },
})