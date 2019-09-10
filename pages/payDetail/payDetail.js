// pages/payDetail/payDetail.js
const app = getApp()
Page({

    data: {
        info: {},
		isckeck1 : true,
        isckeck2: true,
        billID: '',

		increment: '',
    },

    onLoad(options) {
        this.setData({
			billID: options.id,
		});
    },

    onShow() {
		
		this.getDetail();
    },

    getDetail () {
        app.fn.ajax('POST', { bill_id: this.data.billID }, app.api.center.billdetail, res => {
            // console.log(res)
			var data = res.data;
            this.setData({
                info: data,
				other_fee_len: Object.keys(data.other_fee).length,
				// isckeck1 : data.is_pay_room_fee,
                // isckeck2: data.is_pay_other_fee,
				increment: data.total - data.rent - data.water_fee - data.electric_fee - data.property_fee,
            });
        })
    },

    changeStatus () {
        if (!this.data.info.is_pay_room_fee) {
            this.setData({ isckeck1: !this.data.isckeck1 })
        }
    },

    switchStatus () {
        if (!this.data.info.is_pay_other_fee) {
            this.setData({ isckeck2: !this.data.isckeck2 })
        }
    },

    confirm () {
		console.log(this.data.info, 1111);

        wx.setStorageSync('billInfo', this.data.info)
        let type = ''
		if (this.data.isckeck1 && !this.data.info.is_pay_room_fee) {
            type = 1
        }
		if (this.data.isckeck2 && !this.data.info.is_pay_other_fee) {
            type = 2
        }
		if (this.data.isckeck1 && !this.data.info.is_pay_room_fee && this.data.isckeck2 && !this.data.info.is_pay_other_fee) {
            type = 3
        }

		if (this.data.increment == 0) type = 3;

		if (!(this.data.isckeck1 && !this.data.info.is_pay_room_fee || this.data.isckeck2 && !this.data.info.is_pay_other_fee)) {
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