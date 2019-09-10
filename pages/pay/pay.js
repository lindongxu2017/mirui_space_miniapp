const app = getApp()
Page({

    data: {
        info: {},
        typeList: [],
        selectValText: '请选择',
        selectVal: 0,
        radio: '2',
        preViewList: [],
        imgs: [],
        room_id: '',
        billInfo: null,
        fee_type: '',


		// account: '',
		// company_name: '',
		// open_bank: '',

		companyArr: [],

		disable: false,
    },

    onLoad: function (options) {
		console.log(options, 11111111);
		this.setData(options);

        if (wx.getStorageSync('billInfo')) {
            this.setData({
                billInfo: wx.getStorageSync('billInfo'),
				radio: wx.getStorageSync('billInfo').pay_type == 1 ? '2' : '3',
            });
            this.getCoupons();
            wx.removeStorageSync('billInfo');
        }

        if (wx.getStorageSync('roomInfo')) {
            this.setData({ info: wx.getStorageSync('roomInfo') })
        }

		app.fn.ajax('POST', { uid: app.globalData.userInfo.id }, app.api.center.getPublicConfig, res => {
			this.setData({
				companyArr: res.data
			});
		});
    },

    onShow: function () {

    },

    getCoupons () {
        let postData = {
            uid: app.globalData.userInfo.id,
            bill_id: this.data.billInfo.bill_id
        }
        if (this.data.fee_type) {
            postData.fee_type = this.data.fee_type
        }
        app.fn.ajax('POST', postData, app.api.center.useCoupons, res => {
            this.setData({
                typeList: res.data
            })
        })
    },

    bindPickerChange(event) {
        // console.log(event.detail)
        var val = event.detail.value
        this.setData({
			selectValText: this.data.typeList[val].coupon_str,
            selectVal: this.data.typeList[val].id
        })
    },

    onChange (e) {
        // console.log(e)
    },

    onClick (e) {
        // console.log(e)
        let val = e.currentTarget.dataset.name
        this.setData({ radio: val })
    },

    uploadImg() {
        const self = this
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                let arr = self.data.preViewList.concat(tempFilePaths)
                self.setData({ preViewList: arr })
				wx.showLoading({
					title: '上传中...',
				});
				self.setData({ disable: true });
                self.upload(tempFilePaths)
            }
        })
    },

    upload(arr) {
        const self = this
        wx.uploadFile({
            url: app.requestApi + '/Base/uploadOnePic', // 仅为示例，非真实的接口地址
            filePath: arr[0],
            name: 'image',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                const data = JSON.parse(res.data)
                let imgArr = [].concat(self.data.imgs)
                imgArr.push(data.src)
                self.setData({ imgs: imgArr })
                arr.shift()
                if (arr.length > 0) {
                    self.upload(arr)
                } else {
					wx.hideLoading();
					self.setData({disable: false});
				}
            }
        })
    },

    preview(e) {
        const self = this
        let index = e.currentTarget.dataset.index
        wx.previewImage({
            current: self.data.preViewList[index], // 当前显示图片的http链接
            urls: self.data.preViewList // 需要预览的图片http链接列表
        })
    },

    del(e) {
        let index = e.currentTarget.dataset.index
        let arr = [].concat(this.data.preViewList)
        arr.splice(index, 1)
        let imgArr = [].concat(this.data.imgs)
        imgArr.splice(index, 1)
        this.setData({
            preViewList: arr,
            imgs: imgArr
        })
    },

    confirm () {
        // 场地预约
        if (this.data.room_id) {
            app.fn.ajax('POST', {
                subscribe_room_id: this.data.room_id,
                pay_type: this.data.radio
            }, app.api.index.rommPay, res => {
				if (this.data.radio == 1) {
					wx.setStorageSync('roomPay', 1)
					wx.redirectTo({
						url: '/pages/myAppointment/myAppointment',
					})
					return;
				}
                // console.log(res)
                wx.requestPayment({
                    timeStamp: res.data.time,
                    nonceStr: res.data.nonce_str,
                    package: res.data.package,
                    signType: 'MD5',
                    paySign: res.data.paySign,
                    success(response) {
                        // console.log(response)
                        wx.setStorageSync('roomPay', 1)
                        wx.redirectTo({
                            url: '/pages/myAppointment/myAppointment',
                        })
                    },
                    fail (error) {
                        // console.log(error)
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none'
                        })
                        setTimeout(() => {
                            wx.redirectTo({
                                url: '/pages/myAppointment/myAppointment',
                            })
                        }, 1500)
                    }
                })
            })
        }

        // 缴费单支付

        if (this.data.billInfo) {
            let postData = {
                uid: app.globalData.userInfo.id,
                user_coupon_id: this.data.selectVal,
                bill_id: this.data.billInfo.bill_id
            }

            if (this.data.radio == 3) {
                postData.img_arr = this.data.imgs.join(',')
            }

            if (this.data.fee_type) {
                postData.fee_type = this.data.fee_type
            }

            if (this.data.radio == 2) { // 微信支付
                app.fn.ajax('POST', postData, app.api.center.billWxPay, res => {
                    // console.log(res)
                    if (res.data) {
						wx.requestPayment({
							timeStamp: res.data.time,
							nonceStr: res.data.nonce_str,
							package: res.data.package,
							signType: 'MD5',
							paySign: res.data.paySign,
							success(response) {
								// console.log(response)
								// wx.setStorageSync('billPay', true)
								wx.showToast({
									title: '支付成功',
									icon: 'none',
								});
								setTimeout(() => {
									wx.redirectTo({
										url: '/pages/myPay/myPay',
									});
								}, 1000);
							},
							fail(error) {
								wx.showToast({
									title: '支付失败',
									icon: 'none'
								})
							}
						})
					} else {
						wx.showToast({
							title: '支付成功',
							icon: 'none',
						});
						setTimeout(() => {
							wx.redirectTo({
								url: '/pages/myPay/myPay',
							});
						}, 1000);
					}
                })
            } else { // 对公转账
                if (this.data.imgs.length == 0) {
                    wx.showToast({
                        title: '请上传图片',
                        icon: 'none'
                    })
                    return
                }
                app.fn.ajax('POST', postData, app.api.center.billPublicPay, res => {
                    wx.showToast({
                        title: '请等待后台审核',
                        icon: 'none'
                    })
                    // wx.setStorageSync('billPay', true)
                    setTimeout(() => {
                        wx.redirectTo({
							url: '/pages/myPay/myPay',
						});
                    }, 1000);
                })
            }
        }
    }

})