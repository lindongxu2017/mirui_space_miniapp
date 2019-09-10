const app = getApp();
Page({
	data: {
		roomList: [],
	},
	onLoad(options) {
		this.setData(options);
		wx.setNavigationBarTitle({ title: options.title + '照片展示' });
		this.getlist();
	},
	onShareAppMessage(e) {
		return {
			title: this.data.title + '照片展示',
			path: `/pages/roomDisplay/roomDisplay?id=${this.data.id}&title=${this.data.title}&is_share=1`,
		};
	},
	getlist() {
		app.fn.ajax('GET', {
			page: Math.ceil(this.data.roomList.length / 10) + 1,
			limit: 10,
			album_type_id: this.data.id,
		}, '/index/houseImgList', res => {
			this.setData({ roomList: this.data.roomList.concat(res.data) });
		});
	},
	onReachBottom() {
		this.getlist();
	},
});