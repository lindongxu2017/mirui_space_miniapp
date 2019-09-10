var app = getApp();
Page({
	data: {
		time: '',
		building: '',
		name: '',
		tel: '',
		reserve_id: '',
	},
	onLoad() {
		app.fn.ajax('POST', { uid: app.globalData.userInfo.id }, app.api.index.getVisit, res => {
			this.setData({
				reserve_id: res.data.reserve_id,
				name: res.data.name,
				tel: res.data.tel,
				building: res.data.building_name,
				time: res.data.time,
			});
		});
	},
	confirm() {
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
			reserve_id: this.data.reserve_id,
		}, app.api.index.cancelVisit, res => {
			wx.showToast({
				title: res.msg,
				icon: 'none',
			});
			setTimeout(() => {
				wx.navigateBack();
			}, 1000);
		});
	},
});