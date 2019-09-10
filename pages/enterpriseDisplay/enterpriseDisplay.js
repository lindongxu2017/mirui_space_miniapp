const app = getApp();
Page({
	data: {
		enterpriseArr: [],
	},
	onLoad(options) {
		this.setData(options);
		this.getlist();
	},
	onShareAppMessage(e) {
		return {
			title: '米瑞项目照片展示',
			path: '/pages/enterpriseDisplay/enterpriseDisplay?is_share=1',
		};
	},
	getlist() {
		app.fn.ajax('GET', {
			page: Math.ceil(this.data.enterpriseArr.length / 10) + 1,
			limit: 10,
		}, '/index/buildingImgList', res => {
			this.setData({ enterpriseArr: this.data.enterpriseArr.concat(res.data) });
		});
	},
	onReachBottom() {
		this.getlist();
	},
});