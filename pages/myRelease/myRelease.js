// pages/myRelease/myRelease.js
const app = getApp();
import create from '../../utils/create.js';
import store from '../../store.js';
create(store, {

    data: {
        myTrendsList: [],
        loading: false,
        showBtn: true,
        noData: false
    },

    onLoad: function (options) {
        this.store.data.myTrendsList = []
        this.update()
        this.getlist()
    },

    onShow: function () {

    },

    getlist () {
        if (this.data.loading) return;
        this.data.loading = true;
        app.fn.ajax('POST', {
            uid: app.globalData.userInfo.id,
            page: Math.ceil(this.data.myTrendsList.length / 10 ) + 1,
            limit: 10
        }, app.api.center.myPublish, res => {
			this.data.myTrendsList = this.data.myTrendsList.concat(res.data);
			var data = { myTrendsList: this.data.myTrendsList };
			if (this.data.myTrendsList.length == 0) data.noData = true;
			this.setData(data);
			if (this.data.myTrendsList.length < res.count) this.data.loading = false;
			this.store.data.myTrendsList = this.data.myTrendsList;
			this.update()
        })
    },

    onReachBottom: function () {
        this.getlist()
    },

    release(e) {
        this.setData({
            showBtn: e.detail
        })
    }
})