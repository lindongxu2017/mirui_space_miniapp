const app = getApp()
Page({
	data: {
		info: {},
		field: {
			name: '',
			phone: '',
			startDate: '',
			startTime: '',
			endDate: '',
			endTime: '',
			timeSlot: '',
		},
		room_id: '',
		type: 1,

		timeSelectShow: false,
		timeSlots: [],

		selectArr: [],

		timeSelectShow2: false,
		timeSlots2: [],

		minDate: '',

		hour: 0,
	},

	getPhoneNumber(e) {
		var encryptedData = e.detail.encryptedData;
		var iv = e.detail.iv;
		if (encryptedData && iv) {
			app.fn.ajax('POST', {
				encryptedData: encryptedData,
				iv: iv,
				sessionKey: app.globalData.result.session_key,
				uid: app.globalData.userInfo.id,
			}, app.api.index.getPhone, res => {
				this.setData({ 'field.phone': res.data.phoneNumber });
			});
		}
	},

	getTimeSlot(time) {
		this.setData({
			'field.timeSlot': '',
			'field.startTime': '',
			'field.endTime': '',
			'field.endDate': '',
			selectArr: [],
		});
		if (this.data.type == 1) {
			app.fn.ajax('POST', {
				date: time,
				room_id: this.data.room_id,
			}, app.api.index.getTimePeriod, res => {
				var timeSlots = res.data;
				for (var i = 0; i < timeSlots.length; i++) {
					if (timeSlots[i].is_selected && timeSlots[i].is_checked) {
						timeSlots[i].left = true;
						timeSlots[i].right = true;
					} else if (timeSlots[i].is_selected && !timeSlots[i].is_checked) {
						if (timeSlots[i - 1].right) {
							timeSlots[i].left = true;
						} else {
							timeSlots[i].right = true;
						}
					}
				};
				if (timeSlots[timeSlots.length - 1].time == '00:00') timeSlots[timeSlots.length - 1].time = '24:00';
				this.setData({ timeSlots: timeSlots });
			});
		} else {
			app.fn.ajax('POST', {
				date: time,
				room_id: this.data.room_id,
			}, app.api.index.getOpenRoomTimePeriod, res => {
				var timeSlots2 = res.data;
				for (var i = 0; i < timeSlots2.length; i++) {
					timeSlots2[i].name = timeSlots2[i].show_time;
					timeSlots2[i].disabled = timeSlots2[i].is_selected;
				};
				this.setData({ timeSlots2: timeSlots2 });
			});
		}
	},

	onLoad(options) {
		if (wx.getStorageSync('roomInfo')) {
			this.setData({
				info: wx.getStorageSync('roomInfo')
			})
		}

		if (options.type == 3 || options.type == 4) {
			this.setData({
				type: options.type
			})
		}
		if (wx.getStorageSync("name") && wx.getStorageSync("tel")) {
			this.setData({
				'field.name': wx.getStorageSync("name"),
				'field.phone': wx.getStorageSync("tel"),
			});
		}

		this.setData({ room_id: options.id });
	},

	


	inputName(e) {
		// console.log(e.detail)
		this.setData({
			'field.name': e.detail
		})
	},
	inputPhone(e) {
		// console.log(e.detail)
		this.setData({
			'field.phone': e.detail
		})
	},
	bindStartDateChange(e) {
		var date = new Date();
		var minDate = date.getFullYear() + '-' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate())
		if (new Date(e.detail.value).getTime() < new Date().getTime() && e.detail.value != minDate) {
			wx.showToast({
				title: '不能选择往期时间',
				icon: 'none',
			});
			return;
		}
		this.setData({
			'field.startDate': e.detail.value
		})
		this.getTimeSlot(e.detail.value);
	},
	bindEndDateChange(e) {
		this.setData({
			'field.endDate': e.detail.value
		})
	},
	bindStartTimeChange(e) {
		this.setData({
			'field.startTime': e.detail.value,
		});

	},
	bindEndTimeChange(e) {
		this.setData({
			'field.endTime': e.detail.value
		})
	},

	confirm() {

		let num = 0

		for (var key in this.data.field) {
			if (this.data.field[key] == '') {
				num++
			}
		}


		if (num > 0) {
			wx.showToast({
				title: '请完善预约信息',
				icon: 'none'
			})
			return
		}


		let api = app.api.index.teaAppointment
		let postData = {
			uid: app.globalData.userInfo.id,
			room_id: this.data.room_id,
			name: this.data.field.name,
			tel: this.data.field.phone
		}
		// if (this.data.type != 1) {
		// 	postData.type = this.data.type
		// 	postData.time = this.data.field.startDate + ' ' + this.data.field.startTime
		// } else {
		postData.start_time = this.data.field.startDate + ' ' + this.data.field.startTime
		postData.end_time = this.data.field.endDate + ' ' + this.data.field.endTime
		// }

		// if (this.data.type == 1) {
		let start = Math.round(new Date(postData.start_time + ':00').getTime() / 1000)
		let end = Math.round(new Date(postData.end_time + ':00').getTime() / 1000)
		let current = Math.round(new Date().getTime() / 1000)
		// if (end - start < 0.5 * 60 * 60) {
		// 	wx.showToast({
		// 		title: '最短预约时间为0.5小时',
		// 		icon: 'none'
		// 	})
		// 	return
		// }
		// if (end - start > 2 * 60 * 60) {
		// 	wx.showToast({
		// 		title: '预约时长不能超过2小时',
		// 		icon: 'none'
		// 	})
		// 	return
		// }
		// if (end < current) {
		// 	wx.showToast({
		// 		title: '结束时间不能小于当前时间',
		// 		icon: 'none'
		// 	})
		// 	return
		// }
		app.fn.ajax('POST', postData, app.api.index.createOrder, res => {
			wx.setStorageSync("name", this.data.field.name);
			wx.setStorageSync("tel", this.data.field.phone);
			wx.navigateTo({
				url: '/pages/pay/pay?room_id=' + res.id
			})
		})
		// } else {
		// 	app.fn.ajax('POST', postData, app.api.index.roomAppointment, res => {
		// 		// console.log(res)
		// 		wx.showToast({
		// 			title: '预约成功',
		// 			icon: 'none',
		// 			duration: 1000
		// 		})
		// 		setTimeout(() => {
		// 			wx.redirectTo({
		// 				url: '/pages/myReserve/myReserve'
		// 			})
		// 		}, 1000)
		// 	})

		// }

	},
	timeSelect(e) {
		if (!this.data.field.startDate) {
			wx.showToast({
				title: '请先选择预约日期',
				icon: 'none',
			});
			return;
		}
		if (this.data.type == 1) {
			this.setData({ timeSelectShow: true });
		} else {
			this.setData({ timeSelectShow2: true });
		}
	},
	timeSelectConfirm() {
		var timeSlots = this.data.timeSlots;
		var selectArr = this.data.selectArr;
		var date = new Date(new Date(this.data.field.startDate).setDate(new Date(this.data.field.startDate).getDate() + 1));
		var endDate = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate();
		this.setData({
			'field.timeSlot': timeSlots[selectArr[0]].time + ' - ' + (timeSlots[selectArr[1]].time == '00:00' ? '24:00' : timeSlots[selectArr[1]].time),
			'field.startTime': timeSlots[selectArr[0]].time,
			'field.endTime': timeSlots[selectArr[1]].time,
			'field.endDate': timeSlots[selectArr[1]].time == '00:00' ? endDate : this.data.field.startDate,
			timeSelectShow: false,
		});
	},
	onClose() {
		this.setData({ timeSelectShow: false });
	},
	selectTime(e) {
		var index = e.currentTarget.dataset.index;
		var selectArr = JSON.parse(JSON.stringify(this.data.selectArr));
		var timeSlots = JSON.parse(JSON.stringify(this.data.timeSlots));
		if (selectArr.length < 2 || index == selectArr[0] || index == selectArr[1]) {
			timeSlots[index].active = !timeSlots[index].active;
			if (timeSlots[index].active) {
				if (selectArr.length == 1 && index < selectArr[0]) {
					selectArr.unshift(index);
				} else {
					selectArr.push(index);
				}
			} else {
				var val;
				if (selectArr.length == 2 && index == selectArr[0]) val = selectArr[1];
				if (selectArr.length == 2 && index == selectArr[1]) val = selectArr[0];
				selectArr = [];
				if (val) selectArr.push(val);
			}
		} else {
			if (index < selectArr[0] && index < selectArr[1]) {
				timeSlots[selectArr[0]].active = false;
				selectArr[0] = index;
			} else {
				timeSlots[selectArr[1]].active = false;
				selectArr[1] = index;
			}
			timeSlots[index].active = true;
		}
		if (selectArr.length == 2) {
			var flag = false;
			for (var i = selectArr[0] + 1; i < selectArr[1]; i++) {
				if (timeSlots[i].is_selected) {
					flag = true;
					break;
				}
			};
			if (flag) {
				wx.showToast({
					title: '该时间段已包含被预约的时间段',
					icon: 'none',
				});
				return;
			}
		}
		for (var i = 0; i < timeSlots.length; i++) {
			timeSlots[i].selectLeft = false;
			timeSlots[i].selectRight = false;
		};
		var start, end, hour;
		if (selectArr.length == 2) {
			for (var i = 0; i < timeSlots.length; i++) {
				if (i == selectArr[0]) {
					timeSlots[i].rightNotUsed = true;
					timeSlots[i].selectRight = true;
					start = timeSlots[i].time;
				}
				if (i == selectArr[1]) {
					timeSlots[i].leftNotUsed = true;
					timeSlots[i].selectLeft = true;
					end = timeSlots[i].time == '00:00' ? '24:00' : timeSlots[i].time;
				}
				if (i > selectArr[0] && i < selectArr[1]) {
					timeSlots[i].leftNotUsed = true;
					timeSlots[i].rightNotUsed = true;
					timeSlots[i].selectLeft = true;
					timeSlots[i].selectRight = true;
				}
			};
		}
		if (selectArr.length == 2) {
			console.log(start, end);
			hour = end.split(':')[0] - start.split(':')[0] + (end.split(':')[1] - start.split(':')[1]) / 60;
		} else {
			hour = 0;
		}
		console.log(hour);
		this.setData({
			selectArr,
			timeSlots,
			hour, 
		});
	},

	onSelect(e) {
		var hour = e.detail.end_time.split(':')[0] - e.detail.start_time.split(':')[0] + (e.detail.end_time.split(':')[1] - e.detail.start_time.split(':')[1]) / 60;
		this.setData({
			'field.timeSlot': e.detail.show_time,
			'field.startTime': e.detail.start_time,
			'field.endTime': e.detail.end_time,
			'field.endDate': this.data.field.startDate,
			timeSelectShow2: false,
			hour,
		});
	},
	onClose2() {
		this.setData({ timeSelectShow2: false });
	},
});