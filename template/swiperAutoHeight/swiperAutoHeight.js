Component({
	properties: {
		list: {
			type: Array,
			value: [],
			observer(newVal, oldVal, changePath) {
				if (newVal.length > 0) this.getImageHeight(newVal);
			},
		},
		width: {
			type: Number,
			value: 750,
		},
		str: {
			type: String,
			value: '',
		},
		nav: {
			type: Boolean,
			value: false,
		},
		navUrl: {
			type: String,
			value: '',
		},
		navSplicing: {
			type: Boolean,
			value: false,
		},
		navStr: {
			type: String,
			value: '',
		},
		circular: {
			type: Boolean,
			value: false,
		},
		indicatorDots: {
			type: Boolean,
			value: false,
		},
		indicatorColor: {
			type: String,
			value: '#fff',
		},
	},
	data: {
		swiperImageHeight: [],
		swiperCurrent: 0,
	},
	methods: {
		getImageHeight(arr) {
			var str = this.data.str;
			arr.map((item, index) => {
				wx.getImageInfo({
					src: str ? item[str] : item,
					success: res => {
						this.data.swiperImageHeight[index] = res.height / res.width * this.data.width;
						this.setData({ swiperImageHeight: this.data.swiperImageHeight });
					},
				});
			});
		},
		swiperChange(e) {
			this.setData({ swiperCurrent: e.detail.current });
		},
		navigator(e) {
			var url = this.data.navUrl;
			if (this.data.navSplicing) {
				if (url.indexOf('?') != -1) {
					url += '&id=' + e.currentTarget.dataset.id;
				} else {
					url += '?id=' + e.currentTarget.dataset.id;
				}
			}
			wx.navigateTo({ url: url });
		},
		preview(e) {
			var str = this.data.str;
			var list = this.data.list;
			var urls = [];
			if (str) {
				list.map((item, index) => {
					urls[index] = item[str];
				});
			} else {
				urls = list;
			}
			wx.previewImage({
				current: urls[e.currentTarget.dataset.index],
				urls: urls,
			});
		},
	}
});