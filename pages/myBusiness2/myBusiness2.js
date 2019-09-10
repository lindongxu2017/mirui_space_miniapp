var app = getApp();
Page({
	data: {
		txt: '',
		company_name: '',
		type: '',
	},
	onShow() {
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
		}, app.api.center.myBusiness, res => {
			this.setData({
				txt: res.type == 0 ? '您还没有加入企业' : res.type == 1 ? '' : res.type == 2 ? '您的申请已提交，请等待您的BOSS审核' : '您的申请已被拒绝',
				company_name: res.type == 1 ? res.data.company_name : '',
				type: res.type,
			});
		});
	},
	quit() {
		wx.showModal({
			title: '提示',
			content: '您确认要退出' + this.data.company_name + '吗？',
			success: res => {
				if (res.confirm) {
					app.fn.ajax('POST', {
						uid: app.globalData.userInfo.id,
					}, app.api.center.quitEnterprise, res => {
						wx.showToast({
							title: '退出成功',
							icon: 'none',
						});
						this.onShow();
					});
				}
			},
		});
	},
});