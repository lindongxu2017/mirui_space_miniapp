var app = getApp();
Page({
	data: {
		url: '',
	},
	onLoad() {
		app.fn.ajax('POST', {}, app.api.center.poster, res => {
			this.setData({
				url: res.data.img_url,
			});
		});
	},
	onShareAppMessage() {
		return {
			title: '米瑞空间',
			path: '/pages/index/index?id=' + app.globalData.userInfo.id + '&is_share=1',
		};
	},
});