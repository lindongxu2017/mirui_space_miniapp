var app = getApp();
Page({
	data: {
		list: [],
		page: 1,
		more: true,
		type: 1,
		id: '',
	},
	onChange(e) {
		this.setData({ type: e.detail.index == 0 ? 1 : 2 });
		this.getList(false);
	},
	onLoad(options) {
		wx.setNavigationBarTitle({
			title: options.name,
		});
		this.setData({ id: options.id });
		this.getList(false);
	},
	onReachBottom() {
		this.getList(true);
	},
	getList(isReachBottom) {
		var list = this.data.list;
		var more = this.data.more;
		var page = this.data.page;
		if (!isReachBottom) {
			page = 1;
			more = true;
		}
		if (!more) return;
		var api = app.api.center.myStaff;
		if (this.data.type == 2) api = app.api.center.waitStaff;
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
			company_id: this.data.id,
			page: page,
			limit: 10,
		}, api, res => {
			if (page == 1) list = [];
			if (res.data.length > 0) {
				for (var i = 0; i < res.data.length; i++) {
					list.push(res.data[i]);
				};
			}
			if (list.length >= res.count) {
				more = false;
			} else {
				page++;
			}
			this.setData({
				page: page,
				more: more,
				list: list,
			});
		});
	},
	del(e) {
		var id = e.currentTarget.dataset.id;
		var index = e.currentTarget.dataset.index;
		wx.showModal({
			title: '提示',
			content: '您确认要删除吗？',
			success: res => {
				if (res.confirm) {
					app.fn.ajax('POST', {
						uid: id,
					}, app.api.center.delStaff, res => {
						this.data.list.splice(index, 1);
						this.setData({ list: this.data.list });
					});
				}
			},
		});
	},
	refuse(e) {
		app.fn.ajax('POST', {
			apply_id: e.currentTarget.dataset.applyId,
			uid: e.currentTarget.dataset.uid,
			company_id: this.data.id,
		}, app.api.center.refuseStaff, res => {
			this.data.list.splice(e.currentTarget.dataset.index, 1);
			this.setData({ list: this.data.list });
		});
	},
	adopt(e) {
		app.fn.ajax('POST', {
			apply_id: e.currentTarget.dataset.applyId,
			uid: e.currentTarget.dataset.uid,
			company_id: this.data.id,
		}, app.api.center.adoptStaff, res => {
			this.data.list.splice(e.currentTarget.dataset.index, 1);
			this.setData({ list: this.data.list });
		});
	},
});