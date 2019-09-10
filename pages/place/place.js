// pages/place/place.js
const app = getApp()
Page({

    data: {
        list: [],
        type: '',
        lat: '',
        lng: '',
        loading: false,
        noData: false,

		nextTitle: '',
    },

    onLoad(options) {
        wx.setNavigationBarTitle({
			title: options.title,
		});
		this.setData({nextTitle: options.nextTitle});
		const self = this
        self.data.type = options.type
        if (app.latitude) {
            self.data.lat = app.latitude
            self.data.lng = app.longitude
            self.getlist()
        } else {
            wx.getLocation({
                type: 'wgs84',
                complete(res) {
					app.latitude = res.latitude ? res.latitude : 39;
					app.longitude = res.longitude ? res.longitude : 116;
                    self.data.lat = app.latitude
                    self.data.lng = app.longitude
                    self.getlist()
                },
            })
        }
    },

    onShow: function () {
        wx.removeStorageSync('roomInfo')
    },
    
    getlist () {
        if (this.data.loading) {
            return
        }
        this.data.loading = true
        app.fn.ajax('POST', {
            page: Math.ceil(this.data.list.length / 10) + 1,
            limit: 10,
            type: this.data.type,
            lat: this.data.lat,
            lng: this.data.lng
        }, app.api.index.roomList, res => {
            // console.log(res)
            this.data.loading = false
            this.setData({
                list: this.data.list.concat(res.data)
            })
            if (this.data.list.length >= res.count) {
                this.data.loading = true
            }
            if (this.data.list.length == 0) {
                this.setData({
                    noData: true
                })
            }
        })
    },

    onReachBottom: function () {
        this.getlist()
    }
})