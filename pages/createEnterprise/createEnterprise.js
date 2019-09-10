var app = getApp();
Page({
	data: {
		name: '',
		id: '',
		btnTxt: '创建',
	},
	input(e) {
		this.setData({ name: e.detail.value });
	},
	onLoad(options) {
		if (options.id) {
			this.setData({
				id: options.id,
				btnTxt: '保存',
				name: options.name,
			});
			wx.setNavigationBarTitle({
				title: '编辑企业',
			});
		}
	},
	submit() {
		var api = app.api.center.createEnterprise;
		var data = { uid: app.globalData.userInfo.id };
		if (this.data.id) {
			api = app.api.center.editEnterprise;
			data.company_id = this.data.id;
			data.name = this.data.name;
		} else {
			data.company_name = this.data.name;
		}
		if (!data.company_name) {
			wx.showToast({
				title: '企业名称不能为空',
				icon: 'none',
			});
			return;
		}
		app.fn.ajax('POST', data, api, res => {
			wx.showToast({
				title: this.data.id ? '修改成功' : '创建成功',
				icon: 'none',
			});
			setTimeout(() => {
				wx.navigateBack();
			}, 1000);
		});
	},
});