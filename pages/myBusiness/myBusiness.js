var app = getApp();
Page({
	data: {
		list: [],
	},
	onClose(e) {
		var position = e.detail.position;
		var id = e.currentTarget.dataset.id;
		var index = e.currentTarget.dataset.index;
		var name = e.currentTarget.dataset.name;
		if (position == 'cell') {
			wx.navigateTo({
				url: '/pages/staffList/staffList?id=' + id + '&name=' + name,
			});
		} else if (position == 'left') {
			e.detail.instance.close();
			wx.navigateTo({
				url: '/pages/createEnterprise/createEnterprise?id=' + id + '&name=' + name,
			});
		} else if (position == 'right') {
			wx.showModal({
				title: '提示',
				content: '您确认要删除吗？',
				success: res => {
					e.detail.instance.close();
					if (res.confirm) {
						app.fn.ajax('POST', {
							uid: app.globalData.userInfo.id,
							company_id: id,
						}, app.api.center.delEnterprise, res => {
							this.data.list.splice(index, 1);
							this.setData({ list: this.data.list });
						});
					}
				},
			});
		}
	},
	onShow() {
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
		}, app.api.center.myBusinessList, res => {
			this.setData({ list: res.data });
		});
	},
});