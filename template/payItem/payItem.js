const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
	properties: {
		itemInfo: {
			type: Object,
			value: null,
			observer: function (newVal, oldVal, changePath) {
				this.setData({
					info: newVal
				})
			}
		}
	},

    /**
     * 组件的初始数据
     */
	data: {
		info: {},
		shouju: '',
		look: false,
	},

    /**
     * 组件的方法列表
     */
	methods: {
		toPay() {
			var fee_type = 0;
			if (!this.data.info.is_pay_room_fee) fee_type += 1;
			if (!this.data.info.is_pay_other_fee) fee_type += 2;
			if (this.data.info.bill_type == 2) fee_type = 3;
			wx.setStorageSync('billInfo', this.data.info);
			wx.navigateTo({
				url: '/pages/pay/pay?fee_type=' + fee_type,
			})
		},
		apply() {
			wx.showModal({
				title: '提示',
				content: '您确认要申请收据吗？',
				success: res => {
					if (res.confirm) {
						app.fn.ajax('POST', { bill_id: this.data.info.bill_id }, '/mybill/applyReceipt', res => {
							this.setData({ 'info.is_receipt': 2 });
						});
					}
				},
			});
		},
		look(e) {
			this.setData({
				shouju: e.currentTarget.dataset.shouju,
				look: true,
			});
		},
		close() {
			this.setData({ look: false });
		},
	},
});