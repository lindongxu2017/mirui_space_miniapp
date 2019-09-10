var app = getApp();
Page({
	data: {
		list: [],
		loading: false,
		noData: false,
	},
	onLoad() {
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	getList() {
		if (this.data.loading) return;
		this.data.loading = true;
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
			page: Math.ceil(this.data.list.length / 10) + 1,
			limit: 10,
		}, app.api.index.activityList, res => {
			this.data.list = this.data.list.concat(res.data);
			var data = { list: this.data.list };
			if (this.data.list.length < res.count) this.data.loading = false;
			if (res.count == 0) data.noData = true;
			this.setData(data);
		});
	},
});