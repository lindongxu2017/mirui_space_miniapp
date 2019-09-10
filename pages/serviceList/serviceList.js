// pages/serviceList/serviceList.js
const app = getApp()
Page({

    data: {
        serviceList: [],
        finish: false,
        type: 2
    },

    onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: options.title,
		});
        // console.log(options.type)
        this.setData(options);
        this.getServiceList()
    },

    onShow: function () {

    },

    onReachBottom: function () {
        this.getServiceList()
    },


    getServiceList() {
        let api = app.api.discover.memberCompany
        if (this.data.type == 2) {
            api = app.api.discover.serviceList
        }
        if (this.data.finish) {
            return false
        }
        app.fn.ajax('POST', {
            page: Math.ceil(this.data.serviceList / 10) + 1,
            limit: 10
        }, api, res => {
            this.setData({
                serviceList: res.data
            }, () => {
                if (this.data.serviceList >= res.count) {
                    this.data.finish = true
                }
            })
        })
    },

    onShareAppMessage: function (res) {
        return {
            title: '米瑞空间',
            path: '/pages/serviceList/serviceList'
        }
    }
})