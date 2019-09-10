var app = getApp();
Page({
	data: {
		buildings: [],
		building: '请选择地址',
		building_id: '',
		date: '请选择日期',
		time: '请选择时间',
		name: '',
		tel: '',
	},
	onLoad() {
		app.fn.ajax('POST', {}, app.api.index.getBuilding, res => {
			this.setData({ buildings: res.data });
		});
	},
	input(e) {
		var data = {};
		data[e.currentTarget.dataset.name] = e.detail.value;
		this.setData(data);
	},
	confirm() {
		var building_id = this.data.building_id;
		var date = this.data.date;
		var time = this.data.time;
		var name = this.data.name;
		var tel = this.data.tel;
		var title = '';
		if (!building_id) {
			title = '请选择参观地址';
		} else if (!date) {
			title = '请选择到访日期';
		} else if (!time) {
			title = '请选择到访时间';
		} else if (!name) {
			title = '姓名不能为空';
		} else if (!tel) {
			title = '手机号码不能为空';
		} else {
			app.fn.ajax('POST', {
				uid: app.globalData.userInfo.id,
				name: name,
				tel: tel,
				building_id: building_id,
				date: date + ' ' + time,
			}, app.api.index.insertVisit, res => {
				wx.showToast({
					title: res.msg,
					icon: 'none',
				});
				setTimeout(() => {
					wx.redirectTo({
						url: '/pages/appointmentVisit2/appointmentVisit2',
					});
				}, 1000);
			});
		}
		if (title) {
			wx.showToast({
				title: title,
				icon: 'none',
			});
		}
	},
	dateChange(e) {
		var date = new Date();
		var minDate = date.getFullYear() + '-' + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
		if (new Date(e.detail.value).getTime() < new Date().getTime() && e.detail.value != minDate) {
			wx.showToast({
				title: '不能选择往期时间',
				icon: 'none',
			});
			return;
		}
		this.setData({ date: e.detail.value });
	},
	buildingChange(e) {
		this.setData({
			building: this.data.buildings[e.detail.value].name,
			building_id: this.data.buildings[e.detail.value].id,
		});
	},
	timeChange(e) {
		if (!this.data.date) {
			wx.showToast({
				title: '请先选择到访日期',
				icon: 'none',
			});
			return;
		}

		var date = new Date();
		if (new Date(this.data.date + ' ' + e.detail.value).getTime() < new Date().getTime()) {
			wx.showToast({
				title: '不能选择往期时间',
				icon: 'none',
			});
			return;
		}

		this.setData({ time: e.detail.value });
	},
});