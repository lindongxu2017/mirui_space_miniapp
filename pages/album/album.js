const app = getApp();
Page({
	data: {
		album: [],
	},
	onLoad(options) {
		this.setData(options);
		wx.setNavigationBarTitle({ title: options.title + '照片展示' });
		this.getlist();
	},
	preview(e) {
		var arr = [];
		this.data.album.map((item, index) => {
			arr[index] = item.img_url
		});
		wx.previewImage({
			current: this.data.album[e.currentTarget.dataset.index].img_url,
			urls: arr,
		});
	},
	onShareAppMessage(e) {
		return {
			title: this.data.title + '照片展示',
			path: `/pages/album/album?id=${this.data.id}&title=${this.data.title}&pid=${this.data.pid}&ptitle=${this.data.ptitle}&is_share=1`,
		};
	},
	getlist() {
		app.fn.ajax('GET', {
			page: Math.ceil(this.data.album.length / 10) + 1,
			limit: 10,
			album_type_id: this.data.id
		}, '/index/imgList', res => {
			this.setData({ album: this.data.album.concat(res.data) });
		});
	},
	onReachBottom() {
		this.getlist();
	},
});