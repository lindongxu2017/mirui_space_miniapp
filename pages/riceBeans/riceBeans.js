var app = getApp();
Page({
	data: {
		mibean: 0,
		page: 1,
		more: true,
		list: [],
        noData: false
	},
	onLoad() {
		this.setData({ mibean: app.globalData.userInfo.mibean_num });
		this.getList(false);
	},
	onReachBottom() {
		this.getList(true);
	},
	getList(isReachBottom) {
		var list = this.data.list;
		var more = this.data.more;
		var page = this.data.page;
		if (!more) return;
		if (!isReachBottom) page = 1;
		app.fn.ajax('POST', {
			uid: app.globalData.userInfo.id,
			page: page,
			limit: 10,
		}, app.api.center.riceBeans, res => {
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
            if (this.data.list.length == 0) {
                this.setData({
                    noData: true
                })
            }
		});
	},
});