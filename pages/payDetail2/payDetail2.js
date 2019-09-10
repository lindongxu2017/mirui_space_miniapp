// pages/payDetail/payDetail.js
const app = getApp()
Page({

	data: {
		info: {},
		isckeck1: true,
		isckeck2: false,
		billID: ''
	},

	onLoad(options) {
		this.data.billID = options.id
	},

	onShow() {
		this.getDetail()
	},

	getDetail() {
		app.fn.ajax('POST', { bill_id: this.data.billID }, app.api.center.billdetail, res => {
			// console.log(res)
			this.setData({
				info: res.data,
				isckeck2: res.data.is_pay_other_fee
			})
		})
	},

	changeStatus() {
		if (!this.data.info.is_pay_all_fee) {
			this.setData({ isckeck1: !this.data.isckeck1 })
		}
	},

	switchStatus() {
		if (!this.data.info.is_pay_other_fee) {
			this.setData({ isckeck2: !this.data.isckeck2 })
		}
	},

	confirm() {
		wx.setStorageSync('billInfo', this.data.info)
		let type = 3
		if (!this.data.isckeck1) {
			wx.showToast({
				title: '请选择您要缴纳的费用',
				icon: 'none'
			});
			return;
		}
		wx.navigateTo({
			url: '/pages/pay/pay?fee_type=' + type,
		})
	}

})