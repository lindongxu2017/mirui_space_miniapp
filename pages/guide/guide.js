const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
Page({
    onLoad(options) {
		app.fn.ajax('POST', {}, app.api.index.guide, res => {
			WxParse.wxParse('content', 'html', res.data.content, this, 3);
		});
    },
    onShareAppMessage() {
        return {
            title: '社区指南',
            path: '/pages/guide/guide'
        }
    },
});