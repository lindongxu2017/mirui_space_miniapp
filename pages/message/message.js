// pages/message/message.js
const app = getApp()
Page({

	data: {
		active: 0,
		personList: [],
		loading1: false,
		finish1: false,
		noData1: false,

		systemList: [],
		loading2: false,
		finish2: false,
		noData2: false
	},

	onShow: function () {
		this.setData({
			personList: [],
			loading1: false,
			finish1: false,
			noData1: false,
		});
		this.getPersonList()
		wx.hideTabBarRedDot({ index: 3 });
	},

	getPersonList() {
		if (this.data.loading1 || this.data.finish1) {
			return
		}
		this.data.loading1 = true
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
			page: Math.ceil(this.data.personList.length / 10) + 1,
			limit: 10
		}, app.api.message.personList, res => {
			this.data.loading1 = false
			this.setData({
				personList: this.data.personList.concat(res.data)
			})
			if (this.data.personList.length >= res.count) {
				this.data.finish1 = true
			}
			var noData1 = false;
			if (this.data.personList.length == 0) noData1 = true;
			this.setData({ noData1: noData1 });
		})
	},

	getSystemList() {
		if (this.data.loading2 || this.data.finish2) {
			return
		}
		this.data.loading2 = true
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
			page: Math.ceil(this.data.systemList.length / 10) + 1,
			limit: 10
		}, app.api.message.systemList, res => {
			this.data.loading2 = false
			this.setData({
				systemList: this.data.systemList.concat(res.data)
			})
			if (this.data.systemList.length >= res.count) {
				this.data.finish2 = true
			}
			var noData2 = false;
			if (this.data.systemList.length == 0) noData2 = true;
			this.setData({ noData2: noData2 });
		})
	},

	onReachBottom: function () {

	},

	onChange(event) {
		// console.log(event.detail.index + 1)
	}
})