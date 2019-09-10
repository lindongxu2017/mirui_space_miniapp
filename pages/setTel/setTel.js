var app = getApp();
Page({
	data: {
		txt: '获取',
		newTel: '',
		newCode: '',

		txt2: '获取',
		oldCode: '',
		mobile: '',
		current: 0,

		from: '',
	},
	onLoad(options) {
		if (options.from) this.setData(options);
		if (app.globalData.userInfo.mobile) {
			wx.setNavigationBarTitle({
				title: '更换手机号码',
			});
			this.setData({ mobile: app.globalData.userInfo.mobile });
		}
	},
	input(e) {
		var data = {};
		data[e.currentTarget.dataset.name] = e.detail.value;
		this.setData(data);
	},
	submit() {
		var tel = this.data.newTel;
		var code = this.data.newCode;
		var re = /^[1][3,4,5,6,7,8][0-9]{9}$/;
		var title = '';
		if (tel.length == 0) {
			title = '手机号码不能为空';
		} else if (!re.test(tel)) {
			title = '请输入正确的手机号码';
		} else if (code.length == 0) {
			title = '验证码不能为空';
		} else {
			app.fn.ajax('POST', {
				tel: tel,
				uid: app.globalData.userInfo.id,
				code: code,
			}, app.api.center.bindTel, res => {
				app.globalData.userInfo.mobile = tel;
				if (this.data.from) {
					wx.redirectTo({
						url: this.data.from,
					});
				} else {
					wx.navigateBack();
				}
				wx.showToast({
					title: '绑定成功',
					icon: 'none',
				});
			});
		}
		if (title) {
			wx.showToast({
				title: title,
				icon: 'none',
			});
		}
	},
	getCode(e) {
		if (this.data[e.currentTarget.dataset.key == 'mobile' ? 'txt2' : 'txt'] != '获取') return;
		var data = {};
		var tel = this.data[e.currentTarget.dataset.key];
		var re = /^[1][3,4,5,6,7,8][0-9]{9}$/;
		var title = '';
		if (tel.length == 0) {
			title = '手机号码不能为空';
		} else if (!re.test(tel)) {
			title = '请输入正确的手机号码';
		} else {
			app.fn.ajax('POST', { tel: tel }, app.api.center.getCode, res => {
				wx.showToast({
					title: '发送成功',
					icon: 'none',
				});
				var txt = 60;
				data[e.currentTarget.dataset.key == 'mobile' ? 'txt2' : 'txt'] = txt + 's';
				this.setData(data);
				var timer = setInterval(() => {
					txt--;
					if (txt > 0) {
						data[e.currentTarget.dataset.key == 'mobile' ? 'txt2' : 'txt'] = txt + 's';
						this.setData(data);
					} else {
						clearInterval(timer);
						data[e.currentTarget.dataset.key == 'mobile' ? 'txt2' : 'txt'] = '获取';
						this.setData(data);
					}
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
	next() {
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
			code: this.data.oldCode,
		}, app.api.center.verifyTel, res => {
			this.setData({ current: 1 });
		});
	},
	verify() {
		var tel = this.data.newTel;
		var code = this.data.newCode;
		var re = /^[1][3,4,5,6,7,8][0-9]{9}$/;
		var title = '';
		if (tel.length == 0) {
			title = '手机号码不能为空';
		} else if (!re.test(tel)) {
			title = '请输入正确的手机号码';
		} else if (code.length == 0) {
			title = '验证码不能为空';
		} else {
			app.fn.ajax('POST', {
				uid: app.globalData.userInfo.id,
				mobile: tel,
				code: this.data.oldCode,
				newCode: code,
			}, app.api.center.editTel, res => {
				app.globalData.userInfo.mobile = tel;
				wx.navigateBack();
				wx.showToast({
					title: '更换成功',
					icon: 'none',
				});
			});
		}
		if (title) {
			wx.showToast({
				title: title,
				icon: 'none',
			});
		}
	},
});