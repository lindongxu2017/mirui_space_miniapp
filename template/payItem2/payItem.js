var app = getApp();
Component({
    properties: {
		item: {
			type: Object,
			value: {},
		},
		type: {
			type: Number,
			value: 3,
		},
    },
    methods: {
		del(e) {
            const self = this
            wx.showModal({
                title: '提示',
                content: '是否取消该预约',
                success(res) {
                    if (res.confirm) {
                        app.fn.ajax('POST', {
                            uid: app.globalData.userInfo.id,
                            subscribe_room_id: e.currentTarget.dataset.id,
                        }, app.api.center.appointmentDel, res => {
                            self.triggerEvent('del');
                        });
                    } else if (res.cancel) {
                        // console.log('用户点击取消')
                    }
                }
            })
		},
        pay (e) {
            wx.setStorageSync('roomInfo', this.data.item)
            wx.navigateTo({
                url: '/pages/pay/pay?room_id=' + e.currentTarget.dataset.id,
            })
        }
    },
});