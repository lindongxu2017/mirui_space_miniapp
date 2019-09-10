Component({
	properties: {
		pid: { type: String },
		ptitle: { type: String },
	},
	ready() {
		this.setData({ route: getCurrentPages()[0].route });
	},
	methods: {
		back() {
			if (this.data.route == 'pages/roomDisplay/roomDisplay') {
				wx.redirectTo({ url: '/pages/enterpriseDisplay/enterpriseDisplay?is_share=1' });
			} else if (this.data.route == 'pages/album/album') {
				console.log(this.data.pid, this.data.ptitle, 222);
				wx.redirectTo({ url: `/pages/roomDisplay/roomDisplay?id=${this.data.pid}&title=${this.data.ptitle}&is_share=1` });
			}
		},
		toIndex() {
			wx.reLaunch({
				url: '/pages/index/index',
			});
		},
	},
});