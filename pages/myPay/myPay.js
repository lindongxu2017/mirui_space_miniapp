// pages/myPay/myPay.js
const app = getApp()
Page({

    data: {
        list1: [],
        loading1: false,
        noData1: false,
        list2: [],
        loading2: false,
        noData2: false,
        list3: [],
        loading3: false,
        noData3: false,
        active: 0
    },

    onLoad: function (options) {
        this.getlist()
    },

    onShow: function () {
        if (wx.getStorageSync('billPay')) {
            this.setData({
                list1: [],
                loading1: false,
                list2: [],
                loading2: false,
                list3: [],
                loading3: false,
                active: 0
            })
            this.getlist()
            wx.removeStorageSync('billPay')
        }
    },
    getlist () {
        let api = app.api.center.bills
        let type = ''
        let page = 1
        let loading = false
//        console.log(this.data.active)
        switch(this.data.active) {
            case 0:
                type = 1
                loading = this.data.loading1
                page = Math.ceil(this.data.list1.length / 10) + 1
                break
            case 1:
                type = 2
                loading = this.data.loading2
                page = Math.ceil(this.data.list2.length / 10) + 1
                break
            case 2:
                type = 3
                loading = this.data.loading3
                page = Math.ceil(this.data.list3.length / 10) + 1
                break
        }
        let postData = {
            uid: app.globalData.userInfo.id,
            limit: 10,
            page, type
        }
//        console.log(1111, loading)
        if (loading) {
            return
        }
        switch (this.data.active) {
            case 0:
                this.data.loading1 = true
                break
            case 2:
                this.data.loading2 = true
                break
            case 1:
                this.data.loading3 = true
                break
        }
        app.fn.ajax('POST', postData, app.api.center.bills, res => {
            switch (this.data.active) {
                case 0:
                    this.data.loading1 = false
                    this.setData({ list1: this.data.list1.concat(res.data) })
                    if (this.data.list1.length >= res.count) {
                        this.data.loading1 = true
                    }
					var noData1 = false;
                    if (this.data.list1.length == 0) noData1 = true;
					this.setData({ noData1: noData1 });
                    break
                case 1:
                    this.data.loading2 = false
                    this.setData({ list2: this.data.list2.concat(res.data) })
                    if (this.data.list2.length >= res.count) {
                        this.data.loading2 = true
                    }
					var noData2 = false;
					if (this.data.list2.length == 0) noData2 = true;
					this.setData({ noData2: noData2 });
                    break
                case 2:
                    this.data.loading3 = false
                    this.setData({ list3: this.data.list3.concat(res.data) })
                    if (this.data.list3.length >= res.count) {
                        this.data.loading3 = true
                    }
					var noData3 = false;
					if (this.data.list3.length == 0) noData3 = true;
					this.setData({ noData3: noData3 });
                    break
            }
        })

    },

    onReachBottom: function () {
        this.getlist()
    },
    
    onChange (e) {
        this.setData({
            active: e.detail.index
        })
//      console.log(e.detail.index, this.data.list2.length, this.data.list3.length)
        if (e.detail.index == 1 && this.data.list2.length == 0) {
            this.data.loading2 = false
            this.getlist()
        }
        if (e.detail.index == 2 && this.data.list3.length == 0) {
            this.data.loading3 = false
            this.getlist()
        }
    }
})