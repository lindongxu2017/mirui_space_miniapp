var app = getApp();
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

		list4: [],
		loading4: false,
		noData4: false,

		type: 3,

		index: 0,
	},
	onChange(e) {
		this.setData({ type: e.detail.index == 0 ? 3 : e.detail.index == 3 ? 4 : e.detail.index });
		this.getList();
	},
	onLoad() {
        if (wx.getStorageSync('roomPay')) {
            wx.removeStorageSync('roomPay');
            this.setData({
				type: 1,
				index: 1,
			});
        }
		this.getList();
	},
	onReachBottom() {
		this.getList();
	},
	getList() {
		var listName = 'list' + this.data.type;
		var loadingName = 'loading' + this.data.type;
        var noData = 'noData' + this.data.type;
		if (this.data[loadingName]) return;
		this.data[loadingName] = true;
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
			page: Math.ceil(this.data[listName].length / 10) + 1,
			limit: 10,
			type: this.data.type,
		}, app.api.center.myAppointmentList, res => {
			var data = {};
			this.data[listName] = this.data[listName].concat(res.data);
			data[listName] = this.data[listName];
			if (this.data[listName].length < res.count) this.data[loadingName] = false;
			data[noData] = false;
			if (res.count == 0) data[noData] = true;
			this.setData(data);
		});
	},
	del(e) {
		var listName = 'list' + e.currentTarget.dataset.type;
		this.data[listName].splice(e.currentTarget.dataset.index, 1);
		var data = {};
		data[listName] = this.data[listName];
		this.setData(data);
	},
});