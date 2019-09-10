var app = getApp();
Page({
	data: {
		list: [],
	},
	timer: null,
	input(e) {
		clearTimeout(this.timer);
		if (!e.detail.value) {
			this.setData({ list: [] });
			return;
		}
		this.timer = setTimeout(() => {
			app.fn.ajax('POST', {
				uid: app.globalData.userInfo.id,
				keyword: e.detail.value,
			}, app.api.center.searchBusiness, res => {
				this.setData({ list: res.data });
			});
		}, 500);
	},
	join(e) {
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
			company_id: e.currentTarget.dataset.id,
		}, app.api.center.joinEnterprise, res => {
			wx.showToast({
				title: '申请成功',
				icon: 'none',
			});
            setTimeout(() => {
                wx.navigateBack()
            }, 1500)
		});
	},
});