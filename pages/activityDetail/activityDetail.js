// pages/placeDetail/placeDetail.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({
	data: {
		info: {},
		id: '',
	},
	onLoad(options) {
		this.setData(options);
		this.getdetail();
	},
	getdetail() {
		app.fn.ajax('POST', {
			active_id: this.data.id
		}, app.api.index.activityDetail, res => {
			WxParse.wxParse('content', 'html', res.data.content, this, 5);
			this.setData({ info: res.data });
		});
	},
	onShareAppMessage(e) {
		return {
			title: '活动详情',
			path: '/pages/activityDetail/activityDetail?id=' + this.data.id + '&is_share=1',
		};
	},
});